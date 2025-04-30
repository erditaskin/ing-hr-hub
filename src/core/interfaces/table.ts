import { TemplateResult } from 'lit';

export interface ITableSettingsState {
  currentPage: number;
  itemsPerPage: number;
  visibleColumns: string[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  selectedRows: string[];
  filters: {
    [key: string]: string;
  };
}

export interface ITableColumn<T = any> {
  key: keyof T | 'actions';
  title: string;
  render?: (item: T) => string | number | HTMLElement | TemplateResult;
  filterType?: 'text' | 'select';
  filterOptions?: Array<{ value: string; label: string }>;
  isAction?: boolean;
}

export interface ITableProps<T = any> {
  data: T[];
  columns: ITableColumn<T>[];
  settings: ITableSettingsState;
  isVisibleFilterChangeActive?: boolean;
  isFilteringActive?: boolean;
  isSortingActive?: boolean;
  isPaginationActive?: boolean;
  onPageChange?: (page: number) => void;
  onSortChange?: (column: keyof T | 'actions', direction: 'asc' | 'desc') => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onVisibleColumnsChange?: (columns: string[]) => void;
  onFiltersChange?: (filters: { [K in keyof T]?: string }) => void;
}
