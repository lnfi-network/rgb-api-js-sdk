/**
 * Common test utilities for RGB API SDK integration tests
 */
import { RgbApiClient } from '../src/index.js';

/**
 * Standard node configuration for tests
 */
export const nodeConfig = {
  nodeA: {
    baseUrl: 'http://localhost:3001',
    unlockParams: {
      bitcoind_rpc_username: 'lnfi_user',
      bitcoind_rpc_password: 'lnfi_pass12GA',
      bitcoind_rpc_host: '54.92.19.81',
      bitcoind_rpc_port: 18443,
      indexer_url: 'electrs:50001',
      proxy_endpoint: 'rpc://34.84.66.29:5000/json-rpc',
      password: '12345678',
      announce_addresses: ['0.0.0.0:9735'],
      announce_alias: 'rgb-bob-lightning',
    },
  },
  // Additional node configurations
  nodeB: {
    baseUrl: 'http://localhost:3002',
    unlockParams: {
      // Similar configuration to nodeA, fill as needed
      bitcoind_rpc_username: 'lnfi_user',
      bitcoind_rpc_password: 'lnfi_pass12GA',
      bitcoind_rpc_host: '54.92.19.81',
      bitcoind_rpc_port: 18443,
      indexer_url: 'electrs:50001',
      proxy_endpoint: 'rpc://34.84.66.29:5000/json-rpc',
      password: '12345678',
      announce_addresses: ['0.0.0.0:9735'],
      announce_alias: 'rgb-alice-lightning',
    },
  }
};

/**
 * Create and return a preconfigured client
 * @param {string} nodeKey - The key of the node configuration to use (e.g., 'nodeA')
 * @returns {RgbApiClient} A configured client instance
 */
export function createClient(nodeKey = 'nodeA') {
  if (!nodeConfig[nodeKey]) {
    throw new Error(`Node configuration for ${nodeKey} not found`);
  }
  return new RgbApiClient({ baseUrl: nodeConfig[nodeKey].baseUrl });
}

/**
 * Attempt to unlock a node with appropriate error handling
 * @param {RgbApiClient} client - The client to use
 * @param {Object} unlockParams - The unlock parameters
 * @returns {Promise<void>}
 */
export async function unlockNode(client, unlockParams) {
  try {
    await client.node.unlockNode(unlockParams);
    console.log('Node successfully unlocked.');
  } catch (error) {
    // If already unlocked, consider it a success for the test setup
    if (error.message.includes('Node has already been unlocked')) {
      console.log('Node already unlocked, proceeding with tests.');
    } else {
      // Otherwise, re-throw the error as unlocking failed unexpectedly
      console.error('Failed to unlock node:', error);
      throw error;
    }
  }
}

/**
 * Create UTXOs for testing
 * @param {RgbApiClient} client - The client to use
 * @param {Object} options - Options for UTXO creation
 * @param {number} [options.num=1] - Number of UTXOs to create
 * @param {number} [options.size=10000] - Size of each UTXO in satoshis
 * @param {number} [options.fee_rate=1] - Fee rate in sat/vB
 * @returns {Promise<void>}
 */
export async function createTestUtxos(client, options = {}) {
  const { num = 1, size = 10000, fee_rate = 1 } = options;
  console.log(`Creating ${num} UTXOs of size ${size} satoshis...`);
  
  try {
    await client.onchain.createUtxos({
      num,
      size,
      fee_rate,
      skip_sync: false, // Important to sync after creation
    });
    console.log(`Successfully created ${num} UTXOs.`);
  } catch (error) {
    console.error('Failed to create UTXOs:', error);
    throw error;
  }
}

/**
 * Issue a test asset for use in tests
 * @param {RgbApiClient} client - The client to use
 * @param {Object} options - Options for asset issuance
 * @param {string} [options.type='NIA'] - Asset type (NIA, UDA, CFA)
 * @param {number[]} [options.amounts=[1000]] - Amounts to issue
 * @param {string} [options.name='Test Asset'] - Asset name
 * @param {string} [options.ticker='TST'] - Asset ticker (for NIA and UDA)
 * @param {string} [options.details='Test asset details'] - Asset details (for UDA and CFA)
 * @param {number} [options.precision=0] - Asset precision
 * @returns {Promise<string>} The issued asset ID
 */
