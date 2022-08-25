namespace CourseProjectWebApp.Models
{
    public class ItemUserLike
    {
        public int id { get; set; }

        public int itemId { get; set; }

        public Item? Item { get; set; }

        public string ApplicationUserId { get; set; }

        public ApplicationUser? ApplicationUser { get; set; }
    }
}
