// examples/nodejs/getAddress.js

const { RgbApiClient } = require('./rgb-api-sdk.cjs');

async function demoGetAddress() {
  console.log('Node.js Demo: Calling getAddress API');
  
  // Instantiate client with base URL
  const client = new RgbApiClient({ baseUrl: 'http://localhost:3001' });

  try {
    // Call the getAddress API
    const addressResponse = await client.onchain.getAddress();

    console.log('getAddress Response:', addressResponse);
    // Example output:
    // { address: '...' }
  } catch (error) {
    console.error('Error calling getAddress:', error);
  }
}

// demoGetAddress(); 

async function demoGetNodeState() {
  console.log('Node.js Demo: Calling getNodeState API');
  const client = new RgbApiClient({ baseUrl: 'http://localhost:3001' });
  const nodeState = await client.node.getNodeState();
  console.log('getNodeState Response:', nodeState);
}

//demoGetNodeState(); 

async function demoDecodeRGBLNInvoice() {
  const client = new RgbApiClient();
  const lninvoice="lnbcrt30u1p5f9szddq9wfnkynp4qwm320383zpwfrnfptxswsestjad4p43xx4n8zxv67ptgkcz7pjw7pp5vjgmxact908z8df4nv2a04k82rewg2fjhrrfnvxel3scvha6p56qsp5mc6n3dfy99jnle5h3jvmleq83drk8hukw32p9p7mmxs056ulmwcs9qyysgqcqpcxqrrsslz5wfnkywnrfgukv46x0f8j6umwwp5yzetv94x5xh6gfee8vttzwqmhxlnwxuk4zu2ndp95jdfdf3n5zwzh09es7qryugsdqhdzpphl7nw80ennsweszs5ry9pw24h6ft2kq9d2ke5tynl6kqas6akgje7yw8243wes9xpk6ugnjeg82gj77m2p84xfwfkc5specpq9x6v9"
  const retDecode = client.lightning.decodeRGBLNInvoice(lninvoice)
  console.log('decodeRGBLNInvoice Response:', retDecode);
}

demoDecodeRGBLNInvoice();