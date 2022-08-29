using CourseProjectWebApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace CourseProjectWebApp.Interfaces
{
    public interface IAjaxService
    {
        public Task<bool> CheckAndCreateComment(int? itemId, string? userName, string? text);

        public Task<bool> IsLiked(int? itemId, string userName);

        public Task<bool> SetLike(int? itemId, string userName);

        public JsonResult SearchItem(string str, int numberOfResults = 5);

        public class SearchResult
        {
            public string Title { get; set; }

            public int Id { get; set; }

            public int? CollectionId { get; set; }

            public TypeOfResults TypeOfResult { get; set; }
            
            public enum TypeOfResults
            {
                Collection,
                Item
            }
        }
    }
}
