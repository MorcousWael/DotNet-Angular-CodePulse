using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using CodePulse.API.Repositories.Interface;

namespace CodePulse.API.Repositories.Implementation
{
    public class ImageRepository : IImageRepository
    {
        private readonly IWebHostEnvironment webHostEnvironment;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly AppDbContext appDbContext;

        public ImageRepository(IWebHostEnvironment webHostEnvironment,IHttpContextAccessor httpContextAccessor,AppDbContext appDbContext) {
            this.webHostEnvironment = webHostEnvironment;
            this.httpContextAccessor = httpContextAccessor;
            this.appDbContext = appDbContext;
        }
        public async Task<BlogImage> Upload(IFormFile file, BlogImage blogImage)
        {
            //Upload images to folder
            var localpath = Path.Combine(webHostEnvironment.ContentRootPath, "Images",$"{blogImage.FileName}{blogImage.FileExtension}");

            using var stream = new FileStream(localpath, FileMode.Create);
            await file.CopyToAsync(stream);

            // Update database
            //https://domain/images/filename.ext
            var httpRequest = httpContextAccessor.HttpContext.Request;
            var urlPath = $"{httpRequest.Scheme}://{httpRequest.Host}{httpRequest.PathBase}/Images/{blogImage.FileName}{blogImage.FileExtension}";

            blogImage.Url = urlPath;

            await appDbContext.BlogImages.AddAsync(blogImage);
            await appDbContext.SaveChangesAsync();
            return blogImage;
        }
    }
}
