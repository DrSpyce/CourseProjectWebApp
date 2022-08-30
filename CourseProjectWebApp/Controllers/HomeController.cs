using CourseProjectWebApp.Data;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace CourseProjectWebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly CourseProjectWebAppContext _context;

        public HomeController(ILogger<HomeController> logger, CourseProjectWebAppContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            return View(FillData());
        }

        private IndexViewModel FillData()
        {
            IndexViewModel ItemsCollections = new();

            ItemsCollections.Items = _context.Item.OrderByDescending(i => i.Id).Take(5).Select(i => new IndexItemView
            {
                Id = i.Id,
                Title = i.Title,
                CollectionTitle = i.Collection!.Title,
                CollectionId = i.Collection.Id,
                UserName = i.Collection.ApplicationUser!.UserName
            }).ToList();

            ItemsCollections.Collections = _context.Collection.OrderByDescending(c => c.Items.Count).Take(5).Select(c => new CollectionIndexView
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                UserName = c.ApplicationUser!.UserName,
                CountItems = c.Items.Count
            }).ToList();

            ItemsCollections.Tags = _context.Tag.Select(t => new TagsIndexView
            {
                Id = t.Id,
                Name = t.Name,
                CountItems = t.Items.Count
            }).ToList();

            return ItemsCollections;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}