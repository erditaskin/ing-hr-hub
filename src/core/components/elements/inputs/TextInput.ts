import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-text-input')
export class TextInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--font-family);
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    label {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      font-weight: 500;
    }

    input {
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
    }

    input:hover {
      border-color: var(--input-border-hover);
    }

    input:focus {
      outline: none;
      border-color: var(--input-border-focus);
      box-shadow: 0 0 0 2px var(--color-primary-alpha);
    }

    input:disabled {
      background: var(--color-surface-disabled);
      border-color: var(--input-border-color);
      color: var(--color-text-disabled);
      cursor: not-allowed;
    }

    input::placeholder {
      color: var(--color-text-disabled);
    }

    input.error {
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

  @property({ type: String })
  type = 'text';

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  helperText = '';

  private shouldShowError(): boolean {
    return !!this.helperText;
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          name: this.name,
          value: target.value,
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
      <div class="input-wrapper">
        ${labelContent}
        <input
          id="${this.name}"
          type="${this.type}"
          .value="${this.value}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          class="${this.shouldShowError() ? 'error' : ''}"
          @input="${this.handleInput}"
          @blur="${this.handleBlur}"
        />
        ${this.helperText ? html`<div class="error-text">${this.helperText}</div>` : ''}
      </div>
    `;
  }
}
