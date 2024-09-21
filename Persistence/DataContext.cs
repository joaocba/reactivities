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

        // DbSet
        public DbSet<Activity> Activities { get; set; }
    }
}