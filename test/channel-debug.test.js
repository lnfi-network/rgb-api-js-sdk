/**
 * Channel stuck diagnostic test
 * Run: npx jest test/channel-debug.test.js --verbose --no-cache
 */
import { RgbApiClient } from '../src/index.js';

const LOCAL_NODE = 'http://35.221.95.26:9744';
const REMOTE_NODE = 'http://regtest.lnfi.network:3002';

describe('Channel Debug', () => {
  let localClient;
  let remoteClient;

  beforeAll(async () => {
    localClient = new RgbApiClient({ baseUrl: LOCAL_NODE });
    remoteClient = new RgbApiClient({ baseUrl: REMOTE_NODE });
  });

  test('local node state', async () => {
    const state = await localClient.node.getNodeState();
    console.log('Local node state:', JSON.stringify(state, null, 2));
    expect(state).toBeDefined();
  });

  test('local channels - all details', async () => {
    const res = await localClient.lightning.listChannels();
    console.log(`\nLocal channels count: ${res.channels?.length}`);
    res.channels?.forEach((ch, i) => {
      console.log(`\n--- Channel ${i + 1} ---`);
      console.log('channel_id:', ch.channel_id);
      console.log('status:', ch.status);
      console.log('asset_id:', ch.asset_id);
      console.log('ready:', ch.ready);
      console.log('is_usable:', ch.is_usable);
      console.log('funding_txid:', ch.funding_txid);
      console.log('local_balance_msat:', ch.local_balance_msat);
      console.log('remote_balance_msat:', ch.remote_balance_msat);
      console.log('full:', JSON.stringify(ch, null, 2));
    });
    expect(res.channels).toBeDefined();
  });

  test('remote channels - check if channel visible from remote side', async () => {
    const res = await remoteClient.lightning.listChannels();
    console.log(`\nRemote channels count: ${res.channels?.length}`);
    res.channels?.forEach((ch, i) => {
      console.log(`\n--- Remote Channel ${i + 1} ---`);
      console.log('channel_id:', ch.channel_id);
      console.log('status:', ch.status);
      console.log('asset_id:', ch.asset_id);
      console.log('ready:', ch.ready);
      console.log('funding_txid:', ch.funding_txid);
    });
    expect(res.channels).toBeDefined();
  });

  test('local peers', async () => {
    const res = await localClient.lightning.listPeers();
    console.log('\nLocal peers:', JSON.stringify(res, null, 2));
    expect(res).toBeDefined();
  });

  test('local onchain transactions - check funding tx', async () => {
    const res = await localClient.onchain.listOnchainTransactions({ skip_sync: false });
    console.log(`\nOnchain tx count: ${res.transactions?.length}`);
    res.transactions?.slice(0, 5).forEach((tx, i) => {
      console.log(`\n--- Tx ${i + 1} ---`);
      console.log('txid:', tx.txid);
      console.log('confirmation_time:', tx.confirmation_time);
      console.log('type:', tx.transaction_type || tx.type);
    });
    expect(res.transactions).toBeDefined();
  });
});
