/**
 * RGB operations module
 * Contains methods for interacting with RGB assets and functionality
 */

export class RgbMethods {
  /**
   * Create RgbMethods instance
   * @param {Object} client - The RgbApiClient instance
   */
  constructor(client) {
    this.client = client;
    // Instance-specific subscription management
    this.rgbTransactionSubscriptions = new Map();
    this.rgbTransactionPollingIntervals = new Map();
  }

  /**
   * Get the balance for the provided RGB asset
   * @param {Object} data - Request data
   * @param {string} data.asset_id - RGB asset ID
   * @returns {Promise<import('../types').AssetBalanceResponse>} Asset balance response
   */
  async getAssetBalance(data) {
    return this.client._request('post', '/assetbalance', data);
  }

  /**
   * Get the metadata for the provided RGB asset
   * @param {Object} data - Request data
   * @param {string} data.asset_id - RGB asset ID
   * @returns {Promise<import('../types').AssetMetadataResponse>} Asset metadata response
   */
  async getAssetMetadata(data) {
    return this.client._request('post', '/assetmetadata', data);
  }

  /**
   * List all issued assets
   * @param {Object} [data={}] - Request data
   * @param {Array<import('../types').AssetSchema>} [data.filter_asset_schemas] - Optional filter by asset schemas
   * @returns {Promise<import('../types').ListAssetsResponse>} List assets response
   */
  async listAssets(data = {}) {
    const requestData = {
      // Ensure filter_asset_schemas is included, even if empty array
      filter_asset_schemas: data.filter_asset_schemas,
    };
    return this.client._request('post', '/listassets', requestData);
  }

  /**
   * List all RGB transactions (transfers)
   * @param {Object} [data={}] - Request data
   * @param {string} [data.asset_id] - Filter by asset ID (optional)
   * @returns {Promise<import('../types').ListTransfersResponse>} List transfers response
   */
  async listTransactions(data = {}) {
    return this.client._request('post', '/listtransfers', data);
  }

  /**
   * Issue a Collectible Fungible Asset (CFA)
   * @param {Object} data - Request data
   * @param {number[]} data.amounts - Array of amounts to issue
   * @param {string} data.name - Asset name
   * @param {string} data.details - Asset details
   * @param {number} data.precision - Asset precision
   * @param {string} [data.file_digest] - Optional file digest for asset media
   * @returns {Promise<import('../types').IssueAssetCFAResponse>} Issue asset response
   */
  async issueAssetCfa(data) {
    return this.client._request('post', '/issueassetcfa', data);
  }

  /**
   * Issue a Non-Inflatable Asset (NIA)
   * @param {Object} data - Request data
   * @param {number[]} data.amounts - Array of amounts to issue
   * @param {string} data.name - Asset name
   * @param {string} data.ticker - Asset ticker
   * @param {number} data.precision - Asset precision
   * @returns {Promise<import('../types').IssueAssetNIAResponse>} Issue asset response
   */
  async issueAssetNia(data) {
    return this.client._request('post', '/issueassetnia', data);
  }

  /**
   * Issue a Unconstrained Discrete Asset (UDA)
   * @param {Object} data - Request data
   * @param {string} data.ticker - Asset ticker
   * @param {string} data.name - Asset name
   * @param {string} data.details - Asset details
   * @param {number} data.precision - Asset precision
   * @param {string} [data.media_file_digest] - Optional media file digest
   * @param {string[]} [data.attachments_file_digests] - Array of attachment file digests
   * @returns {Promise<import('../types').IssueAssetUDAResponse>} Issue asset response
   */
  async issueAssetUda(data) {
    return this.client._request('post', '/issueassetuda', data);
  }

  /**
   * Send an RGB asset
   * @param {Object} data - Request data
   * @param {string} data.asset_id - RGB asset ID
   * @param {number} data.amount - Amount to send
   * @param {string} data.recipient_id - Recipient ID
   * @param {boolean} [data.donation] - Whether the transfer is a donation
   * @param {number} [data.fee_rate] - Fee rate in sat/vB
   * @param {number} [data.min_confirmations] - Minimum confirmations for the UTXO
   * @param {string[]} [data.transport_endpoints] - Transport endpoints for the recipient
   * @param {boolean} [data.skip_sync] - Skip syncing the wallet
   * @returns {Promise<import('../types').SendAssetResponse>} Send asset response
   */
  async sendAsset(data) {
    return this.client._request('post', '/sendasset', data);
  }

  /**
   * Create an RGB invoice
   * @param {Object} data - Request data
   * @param {string} data.asset_id - RGB asset ID
   * @param {number} [data.duration_seconds] - Invoice duration in seconds
   * @param {number} data.min_confirmations - Minimum confirmations for the UTXO holding the asset
   * @returns {Promise<import('../types').RgbInvoiceResponse>} RGB invoice response
   */
  async createRgbInvoice(data) {
    const requestData = {
      asset_id: data.asset_id,
      duration_seconds: data.duration_seconds,
      min_confirmations: data.min_confirmations,
    };
    return this.client._request('post', '/rgbinvoice', requestData);
  }

