// Import the alert component type for TypeScript
import '@shoelace-style/shoelace/dist/components/alert/alert.js';

interface ToastOptions {
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  duration?: number;
  icon?: string;
  closable?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export class ToastService {
  private static defaultDuration = 3000;
  private static defaultPosition = 'top-right';

  private static show(message: string, options: ToastOptions) {
    const alert = Object.assign(document.createElement('sl-alert'), {
      variant: options.variant,
      closable: options.closable ?? true,
      duration: options.duration ?? this.defaultDuration,
      innerHTML: message,
    });

    if (options.icon) {
      alert.setAttribute('icon', options.icon);
    }

    document.body.append(alert);
    alert.toast();
  }

  static success(message: string, options: Partial<ToastOptions> = {}) {
    this.show(message, {
      variant: 'success',
      icon: 'check-circle',
      ...options,
    });
  }

  static error(message: string, options: Partial<ToastOptions> = {}) {
    this.show(message, {
      variant: 'danger',
      icon: 'exclamation-circle',
      ...options,
    });
  }

  static info(message: string, options: Partial<ToastOptions> = {}) {
    this.show(message, {
      variant: 'primary',
      icon: 'info-circle',
      ...options,
    });
  }

  static warning(message: string, options: Partial<ToastOptions> = {}) {
    this.show(message, {
      variant: 'warning',
      icon: 'exclamation-triangle',
      ...options,
    });
  }
}
