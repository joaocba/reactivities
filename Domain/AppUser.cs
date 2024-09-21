using Microsoft.AspNetCore.Identity;

namespace Domain
{
    // This class is used to extend the IdentityUser class to include additional properties
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
    }
}