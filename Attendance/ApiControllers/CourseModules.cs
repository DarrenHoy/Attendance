using AttendanceAPI.DataModel;
using AttendanceAPI.DataModel.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var result = await _context.CourseModules.FindAsync(id);
            if(result == null)
            {
                return Results.NotFound();
            }

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

            var result = await _context.ModuleRegistrations
                            .Include(m => m.Student)
                            .Include(m => m.CourseModule)
                            .Where(m => m.CourseModuleId == id)
                            .ToListAsync();

            var registrations = result.Select(m => m.ToDTO());
            return Results.Ok(registrations);
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

            var classLists = result.Select(m => m.ToDTO());
            return Results.Ok(classLists);
        }
    }
}
