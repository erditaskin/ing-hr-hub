import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IEmployee } from '../interfaces/employee';
import '@/core/components/elements/Table';
import { ITableColumn } from '@/core/interfaces/table';
import '@/core/components/elements/IconButton';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { i18n } from '@/core/services/i18n';
import { store } from '@/core/store';
import { DialogService } from '@/core/services/dialog';

const POSITION_OPTIONS = [
  { value: 'junior', label: () => i18n.t('employees.columns.position.options.junior') },
  { value: 'medior', label: () => i18n.t('employees.columns.position.options.medior') },
  { value: 'senior', label: () => i18n.t('employees.columns.position.options.senior') },
];

const DEPARTMENT_OPTIONS = [
  { value: 'analytics', label: () => i18n.t('employees.columns.department.options.analytics') },
  { value: 'tech', label: () => i18n.t('employees.columns.department.options.tech') },
];

@customElement('employee-table')
export class EmployeeTable extends LitElement {
  @property({ type: Array })
  data: IEmployee[] = [];

  @property({ type: Array })
  visibleColumns: string[] = [];

  @property({ type: Number })
  currentPage = 1;

  @property({ type: Number })
  itemsPerPage = 10;

  @property({ type: String })
  sortColumn = '';

  @property({ type: String })
  sortDirection = 'asc';

  @property({ type: Array })
  selectedRows: string[] = [];

  @property({ type: Object })
  filters: Record<string, string> = {};

  @property({ type: Array })
  onVisibleColumnsChange: (columns: string[]) => void = () => {};

  @property({ type: Function })
  onFilterChange: (filters: Record<string, string>) => void = () => {};

  @property({ type: Function })
  onSortChange: (sortColumn: string, sortDirection: string) => void = () => {};

  @property({ type: Function })
  onRowSelect: (row: IEmployee) => void = () => {};

  @property({ type: Function })
  onPageChange: (page: number) => void = () => {};

  @property({ type: Function })
  onItemsPerPageChange: (itemsPerPage: number) => void = () => {};

  @property({ type: Boolean })
  onDeleteEmployee: (employee: IEmployee) => void = () => {};

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

    .actions {
      display: flex;
      gap: var(--spacing-xs);
      justify-content: center;
      width: 100%;
      min-width: 100px;
    }

    sl-icon {
      font-size: 1.2em;
    }
  `;

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR').format(date);
  }

  private getLabelByValue(
    options: Array<{ value: string; label: () => string }>,
    value: string
  ): string {
    return options.find(option => option.value === value)?.label() || value;
  }

  private get columns(): ITableColumn<IEmployee>[] {
    return [
      {
        key: 'firstName',
        title: i18n.t('employees.columns.name.title'),
        render: employee => `${employee.firstName} ${employee.lastName}`,
        filterType: 'text',
      },
      {
        key: 'email',
        title: i18n.t('employees.columns.email.title'),
        filterType: 'text',
      },
      {
        key: 'phoneNumber',
        title: i18n.t('employees.columns.phoneNumber.title'),
        filterType: 'text',
      },
      {
        key: 'dateOfEmployment',
        title: i18n.t('employees.columns.dateOfEmployment.title'),
        render: employee => this.formatDate(employee.dateOfEmployment),
        filterType: 'text',
      },
      {
        key: 'position',
        title: i18n.t('employees.columns.position.title'),
        render: employee => this.getLabelByValue(POSITION_OPTIONS, employee.position),
        filterType: 'select',
        filterOptions: POSITION_OPTIONS.map(option => ({
          value: option.value,
          label: option.label(),
        })),
      },
      {
        key: 'department',
        title: i18n.t('employees.columns.department.title'),
        render: employee => this.getLabelByValue(DEPARTMENT_OPTIONS, employee.department),
        filterType: 'select',
        filterOptions: DEPARTMENT_OPTIONS.map(option => ({
          value: option.value,
          label: option.label(),
        })),
      },
      {
        key: 'actions',
        title: i18n.t('employees.columns.actions.title'),
        isAction: true,
        render: employee => html`
          <div class="actions">
            <app-icon-button
              size="sm"
              color="primary"
              label=${i18n.t('employees.columns.actions.edit')}
              @click=${() => this.handleEditClick(employee)}
            >
              <sl-icon
                name="pencil-square"
                label=${i18n.t('employees.columns.actions.edit')}
              ></sl-icon>
            </app-icon-button>
            <app-icon-button
              size="sm"
              color="secondary"
              label=${i18n.t('employees.columns.actions.delete')}
              @click=${() => this.handleDeleteClick(employee)}
            >
              <sl-icon name="trash" label=${i18n.t('employees.columns.actions.delete')}></sl-icon>
            </app-icon-button>
          </div>
        `,
      },
    ];
  }

  private handleEditClick(employee: IEmployee) {
    window.history.pushState({}, '', `/employee/${employee.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  private async handleDeleteClick(employee: IEmployee) {
    const confirmed = await DialogService.confirm(
      i18n.t('employees.columns.actions.deleteConfirm'),
      {
        title: i18n.t('employees.columns.actions.delete'),
        confirmText: i18n.t('common.button.delete'),
        cancelText: i18n.t('common.button.cancel'),
        variant: 'danger',
      }
    );

    if (confirmed) {
      this.dispatchEvent(
        new CustomEvent('delete-employee', {
          detail: employee,
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <app-table
        .data=${this.data}
        .columns=${this.columns}
        .settings=${{
          visibleColumns: this.visibleColumns || [],
          currentPage: this.currentPage,
          itemsPerPage: this.itemsPerPage,
          sortColumn: this.sortColumn,
          sortDirection: this.sortDirection,
          selectedRows: this.selectedRows,
          filters: this.filters,
        }}
        .isPaginationActive=${true}
        @visible-columns-change=${(e: CustomEvent) => {
          const event = new CustomEvent('visible-columns-change', {
            detail: e.detail,
            bubbles: true,
            composed: true,
          });
          this.dispatchEvent(event);
        }}
        @page-change=${(e: CustomEvent) => {
          const event = new CustomEvent('page-change', {
            detail: e.detail,
            bubbles: true,
            composed: true,
          });
          this.dispatchEvent(event);
        }}
        @items-per-page-change=${(e: CustomEvent) => {
          const event = new CustomEvent('items-per-page-change', {
            detail: e.detail,
            bubbles: true,
            composed: true,
          });
          this.dispatchEvent(event);
        }}
        @filter-change=${(e: CustomEvent) => this.onFilterChange(e.detail)}
        @sort-change=${(e: CustomEvent) => this.onSortChange(e.detail.column, e.detail.direction)}
        @row-select=${(e: CustomEvent) => this.onRowSelect(e.detail)}
      ></app-table>
    `;
  }
}
