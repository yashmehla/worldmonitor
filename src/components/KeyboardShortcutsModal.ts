import { SITE_VARIANT } from '@/config';

interface Shortcut {
  keys: string;
  description: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: '⌘K / Ctrl+K', description: 'Open search' },
  { keys: '?', description: 'Show keyboard shortcuts' },
  { keys: 'Escape', description: 'Close modal / exit fullscreen' },
  ...(SITE_VARIANT === 'happy' ? [{ keys: 'Shift+T', description: 'Toggle TV mode' }] : []),
];

const MAP_SHORTCUTS: Shortcut[] = [
  { keys: 'Scroll', description: 'Zoom in / out' },
  { keys: 'Click + Drag', description: 'Pan the map' },
  { keys: 'Right-click + Drag', description: 'Rotate / tilt (3D)' },
];

export class KeyboardShortcutsModal {
  private overlay: HTMLElement;
  private boundKeyHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'kbd-modal-overlay';
    this.overlay.innerHTML = `
      <div class="kbd-modal">
        <div class="kbd-modal-header">
          <span class="kbd-modal-title">⌨️ Keyboard Shortcuts</span>
          <button class="kbd-modal-close" aria-label="Close">×</button>
        </div>
        <div class="kbd-modal-body">
          <div class="kbd-section">
            <div class="kbd-section-title">General</div>
            ${SHORTCUTS.map(s => `
              <div class="kbd-row">
                <span class="kbd-keys">${s.keys.split(' / ').map(k => `<kbd>${k}</kbd>`).join(' / ')}</span>
                <span class="kbd-desc">${s.description}</span>
              </div>
            `).join('')}
          </div>
          <div class="kbd-section">
            <div class="kbd-section-title">Map Controls</div>
            ${MAP_SHORTCUTS.map(s => `
              <div class="kbd-row">
                <span class="kbd-keys"><kbd>${s.keys}</kbd></span>
                <span class="kbd-desc">${s.description}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.boundKeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.close();
    };

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    this.overlay.querySelector('.kbd-modal-close')?.addEventListener('click', () => this.close());

    document.body.appendChild(this.overlay);
  }

  open(): void {
    this.overlay.classList.add('open');
    document.addEventListener('keydown', this.boundKeyHandler);
  }

  close(): void {
    this.overlay.classList.remove('open');
    document.removeEventListener('keydown', this.boundKeyHandler);
  }

  isOpen(): boolean {
    return this.overlay.classList.contains('open');
  }

  destroy(): void {
    document.removeEventListener('keydown', this.boundKeyHandler);
    this.overlay.remove();
  }
}
