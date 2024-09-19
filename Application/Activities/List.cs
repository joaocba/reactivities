using Application.Core;
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
        public class Query : IRequest<Result<List<Activity>>> { }

        // This is the class that will handle the request
        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            // This is the method that will be called when the request is made
            // A cancellationToken allow us to cancel the request if needed instead of waiting for it to finish even if the user has navigated away
            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<List<Activity>>.Success(await _context.Activities.ToListAsync());
            }
        }
    }
}