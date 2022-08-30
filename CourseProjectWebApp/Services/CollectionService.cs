using CourseProjectWebApp.Data;
using CourseProjectWebApp.Interfaces;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static CourseProjectWebApp.Authorization.ProjectConstans;

namespace CourseProjectWebApp.Services
{
    public class CollectionService :ICollectionService
    {
        private readonly CourseProjectWebAppContext _context;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<ApplicationUser> _userManager;

        public CollectionService(UserManager<ApplicationUser> userManager, CourseProjectWebAppContext context, IAuthorizationService authorizationService)
        {
            _userManager = userManager;
            _context = context;
            _authorizationService = authorizationService;
        }

        public async Task<List<Collection>?> Mine(string userName)
        {
            var currentUser = await _context.ApplicationUser!.Where(u => u.UserName == userName).FirstOrDefaultAsync();
            if(currentUser != null)
            {
                var result = _context.Collection.Include(c => c.ApplicationUser).Where(c => c.ApplicationUser == currentUser).ToList();
                return result;
            }
            return null;
        }

        public async Task<CollectionItemsViewModel?> DetailsAsync(int id)
        {
            CollectionItemsViewModel CollItems = new();
            CollItems.Coll = await _context.Collection.FirstAsync(c => c.Id == id);
            CollItems.Items = _context.Item.Where(i => i.Collection == CollItems.Coll).ToList();
            return AttachItemAddithionalStrings(CollItems);
        }

        public async Task EditAsync(int id, Collection coll)
        {
            var collection = _context.Collection.AsNoTracking().FirstOrDefault(c => c.Id == id);
            coll.ApplicationUserId = collection!.ApplicationUserId;
            _context.Update(coll);
            await _context.SaveChangesAsync();
        } 

        public async Task<string> DeleteAsync(int id)
        {
            var coll = await _context.Collection.Include(c => c.AdditionalStrings).FirstOrDefaultAsync(c => c.Id == id);
            string collTitle = coll!.Title;
            if (coll != null)
            {
                DeleteConnected(coll);
                _context.Collection.Remove(coll);
                await _context.SaveChangesAsync();
            }
            return collTitle;
        }

        public async Task<string> CreateCollection(Collection coll, ClaimsPrincipal user)
        {
            coll.ApplicationUser = await _userManager.FindByNameAsync(user!.Identity!.Name);
            await _context.Collection.AddAsync(coll);
            _context.SaveChanges();
            return $"{coll.Title} created";
        }

        private CollectionItemsViewModel AttachItemAddithionalStrings(CollectionItemsViewModel CollItems)
        {
            var addStrs = _context.AdditionalStrings.Where(ad => ad.Collection == CollItems.Coll && ad.Display == true).ToList();
            foreach (var addStr in addStrs)
            {
                if (addStr.TypeOfData == AdditionalStrings.TypesOfData.date || addStr.TypeOfData == AdditionalStrings.TypesOfData.title)
                {
                    CollItems.AddStr.Add(addStr);
                    foreach (var item in CollItems.Items)
                    {
                        _context.ItemsAdditionalStrings.Where(i => i.Item == item).Where((i => i.AdditionalStrings == addStr)).FirstOrDefault();
                    }
                }
            }
            return CollItems;
        }

        private void DeleteConnected(Collection coll)
        {
            foreach (var addStrs in coll.AdditionalStrings)
            {
                var ItemAddStr = _context.ItemsAdditionalStrings.Where(i => i.AdditionalStrings == addStrs).ToList();
                _context.ItemsAdditionalStrings.RemoveRange(ItemAddStr);
            }
        }

        public async Task<bool> IsAllowed(int id, OperationAuthorizationRequirement task, ClaimsPrincipal user)
        {
            var coll = _context.Collection.AsNoTracking().First(c=> c.Id == id);
            var isAuthorized = await _authorizationService.AuthorizeAsync(user, coll, task);
            return isAuthorized.Succeeded;
        }

        public async Task<bool> IsAllowed(Collection coll, OperationAuthorizationRequirement task, ClaimsPrincipal user)
        {
            var isAuthorized = await _authorizationService.AuthorizeAsync(user, coll, task);
            return isAuthorized.Succeeded;
        }
    }
}
