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

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS policy before Authorization
app.UseCors("CorsPolicy");

// Use the authentication and authorization middleware (authentication should be before authorization)
app.UseAuthentication();
app.UseAuthorization();

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