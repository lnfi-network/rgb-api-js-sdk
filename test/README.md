# RGB API SDK Test Guide

This directory contains the test suite for the RGB API SDK, used to verify integration and functionality with the RGB Lightning Node.

## Test Structure

The tests are organized into several main categories:

1. **Node Tests** (`node.integration.test.js`) - Test basic node functions such as initialization, unlocking, message signing, etc.
2. **Channel Tests** (`channels.integration.test.js`) - Test Lightning Network channel-related functionality.
3. **RGB Asset Tests** (`rgb.integration.test.js`) - Test RGB asset operations like issuance, balance queries, and transfers.

There is also a common utilities file `testUtils.js` that provides various helper functions and configurations used in the tests.

## Prerequisites

To run these tests, you need:

1. A running RGB Lightning Node instance, which can be obtained through:
   - Using a Docker image (recommended)
   - Building from source

2. The node should have sufficient Bitcoin balance (testnet or regtest)

3. For some tests, you need two nodes that can connect to each other

## Configuration

The tests use configuration information in `testUtils.js`. The default configuration assumes nodes are running at:

- Node A: `http://localhost:3001`
- Node B: `http://localhost:3002` (optional, for dual-node tests)

You may need to adjust the following configurations according to your environment:

- RPC credentials
- Bitcoin node information
- Indexer URL
- Proxy endpoint

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# Run node tests
npm test -- test/node.integration.test.js

# Run channel tests
npm test -- test/channels.integration.test.js

# Run RGB asset tests
npm test -- test/rgb.integration.test.js
```

### Run Specific Test

```bash
# Run a single test (e.g., 'should get node info')
npm test -- -t "should get node info"
```

## Skipped Tests

Some tests are skipped by default (using `test.skip`) because they:

1. Require specific environment setup
2. Need real external nodes or funding
3. May modify node state affecting other tests

To run these tests, change `test.skip` to `test` and ensure the required conditions are met.

## Troubleshooting

1. **Connection Issues**: Ensure the RGB Lightning Node is running and accessible from the test environment.

2. **Unlock Failure**: If the node is not initialized, run the `initNode` endpoint first.

3. **Insufficient Funds**: Some tests require sufficient Bitcoin balance. Use a faucet to fund your testnet wallet.

4. **Timeout Errors**: Some operations (like opening channels or on-chain transactions) may take longer. You can increase the test timeout settings.

## Adding New Tests

When adding new tests, follow the existing pattern:

1. Use `setupTestEnvironment` to create and configure clients
2. Use `test.skip` for tests that require specific setup or may affect other tests
3. Add clear assertions and error handling
4. Consider timeout settings (especially for on-chain operations)

## Contributing

Pull requests to improve the test suite are welcome! Please ensure:

1. Follow the existing code style
2. Add tests for new features
3. All tests pass (or are explicitly marked as skipped)
4. Update this documentation to reflect any significant changes 