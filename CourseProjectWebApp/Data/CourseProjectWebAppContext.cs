using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CourseProjectWebApp.Models;

namespace CourseProjectWebApp.Data;

public class CourseProjectWebAppContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<ApplicationUser>? ApplicationUser { get; set; }

    public DbSet<Collection> Collection { get; set; }

    public DbSet<AdditionalStrings> AdditionalStrings { get; set; }

    public DbSet<Item> Item { get; set; }

    public DbSet<ItemsAdditionalStrings> ItemsAdditionalStrings { get; set; }

    public DbSet<Tag> Tag { get; set; }

    public DbSet<Comment> Comments { get; set; }

    public DbSet<ItemUserLike> ItemUserLike { get; set; }

    public CourseProjectWebAppContext(DbContextOptions<CourseProjectWebAppContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Customize the ASP.NET Identity model and override the defaults if needed.
        // For example, you can rename the ASP.NET Identity table names and more.
        // Add your customizations after calling base.OnModelCreating(builder);
    }

}