  /**
   * Pay an RGB invoice by decoding it and then sending the asset.
   * @param {Object} data - Request data
   * @param {string} data.invoice - RGB invoice string
   * @param {number} [data.amount] - Amount to send (optional)
   * @param {number} [data.fee_rate] - Fee rate in sat/vB for the sendAsset call
   * @param {boolean} [data.donation] - Whether the transfer is a donation
   * @param {boolean} [data.skip_sync] - Skip syncing the wallet for the sendAsset call
   * @param {string[]} [data.transport_endpoints] - Optional transport endpoints for the sendAsset call
   * @returns {Promise<import('../types').SendAssetResponse>} Send asset response (from sendAsset call)
   */
  async payRgbInvoice(data) {
    // 1. Decode the RGB invoice
    const decodedInvoice = await this.decodeRgbInvoice({ invoice: data.invoice });

    // 2. Prepare data for sendAsset
    const sendAssetData = {
      recipient_id: decodedInvoice.recipient_id,
      asset_id: data.asset_id || decodedInvoice.asset_id,
      amount: data.amount || decodedInvoice.amount,
      fee_rate: data.fee_rate, // Pass through from payRgbInvoice call
      skip_sync: data.skip_sync, // Pass through
      donation: data.donation || false,
      min_confirmations: data.min_confirmations || 1,
      // Use provided transport_endpoints or fall back to those from the invoice if available
      transport_endpoints: data.transport_endpoints || decodedInvoice.transport_endpoints || [] 
    };

    // 3. Call sendAsset
    return this.sendAsset(sendAssetData);
  }

  /**
   * Decode an RGB invoice string
   * @param {Object} data - Request data
   * @param {string} data.invoice - RGB invoice string
   * @returns {Promise<import('../types').DecodeRGBInvoiceResponse>} Decode RGB invoice response
   */
  async decodeRgbInvoice(data) {
    return this.client._request('post', '/decodergbinvoice', data);
  }

  /**
   * Set the status for eligible RGB transfers to `TransferStatus::Failed`.
   * @param {Object} data - Request data
   * @param {number} [data.batch_transfer_idx] - Batch transfer index (optional)
   * @param {boolean} [data.no_asset_only] - Fail only transfers with no asset (optional)
   * @param {boolean} [data.skip_sync] - Skip syncing (optional)
   * @returns {Promise<import('../types').FailTransfersResponse>} Fail transfers response
   */
  async failTransfers(data) {
    return this.client._request('post', '/failtransfers', data);
  }

  /**
   * Get the hex string of the media bytes of the provided media digest
   * @param {Object} data - Request data
   * @param {string} data.digest - Media digest
   * @returns {Promise<import('../types').GetAssetMediaResponse>} Get asset media response
   */
  async getAssetMedia(data) {
    return this.client._request('post', '/getassetmedia', data);
  }

  /**
   * Refresh transfers on the RGB wallet
   * @param {Object} [data={}] - Request data
   * @param {boolean} [data.skip_sync] - Skip syncing the wallet
   * @returns {Promise<import('../types').FailTransfersResponse>} Refresh transfers response
   */
  async refreshTransfers(data = {}) {
    const requestData = {
      skip_sync: data.skip_sync,
    };
    return this.client._request('post', '/refreshtransfers', requestData);
  }

  /**
   * Sync the RGB wallet with the Bitcoin blockchain and STORM transfers.
   * @returns {Promise<import('../types').EmptyResponse>} Sync response
   */
  async syncRgbWallet() {
    return this.client._request('post', '/sync', {});
  }

  /**
   * Post the media file for the provided digest.
   * Requires the file to be a File object (e.g., from an <input type="file"> or constructed manually).
   * @param {Object} data - Request data
   * @param {File} data.file - The media file to upload.
   * @returns {Promise<import('../types').PostAssetMediaResponse>} Post asset media response
   */
  async postAssetMedia(data) {
    const formData = new FormData();
    formData.append('file', data.file);
    // Note: Axios should automatically set Content-Type to multipart/form-data
    // when provided with a FormData object.
    return this.client._request('post', '/postassetmedia', formData);
  }

