using Attendance.DataModel.DTO;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceAPI.DataModel
{
    [Table("CourseModuleClassList")]
    public class CourseModuleClassList
    {
        [Key] public int Id { get; set; }

        [Required]
        public int CourseModuleId { get; set; }
        
        [Required]
        public string Title { get; set; }

        public CourseModule CourseModule { get; set; }  

        public ICollection<CourseModuleClassListMember> Members { get; set; }

        public CourseModuleClassListDTO ToDTO()
        {
            return new CourseModuleClassListDTO(Id, Title);
        }
    }
}
