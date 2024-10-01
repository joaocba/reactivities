using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {

        // Queries use ActionResult, Commands use IActionResult

        [HttpGet] //api/activities
        public async Task<IActionResult> GetActivities([FromQuery] ActivityParams param)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));
        }

        [Authorize] // Only authorized users can access this endpoint
        [HttpGet("{id}")] //api/activities/fdfkdffdfd
        public async Task<IActionResult> GetActivity(Guid id)
        {
            // Validate the result of the request with the HandleResult method from the BaseApiController
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost] //api/activities POST
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")] // Only authorized users can access this endpoint and only if they are the host of the activity
        [HttpPut("{id}")] //api/activities/fdfkdffdfd PUT
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            // Set the id of the activity to the id of the activity in the route
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")] // Only authorized users can access this endpoint and only if they are the host of the activity
        [HttpDelete("{id}")] //api/activities/fdfkdffdfd DELETE
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
    }
}