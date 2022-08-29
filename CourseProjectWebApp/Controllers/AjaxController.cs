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
using System.Text.Json.Serialization;
using System.Linq;
using CourseProjectWebApp.Services;
using static CourseProjectWebApp.Interfaces.IAjaxService;
using CourseProjectWebApp.Interfaces;

namespace CourseProjectWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AjaxController : ControllerBase
    {
        private readonly IAjaxService _service;

        public AjaxController(IAjaxService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> CreateComment(int? itemId, string userName, string text)
        {
            if (await _service.CheckAndCreateComment(itemId, userName, text))
            {
                return Ok("Created and sent");
            }
            return NotFound();
        }

        [HttpGet]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [Route("IsLiked")]
        public async Task<bool> IsLiked(int? itemId, string userName)
        {
            return await _service.IsLiked(itemId, userName);
        }

        [HttpGet]
        [Authorize]
        [IgnoreAntiforgeryToken]
        [Route("SetLike")]
        public async Task<bool> SetLike(int? itemId, string userName)
        {
            return await _service.SetLike(itemId, userName);
        }


        [HttpGet]
        [IgnoreAntiforgeryToken]
        [Route("SearchItem")]
        public JsonResult SearchItem(string str)
        {
            var res = _service.SearchItem(str);
            return res;
        }
    }
}
