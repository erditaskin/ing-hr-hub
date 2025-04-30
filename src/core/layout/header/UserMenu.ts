import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { store, AppState } from '../../store';
import '../../components/elements/Avatar';
import '../../components/elements/Popover';
import { getUserName } from '../../store/selectors/core';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import { setLanguage } from '../../store/reducers/core';
import { i18n } from '../../services/i18n';

@customElement('app-user-menu')
export class UserMenu extends LitElement {
  @state()
  private currentLanguage = store.getState().core.locale?.language || '';

  @state()
  private supportedLanguages = store.getState().core.locale?.supportedLanguages || [];

  private unsubscribe: (() => void) | null = null;

  static readonly styles = css`
    .user-menu {
      color: var(--color-text);
      font-size: 1rem;
      font-family: var(--font-family);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    sl-icon {
      font-size: 24px;
      color: currentColor;
    }
    .language-trigger {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      cursor: pointer;
      background: transparent;
      color: var(--color-text);
      font-size: 0.875rem;
      min-width: 64px;
      justify-content: space-between;
    }
    .language-trigger:hover {
      background: var(--color-surface-hover);
    }
    .language-menu {
      min-width: 64px;
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      overflow: hidden;
      padding: 0;
    }
    .language-item {
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--color-text);
      text-align: center;
      transition: background-color 0.2s ease;
    }
    .language-item:hover {
      background: var(--color-surface-hover);
    }
    .language-item[selected] {
      background: #f16e00;
      color: white;
      font-weight: 500;
    }
    sl-icon[name='chevron-down'] {
      font-size: 1rem;
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.currentLanguage = state.core.locale?.language ?? '';
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  get userName() {
    const state = store.getState() as AppState;
    return getUserName(state) || i18n.t('common.user');
  }

  private handleLanguageSelect(lang: string) {
    store.dispatch(setLanguage(lang));
  }

  render() {
    return html`
      <div class="user-menu">
        <app-popover
          .anchorOrigin=${{ vertical: 'bottom', horizontal: 'left' }}
          .transformOrigin=${{ vertical: 'top', horizontal: 'left' }}
        >
          <div slot="trigger" class="language-trigger">
            ${this.currentLanguage.toUpperCase()}
            <sl-icon name="chevron-down"></sl-icon>
          </div>
          <div class="language-menu">
            ${this.supportedLanguages.map(
              lang => html`
                <div
                  class="language-item"
                  ?selected=${lang === this.currentLanguage}
                  @click=${() => this.handleLanguageSelect(lang)}
                >
                  ${lang.toUpperCase()}
                </div>
              `
            )}
          </div>
        </app-popover>
        <div class="user-info">
          <app-avatar .name=${this.userName}>
            <sl-icon name="person-circle" label=${i18n.t('common.user')}></sl-icon>
          </app-avatar>
          <span class="user-name">${this.userName}</span>
        </div>
      </div>
    `;
  }
}
