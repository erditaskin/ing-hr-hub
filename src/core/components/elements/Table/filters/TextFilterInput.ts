// here text filter input

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { i18n } from '@/core/services/i18n';

@customElement('app-text-filter-input')
export class TextFilterInput extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) columnKey = '';

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
      display: block;
      width: 100%;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      width: 100%;
    }

    input {
      flex: 1;
      min-width: 0;
      padding: var(--spacing-xs, 8px);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: 4px;
      background-color: var(--color-bg-primary, #fff);
      font-size: var(--font-size-sm);
    }

    .clear-button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clear-button:hover {
      color: var(--color-primary);
    }
  `;

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
  }

  private handleBlur() {
    this.dispatchFilterChange();
  }

  private handleClear() {
    this.value = '';
    this.dispatchFilterChange();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.dispatchFilterChange();
    }
  }

  private dispatchFilterChange() {
    const filterUpdate = {
      [this.columnKey]: this.value,
    };

    this.dispatchEvent(
      new CustomEvent('filter-change', {
        detail: filterUpdate,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="input-wrapper">
        <input
          type="text"
          .value=${this.value}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @keydown=${this.handleKeyDown}
          placeholder=${i18n.t('common.table.filter.placeholder')}
        />
        ${this.value
          ? html`
              <button class="clear-button" @click=${this.handleClear}>
                <sl-icon name="x-circle" label=${i18n.t('common.table.filter.clear')}></sl-icon>
              </button>
            `
          : ''}
      </div>
    `;
  }
}
