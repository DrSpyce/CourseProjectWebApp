using CourseProjectWebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using static CourseProjectWebApp.Authorization.ProjectConstans;

namespace CourseProjectWebApp.Authorization
{
	public class CollectionIsOwnerAuthorizationHandler
		: AuthorizationHandler<OperationAuthorizationRequirement, Collection>
	{
		UserManager<ApplicationUser> _userManager;

		public CollectionIsOwnerAuthorizationHandler(UserManager<ApplicationUser> userManager)
		{
			_userManager = userManager;
		}

		protected override Task
			HandleRequirementAsync(AuthorizationHandlerContext context,
								   OperationAuthorizationRequirement requirement,
								   Collection resource)
		{
			if(context.User == null || resource == null)
			{
				return Task.CompletedTask;
			}
			
			if(requirement.Name != Constants.CreateOperationName &&
				requirement.Name != Constants.DetailsOperationName &&
				requirement.Name != Constants.UpdateOperationName &&
				requirement.Name != Constants.DeleteOperationName)
			{
				return Task.CompletedTask;
			}

			if(resource.ApplicationUserId == _userManager.GetUserId(context.User))
			{
				context.Succeed(requirement);
			}

			return Task.CompletedTask;
		}
	}
}
