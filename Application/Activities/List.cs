using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

// Using Mediator pattern to handle requests which is a design pattern that allows us to send a request to a single place and have it dispatched to the appropriate handler
// Handler for list of activities

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }

        // This is the class that will handle the request
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            // This is the method that will be called when the request is made
            // A cancellationToken allow us to cancel the request if needed instead of waiting for it to finish even if the user has navigated away
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Get the list of activities from the database using AutoMapper with Projection method instead of eager loading which is more efficient
                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() })
                    .ToListAsync(cancellationToken);

                // Return the list of activities from the database
                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}