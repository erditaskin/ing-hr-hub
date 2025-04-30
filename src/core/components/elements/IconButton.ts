import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ButtonColor, ButtonSize } from './Button';

@customElement('app-icon-button')
export class IconButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-sizing: border-box;
      outline: 0;
      border: 0;
      margin: 0;
      cursor: pointer;
      user-select: none;
      vertical-align: middle;
      appearance: none;
      text-decoration: none;
      text-align: center;
      flex: 0 0 auto;
      border-radius: 50%;
      overflow: visible;
      color: inherit;
      transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      padding: var(--icon-button-padding-md);
    }

    button::-moz-focus-inner {
      border-style: none;
    }

    button:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    button:disabled {
      opacity: 0.7;
      cursor: default;
      pointer-events: none;
    }

    /* Colors */
    button.primary {
      color: var(--color-primary);
    }
    button.primary:hover:not(:disabled) {
      background-color: rgba(25, 118, 210, 0.04);
    }

    button.secondary {
      color: var(--color-secondary);
    }
    button.secondary:hover:not(:disabled) {
      background-color: rgba(156, 39, 176, 0.04);
    }

    /* Sizes */
    button.sm {
      padding: var(--icon-button-padding-sm);
    }
    button.sm ::slotted(*) {
      font-size: var(--icon-size-sm) !important;
      width: var(--icon-size-sm) !important;
      height: var(--icon-size-sm) !important;
    }

    button.md {
      padding: var(--icon-button-padding-md);
    }
    button.md ::slotted(*) {
      font-size: var(--icon-size-md) !important;
      width: var(--icon-size-md) !important;
      height: var(--icon-size-md) !important;
    }

    button.lg {
      padding: var(--icon-button-padding-lg);
    }
    button.lg ::slotted(*) {
      font-size: var(--icon-size-lg) !important;
      width: var(--icon-size-lg) !important;
      height: var(--icon-size-lg) !important;
    }
  `;

  @property({ type: String })
  color: ButtonColor = 'primary';

  @property({ type: String })
  size: ButtonSize = 'md';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  label = '';

  render() {
    return html`
      <button
        class="${this.color} ${this.size}"
        ?disabled=${this.disabled}
        aria-label=${this.label}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  private _handleClick(e: Event) {
    if (!this.disabled) {
      this.dispatchEvent(
        new CustomEvent('click', {
          bubbles: true,
          composed: true,
          detail: e,
        })
      );
    }
  }
}
