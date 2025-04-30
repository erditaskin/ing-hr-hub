// here will be app page breadcrumbs component

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IBreadcrumb } from '@/core/interfaces/breadcrumb';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

@customElement('app-page-breadcrumbs')
export class AppPageBreadcrumbs extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 0 0 var(--spacing-sm) 0;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .home-link {
      color: var(--color-text-secondary);
      text-decoration: none;
      display: flex;
      align-items: center;
    }

    .breadcrumb-link {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: var(--font-size-xs);
      font-weight: 500;
      cursor: pointer;
    }

    .breadcrumb-link:hover {
      text-decoration: underline;
    }

    .breadcrumb-current {
      color: var(--color-primary);
      font-size: var(--font-size-xs);
      font-weight: 500;
    }

    .separator {
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
    }

    sl-icon {
      font-size: var(--font-size-sm);
      width: var(--font-size-sm);
      height: var(--font-size-sm);
    }
  `;

  @property({ type: Array })
  bcData?: IBreadcrumb[];

  @property({ type: String })
  pageTitle = '';

  private handleClick(link: string) {
    window.history.pushState({}, '', link);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    return html`
      <nav class="breadcrumbs" aria-label="breadcrumbs">
        <a href="/" class="home-link" aria-label="Home">
          <sl-icon name="house"></sl-icon>
        </a>

        ${this.bcData?.map(
          (bc, index) => html`
            <span class="separator">
              <sl-icon name="chevron-right"></sl-icon>
            </span>
            ${index === this.bcData!.length - 1
              ? html`<span class="breadcrumb-current">${bc.label}</span>`
              : html`
                  <a class="breadcrumb-link" @click=${() => this.handleClick(bc.link)}>
                    ${bc.label}
                  </a>
                `}
          `
        )}
      </nav>
    `;
  }
}
