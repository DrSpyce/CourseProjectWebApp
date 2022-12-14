using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using static CourseProjectWebApp.Authorization.ProjectConstans;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Data;
using CourseProjectWebApp.Authorization;
using CourseProjectWebApp.Hubs;
using CourseProjectWebApp.Interfaces;
using CourseProjectWebApp.Services;
using Amazon.S3;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("CourseProjectWebAppContextConnection") ?? throw new InvalidOperationException("Connection string 'CourseProjectWebAppContextConnection' not found.");

InitializeAWS.SetCredentials(builder.Configuration);
InitializeAWS.SetRegion(Amazon.RegionEndpoint.EUCentral1);


builder.Services.AddDbContext<CourseProjectWebAppContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<CourseProjectWebAppContext>();

builder.Services.Configure<SecurityStampValidatorOptions>(options =>
{
    options.ValidationInterval = TimeSpan.FromMinutes(1);
});

builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 1;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddDataAnnotationsLocalization()
    .AddViewLocalization();

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[]
    {
        new CultureInfo("en"),
        new CultureInfo("ru")
    };
    options.SetDefaultCulture("en");
    options.DefaultRequestCulture = new RequestCulture("en");
    options.RequestCultureProviders.RemoveAt(2);
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

builder.Services.AddScoped<IAuthorizationHandler,
                      CollectionIsOwnerAuthorizationHandler>();

builder.Services.AddSingleton<IAuthorizationHandler,
                     CollectionAdministratorAuthorizationHandler>();

builder.Services.AddSignalR();

builder.Services.AddScoped<IAjaxService, AjaxService>();
builder.Services.AddScoped<ICollectionService, CollectionService>();
builder.Services.AddScoped<IItemService, ItemService>();

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<CourseProjectWebAppContext>();
    context.Database.Migrate();
    //var AdminUserPw = builder.Configuration.GetValue<string>("SeedUserPW");
    await SeedData.Initialize(services, Constants.UserRole);
    await SeedData.Initialize(services, "1234", "admin", "admin@admin.com", Constants.AdministratorRole);
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseRequestLocalization();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();;

app.MapHub<CommentHub>("/comment");

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

app.Run();