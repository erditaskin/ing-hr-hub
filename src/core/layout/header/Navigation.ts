import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { i18n } from '@/core/services/i18n';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

@customElement('app-navigation')
export class Navigation extends LitElement {
  @state() private isDrawerOpen = false;

  constructor() {
    super();
    i18n.addHost(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    i18n.removeHost(this);
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .desktop-nav {
      display: flex;
      gap: 1.5rem;
      height: 100%;
      margin-left: 2rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 1rem;
      color: inherit;
      text-decoration: none;
      font-weight: 500;
      position: relative;
      transition: color 0.2s;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--color-primary);
      transform: scaleX(0);
      transition: transform 0.2s;
    }

    .nav-link:hover {
      color: var(--color-primary);
    }

    .nav-link:hover::after {
      transform: scaleX(1);
    }

    .mobile-menu-button {
      display: none;
      margin-left: auto;
    }

    sl-drawer::part(base) {
      z-index: 1000;
    }

    sl-drawer::part(panel) {
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      border: none;
    }

    :host {
      --sl-panel-background-color: white !important;
    }

    .drawer__panel {
      background-color: white !important;
    }

    div.drawer__panel {
      background: white !important;
    }

    .drawer-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .drawer-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .drawer-link {
      color: var(--color-text-primary);
      text-decoration: none;
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-sm);
      transition: all 0.2s;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .drawer-link:hover {
      background-color: var(--color-bg-hover);
      color: var(--color-primary);
    }

    .drawer-footer {
      margin-top: auto;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
    }

    @media (max-width: 768px) {
      :host {
        margin-left: auto;
      }

      .desktop-nav {
        display: none;
      }

      .mobile-menu-button {
        display: inline-flex;
      }
    }
  `;

  private handleDrawerClose() {
    this.isDrawerOpen = false;
  }

  private handleMenuClick() {
    this.isDrawerOpen = true;
  }

  render() {
    return html`
      <nav class="desktop-nav">
        <a href="/dashboard" class="nav-link">${i18n.t('dashboard.title.main')}</a>
        <a href="/employees" class="nav-link">${i18n.t('employees.title.main')}</a>
      </nav>

      <!-- Mobile Menu Button -->
      <sl-icon-button
        class="mobile-menu-button"
        name="list"
        label="Menu"
        @click=${this.handleMenuClick}
      ></sl-icon-button>

      <!-- Mobile Drawer -->
      <sl-drawer
        label=${i18n.t('common.menu')}
        placement="right"
        ?open=${this.isDrawerOpen}
        @sl-after-hide=${this.handleDrawerClose}
      >
        <div class="drawer-content">
          <nav class="drawer-nav">
            <a href="/dashboard" class="drawer-link" @click=${this.handleDrawerClose}>
              <sl-icon name="house"></sl-icon>
              ${i18n.t('dashboard.title.main')}
            </a>
            <a href="/employees" class="drawer-link" @click=${this.handleDrawerClose}>
              <sl-icon name="people"></sl-icon>
              ${i18n.t('employees.title.main')}
            </a>
          </nav>
          <div class="drawer-footer">
            <slot name="mobile-menu"></slot>
          </div>
        </div>
      </sl-drawer>
    `;
  }
}
