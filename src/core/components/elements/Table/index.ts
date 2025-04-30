import { LitElement, TemplateResult, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ITableProps, ITableColumn, ITableSettingsState } from '@/core/interfaces/table';
import { i18n } from '@/core/services/i18n';
import '../StyledPopover';
import '../IconButton';
import './filters/TextFilterInput';
import './filters/SelectFilterInput';
import './pagination/Pagination';
import './pagination/ItemsPerPage';

@customElement('app-table')
export class Table<T = any> extends LitElement {
  @property({ type: Array }) data: T[] = [];
  @property({ type: Array }) columns: ITableColumn<T>[] = [];
  @property({ type: Object }) settings: ITableSettingsState = {
    currentPage: 1,
    itemsPerPage: 10,
    visibleColumns: [],
    sortColumn: '',
    sortDirection: 'asc',
    selectedRows: [],
    filters: {},
  };

  @property({ type: Boolean })
  isVisibleFilterChangeActive = false;

  @property({ type: Boolean })
  isFilteringActive = true;

  @property({ type: Boolean })
  isSortingActive = true;

  @property({ type: Boolean })
  isPaginationActive = false;

  @property({ type: Function })
  onVisibleColumnsChange: (columns: string[]) => void = () => {};

  @property({ type: Function })
  onFilterChange: (filters: Record<string, string>) => void = () => {};

  @property({ type: Function })
  onSortChange: (column: string, direction: string) => void = () => {};

  @property({ type: Function })
  onRowSelect: (rows: string[]) => void = () => {};

  @property({ type: Function })
  onPageChange: (page: number) => void = () => {};

  @property({ type: Function })
  onItemsPerPageChange: (itemsPerPage: number) => void = () => {};

  constructor() {
    super();
    i18n.addHost(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18n.removeHost(this);
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--color-bg-primary, #fff);
    }

    th,
    td {
      padding: var(--spacing-sm, 12px);
      text-align: left;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }

    th {
      background: var(--color-bg-secondary, #f9fafb);
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      position: relative;
    }

    tr:hover td {
      background: var(--color-bg-hover, #f3f4f6);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding-right: var(--spacing-xl);
      cursor: default;
    }

    .header-title {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      cursor: pointer;
    }

    .header-title:hover {
      color: var(--color-primary);
    }

    .header-title.has-active-filter {
      color: var(--color-primary);
    }

    sl-icon[name='funnel'] {
      font-size: 14px;
      color: var(--color-text-secondary);
    }

    sl-icon[name='funnel'].has-active-filter {
      color: var(--color-primary);
    }

    /* Remove the arrow for column settings icon */
    .header-content:has(sl-icon[name='eye'])::after {
      display: none;
    }

    /* Override popover styles */
    app-popover {
      position: static;
    }

    app-popover::part(trigger) {
      position: relative;
      z-index: 1;
    }

    app-popover::part(content) {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: var(--spacing-xs);
      padding: 0;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      background: var(--color-bg-primary);
    }

    .column-visibility-container {
      padding: var(--spacing-sm);
      min-width: 200px;
      max-height: 300px;
      overflow-y: auto;
    }

    .column-visibility-title {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-xs);
    }

    .column-visibility-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .column-visibility-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-sm);
      cursor: pointer;
      white-space: nowrap;
    }

    .column-visibility-item input {
      margin: 0;
    }

    .actions-cell {
      width: 100px;
    }

    .checkbox-cell {
      width: 40px;
      text-align: center;
    }

