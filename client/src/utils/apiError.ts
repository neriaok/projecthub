import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

/** Extracts the server's { success: false, error } message from an RTK Query error. */
export function getApiErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback = 'אירעה שגיאה. נסו שוב.',
): string {
  if (!error) return fallback;
  if ('status' in error) {
    const data = error.data as { error?: unknown } | undefined;
    if (typeof data?.error === 'string') return data.error;
    if (error.status === 'FETCH_ERROR') return 'אין חיבור לשרת. בדקו את החיבור ונסו שוב.';
  }
  return fallback;
}
