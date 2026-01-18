import { useState, useMemo, useCallback } from "react";

interface UseTableControlsOptions<T> {
  data: T[];
  initialPageSize?: number;
  searchFields?: (keyof T)[];
  initialSortField?: keyof T | null;
  initialSortDirection?: "asc" | "desc";
}

interface SortConfig<T> {
  field: keyof T | null;
  direction: "asc" | "desc";
}

export function useTableControls<T>({
  data,
  initialPageSize = 10,
  searchFields = [],
  initialSortField = null,
  initialSortDirection = "asc",
}: UseTableControlsOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    field: initialSortField,
    direction: initialSortDirection,
  });
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter data by search query
  const searchedData = useMemo(() => {
    if (!searchQuery || searchFields.length === 0) return data;
    
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowerQuery);
        }
        if (typeof value === "number") {
          return value.toString().includes(lowerQuery);
        }
        return false;
      })
    );
  }, [data, searchQuery, searchFields]);

  // Apply additional filters
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return searchedData;
    
    return searchedData.filter((item) =>
      Object.entries(filters).every(([key, value]) => {
        if (!value || value === "all") return true;
        return String(item[key as keyof T]) === value;
      })
    );
  }, [searchedData, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.field) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.field!];
      const bValue = b[sortConfig.field!];
      
      if (aValue === bValue) return 0;
      
      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Reset page when data changes
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Handle search with page reset
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Handle filter change with page reset
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  // Handle sort
  const handleSort = useCallback((field: keyof T) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Navigate to page
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  return {
    // Data
    data: paginatedData,
    allData: sortedData,
    totalItems: sortedData.length,
    
    // Pagination
    currentPage,
    totalPages,
    pageSize,
    setPageSize,
    goToPage,
    goToNextPage,
    goToPrevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    
    // Search
    searchQuery,
    handleSearch,
    
    // Filters
    filters,
    handleFilterChange,
    setFilters,
    
    // Sort
    sortConfig,
    handleSort,
    
    // Utils
    resetPage,
    
    // Pagination info
    startIndex: (currentPage - 1) * pageSize + 1,
    endIndex: Math.min(currentPage * pageSize, sortedData.length),
  };
}
