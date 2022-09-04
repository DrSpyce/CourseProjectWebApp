namespace CourseProjectWebApp.Models.ViewModels
{
    public class SearchResultViewModel
    {
        public string Title { get; set; }

        public int Id { get; set; }

        public int? CollectionId { get; set; }

        public TypeOfResults TypeOfResult { get; set; }

        public enum TypeOfResults
        {
            Collection,
            Item
        }
    }
}
