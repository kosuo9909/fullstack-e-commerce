namespace API.Errors;

public class ApiErrorResponse(int statusCode, string message = null, string? details = null)

{
    public int StatusCode { get; set; } = statusCode;
    public string Message { get; set; } = message;
    public string? Details { get; set; } = details;
}
