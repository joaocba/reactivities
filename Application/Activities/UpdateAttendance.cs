using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // Get the activity from the database
                var activity = await _context.Activities
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null;

                // Get the username from the database
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                // Get the host username from the activity
                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser.UserName;

                // Get the attendance from the activity
                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                // If the attendance is not null and the host username is the same as the username then activity is cancelled is equal to activity not cancelled
                if (attendance != null && hostUsername == user.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                // if the attendance is not null and the host username is not the same as the username then the attendance is removed
                if (attendance != null && hostUsername != user.UserName)
                    activity.Attendees.Remove(attendance);

                // If the attendance is null then a new attendance is added
                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                // Save the changes to the database
                var result = await _context.SaveChangesAsync() > 0;

                // Return the result of the update
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}