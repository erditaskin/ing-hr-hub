// here we gonna create a select component for the items per page

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n } from '@/core/services/i18n';

@customElement('app-items-per-page')
export class ItemsPerPage extends LitElement {
  @property({ type: Number }) itemsPerPage = 10;

  private readonly options = [10, 50, 100];

  constructor() {
    super();
    i18n.addHost(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18n.removeHost(this);
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
    }

    select {
      padding: var(--spacing-xs) var(--spacing-sm);
      border: 1px solid var(--color-border);
      background: var(--color-bg-primary);
      border-radius: var(--border-radius-sm);
      cursor: pointer;
    }

    label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
  `;

  private handleChange(e: Event) {
    const value = parseInt((e.target as HTMLSelectElement).value);
    this.dispatchEvent(
      new CustomEvent('items-per-page-change', {
        detail: value,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <label>${i18n.t('common.table.pagination.items_per_page')}</label>
      <select .value=${this.itemsPerPage.toString()} @change=${this.handleChange}>
        ${this.options.map(
          option => html`
            <option value=${option} ?selected=${this.itemsPerPage === option}>${option}</option>
          `
        )}
      </select>
    `;
  }
}
