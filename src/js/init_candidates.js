require('isomorphic-fetch');

const { Zilliqa } = require('zilliqa-js');
const BN = require('bn.js');

const url = 'http://localhost:4200';
const argv = require('yargs').argv;
const colors = require('colors');

const zilliqa = new Zilliqa({
  nodeUrl: url,
});

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
      _tag: 'initCandidates',
      _amount: '0',
      _sender: `0x${address}`,
      params: [
        {
          vname: 'candidates',
          type: 'Map (String) (Int32)',
          value: [
            {
              key: 'Monkey D. Luffy',
              val: '0',
            },
            {
              key: 'Pirate Hunter - Roronoa Zoro',
              val: '0',
            },
            {
              key: 'Dracule Mihawk',
              val: '0',
            },
            {
              key: 'Charlotte Katakuri',
              val: '0',
            },
            {
              key: 'Red Hair - Shanks',
              val: '0',
            },
            {
              key: 'Silvers Rayleigh',
              val: '0',
            },
            {
              key: 'Donquixote Doflamingo',
              val: '0',
            },
            {
              key: 'Monkey D. Garp',
              val: '0',
            },
            {
              key: 'Kaido',
              val: '0',
            },
          ],
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
