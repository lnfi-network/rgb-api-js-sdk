/**
 * TypeScript type definitions for RGB API SDK
 * This file provides type hints for better IDE support
 * Generated from OpenAPI specification (v1.1.7)
 */

// ===== Basic Configuration =====
export interface RgbApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  axiosConfig?: any;
}

// ===== Basic Types and Enums =====
export type BitcoinNetwork = "Mainnet" | "Testnet" | "Testnet4" | "Signet" | "Regtest";
export type AssetIface = "RGB20" | "RGB21" | "RGB25";
export type AssetSchema = "Nia" | "Uda" | "Cfa" | "Ifa";
export type ChannelStatus = "Opening" | "Opened" | "Closing";
export type HTLCStatus = "Pending" | "Succeeded" | "Failed";
export type InvoiceStatus = "Pending" | "Succeeded" | "Failed" | "Expired";
export type IndexerProtocol = "Electrum" | "Esplora";
export type NodeState = "None" | "Locked" | "Running" | "Changing";
export type RecipientType = "Blind" | "Witness";
export type SwapStatus =
  | "Waiting"
  | "Pending"
  | "Succeeded"
  | "Expired"
  | "Failed";
export type TransactionType = "RgbSend" | "Drain" | "CreateUtxos" | "User";
export type TransferStatus =
  | "Initiated"
  | "WaitingCounterparty"
  | "WaitingConfirmations"
  | "Settled"
  | "Failed";
export type TransferKind =
  | "Issuance"
  | "Inflation"
  | "ReceiveBlind"
  | "ReceiveWitness"
  | "Send";
export type TransportType = "JsonRpc";

export type Assignment =
  | { type: "Fungible"; value: number }
  | { type: "NonFungible"; value: unknown }
  | { type: string; value: unknown };

// ===== Request Interfaces =====
export interface AssetBalanceRequest {
  asset_id: string;
}

export interface AssetMetadataRequest {
  asset_id: string;
}

export interface AssetIdFromHexBytesRequest {
  hex_bytes: string;
}

export interface AssetIdToHexBytesRequest {
  asset_id: string;
}

export interface BackupRequest {
  backup_path: string;
  password: string;
}

