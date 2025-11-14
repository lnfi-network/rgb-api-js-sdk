// examples/nodejs/getAddress.js

import { RgbApiClient } from '@lnfi-network/rgb-api-js-sdk';


const client = new RgbApiClient({
    baseUrl:"http://34.84.66.29:3001",
  },"token");

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
  
  const lninvoice="lnbcrt30u1p5f9szddq9wfnkynp4qwm320383zpwfrnfptxswsestjad4p43xx4n8zxv67ptgkcz7pjw7pp5vjgmxact908z8df4nv2a04k82rewg2fjhrrfnvxel3scvha6p56qsp5mc6n3dfy99jnle5h3jvmleq83drk8hukw32p9p7mmxs056ulmwcs9qyysgqcqpcxqrrsslz5wfnkywnrfgukv46x0f8j6umwwp5yzetv94x5xh6gfee8vttzwqmhxlnwxuk4zu2ndp95jdfdf3n5zwzh09es7qryugsdqhdzpphl7nw80ennsweszs5ry9pw24h6ft2kq9d2ke5tynl6kqas6akgje7yw8243wes9xpk6ugnjeg82gj77m2p84xfwfkc5specpq9x6v9"
  const retDecode = client.lightning.decodeRGBLNInvoice(lninvoice)
  console.log('decodeRGBLNInvoice Response:', retDecode);
}

//demoDecodeRGBLNInvoice();

const getChannels = async () => {
  const channels = await client.lightning.listChannels();
  console.log('getChannels Response:', channels);
};

 getChannels();

//createLnInvoice

const createLnInvoice = async () => {
  const invoice = await client.lightning.createInvoice({
    amount_msat: 10*1000,
    expiry_sec: 3600,
  });
  console.log('createLnInvoice Response:', invoice);
};

// createLnInvoice();

const payInvoice = async () => {
  const invoice = await client.lightning.payInvoice({
    invoice: 'lnbcrt1u1p5sc4wjdqud3jxktt5w46x7unfv9kz6mn0v3jsnp4qwm320383zpwfrnfptxswsestjad4p43xx4n8zxv67ptgkcz7pjw7pp5j8h60f7zepcy2602y5a9eugf99fm4hnnj5xfl42v5qcmcvdupzxssp5njp39edk42aw0n8pm7mgekzs6lq53kfe0fe3umyq9sjxkfxs0dwq9qyysgqcqpcxqrrss6dg584jsu2986j7wqawkmuxsfry55rztefaa65lsj66uxj9qvnykzvg2a66uzs5f3rvu3hsq9aqh28s86cmp2zf4f48ylrcgftlnhscqpycmug',
  });
  console.log('payInvoice Response:', invoice); 
};

//payInvoice();

const getNodeInfo = async ()=>{
  const nodeInfo = await client.node.getNodeInfo();
  console.log('getNodeInfo Response:', nodeInfo); 
}
//getNodeInfo();

const getPayment = async () => {
  const payment = await client.lightning.getPayment({
    payment_hash: '1a3fa83c4e25139f96bbf6e9f7dd6b4854a09d52144b01510d238599f1a6dc32',
  });
  console.log('getPayment Response:', payment); 
};

//getPayment();