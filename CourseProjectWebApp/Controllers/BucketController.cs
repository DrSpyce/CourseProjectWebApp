using Azure.Storage.Blobs;
using Microsoft.Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;

namespace CourseProjectWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BucketController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;

        const string Bucket = "testbucketspycee";

        public BucketController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        public async Task<JsonResult> GetAllBucketAsync()
        {
            var data = await _s3Client.ListBucketsAsync();
            return new JsonResult(data);
        }

        [HttpPost]
        [Route("Upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            var bucketExists = await _s3Client.DoesS3BucketExistAsync(Bucket);
            if (!bucketExists) return NotFound("Error occured");
            var reques = new PutObjectRequest()
            {
                BucketName = Bucket,
                Key = file.FileName,
                InputStream = file.OpenReadStream()
            };
            var res = await _s3Client.PutObjectAsync(reques);
            return Ok("file uploaded");
        }
    }
}
