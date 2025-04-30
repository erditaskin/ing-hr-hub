// here we gonna create a pagination component

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n } from '@/core/services/i18n';

@customElement('app-pagination')
export class Pagination extends LitElement {
  @property({ type: Number }) currentPage = 1;
  @property({ type: Number }) itemsPerPage = 10;
  @property({ type: Number }) totalItems = 0;

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
      justify-content: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
    }

    button {
      padding: var(--spacing-xs) var(--spacing-sm);
      border: 1px solid var(--color-border);
      background: var(--color-bg-primary);
      cursor: pointer;
      border-radius: var(--border-radius-sm);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button.active {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }

    .info {
      margin: 0 var(--spacing-md);
    }
  `;

  private get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  private handlePageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: page,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const start = this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    const totalPages = Math.max(1, this.totalPages); // Ensure at least 1 page

    return html`
      <button
        ?disabled=${this.currentPage === 1}
        @click=${() => this.handlePageChange(this.currentPage - 1)}
      >
        ${i18n.t('common.table.pagination.previous')}
      </button>

      <span class="info">
        ${this.totalItems === 0
          ? i18n.t('common.table.pagination.info_empty')
          : `${start}-${end} / ${this.totalItems} (${i18n.t('common.table.pagination.page')} ${this.currentPage} / ${totalPages})`}
      </span>

      <button
        ?disabled=${this.currentPage === totalPages || this.totalItems === 0}
        @click=${() => this.handlePageChange(this.currentPage + 1)}
      >
        ${i18n.t('common.table.pagination.next')}
      </button>
    `;
  }
}
