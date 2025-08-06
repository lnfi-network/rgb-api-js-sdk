/**
 * TypeScript type definitions for RGB API SDK
 * This file provides type hints for better IDE support
 * Generated from OpenAPI specification
 */

// ===== Basic Configuration =====
export interface RgbApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  axiosConfig?: any;
}

// ===== Basic Types and Enums =====
export type BitcoinNetwork = "Mainnet" | "Testnet" | "Signet" | "Regtest";
export type AssetIface = "RGB20" | "RGB21" | "RGB25";
export type AssetSchema = "Nia" | "Uda" | "Cfa";
export type ChannelStatus = "Opening" | "Opened" | "Closing";
export type HTLCStatus = "Pending" | "Succeeded" | "Failed";
export type InvoiceStatus = "Pending" | "Succeeded" | "Failed" | "Expired";
export type IndexerProtocol = "Electrum" | "Esplora";
export type SwapStatus =
  | "Waiting"
  | "Pending"
  | "Succeeded"
  | "Expired"
  | "Failed";
export type TransactionType = "RgbSend" | "Drain" | "CreateUtxos" | "User";
export type TransferStatus =
  | "WaitingCounterparty"
  | "WaitingConfirmations"
  | "Settled"
  | "Failed";
export type TransferKind =
  | "Issuance"
  | "ReceiveBlind"
  | "ReceiveWitness"
  | "Send";
export type TransportType = "JsonRpc";

// ===== Request Interfaces =====
export interface AssetBalanceRequest {
  asset_id: string;
}

export interface AssetMetadataRequest {
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
  num?: number;
  size?: number;
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
  taker?: boolean;
}

export interface InitRequest {
  password: string;
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
  asset_id?: string;
  asset_amount?: number;
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
  amt_msat: number;
  expiry_sec?: number;
  asset_id?: string;
  asset_amount?: number;
}

export interface MakerExecuteRequest {
  swapstring: string;
  payment_secret: string;
  taker_pubkey: string;
}

export interface MakerInitRequest {
  qty_from: number;
  qty_to: number;
  from_asset: string;
  to_asset: string;
  timeout_sec: number;
}

