using System.ComponentModel.DataAnnotations;

namespace Attendance.DataModel.DTO
{
    public class CreateClassListDTO
    {
        [Required]
        public string Title { get; set; }
    }
}
