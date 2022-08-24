using CourseProjectWebApp.Data;
using CourseProjectWebApp.Hubs;
using CourseProjectWebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

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
            if(await FillAndCheck((int)itemId, userName))
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
    }
}
