using Microsoft.AspNetCore.Mvc;

namespace CourseProjectWebApp.Models.ViewModels
{
    public class IndexViewModel
    {
        public List<CollectionIndexView> Collections { get; set; } = new();

        public List<IndexItemView> Items { get; set; } = new();

        public List<TagsIndexView> Tags { get; set; } = new();
    }

    public class IndexItemView
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string CollectionTitle { get; set; }

        public int CollectionId { get; set; }

        public string? UserName { get; set; }
    }

    public class CollectionIndexView
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string? UserName { get; set; }

        public int CountItems { get; set; }
    }

    public class TagsIndexView
    {
        public int Id { get; set; }
        
        public string Name { get; set; }

        public int CountItems { get; set; }
    }
}
