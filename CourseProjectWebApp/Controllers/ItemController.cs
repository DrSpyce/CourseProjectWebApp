using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CourseProjectWebApp.Data;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Models.ViewModels;
using static CourseProjectWebApp.Authorization.ProjectConstans;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using CourseProjectWebApp.Hubs;

namespace CourseProjectWebApp.Controllers
{
    public class ItemController : Controller
    {
        private readonly CourseProjectWebAppContext _context;
        private readonly IAuthorizationService _authorizationService;
        private List<Tag> Tags = new();
        

        public ItemController(CourseProjectWebAppContext context, IAuthorizationService AuthorizationService, IHubContext<CommentHub> hubContext)
        {
            _context = context;
            _authorizationService = AuthorizationService;
        }

        ItemItemAdditionalStringsViewModel? ItemData;

        // GET: Items/Details/5
        [Route("Collection/{id:int}/Item/{itemId:int}")]
        public async Task<IActionResult> Details(int? id, int? itemId)
        {
            if (id == null || _context.Item == null || itemId == null)
            {
                return NotFound();
            }
            var collection = await _context.Collection.FirstOrDefaultAsync(c => c.Id == id);
            var item = await _context.Item
                .Include(i => i.ItemsAdditionalStrings)
                .Include(i => i.Tags)
                .Include(i => i.Comments)
                .FirstOrDefaultAsync(m => m.Id == itemId);
            if (item == null || collection == null)
            {
                return NotFound();
            }
            foreach(var comment in item.Comments)
            {
                comment.ApplicationUser = _context.ApplicationUser.FirstOrDefault(a => a.Id == comment.ApplicationUserId);
            }
            await SetAdditionalDataForCreate(id);
            return View(item);
        }

