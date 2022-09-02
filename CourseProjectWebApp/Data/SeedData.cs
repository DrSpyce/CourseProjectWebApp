using CourseProjectWebApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static CourseProjectWebApp.Authorization.ProjectConstans;

namespace CourseProjectWebApp.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider, string UserPw, string userName, string email, string role)
        {
            using (var context = new CourseProjectWebAppContext(
                serviceProvider.GetRequiredService<DbContextOptions<CourseProjectWebAppContext>>()))
            {
                var userID = await EnsureUser(serviceProvider, UserPw, userName, email);
                await EnsureRole(serviceProvider, userID, role);
            }
        }

        public static async Task Initialize(IServiceProvider serviceProvider, string role)
        {
            using (var context = new CourseProjectWebAppContext(
                serviceProvider.GetRequiredService<DbContextOptions<CourseProjectWebAppContext>>()))
            {
                await EnsureRole(serviceProvider, role);
            }
        }

        private static async Task<string> EnsureUser(IServiceProvider serviceProvider,
                                                    string adminUserPw, string userName, string email)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var user = await userManager.FindByNameAsync(userName);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = userName,
                    Email = email
                };
                await userManager.CreateAsync(user, adminUserPw);
            }
            if (user == null)
            {
                throw new Exception("Error accured while creating admin user");
            }
            return user.Id;
        }

        private static async Task<IdentityResult> EnsureRole(IServiceProvider serviceProvider, string uid, string role)
        {
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();
            IdentityResult IR;
            if (!await roleManager.RoleExistsAsync(role))
            {
                IR = await roleManager.CreateAsync(new IdentityRole(role));
            }
            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();
            var user = await userManager.FindByIdAsync(uid);
            if (user == null)
            {
                throw new Exception("The user is null in EnsureRole");
            }
            IR = await userManager.AddToRoleAsync(user, role);
            return IR;
        }

        private static async Task<IdentityResult> EnsureRole(IServiceProvider serviceProvider, string role)
        {
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();
            if (!await roleManager.RoleExistsAsync(role))
            {
                return await roleManager.CreateAsync(new IdentityRole(role));
            }
            return IdentityResult.Failed();
        }
    }
}
