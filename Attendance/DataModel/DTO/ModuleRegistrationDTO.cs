using System.ComponentModel.DataAnnotations;

namespace AttendanceAPI.DataModel.DTO
{
    public class ModuleRegistrationDTO
    {
        public ModuleRegistrationDTO(int id, Student student, CourseModule courseModule)
        {
            Id = id;
            Student = student;
            CourseModule = courseModule;
        }

        public int Id { get; init; }
        public Student Student { get; init; }
        public CourseModule CourseModule { get; init; }
    }
}
