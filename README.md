# RGB API JavaScript SDK

A JavaScript/TypeScript SDK for interacting with RGB Lightning Node APIs. This SDK provides a simple and intuitive interface for managing RGB assets, lightning network operations, and on-chain transactions.

## Features

- **Modular Architecture**: Organized into logical modules (node, onchain, RGB, lightning, swaps)
- **Full TypeScript Support**: Complete type definitions for all APIs
- **Promise-based**: Modern async/await API
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Flexible Configuration**: Support for custom headers, base URLs, and axios configurations

## Installation

```bash
npm install @lnfi-network/rgb-api-js-sdk
```

or

```bash
yarn add @lnfi-network/rgb-api-js-sdk
```

## Quick Start

```javascript
import { RgbApiClient } from '@lnfi-network/rgb-api-js-sdk';

// Initialize the client
const client = new RgbApiClient({
  baseUrl: 'http://localhost:3001'
});

// Check node status
const nodeInfo = await client.node.getNodeInfo();
console.log('Node Info:', nodeInfo);

// List RGB assets
const assets = await client.rgb.listAssets();
console.log('Assets:', assets);
```

## Configuration

### Basic Configuration

```javascript
const client = new RgbApiClient({
  baseUrl: 'http://localhost:3001'
});
```

### Advanced Configuration

```javascript
const client = new RgbApiClient({
  baseUrl: 'https://your-rgb-node.com',
  headers: {
    'Authorization': 'Bearer your-api-key',
    'Custom-Header': 'value'
  },
  axiosConfig: {
    timeout: 10000,
    proxy: false
  }
});
```

## API Modules

### Node Operations

```javascript
// Get node information
const nodeInfo = await client.node.getNodeInfo();

// Check node state (0: NON_EXISTING, 1: LOCKED, 4: SERVER_ACTIVE)
const state = await client.node.getNodeState();

// Get network information
const networkInfo = await client.node.getNetworkInfo();

// Validate indexer URL
await client.node.checkIndexerUrl({ 
  indexer_url: 'electrs:50001' 
});

// Sign a message
const signature = await client.node.signMessage({ 
  message: 'Hello RGB' 
});
```

### RGB Asset Operations

```javascript
// List all assets
const assets = await client.rgb.listAssets();

// Get asset balance
const balance = await client.rgb.getAssetBalance({
  asset_id: 'rgb1qyfe883hey6jrgj2xvk5g3dfmfqfzm7a4wez4pd2krf7ltsxffd6u6nqcg'
});

// Get asset metadata
const metadata = await client.rgb.getAssetMetadata({
  asset_id: 'rgb1qyfe883hey6jrgj2xvk5g3dfmfqfzm7a4wez4pd2krf7ltsxffd6u6nqcg'
});

// Send assets
await client.rgb.sendAssets({
  recipient_map: {
    'asset_id': [{
      recipient: 'recipient_address',
      amount: 1000
    }]
  }
});
```

### Lightning Network Operations

```javascript
// List channels
const channels = await client.lightning.listChannels();

// Create invoice
const invoice = await client.lightning.createInvoice({
  amount_msat: 10000,
  description: 'Payment for services'
});

// Decode RGB Lightning invoice
const decoded = await client.lightning.decodeRGBLNInvoice(
  'lnbcrt30u1p5f9szd...'
);

// Pay invoice
await client.lightning.payInvoice({
  invoice: 'lnbcrt30u1p5f9szd...'
});
```

### On-chain Operations

```javascript
// Get new address
const address = await client.onchain.getAddress();

// List transactions
const transactions = await client.onchain.listTransactions();

// Send Bitcoin
await client.onchain.sendBtc({
  address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  amount: 100000 // satoshis
});
```

### Swap Operations

```javascript
// List swaps
const swaps = await client.swaps.listSwaps();

// Create swap
await client.swaps.createSwap({
  // swap parameters
});
```

## TypeScript Support

The SDK includes comprehensive TypeScript definitions:

```typescript
import { RgbApiClient, NodeState, AssetSchema } from '@lnfi-network/rgb-api-js-sdk';

const client = new RgbApiClient({ 
  baseUrl: 'http://localhost:3001' 
});

// Type-safe operations
const state: number = await client.node.getNodeState();
if (state === 4) { // SERVER_ACTIVE
  console.log('Node is active and ready');
}

// Filter assets by schema
const assets = await client.rgb.listAssets({
  filter_asset_schemas: [AssetSchema.NIA, AssetSchema.CFA]
});
```

## Error Handling

The SDK provides structured error handling:

```javascript
try {
  const nodeInfo = await client.node.getNodeInfo();
} catch (error) {
  if (error.message.includes('Network Error')) {
    console.error('Unable to connect to RGB node');
  } else if (error.message.includes('API Error')) {
    console.error('API returned an error:', error.message);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test test/rgb.integration.test.js
```

### Development Mode

```bash
npm run dev
```

## Examples

Check the `examples/` directory for complete usage examples:

- [Node.js Example](./examples/nodejs/index.js)

## API Reference

For detailed API documentation, refer to:
- Type definitions: [`src/types.d.ts`](./src/types.d.ts)
- Module implementations: [`src/modules/`](./src/modules/)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
