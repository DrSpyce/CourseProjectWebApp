using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Policy;

namespace CourseProjectWebApp.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Tag
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public List<Item> Items { get; set; } = new();
    }
}
