using CourseProjectWebApp.Data;
using CourseProjectWebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace CourseProjectWebApp.Services
{
    public class CommentService
    {
        private readonly CourseProjectWebAppContext _context;

        public CommentService(CourseProjectWebAppContext context)
        {
            _context = context;
        }

        public List<Comment> GetItemComments(int itemId)
        {
            return _context.Comments.Include(c => c.ApplicationUser).Where(c => c.ItemId == itemId).ToList();
        }

    }
}
