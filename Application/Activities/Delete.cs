using Application.Core;
using MediatR;
using Persistence;
using System;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null) return null;

                // Remove the activity from the database
                _context.Remove(activity);

                var result = await _context.SaveChangesAsync() > 0;

                // If the result is false, return a failure message
                if (!result) return Result<Unit>.Failure("Failed to delete the activity");

                // If the result is true, return a success message
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}