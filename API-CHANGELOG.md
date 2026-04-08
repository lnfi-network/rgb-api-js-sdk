# RGB API v1.1.7 Changelog

## Overview

Comparison between old version (`openapiold.yaml`) and new version (`openapi.yaml`).

---

## 1. New Endpoints (10)

| Path | Method | Description |
|------|--------|-------------|
| `/sendrgb` | POST | Replaces `/sendasset`. Supports `recipient_map` for batch multi-asset multi-recipient sending |
| `/issueassetifa` | POST | Issue IFA (Inflationary Fungible Asset) |
| `/inflate` | POST | Inflate (mint additional supply) for IFA assets on-chain |
| `/nodestate` | GET | Get node state (None/Locked/Running/Changing) |
| `/revoketoken` | POST | Revoke an authentication token |
| `/assetidfromhexbytes` | POST | Convert hex bytes to RGB asset ID (baid64 format) |
| `/assetidtohexbytes` | POST | Convert RGB asset ID (baid64) to hex bytes |
| `/webhook/list` | GET | List all webhook subscriptions |
| `/webhook/subscribe` | POST | Subscribe to webhook event notifications |
| `/webhook/unsubscribe` | POST | Unsubscribe from webhook by subscription_id |

## 2. Removed Endpoints (1)

| Path | Description |
|------|-------------|
| `/sendasset` | Replaced by `/sendrgb` |

## 3. Request Parameter Changes

### `/lninvoice` - HODL Invoice Support

| Change | Old | New |
|--------|-----|-----|
| New field | - | `payment_hash` (string, for HODL invoices, mutually exclusive with preimage) |
| New field | - | `preimage` (string, custom payment preimage, mutually exclusive with payment_hash) |
| New field | - | `memo` (string, invoice description) |
| Type change | `amt_msat`: integer | `amt_msat`: integer \| null |
| Type change | `asset_id`: string | `asset_id`: string \| null |
| Type change | `asset_amount`: integer | `asset_amount`: integer \| null |

### `/openchannel` - Push Asset Amount

| Change | Old | New |
|--------|-----|-----|
| New field | - | `push_asset_amount` (integer, required for RGB channels) |
| Type change | `asset_amount`: integer | `asset_amount`: integer \| null |
| Type change | `asset_id`: string | `asset_id`: string \| null |
| Type change | `fee_base_msat`: integer | `fee_base_msat`: integer \| null |
| Type change | `fee_proportional_millionths`: integer | `fee_proportional_millionths`: integer \| null |
| Type change | `temporary_channel_id`: string | `temporary_channel_id`: string \| null |

### `/rgbinvoice` - Expiration & Witness

| Change | Old | New |
|--------|-----|-----|
| Removed field | `duration_seconds` (integer) | - |
| New field | - | `expiration_timestamp` (integer \| null, Unix timestamp) |
| New field | - | `witness` (boolean, **required**) |
| New field | - | `assignment` (Assignment \| null) |
| Type change | `asset_id`: string | `asset_id`: string \| null |

### `/sendpayment` - Asset Payment Support

**Request:**

| Change | Old | New |
|--------|-----|-----|
| New field | - | `amt_msat` (integer \| null) |
| New field | - | `asset_id` (string \| null) |
| New field | - | `asset_amount` (integer \| null) |

**Response (SendPaymentResponse):**

| Change | Old | New |
|--------|-----|-----|
| New field | - | `payment_id` (string, **required**) |
| Type change | `payment_hash`: string | `payment_hash`: string \| null |
| Type change | `payment_secret`: string | `payment_secret`: string \| null |

### `/checkproxyendpoint` - Field Rename

| Change | Old | New |
|--------|-----|-----|
| Renamed | `proxy_url` | `proxy_endpoint` |

### `/init` - Optional Mnemonic

| Change | Old | New |
|--------|-----|-----|
| New field | - | `mnemonic` (string \| null) |

### `/createutxos` - Type Changes

| Change | Old | New |
|--------|-----|-----|
| Type change | `num`: integer | `num`: integer \| null |
| Type change | `size`: integer | `size`: integer \| null |
| Type change | `fee_rate`: number | `fee_rate`: integer |

### `/sendbtc` - Type Change

| Change | Old | New |
|--------|-----|-----|
| Type change | `fee_rate`: number | `fee_rate`: integer |

### `/makerinit` - Type Changes

| Change | Old | New |
|--------|-----|-----|
| Type change | `from_asset`: string | `from_asset`: string \| null |
| Type change | `to_asset`: string | `to_asset`: string \| null |

### `/keysend` - Type Changes

| Change | Old | New |
|--------|-----|-----|
| Type change | `asset_id`: string | `asset_id`: string \| null |
| Type change | `asset_amount`: integer | `asset_amount`: integer \| null |

### `/unlock` - Required Fields Added

| Change | Old | New |
|--------|-----|-----|
| Now required | - | `password`, `bitcoind_rpc_username`, `bitcoind_rpc_password`, `bitcoind_rpc_host`, `bitcoind_rpc_port`, `announce_addresses` |
| Type change | `indexer_url`: string | `indexer_url`: string \| null |
| Type change | `proxy_endpoint`: string | `proxy_endpoint`: string \| null |
| Type change | `announce_alias`: string | `announce_alias`: string \| null |

## 4. Response / Schema Changes