export interface OpenChannelRequest {
  peer_pubkey_and_opt_addr: string;
  capacity_sat: number;
  push_msat?: number;
  asset_amount?: number;
  asset_id?: string;
  public?: boolean;
  with_anchors?: boolean;
  fee_base_msat?: number;
  fee_proportional_millionths?: number;
  temporary_channel_id?: string;
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

export interface RgbInvoiceRequest {
  min_confirmations: number;
  asset_id: string;
  duration_seconds?: number;
}

export interface SendAssetRequest {
  asset_id: string;
  amount: number;
  recipient_id: string;
  donation?: boolean;
  fee_rate?: number;
  min_confirmations?: number;
  transport_endpoints?: string[];
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
}

export interface SignMessageRequest {
  message: string;
}

export interface TakerRequest {
  swapstring: string;
}

export interface UnlockRequest {
  password: string;
  bitcoind_rpc_username?: string;
  bitcoind_rpc_password?: string;
  bitcoind_rpc_host?: string;
  bitcoind_rpc_port?: number;
  indexer_url?: string;
  proxy_endpoint?: string;
  announce_addresses?: string[];
  announce_alias?: string;
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
  amt_msat: number;
  expiry_sec: number;
  timestamp: number;
  asset_id?: string;
  asset_amount?: number;
  payment_hash: string;
  payment_secret: string;
  payee_pubkey: string;
  network: BitcoinNetwork;
}

export interface DecodeRGBInvoiceResponse {
  recipient_id: string;
  asset_iface: AssetIface;
  asset_id: string;
  amount: number;
  network: BitcoinNetwork;
  expiration_timestamp?: number;
  transport_endpoints: string[];
}

export interface EstimateFeeResponse {
  fee_rate: number;
}

export interface FailTransfersResponse {
  transfers_changed: boolean;
}

export interface GetAssetMediaResponse {
  bytes_hex: string;
}

export interface GetChannelIdResponse {
  channel_id: string;
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

export interface OpenChannelResponse {
  temporary_channel_id: string;
}

export interface PostAssetMediaResponse {
  digest: string;
}

export interface RgbInvoiceResponse {
  recipient_id: string;
  invoice: string;
  expiration_timestamp: number;
  batch_transfer_idx: number;
}

export interface SendAssetResponse {
  txid: string;
}

export interface SendBtcResponse {
  txid: string;
}

export interface SendPaymentResponse {
  payment_hash: string;
  payment_secret: string;
  status: HTLCStatus;
}

export interface SignMessageResponse {
  signed_message: string;
}

// ===== Complex Object Interfaces =====
export interface Media {
  file_path: string;
  mime: string;
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
  ticker: string;
  name: string;
  details?: string;
  embedded_media?: EmbeddedMedia;
  media?: Media;
  attachments?: { [key: string]: Media };
  reserves?: ProofOfReserves;
}

export interface TokenLight {
  index: number;
  ticker: string;
  name: string;
  details?: string;
  embedded_media?: boolean;
  media?: Media;
  attachments?: { [key: string]: Media };
  reserves?: boolean;
}

export interface AssetMetadataResponse {
  asset_iface: AssetIface;
  asset_schema: AssetSchema;
  issued_supply: number;
  timestamp: number;
  name: string;
  precision: number;
  ticker?: string;
  details?: string;
  token?: Token;
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
  details?: string;
  precision: number;
  issued_supply: number;
  timestamp: number;
  added_at: number;
  balance: AssetBalanceResponse;
  token?: TokenLight;
}

export interface AssetCFA {
  asset_id: string;
  asset_iface: AssetIface;
  name: string;
  details?: string;
  precision: number;
  issued_supply: number;
  timestamp: number;
  added_at: number;
  balance: AssetBalanceResponse;
  media?: Media;
}

export interface IssueAssetCFAResponse {
  asset: AssetCFA;
}

export interface IssueAssetNIAResponse {
  asset: AssetNIA;
}

export interface IssueAssetUDAResponse {
  asset: AssetUDA;
}

export interface ListAssetsResponse {
  nia: AssetNIA[];
  uda: AssetUDA[];
  cfa: AssetCFA[];
}

export interface Channel {
  channel_id: string;
  funding_txid: string;
  peer_pubkey: string;
  peer_alias?: string;
  short_channel_id?: number;
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
  asset_id?: string;
  asset_local_amount?: number;
  asset_remote_amount?: number;
}

export interface ListChannelsResponse {
  channels: Channel[];
}

export interface Payment {
  amt_msat: number;
  asset_amount?: number;
  asset_id?: string;
  payment_hash: string;
  inbound: boolean;
  status: HTLCStatus;
  created_at: number;
  updated_at: number;
  payee_pubkey: string;
}

export interface GetPaymentResponse {
  payment: Payment;
}

export interface ListPaymentsResponse {
  payments: Payment[];
}

export interface Peer {
  pubkey: string;
}

export interface ListPeersResponse {
  peers: Peer[];
}

export interface Swap {
  qty_from: number;
  qty_to: number;
  from_asset: string;
  to_asset: string;
  payment_hash: string;
  status: SwapStatus;
  requested_at: number;
  initiated_at?: number;
  expires_at?: number;
  completed_at?: number;
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
  confirmation_time?: BlockTime;
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
  txid?: string;
  recipient_id: string;
  receive_utxo?: string;
  change_utxo?: string;
  expiration?: number;
  transport_endpoints: TransferTransportEndpoint[];
}

export interface ListTransfersResponse {
  transfers: Transfer[];
}

export interface RgbAllocation {
  asset_id: string;
  amount: number;
  settled: boolean;
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

  // ===== On-chain Methods =====

  /**
   * Get a Bitcoin address
   * GET /address
   */
  getAddress(): Promise<AddressResponse>;

  /**
   * Get the BTC balance
   * POST /btcbalance
   */
  getBtcBalance(data?: BtcBalanceRequest): Promise<BtcBalanceResponse>;

  /**
   * Send BTC
   * POST /sendbtc
   */
  sendBtc(data: SendBtcRequest): Promise<SendBtcResponse>;

  /**
   * Create UTXOs
   * POST /createutxos
   */
  createUtxos(data?: CreateUtxosRequest): Promise<void>;

