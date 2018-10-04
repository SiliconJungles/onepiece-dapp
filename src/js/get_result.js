require('isomorphic-fetch');

const { Zilliqa } = require('zilliqa-js');
const fs = require('fs');
const argv = require('yargs').argv;
const colors = require('colors');

const url = 'http://localhost:4200';

const zilliqa = new Zilliqa({
  nodeUrl: url,
});


if (!argv.address) {
  console.log('Address is required');
  process.exit(0);
}

const address = argv.address;

console.log('Zilliqa Testing Script'.bold.cyan);
const node = zilliqa.getNode();

node.getSmartContractState({ address }, (err, data) => {
  if (err || (data.result && data.result.Error)) {
    console.log(err);
  } else {
    console.log(JSON.stringify(data));
  }
});
