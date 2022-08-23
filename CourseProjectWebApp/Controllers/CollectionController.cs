using CourseProjectWebApp.Data;
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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly CourseProjectWebAppContext _context;
        private readonly IAuthorizationService _authorizationService;

        [TempData]
        public string Message { get; set; }

        private CollectionItemsViewModel ColItems = new();

        private CollectionAdditionalStringsViewModel CollAddStr = new();

        private Collection Col { get; set; }

        public CollectionController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager, CourseProjectWebAppContext context, IAuthorizationService authorizationService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _authorizationService = authorizationService;
        }

        public async Task<ActionResult> IndexAsync()
        {
            var result = await _context.Collection.ToListAsync();
            return View(result);
        }

        [Route("Collection/Mine")]
        [Authorize]
        public async Task<ActionResult> Mine()
        {
            var currentUser = await _userManager.FindByNameAsync(User.Identity.Name);
            var result = _context.Collection.Include(c => c.ApplicationUser).Where(c => c.ApplicationUser == currentUser).ToList();
            ViewData["Message"] = Message;
            return View(result);
        }

        [Route("Collection/{id:int}")]
        public async Task<ActionResult> DetailsAsync(int id)
        {
            ColItems.Coll = await _context.Collection.FindAsync(id);
            if (ColItems.Coll == null)
            {
                return NotFound();
            }
            ColItems.Items = _context.Item.Where(i => i.Collection == ColItems.Coll).ToList();
            ViewBag.returnUrl = Request.Headers["Referer"].ToString();
            AttachItemAddithionalStrings();
            return View(ColItems);
        }

        [Authorize]
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<ActionResult> CreateAsync(CollectionAdditionalStringsViewModel collectionStrings)
        {
            try
            {
                if (!ModelState.IsValid) { return View(); }
                collectionStrings.Coll.ApplicationUser = await _userManager.FindByNameAsync(User.Identity.Name);
                await _context.Collection.AddAsync(collectionStrings.Coll);
                foreach (var addStrs in collectionStrings.AddStr)
                {
                    addStrs.Collection = collectionStrings.Coll;
                    await _context.AdditionalStrings.AddAsync(addStrs);
                }
                _context.SaveChanges();
                Message = $"{collectionStrings.Coll.Title} created";
                return RedirectToAction(nameof(Mine));
            }
            catch (Exception e)
            {
                return View();
            }
        }

        [Route("/Collection/Edit/{id}")]
        [Authorize]
        public async Task<ActionResult> EditAsync(int? id)
        {
            CollAddStr.Coll = await _context.Collection.FirstOrDefaultAsync(c => c.Id == id);
            if (id == null || CollAddStr.Coll == null)
            {
                return NotFound();
            }
            if (!IsAllowed(CollAddStr.Coll, CollectionOperations.Update).Result)
            {
                return Forbid();
            }
            CollAddStr.AddStr = await _context.AdditionalStrings.Where(a => a.Collection == CollAddStr.Coll).ToListAsync();
            return View(CollAddStr);
        }

        [Route("Collection/Edit/{id}")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public async Task<ActionResult> EditAsync(int id, CollectionAdditionalStringsViewModel collectionStrings)
        {
            if (id != collectionStrings.Coll.Id)
            {
                return NotFound();
            }
            var collection = _context.Collection.AsNoTracking().FirstOrDefault(c => c.Id == id);
            if (!IsAllowed(collection, CollectionOperations.Update).Result)
            {
                return Forbid();
            }
            if (ModelState.IsValid)
            {
                collectionStrings.Coll.ApplicationUserId = collection.ApplicationUserId;
                _context.Update(collectionStrings.Coll);
                foreach (var addStr in collectionStrings.AddStr)
                {
                    addStr.Collection = collectionStrings.Coll;
                    _context.Update(addStr);
                }
                await _context.SaveChangesAsync();
                Message = $"{collectionStrings.Coll.Title} edited";
                return RedirectToAction(nameof(Mine));
            }
            return View(collectionStrings);
        }

        private bool CollectionExists(int id)
        {
            return (_context.Collection?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var coll = await _context.Collection.FindAsync(id);
            var result = IsAllowed(coll, CollectionOperations.Delete);
            if (!result.Result)
            {
                return Forbid();
            }
            string collTitle = coll.Title;
            if (coll != null)
            {
                await DeleteConnected(coll);
                await DeleteItems(coll);
                _context.Collection.Remove(coll);
                Message = $"{collTitle} deleted";
            }
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Mine));
        }

        private async Task DeleteConnected(Collection coll)
        {
            var addStrs = _context.AdditionalStrings.Where(a => a.Collection == coll).ToList();
            foreach (var item in addStrs)
            {
                var ItemAddStr = _context.ItemsAdditionalStrings.Where(i => i.AdditionalStrings == item).ToList();
                _context.ItemsAdditionalStrings.RemoveRange(ItemAddStr);
            }
            _context.AdditionalStrings.RemoveRange(addStrs);
            await _context.SaveChangesAsync();
        }

        private async Task DeleteItems(Collection coll)
        {
            var items = _context.Item.Where(i => i.Collection == coll).ToList();
            _context.Item.RemoveRange(items);
            await _context.SaveChangesAsync();
        }

        private async Task<bool> IsAllowed(Collection coll, OperationAuthorizationRequirement task)
        {
            var isAuthorized = await _authorizationService.AuthorizeAsync(User, coll, task);
            return isAuthorized.Succeeded;
        }

        private void AttachItemAddithionalStrings()
        {
            var addStrs = _context.AdditionalStrings.Where(ad => ad.Collection == ColItems.Coll).ToList();
            foreach (var addStr in addStrs)
            {
                if (addStr.TypeOfData == AdditionalStrings.TypesOfData.date || addStr.TypeOfData == AdditionalStrings.TypesOfData.title)
                {
                    ColItems.AddStr.Add(addStr);
                    foreach (var item in ColItems.Items)
                    {
                        _context.ItemsAdditionalStrings.Where(i => i.Item == item).Where((i => i.AdditionalStrings == addStr)).FirstOrDefault();
                    }
                }
            }
        }
    }
}