  /**
   * Get fee estimation
   * POST /estimatefee
   */
  estimateFee(data: EstimateFeeRequest): Promise<EstimateFeeResponse>;

  /**
   * List transactions
   * POST /listtransactions
   */
  listOnchainTransactions(
    data?: ListTransactionsRequest
  ): Promise<ListTransactionsResponse>;

  /**
   * List unspents
   * POST /listunspents
   */
  listUnspents(data?: ListUnspentsRequest): Promise<ListUnspentsResponse>;

  // ===== Peers Methods =====

  /**
   * Connect to a peer
   * POST /connectpeer
   */
  connectPeer(data: ConnectPeerRequest): Promise<void>;

  /**
   * List peers
   * GET /listpeers
   */
  listPeers(): Promise<ListPeersResponse>;

  /**
   * Disconnect from a peer
   * POST /disconnectpeer
   */
  disconnectPeer(data: DisconnectPeerRequest): Promise<void>;

  // ===== Channels Methods =====

  /**
   * Open a channel
   * POST /openchannel
   */
  openChannel(data: OpenChannelRequest): Promise<OpenChannelResponse>;

  /**
   * Close a channel
   * POST /closechannel
   */
  closeChannel(data: CloseChannelRequest): Promise<void>;

  /**
   * List channels
   * GET /listchannels
   */
  listChannels(): Promise<ListChannelsResponse>;

  /**
   * Get a channel's ID
   * POST /getchannelid
   */
  getChannelIdByTempId(
    data: GetChannelIdRequest
  ): Promise<GetChannelIdResponse>;

  // ===== Invoices Methods =====

  /**
   * Get a LN invoice
   * POST /lninvoice
   */
  createInvoice(data: LNInvoiceRequest): Promise<LNInvoiceResponse>;

  /**
   * Decode a LN invoice
   * POST /decodelninvoice
   */
  decodeLnInvoice(
    data: DecodeLNInvoiceRequest
  ): Promise<DecodeLNInvoiceResponse>;

  /**
   * Get an invoice status
   * POST /invoicestatus
   */
  getInvoiceStatus(data: InvoiceStatusRequest): Promise<InvoiceStatusResponse>;

  // ===== Payments Methods =====

  /**
   * Send a payment
   * POST /sendpayment
   */
  payInvoice(data: SendPaymentRequest): Promise<SendPaymentResponse>;

  /**
   * List payments
   * GET /listpayments
   */
  listPayments(): Promise<ListPaymentsResponse>;

  /**
   * Get a payment
   * POST /getpayment
   */
  getPayment(data: GetPaymentRequest): Promise<GetPaymentResponse>;

  /**
   * Send to a peer spontaneously
   * POST /keysend
   */
  keysend(data: KeysendRequest): Promise<KeysendResponse>;

  // ===== RGB Methods =====

  /**
   * Get the balance of an asset
   * POST /assetbalance
   */
  getAssetBalance(data: AssetBalanceRequest): Promise<AssetBalanceResponse>;

  /**
   * Get the metadata of an asset
   * POST /assetmetadata
   */
  getAssetMetadata(data: AssetMetadataRequest): Promise<AssetMetadataResponse>;

  /**
   * List assets
   * POST /listassets
   */
  listAssets(data?: ListAssetsRequest): Promise<ListAssetsResponse>;

  /**
   * List transfers
   * POST /listtransfers
   */
  listTransactions(data?: ListTransfersRequest): Promise<ListTransfersResponse>;

  /**
   * Issue an RGB CFA asset
   * POST /issueassetcfa
   */
  issueAssetCfa(data: IssueAssetCFARequest): Promise<IssueAssetCFAResponse>;

  /**
   * Issue an RGB NIA asset
   * POST /issueassetnia
   */
  issueAssetNia(data: IssueAssetNIARequest): Promise<IssueAssetNIAResponse>;

  /**
   * Issue an RGB UDA asset
   * POST /issueassetuda
   */
  issueAssetUda(data: IssueAssetUDARequest): Promise<IssueAssetUDAResponse>;

  /**
   * Send assets
   * POST /sendasset
   */
  sendAsset(data: SendAssetRequest): Promise<SendAssetResponse>;

