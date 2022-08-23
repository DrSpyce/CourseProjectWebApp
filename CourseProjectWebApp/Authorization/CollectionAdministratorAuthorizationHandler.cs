using CourseProjectWebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using static CourseProjectWebApp.Authorization.ProjectConstans;

namespace CourseProjectWebApp.Authorization
{
	public class CollectionAdministratorAuthorizationHandler
		: AuthorizationHandler<OperationAuthorizationRequirement, Collection>
	{
		protected override Task
			HandleRequirementAsync(AuthorizationHandlerContext context,
								   OperationAuthorizationRequirement requirement,
								   Collection resource)
		{
            if (context.User == null)
            {
                return Task.CompletedTask;
            }

            if (context.User.IsInRole(Constants.AdministratorRole))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
	}
}
