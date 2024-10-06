using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [AllowAnonymous] // Allow anonymous users to access this endpoint
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // Get the user from the database using the email address
            var user = await _userManager.Users.Include(u => u.Photos).FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null) return Unauthorized();

            // Check if the password is correct
            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            // Check if the username already exists in the database
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {
                ModelState.AddModelError("username", "Username taken");
                return ValidationProblem();
            }

            // Check if the email already exists in the database
            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            // Register the user
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            // Create the user in the database with the password
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            // Check if the registration was successful and return the user data
            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return BadRequest(result.Errors);
        }

        [Authorize] // Only authorized users can access this endpoint
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            // Get the current user from the database that match the email address from the logged in user
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            await SetRefreshToken(user);
            return CreateUserObject(user);
        }

        // Endpoint to refresh the token
        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
                .Include(r => r.RefreshTokens)
                .Include(r => r.Photos)
                .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null) return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.IsActive) return Unauthorized();

            if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

            return CreateUserObject(user);
        }


        // Method to set the refresh token
        private async Task SetRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }

        // Method to create a new UserDto object
        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }
}