using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using static CourseProjectWebApp.Authorization.ProjectConstans;
using CourseProjectWebApp.Models;
using CourseProjectWebApp.Data;
using CourseProjectWebApp.Authorization;
using CourseProjectWebApp.Hubs;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("CourseProjectWebAppContextConnection") ?? throw new InvalidOperationException("Connection string 'CourseProjectWebAppContextConnection' not found.");

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

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddScoped<IAuthorizationHandler,
                      CollectionIsOwnerAuthorizationHandler>();

builder.Services.AddSingleton<IAuthorizationHandler,
                     CollectionAdministratorAuthorizationHandler>();

builder.Services.AddSignalR();

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