import { bech32 } from 'bech32';


// Constants for tagged fields (from BOLT 11 specification)
const TAG_PAYMENT_HASH = 1;
const TAG_DESCRIPTION = 13;
const TAG_PAYEE_PUB_KEY = 19;
const TAG_DESCRIPTION_HASH = 23;
const TAG_EXPIRY_TIME = 6;
const TAG_MIN_FINAL_CLTV_EXPIRY_DELTA = 24;
const TAG_FALLBACK = 9;
const TAG_PRIVATE_ROUTE = 3;
const TAG_PAYMENT_SECRET = 16;
const TAG_PAYMENT_METADATA = 27;
const TAG_FEATURES = 5;
const TAG_RGB_AMOUNT = 30;
const TAG_RGB_CONTRACT_ID = 31;

// Network mappings
const NETWORKS = {
  'bc': 'Mainnet',
  'tb': 'Testnet', 
  'bcrt': 'Regtest',
  'sb': 'Signet',
  'tbs': 'Signet'
};

// SI prefix multipliers
const SI_PREFIXES = {
  'm': 1e-3,    // milli
  'u': 1e-6,    // micro
  'n': 1e-9,    // nano
  'p': 1e-12    // pico
};

/**
 * Parse a big-endian integer from base32 data
 * @param {Array} data - Array of 5-bit values
 * @returns {number} - Parsed integer
 */
function parseIntBE(data) {
  let result = 0;
  for (const byte of data) {
    result = result * 32 + byte;
  }
  return result;
}

/**
 * Convert base32 data to bytes
 * @param {Array} data - Array of 5-bit values
 * @returns {Uint8Array} - Converted bytes
 */
