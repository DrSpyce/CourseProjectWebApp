using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace CourseProjectWebApp.Models
{
    public class Item
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "TitleRequired")]
        public string Title { get; set; }

        public int CollectionId { get; set; }

        public Collection? Collection { get; set; }

        public List<ItemsAdditionalStrings> ItemsAdditionalStrings { get; set; } = new();

        public List<Tag> Tags { get; set; } = new();

        public List<Comment> Comments { get; set; } = new();

        public List<ItemUserLike> ItemUserLikes { get; set; } = new();
    }
}