  /**
   * Subscribe to RGB transactions
   * @param {Object} options - Subscription options
   * @param {Function} options.onTransaction - Callback function for new transactions
   * @param {Function} [options.onError] - Callback function for errors
   * @param {number} [options.pollingInterval=5000] - Polling interval in milliseconds
   * @param {number} [options.maxStoredIds=1000] - Maximum number of transaction IDs to store in memory
   * @param {boolean} [options.skipInitialFetch=false] - Skip fetching existing transactions on startup
   * @returns {string} - Subscription ID
   */
  subscribeToRgbTransactions(options) {
    const { 
      onTransaction, 
      onError, 
      pollingInterval = 5000, 
      maxStoredIds = 1000,
      skipInitialFetch = false
    } = options;
    
    if (!onTransaction || typeof onTransaction !== 'function') {
      throw new Error('onTransaction callback is required and must be a function');
    }
    
    // Validate polling interval to prevent excessive API calls
    if (pollingInterval < 1000) {
      console.warn('Warning: Polling interval less than 1000ms may cause performance issues');
    }
    
    // Generate a unique subscription ID
    const subscriptionId = `rgb-tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store last known transaction IDs and timestamp
    let lastTimestamp = Date.now();
    const knownTransactionIds = new Set();
    const transactionTimestamps = new Map(); // For tracking age of IDs
    
    // Function to convert any timestamp format to a number
    const normalizeTimestamp = (timestamp) => {
      if (typeof timestamp === 'string') {
        return new Date(timestamp).getTime();
      }
      return timestamp || 0;
    };
    
    // Function to limit the size of stored IDs
    const limitStoredIds = () => {
      if (knownTransactionIds.size <= maxStoredIds) return;
      
      // Sort by timestamp (oldest first)
      const sortedIds = [...transactionTimestamps.entries()]
        .sort((a, b) => a[1] - b[1])
        .map(entry => entry[0]);
      
      // Remove oldest entries to get back to the limit
      const idsToRemove = sortedIds.slice(0, knownTransactionIds.size - maxStoredIds);
      idsToRemove.forEach(id => {
        knownTransactionIds.delete(id);
        transactionTimestamps.delete(id);
      });
    };
    
    // Initial load to get existing transactions (if not skipped)
    if (!skipInitialFetch) {
      this.listTransactions()
        .then(response => {
          if (response && response.transfers && Array.isArray(response.transfers)) {
            // Store known transaction IDs with timestamps
            response.transfers.forEach(tx => {
              knownTransactionIds.add(tx.idx);
              transactionTimestamps.set(tx.idx, normalizeTimestamp(tx.created_at));
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
        const response = await this.listTransactions();
        
        if (response && response.transfers && Array.isArray(response.transfers)) {
          // Check for new transactions
          const newTransactions = response.transfers.filter(tx => {
            // Check if this is a new transaction we haven't seen before
            if (!knownTransactionIds.has(tx.idx)) {
              knownTransactionIds.add(tx.idx);
              transactionTimestamps.set(tx.idx, normalizeTimestamp(tx.created_at));
              return true;
            }
            
            // Or if it's a known transaction but its timestamp is newer
            const txTimestamp = normalizeTimestamp(tx.created_at);
            const isUpdated = knownTransactionIds.has(tx.idx) && 
                   txTimestamp > (transactionTimestamps.get(tx.idx) || 0);
                   
            if (isUpdated) {
              // Update the timestamp
              transactionTimestamps.set(tx.idx, txTimestamp);
              return true;
            }
            
            return false;
          });
          
          // Update last timestamp
          if (response.transfers.length > 0) {
            const latestTimestamp = Math.max(
              ...response.transfers.map(tx => normalizeTimestamp(tx.created_at))
            );
            lastTimestamp = Math.max(lastTimestamp, latestTimestamp);
          }
          
          // Limit stored IDs if needed
          limitStoredIds();
          
          // Notify for each new transaction
          if (newTransactions.length > 0) {
            newTransactions.forEach(tx => {
              onTransaction(tx);
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
                this.rgbTransactionPollingIntervals.set(subscriptionId, newIntervalId);
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
    this.rgbTransactionSubscriptions.set(subscriptionId, {
      onTransaction,
      onError,
      pollingInterval,
      currentPollingInterval,
      maxStoredIds
    });
    
    this.rgbTransactionPollingIntervals.set(subscriptionId, intervalId);
    
    return subscriptionId;
  }
  
  /**
   * Unsubscribe from RGB transaction updates
   * @param {string} subscriptionId - The subscription ID to unsubscribe
   * @returns {boolean} - True if unsubscribed successfully, false otherwise
   */
  unsubscribeFromRgbTransactions(subscriptionId) {
    if (!this.rgbTransactionSubscriptions.has(subscriptionId)) {
      return false;
    }
    
    // Clear the polling interval
    const intervalId = this.rgbTransactionPollingIntervals.get(subscriptionId);
    if (intervalId) {
      clearInterval(intervalId);
      this.rgbTransactionPollingIntervals.delete(subscriptionId);
    }
    
    // Remove the subscription
    this.rgbTransactionSubscriptions.delete(subscriptionId);
    
    return true;
  }
}
