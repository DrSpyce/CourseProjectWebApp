using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace CourseProjectWebApp.Authorization
{
    public static class ProjectConstans
    {
        public static class CollectionOperations
        {
            public static OperationAuthorizationRequirement Create =
                new OperationAuthorizationRequirement { Name = Constants.CreateOperationName };
            public static OperationAuthorizationRequirement Details =
                new OperationAuthorizationRequirement { Name = Constants.DetailsOperationName };
            public static OperationAuthorizationRequirement Update =
                new OperationAuthorizationRequirement { Name = Constants.UpdateOperationName };
            public static OperationAuthorizationRequirement Delete =
                new OperationAuthorizationRequirement { Name = Constants.DeleteOperationName };
            public static OperationAuthorizationRequirement Approve =
                new OperationAuthorizationRequirement { Name = Constants.ApproveOperationName };
            public static OperationAuthorizationRequirement Reject =
                new OperationAuthorizationRequirement { Name = Constants.RejectOperationName };
        }

        public class Constants
        {
            public static readonly string CreateOperationName = "Create";
            public static readonly string DetailsOperationName = "Details";
            public static readonly string UpdateOperationName = "Update";
            public static readonly string DeleteOperationName = "Delete";
            public static readonly string ApproveOperationName = "Approve";
            public static readonly string RejectOperationName = "Reject";

            public const string UserRole = "User";
            public const string AdministratorRole = "Administrator";
        }
    }
}
