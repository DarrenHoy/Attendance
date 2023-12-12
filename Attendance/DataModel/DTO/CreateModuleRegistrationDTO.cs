using System.ComponentModel.DataAnnotations;

namespace AttendanceAPI.DataModel.DTO
{
    public class CreateModuleRegistrationDTO
    {
        [Required]
        public int StudentId { get; set; }

    }
}
