using CourseProjectWebApp.Data;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace CourseProjectWebApp.Interfaces
{
    public interface ICollectionService
    {
        public Task<List<Collection>?> Mine(string userName);

        public Task<CollectionItemsViewModel?> DetailsAsync(int id, string sortOrder);

        public Task EditAsync(int id, Collection coll);

        public Task<string> DeleteAsync(int id);

        public Task<string> CreateCollection(Collection coll, ClaimsPrincipal user);

        public List<Item> SortNested(List<Item> items, string addStrSort);

        public Task<bool> IsAllowed(int id, OperationAuthorizationRequirement task, ClaimsPrincipal user);

        public Task<bool> IsAllowed(Collection coll, OperationAuthorizationRequirement task, ClaimsPrincipal user);
    }
}
