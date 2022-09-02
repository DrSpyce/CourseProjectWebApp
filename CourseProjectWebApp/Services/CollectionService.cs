using CourseProjectWebApp.Data;
using System.Linq.Dynamic.Core;
using CourseProjectWebApp.Interfaces;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static CourseProjectWebApp.Authorization.ProjectConstans;
using Microsoft.Data.SqlClient;
using Amazon.S3.Model;
using Amazon.S3;

namespace CourseProjectWebApp.Services
{
    public class CollectionService :ICollectionService
    {
        private readonly CourseProjectWebAppContext _context;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAmazonS3 _s3Client;

        const string Bucket = "testbucketspycee";

        public CollectionService(UserManager<ApplicationUser> userManager, CourseProjectWebAppContext context, 
            IAuthorizationService authorizationService, IAmazonS3 s3Client)
        {
            _userManager = userManager;
            _context = context;
            _authorizationService = authorizationService;
            _s3Client = s3Client;
        }

        public async Task<List<Collection>?> Mine(string userName)
        {
            var currentUser = await _context.ApplicationUser!.Where(u => u.UserName == userName).FirstOrDefaultAsync();
            if(currentUser != null)
            {
                var result = _context.Collection.Include(c => c.ApplicationUser).Where(c => c.ApplicationUser == currentUser).ToList();
                return result;
            }
            return null;
        }

        public async Task<CollectionItemsViewModel?> DetailsAsync(int id, string sortOrder)
        {
            CollectionItemsViewModel? collItems = new();
            if (string.IsNullOrEmpty(sortOrder))
            {
                sortOrder = "Id";
            }
            return await CheckAndSet(collItems, id, sortOrder);
        }

        private async Task<CollectionItemsViewModel?> CheckAndSet(CollectionItemsViewModel collItems, int id, string sortOrder)
        {
            collItems.Coll = await _context.Collection.FirstOrDefaultAsync(c => c.Id == id);
            if(collItems.Coll == null)
            {
                return null;
            }
            collItems.Items = _context.Item.Where(i => i.Collection == collItems.Coll).OrderBy(sortOrder).ToList();
            return AttachItemAddithionalStrings(collItems);
        }

        public async Task EditAsync(int id, Collection coll)
        {
            var collection = _context.Collection.AsNoTracking().FirstOrDefault(c => c.Id == id);
            coll.ApplicationUserId = collection!.ApplicationUserId;
            _context.Update(coll);
            await _context.SaveChangesAsync();
        } 

        public async Task<string> DeleteAsync(int id)
        {
            var coll = await _context.Collection.Include(c => c.AdditionalStrings).FirstOrDefaultAsync(c => c.Id == id);
            string collTitle = coll!.Title;
            if (coll != null)
            {
                DeleteConnected(coll);
                _context.Collection.Remove(coll);
                await _context.SaveChangesAsync();
            }
            return collTitle;
        }

        public async Task<string> CreateCollection(Collection coll, ClaimsPrincipal user, IFormFile uploadedFile)
        {
            if(uploadedFile != null)
            {
                coll.ImageUrl = await UploadImage(uploadedFile);
            }
            coll.ApplicationUser = await _userManager.FindByNameAsync(user!.Identity!.Name);
            await _context.Collection.AddAsync(coll);
            _context.SaveChanges();
            return $"{coll.Title} created";
        }

        public List<Item> SortNested(List<Item> items, string addStrSort)
        {
            bool descending = false;
            if (addStrSort.EndsWith("_desc"))
            {
                addStrSort = addStrSort.Substring(0, addStrSort.Length - 5);
                descending = true;
            }
            if (descending)
            {
                return items.OrderBy(i => i.ItemsAdditionalStrings.Find(ia => ia.AdditionalStrings.Name == addStrSort).Data).Reverse().ToList();
            }
            return items.OrderBy(i => i.ItemsAdditionalStrings.Find(ia => ia.AdditionalStrings.Name == addStrSort).Data).ToList();
        }

        private CollectionItemsViewModel AttachItemAddithionalStrings(CollectionItemsViewModel CollItems)
        {
            var addStrs = _context.AdditionalStrings.Where(ad => ad.Collection == CollItems.Coll && ad.Display == true).ToList();
            foreach (var addStr in addStrs)
            {
                if (addStr.TypeOfData == AdditionalStrings.TypesOfData.date || addStr.TypeOfData == AdditionalStrings.TypesOfData.title)
                {
                    CollItems.AddStr.Add(addStr);
                    foreach (var item in CollItems.Items)
                    {
                        _context.ItemsAdditionalStrings.Where(i => i.Item == item).Where((i => i.AdditionalStrings == addStr)).FirstOrDefault();
                    }
                }
            }
            return CollItems;
        }

        private void DeleteConnected(Collection coll)
        {
            foreach (var addStrs in coll.AdditionalStrings)
            {
                var ItemAddStr = _context.ItemsAdditionalStrings.Where(i => i.AdditionalStrings == addStrs).ToList();
                _context.ItemsAdditionalStrings.RemoveRange(ItemAddStr);
            }
        }

        public async Task<bool> IsAllowed(int id, OperationAuthorizationRequirement task, ClaimsPrincipal user)
        {
            var coll = _context.Collection.AsNoTracking().First(c=> c.Id == id);
            var isAuthorized = await _authorizationService.AuthorizeAsync(user, coll, task);
            return isAuthorized.Succeeded;
        }

        public async Task<bool> IsAllowed(Collection coll, OperationAuthorizationRequirement task, ClaimsPrincipal user)
        {
            var isAuthorized = await _authorizationService.AuthorizeAsync(user, coll, task);
            return isAuthorized.Succeeded;
        }

        private async Task<string> UploadImage(IFormFile uploadedFile)
        {
            var bucketExists = await _s3Client.DoesS3BucketExistAsync(Bucket);
            if (!bucketExists) return ("Error occured");
            string fileName = Guid.NewGuid().ToString();
            var request = new PutObjectRequest()
            {
                BucketName = Bucket,
                Key = fileName,
                InputStream = uploadedFile.OpenReadStream()
            };
            await _s3Client.PutObjectAsync(request);
            return $"https://{Bucket}.s3.eu-central-1.amazonaws.com/{fileName}";
        }
    }
}
