namespace CourseProjectWebApp.Models
{
    public class Item
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public int CollectionId { get; set; }

        public Collection? Collection { get; set; }

        public List<ItemsAdditionalStrings> ItemsAdditionalStrings { get; set; } = new();

        public List<Tag> Tags { get; set; } = new();
    }
}
