import { setupTestEnvironment, sleep, issueTestAsset, createTestUtxos } from './testUtils';

describe('Lightning Integration Tests', () => {
  let client;
  const testPeerPubkey = '0225a2cd4419f0530b56930b47d32a42084c4e2fb496dfbf8769ebd488fd7a0e94';
  const testPeerAddr = '0225a2cd4419f0530b56930b47d32a42084c4e2fb496dfbf8769ebd488fd7a0e94@rgb2:9735';

  beforeAll(async () => {
    // Use test utilities to create and setup the client
    const setup = await setupTestEnvironment({ nodeKey: 'nodeA' });
    client = setup.client;
  }, 30000); // Increased timeout for node unlocking

  test.skip('should list channels', async () => {
    const channelsResponse = await client.lightning.listChannels();
    expect(channelsResponse).toBeDefined();
    expect(Array.isArray(channelsResponse.channels)).toBe(true);
    // May be an empty array, but should be an array
  });

  test.skip('should list peers', async () => {
    const peersResponse = await client.lightning.listPeers();
    expect(peersResponse).toBeDefined();
    expect(Array.isArray(peersResponse.peers)).toBe(true);
    // May be an empty array, but should be an array
  });

  test.skip('should list payments', async () => {
    const paymentsResponse = await client.lightning.listPayments();
    expect(paymentsResponse).toBeDefined();
    expect(Array.isArray(paymentsResponse.payments)).toBe(true);
    // May be an empty array, but should be an array
  });

  test.skip('should get channel ID from temporary ID', async () => {
    // This test requires a temporary_channel_id from an open channel attempt.
    // Replace 'VALID_TEMPORARY_CHANNEL_ID' with a real one if testing manually.
    const temporaryChannelId = 'VALID_TEMPORARY_CHANNEL_ID'; 
    const channelIdResponse = await client.lightning.getChannelId({ temporary_channel_id: temporaryChannelId });
    expect(channelIdResponse).toBeDefined();
    expect(channelIdResponse).toHaveProperty('channel_id');
    expect(typeof channelIdResponse.channel_id).toBe('string');
  });

  test.skip('should get payment by payment hash', async () => {
    // This test requires a payment_hash from an existing payment.
    // Replace 'VALID_PAYMENT_HASH' with a real one if testing manually.
    const paymentHash = 'VALID_PAYMENT_HASH'; 
    const paymentResponse = await client.lightning.getPayment({ payment_hash: paymentHash });
    expect(paymentResponse).toBeDefined();
    expect(paymentResponse).toHaveProperty('payment');
    // Further assertions on the payment structure can be added
  });

  test.skip('should get invoice status', async () => {
    // This test requires an invoice string.
    // Replace 'VALID_INVOICE_STRING' with a real one if testing manually.
    const invoiceString = 'VALID_INVOICE_STRING'; 
    const statusResponse = await client.lightning.invoiceStatus({ invoice: invoiceString });
    expect(statusResponse).toBeDefined();
    expect(statusResponse).toHaveProperty('status');
    expect(typeof statusResponse.status).toBe('string');
  });

  test.skip('should decode LN invoice', async () => {
    // This test requires a valid LN invoice string.
    // Replace 'VALID_LN_INVOICE_STRING' with a real one if testing manually.
    const lnInvoiceString = 'VALID_LN_INVOICE_STRING'; 
    const decodedInvoice = await client.lightning.decodeLNInvoice({ invoice: lnInvoiceString });
    expect(decodedInvoice).toBeDefined();
    expect(decodedInvoice).toHaveProperty('payment_hash');
    // Further assertions on decoded invoice properties can be added
  });

  // --- Methods that modify state ---

  test.skip('should connect to a peer', async () => {
    console.log(`Attempting to connect to peer: ${testPeerAddr}`);
    await client.lightning.connectPeer({ peer_pubkey_and_addr: testPeerAddr });
    console.log('Connect peer request sent.');

    // Optional: Add a small delay and then list peers to verify connection
    // await sleep(2000); // Need to import sleep from testUtils
    // const peersResponse = await client.lightning.listPeers();
    // const connectedPeer = peersResponse.peers.find(peer => peer.pubkey === testPeerPubkey);
    // expect(connectedPeer).toBeDefined();

  }, 30000); // Increased timeout for peer connection

  test.skip('should disconnect from a peer', async () => {
    console.log(`Attempting to disconnect from peer: ${testPeerPubkey}`);
    await client.lightning.disconnectPeer({ peer_pubkey: testPeerPubkey });
    console.log('Disconnect peer request sent.');

    // Optional: Add a small delay and then list peers to verify disconnection
    // await sleep(2000); // Need to import sleep from testUtils
    // const peersResponse = await client.lightning.listPeers();
    // const disconnectedPeer = peersResponse.peers.find(peer => peer.pubkey === testPeerPubkey);
    // expect(disconnectedPeer).toBeUndefined();
  });

  test.skip('should open a channel', async () => {
    console.log(`Attempting to open channel with peer: ${testPeerAddr}`);
    const openChannelParams = {
      peer_pubkey_and_opt_addr: testPeerAddr,
      capacity_sat: 30010, // Example capacity
      push_msat: 1394000, // Example push amount
      public: true,
      with_anchors: true,
      // asset_id and asset_amount are optional for non-RGB channels
    };
    
    const openResponse = await client.lightning.openChannel(openChannelParams);
    console.log('Open channel request sent.', openResponse);

    expect(openResponse).toBeDefined();
    expect(openResponse).toHaveProperty('temporary_channel_id');
    expect(typeof openResponse.temporary_channel_id).toBe('string');

    // Note: Channel opening can take significant time and requires chain confirmation.
    // Verification of channel status would be a subsequent step.

  }, 120000); // Increased timeout for channel opening (2 minutes)

  test.skip('should close a channel', async () => {});
  test.skip('should create LN invoice', async () => {});
  test.skip('should send keysend payment', async () => {});
  test.skip('should send payment by invoice', async () => {});
});

