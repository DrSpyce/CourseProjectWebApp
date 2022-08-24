using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace CourseProjectWebApp.Models;

// Add profile data for application users by adding properties to the ApplicationUser class
public class ApplicationUser : IdentityUser
{
    public virtual DateTime? LastLoginTime { get; set; }

    public virtual DateTime? RegistrationDate { get; set; }

    public UserStatus Status { get; set; } = UserStatus.Active;

    public List<Collection> Collections { get; set; } = new();

    public List<Comment> Comments { get; set; } = new();

    public enum UserStatus
    {
        Active,
        Blocked
    }
}

