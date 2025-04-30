import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { store } from '../store';
import { i18n } from '../services/i18n';
import { setLanguage, setLocale } from '../store/reducers/core';
import { Unsubscribe } from '@reduxjs/toolkit';

@customElement('localization-provider')
export class LocalizationProvider extends LitElement {
  @state()
  private isInitialized = false;

  @state()
  private currentLanguage = '';

  private unsubscribe?: Unsubscribe;

  constructor() {
    super();
    i18n.addHost(this);
  }

  connectedCallback() {
    super.connectedCallback();

    // Initialize i18n service
    i18n.initialize();

    // Subscribe to store language changes
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const language = state.core.locale?.language;

      if (language && language !== this.currentLanguage) {
        this.currentLanguage = language;
        this.isInitialized = true;
        document.documentElement.lang = language;
      }
    });

    // Check initial state
    const state = store.getState();
    const currentLanguage = state.core.locale?.language;

    if (currentLanguage) {
      this.isInitialized = true;
      this.currentLanguage = currentLanguage;
      document.documentElement.lang = currentLanguage;
    } else {
      // Set initial language if not set
      store.dispatch(
        setLocale({
          language: import.meta.env.VITE_DEFAULT_LANGUAGE,
          supportedLanguages: import.meta.env.VITE_SUPPORTED_LANGUAGES.split(','),
        })
      );
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    i18n.removeHost(this);
  }

  protected createRenderRoot() {
    return this;
  }

  render() {
    return this.isInitialized ? html`<slot></slot>` : html`<div>Initializing language...</div>`;
  }
}
