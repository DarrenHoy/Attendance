using AttendanceAPI.DataModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AttendanceAPI.ApiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachingSessionsController : ControllerBase
    {
        private AttendanceContext _context;

        public TeachingSessionsController(AttendanceContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IResult> Get()
        {
            return await Task.Run(
                () => Results.Ok(_context.TeachingSessions.Include(x => x.CourseModule)));
        }

        [HttpGet("{id}")]
        public async Task<IResult> Get(int id)
        {
            var teachingSession = await _context.TeachingSessions.FindAsync(id);
            if(teachingSession == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(teachingSession);
        }


        [HttpPost]
        public async Task<IResult> Post(TeachingSession teachingSession)
        {
            if (!ModelState.IsValid)
            {
                return await Task.Run(() => Results.BadRequest(ModelState));
            }

            await _context.TeachingSessions.AddAsync(teachingSession);
            await _context.SaveChangesAsync();

            var uri = Url.Action("Get", "TeachingSessions", new { id = teachingSession.Id });
            return Results.Created(uri, teachingSession);
        }
    }
}
