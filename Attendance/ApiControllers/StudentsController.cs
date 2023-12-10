using AttendanceAPI.DataModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AttendanceAPI.ApiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private AttendanceContext _context;

        public StudentsController(AttendanceContext context) 
        { 
            _context = context; 
        }

        public async Task<IResult> Get()
        {
            return await Task.Run(() => Results.Ok(_context.Students));
            
        }

        [HttpGet("{id}")]
        public async Task<IResult> Get(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if(student == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(student);

        }

        [HttpGet("find/{findText}")]
        public async Task<IResult> Find([FromRoute] string findText) 
        { 
            var students = await _context.Students.Where(
                                    s => s.FirstName.StartsWith(findText)
                                    || s.Surname.StartsWith(findText)
                                    || s.StudentNumber.StartsWith(findText))
                .ToListAsync();

            return Results.Ok(students);
        }
    }
}
