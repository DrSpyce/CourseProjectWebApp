using Microsoft.AspNetCore.Identity;

namespace CourseProjectWebApp.DAL.Entities.Identity;

public class ApplicationUser : IdentityUser
{
    public virtual DateTime? LastLoginTime { get; set; }
    public virtual DateTime? RegistrationDate { get; set; }
    public UserStatus Status { get; set; } = UserStatus.Active;

    public List<Collection> Collections { get; set; } = new List<Collection>();

    public enum UserStatus
    {
        Active,
        Blocked
    }
}

