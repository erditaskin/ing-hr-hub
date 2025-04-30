import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IOption } from '@/core/interfaces/option';

@customElement('app-select-input')
export class SelectInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--font-family);
    }

    .select-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    label {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      font-weight: 500;
    }

    select {
      font-family: inherit;
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      background: var(--color-surface);
      border: 1px solid var(--input-border-color);
      border-radius: var(--border-radius);
      padding: var(--spacing-sm) var(--spacing-md);
      width: 100%;
      box-sizing: border-box;
      transition: all 0.2s ease;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right var(--spacing-sm) center;
      background-size: 1.2em;
      padding-right: calc(var(--spacing-md) * 2);
    }

    select.error {
      border-color: var(--input-border-error);
    }

    .error-text {
      color: var(--input-text-error);
      font-size: var(--font-size-xs);
      margin-top: var(--spacing-xs);
    }
  `;

  @property({ type: String })
  label = '';

  @property({ type: String })
  name = '';

  @property({ type: String })
  value = '';

  @property({ type: Array })
  options: IOption[] = [];

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  helperText = '';

  private shouldShowError(): boolean {
    return !!this.helperText;
  }

  private handleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.value = target.value;
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          name: this.name,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur() {
    this.dispatchEvent(
      new CustomEvent('blur', {
        detail: {
          name: this.name,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const labelContent = this.label
      ? html`<label for="${this.name}">${this.label}${this.required ? ' *' : ''}</label>`
      : '';

    return html`
      <div class="select-wrapper">
        ${labelContent}
        <select
          id="${this.name}"
          .value="${this.value}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          class="${this.shouldShowError() ? 'error' : ''}"
          @change="${this.handleChange}"
          @blur="${this.handleBlur}"
        >
          <option value="" disabled>${this.label}</option>
          ${this.options.map(
            option => html`
              <option value="${option.value}" ?selected=${option.value === this.value}>
                ${option.label}
              </option>
            `
          )}
        </select>
        ${this.helperText ? html`<div class="error-text">${this.helperText}</div>` : ''}
      </div>
    `;
  }
}