        [Authorize]
        [Route("Collection/{id:int}/Item/Create")]
        public async Task<IActionResult> Create(int id)
        {
            var collection = _context.Collection.Where(c => c.Id == id).FirstOrDefault();
            if (collection == null)
            {
                return NotFound();
            }
            if (!IsAllowed(collection, CollectionOperations.Create).Result)
            {
                return Forbid();
            }
            await SetAdditionalDataForCreate(id);
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        [Route("Collection/{id:int}/Item/Create")]
        public async Task<IActionResult> Create(int? id, ItemItemAdditionalStringsViewModel itemAddStrings)
        {
            if (ModelState.IsValid)
            {
                itemAddStrings.Item.Collection = _context.Collection.Find(id);
                if (itemAddStrings.Item.Collection == null)
                {
                    return NotFound();
                }
                if (!IsAllowed(itemAddStrings.Item.Collection, CollectionOperations.Create).Result)
                {
                    return Forbid();
                }
                await CreateItem(itemAddStrings);
                await _context.SaveChangesAsync();
                return RedirectToRoute(new { controller = "Collection", action = "Details", id });
            }
            await SetAdditionalDataForCreate(id);
            return View(itemAddStrings);
        }

        private async Task CreateItem(ItemItemAdditionalStringsViewModel itemAddStrings)
        {
            await GetOrCreateTags(itemAddStrings.Item.Tags);
            itemAddStrings.Item.Tags = Tags;
            _context.Item.Add(itemAddStrings.Item);
            foreach (var itmStr in itemAddStrings.ItemsAdditionals)
            {
                itmStr.Item = itemAddStrings.Item;
                _context.ItemsAdditionalStrings.Add(itmStr);
            }
        }

        private async Task SetAdditionalDataForCreate(int? id)
        {
            ViewData["collectionId"] = id;
            ViewBag.AdditionalStrings = await _context.AdditionalStrings.Where(a => a.CollectionId == id).ToListAsync();
        }

        // GET: Items/Edit/5
        [Authorize]
        [Route("Collection/{id:int}/Item/Edit/{itemId:int}")]
        public async Task<IActionResult> Edit(int? itemId, int? id)
        {
            var collection = await _context.Collection.FirstOrDefaultAsync(c => c.Id == id);
            if (itemId == null || collection == null || !await CheckData(itemId))
            {
                return NotFound();
            }
            if (!IsAllowed(collection, CollectionOperations.Update).Result)
            {
                return Forbid();
            }
            ViewBag.AdditionalStrings = _context.AdditionalStrings.Where(a => a.CollectionId == id).ToList();
            return View(ItemData);
        }

        private async Task<bool> CheckData(int? id)
        {
            var item = await _context.Item.Include(i => i.Tags).FirstOrDefaultAsync(i => i.Id == id);
            if (item == null) { return false; }
            await FillData(item);
            return true;
        }

        private async Task FillData(Item item)
        {
            ItemData = new();
            ItemData.Item = item;
            ItemData.ItemsAdditionals = await _context.ItemsAdditionalStrings.Where(i => i.Item == item).ToListAsync();
        }

        // POST: Items/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        [Route("Collection/{id:int}/Item/Edit/{itemId:int}")]
        public async Task<IActionResult> Edit(int itemId, int id, ItemItemAdditionalStringsViewModel itemAddStrings)
        {
            if (itemId != itemAddStrings.Item.Id)
            {
                return NotFound();
            }
            if (ModelState.IsValid)
            {
                try
                {
                    await GetOrCreateTags(itemAddStrings.Item.Tags);
                    foreach (var itemAdd in itemAddStrings.ItemsAdditionals)
                    {
                        var result = _context.ItemsAdditionalStrings.Find(itemAdd.Id);
                        if(result == null)
                        {
                            return NotFound();
                        }
                        result.Data = itemAdd.Data;
                    }
                    Item? item = _context.Item.Include(i => i.Tags).FirstOrDefault(i => i.Id == itemAddStrings.Item.Id);
                    if (item == null)
                    {
                        return NotFound();
                    }
                    item.Tags.Clear();
                    item.Title = itemAddStrings.Item.Title;
                    item.Tags = Tags;
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ItemExists(itemAddStrings.Item.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToRoute(new { controller = "Collection", action = "Details", id });
            }
            ViewBag.AdditionalStrings = _context.AdditionalStrings.Where(a => a.CollectionId == id).ToList();
            return View(itemAddStrings);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize]
        [Route("Collection/{id:int}/Item/Delete/{itemId:int}")]
        public async Task<IActionResult> DeleteConfirmed(int itemId, int id)
        {
            var item = await _context.Item.FindAsync(itemId);
            if (item != null)
            {
                DeleteConnected(item);
                _context.Item.Remove(item);
            }
            await _context.SaveChangesAsync();
            return RedirectToRoute(new { controller = "Collection", action = "Details", id });
        }

        private bool ItemExists(int id)
        {
          return (_context.Item?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private void DeleteConnected(Item item)
        {
            var itemAddStrs = _context.ItemsAdditionalStrings.Where(i => i.Item == item).ToArray();
            _context.ItemsAdditionalStrings.RemoveRange(itemAddStrs);
        }

        private async Task GetOrCreateTags(List<Tag> tags)
        {
            foreach(var tag in tags)
            {
                var tagFromDb = await _context.Tag.Where(t => t.Name == tag.Name).FirstOrDefaultAsync();
                if (tagFromDb == null)
                {
                    tagFromDb = new Tag { Name = tag.Name };
                    _context.Tag.Add(tagFromDb);
                    _context.SaveChanges();
                }
                Tags.Add(tagFromDb);
            }
        }

        public async Task<IActionResult> GetTagAsync(string term)
        {
            var tags = await _context.Tag.Where(t => t.Name.Contains(term)).Select(t => t.Name).ToListAsync();
            return new JsonResult(tags);
        }

        private async Task<bool> IsAllowed(Collection? coll, OperationAuthorizationRequirement task)
        {
            if(coll == null)
            {
                return true;
            }
            var isAuthorized = await _authorizationService.AuthorizeAsync(User, coll, task);
            return isAuthorized.Succeeded;
        }

        
    }
}
