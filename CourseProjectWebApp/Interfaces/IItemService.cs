using CourseProjectWebApp.Models;
using CourseProjectWebApp.Models.ViewModels;

namespace CourseProjectWebApp.Interfaces
{
	public interface IItemService
	{
        public Task<Item?> Details(int id, int itemId);

        public Task CreateItem(ItemTagsViewModel itemTags);

        public Task<ItemTagsViewModel?> FillData(int? id);

        public Task UpdateItem(ItemTagsViewModel itemTags);

        public Task<bool> DeleteConfirmed(int itemId);

        public Task<Collection?> SetAdditionalDataForCreate(int? id);
    }
}
