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
using CourseProjectWebApp.Interfaces;
using Microsoft.Extensions.Localization;

namespace CourseProjectWebApp.Controllers
{
    public class ItemController : Controller
    {
        private readonly CourseProjectWebAppContext _context;
        private readonly IItemService _itemService;
        private readonly ICollectionService _collectionService;
        private readonly IStringLocalizer<ItemController> _localizer;

        public ItemController(CourseProjectWebAppContext context,
            IItemService itemService, ICollectionService collectionService, IStringLocalizer<ItemController> localizer)
        { 
            _context = context;
            _itemService = itemService;
            _collectionService = collectionService;
            _localizer = localizer;
        }

        [Route("Collection/{id:int}/Item/{itemId:int}")]
        public async Task<IActionResult> Details(int? id, int? itemId)
        {
            if (id == null || itemId == null)
            {
                return NotFound();
            }
            var item = await _itemService.Details((int)id, (int)itemId);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }

        [Authorize]
        [Route("Collection/{id:int}/Item/Create")]
        public async Task<IActionResult> Create(int id)
        {
            ViewBag.Collection = await _itemService.SetAdditionalDataForCreate(id);
            if (ViewBag.Collection == null)
            {
                return NotFound();
            }
            if (!await _collectionService.IsAllowed(ViewBag.Collection, CollectionOperations.Create, User))
            {
                return Forbid();
            }
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        [Route("Collection/{id:int}/Item/Create")]
        public async Task<IActionResult> Create(int? id, ItemTagsViewModel itemTags)
        {
            if (ModelState.IsValid)
            {
                itemTags.Item.Collection = await _context.Collection.FirstOrDefaultAsync(c => c.Id == id);
                if (itemTags.Item.Collection == null)
                {
                    return NotFound();
                }
                if (!await _collectionService.IsAllowed(itemTags.Item.Collection, CollectionOperations.Create, User))
                {
                    return Forbid();
                }
                await _itemService.CreateItem(itemTags);
                string message = $"{itemTags.Item.Title} {_localizer["created"]}!";
                return RedirectToRoute(new { controller = "Collection", action = "Details", id, message });
            }
            ViewBag.Collection = await _itemService.SetAdditionalDataForCreate(id);
            return View(itemTags);
        }

        [Authorize]
        [Route("Collection/{id:int}/Item/Edit/{itemId:int}")]
        public async Task<IActionResult> Edit(int? itemId, int? id)
        {
            ViewBag.Collection = await _itemService.SetAdditionalDataForCreate(id);
            var data = await _itemService.FillData(itemId);
            if (itemId == null || ViewBag.Collection == null || data == null)
            {
                return NotFound();
            }
            if (!await _collectionService.IsAllowed(ViewBag.Collection, CollectionOperations.Create, User))
            {
                return Forbid();
            }
            return View(data);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        [Route("Collection/{id:int}/Item/Edit/{itemId:int}")]
        public async Task<IActionResult> Edit(int itemId, int id, ItemTagsViewModel itemTags)
        {
            if (itemId != itemTags.Item.Id && id != itemTags.Item.CollectionId)
            {
                return NotFound();
            }
            if (!await _collectionService.IsAllowed(id, CollectionOperations.Create, User))
            {
                return Forbid();
            }
            if (ModelState.IsValid)
            {
                await _itemService.UpdateItem(itemTags);
                string message = $"{itemTags.Item.Title} {_localizer["updated"]}!";
                return RedirectToRoute(new { controller = "Collection", action = "Details", id, message});
            }
            ViewBag.Collection = await _itemService.SetAdditionalDataForCreate(id);
            return View(itemTags);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize]
        [Route("Collection/{id:int}/Item/Delete/{itemId:int}")]
        public async Task<IActionResult> DeleteConfirmed(int itemId, int id)
        {
            if (!await _collectionService.IsAllowed(id, CollectionOperations.Create, User))
            {
                return Forbid();
            }
            var result = await _itemService.DeleteConfirmed(itemId);
            if (result == "not found")
            {
                return NotFound();
            }
            string message = $"{result} {_localizer["deleted"]}!";
            return RedirectToRoute(new { controller = "Collection", action = "Details", id, message });
        }
    }
}
