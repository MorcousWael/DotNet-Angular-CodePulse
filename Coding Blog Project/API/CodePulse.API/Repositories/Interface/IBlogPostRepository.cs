using CodePulse.API.Models.Domain;

namespace CodePulse.API.Repositories.Interface
{
    public interface IBlogPostRepository
    {
        Task<BlogPost> CreateAsync(BlogPost blogPost);

        Task<IEnumerable<BlogPost>> GetAllAsync();
        Task<BlogPost?> GetBlogPostAsync(Guid id);

        Task<BlogPost?> DeleteById(Guid categoryId);

        Task<BlogPost?> UpdateAsync(BlogPost blogPost);

    }
}
