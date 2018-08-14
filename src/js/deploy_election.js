let { Zilliqa } = require('zilliqa-js');
let fs = require('fs');
let argv = require('yargs').argv;
let colors = require('colors');

let url = 'http://localhost:4200'
let zilliqa = new Zilliqa({
  nodeUrl: url
})

let privateKey, address;

if (argv.key) {
  privateKey = argv.key;
  console.log(`Your Private Key: ${privateKey} \n`);
} else {
  console.log('Private key is required');
  process.exit(0);
}

address = zilliqa.util.getAddressFromPrivateKey(privateKey);

let node = zilliqa.getNode();
console.log(`Address: ${address}`);

function callback(err, data) {
  if (err || data.error) {
    console.log('Error');
  } else {
    console.log(data);
  }
}

// Main Logic
console.log('Zilliqa Testing Script'.bold.cyan);
console.log(`Connected to ${url}`);

var code = fs.readFileSync('contracts/Election.scilla', 'utf-8');

let initParams = [
  {
    "vname": "owner",
    "type": "Address",
    "value": "0x1234567890123456789012345678901234567890"
  },
  {
    "vname": "_creation_block",
    "type": "BNum",
    "value": "1"
  },
];

// transaction details
let txnDetails = {
  version: 0,
  nonce: 1,
  to: '0000000000000000000000000000000000000000',
  amount: 0,
  gasPrice: 1,
  gasLimit: 50,
  code: code,
  data: JSON.stringify(initParams).replace(/\\"/g, '"')
};

console.log(initParams);
// sign the transaction using util methods
let txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);

// send the transaction to the node
node.createTransaction(txn, callback);

