using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// This is a generic class that can be used to return a result from a method, it can be a success or a failure

namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }

        // Generic type T
        public T Value { get; set; }
        public string Error { get; set; }

        // Method to return a Success result
        public static Result<T> Success(T value) => new Result<T> { IsSuccess = true, Value = value };

        // Method to return a Failure result
        public static Result<T> Failure(string error) => new Result<T> { IsSuccess = false, Error = error };
    }
}