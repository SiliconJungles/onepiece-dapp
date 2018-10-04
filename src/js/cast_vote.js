require('isomorphic-fetch');

const { Zilliqa } = require('zilliqa-js');
const BN = require('bn.js');

const url = 'http://localhost:4200';
const argv = require('yargs').argv;
const colors = require('colors');

const zilliqa = new Zilliqa({
  nodeUrl: url,
});

// const privateKey, address;

if (!argv.key) {
  console.log('Private key is required');
  process.exit(0);
}

if (!argv.to) {
  console.log('To address required');
  process.exit(0);
}

const privateKey = argv.key;

const address = zilliqa.util.getAddressFromPrivateKey(privateKey);

const node = zilliqa.getNode();
console.log(`Address: ${address}`);

const callback = (err, data) => {
  if (err || data.error) {
    console.log(err);
  } else {
    console.log(data);
  }
};

console.log('Zilliqa Testing Script'.bold.cyan);
console.log(`Connected to ${url}`);

node.getBalance({ address }, (err, data) => {
  if (err || data.error) {
    console.log('Error');
  } else {
    const { nonce } = data.result;

    const newNonce = nonce + 1;

    const msg = {
      _tag: 'castVote',
      _amount: '0',
      _sender: `0x${address}`,
      params: [
        {
          vname: 'name',
          type: 'String',
          value: 'Donquixote Doflamingo',
        },
      ],
    };


    // transaction details
    const txnDetails = {
      version: 0,
      nonce: newNonce,
      to: argv.to,
      amount: new BN(0),
      gasPrice: 1,
      gasLimit: 2000,
      data: JSON.stringify(msg).replace(/\\"/g, '"'),
    };

    // sign the transaction using util methods
    const txn = zilliqa.util.createTransactionJson(privateKey, txnDetails);
    console.log(txn);

    // send the transaction to the node
    node.createTransaction(txn, callback);
  }
});
