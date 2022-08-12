using CourseProjectWebApp.Data;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CourseProjectWebApp.Controllers
{
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly CourseProjectWebAppContext _context;

        [TempData]
        public string Message { get; set; }

        public UserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, CourseProjectWebAppContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        // GET: CollectionController
        public async Task<ActionResult> Index()
        {
            var currentUser = await _userManager.FindByNameAsync(User.Identity.Name);
            var result = _context.Collection.Include(c => c.ApplicationUser).ToList();
            ViewData["Message"] = Message;
            return View();
        }

        // GET: CollectionController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: CollectionController/Create
        [Route("User/Collection/Create")]
        public ActionResult Create()
        {
            return View();
        }

        // POST: CollectionController/Create
        [Route("User/Collection/Create")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> CreateAsync(CollectionAdditionalStringsViewModel CollectionStrings)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return View();
                }
                CollectionStrings.Coll.ApplicationUser = await _userManager.FindByNameAsync(User.Identity.Name);
                await _context.Collection.AddAsync(CollectionStrings.Coll);
                foreach (var addStrs in CollectionStrings.AddStr)
                {
                    addStrs.Collection = CollectionStrings.Coll;
                    await _context.AdditionalStrings.AddAsync(addStrs);
                }
                _context.SaveChanges();
                Message = $"{CollectionStrings.Coll.Title} was created";
                return RedirectToAction(nameof(Index));
            }
            catch(Exception e)
            {
                return View();
            }
        }

        // GET: CollectionController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: CollectionController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: CollectionController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: CollectionController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
