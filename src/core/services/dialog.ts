import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

interface DialogOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export class DialogService {
  private static defaultOptions: DialogOptions = {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'primary',
    size: 'small',
  };

  private static activeDialog: HTMLElement | null = null;

  private static closeActiveDialog() {
    if (this.activeDialog) {
      this.activeDialog.remove();
      this.activeDialog = null;
    }
  }

  static confirm(message: string, options: Partial<DialogOptions> = {}): Promise<boolean> {
    // Close any existing dialog first
    this.closeActiveDialog();

    return new Promise(resolve => {
      const dialog = document.createElement('sl-dialog');
      this.activeDialog = dialog;
      const finalOptions = { ...this.defaultOptions, ...options };
      let isResolved = false;

      // Create the dialog content
      dialog.innerHTML = `
        <div class="dialog-content">
          <p>${message}</p>
          <div class="dialog-footer" slot="footer">
            <sl-button class="cancel-button" variant="default" size="medium">
              ${finalOptions.cancelText}
            </sl-button>
            <sl-button class="confirm-button" variant="${finalOptions.variant}" size="medium">
              ${finalOptions.confirmText}
            </sl-button>
          </div>
        </div>
      `;

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .dialog-content {
          padding: var(--spacing-sm);
        }
        .dialog-content p {
          margin: 0;
          font-size: var(--font-size-md);
          color: var(--color-text-primary);
        }
        .dialog-footer {
          display: flex;
          gap: var(--spacing-sm);
          justify-content: flex-end;
          padding-top: var(--spacing-sm);
        }
        ::part(header) {
          color: var(--color-text-primary);
        }
        ::part(title) {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
        }
        .confirm-button::part(base) {
          background-color: ${finalOptions.variant === 'danger' ? 'var(--color-danger)' : 'var(--color-primary)'};
          border-color: ${finalOptions.variant === 'danger' ? 'var(--color-danger)' : 'var(--color-primary)'};
          color: var(--color-text-inverse);
        }
        .confirm-button::part(base):hover {
          background-color: ${finalOptions.variant === 'danger' ? 'var(--color-danger-hover)' : 'var(--color-primary-hover)'};
          border-color: ${finalOptions.variant === 'danger' ? 'var(--color-danger-hover)' : 'var(--color-primary-hover)'};
        }
        .cancel-button::part(base) {
          color: var(--color-text-primary);
          border-color: var(--color-border);
        }
        .cancel-button::part(base):hover {
          border-color: var(--color-border-hover);
          background-color: var(--color-background-hover);
        }
      `;
      dialog.appendChild(style);

      // Set dialog properties
      if (finalOptions.title) {
        dialog.label = finalOptions.title;
      }
      dialog.setAttribute('size', finalOptions.size || 'small');

      // Add event listeners
      const confirmButton = dialog.querySelector('.confirm-button') as HTMLElement;
      const cancelButton = dialog.querySelector('.cancel-button') as HTMLElement;

      const cleanup = () => {
        if (!isResolved) {
          isResolved = true;
          dialog.remove();
          this.activeDialog = null;
        }
      };

      const handleHide = () => {
        cleanup();
        resolve(false);
      };

      const handleConfirm = () => {
        if (!isResolved) {
          isResolved = true;
          dialog.hide();
          this.activeDialog = null;
          resolve(true);
        }
      };

      const handleCancel = () => {
        if (!isResolved) {
          isResolved = true;
          dialog.hide();
          this.activeDialog = null;
          resolve(false);
        }
      };

      confirmButton.addEventListener('click', handleConfirm);
      cancelButton.addEventListener('click', handleCancel);
      dialog.addEventListener('sl-hide', handleHide);

      // Show the dialog
      document.body.append(dialog);
      dialog.show();
    });
  }
}
