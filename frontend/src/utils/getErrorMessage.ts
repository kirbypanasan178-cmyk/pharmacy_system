
// unknown - errors could be anything and output is always a string
// instead of crashing or guessing, it standardizes errors into a readable message
export const getErrorMessage = (error: unknown): string => {
    // if the error is a real JS Error object
    if (error instanceof Error) return error.message
    // checks if  the error looks like HTTP/API error
    if (
        typeof error === "object" && // error is object type
        error !== null &&            // error is not null
        "response" in error          // has a response field
    ) {
        const apiError = error as any  // force to treat it as a flexbile object error because TS doesnt know it
        return apiError.response?.data?.message || "Order failed"
    }

    return "Order failed"
}