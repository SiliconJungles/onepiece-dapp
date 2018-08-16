let { Zilliqa } = require('zilliqa-js');
let url = 'http://localhost:4200'
let fs = require('fs');
let argv = require('yargs').argv;
let colors = require('colors');

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

if (!argv.to) {
  console.log('To address required');
  process.exit(0);
}

address = zilliqa.util.getAddressFromPrivateKey(privateKey);

let node = zilliqa.getNode();
console.log(`Address: ${address}`);

function callback(err, data) {
  if (err || data.error) {
    console.log(err);
  } else {
    console.log(data);
  }
}

console.log('Zilliqa Testing Script'.bold.cyan);
console.log(`Connected to ${url}`);

/* Contract specific Parameters */

// the immutable initialisation variables
let msg = {
  "_tag": "castVote",
  "_amount": "100",
  "_sender": "0x1234567890123456789012345678901234567890",
  "params": [
    {
      "vname": "name",
      "type": "String",
      "value": "Donquixote Doflamingo"
    }
  ]
};

// transaction details
let txnDetails = {
  version: 0,
  nonce: 1, // increment by 1 from the last transaction's nonce
  to: argv.to,
  amount: 0,
  gasPrice: 1,
  gasLimit: 10,
  data: JSON.stringify(msg).replace(/\\"/g, '"')
};

// sign the transaction using util methods
let txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);
console.log(txn);

// send the transaction to the node
node.createTransaction(txn, callback);


