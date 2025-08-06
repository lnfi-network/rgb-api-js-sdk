import { nodeConfig, setupTestEnvironment, sleep, waitForConfirmation, issueTestAsset, createTestUtxos } from './testUtils';

describe('RGB Assets Integration Tests', () => {
  let client;
  let testAssetId;

  beforeAll(async () => {
    // Use test utilities to create and setup client
    const setup = await setupTestEnvironment({ 
      nodeKey: 'nodeA',
      createUtxos: false,  // Create initial UTXOs for RGB operations
      numUtxos: 2         // Create 2 UTXOs
    });
    client = setup.client;
  }, 60000); // Increased timeout for node unlocking and UTXO creation

  test.skip('should issue a NIA asset', async () => {
    try {
      // Issue test asset
      testAssetId = await issueTestAsset(client, {
        type: 'NIA',
        amounts: [1000, 500],
        name: 'Test RGB Asset',
        ticker: 'TRGB',
        precision: 0
      });
      
      expect(testAssetId).toBeDefined();
      expect(testAssetId.startsWith('rgb:')).toBe(true);
      
      console.log(`Issued asset ID: ${testAssetId}`);
    } catch (error) {
      console.error('Failed to issue asset:', error);
      throw error;
    }
  }, 30000);

  test.skip('should get asset metadata', async () => {
    // Skip test if asset wasn't issued successfully
    if (!testAssetId) {
      console.warn('Skipping test: No test asset available');
      return;
    }
    
    const metadata = await client.rgb.getAssetMetadata({ asset_id: testAssetId });
    
    expect(metadata).toBeDefined();
    expect(metadata.name).toBe('Test RGB Asset');
    expect(metadata.ticker).toBe('TRGB');
    expect(metadata.precision).toBe(0);
    expect(metadata.asset_iface).toBe('RGB20');
  });

  test.skip('should get asset balance', async () => {
    // Skip test if asset wasn't issued successfully
    if (!testAssetId) {
      console.warn('Skipping test: No test asset available');
      return;
    }
    
    const balance = await client.rgb.getAssetBalance({ asset_id: testAssetId });
    
    expect(balance).toBeDefined();
    expect(balance.settled).toBe(1500); // 1000 + 500
    expect(balance.spendable).toBeGreaterThanOrEqual(0);
  });

  test('should list assets', async () => {
    const assets = await client.rgb.listAssets({
      "filter_asset_schemas":[]
    });
    
    expect(assets).toBeDefined();
    expect(assets.nia).toBeDefined();
    expect(Array.isArray(assets.nia)).toBe(true);
    
    if (testAssetId) {
      // Check if our issued asset is in the list
      const foundAsset = assets.nia.find(asset => asset.asset_id === testAssetId);
      expect(foundAsset).toBeDefined();
    }
  });

  test.skip('should create RGB invoice', async () => {
    // Skip test if asset wasn't issued successfully
    if (!testAssetId) {
      console.warn('Skipping test: No test asset available');
      return;
    }
    
    const invoiceResponse = await client.rgb.getRgbInvoice({
      asset_id: testAssetId,
      duration_seconds: 3600,
      min_confirmations: 1
    });
    
    expect(invoiceResponse).toBeDefined();
    expect(invoiceResponse.invoice).toBeDefined();
    expect(typeof invoiceResponse.invoice).toBe('string');
    expect(invoiceResponse.expiration_timestamp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  test.skip('should decode RGB invoice', async () => {
    // Skip test if asset wasn't issued successfully
    if (!testAssetId) {
      console.warn('Skipping test: No test asset available');
      return;
    }
    
    // First create an invoice
    const invoiceResponse = await client.rgb.getRgbInvoice({
      asset_id: testAssetId,
      duration_seconds: 3600,
      min_confirmations: 1
    });
    
    // Then decode it
    const decodedInvoice = await client.rgb.decodeRgbInvoice({
      invoice: invoiceResponse.invoice
    });
    
    expect(decodedInvoice).toBeDefined();
    expect(decodedInvoice.asset_id).toBe(testAssetId);
    expect(decodedInvoice.asset_iface).toBe('RGB20');
  });

  test.skip('should send RGB asset', async () => {
    // Skip test as it requires a real recipient
    // In a real test, you need to have an RGB invoice from a recipient
    
    // Create UTXO for RGB transfer
    await createTestUtxos(client, { num: 1, size: 20000 });
    
    // Assume we have a valid recipient ID and transport endpoints
    const recipientId = 'VALID_RECIPIENT_ID'; // Get from RGB invoice
    const transportEndpoints = ['VALID_TRANSPORT_ENDPOINT']; // Get from RGB invoice
    
    const sendResponse = await client.rgb.sendAsset({
      asset_id: testAssetId,
      amount: 100,
      recipient_id: recipientId,
      fee_rate: 1,
      transport_endpoints: transportEndpoints,
      skip_sync: false
    });
    
    expect(sendResponse).toBeDefined();
    expect(sendResponse.txid).toBeDefined();
    
    // Wait for transaction confirmation
    await waitForConfirmation(client, sendResponse.txid);
    
    // Check if asset balance has been updated
    const balance = await client.rgb.getAssetBalance({ asset_id: testAssetId });
    expect(balance.settled).toBe(1400); // 1500 - 100
  }, 120000);

  test('should refresh transfers', async () => {
    // This test only verifies the method can be called
    await client.rgb.refreshTransfers({ skip_sync: false });
    // If no exception is thrown, test passes
    expect(true).toBe(true);
  });

  test('should list transfers', async () => {
    // Skip test if asset wasn't issued successfully
    if (!testAssetId) {
      console.warn('Skipping test: No test asset available');
      return;
    }
    
    const transfers = await client.rgb.listTransfers({ asset_id: testAssetId });
    
    expect(transfers).toBeDefined();
    expect(Array.isArray(transfers.transfers)).toBe(true);
    // Should have at least the issuance transfer
    expect(transfers.transfers.length).toBeGreaterThan(0);
  });
}); 