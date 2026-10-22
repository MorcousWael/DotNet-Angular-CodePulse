using CodePulse.API.Data;
using CodePulse.API.Repositories.Implementation;
using CodePulse.API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("CodePulseConnectionString"));
});

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

// 1. ADD CORS SERVICE HERE
builder.Services.AddCors(options =>
{
    options.AddPolicy("CodePulseCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Your Angular frontend origin
              .AllowAnyHeader()
              .AllowAnyMethod(); // Permits POST, PUT, DELETE, GET, OPTIONS
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. ADD CORS MIDDLEWARE HERE (Must be before UseAuthorization and MapControllers)
app.UseCors("CodePulseCorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();