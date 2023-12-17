using Attendance.DataModel.DTO;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Dynamic;
using System.Text.Json.Serialization;

namespace AttendanceAPI.DataModel
{
    [Table("CourseModuleClassList")]
    public class CourseModuleClassList
    {
        [Key] public int Id { get; set; }

        [Required]
        [JsonIgnore]
        public int CourseModuleId { get; set; }
        
        [Required]
        public string Title { get; set; }

        [JsonIgnore]
        public CourseModule CourseModule { get; set; }

        [JsonIgnore]
        public ICollection<ClassListMember> Members { get; set; }


        public CourseModuleClassListDTO ToDTO(dynamic links)
        {
            return new CourseModuleClassListDTO(Id, Title, links);
        }
    }
}
