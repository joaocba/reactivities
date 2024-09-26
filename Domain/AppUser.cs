using Microsoft.AspNetCore.Identity;

namespace Domain
{
    // This class is used to extend the IdentityUser class to include additional properties
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        // Relation to the Activity entity
        public ICollection<ActivityAttendee> Activities { get; set; }

        // Relation to the Photo entity
        public ICollection<Photo> Photos { get; set; }

        // Relation to the UserFollowing entity
        public ICollection<UserFollowing> Followings { get; set; }
        public ICollection<UserFollowing> Followers { get; set; }
    }
}