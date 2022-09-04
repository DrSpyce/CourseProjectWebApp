using CourseProjectWebApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace CourseProjectWebApp.Interfaces
{
    public interface IAjaxService
    {
        public Task<bool> CheckAndCreateComment(int? itemId, string? userName, string? text);

        public Task<bool> IsLiked(int? itemId, string userName);

        public Task<bool> SetLike(int? itemId, string userName);

        public Task<bool> UnsetLike(int? itemId, string userName);

        public JsonResult SearchItem(string str, int numberOfResults = 5);

        public Task<List<string>> GetTag(string term);
    }
}
