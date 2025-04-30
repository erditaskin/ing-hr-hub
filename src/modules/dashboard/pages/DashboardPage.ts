import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('dashboard-page')
export class DashboardPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }

    h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    .dashboard-content {
      background-color: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `;

  render() {
    return html`
      <div class="dashboard-content">
        <h2>Dashboard</h2>
        <p>Welcome to the HR Hub Dashboard</p>
      </div>
    `;
  }
}
