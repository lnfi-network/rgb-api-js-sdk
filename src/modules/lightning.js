/**
 * Lightning Network operations module
 * Contains methods for interacting with Lightning Network functionality
 */
import { decodeRGBLNInvoice } from './utils';

export class LightningMethods {
  /**
   * Create LightningMethods instance
   * @param {Object} client - The RgbApiClient instance
   */
  constructor(client) {
    this.client = client;
    // Instance-specific subscription management (only for payments)
    this.paymentSubscriptions = new Map();
    this.paymentPollingIntervals = new Map();
  }

  /**
   * Connect to a Lightning Network peer
   * @param {Object} data - Request data
   * @param {string} data.peer_pubkey_and_addr - Peer connection string (pubkey@host:port)
   * @returns {Promise<import('../types').EmptyResponse>} Connect peer response
   */
  async connectPeer(data) {
    return this.client._request('post', '/connectpeer', data);
  }

  /**
   * List all connected Lightning Network peers
   * @returns {Promise<import('../types').ListPeersResponse>} List peers response
   */
  async listPeers() {
    return this.client._request('get', '/listpeers');
  }

  /**
   * Disconnect a Lightning Network peer
   * @param {Object} data - Request data
   * @param {string} data.peer_pubkey - Pubkey of the peer to disconnect
   * @returns {Promise<import('../types').EmptyResponse>} Disconnect peer response
   */
  async disconnectPeer(data) {
    return this.client._request('post', '/disconnectpeer', data);
  }

  /**
   * Open a Lightning Network channel
   * @param {Object} data - Request data
   * @param {string} data.peer_pubkey_and_opt_addr - Peer public key with optional address
   * @param {number} data.capacity_sat - Channel capacity in satoshis
   * @param {number} [data.push_msat] - Amount to push to the remote side in millisatoshis
   * @param {number} [data.asset_amount] - Amount of asset to include in the channel
   * @param {string} [data.asset_id] - Asset ID to include in the channel
   * @param {boolean} [data.public] - Whether to announce the channel to the network
   * @param {boolean} [data.with_anchors] - Whether to use anchor outputs
   * @param {number} [data.fee_base_msat] - Base fee in millisatoshis
   * @param {number} [data.fee_proportional_millionths] - Fee rate in millionths
   * @param {string} [data.temporary_channel_id] - Temporary channel ID
   * @returns {Promise<import('../types').OpenChannelResponse>} Open channel response
   */
  async openChannel(data) {
    return this.client._request('post', '/openchannel', data);
  }

  /**
   * Close a Lightning Network channel
   * @param {Object} data - Request data
   * @param {string} data.channel_id - Channel ID
   * @param {boolean} [data.force] - Force close the channel
   * @param {string} data.peer_pubkey - Public key of the peer associated with the channel
   * @returns {Promise<import('../types').EmptyResponse>} Close channel response
   */
  async closeChannel(data) {
    return this.client._request('post', '/closechannel', data);
  }

  /**
   * List all Lightning Network channels
   * @returns {Promise<import('../types').ListChannelsResponse>} List channels response
   */
  async listChannels() {
    return this.client._request('get', '/listchannels');
  }

  /**
   * Get a channel's ID from its former temporary channel ID
   * @param {Object} data - Request data, corresponds to GetChannelIdRequest in OpenAPI
   * @param {string} data.temporary_channel_id - The temporary channel ID (32 bytes hex-encoded string)
   * @returns {Promise<import('../types').GetChannelIdResponse>} Get channel ID response
   */
  async getChannelIdByTempId(data) {
    return this.client._request('post', '/getchannelid', data);
  }

  /**
   * Create a Lightning Network invoice (BOLT11)
   * @param {Object} data - Request data
   * @param {number} data.amt_msat - Amount in millisatoshis
   * @param {number} [data.expiry_sec] - Invoice expiry in seconds (optional)
   * @param {string} [data.asset_id] - Asset ID for RGB-LNP invoices (optional)
   * @param {number} [data.asset_amount] - Asset amount for RGB-LNP invoices (optional)
   * @returns {Promise<import('../types').LNInvoiceResponse>} Create invoice response
   */
  async createInvoice(data) {
    return this.client._request('post', '/lninvoice', data);
  }

