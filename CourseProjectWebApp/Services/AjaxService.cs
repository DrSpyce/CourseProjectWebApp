﻿using CourseProjectWebApp.Data;
using CourseProjectWebApp.Hubs;
using CourseProjectWebApp.Interfaces;
using CourseProjectWebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using static CourseProjectWebApp.Interfaces.IAjaxService;
using System.Text.Json.Serialization;
using System.Text.Json;
using static System.Net.Mime.MediaTypeNames;
using static CourseProjectWebApp.Interfaces.IAjaxService.SearchResult;

namespace CourseProjectWebApp.Services
{
    public class AjaxService : IAjaxService
    {
        private readonly CourseProjectWebAppContext _context;
        private readonly IHubContext<CommentHub> _hubContext;

        public AjaxService(CourseProjectWebAppContext context, IHubContext<CommentHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        private ApplicationUser? AppUser;

        public async Task<bool> CheckAndCreateComment(int? itemId, string? userName, string? text)
        {
            if (await FillAndCheck(itemId, userName) && text is not null)
            {
                await CreateComment((int)itemId!, AppUser!, text);
                return true;
            }
            return false;
        }

        public async Task<bool> IsLiked(int? itemId, string userName)
        {
            if (await FillAndCheck(itemId, userName))
            {
                var like = await _context.ItemUserLike.Where(l => l.itemId == itemId).Where(l => l.ApplicationUserId == AppUser!.Id).FirstOrDefaultAsync();
                if (like != null)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<bool> SetLike(int? itemId, string userName)
        {
            if (await FillAndCheck(itemId, userName))
            {
                var like = await _context.ItemUserLike.Where(l => l.itemId == itemId).Where(l => l.ApplicationUserId == AppUser!.Id).FirstOrDefaultAsync();
                if (like == null)
                {
                    await CreateLike((int)itemId!);
                    return true;
                }
            }
            return false;
        }

        public JsonResult SearchItem(string str, int numberOfResults = 5)
        {
            var result = SearchItems(str, numberOfResults);
            if (result.Count() < numberOfResults)
            {
                SearchCollections(str, numberOfResults, result);
            }
            return new JsonResult(result);
        }

        private async Task<bool> FillAndCheck(int? itemId, string? userName)
        {
            if (userName is not null && itemId is not null)
            {
                var item = await _context.Item.FirstOrDefaultAsync(i => i.Id == itemId);
                AppUser = await _context.ApplicationUser!.FirstOrDefaultAsync(a => a.UserName == userName);
                if (item is not null && AppUser is not null) 
                {
                    return true;
                } 
            }
            return false;
        }

        private async Task CreateComment(int itemId, ApplicationUser user, string text)
        {
            var date = DateTime.UtcNow;
            var comment = new Comment { ItemId = itemId, ApplicationUserId = user.Id, Text = text, Created = date };
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            await SendComment(itemId, comment, user.UserName);
        }

        private async Task SendComment(int itemId, Comment comment, string userName)
        {
            List<string> data = new() { comment.Text, userName, Convert.ToString(comment.Created) };
            await _hubContext.Clients.Group($"group{itemId}").SendAsync("Receive", data);
        }

        private async Task CreateLike(int itemId)
        {
            var like = new ItemUserLike() 
            { 
                ApplicationUserId = AppUser!.Id, 
                itemId = itemId 
            };
            await _context.ItemUserLike.AddAsync(like);
            await _context.SaveChangesAsync();
            await IncrementLikesCounter(itemId);
        }

        private async Task IncrementLikesCounter(int itemId)
        {
            await _hubContext.Clients.Group($"group{itemId}").SendAsync("increment");
        }

        private List<SearchResult> SearchItems(string str, int numberOfResults)
        {
            var res = _context.Item
               .Include(i => i.Collection)
               .Include(i => i.Comments)
               .Include(i => i.ItemsAdditionalStrings)
               .Include(i => i.Tags)
               .Where(i => i.Title.Contains(str) || i.ItemsAdditionalStrings.Any(ia => ia.Data.Contains(str)) || i.Comments.Any(c => c.Text.Contains(str)) || i.Tags.Any(t => t.Name.Contains(str)))
               .Take(numberOfResults)
               .Select(i => new
               {
                   Title = i.Title,
                   Id = i.Id,
                   CollectionId = i.CollectionId,
                   type = "item"
               });
            List<SearchResult> searchResult = new();
            foreach (var item in res)
            {
                searchResult.Add(new SearchResult { Title = item.Title, CollectionId = item.CollectionId, Id = item.Id, TypeOfResult = TypeOfResults.Item });
            }
            return searchResult;
        }

        private List<SearchResult> SearchCollections(string str, int numberOfResults, List<SearchResult> result)
        {
            var col = _context.Collection.Include(c => c.AdditionalStrings)
                    .Where(c => c.Description.Contains(str) || c.Title.Contains(str) || c.AdditionalStrings.Any(a => a.Name.Contains(str)))
                    .Take(numberOfResults - result.Count())
                    .Select(i => new
                    {
                        Title = i.Title,
                        Id = i.Id,
                        type = "Collection"
                    });
            foreach (var item in col)
            {
                result.Add(new SearchResult { Title = item.Title, Id = item.Id, TypeOfResult = TypeOfResults.Collection});
            }
            return result;
        }
    }
}
