using API.Extensions;
using API.Middleware;
using API.SignalR;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build(); // All controllers require authentication
    opt.Filters.Add(new AuthorizeFilter(policy));
}
);

// Several services moved to ApplicationServiceExtensions.cs as an extension of this file
builder.Services.AddApplicationServices(builder.Configuration);

// Add Identity services to the container
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();

// SECURITY IMPLEMENTATION (NuGet NWebsec lib)
// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

// Use X-Content-Type-Options header for security improvement of the  application
app.UseXContentTypeOptions();

// Use of the Referrer-Policy header for security improvement of the application
app.UseReferrerPolicy(opt => opt.NoReferrer()); //  No Referrer Policy will return less info  to the attacker

// Use XXss Protection against  XSS attacks
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());

// Main Defense against CSRF attacks and XSRF attacks
app.UseCspReportOnly(opt => opt
   .BlockAllMixedContent()
   .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "https://fonts.gstatic.com").UnsafeInline()) // Allow inline styles temporarily
   .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
   .FormActions(s => s.Self())
   .FrameAncestors(s => s.Self())
   .ImageSources(s => s.Self().CustomSources("blob:", "https://res.cloudinary.com"))
   .ScriptSources(s => s.Self().UnsafeInline())  // Temporarily allow unsafe inline scripts
);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}

// Use CORS policy before Authorization
app.UseCors("CorsPolicy");

// Use the authentication and authorization middleware (authentication should be before authorization)
app.UseAuthentication();
app.UseAuthorization();

// Look inside the wwwroot folder for  static files
app.UseDefaultFiles();
app.UseStaticFiles(); // this will serve the content from the wwwroot folder
app.MapFallbackToController("Index", "Fallback");

app.MapControllers();

// Add the SignalR hubs
app.MapHub<ChatHub>("/chat");

// Migrate the database using scope which will be disposed after the migration (clean up)
using var scrope = app.Services.CreateScope();
var services = scrope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager); // Seed data to the database after migration buta async
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();