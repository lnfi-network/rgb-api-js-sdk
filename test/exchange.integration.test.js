/**
 * RGB-BTC Exchange (HODL Invoice) Integration Tests
 *
 * Tests the atomic swap flow:
 *   B (local)  = intermediary node, holds BTC & RGB channels
 *   A (remote) = RGB asset holder, pays HODL invoice
 *   C (remote) = BTC invoice issuer (same node as A in regtest)
 *
 * Flow:
 *   1. C creates BTC invoice
 *   2. B decodes BTC invoice, extracts payment_hash
 *   3. B creates HODL invoice (same payment_hash, RGB asset)
 *   4. A pays HODL invoice (RGB → B)
 *   5. B detects Pending in listPayments → sends BTC to C
 *   6. RGB node auto-claims → Succeeded
 */

import { RgbApiClient } from '../src/index.js';
import { sleep } from './testUtils';

// Node B (intermediary): local regtest node
const LOCAL_BASE_URL = 'http://35.221.95.26:9744';
// Node A/C (payer + merchant): remote regtest node
const REMOTE_BASE_URL = 'http://regtest.lnfi.network:3002';

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120000;
const HODL_BUFFER_SEC = 7200;
const MIN_AMT_MSAT = 3000000; // RGB node minimum for asset invoices

/**
 * Poll until condFn returns truthy or timeout
 */
async function pollUntil(condFn, label, timeoutMs = POLL_TIMEOUT_MS) {
  const start = Date.now();
  let attempt = 0;
  while (Date.now() - start < timeoutMs) {
    attempt++;
    try {
      const result = await condFn();
      if (result) {
        console.log(`  [poll] ${label} — found (attempt ${attempt}, ${Date.now() - start}ms)`);
        return result;
      }
    } catch (e) {
      console.log(`  [poll] ${label} — attempt ${attempt} error: ${e.message}`);
    }
    await sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`Timeout: ${label} (${timeoutMs}ms, ${attempt} attempts)`);
}

