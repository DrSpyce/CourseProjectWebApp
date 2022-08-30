namespace CourseProjectWebApp.Models.ViewModels
{
    public class CollectionItemsViewModel
    {
        public Collection Coll { get; set; }

        public List<AdditionalStrings> AddStr { get; set; } = new();

        public List<Item> Items { get; set; } = new();
    }
}
