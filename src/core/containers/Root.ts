import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bootstrap } from './Bootstrap';

@customElement('app-container')
export class Root extends LitElement {
  public static readonly styles = css`
    :host {
      display: block;
      min-height: 100vh;
      width: 100vw;
      background: var(--color-bg-main);
      color: var(--color-text);
      font-family: var(--font-family);
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await bootstrap();
  }

  render() {
    return html`
      <theme-provider>
        <localization-provider>
          <redux-provider>
            <app-router></app-router>
          </redux-provider>
        </localization-provider>
      </theme-provider>
    `;
  }
}
