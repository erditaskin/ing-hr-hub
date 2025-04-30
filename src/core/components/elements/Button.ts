import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonColor = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

@customElement('app-button')
export class Button extends LitElement {
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
      font-weight: 500;
      font-size: 14px;
      line-height: 1.75;
      letter-spacing: 0.02857em;
      min-width: 64px;
      padding: 6px 16px;
      border-radius: 4px;
      transition:
        background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      color: #fff;
      background-color: var(--color-primary);
      box-shadow:
        0px 3px 1px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14),
        0px 1px 5px 0px rgba(0, 0, 0, 0.12);
      height: 36px;
    }

    button:hover {
      background-color: var(--color-primary-hover);
      box-shadow:
        0px 2px 4px -1px rgba(0, 0, 0, 0.2),
        0px 4px 5px 0px rgba(0, 0, 0, 0.14),
        0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    }

    button:active {
      box-shadow:
        0px 5px 5px -3px rgba(0, 0, 0, 0.2),
        0px 8px 10px 1px rgba(0, 0, 0, 0.14),
        0px 3px 14px 2px rgba(0, 0, 0, 0.12);
    }

    button:disabled {
      color: rgba(0, 0, 0, 0.26);
      box-shadow: none;
      background-color: rgba(0, 0, 0, 0.12);
      cursor: default;
      pointer-events: none;
    }

    button.secondary {
      background-color: var(--color-secondary);
    }

    button.secondary:hover {
      background-color: var(--color-secondary-hover);
    }

    button.sm {
      padding: 4px 10px;
      font-size: clamp(11px, 2.5vw, 13px);
      height: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: unset;
      width: auto;
    }

    button.md {
      font-size: clamp(12px, 2.5vw, 14px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    button.lg {
      padding: 8px 22px;
      font-size: clamp(13px, 2.5vw, 15px);
      height: 42px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Icon styles */
    ::slotted([slot='start-icon']) {
      margin-right: 8px;
      margin-left: -4px;
    }

    ::slotted([slot='end-icon']) {
      margin-left: 8px;
      margin-right: -4px;
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

  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  render() {
    return html`
      <button class="${this.color} ${this.size}" ?disabled=${this.disabled} type="${this.type}">
        <slot name="start-icon"></slot>
        ${this.label}
        <slot name="end-icon"></slot>
      </button>
    `;
  }
}
