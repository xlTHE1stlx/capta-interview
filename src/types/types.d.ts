export interface responseQuery {
  error: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  statusCode?: number;
  errorType?: string;
}

export interface SuccessResponse {
  date: string;
}

export interface QueryParams {
  days?: string;
  hours?: string;
  date?: string;
}

export interface ValidatedParams {
  days: number;
  hours: number;
  startDate: string | null;
}
