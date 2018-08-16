let { Zilliqa } = require('zilliqa-js');
let fs = require('fs');
let argv = require('yargs').argv;
let colors = require('colors');
let url = 'http://localhost:4200'

let zilliqa = new Zilliqa({
  nodeUrl: url
})

let address;

if (argv.address) {
  address = argv.address;
  console.log(`Your Address: ${address} \n`);
} else {
  console.log('Address is required');
  process.exit(0);
}

console.log('Zilliqa Testing Script'.bold.cyan);
let node = zilliqa.getNode();

node.getSmartContractState({ address: address }, function (err, data) {
  if (err || (data.result && data.result.Error)) {
    console.log(err)
  } else {
    console.log(JSON.stringify(data))
  }
})

let haha = zilliqa.util.getAddressFromPrivateKey("72a3304ea5433b123024516900e5a6bb484d590f138e7767b7eaf3c2fa550f52");
console.log(haha.toString('hex'));

node.getBalance({ address: "cba96b1a6daf18727ffeafc26124e9073bb01f1c" }, function (err, data) {
  if (err || (data.result && data.result.Error)) {
    console.log(err)
  } else {
    console.log(JSON.stringify(data))
  }
})
