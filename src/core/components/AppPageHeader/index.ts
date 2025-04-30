// here will be app page header component

import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './AppPageBreadCrumbs';

@customElement('app-page-header')
export class AppPageHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: var(--spacing-lg);
    }

    .app-page-header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .app-page-header__title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .app-page-header__title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    .app-page-header__actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    ::slotted([slot='actions']) {
      margin-left: auto;
    }
  `;

  render() {
    return html`
      <div class="app-page-header">
        <slot name="breadcrumbs"></slot>
        <div class="app-page-header__title-row">
          <h1 class="app-page-header__title">
            <slot name="title"></slot>
          </h1>
          <div class="app-page-header__actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
