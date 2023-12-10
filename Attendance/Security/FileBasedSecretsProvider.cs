using System.Text.Json;

namespace AttendanceAPI.Security
{
    public class FileBasedSecretsProvider : ISecretsProvider<AppSecrets>
    {
        private string _path;
        private IWebHostEnvironment _env;
        private AppSecrets? _secrets;

        public FileBasedSecretsProvider(string path, IWebHostEnvironment env)
        {
            _path = path;
            _env = env;

        }
        public AppSecrets Get()
        {
            if(_secrets == null )
            {
                using(var file = File.OpenText(Path.Combine(_env.ContentRootPath, _path)))
                {
                    var data = file.ReadToEnd();
                    _secrets = JsonSerializer.Deserialize<AppSecrets>(data);
                }

                
            }

            return _secrets;
        }
    }
}
