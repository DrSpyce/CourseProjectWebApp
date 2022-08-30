namespace CourseProjectWebApp.Models.ViewModels
{
	public class ItemTagsViewModel
	{
		public Item Item { get; set; } = new();

		public List<Tag> Tags { get; set; } = new();
	}
}
