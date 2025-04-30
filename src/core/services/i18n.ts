import { store } from '../store';
import { ReactiveController, ReactiveControllerHost } from 'lit';
import en from '../../translations/en.json';
import tr from '../../translations/tr.json';

const translations = {
  en,
  tr,
} as const;

class I18nController implements ReactiveController {
  private host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {}
  hostDisconnected() {}
}

export class I18nService {
  private static instance: I18nService | null = null;
  private currentLanguage: string = 'en';
  private controllers: Set<ReactiveControllerHost> = new Set();
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  addHost(host: ReactiveControllerHost) {
    this.controllers.add(host);
    new I18nController(host);
  }

  removeHost(host: ReactiveControllerHost) {
    this.controllers.delete(host);
  }

  initialize() {
    if (this.initialized) return;

    this.currentLanguage =
      store.getState().core.locale?.language ?? import.meta.env.VITE_DEFAULT_LANGUAGE;

    store.subscribe(() => {
      const newLanguage = store.getState().core.locale?.language;
      if (newLanguage && this.currentLanguage !== newLanguage) {
        this.currentLanguage = newLanguage;
        this.notifyHosts();
      }
    });

    this.initialized = true;
  }

  private notifyHosts() {
    this.controllers.forEach(host => host.requestUpdate());
  }

  t(key: string): string {
    const lang = this.currentLanguage;
    const keys = key.split('.');
    let value: any = translations[lang as keyof typeof translations];

    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }

    return value ?? key;
  }
}

export const i18n = I18nService.getInstance();
