import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { store } from '../store';

@customElement('redux-provider')
export class ReduxProvider extends LitElement {
  @property({ type: Object })
  store = store;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    return root;
  }

  render() {
    return html` <slot></slot> `;
  }
}
