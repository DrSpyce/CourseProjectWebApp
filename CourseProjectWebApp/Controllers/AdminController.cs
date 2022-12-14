using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using static CourseProjectWebApp.Authorization.ProjectConstans;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Data;
using CourseProjectWebApp.Models.ViewModels;
using Microsoft.Extensions.Localization;

namespace CourseProjectWebApp.Controllers
{
    [Authorize(Roles = Constants.AdministratorRole)]
    public class AdminController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly CourseProjectWebAppContext _context;
        private readonly IStringLocalizer<AdminController> _localizer;

        [BindProperty]
        public List<string> AreChecked { get; set; }

        [TempData]
        public string Message { get; set; }

        private List<UserRolesViewModel> UsersWithRoles;

        private List<ApplicationUser> Users = new List<ApplicationUser>();

        private List<IdentityResult> Results = new List<IdentityResult>();

        private bool LogOut = false;

        public AdminController(UserManager<ApplicationUser> userManager, 
            RoleManager<IdentityRole> roleManager, 
            SignInManager<ApplicationUser> signInManager, 
            CourseProjectWebAppContext context, IStringLocalizer<AdminController> localizer)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _context = context;
            _localizer = localizer;
        }

        public async Task<IActionResult> Index()
        {
            await GetUsers();
            await GetRoles();
            ViewData["Message"] = Message;
            return View(UsersWithRoles);
        }

        private async Task GetUsers()
        {
            UsersWithRoles = await _userManager.Users
            .Select(u => new UserRolesViewModel { User = u, Roles = new List<string>() })
            .ToListAsync();
        }

        private async Task GetRoles()
        {
            var roleNames = await _roleManager.Roles.Select(r => r.Name).ToListAsync();
            foreach (var roleName in roleNames)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(roleName);
                var toUpdate = UsersWithRoles.Where(u => usersInRole.Any(ur => ur.Id == u.User.Id));
                foreach (var user in toUpdate)
                {
                    user.Roles.Add(roleName);
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> Delete()
        {
            await SetAreCheckedUsers();
            foreach (var user in Users)
            {
                Results.Add(await DeleteUser(user));
            }
            await CheckIfLogOut();
            SetMessage(_localizer["deleted"]);
            return RedirectToAction("Index", "Admin");
        }

        private async Task<IdentityResult> DeleteUser(ApplicationUser user)
        {
            var r = await _context.ApplicationUser.Include(u => u.Collections).Where(u => u.Id == user.Id).FirstOrDefaultAsync();
            _context.ApplicationUser.Remove(r);
            await _context.SaveChangesAsync();
            return IdentityResult.Success;
        }

        [HttpPost]
        public async Task<IActionResult> Block()
        {
            await SetAreCheckedUsers();
            foreach (var user in Users)
            {
                if (user.Status == ApplicationUser.UserStatus.Active)
                {
                    await _userManager.SetLockoutEnabledAsync(user, true);
                    await _userManager.SetLockoutEndDateAsync(user, new DateTime(2222, 06, 06));
                    await _userManager.UpdateSecurityStampAsync(user);
                    user.Status = ApplicationUser.UserStatus.Blocked;
                    Results.Add(await _userManager.UpdateAsync(user));
                }
            }
            await CheckIfLogOut();
            SetMessage(_localizer["blocked"]);
            return RedirectToAction("Index", "Admin");
        }

        [HttpPost]
        public async Task<IActionResult> Unblock()
        {
            await SetAreCheckedUsers();
            foreach (var user in Users)
            {
                if (user.Status == ApplicationUser.UserStatus.Blocked)
                {
                    await _userManager.SetLockoutEnabledAsync(user, false);
                    await _userManager.SetLockoutEndDateAsync(user, DateTime.Now - TimeSpan.FromMinutes(1));
                    await _userManager.UpdateSecurityStampAsync(user);
                    user.Status = ApplicationUser.UserStatus.Active;
                    Results.Add(await _userManager.UpdateAsync(user));
                }
            }
            SetMessage(_localizer["unblocked"]);
            return RedirectToAction("Index", "Admin");
        }

        [HttpPost]
        public async Task<IActionResult> SetAdminRole()
        {
            await SetAreCheckedUsers();
            foreach(var user in Users)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                if (!userRoles.Contains(Constants.AdministratorRole))
                {
                    Results.Add(await _userManager.AddToRoleAsync(user, Constants.AdministratorRole));
                    await _userManager.RemoveFromRoleAsync(user, Constants.UserRole);
                };
            }
            SetMessage(_localizer["now admin"]);
            return RedirectToAction("Index", "Admin");
        }

        [HttpPost]
        public async Task<IActionResult> DeleteAdminRole()
        {
            await SetAreCheckedUsers();
            foreach (var user in Users)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                if (userRoles.Contains(Constants.AdministratorRole))
                {
                    await _userManager.RemoveFromRoleAsync(user, Constants.AdministratorRole);
                    Results.Add(await _userManager.AddToRoleAsync(user, Constants.UserRole));
                };
            }
            await CheckIfLogOut();
            SetMessage(_localizer["not admin"]);
            return RedirectToAction("Index", "Admin");
        }

        private async Task SetAreCheckedUsers()
        {
            foreach (var userId in AreChecked)
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user.UserName == User.Identity.Name)
                {
                    Users.Add(user);
                    LogOut = true;
                }
                else if (user != null)
                {
                    Users.Insert(0, user);
                } 
            }
        }

        private async Task CheckIfLogOut()
        {
            if (LogOut)
            {
                await _signInManager.SignOutAsync();
            }
        }

        private void SetMessage(string nameOfAction)
        {
            Message = $"{Results.Count} {_localizer["users"]} {nameOfAction}!";
        }
    }
}
