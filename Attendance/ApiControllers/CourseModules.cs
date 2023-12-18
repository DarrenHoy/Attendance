using Attendance.DataModel.DTO;
using AttendanceAPI.DataModel;
using AttendanceAPI.DataModel.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using System.Dynamic;
using System.Linq;

namespace AttendanceAPI.ApiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseModulesController : Controller
    {
        private AttendanceContext _context;

        public CourseModulesController(AttendanceContext context) 
        { 
            _context = context;
        }

        public async Task<IResult> Get()
        {
            return await Task.Run(() => Results.Ok(_context.CourseModules));
        }

        [HttpGet("{id}")]
        public async Task<IResult> Get(int id)
        {
            var courseModule = await _context.CourseModules.FindAsync(id);
            if(courseModule == null)
            {
                return Results.NotFound();
            }

            dynamic links = new ExpandoObject();
            links.registered = Url.ActionLink("GetRegistered","CourseModules", new { id = id });
            links.classLists = Url.ActionLink("Get", "CourseModules", new { id = id }) + "/ClassLists";

            dynamic result = new ExpandoObject();
            result.id = courseModule.Id;
            result.code = courseModule.Code;
            result.title = courseModule.Title;
            result.links = links;
            

            return Results.Ok(result);
        }

        [HttpGet("{id}/registered")]
        public async Task<IResult> GetRegistered(int id)
        {
            var hasModule = _context.CourseModules.Where(m => m.Id == id).Any();

            
            if (!hasModule)
            {
                return Results.NotFound();
            }

            var registered = await _context.ModuleRegistrations
                            .Include(m => m.Student)
                            .Where(m => m.CourseModuleId == id)
                            .ToListAsync();


            dynamic result = registered.Select(r =>
            {
                dynamic obj = new ExpandoObject();
                obj.id = r.Id;
                obj.student = r.Student.ToDTO();
                return obj;
            }).ToList();
            
            return Results.Ok(result);
        }

        [HttpPost("{id}/register")]
        public async Task<IResult> Register([FromRoute] int id, [FromBody] CreateModuleRegistrationDTO registration)
        {

            

            var hasModule = _context.CourseModules.Where(m => m.Id == id).Any();

            if (!hasModule)
            {
                return Results.NotFound();
            }

            var hasStudent = _context.Students.Where(s => s.Id == registration.StudentId).Any();
            if (!hasStudent)
            {
                ModelState.AddModelError("StudentId", $"There is no student with ID {id}");
            }

            var isRegistered = _context.ModuleRegistrations.Where(
                r => r.CourseModuleId == id
                && r.StudentId == registration.StudentId).Any();

            if(isRegistered)
            {
                ModelState.AddModelError("Duplicate", "The indicated student is already registered on this module");
            }

            if(!ModelState.IsValid)
            {
                return Results.BadRequest(ModelState);
            }

            var moduleRegistration = new ModuleRegistration
            {
                CourseModuleId = id,
                StudentId = registration.StudentId
            };

            _context.ModuleRegistrations.Add(moduleRegistration);
            await _context.SaveChangesAsync();

            var created = await _context.ModuleRegistrations
                .Where(m => m.Id == moduleRegistration.Id)
                .Include(r => r.CourseModule)
                .Include(m => m.Student)
                .FirstAsync();
                

            var uri = Url.ActionLink("Get","ModuleRegistrations", new { id =  moduleRegistration.Id });
            return Results.Created(uri, moduleRegistration.ToDTO());
        }

        

        [HttpGet("{id}/classlists")]
        public async Task<IResult> GetClassLists(int id)
        {
            var hasModule = _context.CourseModules.Where(m => m.Id == id).Any();


            if (!hasModule)
            {
                return Results.NotFound();
            }

            var result = await _context.CourseModuleClassLists
                            .Where(m => m.CourseModuleId == id)
                            .ToListAsync();
            
            return Results.Ok(result);
        }

        [HttpPost("{id}/classlists")]
        public async Task<IResult> Post([FromRoute] int id, [FromBody] CreateClassListDTO model)
        {
            var courseModule = await _context.CourseModules.FindAsync(id);

            if (courseModule == null)
            {
                return Results.NotFound();
            }

            if (!ModelState.IsValid)
            {
                return Results.BadRequest(ModelState);
            }

            var classList = new CourseModuleClassList() {  CourseModuleId = id, Title = model.Title };
            _context.CourseModuleClassLists.Add(classList);
            await _context.SaveChangesAsync();

            var url = Url.ActionLink("Get", "CourseModuleClassList", new { id = classList.Id });
            return Results.Created(url, model);
        }
    }
}
