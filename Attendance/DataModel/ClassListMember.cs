using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AttendanceAPI.DataModel
{
    [Table("CourseModuleClassListMembers")]
    public class ClassListMember
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CourseModuleClassListId { get; set; }

        [Required]
        public int StudentId { get; set; }

        
        public Student? Student { get; set; }
        
    }
}