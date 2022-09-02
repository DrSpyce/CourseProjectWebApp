using Amazon.Runtime.CredentialManagement;

namespace CourseProjectWebApp.Data
{
    public static class InitializeAWS
    {
        public static void SetCredentials(IConfiguration configuration)
        {
            var options = new CredentialProfileOptions
            {
                AccessKey = configuration.GetSection("AWS_ACCESS_ID").Value,
                SecretKey = configuration.GetSection("AWS_SECRET_ACCESS_KEY").Value
            };
            var profile = new CredentialProfile("default", options);
            var sharedFile = new SharedCredentialsFile();
            sharedFile.RegisterProfile(profile);
        }

        public static void SetRegion(Amazon.RegionEndpoint region)
        {
            var sharedFile = new SharedCredentialsFile();
            CredentialProfile profile;
            if (sharedFile.TryGetProfile("default", out profile))
            {
                profile.Region = region;
                sharedFile.RegisterProfile(profile);
            }
        }
    }
}
