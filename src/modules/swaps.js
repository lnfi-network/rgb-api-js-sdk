/**
 * Swap operations module
 * Contains methods for interacting with asset swap functionality
 */
export class SwapMethods {
  /**
   * Create SwapMethods instance
   * @param {Object} client - The RgbApiClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Init a swap on the maker side
   * @param {Object} data - Request data
   * @param {number} data.qty_from - Quantity of the asset to be sent by the maker
   * @param {number} data.qty_to - Quantity of the asset to be received by the maker
   * @param {string} data.from_asset - Asset ID to be sent by the maker
   * @param {string} data.to_asset - Asset ID to be received by the maker
   * @param {number} data.timeout_sec - Swap timeout in seconds
   * @returns {Promise<import('../types').MakerInitResponse>} Maker init response
   */
  async makerInitSwap(data) {
    return this.client._request('post', '/makerinit', data);
  }

  /**
   * Execute a swap on the maker side
   * @param {Object} data - Request data
   * @param {string} data.swapstring - The swapstring for the swap to be executed
   * @param {string} data.payment_secret - The payment secret corresponding to the swap's payment hash
   * @param {string} data.taker_pubkey - The public key of the taker
   * @returns {Promise<import('../types').EmptyResponse>} Resolves when swap is executed successfully
   */
  async makerExecuteSwap(data) {
    return this.client._request('post', '/makerexecute', data);
  }

  /**
   * Accept a swap on the taker side
   * @param {Object} data - Request data
   * @param {string} data.swapstring - The swapstring received from the maker
   * @returns {Promise<import('../types').EmptyResponse>} Resolves when swap is accepted successfully
   */
  async takerAcceptSwap(data) {
    return this.client._request('post', '/taker', data);
  }

  /**
   * Get a swap by its payment hash
   * @param {Object} data - Request data
   * @param {string} data.payment_hash - Payment hash of the swap
   * @param {boolean} [data.taker] - Whether the query is for a taker swap
   * @returns {Promise<import('../types').GetSwapResponse>} Get swap response
   */
  async getSwap(data) {
    return this.client._request('post', '/getswap', data);
  }

  /**
   * List all swaps
   * @returns {Promise<import('../types').ListSwapsResponse>} List swaps response
   */
  async listSwaps() {
    return this.client._request('get', '/listswaps');
  }
}
