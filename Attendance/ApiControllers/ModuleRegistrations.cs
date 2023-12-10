using AttendanceAPI.DataModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AttendanceAPI.ApiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModuleRegistrations : ControllerBase
    {
        private AttendanceContext _context;

        public ModuleRegistrations(AttendanceContext context)
        {
            _context = context;
        }

        public async Task<IResult> Get()
        {
            return await Task.Run(() => Results.Ok(_context.ModuleRegistrations));
        }

        [HttpGet("{id}")]
        public async Task<IResult> Get(int id)
        {
            var moduleRegistration = await 
                _context.ModuleRegistrations
                .Include(mr => mr.Student)
                .Include(mr => mr.CourseModule)
                .FirstOrDefaultAsync(mr => mr.Id == id);

            if(moduleRegistration == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(moduleRegistration);
        }
    }
}
