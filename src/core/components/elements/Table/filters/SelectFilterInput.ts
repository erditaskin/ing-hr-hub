import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IOption } from '@/core/interfaces/option';
import { i18n } from '@/core/services/i18n';

@customElement('app-select-filter-input')
export class SelectFilterInput extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) columnKey = '';
  @property({ type: Array }) options: IOption[] = [];

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

    select {
      width: 100%;
      padding: var(--spacing-xs, 8px);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: 4px;
      background-color: var(--color-bg-primary, #fff);
      font-size: var(--font-size-sm);
    }
  `;

  private handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchFilterChange();
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
      <select .value=${this.value} @change=${this.handleChange}>
        <option value="">${i18n.t('common.table.filter.all')}</option>
        ${this.options.map(
          option => html`
            <option value=${option.value} ?selected=${option.value === this.value}>
              ${option.label}
            </option>
          `
        )}
      </select>
    `;
  }
}
