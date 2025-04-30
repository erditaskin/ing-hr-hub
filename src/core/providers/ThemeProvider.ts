import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { injectTheme } from '../theme';

// Import styles
import '../styles/reset.css';
import '../styles/typography.css';

@customElement('theme-provider')
export class ThemeProvider extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.initializeTheme();
  }

  private initializeTheme() {
    try {
      // Initialize Shoelace components
      setBasePath('/node_modules/@shoelace-style/shoelace/dist');

      // Initialize theme
      injectTheme();
    } catch (error) {
      console.error('[ThemeProvider] Theme initialization failed:', error);
    }
  }

  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`<slot></slot>`;
  }
}
