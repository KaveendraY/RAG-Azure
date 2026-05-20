using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using RAG.API.Services;S

namespace RAG_Azure.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : Controller
    {
        private readonly AzureSearchService _searchService;
        private readonly AzureAIService _aiService;

        public ChatController(AzureSearchService searchService, AzureAIService aiService)
        {
            _searchService = searchService;
            _aiService = aiService;
        }

        [HttpPost]

        public async Task<IActionResult> Post([FromBody] ChatRequest request)
        {
            if(string.IsNullOrWhiteSpace(request.Message))
                return BadRequest("Message cannot be empty.");
            var relevantChunks = await _searchService.SearchRelevantChunks(request.Message);
            var context = string.Join("\n", relevantChunks);
            var answer = await _aiService.AskQuestionAsync(request.Message, context);

            return Ok(new {question = request.Message, answer });
        }

        public IActionResult Index()
        {
    

            return View();
        }
    }
}
