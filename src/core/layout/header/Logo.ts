import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-logo')
export class Logo extends LitElement {
  public static readonly styles = css`
    .logo {
      font-weight: bold;
      font-size: 1.5rem;
      color: #ff6a0f;
      font-family: var(--font-family);
      letter-spacing: -0.05em;
    }
    .logo-text-ing {
      color: var(--color-secondary);
      letter-spacing: -0.03em;
    }
    .logo-text-hr {
      color: var(--color-primary);
      letter-spacing: -0.03em;
    }
  `;

  render() {
    return html`<span class="logo"
      ><span class="logo-text-ing">ING</span> <span class="logo-text-hr">HR</span> Hub</span
    >`;
  }
}
