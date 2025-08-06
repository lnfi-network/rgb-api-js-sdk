// Main entry point for the RGB API SDK
import { RgbApiClient } from './client.js';

// Export modules for potential direct access
export * from './modules/onchain.js';
export * from './modules/rgb.js';
export * from './modules/lightning.js';
export * from './modules/swaps.js';
export * from './modules/node.js';

// Export the client as both named and default export
export { RgbApiClient };
export default RgbApiClient;
