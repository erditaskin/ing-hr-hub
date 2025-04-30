import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-checkbox-input')
export class CheckboxInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--font-family);
    }

    .checkbox-wrapper {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-xs);
      cursor: pointer;
    }

    .checkbox-wrapper.disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    .checkbox-container {
      position: relative;
      width: 18px;
      height: 18px;
      margin-top: 2px;
    }

    input[type='checkbox'] {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: pointer;
    }

    input[type='checkbox']:disabled {
      cursor: not-allowed;
    }

    .checkbox {
      position: absolute;
      top: 0;
      left: 0;
      width: 16px;
      height: 16px;
      border: 2px solid var(--color-border);
      border-radius: var(--border-radius-sm);
      background: var(--color-surface);
      transition: all 0.2s ease;
    }

    input[type='checkbox']:hover:not(:disabled) + .checkbox {
      border-color: var(--color-border-hover);
    }

    input[type='checkbox']:focus + .checkbox {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px var(--color-primary-alpha);
    }

    input[type='checkbox']:checked + .checkbox {
      background: var(--color-primary);
      border-color: var(--color-primary);
    }

    input[type='checkbox']:checked + .checkbox::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .label-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    label {
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
      user-select: none;
    }

    .helper-text {
      color: var(--color-text-secondary);
      font-size: var(--font-size-xs);
    }

    .error-text {
      color: var(--color-error);
      font-size: var(--font-size-xs);
    }

    :host([error]) .checkbox {
      border-color: var(--color-error);
    }

    :host([error]) input[type='checkbox']:focus + .checkbox {
      box-shadow: 0 0 0 2px var(--color-error-alpha);
    }
  `;

  @property({ type: Boolean }) checked = false;
  @property({ type: String }) label = '';
  @property({ type: String }) helperText = '';
  @property({ type: String }) name = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, reflect: true }) error = false;
  @property({ type: String }) errorText = '';
  @property({ type: Boolean }) required = false;

  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.checked, name: this.name },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur() {
    this.dispatchEvent(
      new CustomEvent('blur', {
        detail: { value: this.checked, name: this.name },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="checkbox-wrapper ${this.disabled ? 'disabled' : ''}">
        <div class="checkbox-container">
          <input
            type="checkbox"
            id="checkbox-${this.name}"
            .name=${this.name}
            .checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @change=${this.handleChange}
            @blur=${this.handleBlur}
          />
          <div class="checkbox"></div>
        </div>
        <div class="label-content">
          <label for="checkbox-${this.name}"> ${this.label}${this.required ? ' *' : ''} </label>
          ${this.helperText ? html` <span class="helper-text">${this.helperText}</span> ` : ''}
          ${this.error && this.errorText
            ? html` <span class="error-text">${this.errorText}</span> `
            : ''}
        </div>
      </div>
    `;
  }
}
