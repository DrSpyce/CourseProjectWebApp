using CourseProjectWebApp.Areas.Identity.Data;

namespace CourseProjectWebApp.Models
{
    public class UserWithRolesModel
    {
        public List<string> Roles;

        public  ApplicationUser User;
    }
}
