using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace CourseProjectWebApp.Models
{
    public class Collection
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public Topics Topic { get; set; }

        [BindNever]
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
