namespace CourseProjectWebApp.Models
{
    public class Comment
    {
        public int Id { get; set; }

        public string Text { get; set; }
        
        public DateTime Created { get; set; }

        public int ItemId { get; set; }

        public Item? Item { get; set; }

        public string ApplicationUserId { get; set; }

        public ApplicationUser ApplicationUser { get; set; }
    }
}
