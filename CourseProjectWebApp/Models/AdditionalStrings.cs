using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace CourseProjectWebApp.Models
{
    public class AdditionalStrings
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public TypesOfData? TypeOfData { get; set; }

        [BindNever]
        public int? CollectionId { get; set; }

        [BindNever]
        public Collection? Collection { get; set; }

        [BindNever]
        public List<ItemsAdditionalStrings> ItemsAdditionalStrings { get; set; } = new();

        public enum TypesOfData
        {
            integer,
            title,
            text,
            boolean,
            date
        }
    }
}
