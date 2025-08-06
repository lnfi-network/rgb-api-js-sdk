/**
 * On-chain operations module
 * Contains methods for interacting with Bitcoin on-chain functionality
 */
export class OnchainMethods {
  /**
   * Create OnchainMethods instance
   * @param {Object} client - The RgbApiClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get a new Bitcoin address from the internal BDK wallet
   * @returns {Promise<import('../types').AddressResponse>} Address response containing the generated Bitcoin address
   */
  async getAddress() {
    return this.client._request('post', '/address');
  }

  /**
   * Get the node's bitcoin balance for the vanilla and colored wallets
   * @param {Object} [data={}] - Request data
   * @param {boolean} [data.skip_sync] - Skip syncing the wallet
   * @returns {Promise<import('../types').BtcBalanceResponse>} BTC balance response for both vanilla and colored wallets
   */
  async getBtcBalance(data = {}) {
    return this.client._request('post', '/btcbalance', data);
  }

  /**
   * Send bitcoin to an address
   * @param {Object} data - Request data
   * @param {string} data.address - Bitcoin address
   * @param {number} data.amount - Amount in satoshis
   * @param {number} [data.fee_rate] - Fee rate in sat/vB
   * @param {boolean} [data.skip_sync] - Skip syncing the wallet
   * @returns {Promise<import('../types').SendBtcResponse>} Send bitcoin response containing the transaction ID
   */
  async sendBtc(data) {
    return this.client._request('post', '/sendbtc', data);
  }

  /**
   * Create UTXOs for RGB allocations
   * @param {Object} [data={}] - Request data
   * @param {boolean} [data.up_to] - Create UTXOs up to the specified number
   * @param {number} [data.num] - Number of UTXOs to create
   * @param {number} [data.size] - Size of each UTXO in satoshis
   * @param {number} [data.fee_rate] - Fee rate in sat/vB
   * @param {boolean} [data.skip_sync] - Skip syncing the wallet
   * @returns {Promise<import('../types').EmptyResponse>} Resolves when UTXOs are successfully created
   */
  async createUtxos(data = {}) {
    return this.client._request('post', '/createutxos', data);
  }

  /**
   * Get on-chain fee estimation
   * @param {Object} data - Request data
   * @param {number} data.blocks - Number of blocks for fee estimation
   * @returns {Promise<import('../types').EstimateFeeResponse>} Fee estimation response
   */
  async estimateFee(data) {
    return this.client._request('post', '/estimatefee', data);
  }

  /**
   * List all on-chain transactions
   * @param {Object} [data={}] - Request data
   * @param {boolean} [data.skip_sync] - Skip syncing the wallet
   * @returns {Promise<import('../types').ListTransactionsResponse>} List transactions response
   */
  async listOnchainTransactions(data = {}) {
    return this.client._request('post', '/listtransactions', data);
  }

  /**
   * List all unspent transaction outputs (UTXOs)
   * @param {Object} [data={}] - Request data
   * @param {boolean} [data.skip_sync] - Skip syncing the wallet
   * @returns {Promise<import('../types').ListUnspentsResponse>} List unspents response
   */
  async listUnspents(data = {}) {
    return this.client._request('post', '/listunspents', data);
  }
}
