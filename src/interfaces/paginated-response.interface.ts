export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  totalDocuments: number;
  totalPages: number;
  data: T[];
}
