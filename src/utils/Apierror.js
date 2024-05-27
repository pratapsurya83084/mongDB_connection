class ApiError extends Error {
  constructor(
    statusCode,                       //statusCode: The HTTP status code associated with the error (e.g., 404, 500).
    message = "Something went wrong", //message: A descriptive error message, defaulting to "Something went wrong"
    errors = [],                    //errors: An array to hold any additional error details (default is an empty array).
    stack = "",                   //stack: The stack trace of the error (default is an empty string).
  ) 
  {
    super(message)  //super(message): Calls the constructor of the parent Error class, passing the message parameter. This sets the message property of the Error object

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
