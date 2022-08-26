using CourseProjectWebApp.Data;
using CourseProjectWebApp.Hubs;
using CourseProjectWebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;
using Korzh.EasyQuery.Linq;
using System.Text.Json;

namespace CourseProjectWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AjaxController : ControllerBase
    {
        private readonly IHubContext<CommentHub> _hubContext;
        private readonly CourseProjectWebAppContext _context;

        public AjaxController(CourseProjectWebAppContext context, IHubContext<CommentHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        ApplicationUser? AppUser;

        [HttpGet]
        [Authorize]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> CreateComment(int? itemId, string? userName, string? text)
        {
            if(itemId == null || text == null || userName == null)
            {
                return NotFound();
            }
            if(!await FillAndCheck((int)itemId, userName))
            {
                return NotFound();
            }
            await AddAndSendComment((int)itemId, AppUser, text);
            return Ok();
        }

        private async Task<bool> FillAndCheck(int itemId, string userName)
        {
            var item = await _context.Item.FirstOrDefaultAsync(i => i.Id == itemId);
            AppUser = await _context.ApplicationUser.FirstOrDefaultAsync(a => a.UserName == userName);
            if (item == null || AppUser == null)
            {
                return false;
            }
            return true;
        }

        private async Task AddAndSendComment(int itemId, ApplicationUser user, string text)
        {
            var date = DateTime.UtcNow;
            var comment = new Comment { ItemId = itemId, ApplicationUserId = user.Id, Text = text, Created = date };
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            await SendComment(itemId, comment, user.UserName);
        }

        private async Task SendComment(int itemId, Comment comment, string userName)
        {
            Convert.ToString(comment.Created);
            List<string> data = new() { comment.Text, userName, Convert.ToString(comment.Created) };
            await _hubContext.Clients.Group($"group{itemId}").SendAsync("Receive", data);
        }

        [HttpGet]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [Route("IsLiked")]
        public async Task<IActionResult> IsLiked(int? itemId, string userName)
        {
            if (itemId == null || userName == null)
            {
                return NotFound();
            }
            if (!await FillAndCheck((int)itemId, userName))
            {
                return NotFound();
            }
            var like = await _context.ItemUserLike.Where(l => l.itemId == itemId).Where(l=> l.ApplicationUserId == AppUser.Id).FirstOrDefaultAsync();
            if(like == null)
            {
                return Ok("false");
            }
            return Ok("true");
        }

        [HttpGet]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [Route("SetLike")]
        public async Task<IActionResult> SetLike(int? itemId, string userName)
        {
            if (itemId == null || userName == null)
            {
                return NotFound();
            }
            if (!await FillAndCheck((int)itemId, userName))
            {
                return NotFound();
            }
            var like = await _context.ItemUserLike.Where(l => l.itemId == itemId).Where(l => l.ApplicationUserId == AppUser.Id).FirstOrDefaultAsync();
            if (like == null)
            {
                await CreateLike((int)itemId);
                return Ok("liked");
            }
            return Ok("AlreadyLiked");
        }

        private async Task CreateLike(int itemId)
        {
            var like = new ItemUserLike() { ApplicationUserId = AppUser.Id ,itemId = itemId };
            await _context.ItemUserLike.AddAsync(like);
            await _context.SaveChangesAsync();
            await IncrementLikesCounter(itemId);
        }

        private async Task IncrementLikesCounter(int itemId)
        {
            await _hubContext.Clients.Group($"group{itemId}").SendAsync("increment");
        }

        [HttpGet]
        [IgnoreAntiforgeryToken]
        [Route("SearchItem")]
        public async Task<JsonResult> SearchItem(string str)
        {
            FullTextSearchOptions opts = new();
            opts.IsDescendingOrder = false;
            var res = _context.Collection.FullTextSearchQuery(str, opts);
            return new JsonResult(res);
        }
    }
}
