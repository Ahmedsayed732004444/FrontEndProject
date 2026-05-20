export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface RequestFilters {
  pageNumber?: number;
  pageSize?: number;
  searchValue?: string;
  sortColumn?: string;
  sortDirection?: 'ASC' | 'DESC';
}
