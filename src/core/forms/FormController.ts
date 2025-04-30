import { ReactiveController, ReactiveControllerHost } from 'lit';
import { FormConfig, FormState } from '@/core/interfaces/form';

export class FormController<T extends Record<string, any>> implements ReactiveController {
  private host: ReactiveControllerHost;
  private config: FormConfig<T>;

  state: FormState<T> = {
    values: {} as T,
    errors: {},
    touched: {},
    isSubmitting: false,
  };

  constructor(host: ReactiveControllerHost, config: FormConfig<T>) {
    this.host = host;
    this.config = config;
    this.state.values = { ...config.initialValues };
    host.addController(this);
  }

  hostConnected() {
    // Validate initial values
    this.state.errors = this.config.validate(this.state.values);
    this.host.requestUpdate();
  }

  hostDisconnected() {}

  private updateState(newState: Partial<FormState<T>>) {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.host.requestUpdate();
  }

  setValue(name: keyof T, value: any) {
    const newValues = {
      ...this.state.values,
      [name]: value,
    };

    // Validate the updated values
    const errors = this.config.validate(newValues);

    this.updateState({
      values: newValues,
      errors,
    });
  }

  setTouched(name: keyof T, isTouched: boolean = true) {
    this.updateState({
      touched: {
        ...this.state.touched,
        [name]: isTouched,
      },
    });
  }

  setAllTouched() {
    const touched = Object.keys(this.state.values).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {} as Partial<Record<keyof T, boolean>>
    );

    this.updateState({
      touched,
    });
  }

  async submit() {
    // Mark all fields as touched to show errors
    this.setAllTouched();

    // Validate all fields
    const errors = this.config.validate(this.state.values);

    this.updateState({
      errors,
      isSubmitting: true,
    });

    // If there are validation errors, stop here
    if (Object.keys(errors).length > 0) {
      this.updateState({
        isSubmitting: false,
      });
      return;
    }

    try {
      await this.config.onSubmit(this.state.values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      this.updateState({
        isSubmitting: false,
      });
    }
  }
}
