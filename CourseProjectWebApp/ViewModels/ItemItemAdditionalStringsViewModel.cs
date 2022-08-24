namespace CourseProjectWebApp.Models.ViewModels
{
	public class ItemItemAdditionalStringsViewModel
	{
		public Item Item { get; set; } = new();

		public List<ItemsAdditionalStrings> ItemsAdditionals { get; set; } = new();
	}
}
