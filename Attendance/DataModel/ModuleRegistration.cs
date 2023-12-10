using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AttendanceAPI.DataModel.DTO;

namespace AttendanceAPI.DataModel
{
    [Table("ModuleRegistration")]
    public class ModuleRegistration
    {
        [Key] public int Id { get; set; }

        
        public int StudentId { get; set; }

        public int CourseModuleId { get; set; }

        public Student? Student { get; set; }

        public CourseModule? CourseModule { get; set; }  

        public ModuleRegistrationDTO ToDTO()
        {
            if (Student == null || CourseModule == null)
            {
                throw new Exception("Course module or student is null");
            }

            return new ModuleRegistrationDTO(Id, Student, CourseModule);
        }
    }
}
