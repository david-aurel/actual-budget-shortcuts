// Polyfill browser globals required by @actual-app/api before any modules load
if (typeof globalThis.navigator === 'undefined') {
  globalThis.navigator = { platform: 'node' }
}
