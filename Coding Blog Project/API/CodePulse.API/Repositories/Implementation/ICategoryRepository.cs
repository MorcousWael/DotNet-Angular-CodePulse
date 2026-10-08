using CodePulse.API.Models.Domain;

namespace CodePulse.API.Repositories.Implementation
{
    public interface ICategoryRepository
    {
        Task<Category> CreateAsync(Category category);
    }
}
