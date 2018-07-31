let { Zilliqa } = require('zilliqa-js');
let url = 'http://localhost:4200'
let fs = require('fs');
let argv = require('yargs').argv;
let colors = require('colors');

let zilliqa = new Zilliqa({
    nodeUrl: url
})

let privateKey, address;

// User supplies the private key through `--key`
if (argv.key) {
    privateKey = argv.key;
    console.log(`Your Private Key: ${privateKey} \n`);
} else {
    console.log('No private key given! Generating random privatekey.'.green);
    privateKey = zilliqa.util.generatePrivateKey();
    console.info(`Your Private Key: ${privateKey.toString('hex')}`);
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


/*
        MAIN LOGIC
*/



console.log('Zilliqa Testing Script'.bold.cyan);
console.log(`Connected to ${url}`);

/* Contract specific Parameters */

// the immutable initialisation variables
let msg = {
    "_tag": "setHello",
    "_amount": "0",
    "_sender" : "0x1234567890123456789012345678901234567890",
    "params": [
    {
        "vname" : "msg",
        "type" : "String",
        "value" : "Morning"
    }
    ]
};

// transaction details
let txnDetails = {
    version: 0,
    nonce: 3,
    to: argv.to ,
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

