import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { i18n } from '@/core/services/i18n';
import '@/core/components/AppPageContainer';
import '@/core/components/AppPageHeader';
import '@/core/components/AppPageHeader/AppPageBreadCrumbs';
import '@/core/components/elements/Button';
import '../components/EmployeeTable';
import { AppState, store } from '@/core/store';
import { IEmployee } from '../interfaces/employee';
import { ITableSettingsState } from '@/core/interfaces/table';
import {
  setEmployeeTableCurrentPage,
  setEmployeeTableFilters,
  setEmployeeTableItemsPerPage,
  setEmployeeTableSelectedRow,
  setEmployeeTableSortColumn,
  setEmployeeTableSortDirection,
  setEmployeeTableVisibleColumns,
  resetEmployeeTableVisibleColumns,
  resetEmployeeTablePagination,
  resetEmployeeTableFilters,
  resetEmployeeTableData,
  deleteEmployee,
} from '../reducers/employee';
import { addEmployees } from '../reducers/employee';
import { mockEmployees } from '../data/employee';

const DEFAULT_VISIBLE_COLUMNS = ['firstName', 'email', 'phoneNumber', 'department'];

@customElement('employee-list-page')
export class EmployeeListPage extends LitElement {
  @state() private employees: IEmployee[] = [];
  @state() private tableSettings: ITableSettingsState = (store.getState() as any).employee.table;

  static styles = css`
    :host {
      display: block;
    }

    .content {
      padding-top: var(--spacing-md);
    }

    .dev-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 8px 0;
      width: 100%;
      box-sizing: border-box;
    }

    .dev-toolbar app-button {
      flex: 0 0 auto;
    }
  `;

  constructor() {
    super();
    i18n.addHost(this);
    this.updateState();

    store.subscribe(() => {
      this.updateState();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18n.removeHost(this);
  }

  private updateState() {
    const state = store.getState() as any;
    this.employees = state.employee.data;

    // Check if visibleColumns is empty and dispatch default columns
    if (state.employee.table.visibleColumns?.length === 0) {
      store.dispatch(setEmployeeTableVisibleColumns(DEFAULT_VISIBLE_COLUMNS));
    }

    this.tableSettings = {
      ...state.employee.table,
      visibleColumns: state.employee.table.visibleColumns,
    };
  }

  private get breadcrumbs() {
    return [
      { label: i18n.t('dashboard.title.main'), link: '/' },
      { label: i18n.t('employees.title.main'), link: '/employees' },
    ];
  }

  private handleCreateClick() {
    window.history.pushState({}, '', '/employee');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  private handleVisibleColumnsChange(columns: string[] | CustomEvent) {
    const newColumns = columns instanceof CustomEvent ? columns.detail : columns;

    if (Array.isArray(newColumns)) {
      store.dispatch(setEmployeeTableVisibleColumns(newColumns));
    } else {
      console.error('Expected array of columns but got:', newColumns);
    }
  }

  private handleFilterChange(filters: Record<string, string> | CustomEvent) {
    const currentState = store.getState() as AppState;
    const currentFilters = currentState.employee.table.filters;
    const newFilter = filters instanceof CustomEvent ? filters.detail : filters;

    if (newFilter && typeof newFilter === 'object') {
      const mergedFilters = {
        ...currentFilters,
        ...newFilter,
      };

      store.dispatch(setEmployeeTableFilters(mergedFilters));
    } else {
      console.error('Expected filter object but got:', newFilter);
    }
  }

  private handleSortChange(sortColumn: string, sortDirection: string) {
    store.dispatch(setEmployeeTableSortColumn(sortColumn));
    store.dispatch(setEmployeeTableSortDirection(sortDirection));
  }

  private handleRowSelect(row: IEmployee) {
    store.dispatch(setEmployeeTableSelectedRow(row));
  }

  private handlePageChange(page: number | CustomEvent) {
    const newPage = page instanceof CustomEvent ? page.detail : page;

    if (typeof newPage === 'number') {
      store.dispatch(setEmployeeTableCurrentPage(newPage));
    } else {
      console.error('Expected number for page but got:', newPage);
    }
  }

  private handleItemsPerPageChange(itemsPerPage: number | CustomEvent) {
    const newItemsPerPage =
      itemsPerPage instanceof CustomEvent ? itemsPerPage.detail : itemsPerPage;

    if (typeof newItemsPerPage === 'number') {
      store.dispatch(setEmployeeTableItemsPerPage(newItemsPerPage));
    } else {
      console.error('Expected number for itemsPerPage but got:', newItemsPerPage);
    }
  }

  private handleDeleteEmployee(employeeOrEvent: IEmployee | CustomEvent) {
    const employee =
      employeeOrEvent instanceof CustomEvent ? employeeOrEvent.detail : employeeOrEvent;

    store.dispatch(deleteEmployee(employee.id));
  }

  render() {
    return html`
      <app-page-container>
        <app-page-header>
          <app-page-breadcrumbs
            slot="breadcrumbs"
            .bcData=${this.breadcrumbs}
          ></app-page-breadcrumbs>
          <span slot="title">${i18n.t('employees.title.main')}</span>
          <div slot="actions">
            <app-button
              size="md"
              color="primary"
              label="${i18n.t('employees.button.create')}"
              @click=${this.handleCreateClick}
            ></app-button>
          </div>
        </app-page-header>

        <div class="content">
          <div class="dev-toolbar">
            <app-button
              size="sm"
              color="secondary"
              label="${i18n.t('employees.button.dev.resetData')}"
              @click=${() => store.dispatch(resetEmployeeTableData())}
            ></app-button>

            <app-button
              size="sm"
              color="secondary"
              label="${i18n.t('employees.button.dev.resetVisibleColumns')}"
              @click=${() => store.dispatch(resetEmployeeTableVisibleColumns())}
            ></app-button>

            <app-button
              size="sm"
              color="primary"
              label="${i18n.t('employees.button.dev.resetPagination')}"
              @click=${() => store.dispatch(resetEmployeeTablePagination())}
            ></app-button>

            <app-button
              size="sm"
              color="primary"
              label="${i18n.t('employees.button.dev.resetFilters')}"
              @click=${() => store.dispatch(resetEmployeeTableFilters())}
            ></app-button>

            <app-button
              size="sm"
              color="secondary"
              label="${i18n.t('employees.button.dev.add60MockEmployees')}"
              @click=${() => {
                store.dispatch(addEmployees(mockEmployees));
              }}
            ></app-button>
          </div>

          <employee-table
            .data=${this.employees}
            .visibleColumns=${this.tableSettings.visibleColumns}
            .currentPage=${this.tableSettings.currentPage}
            .itemsPerPage=${this.tableSettings.itemsPerPage}
            .sortColumn=${this.tableSettings.sortColumn}
            .sortDirection=${this.tableSettings.sortDirection}
            .selectedRows=${this.tableSettings.selectedRows}
            .filters=${this.tableSettings.filters}
            @visible-columns-change=${this.handleVisibleColumnsChange}
            @filter-change=${this.handleFilterChange}
            @sort-change=${this.handleSortChange}
            @row-select=${this.handleRowSelect}
            @page-change=${this.handlePageChange}
            @items-per-page-change=${this.handleItemsPerPageChange}
            @delete-employee=${this.handleDeleteEmployee}
          ></employee-table>
        </div>
      </app-page-container>
    `;
  }
}
