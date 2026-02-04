export function getSafeErrorMessage(error: any): string {
  if (!error) return "Something went wrong. Please try again.";

  // Network / connectivity issues
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return "Network error. Please check your connection.";
  }

  // HTTP errors
  if (error.status === 401) {
    return "Invalid email or password.";
  }

  if (error.status === 403) {
    return "You are not authorized to perform this action.";
  }

  if (error.status === 404) {
    return "Service not found. Please try again later.";
  }

  if (error.status >= 500) {
    return "Server error. Please try again later.";
  }

  // App-level auth errors
  if (error.message?.toLowerCase().includes("credentials")) {
    return "Invalid email or password.";
  }

  // Default safe message
  return "Something went wrong. Please try again.";
}