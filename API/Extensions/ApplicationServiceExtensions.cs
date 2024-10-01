using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            // Add CORS policy to allow requests from the frontend
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithOrigins("http://localhost:3000");
                });
            });

            // Add MediatR to the services
            services.AddMediatR(typeof(List.Handler));

            // Add AutoMapper to the services
            services.AddAutoMapper(typeof(MappingProfiles).Assembly); // Add the MappingProfiles assembly

            // Add FluentValidation to the services
            services.AddFluentValidationAutoValidation();

            // Add validators from the Create class
            services.AddValidatorsFromAssemblyContaining<Create>();

            // Add context accessor and user accessor
            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAcessor>();

            // Add the photo accessor
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();

            // Add cloudinary settings
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));

            // Service for SignalR
            services.AddSignalR();

            return services;
        }
    }
}