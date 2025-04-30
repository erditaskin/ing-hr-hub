import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-loading')
export class Loading extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-lg);
    }

    .loader {
      width: 48px;
      height: 48px;
      border: 4px solid var(--color-surface-variant);
      border-bottom-color: var(--color-primary);
      border-radius: 50%;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  render() {
    return html`<div class="loader"></div>`;
  }
}
