import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { v4 as uuidv4 } from 'uuid';
import { store } from '@/core/store';
import { addEmployee, updateEmployee } from '../reducers/employee';
import { i18n } from '@/core/services/i18n';
import { ToastService } from '@/core/services/toast';
import '@/core/components/AppPageContainer';
import '@/core/components/AppPageHeader';
import '@/core/components/AppPageHeader/AppPageBreadCrumbs';
import '@/core/components/Loading';
import '../components/EmployeeForm';
import { IEmployee } from '../interfaces/employee';
import { getEmployees } from '../selectors/employee';

@customElement('employee-page')
export class EmployeePage extends LitElement {
  @property({ type: String })
  private employeeId: string | null = null;

  @state()
  private isLoading = false;

  @state()
  private isNavigating = false;

  @state()
  private isSubmitting = false;

  @state()
  private formData: Partial<IEmployee> | null = null;

  static styles = css`
    :host {
      display: block;
    }

    .content {
      padding-top: var(--spacing-md);
    }
  `;

  constructor() {
    super();
    i18n.addHost(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18n.removeHost(this);
  }

  connectedCallback() {
    super.connectedCallback();
    const path = window.location.pathname;
    const matches = path.match(/^\/employee\/(.+)$/);
    this.employeeId = matches ? matches[1] : null;

    if (this.employeeId) {
      this.isLoading = true;
      this.loadEmployeeData();
    }
  }

  private loadEmployeeData() {
    if (this.isNavigating) {
      return;
    }

    const state = store.getState() as any;
    const employees = getEmployees(state);
    const employee = employees.find(emp => emp.id === this.employeeId);

    if (employee) {
      // Set form data and wait for next render cycle
      this.formData = employee;
      this.isLoading = false;
    } else if (!this.isNavigating) {
      ToastService.error(i18n.t('employee.messages.notFound'));
      this.navigateBack();
    }
  }

  private navigateBack() {
    if (this.isNavigating) {
      return;
    }

    this.isNavigating = true;

    // Ensure navigation happens in next frame after state updates
    window.requestAnimationFrame(() => {
      window.history.back();
    });
  }

  private get breadcrumbs() {
    const baseCrumbs = [
      { label: i18n.t('dashboard.title.main'), link: '/' },
      { label: i18n.t('employees.title.main'), link: '/employees' },
    ];

    if (this.employeeId) {
      return [
        ...baseCrumbs,
        { label: i18n.t('employee.title.edit'), link: `/employee/${this.employeeId}` },
      ];
    }

    return [...baseCrumbs, { label: i18n.t('employee.title.create'), link: '/employee' }];
  }

  private get pageTitle() {
    return this.employeeId ? i18n.t('employee.title.edit') : i18n.t('employee.title.create');
  }

  private async handleFormSubmit(e: CustomEvent) {
    if (this.isSubmitting || this.isNavigating) {
      return;
    }

    this.isSubmitting = true;
    const employeeData = e.detail as Partial<IEmployee>;

    try {
      if (this.employeeId) {
        store.dispatch(
          updateEmployee({
            ...employeeData,
            id: this.employeeId,
          })
        );

        ToastService.success(i18n.t('employee.messages.updateSuccess'));
      } else {
        const newId = uuidv4();
        store.dispatch(
          addEmployee({
            ...employeeData,
            id: newId,
          })
        );

        ToastService.success(i18n.t('employee.messages.createSuccess'));
      }

      // Wait for store updates to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      this.navigateBack();
    } catch (error) {
      console.error('Error submitting form:', error);
      ToastService.error(i18n.t('common.messages.error'));
    } finally {
      this.isSubmitting = false;
    }
  }

  private handleFormCancel() {
    this.navigateBack();
  }

  render() {
    if (this.isNavigating) {
      return html`<app-loading></app-loading>`;
    }

    return html`
      <app-page-container>
        <app-page-header>
          <app-page-breadcrumbs
            slot="breadcrumbs"
            .bcData=${this.breadcrumbs}
          ></app-page-breadcrumbs>
          <span slot="title">${this.pageTitle}</span>
        </app-page-header>

        <div class="content">
          ${this.isLoading
            ? html`<app-loading></app-loading>`
            : html`
                <employee-form
                  .initialData=${this.formData}
                  ?disabled=${this.isSubmitting}
                  @submit=${this.handleFormSubmit}
                  @cancel=${this.handleFormCancel}
                ></employee-form>
              `}
        </div>
      </app-page-container>
    `;
  }
}
