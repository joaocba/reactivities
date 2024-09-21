using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"(?=.*[^A-Za-z])(?=.*[A-Z])(?=.*[a-z]).{4,}$", ErrorMessage = "Password must be at least 4 characters long and contain at least one number, one uppercase letter and one lowercase letter")]
        public string Password { get; set; }

        [Required]
        public string Username { get; set; }
    }
}