describe('Lightning Asset Channel Integration Tests', () => {
  let client;
  let testAssetId;
  const testPeerPubkey = '0225a2cd4419f0530b56930b47d32a42084c4e2fb496dfbf8769ebd488fd7a0e94';
  const testPeerAddr = '0225a2cd4419f0530b56930b47d32a42084c4e2fb496dfbf8769ebd488fd7a0e94@rgb2:9735';

  // Setup: Unlock node, create UTXOs, and find a test asset
  beforeAll(async () => {
    const setup = await setupTestEnvironment({ 
      nodeKey: 'nodeA',
      createUtxos: false, // Create UTXOs for channel opening
      numUtxos: 2 // Need at least 2 UTXOs for asset channel (colored, change)
    });
    client = setup.client;

    // Find an existing test asset
    console.log('Searching for existing RGB assets...');
    const assetsResponse = await client.rgb.listAssets({
      "filter_asset_schemas":[]
    });
    console.log("🚀 ~ beforeAll ~ assetsResponse:", assetsResponse)
    
    // Prioritize NIA, then UDA, then CFA
    let foundAsset = null;
    if (assetsResponse.nia && assetsResponse.nia.length > 0) {
      foundAsset = assetsResponse.nia[0];
    } else if (assetsResponse.uda && assetsResponse.uda.length > 0) {
      foundAsset = assetsResponse.uda[0];
    } else if (assetsResponse.cfa && assetsResponse.cfa.length > 0) {
      foundAsset = assetsResponse.cfa[0];
    }

    if (foundAsset) {
      testAssetId = foundAsset.asset_id;
      console.log(`Found existing asset ${testAssetId} for asset channel test.`);
    } else {
      console.warn('No existing RGB assets found. Asset channel test will be skipped.');
      // Optionally throw an error or skip the tests in this describe block
    }

  }, 60000); // Increased timeout for setup (unlocking, UTXO creation, listing assets)

  test.skip('should open an asset channel', async () => {
    // Skip test if no asset was found
    if (!testAssetId) {
      console.warn('Skipping asset channel test: No test asset available.');
      return;
    }

    console.log(`Attempting to open asset channel with peer: ${testPeerAddr} for asset ${testAssetId}`);
    const openChannelParams = {
      peer_pubkey_and_opt_addr: testPeerAddr,
      capacity_sat: 30010, // Example capacity
      push_msat: 1394000, // Example push amount
      public: true,
      with_anchors: true,
      asset_id: testAssetId,     // Add asset ID
      asset_amount: 100, // Example amount of asset to commit (adjust based on available balance)
    };
    
    // Note: You need to ensure the node has a spendable balance of the asset
    // you are trying to commit to the channel.

    const openResponse = await client.lightning.openChannel(openChannelParams);
    console.log('Open asset channel request sent.', openResponse);

    expect(openResponse).toBeDefined();
    expect(openResponse).toHaveProperty('temporary_channel_id');
    expect(typeof openResponse.temporary_channel_id).toBe('string');

    // Note: Asset channel opening also takes significant time and chain confirmation.

  }, 18000); // Increased timeout for asset channel opening (3 minutes)

}); 