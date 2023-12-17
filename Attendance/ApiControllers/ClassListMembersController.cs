using AttendanceAPI.DataModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Attendance.ApiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassListMembersController : ControllerBase
    {
        private AttendanceContext _context;

        public ClassListMembersController(AttendanceContext context)
        {
            _context = context;
        }

        [HttpDelete("{id}")]
        public async Task<IResult> Delete(int id) 
        { 
            var member = await _context.ClassListMembers.FindAsync(id);
            if(member == null)
            {
                return Results.NotFound();
            }

            _context.Remove(member);
            await _context.SaveChangesAsync();
            return Results.NoContent();
        }
    }
}
