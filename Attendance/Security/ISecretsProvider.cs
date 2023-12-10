namespace AttendanceAPI.Security
{
    public interface ISecretsProvider<T>
    {
        T Get();
    }
}