    .pagination-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--color-border);
    }

    .filter-container {
      padding: var(--spacing-sm);
      min-width: 250px;
    }

    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-xs);
    }

    .filter-title {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text-secondary);
    }

    .filter-input-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    app-text-filter-input,
    app-select-filter-input {
      flex: 1;
      min-width: 0;
    }

    .filter-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .filter-action-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--spacing-xs);
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .filter-action-button:hover {
      color: var(--color-primary);
    }

    sl-icon-button::part(base) {
      color: var(--color-text-secondary);
      padding: var(--spacing-xs);
    }

    sl-icon-button::part(base):hover {
      color: var(--color-primary);
    }

    .no-data-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl, 32px);
      text-align: center;
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-md);
      margin: var(--spacing-md) 0;
    }

    .no-data-icon {
      font-size: 48px;
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-md);
    }

    .no-data-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .no-data-message {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
  }

  private handleHeaderClick(column: ITableColumn<T>) {
    if (column.isAction) return;

    const newDirection =
      this.settings.sortColumn === column.key && this.settings.sortDirection === 'asc'
        ? 'desc'
        : 'asc';

    this.onSortChange(String(column.key), newDirection);
    this.requestUpdate();
  }

  private handleCheckboxChange(id: string, checked: boolean) {
    const newSelected = checked
      ? [...this.settings.selectedRows, id]
      : this.settings.selectedRows.filter(rowId => rowId !== id);

    this.onRowSelect(newSelected);
  }

  private handleSelectAll(checked: boolean) {
    const newSelected = checked ? this.data.map(item => (item as any).id) : [];
    this.onRowSelect(newSelected);
  }

  private handleFilterApply(column: ITableColumn<T>, value: string) {
    this.onFilterChange({
      ...this.settings.filters,
      [String(column.key)]: value,
    });
  }

  private handleVisibilityChange(columnKey: keyof T | 'actions', checked: boolean) {
    const newVisibleColumns = checked
      ? [...(this.settings.visibleColumns || []), String(columnKey)]
      : (this.settings.visibleColumns || []).filter(key => key !== String(columnKey));

    const event = new CustomEvent('visible-columns-change', {
      detail: newVisibleColumns,
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  private handleFilterChange(key: keyof T | 'actions', e: CustomEvent) {
    const value = e.detail?.value ?? '';
    const newFilters = {
      ...this.settings.filters,
      [String(key)]: value,
    };
    this.settings = {
      ...this.settings,
      filters: newFilters,
    };
    this.onFilterChange(newFilters);
  }

  private renderHeaderCell(column: ITableColumn<T>) {
    const isSorted = this.settings.sortColumn === column.key;
    const sortIcon = this.settings.sortDirection === 'asc' ? '↑' : '↓';
    const filterValue = this.settings.filters[String(column.key)] || '';
    const hasActiveFilter = !!filterValue;

    if (column.isAction) {
      return html`
        <th>
          <app-styled-popover>
            <div slot="trigger" class="header-content">
              <sl-icon name="eye" label="Column Settings"></sl-icon>
            </div>
            <div class="column-visibility-container">
              <div class="column-visibility-title">
                ${i18n.t('common.table.columns.visibility.title')}
              </div>
              <div class="column-visibility-list">
                ${this.columns
                  .filter(col => !col.isAction)
                  .map(
                    col => html`
                      <label class="column-visibility-item">
                        <input
                          type="checkbox"
                          .checked=${this.settings.visibleColumns.includes(String(col.key))}
                          @change=${(e: Event) =>
                            this.handleVisibilityChange(
                              col.key,
                              (e.target as HTMLInputElement).checked
                            )}
                        />
                        ${col.title}
                      </label>
                    `
                  )}
              </div>
            </div>
          </app-styled-popover>
        </th>
      `;
    }

    let filterContent: TemplateResult | '' = '';
    if (column.filterType && this.isFilteringActive) {
      filterContent = html`
        <div class="filter-container">
          <div class="filter-header">
            <span class="filter-title">${i18n.t('common.table.filter.by')} ${column.title}</span>
          </div>
          <div class="filter-input-wrapper">
            ${column.filterType === 'select'
              ? html`
                  <app-select-filter-input
                    .value=${this.settings.filters[String(column.key)] || ''}
                    .columnKey=${String(column.key)}
                    .options=${column.filterOptions || []}
                    @filter-change=${(e: CustomEvent) => this.handleFilterChange(column.key, e)}
                  ></app-select-filter-input>
                `
              : html`
                  <app-text-filter-input
                    .value=${this.settings.filters[String(column.key)] || ''}
                    .columnKey=${String(column.key)}
                    @filter-change=${(e: CustomEvent) => this.handleFilterChange(column.key, e)}
                  ></app-text-filter-input>
                `}
            <div class="filter-actions">
              <sl-icon-button
                name="search"
                label=${i18n.t('common.table.filter.apply')}
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this.handleFilterApply(column, filterValue);
                }}
              ></sl-icon-button>
              ${filterValue
                ? html`
                    <sl-icon-button
                      name="x-circle"
                      label=${i18n.t('common.table.filter.clear')}
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        this.handleFilterApply(column, '');
                      }}
                    ></sl-icon-button>
                  `
                : ''}
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <th>
        <app-styled-popover>
          <div slot="trigger" class="header-content">
            <div
              class="header-title ${hasActiveFilter ? 'has-active-filter' : ''}"
              @click=${(e: Event) => {
                if (!column.isAction && this.isSortingActive) {
                  e.preventDefault();
                  this.handleHeaderClick(column);
                }
              }}
            >
              ${column.title} ${isSorted && this.isSortingActive ? sortIcon : ''}
            </div>
            ${column.filterType && this.isFilteringActive
              ? html`
                  <sl-icon
                    name="funnel"
                    label="Filter"
                    class="${hasActiveFilter ? 'has-active-filter' : ''}"
                  ></sl-icon>
                `
              : ''}
          </div>
          ${filterContent}
        </app-styled-popover>
      </th>
    `;
  }

  private filterData(data: T[]): T[] {
    if (
      !this.isFilteringActive ||
      !this.settings.filters ||
      Object.keys(this.settings.filters).length === 0
    ) {
      return data;
    }

    return data.filter(item => {
      return Object.entries(this.settings.filters).every(([key, filterValue]) => {
        if (!filterValue) return true;

        const value = String((item as any)[key] || '').toLowerCase();
        return value.includes(filterValue.toLowerCase());
      });
    });
  }

  private renderNoDataState(hasFilters: boolean) {
    return html`
      <div class="no-data-container">
        <sl-icon
          name=${hasFilters ? 'filter-circle-x' : 'database-x'}
          class="no-data-icon"
        ></sl-icon>
        <div class="no-data-title">
          ${hasFilters
            ? i18n.t('common.table.no_data.filtered.title')
            : i18n.t('common.table.no_data.empty.title')}
        </div>
        <div class="no-data-message">
          ${hasFilters
            ? i18n.t('common.table.no_data.filtered.message')
            : i18n.t('common.table.no_data.empty.message')}
        </div>
      </div>
    `;
  }

  render() {
    const visibleColumns = Array.isArray(this.settings.visibleColumns)
      ? this.settings.visibleColumns
      : [];

    const filteredColumns = this.columns.filter(
      col => !col.isAction && visibleColumns.includes(String(col.key))
    );

    const actionColumns = this.columns.filter(col => col.isAction);
    const allVisibleColumns = [...filteredColumns, ...actionColumns];

    // First check if we have any data at all
    if (this.data.length === 0) {
      return this.renderNoDataState(false);
    }

    // Then filter the data
    const filteredData = this.filterData(this.data);

    // Calculate pagination on filtered data
    const start = (this.settings.currentPage - 1) * this.settings.itemsPerPage;
    const end = start + this.settings.itemsPerPage;
    const paginatedData = filteredData.slice(start, end);

    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input
                  type="checkbox"
                  .checked=${this.settings.selectedRows.length === filteredData.length}
                  @change=${(e: Event) =>
                    this.handleSelectAll((e.target as HTMLInputElement).checked)}
                />
              </th>
              ${allVisibleColumns.map(col => this.renderHeaderCell(col))}
            </tr>
          </thead>
          <tbody>
            ${filteredData.length === 0
              ? html`
                  <tr>
                    <td colspan=${allVisibleColumns.length + 1}>${this.renderNoDataState(true)}</td>
                  </tr>
                `
              : paginatedData.map(
                  item => html`
                    <tr>
                      <td class="checkbox-cell">
                        <input
                          type="checkbox"
                          .checked=${this.settings.selectedRows.includes((item as any).id)}
                          @change=${(e: Event) =>
                            this.handleCheckboxChange(
                              (item as any).id,
                              (e.target as HTMLInputElement).checked
                            )}
                        />
                      </td>
                      ${allVisibleColumns.map(
                        col => html`
                          <td class=${col.isAction ? 'actions-cell' : ''}>
                            ${col.render ? col.render(item) : (item as any)[col.key]}
                          </td>
                        `
                      )}
                    </tr>
                  `
                )}
          </tbody>
        </table>
        ${this.isPaginationActive
          ? html`
              <div class="pagination-container">
                <app-items-per-page
                  .itemsPerPage=${this.settings.itemsPerPage}
                  @items-per-page-change=${(e: CustomEvent) => this.onItemsPerPageChange(e.detail)}
                ></app-items-per-page>
                <app-pagination
                  .currentPage=${this.settings.currentPage}
                  .itemsPerPage=${this.settings.itemsPerPage}
                  .totalItems=${filteredData.length}
                  @page-change=${(e: CustomEvent) => this.onPageChange(e.detail)}
                ></app-pagination>
              </div>
            `
          : html`
              <div class="pagination-container">
                <app-items-per-page
                  .itemsPerPage=${this.settings.itemsPerPage}
                  @items-per-page-change=${(e: CustomEvent) => this.onItemsPerPageChange(e.detail)}
                ></app-items-per-page>
              </div>
            `}
      </div>
    `;
  }
}
