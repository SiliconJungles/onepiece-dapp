require('isomorphic-fetch');

const { Zilliqa } = require('zilliqa-js');
const BN = require('bn.js');

const fs = require('fs');
const argv = require('yargs').argv;
const colors = require('colors');

const url = 'http://localhost:4200';

const zilliqa = new Zilliqa({
  nodeUrl: url,
});

if (!argv.key) {
  console.log('Private key is required');
  process.exit(0);
}

const privateKey = argv.key;

const address = zilliqa.util.getAddressFromPrivateKey(privateKey);

const node = zilliqa.getNode();


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

const code = fs.readFileSync('contracts/Election.scilla', 'utf-8');

// "value": "0x1234567890123456789012345678901234567890"

const initParams = [
  {
    vname: 'owner',
    type: 'ByStr20',
    value: `0x${address}`,
  },
  {
    vname: '_creation_block',
    type: 'BNum',
    value: '1',
  },
];

// transaction details
const txnDetails = {
  version: 0,
  nonce: 1,
  to: '0000000000000000000000000000000000000000',
  amount: new BN(0),
  gasPrice: 1,
  gasLimit: 2000,
  code,
  data: JSON.stringify(initParams).replace(/\\"/g, '"'),
};

console.log(initParams);
// sign the transaction using util methods
const txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);

// send the transaction to the node
node.createTransaction(txn, callback);
