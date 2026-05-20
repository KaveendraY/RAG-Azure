using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;

namespace RAG_Azure.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IConfiguration _config;
        public FileUploadController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            var blobClient = new BlobContainerClient(_config["AzureBlobStorage:ConnectionString"], _config["AzureBlobStorage:ContainerName"]);
            await blobClient.CreateIfNotExistsAsync();

            var blob = blobClient.GetBlobClient(file.FileName);
            await using var stream = file.OpenReadStream();
            await blob.UploadAsync(stream, overwrite: true);

            return Ok(new { file.FileName });
        }
    }
}