### `AssetMetadataResponse`

| Change | Old | New |
|--------|-----|-----|
| Renamed | `issued_supply` (integer) | `initial_supply` (integer) |
| New field | - | `max_supply` (integer, **required**) |
| New field | - | `known_circulating_supply` (integer, **required**) |
| Type change | `ticker`: string | `ticker`: string \| null |
| Type change | `details`: string | `details`: string \| null |
| Type change | `token`: Token | `token`: Token \| null |

### `Payment`

| Change | Old | New |
|--------|-----|-----|
| New field | - | `preimage` (string) |
| Type change | `amt_msat`: integer | `amt_msat`: integer \| null |
| Type change | `asset_amount`: integer | `asset_amount`: integer \| null |
| Type change | `asset_id`: string | `asset_id`: string \| null |

### `Peer`

| Change | Old | New |
|--------|-----|-----|
| New field | - | `address` (string) |

### `ListAssetsResponse`

| Change | Old | New |
|--------|-----|-----|
| New field | - | `ifa` (array \| null, AssetIFA list) |
| Type change | `nia`: array | `nia`: array \| null |
| Type change | `uda`: array | `uda`: array \| null |
| Type change | `cfa`: array | `cfa`: array \| null |

### `DecodeRGBInvoiceResponse`

| Change | Old | New |
|--------|-----|-----|
| New field | - | `recipient_type` (RecipientType: Blind/Witness, **required**) |
| Type change | `asset_schema`: AssetSchema | `asset_schema`: AssetSchema \| null |
| Type change | `asset_id`: string | `asset_id`: string \| null |
| Type change | `expiration_timestamp`: integer | `expiration_timestamp`: integer \| null |

### `DecodeLNInvoiceResponse`

| Change | Old | New |
|--------|-----|-----|
| Type change | `amt_msat`: integer | `amt_msat`: integer \| null |
| Type change | `asset_id`: string | `asset_id`: string \| null |
| Type change | `asset_amount`: integer | `asset_amount`: integer \| null |
| Type change | `payee_pubkey`: string | `payee_pubkey`: string \| null |

### `Channel`

| Change | Old | New |
|--------|-----|-----|
| Type change | `funding_txid`: string | `funding_txid`: string \| null |
| Type change | `peer_alias`: string | `peer_alias`: string \| null |
| Type change | `short_channel_id`: integer | `short_channel_id`: integer \| null |
| Type change | `asset_id`: string | `asset_id`: string \| null |
| Type change | `asset_local_amount`: integer | `asset_local_amount`: integer \| null |
| Type change | `asset_remote_amount`: integer | `asset_remote_amount`: integer \| null |

### `Transfer`

| Change | Old | New |
|--------|-----|-----|
| Renamed | `expiration` (integer) | `expiration_timestamp` (integer \| null) |
| Type change | `requested_assignment`: AssignmentFungible | `requested_assignment`: Assignment \| null |
| Type change | `assignments` items: AssignmentFungible | `assignments` items: Assignment |
| Type change | `txid`: string | `txid`: string \| null |
| Type change | `recipient_id`: string | `recipient_id`: string \| null |
| Type change | `receive_utxo`: string | `receive_utxo`: string \| null |
| Type change | `change_utxo`: string | `change_utxo`: string \| null |

### `Media`

| Change | Old | New |
|--------|-----|-----|
| New field | - | `digest` (string, **required**) |

### `Swap`

| Change | Old | New |
|--------|-----|-----|
| Type change | `from_asset`: string | `from_asset`: string \| null |
| Type change | `to_asset`: string | `to_asset`: string \| null |
| Type change | `initiated_at`: integer | `initiated_at`: integer \| null |
| Type change | `completed_at`: integer | `completed_at`: integer \| null |

### `Transaction`

| Change | Old | New |
|--------|-----|-----|
| Type change | `confirmation_time`: BlockTime | `confirmation_time`: BlockTime \| null |

### Enum Changes

| Enum | Change |
|------|--------|
| `AssetSchema` | Added `Ifa` |
| `TransferKind` | Added `Inflation` |
| `TransferStatus` | Added `Initiated` |
| `BitcoinNetwork` | Added `Testnet4` |

### Removed Schemas

| Schema | Description |
|--------|-------------|
| `AssignmentReplaceRight` | Removed from Assignment oneOf |
| `SendAssetRequest` / `SendAssetResponse` | Removed with `/sendasset` endpoint |

## 5. Global Changes

| Item | Old | New |
|------|-----|-----|
| OpenAPI version | 3.0.3 | 3.1.0 |
| Authentication | None | Bearer Token (Biscuit format), globally applied |
| Tags | 8 | 9 (added `Webhooks`) |
| Nullable pattern | Not used | Widespread `type \| null` (OpenAPI 3.1 style) |

## 6. Key Themes

1. **IFA (Inflationary Fungible Asset)** - Full support for issuable + inflatable assets
2. **Batch RGB sending** - `/sendasset` replaced by `/sendrgb` with `recipient_map`
3. **HODL Invoice** - `/lninvoice` now supports `payment_hash` for hold invoices
4. **Webhook system** - Complete event subscription API
5. **Authentication** - Bearer Token (Biscuit) + token revocation
6. **Witness transfers** - `/rgbinvoice` adds witness mode support
7. **Nullable migration** - Almost all optional fields now explicitly `type | null`
