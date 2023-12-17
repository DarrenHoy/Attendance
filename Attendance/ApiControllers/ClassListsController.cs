using Attendance.DataModel.DTO;
using AttendanceAPI.DataModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Dynamic;
using System.Runtime.InteropServices;

namespace AttendanceAPI.ApiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassListsController : ControllerBase
    {
        private AttendanceContext _context;

        public ClassListsController(AttendanceContext context) 
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

            var moduleLink = Url.ActionLink("Get","CourseModules", new { Id = result.CourseModuleId });
            var membersLink = Url.ActionLink("Get", "ClassLists", new { id = id }) + "/members";

            dynamic links = new ExpandoObject();
            links.module = moduleLink;
            links.members = membersLink;

            return Results.Ok(result.ToDTO(links));
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
                .ClassListMembers
                .Where(m => m.CourseModuleClassListId == id)
                .Include(m => m.Student);

            dynamic result = new ExpandoObject();
            result.members = members.Select(m =>
                new {
                    id = m.Id,
                    student = m.Student.ToDTO(),
                }
            ).ToList();

            return await Task.Run(() => Results.Ok(result));
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
        public async Task<IResult> PostMember([FromRoute] int id, [FromBody] CreateCourseModuleClassListMemberDTO member)
        {
            var classList = await _context.CourseModuleClassLists.FindAsync(id);
            var hasClassList = classList != null;

            var student = await _context.Students.FindAsync(member.StudentId);
            var hasStudent = student != null;

            var isRegistered = _context.ClassListMembers
                .Where(l => l.CourseModuleClassListId == id && l.StudentId == member.StudentId);

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

            var classListMember = new ClassListMember {CourseModuleClassListId = id, StudentId = member.StudentId };

            _context.ClassListMembers.Add(classListMember);
            await _context.SaveChangesAsync();

            var uri = Url.ActionLink("Get", "CourseModuleClassLists", new { id = classListMember.Id });
            return Results.Created(uri, member);
        }
    }
}
