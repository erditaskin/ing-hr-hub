import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('app-styled-popover')
export class StyledPopover extends LitElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  protected triggerElement: HTMLElement | null = null;
  protected popoverElement: HTMLElement | null = null;

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .trigger {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      cursor: pointer;
      padding: var(--spacing-sm);
    }

    :host([open]) .trigger {
      color: var(--color-primary);
    }

    .popover {
      position: fixed;
      z-index: var(--z-index-popover, 1000);
      background: var(--color-bg-primary, #ffffff);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--border-radius-md, 8px);
      box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
      padding: var(--spacing-md, 16px);
      min-width: 280px;
      max-width: 90vw;
      max-height: 80vh;
      overflow: auto;
      visibility: hidden;
      opacity: 0;
      transition:
        opacity 0.2s ease,
        visibility 0.2s ease;
    }

    :host([open]) .popover {
      visibility: visible;
      opacity: 1;
    }

    /* Style adjustments for filter inputs */
    ::slotted(input),
    ::slotted(select) {
      width: 100%;
      padding: var(--spacing-sm, 8px);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--border-radius-sm, 4px);
      margin-bottom: var(--spacing-sm, 8px);
      font-size: var(--font-size-base, 14px);
    }

    ::slotted(*:last-child) {
      margin-bottom: 0;
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
        padding: var(--spacing-lg, 24px);
      }

      ::slotted(input),
      ::slotted(select) {
        padding: var(--spacing-md, 12px);
        font-size: var(--font-size-lg, 16px);
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
