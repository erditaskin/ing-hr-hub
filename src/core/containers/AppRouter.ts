import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { modules } from '../../modules';
import { getModuleRoutes } from '../utils/module';
import '../layout/header';
import { bootstrap } from './Bootstrap';
import '../styles/main.css';

@customElement('app-router')
export class AppRouter extends LitElement {
  public static readonly styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
    main {
      padding: 2rem;
      background-color: var(--color-surface);
      height: fit-content;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      overflow-y: visible;
    }
  `;

  private router: Router | null = null;

  firstUpdated() {
    const outlet = this.shadowRoot?.querySelector('main');
    if (outlet) {
      this.router = new Router(outlet);
      this.setupRoutes();
    }
  }

  private setupRoutes() {
    if (this.router) {
      const moduleRoutes = getModuleRoutes(modules);
      const routes = [
        { path: '/', redirect: '/dashboard' },
        {
          path: '/',
          children: [...moduleRoutes, { path: '(.*)', component: 'not-found-page' }],
        },
      ];
      this.router.setRoutes(routes);
    }
  }

  render() {
    return html`
      <app-header></app-header>
      <main></main>
    `;
  }
}
