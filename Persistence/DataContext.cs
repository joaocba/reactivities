using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        // Constructor
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // DbSet
        public DbSet<Activity> Activities { get; set; }
    }
}