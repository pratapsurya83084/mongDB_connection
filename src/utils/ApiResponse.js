class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; //so HTTP status codes less than 400 generally represent successful responses.
    //200 for success ,400 for bad request,500 for server errors.

  }
}


