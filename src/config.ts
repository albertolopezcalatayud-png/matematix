/** The name in one place, so it can change without touching anything else. */
export const APP_NAME = 'Matematix';
declare global { const __APP_VERSION__: string }
export const APP_VERSION = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.1.0';
/** Public address, used by the QR codes on paper worksheets (they only open a station; nothing is sent back). */
export const SITE = 'https://albertolopezcalatayud-png.github.io/matematix/';
