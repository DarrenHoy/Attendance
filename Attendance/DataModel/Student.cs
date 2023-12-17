using Attendance.DataModel.DTO;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceAPI.DataModel
{
    [Table("Student")]
    public class Student
    {
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string StudentNumber { get; set; }

        public StudentInfoDTO ToDTO()
        {
            return new StudentInfoDTO(Id, StudentNumber, FirstName, Surname);
        }
    }
}
