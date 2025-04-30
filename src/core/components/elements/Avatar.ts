import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-avatar')
export class Avatar extends LitElement {
  @property({ type: String }) name = '';

  public static readonly styles = css`
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f0f0f0;
      color: var(--color-primary);
      font-family: var(--font-family);
      font-size: 1.2rem;
      font-weight: 700;
      box-shadow: var(--box-shadow);
      overflow: hidden;
    }
    x .avatar ::slotted(svg) {
      width: 24px;
      height: 24px;
      color: var(--color-primary);
    }
  `;

  private getInitials() {
    if (!this.name) return '';
    return this.name
      .split(' ')
      .map(part => part[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2);
  }

  render() {
    return html`
      <span class="avatar">
        <slot>${this.name ? this.getInitials() : ''}</slot>
      </span>
    `;
  }
}
