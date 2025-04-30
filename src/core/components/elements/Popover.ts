import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface PopoverPosition {
  vertical: 'top' | 'center' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

@customElement('app-popover')
export class Popover extends LitElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Object })
  anchorOrigin: PopoverPosition = {
    vertical: 'bottom',
    horizontal: 'left',
  };

  @property({ type: Object })
  transformOrigin: PopoverPosition = {
    vertical: 'top',
    horizontal: 'left',
  };

  @state()
  private triggerRect: DOMRect | null = null;

  protected triggerElement: HTMLElement | null = null;
  protected popoverElement: HTMLElement | null = null;

  static styles = css`
    :host {
      position: relative;
      display: inline-block;
    }

    .trigger {
      cursor: pointer;
    }

    .popover {
      display: none;
      position: fixed;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      min-width: 60px;
    }

    :host([open]) .popover {
      display: block;
    }

    @media (max-width: 768px) {
      .popover {
        position: fixed;
        top: auto !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100%;
        max-width: 100%;
        border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
        border-bottom: none;
        max-height: 60vh;
        margin-top: 0;
      }
    }
  `;

  protected updatePosition = () => {
    if (!this.open || !this.triggerElement || !this.popoverElement) return;

    const rect = this.triggerElement.getBoundingClientRect();
    this.popoverElement.style.top = rect.bottom + 4 + 'px';
    this.popoverElement.style.left = rect.left + 'px';

    // Adjust if popover goes off-screen
    const popoverRect = this.popoverElement.getBoundingClientRect();
    if (popoverRect.right > window.innerWidth) {
      this.popoverElement.style.left = window.innerWidth - popoverRect.width - 16 + 'px';
    }
  };

  protected handleTriggerClick(e: MouseEvent) {
    this.open = !this.open;
    if (this.open) {
      document.addEventListener('click', this.handleClickOutside);
      document.addEventListener('scroll', this.updatePosition, true);
      window.addEventListener('resize', this.updatePosition);

      // Cache elements and update position
      this.triggerElement = this.renderRoot.querySelector('.trigger');
      this.popoverElement = this.renderRoot.querySelector('.popover');
      requestAnimationFrame(this.updatePosition);
    } else {
      this.removeEventListeners();
    }
  }

  protected handleClickOutside = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.open = false;
      this.removeEventListeners();
    }
  };

  protected removeEventListeners() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('scroll', this.updatePosition, true);
    window.removeEventListener('resize', this.updatePosition);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListeners();
  }

  render() {
    return html`
      <div class="trigger" @click=${this.handleTriggerClick}>
        <slot name="trigger"></slot>
      </div>
      <div class="popover">
        <slot></slot>
      </div>
    `;
  }
}