export interface BtcBalanceRequest {
  skip_sync?: boolean;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface CheckIndexerUrlRequest {
  indexer_url: string;
}

export interface CheckProxyEndpointRequest {
  proxy_endpoint: string;
}

export interface CloseChannelRequest {
  channel_id: string;
  peer_pubkey: string;
  force?: boolean;
}

export interface ConnectPeerRequest {
  peer_pubkey_and_addr: string;
}

export interface CreateUtxosRequest {
  up_to?: boolean;
  num?: number | null;
  size?: number | null;
  fee_rate?: number;
  skip_sync?: boolean;
}

export interface DecodeLNInvoiceRequest {
  invoice: string;
}

export interface DecodeRGBInvoiceRequest {
  invoice: string;
}

export interface DisconnectPeerRequest {
  peer_pubkey: string;
}

export interface EstimateFeeRequest {
  blocks: number;
}

export interface FailTransfersRequest {
  batch_transfer_idx?: number;
  no_asset_only?: boolean;
  skip_sync?: boolean;
}

export interface GetAssetMediaRequest {
  digest: string;
}

export interface GetChannelIdRequest {
  temporary_channel_id: string;
}

export interface GetPaymentRequest {
  payment_hash: string;
}

export interface GetSwapRequest {
  payment_hash: string;
  taker: boolean;
}

export interface InflateRequest {
  asset_id: string;
  inflation_amounts: number[];
  fee_rate: number;
  min_confirmations: number;
}

export interface InitRequest {
  password: string;
  mnemonic?: string | null;
}

export interface InvoiceStatusRequest {
  invoice: string;
}

export interface IssueAssetCFARequest {
  amounts: number[];
  name: string;
  details: string;
  precision: number;
  file_digest?: string;
}

export interface IssueAssetIFARequest {
  amounts: number[];
  inflation_amounts?: number[];
  ticker: string;
  name: string;
  precision: number;
  reject_list_url?: string | null;
}

export interface IssueAssetNIARequest {
  amounts: number[];
  ticker: string;
  name: string;
  precision: number;
}

export interface IssueAssetUDARequest {
  ticker: string;
  name: string;
  details: string;
  precision: number;
  media_file_digest?: string;
  attachments_file_digests?: string[];
}

export interface KeysendRequest {
  dest_pubkey: string;
  amt_msat: number;
  asset_id?: string | null;
  asset_amount?: number | null;
}

export interface ListAssetsRequest {
  filter_asset_schemas?: AssetSchema[];
}

export interface ListTransactionsRequest {
  skip_sync?: boolean;
}

export interface ListTransfersRequest {
  asset_id?: string;
}

export interface ListUnspentsRequest {
  skip_sync?: boolean;
}

export interface LNInvoiceRequest {
  amt_msat?: number | null;
  expiry_sec?: number;
  asset_id?: string | null;
  asset_amount?: number | null;
  payment_hash?: string;
  preimage?: string;
  memo?: string;
}

export interface LNHodlInvoiceRequest {
  payment_hash: string;
  expiry_sec: number;
  asset_id?: string;
  asset_amount?: number;
  amt_msat?: number;
  memo?: string;
}

export interface MakerExecuteRequest {
  swapstring: string;
  payment_secret: string;
  taker_pubkey: string;
}

export interface MakerInitRequest {
  qty_from: number;
  qty_to: number;
  from_asset?: string | null;
  to_asset?: string | null;
  timeout_sec: number;
}

export interface OpenChannelRequest {
  peer_pubkey_and_opt_addr: string;
  capacity_sat: number;
  push_msat?: number;
  push_asset_amount?: number;
  asset_amount?: number | null;
  asset_id?: string | null;
  public?: boolean;
  with_anchors?: boolean;
  fee_base_msat?: number | null;
  fee_proportional_millionths?: number | null;
  temporary_channel_id?: string | null;
}

export interface PostAssetMediaRequest {
  file: File;
}

export interface RefreshRequest {
  skip_sync?: boolean;
}

export interface RestoreRequest {
  backup_path: string;
  password: string;
}

export interface RevokeTokenRequest {
  token: string;
}

export interface RgbInvoiceRequest {
  min_confirmations: number;
  asset_id?: string | null;
  expiration_timestamp?: number | null;
  witness?: boolean;
  assignment?: Assignment | null;
}

export interface Recipient {
  recipient_id: string;
  assignment: Assignment;
  transport_endpoints: string[];
  witness_data?: WitnessData | null;
}

export interface WitnessData {
  amount_sat: number;
  blinding?: number | null;
}

/** Flat convenience format (single recipient) or raw recipient_map format */
export interface SendAssetRequest {
  /** Flat: RGB asset ID (rgb: format) */
  asset_id?: string;
  /** Flat: amount to send */
  amount?: number;
  /** Flat: recipient ID */
  recipient_id?: string;
  /** Flat: transport endpoints */
  transport_endpoints?: string[];
  /** Raw: pre-built recipient_map keyed by asset_id */
  recipient_map?: Record<string, Recipient[]>;
  expiration_timestamp?: number | null;
  donation?: boolean;
  fee_rate?: number;
  min_confirmations?: number;
  skip_sync?: boolean;
}

export interface SendBtcRequest {
  amount: number;
  address: string;
  fee_rate?: number;
  skip_sync?: boolean;
}

export interface SendOnionMessageRequest {
  node_ids: string[];
  tlv_type: number;
  data: string;
}

export interface SendPaymentRequest {
  invoice: string;
  amt_msat?: number | null;
  asset_id?: string | null;
  asset_amount?: number | null;
}

export interface SignMessageRequest {
  message: string;
}

export interface TakerRequest {
  swapstring: string;
}

export interface UnlockRequest {
  password: string;
  bitcoind_rpc_username: string;
  bitcoind_rpc_password: string;
  bitcoind_rpc_host: string;
  bitcoind_rpc_port: number;
  announce_addresses: string[];
  indexer_url?: string | null;
  proxy_endpoint?: string | null;
  announce_alias?: string | null;
}

export interface WebhookSubscribeRequest {
  url: string;
  events: string[];
  secret?: string;
}

export interface WebhookUnsubscribeRequest {
  subscription_id: string;
}

// ===== Response Interfaces =====
export interface AddressResponse {
  address: string;
}

export interface AssetBalanceResponse {
  settled: number;
  future: number;
  spendable: number;
  offchain_outbound: number;
  offchain_inbound: number;
}

export interface BlockTime {
  height: number;
  timestamp: number;
}

export interface BtcBalance {
  settled: number;
  future: number;
  spendable: number;
}

export interface BtcBalanceResponse {
  vanilla: BtcBalance;
  colored: BtcBalance;
}

export interface CheckIndexerUrlResponse {
  indexer_protocol: IndexerProtocol;
}

export interface DecodeLNInvoiceResponse {
  amt_msat: number | null;
  expiry_sec: number;
  timestamp: number;
  asset_id?: string | null;
  asset_amount?: number | null;
  payment_hash: string;
  payment_secret: string;
  payee_pubkey: string | null;
  network: BitcoinNetwork;
}

export interface DecodeRGBInvoiceResponse {
  recipient_id: string;
  asset_iface: AssetIface;
  asset_schema?: AssetSchema | null;
  asset_id: string | null;
  amount: number;
  network: BitcoinNetwork;
  expiration_timestamp?: number | null;
  transport_endpoints: string[];
  recipient_type: RecipientType;
}

export interface EmptyResponse {}

export interface EstimateFeeResponse {
  fee_rate: number;
}

export interface FailTransfersResponse {
  transfers_changed: boolean;
}

export interface GetAssetMediaResponse {
  bytes_hex: string;
}

export interface AssetIdFromHexBytesResponse {
  asset_id: string;
}

export interface AssetIdToHexBytesResponse {
  hex_bytes: string;
}

export interface GetChannelIdResponse {
  channel_id: string;
}

export interface InflateResponse {
  txid: string;
}

export interface InitResponse {
  mnemonic: string;
}

export interface InvoiceStatusResponse {
  status: InvoiceStatus;
}

export interface KeysendResponse {
  payment_hash: string;
  payment_preimage: string;
  status: HTLCStatus;
}

export interface LNInvoiceResponse {
  invoice: string;
}

export interface MakerInitResponse {
  payment_hash: string;
  payment_secret: string;
  swapstring: string;
}

export interface NetworkInfoResponse {
  network: BitcoinNetwork;
  height: number;
}

export interface NodeInfoResponse {
  pubkey: string;
  num_channels: number;
  num_usable_channels: number;
  local_balance_sat: number;
  eventual_close_fees_sat: number;
  pending_outbound_payments_sat: number;
  num_peers: number;
  onchain_pubkey: string;
  max_media_upload_size_mb: number;
  rgb_htlc_min_msat: number;
  rgb_channel_capacity_min_sat: number;
  channel_capacity_min_sat: number;
  channel_capacity_max_sat: number;
  channel_asset_min_amount: number;
  channel_asset_max_amount: number;
  network_nodes: number;
  network_channels: number;
}

export interface NodeStateResponse {
  state: NodeState;
}

export interface OpenChannelResponse {
  temporary_channel_id: string;
}

export interface PostAssetMediaResponse {
  digest: string;
}

export interface RgbInvoiceResponse {
  recipient_id: string;
  invoice: string;
  expiration_timestamp: number | null;
  batch_transfer_idx: number;
}

export interface SendAssetResponse {
  txid: string;
}

export interface SendBtcResponse {
  txid: string;
}

export interface SendPaymentResponse {
  payment_id: string;
  payment_hash: string | null;
  payment_secret: string | null;
  status: HTLCStatus;
}

export interface SignMessageResponse {
  signed_message: string;
}

export interface WebhookSubscription {
  subscription_id: string;
  url: string;
  events: string[];
}

export interface WebhookListResponse {
  subscriptions: WebhookSubscription[];
}

export interface WebhookSubscribeResponse {
  subscription_id: string;
}

// ===== Complex Object Interfaces =====
export interface Media {
  file_path: string;
  mime: string;
  digest: string;
}

export interface EmbeddedMedia {
  mime: string;
  data: number[];
}

export interface ProofOfReserves {
  utxo: string;
  proof: number[];
}

export interface Token {
  index: number;
  ticker?: string | null;
  name?: string | null;
  details?: string | null;
  embedded_media?: EmbeddedMedia | null;
  media?: Media | null;
  attachments?: { [key: string]: Media };
  reserves?: ProofOfReserves | null;
}

export interface TokenLight {
  index: number;
  ticker?: string | null;
  name?: string | null;
  details?: string | null;
  embedded_media?: boolean;
  media?: Media | null;
  attachments?: { [key: string]: Media };
  reserves?: boolean;
}

export interface AssetMetadataResponse {
  asset_iface: AssetIface;
  asset_schema: AssetSchema;
  initial_supply: number;
  max_supply: number;
  known_circulating_supply: number;
  timestamp: number;
  name: string;
  precision: number;
  ticker?: string | null;
  details?: string | null;
  token?: Token | null;
}

export interface AssetNIA {
  asset_id: string;
  asset_iface: AssetIface;
  ticker: string;
  name: string;
  details?: string;
  precision: number;
  issued_supply: number;
  timestamp: number;
  added_at: number;
  balance: AssetBalanceResponse;
  media?: Media;
}

export interface AssetUDA {
  asset_id: string;
  asset_iface: AssetIface;
  ticker?: string;
  name: string;
  details?: string | null;
  precision: number;
  timestamp: number;
  added_at: number;
  balance: AssetBalanceResponse;
  token?: TokenLight | null;
}

export interface AssetCFA {
  asset_id: string;
  asset_iface: AssetIface;
  name: string;
  details?: string | null;
  precision: number;
  issued_supply: number;
  timestamp: number;
  added_at: number;
  balance: AssetBalanceResponse;
  media?: Media | null;
}

export interface AssetIFA {
  asset_id: string;
  asset_iface: AssetIface;
  ticker: string;
  name: string;
  details?: string | null;
  precision: number;
  initial_supply: number;
  max_supply: number;
  known_circulating_supply: number;
  timestamp: number;
  added_at: number;
  balance: AssetBalanceResponse;
  media?: Media | null;
  reject_list_url?: string | null;
}

export interface IssueAssetCFAResponse {
  asset: AssetCFA;
}

export interface IssueAssetIFAResponse {
  asset: AssetIFA;
}

export interface IssueAssetNIAResponse {
  asset: AssetNIA;
}

export interface IssueAssetUDAResponse {
  asset: AssetUDA;
}

export interface ListAssetsResponse {
  nia: AssetNIA[] | null;
  uda: AssetUDA[] | null;
  cfa: AssetCFA[] | null;
  ifa: AssetIFA[] | null;
}

export interface Channel {
  channel_id: string;
  funding_txid: string | null;
  peer_pubkey: string;
  peer_alias?: string | null;
  short_channel_id?: number | null;
  status: ChannelStatus;
  ready: boolean;
  capacity_sat: number;
  local_balance_sat: number;
  outbound_balance_msat: number;
  inbound_balance_msat: number;
  next_outbound_htlc_limit_msat: number;
  next_outbound_htlc_minimum_msat: number;
  is_usable: boolean;
  public: boolean;
  asset_id?: string | null;
  asset_local_amount?: number | null;
  asset_remote_amount?: number | null;
}

export interface ListChannelsResponse {
  channels: Channel[];
}

export interface Payment {
  amt_msat: number | null;
  asset_amount?: number | null;
  asset_id?: string | null;
  payment_hash: string;
  inbound: boolean;
  status: HTLCStatus;
  created_at: number;
  updated_at: number;
  payee_pubkey: string;
  preimage?: string;
}

export interface GetPaymentResponse {
  payment: Payment;
}

export interface ListPaymentsResponse {
  payments: Payment[];
}

export interface Peer {
  pubkey: string;
  address?: string;
}

export interface ListPeersResponse {
  peers: Peer[];
}

export interface Swap {
  qty_from: number;
  qty_to: number;
  from_asset: string | null;
  to_asset: string | null;
  payment_hash: string;
  status: SwapStatus;
  requested_at: number;
  initiated_at?: number | null;
  expires_at?: number;
  completed_at?: number | null;
}

export interface GetSwapResponse {
  swap: Swap;
}

export interface ListSwapsResponse {
  maker: Swap[];
  taker: Swap[];
}

export interface Transaction {
  transaction_type: TransactionType;
  txid: string;
  received: number;
  sent: number;
  fee: number;
  confirmation_time?: BlockTime | null;
}

export interface ListTransactionsResponse {
  transactions: Transaction[];
}

export interface TransferTransportEndpoint {
  endpoint: string;
  transport_type: TransportType;
  used: boolean;
}

export interface Transfer {
  idx: number;
  created_at: number;
  updated_at: number;
  status: TransferStatus;
  amount: number;
  kind: TransferKind;
  txid?: string | null;
  recipient_id?: string | null;
  receive_utxo?: string | null;
  change_utxo?: string | null;
  expiration_timestamp?: number | null;
  transport_endpoints: TransferTransportEndpoint[];
  requested_assignment?: Assignment | null;
  assignments?: Assignment[];
}

export interface ListTransfersResponse {
  transfers: Transfer[];
}

export interface RgbAllocation {
  asset_id: string | null;
  amount: number;
  settled: boolean;
  assignment?: Assignment;
}

export interface Utxo {
  outpoint: string;
  btc_amount: number;
  colorable: boolean;
}

export interface Unspent {
  utxo: Utxo;
  rgb_allocations: RgbAllocation[];
}

export interface ListUnspentsResponse {
  unspents: Unspent[];
}

/**
 * RGB API Client class with all method signatures
 */
export declare class RgbApiClient {
  constructor(baseUrlOrOptions?: string | RgbApiClientOptions, apiKey?: string);