  /**
   * Pay a Lightning Network invoice
   * @param {Object} data - Request data
   * @param {string} data.invoice - BOLT11 invoice
   * @returns {Promise<import('../types').SendPaymentResponse>} Pay invoice response
   */
  async payInvoice(data) {
    return this.client._request('post', '/sendpayment', data);
  }

  /**
   * Decode a Lightning Network invoice
   * @param {Object} data - Request data
   * @param {string} data.invoice - BOLT11 invoice
   * @returns {Promise<import('../types').DecodeLNInvoiceResponse>} Decode invoice response
   */
  async decodeLnInvoice(data) {
    return this.client._request('post', '/decodelninvoice', data);
  }

  /**
   * Get the status of a Lightning Network invoice
   * @param {Object} data - Request data
   * @param {string} data.invoice - BOLT11 invoice string
   * @returns {Promise<import('../types').InvoiceStatusResponse>} Invoice status response
   */
  async getInvoiceStatus(data) {
    return this.client._request('post', '/invoicestatus', data);
  }

  /**
   * Get a specific Lightning Network payment
   * @param {Object} data - Request data
   * @param {string} data.payment_hash - Payment hash
   * @returns {Promise<import('../types').GetPaymentResponse>} Get payment response
   */
  async getPayment(data) {
    return this.client._request('post', '/getpayment', data);
  }

  /**
   * List all Lightning Network payments
   * @returns {Promise<import('../types').ListPaymentsResponse>} List payments response
   */
  async listPayments() {
    return this.client._request('get', '/listpayments');
  }

  /**
   * Send a spontaneous payment (keysend)
   * @param {Object} data - Request data
   * @param {string} data.dest_pubkey - Pubkey of the recipient node
   * @param {number} data.amt_msat - Amount to send in millisatoshis
   * @param {string} [data.asset_id] - Asset ID for RGB keysend (optional)
   * @param {number} [data.asset_amount] - Asset amount for RGB keysend (optional)
   * @returns {Promise<import('../types').KeysendResponse>} Keysend response
   */
  async keysend(data) {
    return this.client._request('post', '/keysend', data);
  }

