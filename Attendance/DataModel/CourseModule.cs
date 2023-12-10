using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AttendanceAPI.DataModel
{
    [Table("CourseModule")]
    public class CourseModule
    {
        [Key] public int Id { get; set; }
        [Required]
        public string? Code { get; set; }
        [Required]
        public string? Title { get; set; }

        [JsonIgnore]
        public ICollection<ModuleRegistration> RegisteredStudents { get; set; } = new List<ModuleRegistration>();
    }
}
