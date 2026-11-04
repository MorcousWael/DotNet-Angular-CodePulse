using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Data
{
    public class AuthDbContext : IdentityDbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        protected AuthDbContext()
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            //create roles
            var readerRoleId = "4239ccaa-c37e-4ec3-800b-f079b5c6130b";
            var writerRoleId = "d9cf56c5-02d5-4b63-b6da-a98b3c9817e9";
            var roles = new List<IdentityRole>
            {
                new IdentityRole()
                {
                    Id=readerRoleId,
                    Name="Reader",
                    NormalizedName = "Reader".ToUpper(),
                    ConcurrencyStamp =readerRoleId,
                },
                new IdentityRole()
                {
                    Id=writerRoleId,
                    Name="Writer",
                    NormalizedName = "Writer".ToUpper(),
                    ConcurrencyStamp =writerRoleId,
                }
            };

            //seed the roles
            builder.Entity<IdentityRole>().HasData(roles);

            //create adim user
            var adminUserId = "bc8b77f8-06b1-46bb-b29e-b751a44154b5";
            var admin = new IdentityUser()
            {
                Id = adminUserId,
                UserName = "morcouswael@gmail.com",
                Email = "morcouswael@gmail.com",
                NormalizedEmail = "morcouswael@gmail.com".ToUpper(),
                NormalizedUserName = "morcouswael@gmail.com".ToUpper(),
            };
            admin.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(admin,"admin@osa");

            builder.Entity<IdentityUser>().HasData(admin);

            //and give roles
            var adminRoles = new List<IdentityUserRole<string>>()
            {
                new()
                {
                    UserId = adminUserId,
                    RoleId = readerRoleId,
                },
                new()
                {
                    UserId = adminUserId,
                    RoleId = writerRoleId,
                }
            };
            builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);
        }
    }
}