  /**
   * Get an RGB invoice
   * POST /rgbinvoice
   */
  createRgbInvoice(data: RgbInvoiceRequest): Promise<RgbInvoiceResponse>;

  /**
   * Decode an RGB invoice
   * POST /decodergbinvoice
   */
  decodeRgbInvoice(
    data: DecodeRGBInvoiceRequest
  ): Promise<DecodeRGBInvoiceResponse>;

  /**
   * Composite method: Pay an RGB invoice by decoding it and sending the asset
   * Not a direct API endpoint
   */
  payRgbInvoice(data: {
    invoice: string;
    fee_rate?: number;
    skip_sync?: boolean;
    transport_endpoints?: string[];
  }): Promise<SendAssetResponse>;

  /**
   * Fail RGB transfers
   * POST /failtransfers
   */
  failTransfers(data?: FailTransfersRequest): Promise<FailTransfersResponse>;

  /**
   * Get an asset media
   * POST /getassetmedia
   */
  getAssetMedia(data: GetAssetMediaRequest): Promise<GetAssetMediaResponse>;

  /**
   * Post an asset media
   * POST /postassetmedia
   */
  postAssetMedia(data: PostAssetMediaRequest): Promise<PostAssetMediaResponse>;

  /**
   * Refresh transfers
   * POST /refreshtransfers
   */
  refreshTransfers(data?: RefreshRequest): Promise<void>;

  /**
   * Sync the RGB wallet
   * POST /sync
   */
  syncRgbWallet(): Promise<void>;

  // ===== Swaps Methods =====

  /**
   * Init a maker swap
   * POST /makerinit
   */
  makerInitSwap(data: MakerInitRequest): Promise<MakerInitResponse>;

  /**
   * Execute a maker swap
   * POST /makerexecute
   */
  makerExecuteSwap(data: MakerExecuteRequest): Promise<void>;

  /**
   * Accept a swap
   * POST /taker
   */
  takerAcceptSwap(data: TakerRequest): Promise<void>;

  /**
   * Get a swap
   * POST /getswap
   */
  getSwap(data: GetSwapRequest): Promise<GetSwapResponse>;

  /**
   * List swaps
   * GET /listswaps
   */
  listSwaps(): Promise<ListSwapsResponse>;

  // ===== Other/Node Methods =====

  /**
   * Get node info
   * GET /nodeinfo
   */
  getNodeInfo(): Promise<NodeInfoResponse>;

  /**
   * Get network info
   * GET /networkinfo
   */
  getNetworkInfo(): Promise<NetworkInfoResponse>;

  /**
   * Check an indexer URL
   * POST /checkindexerurl
   */
  checkIndexerUrl(
    data: CheckIndexerUrlRequest
  ): Promise<CheckIndexerUrlResponse>;

  /**
   * Check a proxy endpoint
   * POST /checkproxyendpoint
   */
  checkProxyEndpoint(data: CheckProxyEndpointRequest): Promise<void>;

  /**
   * Send an onion message
   * POST /sendonionmessage
   */
  sendOnionMessage(data: SendOnionMessageRequest): Promise<void>;

  /**
   * Sign a message
   * POST /signmessage
   */
  signMessage(data: SignMessageRequest): Promise<SignMessageResponse>;

  /**
   * Init the node
   * POST /init
   */
  initNode(data: InitRequest): Promise<InitResponse>;

  /**
   * Unlock the node
   * POST /unlock
   */
  unlockNode(data: UnlockRequest): Promise<void>;

  /**
   * Lock the node
   * POST /lock
   */
  lockNode(): Promise<void>;

  /**
   * Change the password
   * POST /changepassword
   */
  changePassword(data: ChangePasswordRequest): Promise<void>;

  /**
   * Backup the node
   * POST /backup
   */
  backupNode(data: BackupRequest): Promise<void>;

  /**
   * Restore the node
   * POST /restore
   */
  restoreNode(data: RestoreRequest): Promise<void>;

  /**
   * Shutdown the node
   * POST /shutdown
   */
  shutdownNode(): Promise<void>;

  /**
   * Custom method: Get node state (endpoint may not exist in OpenAPI)
   */
  getNodeState(): Promise<number>;
}
