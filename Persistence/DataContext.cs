using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        // Constructor
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // DbSet for the Activity entity and the ActivityAttendee entity
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }

        // DbSet for the Photo entity
        public DbSet<Photo> Photos { get; set; }

        // DbSet for the Comment entity
        public DbSet<Comment> Comments { get; set; }

        // override OnModelCreating to add the relationship between the ActivityAttendee entity and the Activity entity
        protected override void OnModelCreating(ModelBuilder Builder)
        {
            base.OnModelCreating(Builder);

            // Add the relationship between the ActivityAttendee entity and the Activity entity
            Builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));

            // Configure the relationship between the ActivityAttendee entity and the Activity entity
            Builder.Entity<ActivityAttendee>()
                .HasOne(aa => aa.AppUser)
                .WithMany(a => a.Activities)
                .HasForeignKey(aa => aa.AppUserId);

            Builder.Entity<ActivityAttendee>()
                .HasOne(aa => aa.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            // Delete comments when the activity is deleted
            Builder.Entity<Comment>()
                .HasOne(a => a.Activity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}