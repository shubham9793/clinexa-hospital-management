export function getErrorMessage(error: any): string {
  if (error?.error?.message) {
    return error.error.message;
  }

  if (typeof error?.error === 'string') {
    return error.error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
