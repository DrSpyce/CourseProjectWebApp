using CourseProjectWebApp.Data;
using CourseProjectWebApp.Interfaces;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static CourseProjectWebApp.Authorization.ProjectConstans;

namespace CourseProjectWebApp.Services
{
	public class ItemService : IItemService
	{
        private readonly CourseProjectWebAppContext _context;

        public ItemService(CourseProjectWebAppContext context)
        {
            _context = context;
        }

        private List<Tag> Tags = new();

        public async Task<Item?> Details(int id, int itemId)
        {
            var collection = await _context.Collection.FirstOrDefaultAsync(c => c.Id == id);
            var item = await _context.Item
                .Include(i => i.ItemsAdditionalStrings.Where(ias => ias.AdditionalStrings!.Display == true))
                .ThenInclude(ias => ias.AdditionalStrings)
                .Include(i => i.Tags)
                .Include(i => i.Comments)
                .ThenInclude(c => c.ApplicationUser)
                .Include(i => i.ItemUserLikes)
                .FirstOrDefaultAsync(m => m.Id == itemId);
            if (item == null || collection == null)
            {
                return null;
            }
            return item;
        }

        public async Task CreateItem(ItemTagsViewModel itemTags)
        {
            await GetOrCreateTags(itemTags.Tags);
            itemTags.Item.Tags = Tags;
            _context.Add(itemTags.Item);
            await _context.SaveChangesAsync();
        }

        public async Task<ItemTagsViewModel?> FillData(int? id)
        {
            ItemTagsViewModel itemTags = new();
            itemTags.Item = await _context!.Item!
                .Include(i => i.ItemsAdditionalStrings)
                .FirstOrDefaultAsync(i => i.Id == id);
            itemTags.Tags = await _context.Tag.Where(t => t.Items.Any(i => i.Id == itemTags.Item.Id)).ToListAsync();
            return itemTags;
        }

        public async Task UpdateItem(ItemTagsViewModel itemTags)
        {
            Item? item = _context.Item.Include(i => i.Tags).FirstOrDefault(i => i.Id == itemTags.Item.Id);
            if (itemTags.Tags.Count > 0)
            {
                await GetOrCreateTags(itemTags.Tags);
                item.Tags = Tags;
            }
            item.Title = itemTags.Item.Title;
            item.ItemsAdditionalStrings = itemTags.Item.ItemsAdditionalStrings;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteConfirmed(int itemId)
        {
            var item = await _context.Item.FirstOrDefaultAsync(i => i.Id == itemId);
            if (item != null)
            {
                DeleteConnected(item);
                _context.Item.Remove(item);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        private void DeleteConnected(Item item)
        {
            var itemAddStrs = _context.ItemsAdditionalStrings.Where(i => i.Item == item).ToArray();
            _context.ItemsAdditionalStrings.RemoveRange(itemAddStrs);
        }

        private async Task GetOrCreateTags(List<Tag> tags)
        {
            foreach (var tag in tags)
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

        public async Task<Collection?> SetAdditionalDataForCreate(int? id)
        {
            return await _context.Collection.Include(c => c.AdditionalStrings).Where(c => c.Id == id).FirstOrDefaultAsync();
        }
    }
}
