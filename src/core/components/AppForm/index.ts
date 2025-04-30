import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormController } from '@/core/forms/FormController';

@customElement('app-form')
export class AppForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      padding-top: var(--spacing-md);
    }

    ::slotted(app-text-input),
    ::slotted(app-select-input) {
      width: 100%;
      margin-bottom: var(--spacing-md);
    }

    ::slotted(app-text-input:last-child),
    ::slotted(app-select-input:last-child) {
      margin-bottom: 0;
    }
  `;

  @property({ type: Object })
  form?: FormController<any>;

  private handleInput(e: CustomEvent) {
    if (!this.form) return;

    const { name, value } = e.detail || {};
    if (!name) return;

    this.form.setValue(name, value);
    this.form.setTouched(name, true);

    // Dispatch form change event
    this.dispatchEvent(
      new CustomEvent('form-change', {
        detail: { name, value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur(e: CustomEvent) {
    if (!this.form) return;

    const { name } = e.detail || {};
    if (!name) return;

    this.form.setTouched(name);

    // Dispatch form blur event
    this.dispatchEvent(
      new CustomEvent('form-blur', {
        detail: { name },
        bubbles: true,
        composed: true,
      })
    );
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.form) return;

    // Mark all fields as touched to show validation errors
    this.form.setAllTouched();

    try {
      // Attempt to submit the form
      await this.form.submit();

      // If submission is successful, dispatch success event
      this.dispatchEvent(
        new CustomEvent('form-submit-success', {
          detail: { values: this.form.state.values },
          bubbles: true,
          composed: true,
        })
      );
    } catch (error) {
      console.error('AppForm: Submit failed', error);

      // If submission fails, dispatch error event
      this.dispatchEvent(
        new CustomEvent('form-submit-error', {
          detail: { error },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit} @input=${this.handleInput} @blur=${this.handleBlur}>
        <div class="form-grid">
          <slot></slot>
        </div>
        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `;
  }
}
