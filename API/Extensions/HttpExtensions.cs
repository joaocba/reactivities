using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage,
            int itemsPerPage, int totalItems, int totalPages)
        {

            // Create a new object to hold the pagination header
            var paginationHeader = new
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };

            // Serialize the pagination header to JSON
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));

            // Expose the pagination header to the client
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
