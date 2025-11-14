/**
 * Node operations module
 * Contains methods for interacting with RGB node functionality
 */
export class NodeMethods {
  /**
   * Create NodeMethods instance
   * @param {Object} client - The RgbApiClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get node information
   * @returns {Promise<import('../types').NodeInfoResponse>} Node info response
   */
  async getNodeInfo() {
    return this.client._request('get', '/nodeinfo');
  }

  /**
   * Get the current state of the RGB node by checking /nodeinfo endpoint response
   * @returns {Promise<number>} The numeric state of the node (0=NON_EXISTING, 1=LOCKED, 4=SERVER_ACTIVE)
   */
  async getNodeState() {
    try {
      const responseData = await this.client._request('get', '/nodestate');
      return responseData?.state;
    } catch (error) {
      // Handle errors thrown by _request (e.g., network errors)
      if (error.message.includes('Network Error')) {
        return "NON_EXISTING"; // NON_EXISTING (API endpoint not reachable)
      } else {
        // Re-throw any other unexpected errors from _request
        throw error;
      }
    }
  }

  /**
   * Get info on the Bitcoin network where the LN is running
   * @returns {Promise<import('../types').NetworkInfoResponse>} Network info response
   */
  async getNetworkInfo() {
    return this.client._request('get', '/networkinfo');
  }

  /**
   * Check the validity of an RGB indexer URL
   * @param {Object} data - Request data
   * @param {string} data.indexer_url - The indexer URL to check
   * @returns {Promise<import('../types').CheckIndexerUrlResponse>} Check indexer URL response
   */
  async checkIndexerUrl(data) {
    return this.client._request('post', '/checkindexerurl', data);
  }

  /**
   * Check the validity of a STORM proxy endpoint URL
   * @param {Object} data - Request data
   * @param {string} data.proxy_endpoint - The proxy URL to check
   * @returns {Promise<import('../types').EmptyResponse>} Check proxy endpoint response
   */
  async checkProxyEndpoint(data) {
    return this.client._request('post', '/checkproxyendpoint', data);
  }

  /**
   * Send an onion message
   * @param {Object} data - Request data
   * @param {string[]} data.node_ids - Array of node pubkeys forming the path
   * @param {number} data.tlv_type - TLV type for the payload
   * @param {string} data.data - Payload to send
   * @returns {Promise<import('../types').EmptyResponse>} Send onion message response
   */
  async sendOnionMessage(data) {
    return this.client._request('post', '/sendonionmessage', data);
  }

  /**
   * Sign a message with the node's private key
   * @param {Object} data - Request data
   * @param {string} data.message - The message to sign
   * @returns {Promise<import('../types').SignMessageResponse>} Sign message response
   */
  async signMessage(data) {
    return this.client._request('post', '/signmessage', data);
  }

  /**
   * Initialize the node
   * @param {Object} data - Request data
   * @param {string} data.password - Node password
   * @returns {Promise<import('../types').InitResponse>} Init response containing the mnemonic
   */
  async initNode(data) {
    return this.client._request('post', '/init', data);
  }

  /**
   * Unlock the node
   * @param {Object} data - Request data
   * @param {string} data.password - Node password
   * @param {string} [data.bitcoind_rpc_username] - Bitcoin Core RPC username (optional)
   * @param {string} [data.bitcoind_rpc_password] - Bitcoin Core RPC password (optional)
   * @param {string} [data.bitcoind_rpc_host] - Bitcoin Core RPC host (optional)
   * @param {number} [data.bitcoind_rpc_port] - Bitcoin Core RPC port (optional)
   * @param {string} [data.indexer_url] - Electrum or Esplora indexer URL (optional)
   * @param {string} [data.proxy_endpoint] - STORM proxy endpoint URL (optional)
   * @param {string[]} [data.announce_addresses] - Addresses to announce for the node (optional)
   * @param {string} [data.announce_alias] - Alias to announce for the node (optional)
   * @returns {Promise<import('../types').EmptyResponse>} Resolves when the node is successfully unlocked
   */
  async unlockNode(data) {
    return this.client._request('post', '/unlock', data);
  }

  /**
   * Lock the node
   * @returns {Promise<import('../types').EmptyResponse>} Resolves when the lock request is processed
   */
  async lockNode() {
    return this.client._request('post', '/lock');
  }

  /**
   * Change the node password
   * @param {Object} data - Request data
   * @param {string} data.old_password - Current password
   * @param {string} data.new_password - New password
   * @returns {Promise<import('../types').EmptyResponse>} Resolves when password is successfully changed
   */
  async changePassword(data) {
    return this.client._request('post', '/changepassword', data);
  }

  /**
   * Backup the node
   * @param {Object} data - Request data
   * @param {string} data.password - Node password
   * @param {string} data.backup_path - Path to save the backup file
   * @returns {Promise<import('../types').EmptyResponse>} Resolves when the backup request is processed
   */
  async backupNode(data) {
    return this.client._request('post', '/backup', data);
  }

  /**
   * Restore the node
   * @param {Object} data - Request data
   * @param {string} data.password - Node password
   * @param {string} data.backup_path - Path to the backup file
   * @returns {Promise<import('../types').EmptyResponse>} Resolves when the restore request is processed
   */
  async restoreNode(data) {
    return this.client._request('post', '/restore', data);
  }
}
