import axios from 'axios';

// Import module classes
import { OnchainMethods } from './modules/onchain.js';
import { RgbMethods } from './modules/rgb.js';
import { LightningMethods } from './modules/lightning.js';
import { SwapMethods } from './modules/swaps.js';
import { NodeMethods } from './modules/node.js';

/**
 * RGB API Client SDK
 * A client for interacting with the RGB Lightning Node API
 * 
 * @class RgbApiClient
 */
export class RgbApiClient {
  /**
   * Create a new RGB API client
   * @param {string|Object} baseUrlOrOptions - Base URL string or configuration options object
   * @param {string} [apiKey] - API key (when first param is string)
   */
  constructor(baseUrlOrOptions = {}, apiKey = null) {
    // Handle both old (baseUrl, apiKey) and new (options) constructor signatures
    let options = {};
    if (typeof baseUrlOrOptions === 'string') {
      // Legacy constructor: (baseUrl, apiKey)
      options.baseUrl = baseUrlOrOptions;
      if (apiKey) {
        options.headers = { 'Authorization': `Bearer ${apiKey}` };
      }
    } else {
      // New constructor: (options)
      options = baseUrlOrOptions;
    }

    this.baseUrl = options.baseUrl || 'http://localhost:3001';
    
    // Create axios instance with default configuration
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options.axiosConfig
    });

    // Initialize module sub-classes
    this.onchain = new OnchainMethods(this);
    this.rgb = new RgbMethods(this);
    this.lightning = new LightningMethods(this);
    this.swaps = new SwapMethods(this);
    this.node = new NodeMethods(this);
  }

  /**
   * Internal request method for making HTTP calls to the RGB API
   * @private
   * @param {string} method - HTTP method (get, post, put, delete)
   * @param {string} endpoint - API endpoint
   * @param {Object} [data] - Request data
   * @returns {Promise<Object>} Response data
   */
  async _request(method, endpoint, data = null) {
    try {
      const config = {
        method,
        url: endpoint,
      };

      if (data !== null && (method === 'post' || method === 'put' || method === 'patch')) {
        config.data = data;
      } else if (data !== null && method === 'get') {
        config.params = data;
      }

      const response = await this.axios.request(config);
      return response.data;
    } catch (error) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText;
        throw new Error(`API Error (${error.response.status}): ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error(`Network Error: Unable to reach RGB API at ${this.baseUrl}`);
      } else {
        // Something else happened
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }
}
