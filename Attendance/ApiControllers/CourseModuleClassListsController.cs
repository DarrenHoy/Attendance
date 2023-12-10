using AttendanceAPI.DataModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;

namespace AttendanceAPI.ApiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseModuleClassListsController : ControllerBase
    {
        private AttendanceContext _context;

        public CourseModuleClassListsController(AttendanceContext context) 
        {
            _context = context;
        }

        public async Task<IResult> Get()
        {
            return await Task.Run(
                () => Results.Ok(_context.CourseModuleClassLists));
        }

        [HttpGet("{id}")]
        public async Task<IResult> Get(int id)
        {
            var result = await _context.CourseModuleClassLists.FindAsync(id);
            if(result == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(result);
        }

        [HttpGet("{id}/members")]
        public async Task<IResult> GetMembers(int id)
        {
            var classList = await _context.CourseModuleClassLists.FindAsync(id);
            if (classList == null)
            {
                return Results.NotFound();
            }

            var members = 
                _context
                .CourseModuleClassListMembers
                .Where(m => m.CourseModuleClassListId == id)
                .Include(m => m.Student);

            return await Task.Run(() => Results.Ok(members));
        }

        [HttpPost]
        public async Task<IResult> Post([FromBody] CourseModuleClassList courseModuleClassList)
        {
            var courseModule = await _context.CourseModules.FindAsync(courseModuleClassList.CourseModuleId);

            if(courseModule == null)
            {
                ModelState.AddModelError("CourseModuleId",
                    $"A CourseModule entity with the ID {courseModuleClassList.CourseModuleId} could not be found");
            }

            if (!ModelState.IsValid)
            {
                return Results.BadRequest(ModelState);
            }

            _context.CourseModuleClassLists.Add(courseModuleClassList);
            await _context.SaveChangesAsync();  

            var url = Url.ActionLink("Get", "CourseModuleClassList", new { id = courseModuleClassList.Id });
            return Results.Created(url, courseModuleClassList);
        }

        [HttpPost("{id}/members")]
        public async Task<IResult> PostMember([FromRoute] int id, [FromBody] CourseModuleClassListMember member)
        {
            if(member.CourseModuleClassListId != id)
            {
                ModelState.AddModelError("CourseModuleClassListId", "The ID does not match the ID specified in the URL");
            }


            var classList = await _context.CourseModuleClassLists.FindAsync(id);
            var hasClassList = classList != null;

            var student = await _context.Students.FindAsync(member.StudentId);
            var hasStudent = student != null;

            var isRegistered = _context.CourseModuleClassListMembers.Where(l => l.CourseModuleClassListId == member.CourseModuleClassListId && l.StudentId == member.StudentId);

            if (isRegistered.Any())
            {
                ModelState.AddModelError("Duplicate", "The indicated student is already a member of this list");
            }
            
            if(!hasClassList)
            {
                ModelState.AddModelError("CourseModuleClassListId",
                    $"No CourseModuleClassList entity with the ID: {id} could be found");
            }

            if (!hasStudent)
            {
                ModelState.AddModelError("StudentId",
                    $"No Student entity with the ID: {id} could be found");
            }

            if (!ModelState.IsValid)
            {
                return Results.BadRequest(ModelState);
            }

            _context.CourseModuleClassListMembers.Add(member);
            await _context.SaveChangesAsync();

            var uri = Url.ActionLink("Get", "CourseModuleClassLists", new { id = member.Id });
            return Results.Created(uri, member);
        }
    }
}
