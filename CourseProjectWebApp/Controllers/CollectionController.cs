
using CourseProjectWebApp.Data;
using CourseProjectWebApp.Interfaces;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CourseProjectWebApp.Authorization.ProjectConstans;

namespace CourseProjectWebApp.Controllers
{
    public class CollectionController : Controller
    {
        private readonly ICollectionService _collectionService;
        private readonly CourseProjectWebAppContext _context;

        public CollectionController(CourseProjectWebAppContext context, ICollectionService collectionService)
        {
            _context = context;
            _collectionService = collectionService;
        }

        [TempData]
        public string? Message { get; set; }

        public async Task<ActionResult> IndexAsync()
        {
            var result = await _context.Collection.ToListAsync();
            return View(result);
        }

        [Route("Collection/Mine")]
        [Authorize]
        public async Task<ActionResult> Mine()
        {
            if (User.Identity!.Name != null)
            {
                var result = await _collectionService.Mine(User.Identity!.Name!);
                ViewData["Message"] = Message;
                return View(result);
            }
            return NotFound();
        }

        [Route("Collection/{id:int}")]
        public async Task<ActionResult> DetailsAsync(int id, string sortOrder, string addStrSort)
        {
            ViewData["IdSortParm"] = String.IsNullOrEmpty(sortOrder) ? "Id desc" : "";
            ViewData["TitleSortParm"] = sortOrder == "Title" ? "Title desc" : "Title";
            var result = await _collectionService.DetailsAsync(id, sortOrder);
            if (result == null)
            {
                return NotFound();
            }
            foreach (var addStr in result.AddStr)
            {
                ViewData[addStr.Name!] = addStrSort == addStr.Name ? addStr.Name + "_desc" : addStr.Name;
            }
            if (!string.IsNullOrEmpty(addStrSort))
            {
                result.Items = _collectionService.SortNested(result.Items, addStrSort);
            }
            return View(result);
        }

        [Route("Collection/Tag/{id:int}")]
        public async Task<ActionResult> TagItems(int id)
        {
            var tag = await _context.Tag.Include(t => t.Items).ThenInclude(i => i.Collection).Where(t => t.Id == id).FirstAsync();
            if (tag == null)
            {
                return NotFound();
            }
            return View(tag);
        }

        [Authorize]
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<ActionResult> CreateAsync(Collection coll, IFormFile uploadedFile)
        {
            var check = await _context.Collection.FirstOrDefaultAsync(c => c.Title == coll.Title);
            if (check is not null)
            {
                ModelState.AddModelError("Title", "Collection with that name already exist");
            }
            if (!ModelState.IsValid)
            {
                return View(coll);
            }
            Message = await _collectionService.CreateCollection(coll, User, uploadedFile);
            return RedirectToAction(nameof(Mine));
        }

        [Route("/Collection/Edit/{id:int}")]
        [Authorize]
        public async Task<ActionResult> EditAsync(int? id)
        {
            var result = await _context.Collection.Include(c => c.AdditionalStrings).FirstOrDefaultAsync(c => c.Id == id);
            if (id == null || result == null)
            {
                return NotFound();
            }
            if (!await _collectionService.IsAllowed(result, CollectionOperations.Update, User))
            {
                return Forbid();
            }
            return View(result);
        }

        [Route("Collection/Edit/{id:int}")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<ActionResult> EditAsync(int id, Collection coll)
        {
            if (id != coll.Id)
            {
                return NotFound();
            }
            if (!await _collectionService.IsAllowed(id, CollectionOperations.Delete, User))
            {
                return Forbid();
            }
            if (ModelState.IsValid)
            {
                await _collectionService.EditAsync(id, coll);
                Message = $"{coll.Title} edited";
                return RedirectToAction(nameof(Mine));
            }
            return View(coll);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            if (!await _collectionService.IsAllowed(id, CollectionOperations.Delete, User))
            {
                return Forbid();
            }
            string collTitle = await _collectionService.DeleteAsync(id);
            Message = $"{collTitle} deleted";
            return RedirectToAction(nameof(Mine));
        }
    }
}
