// here lets implement the statistics widget

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('statistics-widget')
export class StatisticsWidget extends LitElement {
  @property({ type: String }) icon = '';
  @property({ type: String }) title = '';
  @property({ type: String }) helper = '';
  @property({ type: Number }) count = 0;
  @property({ type: Boolean }) isTotal = false;
  @property({ type: String }) trend = '';

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .widget {
      background: var(--color-bg-primary);
      border-radius: 12px;
      padding: 24px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .widget.is-total {
      height: auto !important;
    }

    .widget:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .widget-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .widget-title-group {
      flex: 1;
    }

    .widget-title {
      font-size: 14px;
      color: var(--color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .widget-helper {
      font-size: 12px;
      color: var(--color-text-secondary);
      margin: 4px 0 0 0;
      opacity: 0.8;
      line-height: 1.4;
    }

    .widget-icon {
      font-size: 24px;
      color: var(--color-primary);
      opacity: 0.8;
    }

    .widget-content {
      margin-top: auto;
      padding-top: 16px;
    }

    .widget-count {
      font-size: var(--count-size, 24px);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
      line-height: 1.2;
    }

    :host([isTotal]) .widget-count {
      font-size: 42px;
      margin-bottom: 8px;
    }

    .trend {
      font-size: 14px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .trend.positive {
      color: var(--color-success, #22c55e);
    }

    .trend.negative {
      color: var(--color-error, #ef4444);
    }

    .trend.neutral {
      color: var(--color-text-secondary);
    }
  `;

  private getTrendClass() {
    if (!this.trend) return 'neutral';
    const value = parseFloat(this.trend);
    if (isNaN(value)) return 'neutral';
    return value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
  }

  private getTrendIcon() {
    if (!this.trend) return '';
    const value = parseFloat(this.trend);
    if (isNaN(value)) return '';
    return value > 0 ? '↑' : value < 0 ? '↓' : '→';
  }

  render() {
    return html`
      <div class="widget  ${this.isTotal ? 'is-total' : ''}">
        <div class="widget-header">
          <div class="widget-title-group">
            <h3 class="widget-title">${this.title}</h3>
            ${this.helper ? html`<p class="widget-helper">${this.helper}</p>` : ''}
          </div>
          <sl-icon name=${this.icon} class="widget-icon"></sl-icon>
        </div>
        <div class="widget-content">
          <p class="widget-count">${this.count}</p>
          ${this.trend
            ? html`
                <div class="trend ${this.getTrendClass()}">
                  ${this.getTrendIcon()} ${this.trend}%
                </div>
              `
            : ''}
        </div>
      </div>
    `;
  }
}
