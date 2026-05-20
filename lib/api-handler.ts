import { NextResponse } from "next/server";

/**
 * Wraps an API route handler with a uniform try/catch that returns
 * a safe 500 response and never leaks internal error details.
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse | Response>
) {
  return async (...args: T): Promise<NextResponse | Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("[API] Unhandled error:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorName = error instanceof Error ? error.name : "Error";

      return NextResponse.json(
        { 
          error: "Internal server error",
          details: errorMessage,
          name: errorName,
          stack: errorStack,
        },
        { status: 500 }
      );
    }
  };
}
