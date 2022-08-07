using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace CourseProjectWebApp.Areas.Identity.Data;

// Add profile data for application users by adding properties to the ApplicationUser class
public class ApplicationUser : IdentityUser
{
    public virtual DateTime? LastLoginTime { get; set; }
    public virtual DateTime? RegistrationDate { get; set; }
    public UserStatus Status { get; set; } = UserStatus.Active;

    public enum UserStatus
    { 
        Active,
        Blocked
    }
}

