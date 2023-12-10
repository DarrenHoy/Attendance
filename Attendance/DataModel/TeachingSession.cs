using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceAPI.DataModel
{
    [Table("TeachingSession")]
    public class TeachingSession
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CourseModuleId { get; set; }

        [Required]
        public DateTime DateAndTime { get; set; }

        [Required]
        [Length(1,100, ErrorMessage = "The length of the title must not exceed 100 characters")]
        public string? Title { get; set; }


        public CourseModule? CourseModule { get; set; }
    }
}