  /**
   * Subscribe to payment updates
   * @param {Object} options - Subscription options
   * @param {Function} options.onPayment - Callback function for new payments
   * @param {Function} [options.onError] - Callback function for errors
   * @param {number} [options.pollingInterval=5000] - Polling interval in milliseconds
   * @param {number} [options.maxStoredIds=1000] - Maximum number of payment IDs to store in memory
   * @param {boolean} [options.skipInitialFetch=false] - Skip fetching existing payments on startup
   * @returns {string} - Subscription ID
   */
  subscribeToPastPayments(options) {
    const { 
      onPayment, 
      onError, 
      pollingInterval = 5000, 
      maxStoredIds = 1000,
      skipInitialFetch = false
    } = options;
    
    if (!onPayment || typeof onPayment !== 'function') {
      throw new Error('onPayment callback is required and must be a function');
    }
    
    // Validate polling interval to prevent excessive API calls
    if (pollingInterval < 1000) {
      console.warn('Warning: Polling interval less than 1000ms may cause performance issues');
    }
    
    // Generate a unique subscription ID
    const subscriptionId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store last known payment timestamp and IDs
    let lastTimestamp = Date.now();
    const knownPaymentIds = new Set();
    const paymentTimestamps = new Map(); // For tracking age of IDs
    
    // Function to limit the size of stored IDs
    const limitStoredIds = () => {
      if (knownPaymentIds.size <= maxStoredIds) return;
      
      // Sort by timestamp (oldest first)
      const sortedIds = [...paymentTimestamps.entries()]
        .sort((a, b) => a[1] - b[1])
        .map(entry => entry[0]);
      
      // Remove oldest entries to get back to the limit
      const idsToRemove = sortedIds.slice(0, knownPaymentIds.size - maxStoredIds);
      idsToRemove.forEach(id => {
        knownPaymentIds.delete(id);
        paymentTimestamps.delete(id);
      });
    };
    
    // Initial load to get existing payments (if not skipped)
    if (!skipInitialFetch) {
      this.listPayments()
        .then(response => {
          if (response && response.payments && Array.isArray(response.payments)) {
            // Store known payment IDs with timestamps
            response.payments.forEach(payment => {
              knownPaymentIds.add(payment.payment_hash);
              paymentTimestamps.set(payment.payment_hash, payment.created_at || Date.now());
            });
            
            // Limit stored IDs if needed
            limitStoredIds();
          }
        })
        .catch(error => {
          if (onError && typeof onError === 'function') {
            onError(error);
          }
        });
    }
    
    // Set up polling interval with dynamic backoff
    let currentPollingInterval = pollingInterval;
    let consecutiveEmptyPolls = 0;
    
    const intervalId = setInterval(async () => {
      try {
        const response = await this.listPayments();
        
        if (response && response.payments && Array.isArray(response.payments)) {
          // Check for new payments
          const newPayments = response.payments.filter(payment => {
            // Check if this is a new payment we haven't seen before
            if (!knownPaymentIds.has(payment.payment_hash)) {
              knownPaymentIds.add(payment.payment_hash);
              paymentTimestamps.set(payment.payment_hash, payment.created_at || Date.now());
              return true;
            }
            
            // Or if it's a known payment but its state has changed
            const isUpdated = knownPaymentIds.has(payment.payment_hash) && 
                   payment.updated_at > (paymentTimestamps.get(payment.payment_hash) || 0);
                   
            if (isUpdated) {
              // Update the timestamp
              paymentTimestamps.set(payment.payment_hash, payment.updated_at || Date.now());
              return true;
            }
            
            return false;
          });
          
          // Update last timestamp
          if (response.payments.length > 0) {
            const latestTimestamp = Math.max(
              ...response.payments.map(payment => payment.updated_at || 0)
            );
            lastTimestamp = Math.max(lastTimestamp, latestTimestamp);
          }
          
          // Limit stored IDs if needed
          limitStoredIds();
          
          // Notify for each new payment
          if (newPayments.length > 0) {
            newPayments.forEach(payment => {
              onPayment(payment);
            });
            
            // Reset consecutive empty polls counter
            consecutiveEmptyPolls = 0;
          } else {
            // Increment consecutive empty polls counter
            consecutiveEmptyPolls++;
            
            // If we've had several empty polls, we can slow down polling
            // to reduce server load (up to 3x the original interval)
            if (consecutiveEmptyPolls > 5) {
              const newInterval = Math.min(pollingInterval * 3, pollingInterval * (1 + consecutiveEmptyPolls/10));
              
              if (newInterval !== currentPollingInterval) {
                currentPollingInterval = newInterval;
                clearInterval(intervalId);
                
                // Update the interval with the new polling rate
                const newIntervalId = setInterval(intervalId.callback, currentPollingInterval);
                this.paymentPollingIntervals.set(subscriptionId, newIntervalId);
              }
            }
          }
        }
      } catch (error) {
        if (onError && typeof onError === 'function') {
          onError(error);
        }
      }
    }, pollingInterval);
    
    // Store the callback for potential interval adjustments
    intervalId.callback = intervalId._onTimeout;
    
    // Store subscription data
    this.paymentSubscriptions.set(subscriptionId, {
      onPayment,
      onError,
      pollingInterval,
      currentPollingInterval,
      maxStoredIds
    });
    
    this.paymentPollingIntervals.set(subscriptionId, intervalId);
    
    return subscriptionId;
  }
  
  /**
   * Unsubscribe from payment updates
   * @param {string} subscriptionId - The subscription ID to unsubscribe
   * @returns {boolean} - True if unsubscribed successfully, false otherwise
   */
  unsubscribeFromPayments(subscriptionId) {
    if (!this.paymentSubscriptions.has(subscriptionId)) {
      return false;
    }
    
    // Clear the polling interval
    const intervalId = this.paymentPollingIntervals.get(subscriptionId);
    if (intervalId) {
      clearInterval(intervalId);
      this.paymentPollingIntervals.delete(subscriptionId);
    }
    
    // Remove the subscription
    this.paymentSubscriptions.delete(subscriptionId);
    
    return true;
  }
  /**
   * 
   * @param {string} invoice 
   * @returns {Object}
   */
  decodeRGBLNInvoice(invoice){
    return decodeRGBLNInvoice(invoice);
  }
}
