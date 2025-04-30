// here will be app page container component

import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-page-container')
export class AppPageContainer extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: var(--spacing-lg);
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }
  `;

  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-page-container': AppPageContainer;
  }
}