  // Module accessors
  onchain: OnchainMethods;
  rgb: RgbMethods;
  lightning: LightningMethods;
  swaps: SwapMethods;
  node: NodeMethods;
  webhook: WebhookMethods;
}

// ===== Module Classes =====

export declare class OnchainMethods {
  getAddress(): Promise<AddressResponse>;
  getBtcBalance(data?: BtcBalanceRequest): Promise<BtcBalanceResponse>;
  sendBtc(data: SendBtcRequest): Promise<SendBtcResponse>;
  createUtxos(data?: CreateUtxosRequest): Promise<EmptyResponse>;
  estimateFee(data: EstimateFeeRequest): Promise<EstimateFeeResponse>;
  listOnchainTransactions(data?: ListTransactionsRequest): Promise<ListTransactionsResponse>;
  listUnspents(data?: ListUnspentsRequest): Promise<ListUnspentsResponse>;
}

export declare class RgbMethods {
  getAssetBalance(data: AssetBalanceRequest): Promise<AssetBalanceResponse>;
  getAssetMetadata(data: AssetMetadataRequest): Promise<AssetMetadataResponse>;
  assetIdFromHexBytes(data: AssetIdFromHexBytesRequest): Promise<AssetIdFromHexBytesResponse>;
  assetIdToHexBytes(data: AssetIdToHexBytesRequest): Promise<AssetIdToHexBytesResponse>;
  listAssets(data?: ListAssetsRequest): Promise<ListAssetsResponse>;
  listTransfers(data?: ListTransfersRequest): Promise<ListTransfersResponse>;
  issueAssetCfa(data: IssueAssetCFARequest): Promise<IssueAssetCFAResponse>;
  issueAssetNia(data: IssueAssetNIARequest): Promise<IssueAssetNIAResponse>;
  issueAssetUda(data: IssueAssetUDARequest): Promise<IssueAssetUDAResponse>;
  issueAssetIfa(data: IssueAssetIFARequest): Promise<IssueAssetIFAResponse>;
  inflate(data: InflateRequest): Promise<InflateResponse>;
  sendAsset(data: SendAssetRequest): Promise<SendAssetResponse>;
  createRgbInvoice(data: RgbInvoiceRequest): Promise<RgbInvoiceResponse>;
  decodeRgbInvoice(data: DecodeRGBInvoiceRequest): Promise<DecodeRGBInvoiceResponse>;
  payRgbInvoice(data: { invoice: string; fee_rate?: number; skip_sync?: boolean; transport_endpoints?: string[] }): Promise<SendAssetResponse>;
  failTransfers(data?: FailTransfersRequest): Promise<FailTransfersResponse>;
  getAssetMedia(data: GetAssetMediaRequest): Promise<GetAssetMediaResponse>;
  postAssetMedia(data: PostAssetMediaRequest): Promise<PostAssetMediaResponse>;
  refreshTransfers(data?: RefreshRequest): Promise<EmptyResponse>;
  syncRgbWallet(): Promise<EmptyResponse>;
  subscribeToRgbTransactions(options: { onTransaction: Function; onError?: Function; pollingInterval?: number; maxStoredIds?: number }): string;
  unsubscribeFromRgbTransactions(subscriptionId: string): boolean;
}

export declare class LightningMethods {
  createInvoice(data: LNInvoiceRequest): Promise<LNInvoiceResponse>;
  createHodlInvoice(data: LNHodlInvoiceRequest): Promise<LNInvoiceResponse>;
  decodeLnInvoice(data: DecodeLNInvoiceRequest): Promise<DecodeLNInvoiceResponse>;
  getInvoiceStatus(data: InvoiceStatusRequest): Promise<InvoiceStatusResponse>;
  payInvoice(data: SendPaymentRequest): Promise<SendPaymentResponse>;
  listPayments(): Promise<ListPaymentsResponse>;
  getPayment(data: GetPaymentRequest): Promise<GetPaymentResponse>;
  keysend(data: KeysendRequest): Promise<KeysendResponse>;
  connectPeer(data: ConnectPeerRequest): Promise<EmptyResponse>;
  listPeers(): Promise<ListPeersResponse>;
  disconnectPeer(data: DisconnectPeerRequest): Promise<EmptyResponse>;
  openChannel(data: OpenChannelRequest): Promise<OpenChannelResponse>;
  closeChannel(data: CloseChannelRequest): Promise<EmptyResponse>;
  listChannels(): Promise<ListChannelsResponse>;
  getChannelIdByTempId(data: GetChannelIdRequest): Promise<GetChannelIdResponse>;
  sendOnionMessage(data: SendOnionMessageRequest): Promise<EmptyResponse>;
  subscribeToPayments(options: { onPayment: Function; onError?: Function; pollingInterval?: number; maxStoredIds?: number }): string;
  unsubscribeFromPayments(subscriptionId: string): boolean;
}

export declare class SwapMethods {
  makerInitSwap(data: MakerInitRequest): Promise<MakerInitResponse>;
  makerExecuteSwap(data: MakerExecuteRequest): Promise<EmptyResponse>;
  takerAcceptSwap(data: TakerRequest): Promise<EmptyResponse>;
  getSwap(data: GetSwapRequest): Promise<GetSwapResponse>;
  listSwaps(): Promise<ListSwapsResponse>;
}

export declare class NodeMethods {
  getNodeInfo(): Promise<NodeInfoResponse>;
  getNodeState(): Promise<NodeState>;
  getNetworkInfo(): Promise<NetworkInfoResponse>;
  checkIndexerUrl(data: CheckIndexerUrlRequest): Promise<CheckIndexerUrlResponse>;
  checkProxyEndpoint(data: CheckProxyEndpointRequest): Promise<EmptyResponse>;
  signMessage(data: SignMessageRequest): Promise<SignMessageResponse>;
  initNode(data: InitRequest): Promise<InitResponse>;
  unlockNode(data: UnlockRequest): Promise<EmptyResponse>;
  lockNode(): Promise<EmptyResponse>;
  changePassword(data: ChangePasswordRequest): Promise<EmptyResponse>;
  backupNode(data: BackupRequest): Promise<EmptyResponse>;
  restoreNode(data: RestoreRequest): Promise<EmptyResponse>;
  revokeToken(data: RevokeTokenRequest): Promise<EmptyResponse>;
  shutdown(): Promise<EmptyResponse>;
}

export declare class WebhookMethods {
  listWebhooks(): Promise<WebhookListResponse>;
  subscribeWebhook(data: WebhookSubscribeRequest): Promise<WebhookSubscribeResponse>;
  unsubscribeWebhook(data: WebhookUnsubscribeRequest): Promise<EmptyResponse>;
}
