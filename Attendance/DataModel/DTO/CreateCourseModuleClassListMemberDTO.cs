using System.ComponentModel.DataAnnotations;

namespace Attendance.DataModel.DTO
{
    public class CreateCourseModuleClassListMemberDTO
    {
        [Required]
        public int StudentId { get; set; }
    }
}