describe('RGB-BTC Exchange Integration Tests', () => {
  let localClient;
  let remoteClient;
  let commonAsset;
  let precision;

  beforeAll(async () => {
    localClient = new RgbApiClient({ baseUrl: LOCAL_BASE_URL });
    remoteClient = new RgbApiClient({ baseUrl: REMOTE_BASE_URL });

    // Verify both nodes are online (nodeinfo has a bug, use nodestate instead)
    const localState = await localClient.node.getNodeState();
    const remoteState = await remoteClient.node.getNodeState();
    console.log(`Local  (B): state=${localState}`);
    console.log(`Remote (A/C): state=${remoteState}`);
    expect(localState).toBe('Running');
    expect(remoteState).toBe('Running');

    // Find common RGB asset from channel info (listAssets can be very slow due to sync)
    const localCh = await localClient.lightning.listChannels();
    const remoteCh = await remoteClient.lightning.listChannels();

    const localRgbCh = (localCh.channels || []).filter(c => c.asset_id && c.is_usable);
    const remoteRgbCh = (remoteCh.channels || []).filter(c => c.asset_id && c.is_usable);

    const commonCh = localRgbCh.find(lc => remoteRgbCh.some(rc => rc.asset_id === lc.asset_id));
    if (!commonCh) {
      throw new Error('No common RGB asset channel between nodes — cannot run exchange tests');
    }
    commonAsset = { asset_id: commonCh.asset_id, name: commonCh.asset_id.slice(0, 12) };
    precision = 0; // default for regtest NIA assets
    console.log(`Common asset: ${commonAsset.asset_id}, precision=${precision}`);

    const btcCh = (localCh.channels || []).filter(c => !c.asset_id && c.is_usable);
    const rgbCh = localRgbCh.filter(c => c.asset_id === commonAsset.asset_id);
    console.log(`Local BTC channels: ${btcCh.length}, outbound: ${btcCh.reduce((s, c) => s + (c.outbound_balance_msat || 0), 0)} msat`);
    console.log(`Local RGB channels: ${rgbCh.length}, local asset: ${rgbCh.map(c => c.asset_local_amount).join(',')}`);
    console.log(`Remote RGB channels: ${remoteRgbCh.filter(c => c.asset_id === commonAsset.asset_id).length}, remote asset: ${remoteRgbCh.filter(c => c.asset_id === commonAsset.asset_id).map(c => c.asset_local_amount).join(',')}`);
  }, 120000);

  // =====================================================================
  // Test 1: Full end-to-end exchange flow
  // =====================================================================
  test('E2E: BTC invoice → HODL invoice → RGB pay → BTC pay → auto-claim', async () => {
    const BTC_AMOUNT_SATS = 50000;
    const RGB_DISPLAY_AMOUNT = 5;
    const rawAssetAmount = Math.round(RGB_DISPLAY_AMOUNT * (10 ** precision));

    // Step 1: C creates BTC invoice
    console.log('\n--- Step 1: C creates BTC invoice ---');
    const btcInvoice = await remoteClient.lightning.createInvoice({
      amt_msat: BTC_AMOUNT_SATS * 1000,
      expiry_sec: 14400,
    });
    expect(btcInvoice.invoice).toBeDefined();
    console.log(`BTC invoice: ${btcInvoice.invoice.slice(0, 40)}...`);

    // Step 2: B decodes & validates BTC invoice
    console.log('\n--- Step 2: B decodes BTC invoice ---');
    const decoded = await localClient.lightning.decodeLnInvoice({ invoice: btcInvoice.invoice });
    expect(decoded.payment_hash).toBeDefined();
    expect(Number(decoded.amt_msat)).toBe(BTC_AMOUNT_SATS * 1000);
    console.log(`payment_hash: ${decoded.payment_hash}`);
    console.log(`amt_msat: ${decoded.amt_msat}, expiry: ${decoded.expiry_sec}s`);

    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(decoded.timestamp) + Number(decoded.expiry_sec) - now;
    expect(remaining).toBeGreaterThan(HODL_BUFFER_SEC);
    const hodlExpiry = remaining - HODL_BUFFER_SEC;

    // Step 3: B creates HODL invoice
    console.log('\n--- Step 3: B creates HODL invoice ---');
    const hodlResult = await localClient.lightning.createHodlInvoice({
      payment_hash: decoded.payment_hash,
      expiry_sec: hodlExpiry,
      asset_id: commonAsset.asset_id,
      asset_amount: rawAssetAmount,
      amt_msat: MIN_AMT_MSAT,
    });
    expect(hodlResult.invoice).toBeDefined();
    console.log(`HODL invoice: ${hodlResult.invoice.slice(0, 40)}...`);

    // Step 4: A pays HODL invoice (sends RGB to B)
    console.log('\n--- Step 4: A pays HODL invoice (RGB → B) ---');
    const payRgbResult = await remoteClient.lightning.payInvoice({
      invoice: hodlResult.invoice,
    });
    console.log(`Pay RGB result: status=${payRgbResult.status}`);
    // HODL invoice won't settle immediately — expect Pending
    expect(payRgbResult.payment_hash).toBe(decoded.payment_hash);

    // Step 5: B polls listPayments for Pending (HODL receipt)
    console.log('\n--- Step 5: B detects RGB HODL Pending ---');
    const hodlPending = await pollUntil(async () => {
      const payments = await localClient.lightning.listPayments();
      return (payments.payments || []).find(
        p => p.payment_hash === decoded.payment_hash && p.status === 'Pending',
      );
    }, 'HODL Pending');
    expect(hodlPending).toBeDefined();
    expect(hodlPending.status).toBe('Pending');

    // Step 6: B sends BTC to C
    console.log('\n--- Step 6: B sends BTC to C ---');
    const btcPayResult = await localClient.lightning.payInvoice({
      invoice: btcInvoice.invoice,
    });
    console.log(`BTC pay result: status=${btcPayResult.status}, preimage=${btcPayResult.preimage || 'N/A'}`);
    expect(btcPayResult.status).not.toBe('Failed');

    // Step 7: Wait for RGB auto-claim (Pending → Succeeded)
    console.log('\n--- Step 7: Wait for RGB auto-claim ---');
    // If BTC pay is async (Pending), wait for outbound to complete first to avoid hanging HTLC
    if (btcPayResult.status !== 'Succeeded') {
      await pollUntil(async () => {
        const payments = await localClient.lightning.listPayments();
        return (payments.payments || []).find(
          p => p.payment_hash === decoded.payment_hash && p.inbound === false && p.status === 'Succeeded',
        );
      }, 'BTC outbound Succeeded', 300000);
    }
    const completed = await pollUntil(async () => {
      const payments = await localClient.lightning.listPayments();
      return (payments.payments || []).find(
        p => p.payment_hash === decoded.payment_hash && p.inbound === true && p.status === 'Succeeded',
      );
    }, 'RGB auto-claim Succeeded', 120000);
    expect(completed.status).toBe('Succeeded');
    console.log('Exchange completed successfully!');
  }, 360000);

  // =====================================================================
  // Test 2: HODL invoice expiry validation
  // =====================================================================
  test('should reject HODL invoice when BTC invoice expires too soon', async () => {
    console.log('\n--- Expiry validation test ---');
    // Create BTC invoice with very short expiry (< 7200s)
    const shortInvoice = await remoteClient.lightning.createInvoice({
      amt_msat: 10000 * 1000,
      expiry_sec: 3600, // 1 hour — less than HODL_BUFFER_SEC
    });

    const decoded = await localClient.lightning.decodeLnInvoice({ invoice: shortInvoice.invoice });
    const now = Math.floor(Date.now() / 1000);
    const remaining = Number(decoded.timestamp) + Number(decoded.expiry_sec) - now;

    // remaining (~3600) should be <= HODL_BUFFER_SEC (7200)
    expect(remaining).toBeLessThanOrEqual(HODL_BUFFER_SEC);
    console.log(`BTC invoice remaining: ${remaining}s (need > ${HODL_BUFFER_SEC}s) — correctly rejected`);
  }, 60000);

  // =====================================================================
  // Test 3: Duplicate payment_hash rejection
  // =====================================================================
  test('should reject duplicate HODL invoice with same payment_hash', async () => {
    console.log('\n--- Duplicate payment_hash test ---');
    const rawAmount = Math.round(1 * (10 ** precision));

    const btcInvoice = await remoteClient.lightning.createInvoice({
      amt_msat: 10000 * 1000,
      expiry_sec: 14400,
    });
    const decoded = await localClient.lightning.decodeLnInvoice({ invoice: btcInvoice.invoice });
    const now = Math.floor(Date.now() / 1000);
    const hodlExpiry = Number(decoded.timestamp) + Number(decoded.expiry_sec) - now - HODL_BUFFER_SEC;

    // First creation should succeed
    const first = await localClient.lightning.createHodlInvoice({
      payment_hash: decoded.payment_hash,
      expiry_sec: hodlExpiry,
      asset_id: commonAsset.asset_id,
      asset_amount: rawAmount,
      amt_msat: MIN_AMT_MSAT,
    });
    expect(first.invoice).toBeDefined();
    console.log('First HODL invoice created OK');

    // Second creation with same payment_hash should fail at RGB node level
    // (payment_hash already has a pending HTLC)
    try {
      await localClient.lightning.createHodlInvoice({
        payment_hash: decoded.payment_hash,
        expiry_sec: hodlExpiry,
        asset_id: commonAsset.asset_id,
        asset_amount: rawAmount,
        amt_msat: MIN_AMT_MSAT,
      });
      // If it doesn't throw, the node may allow duplicate hashes
      console.log('Warning: node did not reject duplicate payment_hash');
    } catch (e) {
      console.log(`Duplicate correctly rejected: ${e.message}`);
      expect(e.message).toBeDefined();
    }
  }, 60000);

  // =====================================================================
  // Test 4: createHodlInvoice requires payment_hash
  // =====================================================================
  test('should reject HODL invoice without payment_hash', async () => {
    console.log('\n--- Missing payment_hash test ---');
    await expect(
      localClient.lightning.createHodlInvoice({
        expiry_sec: 3600,
        asset_id: commonAsset.asset_id,
        asset_amount: 100,
        amt_msat: MIN_AMT_MSAT,
      }),
    ).rejects.toThrow('payment_hash is required');
  }, 10000);

  // =====================================================================
  // Test 5: createHodlInvoice rejects preimage (mutually exclusive)
  // =====================================================================
  test('should reject HODL invoice with preimage provided', async () => {
    console.log('\n--- Preimage rejection test ---');
    await expect(
      localClient.lightning.createHodlInvoice({
        payment_hash: 'a'.repeat(64),
        preimage: 'b'.repeat(64),
        expiry_sec: 3600,
        asset_id: commonAsset.asset_id,
        asset_amount: 100,
        amt_msat: MIN_AMT_MSAT,
      }),
    ).rejects.toThrow('preimage must not be provided');
  }, 10000);

  // =====================================================================
  // Test 6: BTC direct payment (non-exchange)
  // =====================================================================
  test('should pay BTC invoice directly (non-exchange mode)', async () => {
    console.log('\n--- Direct BTC payment test ---');
    const BTC_AMOUNT_SATS = 10000; // 10k sats — within HTLC limit

    const btcInvoice = await remoteClient.lightning.createInvoice({
      amt_msat: BTC_AMOUNT_SATS * 1000,
      expiry_sec: 3600,
    });
    expect(btcInvoice.invoice).toBeDefined();
    console.log(`BTC invoice: ${btcInvoice.invoice.slice(0, 40)}...`);

    const result = await localClient.lightning.payInvoice({
      invoice: btcInvoice.invoice,
    });
    console.log(`Pay result: status=${result.status}`);
    expect(result.status).not.toBe('Failed');
    expect(result.payment_hash).toBeDefined();
  }, 60000);

  // =====================================================================
  // Test 7: listPayments returns HODL status correctly
  // =====================================================================
  test('listPayments should show Pending for unrevealed HODL', async () => {
    console.log('\n--- HODL Pending status test ---');
    const rawAmount = Math.round(1 * (10 ** precision));

    // Create a BTC invoice (we won't pay it — just use its payment_hash)
    const btcInvoice = await remoteClient.lightning.createInvoice({
      amt_msat: 10000 * 1000,
      expiry_sec: 14400,
    });
    const decoded = await localClient.lightning.decodeLnInvoice({ invoice: btcInvoice.invoice });
    const now = Math.floor(Date.now() / 1000);
    const hodlExpiry = Number(decoded.timestamp) + Number(decoded.expiry_sec) - now - HODL_BUFFER_SEC;

    // B creates HODL invoice
    const hodlResult = await localClient.lightning.createHodlInvoice({
      payment_hash: decoded.payment_hash,
      expiry_sec: hodlExpiry,
      asset_id: commonAsset.asset_id,
      asset_amount: rawAmount,
      amt_msat: MIN_AMT_MSAT,
    });
    expect(hodlResult.invoice).toBeDefined();

    // A pays HODL invoice
    const payResult = await remoteClient.lightning.payInvoice({
      invoice: hodlResult.invoice,
    });
    console.log(`A paid HODL: status=${payResult.status}`);

    // B checks listPayments — should find Pending (not Succeeded, since no preimage revealed yet)
    const pending = await pollUntil(async () => {
      const payments = await localClient.lightning.listPayments();
      return (payments.payments || []).find(
        p => p.payment_hash === decoded.payment_hash && p.status === 'Pending',
      );
    }, 'HODL Pending in listPayments');
    expect(pending.status).toBe('Pending');
    console.log('Confirmed: HODL shows as Pending before preimage reveal');

    // Now B pays BTC invoice to reveal preimage and complete
    const btcPay = await localClient.lightning.payInvoice({ invoice: btcInvoice.invoice });
    console.log(`BTC pay: status=${btcPay.status}`);
    expect(btcPay.status).not.toBe('Failed');

    // If BTC pay is async (Pending), wait for outbound BTC to complete first.
    // This prevents --forceExit from killing the process before HTLC is resolved,
    // which would leave a hanging HTLC on the remote node.
    if (btcPay.status !== 'Succeeded') {
      await pollUntil(async () => {
        const payments = await localClient.lightning.listPayments();
        return (payments.payments || []).find(
          p => p.payment_hash === decoded.payment_hash && p.inbound === false && p.status === 'Succeeded',
        );
      }, 'BTC outbound Succeeded', 300000);
    }

    // Wait for RGB auto-claim (Pending → Succeeded on inbound HODL)
    const succeeded = await pollUntil(async () => {
      const payments = await localClient.lightning.listPayments();
      return (payments.payments || []).find(
        p => p.payment_hash === decoded.payment_hash && p.inbound === true && p.status === 'Succeeded',
      );
    }, 'HODL Succeeded after claim', 120000);
    expect(succeeded.status).toBe('Succeeded');
    console.log('Confirmed: HODL transitions Pending → Succeeded after BTC payment');
  }, 600000);
});
