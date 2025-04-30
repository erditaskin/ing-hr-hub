import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { FormController } from '@/core/forms/FormController';
import { Validator, createSchema, validateValues } from '@/core/forms/validation';
import { IEmployee } from '../interfaces/employee';
import { i18n } from '@/core/services/i18n';
import '@/core/components/elements/inputs/TextInput';
import '@/core/components/elements/inputs/SelectInput';
import '@/core/components/elements/Button';
import '@/core/components/AppForm';

const FIELD_BASE = 'employee.fields';

interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  dateOfEmployment: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  department: string;
  position: string;
}

const DEPARTMENTS = [
  { label: i18n.t('employee.fields.department.options.analytics'), value: 'analytics' },
  { label: i18n.t('employee.fields.department.options.tech'), value: 'tech' },
];

const POSITIONS = [
  { label: i18n.t('employee.fields.position.options.junior'), value: 'junior' },
  { label: i18n.t('employee.fields.position.options.medior'), value: 'medior' },
  { label: i18n.t('employee.fields.position.options.senior'), value: 'senior' },
];

@customElement('employee-form')
export class EmployeeForm extends LitElement {
  @property({ type: Object })
  initialData?: Partial<IEmployee>;

  @state()
  private isFormInitialized = false;

  @state()
  private isUpdating = false;

  private form!: FormController<EmployeeFormValues>;
  private validationSchema!: ReturnType<typeof createSchema>;

  constructor() {
    super();
    i18n.addHost(this);
    this.createValidationSchema();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18n.removeHost(this);
  }

  firstUpdated() {
    if (!this.isFormInitialized) {
      this.initializeForm();
      this.isFormInitialized = true;
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has('initialData') &&
      this.isFormInitialized &&
      this.form &&
      !this.isUpdating
    ) {
      this.isUpdating = true;
      requestAnimationFrame(() => {
        const formValues: EmployeeFormValues = {
          firstName: this.initialData?.firstName ?? '',
          lastName: this.initialData?.lastName ?? '',
          dateOfEmployment: this.initialData?.dateOfEmployment ?? '',
          dateOfBirth: this.initialData?.dateOfBirth ?? '',
          phoneNumber: this.initialData?.phoneNumber ?? '',
          email: this.initialData?.email ?? '',
          department: this.initialData?.department ?? '',
          position: this.initialData?.position ?? '',
        };

        (Object.keys(formValues) as Array<keyof EmployeeFormValues>).forEach(field => {
          this.form?.setValue(field, formValues[field]);
        });

        this.isUpdating = false;
      });
    }
  }

  private createValidationSchema() {
    this.validationSchema = createSchema({
      firstName: new Validator().required(i18n.t('employee.fields.firstName.error.required')),
      lastName: new Validator().required(i18n.t('employee.fields.lastName.error.required')),
      dateOfEmployment: new Validator().required(
        i18n.t('employee.fields.dateOfEmployment.error.required')
      ),
      dateOfBirth: new Validator().required(i18n.t('employee.fields.dateOfBirth.error.required')),
      phoneNumber: new Validator()
        .required(i18n.t('employee.fields.phoneNumber.error.required'))
        .matches(/^\+?[\d\s-]+$/, i18n.t('employee.fields.phoneNumber.error.invalid')),
      email: new Validator()
        .required(i18n.t('employee.fields.email.error.required'))
        .email(i18n.t('employee.fields.email.error.invalid')),
      department: new Validator().required(i18n.t('employee.fields.department.error.required')),
      position: new Validator().required(i18n.t('employee.fields.position.error.required')),
    });
  }

  private initializeForm() {
    this.form = new FormController(this, {
      initialValues: {
        firstName: this.initialData?.firstName ?? '',
        lastName: this.initialData?.lastName ?? '',
        dateOfEmployment: this.initialData?.dateOfEmployment ?? '',
        dateOfBirth: this.initialData?.dateOfBirth ?? '',
        phoneNumber: this.initialData?.phoneNumber ?? '',
        email: this.initialData?.email ?? '',
        department: this.initialData?.department ?? '',
        position: this.initialData?.position ?? '',
      },
      validate: values => {
        this.createValidationSchema();
        const errors = validateValues(values, this.validationSchema);
        return errors;
      },
      onSubmit: async values => {
        const employeeData: Partial<IEmployee> = {
          firstName: values.firstName,
          lastName: values.lastName,
          dateOfEmployment: values.dateOfEmployment,
          email: values.email,
          position: values.position,
          department: values.department,
          phoneNumber: values.phoneNumber,
          dateOfBirth: values.dateOfBirth,
        };

        this.dispatchEvent(
          new CustomEvent('submit', {
            detail: employeeData,
            bubbles: true,
            composed: true,
          })
        );
      },
    });
  }

  private handleCancel() {
    this.dispatchEvent(
      new CustomEvent('cancel', {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.form?.state) {
      return html`<div>Loading...</div>`;
    }

    const { values, errors, touched } = this.form.state;

    return html`
      <app-form .form=${this.form}>
        <app-text-input
          label=${i18n.t(FIELD_BASE + '.firstName.label')}
          name="firstName"
          required
          .value=${values.firstName}
          .helperText=${touched.firstName && errors.firstName ? errors.firstName : ''}
        ></app-text-input>

        <app-text-input
          label=${i18n.t(FIELD_BASE + '.lastName.label')}
          name="lastName"
          required
          .value=${values.lastName}
          .helperText=${touched.lastName && errors.lastName ? errors.lastName : ''}
        ></app-text-input>

        <app-text-input
          label=${i18n.t(FIELD_BASE + '.dateOfEmployment.label')}
          name="dateOfEmployment"
          type="date"
          required
          .value=${values.dateOfEmployment}
          .helperText=${touched.dateOfEmployment && errors.dateOfEmployment
            ? errors.dateOfEmployment
            : ''}
        ></app-text-input>

        <app-text-input
          label=${i18n.t(FIELD_BASE + '.dateOfBirth.label')}
          name="dateOfBirth"
          type="date"
          required
          .value=${values.dateOfBirth}
          .helperText=${touched.dateOfBirth && errors.dateOfBirth ? errors.dateOfBirth : ''}
        ></app-text-input>

        <app-text-input
          label=${i18n.t(FIELD_BASE + '.phoneNumber.label')}
          name="phoneNumber"
          type="tel"
          required
          .value=${values.phoneNumber}
          .helperText=${touched.phoneNumber && errors.phoneNumber ? errors.phoneNumber : ''}
        ></app-text-input>

        <app-text-input
          label=${i18n.t(FIELD_BASE + '.email.label')}
          name="email"
          type="email"
          required
          .value=${values.email}
          .helperText=${touched.email && errors.email ? errors.email : ''}
        ></app-text-input>

        <app-select-input
          label=${i18n.t(FIELD_BASE + '.department.label')}
          name="department"
          required
          .value=${values.department}
          .options=${DEPARTMENTS}
          .helperText=${touched.department && errors.department ? errors.department : ''}
        ></app-select-input>

        <app-select-input
          label=${i18n.t(FIELD_BASE + '.position.label')}
          name="position"
          required
          .value=${values.position}
          .options=${POSITIONS}
          .helperText=${touched.position && errors.position ? errors.position : ''}
        ></app-select-input>

        <div slot="actions" class="form-actions">
          <app-button
            label=${i18n.t('common.actions.cancel')}
            color="secondary"
            @click=${this.handleCancel}
          ></app-button>
          <app-button
            label=${i18n.t('common.actions.save')}
            @click=${async () => {
              await this.form.submit();
            }}
          ></app-button>
        </div>
      </app-form>
    `;
  }
}
