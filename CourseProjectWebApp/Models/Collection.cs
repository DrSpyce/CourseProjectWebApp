using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace CourseProjectWebApp.Models
{
    [Index(nameof(Title), IsUnique = true)]
    public class Collection
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "TitleRequired")]
        [StringLength(50)]
        public string Title { get; set; }

        [Required(ErrorMessage = "DescriptionRequired")]
        public string Description { get; set; }

        [Required(ErrorMessage = "TopicRequired")]
        public Topics Topic { get; set; }
        
        [Url]
        public string? ImageUrl { get; set; }

        public List<AdditionalStrings> AdditionalStrings { get; set; } = new();
          
        [BindNever]
        public string? ApplicationUserId { get; set; }

        [BindNever]
        public ApplicationUser? ApplicationUser { get; set; }

        public List<Item> Items { get; set; } = new();

        public enum Topics
        {
            Books,
            Signs,
            Silverware
        }
    }
}
