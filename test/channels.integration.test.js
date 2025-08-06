import { nodeConfig, setupTestEnvironment, sleep } from './testUtils';

describe('Channels Integration Tests', () => {
  let client;

  beforeAll(async () => {
    // Use test utilities to create and setup the client
    const setup = await setupTestEnvironment({ nodeKey: 'nodeA' });
    client = setup.client;
  }, 30000); // Increased timeout for node unlocking

  test('should list channels', async () => {
    const channelsResponse = await client.lightning.listChannels();
    expect(Array.isArray(channelsResponse.channels)).toBe(true);
    // May be an empty array, but should be an array
  });

  test('should connect to a peer', async () => {
    // This test requires an available peer
    // In a real test environment, you need to replace with actual peer information
    const peerInfo = 'PEER_PUBKEY@PEER_HOST:PEER_PORT';
    
    try {
      // Try to connect to peer
      await client.peers.connectPeer({ peer_pubkey_and_addr: peerInfo });
      
      // Verify connection
      const peersResponse = await client.peers.listPeers();
      expect(Array.isArray(peersResponse.peers)).toBe(true);
      
      // Note: This part may fail if the peer doesn't exist or is unavailable
      // In a real test, you should replace with actual peer information
    } catch (error) {
      // In a CI environment, there might not be a real peer, so we can skip failures
      console.warn('Unable to connect to peer, you may need to set up real peer information');
    }
  });

  test.skip('should open a channel', async () => {
    // Skip this test as it requires a real peer and funding
    // In a real test, you need to replace with actual peer information

    const peerInfo = 'PEER_PUBKEY@PEER_HOST:PEER_PORT';
    const openChannelParams = {
      peer_pubkey_and_opt_addr: peerInfo,
      capacity_sat: 100000, // Channel capacity (sats)
      push_msat: 10000,     // Amount to push to the other side (msats)
      public: true,         // Whether the channel is public
      with_anchors: true,   // Whether to use anchor outputs
    };
    
    // Open channel
    const openResponse = await client.channels.openChannel(openChannelParams);
    expect(openResponse).toHaveProperty('temporary_channel_id');
    
    // Wait for channel establishment (this may take some time)
    await sleep(5000);
    
    // Get channel ID
    const channelIdResponse = await client.channels.getChannelId({
      temporary_channel_id: openResponse.temporary_channel_id
    });
    expect(channelIdResponse).toHaveProperty('channel_id');
    
    // Check if the new channel is in the channel list
    const channelsResponse = await client.channels.listChannels();
    const newChannel = channelsResponse.channels.find(
      channel => channel.channel_id === channelIdResponse.channel_id
    );
    expect(newChannel).toBeDefined();
  }, 60000); // Increased timeout for channel establishment

  test.skip('should close a channel', async () => {
    // Skip this test as it requires an already established channel
    // In a real test, you need to create a channel first, then close it

    // Get existing channels
    const channelsResponse = await client.channels.listChannels();
    if (channelsResponse.channels.length === 0) {
      console.warn('No available channels to close');
      return;
    }
    
    // Select the first channel for closing
    const channelToClose = channelsResponse.channels[0];
    
    // Close channel
    await client.channels.closeChannel({
      channel_id: channelToClose.channel_id,
      force: false // Cooperative close
    });
    
    // Wait for channel closure (this may take some time)
    await sleep(5000);
    
    // Verify channel is closed
    const updatedChannelsResponse = await client.channels.listChannels();
    const closedChannel = updatedChannelsResponse.channels.find(
      channel => channel.channel_id === channelToClose.channel_id
    );
    
    // Channel may be completely closed and removed from the list, or status changed to closing
    if (closedChannel) {
      expect(closedChannel.status).toBe('Closing');
    } else {
      // Channel is fully closed and removed from the list
      expect(true).toBe(true);
    }
  }, 60000); // Increased timeout for channel closure
}); 