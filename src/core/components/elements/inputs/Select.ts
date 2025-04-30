import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-select')
export class Select extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: Array }) options: { label: string; value: string }[] = [];

  static styles = css`
    :host {
      display: block;
    }

    select {
      width: 100%;
      padding: var(--spacing-xs, 8px);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: 4px;
      background-color: var(--color-bg-primary, #fff);
    }
  `;

  private handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: select.value,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <select .value=${this.value} @change=${this.handleChange}>
        <option value="">Select...</option>
        ${this.options.map(
          option => html` <option value=${option.value}>${option.label}</option> `
        )}
      </select>
    `;
  }
}