function fromBase32(data) {
  const result = [];
  let acc = 0;
  let bits = 0;
  
  for (const value of data) {
    acc = (acc << 5) | value;
    bits += 5;
    
    while (bits >= 8) {
      result.push((acc >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  
  return new Uint8Array(result);
}

/**
 * Convert bytes to hex string
 * @param {Uint8Array} bytes - Input bytes
 * @returns {string} - Hex string
 */
function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Parse HRP (Human Readable Part) of the invoice
 * @param {string} hrp - Human readable part
 * @returns {Object} - Parsed HRP data
 */
function parseHRP(hrp) {
  // Match pattern: ln + currency + amount + si_prefix
  const match = hrp.match(/^ln([a-z]+)(\d*)([munp]?)$/);
  if (!match) {
    throw new Error('Invalid HRP format');
  }
  
  const [, currency, amount, siPrefix] = match;
  
  return {
    currency,
    amount: amount ? parseInt(amount) : null,
    siPrefix: siPrefix || null,
    network: NETWORKS[currency] || 'Unknown'
  };
}

/**
 * Parse tagged fields from the data part
 * @param {Array} data - Array of 5-bit values
 * @returns {Object} - Parsed tagged fields
 */
function parseTaggedFields(data) {
  const fields = {};
  let pos = 0;
  
  while (pos < data.length) {
    if (pos + 3 > data.length) {
      throw new Error('Unexpected end of tagged fields');
    }
    
    const tag = data[pos];
    const length = (data[pos + 1] << 5) | data[pos + 2];
    pos += 3;
    
    if (pos + length > data.length) {
      throw new Error('Tagged field length exceeds remaining data');
    }
    
    const fieldData = data.slice(pos, pos + length);
    pos += length;
    
    try {
      switch (tag) {
        case TAG_PAYMENT_HASH:
          if (fieldData.length === 52) { // 32 bytes * 8/5 = 51.2, rounded up
            fields.paymentHash = bytesToHex(fromBase32(fieldData));
          }
          break;
          
        case TAG_DESCRIPTION:
          const descBytes = fromBase32(fieldData);
          fields.description = new TextDecoder().decode(descBytes);
          break;
          
        case TAG_PAYEE_PUB_KEY:
          if (fieldData.length === 53) { // 33 bytes * 8/5 = 52.8, rounded up
            fields.payeePubkey = bytesToHex(fromBase32(fieldData));
          }
          break;
          
        case TAG_DESCRIPTION_HASH:
          if (fieldData.length === 52) {
            fields.descriptionHash = bytesToHex(fromBase32(fieldData));
          }
          break;
          
        case TAG_EXPIRY_TIME:
          fields.expiryTime = parseIntBE(fieldData);
          break;
          
        case TAG_MIN_FINAL_CLTV_EXPIRY_DELTA:
          fields.minFinalCltvExpiryDelta = parseIntBE(fieldData);
          break;
          
        case TAG_PAYMENT_SECRET:
          if (fieldData.length === 52) { // 32 bytes
            fields.paymentSecret = bytesToHex(fromBase32(fieldData));
          }
          break;
          
        case TAG_PAYMENT_METADATA:
          fields.paymentMetadata = bytesToHex(fromBase32(fieldData));
          break;
          
        case TAG_FEATURES:
          fields.features = bytesToHex(fromBase32(fieldData));
          break;
          
        case TAG_RGB_AMOUNT:
          fields.rgbAmount = parseIntBE(fieldData);
          break;
          
        case TAG_RGB_CONTRACT_ID:
          const contractBytes = fromBase32(fieldData);
          fields.rgbContractId = new TextDecoder().decode(contractBytes);
          break;
          
        default:
          // Skip unknown fields as per BOLT 11
          break;
      }
    } catch (e) {
      // Skip fields that can't be parsed
      continue;
    }
  }
  
  return fields;
}

/**
 * Parse Lightning Network invoice
 * @param {string} invoice - BOLT 11 invoice string
 * @returns {Object} - Parsed invoice data compatible with rgb-lightning-node API
 */
export function decodeRGBLNInvoice(invoice) {
  try {
    // Decode bech32
    const decoded = bech32.decode(invoice, 2000); // Max length for invoices
    const { prefix: hrp, words: data } = decoded;
    
    // Parse HRP
    const hrpData = parseHRP(hrp);
    
    // Check minimum data length (timestamp + signature = 7 + 104 = 111)
    if (data.length < 111) {
      throw new Error('Invoice data too short');
    }
    
    // Extract timestamp (first 7 words = 35 bits)
    const timestampData = data.slice(0, 7);
    const timestamp = parseIntBE(timestampData);
    
    // Extract tagged fields (everything except timestamp and signature)
    const taggedData = data.slice(7, data.length - 104);
    const taggedFields = parseTaggedFields(taggedData);
    
    // Calculate amount in millisatoshis
    let amtMsat = null;
    if (hrpData.amount !== null) {
      let amount = hrpData.amount;
      if (hrpData.siPrefix && SI_PREFIXES[hrpData.siPrefix]) {
        // Convert to millisatoshis using integer arithmetic to avoid floating point errors
        if (hrpData.siPrefix === 'u') {
          // micro-bitcoin: 1 uBTC = 100,000 msat (100 satoshi * 1000 msat/sat)
          amtMsat = amount * 100000;
        } else if (hrpData.siPrefix === 'm') {
          // milli-bitcoin: 1 mBTC = 100,000,000 msat
          amtMsat = amount * 100000000;
        } else if (hrpData.siPrefix === 'n') {
          // nano-bitcoin: 1 nBTC = 100 msat
          amtMsat = amount * 100;
        } else if (hrpData.siPrefix === 'p') {
          // pico-bitcoin: 1 pBTC = 0.1 msat
          amtMsat = Math.floor(amount / 10);
        }
      } else {
        // Default is picobitcoin, convert to msat
        amtMsat = Math.floor(amount / 10); // 1 picobitcoin = 0.1 msat
      }
    }
    
    // Calculate expiry time
    const expiryTime = taggedFields.expiryTime || 3600; // Default 1 hour
    
    // Format RGB contract ID if present
    let assetId = null;
    if (taggedFields.rgbContractId) {
      // RGB Contract ID is already in the correct format
      assetId = taggedFields.rgbContractId;
    }
    
    // Return data in the same format as rgb-lightning-node API
    return {
      amt_msat: amtMsat,
      expiry_sec: expiryTime,
      timestamp: timestamp,
      asset_id: assetId,
      asset_amount: taggedFields.rgbAmount || null,
      payment_hash: taggedFields.paymentHash || null,
      payment_secret: taggedFields.paymentSecret || null,
      payee_pubkey: taggedFields.payeePubkey || null,
      network: hrpData.network
    };
    
  } catch (error) {
    throw new Error(`Failed to decode Lightning invoice: ${error.message}`);
  }
}

/**
 * Validate Lightning Network invoice format
 * @param {string} invoice - BOLT 11 invoice string
 * @returns {boolean} - True if valid format
 */
export function isValidRGBLNInvoice(invoice) {
  try {
    decodeRGBLNInvoice(invoice);
    return true;
  } catch {
    return false;
  }
}

export default {
  decodeRGBLNInvoice,
  isValidRGBLNInvoice
};