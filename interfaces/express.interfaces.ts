/**
 * Generic payload for an API error.
 */
export interface APIError {
  name: string;
  message: string;
  status: number;
  stack?: string;
}

/**
 * Express local response object (set with `load()` controller).
 */
export interface User {
  accountName: string;
  poesessid: string;
}
