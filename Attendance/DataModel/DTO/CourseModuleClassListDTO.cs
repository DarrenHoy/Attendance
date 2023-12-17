using AttendanceAPI.DataModel;
using System.Dynamic;

namespace Attendance.DataModel.DTO
{
    public class CourseModuleClassListDTO 
    {
        private int _id;
        private string _title;

        public CourseModuleClassListDTO(int id, string title, dynamic links) 
        { 
            _id = id;
            _title = title;
            Links = links;
        }

        public int Id => _id;

        public string Title => _title;

        public dynamic Links { get; set;}

    }
}
