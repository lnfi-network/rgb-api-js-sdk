# RGB API SDK

This is a JavaScript/TypeScript SDK for interacting with the RGB Lightning Node API.

## Architecture Overview

The SDK follows a modular design with the following main structure:

- `src/index.js`: The entry point of the SDK, exporting `RgbApiClient`.
- `src/client.js`: Contains the core `RgbApiClient` class, responsible for handling API requests and responses.
- `src/modules/`: Contains sub-modules organized by functionality (e.g., `node.js`, `onchain.js`, `rgb.js`, `lightning.js`, `swaps.js`), with each module exposing a set of related API methods.
- `src/types.d.ts`: Provides comprehensive TypeScript type definitions for use in TypeScript projects.

## Installation

You can install this SDK using npm or yarn:

```bash
npm install your-package-name # Replace with your package name
# or
yarn add your-package-name # Replace with your package name
```

## Usage

First, import and instantiate `RgbApiClient`:

```javascript
import { RgbApiClient } from 'your-package-name'; // Replace with your package name

const client = new RgbApiClient({
  baseUrl: 'http://localhost:3001', // Modify according to your node address
  // If an API key is required, you can add headers here
  // headers: { 'Authorization': 'Bearer your_api_key' }
});
```

Then, you can access methods of various modules through the client instance:

### Node Methods (NodeMethods)

```javascript
async function getNodeStatus() {
  try {
    const nodeInfo = await client.node.getNodeInfo();
    console.log('Node Info:', nodeInfo);

    const nodeState = await client.node.getNodeState();
    console.log('Node State:', nodeState); // 0: NON_EXISTING, 1: LOCKED, 4: SERVER_ACTIVE

    const networkInfo = await client.node.getNetworkInfo();
    console.log('Network Info:', networkInfo);
    
    // ... Other node methods
    await client.node.checkIndexerUrl({ indexer_url: 'electrs:50001' });
    console.log('Indexer URL check successful.');

    await client.node.checkProxyEndpoint({ proxy_endpoint: 'rpc://34.84.66.29:5000/json-rpc' });
     console.log('Proxy endpoint check successful.');

    const signedMessage = await client.node.signMessage({ message: 'Hello RGB' });
    console.log('Signed Message:', signedMessage);
    
    // Note: Calling lockNode will lock the node and affect subsequent calls
    // await client.node.lockNode();
    // console.log('Node locked.');

  } catch (error) {
    console.error('Error interacting with node:', error);
  }
}

getNodeStatus();
```

### Other Modules

You can similarly access methods of other modules:

```javascript
// On-chain Methods
// await client.onchain.getAddress();

// RGB Methods
// await client.rgb.listAssets();

// Lightning Methods
// await client.lightning.listChannels();

// Swaps Methods
// await client.swaps.listSwaps();
```

(Please refer to the files in the `src/modules/` directory and `src/types.d.ts` for detailed information and parameters of available methods in each module.)

## TypeScript Support

The SDK provides comprehensive TypeScript type definitions (`types.d.ts`), allowing you to benefit from type checking and auto-completion in your TypeScript projects.

```typescript
import { RgbApiClient } from 'your-package-name'; // Replace with your package name
import { NodeState } from 'your-package-name/types'; // Import types, adjust path as needed

const client = new RgbApiClient({ baseUrl: 'http://localhost:3001' });

async function checkState() {
  const state: NodeState = await client.node.getNodeState();
  if (state === NodeState.SERVER_ACTIVE) {
    console.log('Node is active.');
  }
}

checkState();
```

## Development and Testing

(Add instructions on how to build, run unit tests, and integration tests here)

---
example:
npm test test/onchain.test.js

Please further refine this README file based on your actual package name and specific API endpoints, request/response structures.
