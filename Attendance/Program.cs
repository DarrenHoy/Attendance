using AttendanceAPI.DataModel;
using AttendanceAPI.Security;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddScoped<ISecretsProvider<AppSecrets>, FileBasedSecretsProvider>(sp => new FileBasedSecretsProvider("secrets.json", sp.GetRequiredService<IWebHostEnvironment>()));
builder.Services.AddDbContext<AttendanceContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();

app.Run();
