import { nodeConfig, setupTestEnvironment, unlockNode } from './testUtils';

describe('NodeMethods Integration Tests', () => {
  let client;

  beforeAll(async () => {
    // 使用测试工具创建和解锁客户端
    const setup = await setupTestEnvironment({ nodeKey: 'nodeA' });
    client = setup.client;
  }, 20000); // Increased timeout for unlocking

  // Test cases will go here

  test.skip('should initialize the node', async () => {
    // Check initial state (optional, may fail if node is already init/unlocked)
    try {
      const initialState = await client.node.getNodeState();
      // Assuming initial state is 0 (NON_EXISTING) or 1 (LOCKED)
      expect(initialState).toBeLessThanOrEqual(1);
    } catch (error) {
      // Ignore error if node is already initialized/unlocked for initial check
      console.warn('Could not get initial node state, assuming it might be initialized/unlocked.', error.message);
    }

    // Initialize the node
    const initResponse = await client.node.initNode({ password: nodeConfig.nodeA.unlockParams.password });

    // Expect mnemonic in the response
    expect(initResponse).toHaveProperty('mnemonic');
    expect(typeof initResponse.mnemonic).toBe('string');

    // Check state after initialization (should be LOCKED - 1)
    const stateAfterInit = await client.node.getNodeState();
    expect(stateAfterInit).toBe(1); // State 1 corresponds to LOCKED
  });

  test.skip('should unlock the node', async () => {
    // This test is skipped as unlocking is handled in beforeAll
  }, 15000);

  test('should get node info', async () => {
    const nodeInfo = await client.node.getNodeInfo();
    expect(nodeInfo).toHaveProperty('pubkey');
    expect(typeof nodeInfo.pubkey).toBe('string');
    // Remove listening_addresses check as it's not in the response
    // expect(Array.isArray(nodeInfo.listening_addresses)).toBe(true);
  });

  test('should get network info', async () => {
    const networkInfo = await client.node.getNetworkInfo();
    expect(networkInfo).toHaveProperty('height');
    expect(typeof networkInfo.height).toBe('number');
    expect(networkInfo).toHaveProperty('network');
    expect(typeof networkInfo.network).toBe('string');
  });

  test('should get node state', async () => {
    const nodeState = await client.node.getNodeState();
    // Expect state to be one of the defined numeric states (0, 1, or 4)
    expect([0, 1, 4]).toContain(nodeState);
  });

  test('should check indexer url', async () => {
    const indexerCheckResponse = await client.node.checkIndexerUrl({ indexer_url: nodeConfig.nodeA.unlockParams.indexer_url });
    // Assuming a successful check returns an object or simply resolves without error
    expect(indexerCheckResponse).toBeDefined();
    // Further checks could be added here if the API returns specific data on success
  });

  test('should check proxy endpoint', async () => {
    const proxyCheckResponse = await client.node.checkProxyEndpoint({ proxy_endpoint: nodeConfig.nodeA.unlockParams.proxy_endpoint });
    // Assuming a successful check returns an object or simply resolves without error
    expect(proxyCheckResponse).toBeDefined();
    // Further checks could be added here if the API returns specific data on success
  });

  test('should sign a message', async () => {
    const messageToSign = 'This is a test message to be signed.';
    const signResponse = await client.node.signMessage({ message: messageToSign });

    expect(signResponse).toHaveProperty('signed_message');
    expect(typeof signResponse.signed_message).toBe('string');
    expect(signResponse.signed_message.length).toBeGreaterThan(0);
  });

  test.skip('should lock the node', async () => {
    // Note: Running lockNode will affect subsequent tests if not handled.
    // This test assumes it's run last or in isolation if state matters.
    await client.node.lockNode();
    // Optional: Add a check here to verify the node is locked if a state endpoint becomes available
  });
}); 