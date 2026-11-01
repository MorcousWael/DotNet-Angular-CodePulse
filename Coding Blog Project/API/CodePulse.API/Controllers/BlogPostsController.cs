using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostsController : ControllerBase
    {
        private readonly IBlogPostRepository blogPostRepository;
        private readonly ICategoryRepository categoryRepository;

        //Post: {apibaseurl}/api/blogposts
        public BlogPostsController(IBlogPostRepository blogPostRepository, ICategoryRepository categoryRepository)
        {
            this.blogPostRepository = blogPostRepository;
            this.categoryRepository = categoryRepository;
        }

        //https://localhost:7014/api/BlogPosts
        [HttpPost]
        public async Task<IActionResult> CreateBlogPosts([FromBody] CreateBlogPostRequestDto request)
        {
            //convert from dto to domain model
            var blogPost = new BlogPost
            {
                Title = request.Title,
                Author = request.Author,
                UrlHandle = request.UrlHandle,
                ShortDescription = request.ShortDescription,
                Content = request.Content,
                IsVisible = request.IsVisible,
                PublishedDate = request.PublishedDate,
                FeaturedImageUrl = request.FeaturedImageUrl,
                Categories = new List<Category>()
            };


            ///
            foreach (var categoryGuid in request.Categories)
            {
                var existingCategory = await categoryRepository.GetById(categoryGuid);
                if (existingCategory != null)
                {
                    blogPost.Categories.Add(existingCategory);
                }
            }

            blogPost = await blogPostRepository.CreateAsync(blogPost);

            // convert from domain to dto
            var response = new BlogPostDto
            {
                Id = blogPost.Id,
                Title = blogPost.Title,
                Author = blogPost.Author,
                UrlHandle = blogPost.UrlHandle,
                ShortDescription = blogPost.ShortDescription,
                Content = blogPost.Content,
                IsVisible = blogPost.IsVisible,
                PublishedDate = blogPost.PublishedDate,
                FeaturedImageUrl = blogPost.FeaturedImageUrl,
                Categories = blogPost.Categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlHandle = x.UrlHandle,
                }).ToList(),
            };
            return Ok(response);
        }

        //Get: api/blogposts
        [HttpGet]
        public async Task<IActionResult> GetAllBlogPosts()
        {
            var blogPosts = await blogPostRepository.GetAllAsync();
            //Convert to dto
            var response = new List<BlogPostDto>();

            foreach (var blogPost in blogPosts)
            {
                response.Add(new BlogPostDto
                {
                    Id = blogPost.Id,
                    Title = blogPost.Title,
                    Author = blogPost.Author,
                    UrlHandle = blogPost.UrlHandle,
                    ShortDescription = blogPost.ShortDescription,
                    Content = blogPost.Content,
                    IsVisible = blogPost.IsVisible,
                    PublishedDate = blogPost.PublishedDate,
                    FeaturedImageUrl = blogPost.FeaturedImageUrl,
                    Categories = blogPost.Categories.Select(x => new CategoryDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        UrlHandle = x.UrlHandle,
                    }).ToList(),
                });
            }
            return Ok(response);
        }

        //Get: api/blogposts/id
        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetBlogPostById([FromRoute] Guid id)
        {
            //get blogpost from repo
            var blogPost = await blogPostRepository.GetBlogPostAsync(id);

            if (blogPost == null)
            {
                return NotFound();
            }
            var response = new BlogPostDto
            {
                Id = blogPost.Id,
                Title = blogPost.Title,
                Author = blogPost.Author,
                UrlHandle = blogPost.UrlHandle,
                ShortDescription = blogPost.ShortDescription,
                Content = blogPost.Content,
                IsVisible = blogPost.IsVisible,
                PublishedDate = blogPost.PublishedDate,
                FeaturedImageUrl = blogPost.FeaturedImageUrl,
                Categories = blogPost.Categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlHandle = x.UrlHandle,
                }).ToList(),
            };
            return Ok(response);
        }
        //Put: api/blogposts/id
        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateBlogPostById([FromRoute] Guid id, UpdateBlogPostRequestDto request)
        {
            //dto to domain model
            var blogPost = new BlogPost
            {
                Id = id,
                Title = request.Title,
                Author = request.Author,
                UrlHandle = request.UrlHandle,
                ShortDescription = request.ShortDescription,
                Content = request.Content,
                IsVisible = request.IsVisible,
                PublishedDate = request.PublishedDate,
                FeaturedImageUrl = request.FeaturedImageUrl,
                Categories = new List<Category>()
            };
            foreach (var categoryGuid in request.Categories)
            {
                var existingCategory = await categoryRepository.GetById(categoryGuid);

                if (existingCategory != null)
                {

                    blogPost.Categories.Add(existingCategory);
                }
            }
            // call repo update
            var updatedBlogPost = await blogPostRepository.UpdateAsync(blogPost);
            if (updatedBlogPost == null)
            {
                return NotFound();
            }
            // Convert domain to dto
            var response = new BlogPostDto
            {
                Id = blogPost.Id,
                Title = blogPost.Title,
                Author = blogPost.Author,
                UrlHandle = blogPost.UrlHandle,
                ShortDescription = blogPost.ShortDescription,
                Content = blogPost.Content,
                IsVisible = blogPost.IsVisible,
                PublishedDate = blogPost.PublishedDate,
                FeaturedImageUrl = blogPost.FeaturedImageUrl,
                Categories = blogPost.Categories.Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlHandle = x.UrlHandle,
                }).ToList(),
            };
            return Ok(response);


        }

        // Delete:
        [HttpDelete]
        [Route("{blogId:Guid}")]
        public async Task<IActionResult> DeleteBlogPostById([FromRoute] Guid blogId)
        {
            var response = await blogPostRepository.DeleteById(blogId);
            if (response == null)
            {
                return NotFound();
            }
            return Ok(response);
        }
    }
}


