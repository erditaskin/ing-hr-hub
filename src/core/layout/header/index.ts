import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './Logo';
import './UserMenu';
import './Navigation';

@customElement('app-header')
export class AppHeader extends LitElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  public static readonly styles = css`
    :host {
      display: block;
      width: 100%;
    }

    header {
      background-color: var(--color-header);
      color: var(--color-text-primary);
      padding: 0 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
      height: 64px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    h1 {
      color: var(--color-primary);
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
    }

    a {
      text-decoration: none !important;
      color: inherit;
    }

    app-logo {
      height: 32px;
      display: block;
    }

    app-navigation {
      display: flex;
      align-items: center;
    }

    @media (max-width: 768px) {
      header {
        padding: 0 1rem;
      }

      .header-left {
        gap: 0.5rem;
      }

      .header-right {
        display: none;
      }
    }
  `;

  render() {
    return html`
      <header>
        <div class="header-left">
          <h1>
            <a href="/dashboard"><app-logo></app-logo></a>
          </h1>
          <app-navigation>
            <app-user-menu slot="mobile-menu"></app-user-menu>
          </app-navigation>
        </div>
        <div class="header-right">
          <app-user-menu></app-user-menu>
        </div>
      </header>
    `;
  }
}
