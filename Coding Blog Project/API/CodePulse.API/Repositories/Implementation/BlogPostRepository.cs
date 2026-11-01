using CodePulse.API.Data;
using CodePulse.API.Models.Domain;
using CodePulse.API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.API.Repositories.Implementation
{
    public class BlogPostRepository : IBlogPostRepository
    {
        private readonly AppDbContext dbContext;
        public BlogPostRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<BlogPost> CreateAsync(BlogPost blogPost)
        {
            await this.dbContext.AddAsync(blogPost);
            await this.dbContext.SaveChangesAsync();
            return blogPost;
        }

        public async Task<IEnumerable<BlogPost>> GetAllAsync()
        {
            return await dbContext.BlogPosts.Include(x => x.Categories).ToListAsync();
        }

        public async Task<BlogPost?> GetBlogPostAsync(Guid id)
        {
           return await dbContext.BlogPosts.Include(x => x.Categories).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<BlogPost?> UpdateAsync(BlogPost blogPost)
        {
            var existingBlogPost = await dbContext.BlogPosts.Include(x => x.Categories)
                .FirstOrDefaultAsync(x => x.Id == blogPost.Id);
            if (existingBlogPost == null)
            {
                return null;
            }
            //update blogPost
            dbContext.Entry(existingBlogPost).CurrentValues.SetValues(blogPost);
            // update categories
            existingBlogPost.Categories = blogPost.Categories;
            await dbContext.SaveChangesAsync();
            return blogPost;
        }
        public async Task<BlogPost?> DeleteById(Guid blogId)
        {
            var existingBlogPost = await dbContext.BlogPosts.FirstOrDefaultAsync(x => x.Id == blogId);
            if (existingBlogPost is null)
            {
                return null;
            }

            dbContext.BlogPosts.Remove(existingBlogPost);
            await dbContext.SaveChangesAsync();
            return existingBlogPost;
        }
    }
}
