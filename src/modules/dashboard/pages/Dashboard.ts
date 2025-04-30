import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { AppState, store } from '@/core/store';
import { getEmployees } from '@/modules/employee/selectors/employee';
import '../components/StatisticsWidget';
import '@/core/components/AppPageContainer';
import '@/core/components/AppPageHeader';
import { i18n } from '@/core/services/i18n';

interface Statistics {
  totalEmployees: number;
  byPosition: {
    junior: number;
    medior: number;
    senior: number;
  };
  byDepartment: {
    tech: number;
    analytics: number;
  };
}

@customElement('dashboard-page')
export class Dashboard extends LitElement {
  @state()
  private statistics: Statistics = {
    totalEmployees: 0,
    byPosition: {
      junior: 0,
      medior: 0,
      senior: 0,
    },
    byDepartment: {
      tech: 0,
      analytics: 0,
    },
  };

  static styles = css`
    :host {
      display: block;
    }

    .dashboard-content {
      padding: var(--spacing-md);
      max-width: 1400px;
      margin: 0 auto;
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }

    @media (max-width: 1024px) {
      .stats-overview {
        grid-template-columns: 1fr;
      }

      .stats-overview > * {
        max-width: 100%;
      }
    }

    .breakdown-group {
      background: var(--color-bg-secondary);
      border-radius: 12px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .breakdown-header {
      padding: 24px 24px 0;
    }

    .breakdown-title {
      font-size: 16px;
      color: var(--color-text-secondary);
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .breakdown-helper {
      font-size: 12px;
      color: var(--color-text-secondary);
      margin: 0 0 24px 0;
      opacity: 0.8;
    }

    .breakdown-stats {
      display: grid;
      gap: 16px;
      padding: 0 24px 24px;
      flex: 1;
    }

    .breakdown-stats > * {
      height: 100%;
      min-height: 120px;
    }

    .total-stats {
      height: 100%;
      min-height: 200px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Initial update
    this.updateStatistics();
    // Subscribe to store changes
    this.unsubscribe = store.subscribe(() => {
      this.updateStatistics();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup subscription
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private unsubscribe?: () => void;

  private updateStatistics() {
    const state = store.getState() as AppState;
    const employees = getEmployees(state) || [];

    this.statistics = {
      totalEmployees: employees.length,
      byPosition: {
        junior: employees.filter(emp => emp.position === 'junior').length,
        medior: employees.filter(emp => emp.position === 'medior').length,
        senior: employees.filter(emp => emp.position === 'senior').length,
      },
      byDepartment: {
        tech: employees.filter(emp => emp.department === 'tech').length,
        analytics: employees.filter(emp => emp.department === 'analytics').length,
      },
    };
  }

  render() {
    const { totalEmployees, byPosition, byDepartment } = this.statistics;

    return html`
      <app-page-container>
        <app-page-header>
          <span slot="title">${i18n.t('dashboard.title.main')}</span>
        </app-page-header>

        <div class="dashboard-content">
          <div class="stats-overview">
            <!-- Total Employees -->
            <div class="total-stats">
              <statistics-widget
                icon="people"
                title=${i18n.t('dashboard.statistics.total.title')}
                helper=${i18n.t('dashboard.statistics.total.helper')}
                .count=${totalEmployees}
                .trend="+16.24"
                isTotal
              ></statistics-widget>
            </div>

            <!-- Position Breakdown -->
            <div class="breakdown-group">
              <div class="breakdown-header">
                <h3 class="breakdown-title">${i18n.t('dashboard.statistics.byPosition.title')}</h3>
                <p class="breakdown-helper">${i18n.t('dashboard.statistics.byPosition.helper')}</p>
              </div>
              <div class="breakdown-stats">
                <statistics-widget
                  icon="person-badge"
                  title=${i18n.t('dashboard.statistics.byPosition.junior.title')}
                  helper=${i18n.t('dashboard.statistics.byPosition.junior.helper')}
                  .count=${byPosition.junior}
                ></statistics-widget>
                <statistics-widget
                  icon="person-badge-fill"
                  title=${i18n.t('dashboard.statistics.byPosition.medior.title')}
                  helper=${i18n.t('dashboard.statistics.byPosition.medior.helper')}
                  .count=${byPosition.medior}
                ></statistics-widget>
                <statistics-widget
                  icon="person-square"
                  title=${i18n.t('dashboard.statistics.byPosition.senior.title')}
                  helper=${i18n.t('dashboard.statistics.byPosition.senior.helper')}
                  .count=${byPosition.senior}
                ></statistics-widget>
              </div>
            </div>

            <!-- Department Breakdown -->
            <div class="breakdown-group">
              <div class="breakdown-header">
                <h3 class="breakdown-title">
                  ${i18n.t('dashboard.statistics.byDepartment.title')}
                </h3>
                <p class="breakdown-helper">
                  ${i18n.t('dashboard.statistics.byDepartment.helper')}
                </p>
              </div>
              <div class="breakdown-stats">
                <statistics-widget
                  icon="code-slash"
                  title=${i18n.t('dashboard.statistics.byDepartment.tech.title')}
                  helper=${i18n.t('dashboard.statistics.byDepartment.tech.helper')}
                  .count=${byDepartment.tech}
                ></statistics-widget>
                <statistics-widget
                  icon="graph-up"
                  title=${i18n.t('dashboard.statistics.byDepartment.analytics.title')}
                  helper=${i18n.t('dashboard.statistics.byDepartment.analytics.helper')}
                  .count=${byDepartment.analytics}
                ></statistics-widget>
              </div>
            </div>
          </div>
        </div>
      </app-page-container>
    `;
  }
}