export async function issueTestAsset(client, options = {}) {
  const { 
    type = 'NIA', 
    amounts = [1000], 
    name = 'Test Asset', 
    ticker = 'TST',
    details = 'Test asset details', 
    precision = 0 
  } = options;
  
  console.log(`Issuing ${type} asset...`);
  
  try {
    let issueResponse;
    
    if (type === 'NIA') {
      issueResponse = await client.rgb.issueAssetNia({
        amounts,
        name,
        ticker,
        precision,
      });
    } else if (type === 'UDA') {
      issueResponse = await client.rgb.issueAssetUda({
        ticker,
        name,
        details,
        precision,
      });
    } else if (type === 'CFA') {
      issueResponse = await client.rgb.issueAssetCfa({
        amounts,
        name,
        details,
        precision,
      });
    } else {
      throw new Error(`Unsupported asset type: ${type}`);
    }
    
    const assetId = issueResponse.asset.asset_id;
    console.log(`Successfully issued ${type} asset with ID: ${assetId}`);
    return assetId;
  } catch (error) {
    console.error(`Failed to issue ${type} asset:`, error);
    throw error;
  }
}

/**
 * Create an RGB invoice for testing
 * @param {RgbApiClient} client - The client to use
 * @param {Object} options - Options for invoice creation
 * @param {string} options.asset_id - Asset ID
 * @param {number} [options.duration_seconds=3600] - Invoice duration in seconds
 * @param {number} [options.min_confirmations=1] - Minimum confirmations
 * @returns {Promise<string>} The created invoice string
 */
export async function createRgbInvoice(client, options) {
  const { 
    asset_id, 
    duration_seconds = 3600, 
    min_confirmations = 1 
  } = options;
  
  if (!asset_id) {
    throw new Error('Asset ID is required for invoice creation');
  }
  
  console.log(`Creating invoice for asset ${asset_id}...`);
  
  try {
    const invoiceResponse = await client.rgb.getRgbInvoice({
      asset_id,
      duration_seconds,
      min_confirmations,
    });
    
    console.log(`Successfully created invoice: ${invoiceResponse.invoice}`);
    return invoiceResponse.invoice;
  } catch (error) {
    console.error('Failed to create invoice:', error);
    throw error;
  }
}

/**
 * Generate a random test address for sending funds
 * This is a placeholder that returns a hardcoded regtest address.
 * In a real environment, you might want to generate this dynamically
 * or use a known testnet/regtest address from another wallet.
 * @returns {string} A Bitcoin regtest address
 */
export function getTestAddress() {
  return 'bcrt1p53w6m46g0ed08g95h50gz8vselfnkgvw6p4vnc7sx9e7u44dpruq2zn6pq';
}

/**
 * Wait for a specified time
 * @param {number} ms - Time to wait in milliseconds
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for transaction confirmation
 * @param {RgbApiClient} client - API client
 * @param {string} txid - Transaction ID
 * @param {number} confirmations - Required confirmations
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} Returns true if confirmed successfully
 */
export async function waitForConfirmation(client, txid, confirmations = 1, timeout = 60000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const txs = await client.rgb.listTransactions({ skip_sync: false });
      const tx = txs.transactions.find(t => t.txid === txid);
      
      if (tx && tx.confirmation_time && tx.confirmation_time.height > 0) {
        return true;
      }
      
      // Pause before checking again
      await sleep(2000);
    } catch (error) {
      console.error('Error checking transaction confirmation:', error);
      await sleep(2000);
    }
  }
  
  throw new Error(`Timeout waiting for transaction ${txid} confirmation`);
}

/**
 * Create and unlock RGB node client
 * @param {Object} config - Node configuration
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<RgbApiClient>} Unlocked client instance
 */
export async function createAndUnlockClient(config, timeout = 20000) {
  // Initialize client
  const client = new RgbApiClient({ baseUrl: config.baseUrl });
  
  try {
    // Try to unlock the node
    await client.node.unlockNode(config.unlockParams);
    console.log('Node successfully unlocked');
  } catch (error) {
    // If already unlocked, consider it a success
    if (error.message && error.message.includes('Node has already been unlocked')) {
      console.log('Node is already unlocked, continuing with tests');
    } else {
      // Other errors should be thrown
      throw error;
    }
  }
  
  return client;
}

/**
 * Setup a basic test environment with client, node unlock, and optional UTXOs
 * @param {Object} options - Setup options 
 * @param {string} [options.nodeKey='nodeA'] - Node configuration key
 * @param {boolean} [options.createUtxos=false] - Whether to create UTXOs
 * @param {number} [options.numUtxos=1] - Number of UTXOs to create if createUtxos is true
 * @returns {Promise<{client: RgbApiClient}>} The configured client
 */
export async function setupTestEnvironment(options = {}) {
  const { nodeKey = 'nodeA', createUtxos = false, numUtxos = 1 } = options;
  
  // Create client
  const client = createClient(nodeKey);
  // console.log("🚀 ~ setupTestEnvironment ~ client:", client)
  
  // Unlock node
  await unlockNode(client, nodeConfig[nodeKey].unlockParams);
  
  // Create UTXOs if requested
  if (createUtxos) {
    await createTestUtxos(client, { num: numUtxos });
  }
  
  return { client };
} 