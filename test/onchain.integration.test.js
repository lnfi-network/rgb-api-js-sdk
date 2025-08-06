import { nodeConfig, setupTestEnvironment, sleep, waitForConfirmation, getTestAddress } from './testUtils';

describe('On-chain Integration Tests', () => {
  let client;

  beforeAll(async () => {
    // Use test utilities to create and setup client
    const setup = await setupTestEnvironment({ 
      nodeKey: 'nodeA'
    });
    client = setup.client;
  }, 30000); // Increased timeout for node unlocking

  test('should get a Bitcoin address', async () => {
    const addressResponse = await client.onchain.getAddress();
    
    expect(addressResponse).toBeDefined();
    expect(addressResponse.address).toBeDefined();
    expect(typeof addressResponse.address).toBe('string');
    // Bitcoin addresses have specific formats, we could add more validation here
    expect(addressResponse.address.length).toBeGreaterThan(10);
  });

  test('should get BTC balance', async () => {
    const balanceResponse = await client.onchain.getBtcBalance({ skip_sync: false });
    
    expect(balanceResponse).toBeDefined();
    expect(balanceResponse.vanilla).toBeDefined();
    expect(balanceResponse.colored).toBeDefined();
    
    // Both vanilla and colored balances should have these properties
    expect(balanceResponse.vanilla).toHaveProperty('settled');
    expect(balanceResponse.vanilla).toHaveProperty('future');
    expect(balanceResponse.vanilla).toHaveProperty('spendable');
    
    expect(balanceResponse.colored).toHaveProperty('settled');
    expect(balanceResponse.colored).toHaveProperty('future');
    expect(balanceResponse.colored).toHaveProperty('spendable');
  });

  test('should list unspent outputs', async () => {
    const unspentsResponse = await client.onchain.listUnspents({ skip_sync: false });
    
    expect(unspentsResponse).toBeDefined();
    expect(Array.isArray(unspentsResponse.unspents)).toBe(true);
    
    // If there are unspents, check their structure
    if (unspentsResponse.unspents.length > 0) {
      const firstUnspent = unspentsResponse.unspents[0];
      expect(firstUnspent).toHaveProperty('utxo');
      expect(firstUnspent.utxo).toHaveProperty('outpoint');
      expect(firstUnspent.utxo).toHaveProperty('btc_amount');
    }
  });

  test('should get fee estimation', async () => {
    const feeEstimation = await client.onchain.estimateFee({ blocks: 6 });
    
    expect(feeEstimation).toBeDefined();
    expect(feeEstimation).toHaveProperty('fee_rate');
    expect(typeof feeEstimation.fee_rate).toBe('number');
    // Fee rate should be positive
    expect(feeEstimation.fee_rate).toBeGreaterThan(0);
  });

  test('should list transactions', async () => {
    const transactionsResponse = await client.onchain.listTransactions({ skip_sync: false });
    
    expect(transactionsResponse).toBeDefined();
    expect(Array.isArray(transactionsResponse.transactions)).toBe(true);
    
    // If there are transactions, check their structure
    if (transactionsResponse.transactions.length > 0) {
      const firstTx = transactionsResponse.transactions[0];
      expect(firstTx).toHaveProperty('txid');
      expect(firstTx).toHaveProperty('transaction_type');
    }
  });

  test.skip('should send BTC', async () => {
    // Skip this test as it requires real funds
    // In a real test environment, ensure the wallet has sufficient funds
    
    const testAddress = getTestAddress(); // Use the utility function to get a test address
    const amountToSend = 10000; // 10,000 satoshis
    
    const sendResponse = await client.onchain.sendBtc({
      address: testAddress,
      amount: amountToSend,
      fee_rate: 1, // low fee rate for testing
      skip_sync: false
    });
    
    expect(sendResponse).toBeDefined();
    expect(sendResponse).toHaveProperty('txid');
    
    // Wait for transaction confirmation
    await waitForConfirmation(client, sendResponse.txid);
    
    // Verify transaction in the list
    const txListResponse = await client.onchain.listTransactions({ skip_sync: false });
    const sentTx = txListResponse.transactions.find(tx => tx.txid === sendResponse.txid);
    
    expect(sentTx).toBeDefined();
    expect(sentTx.sent).toBeGreaterThanOrEqual(amountToSend);
  }, 90000); // Increased timeout for transaction confirmation
}); 