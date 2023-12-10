using AttendanceAPI.Security;
using Microsoft.EntityFrameworkCore;

namespace AttendanceAPI.DataModel
{
    public class AttendanceContext : DbContext
    {
        private ISecretsProvider<AppSecrets> _secretsProvider;

        public AttendanceContext(ISecretsProvider<AppSecrets> secretsProvider)
        {
            _secretsProvider = secretsProvider;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer(connectionString: _secretsProvider.Get().AttendanceConnection);
            
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<CourseModule> CourseModules { get; set; }
        public DbSet<ModuleRegistration> ModuleRegistrations { get; set; }
        public DbSet<TeachingSession> TeachingSessions { get; internal set; }
        public DbSet<CourseModuleClassList> CourseModuleClassLists { get; set; }
        public DbSet<CourseModuleClassListMember> CourseModuleClassListMembers { get; set; }
    }
}
