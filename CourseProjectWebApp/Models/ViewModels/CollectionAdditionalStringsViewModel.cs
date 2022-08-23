using Microsoft.AspNetCore.Mvc;

namespace CourseProjectWebApp.Models.ViewModels
{
    public class CollectionAdditionalStringsViewModel
    {
        public Collection Coll { get; set; }

        public List<AdditionalStrings> AddStr { get; set; }
    }
}
