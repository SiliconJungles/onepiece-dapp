/**
 This file is part of kaya.
  Copyright (c) 2018 - present Zilliqa Research Pvt. Ltd.
  
  kaya is free software: you can redistribute it and/or modify it under the
  terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.
 
  kaya is distributed in the hope that it will be useful, but WITHOUT ANY
  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
  A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 
  You should have received a copy of the GNU General Public License along with
  kaya.  If not, see <http://www.gnu.org/licenses/>.
**/

const fs = require('fs');
const path = require('path');
const zilliqa_util = require('../../lib/util')
const utilities = require('../../utilities');
let colors = require('colors');

// debug usage: DEBUG=scilla-txn node server.js
const debug_txn = require('debug')('kaya:scilla');
let blockchain_path = 'tmp/blockchain.json'


function pad(number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

Date.prototype.YYYYMMDDHHMMSS = function () {
  var yyyy = this.getFullYear().toString();
  var MM = pad(this.getMonth() + 1, 2);
  var dd = pad(this.getDate(), 2);
  var hh = pad(this.getHours(), 2);
  var mm = pad(this.getMinutes(), 2)
  var ss = pad(this.getSeconds(), 2)

  return yyyy + MM + dd + hh + mm + ss;
};

function makeBlockchainJson(val) {
  bc_data = [
    {
      "vname": "BLOCKNUMBER",
      "type": "BNum",
      "value": `${val}`
    }
  ];
  fs.writeFileSync(blockchain_path, JSON.stringify(bc_data));
  debug_txn(`blockchain.json file prepared for blocknumber: ${val}`);
}

module.exports = {

  executeScillaRun: (payload, contractAddr, dir, currentBnum) => {
    //dump blocknum into a json file
    makeBlockchainJson(currentBnum);

    var msg_path, state_path, code_path, init_path;
    // Cleaning code before parsing to scilla-runner
    if (payload.code && payload.to == '0000000000000000000000000000000000000000') {
      // initialized with standard message template
      init_path = `${dir}${contractAddr}_init.json`;
      code_path = `${dir}${contractAddr}_code.scilla`;
      debug_txn('Code Deployment');
      rawCode = JSON.stringify(payload.code);
      cleanedCode = utilities.codeCleanup(rawCode);
      fs.writeFileSync(code_path, cleanedCode);

      msg_path = 'template/message.json';
      state_path = 'template/state.json';

      // get init data from payload
      let initParams = JSON.stringify(payload.data);
      cleaned_params = utilities.paramsCleanup(initParams);
      fs.writeFileSync(`${dir}${contractAddr}_init.json`, cleaned_params);

    } else {
      debug_txn('Processing Contract Transition');
      // todo: check for contract
      contractAddr = payload.to;

      init_path = `${dir}${contractAddr}_init.json`;
      code_path = `${dir}${contractAddr}_code.scilla`;
      state_path = `${dir}${contractAddr}_state.json`;


      debug_txn(`Code Path: ${code_path}`);
      debug_txn(`Init Path: ${init_path}`);
      if (!fs.existsSync(code_path) || !fs.existsSync(init_path)) {
        // tocheck what is the expected behavior on jsonrpc
        debug_txn('Error, contract has not been created.')
        throw 'Contract has not been deployed.';
      }

      // get message from payload information
      debug_txn('Payload Received %O', payload.data);
      let incomingMessage = JSON.stringify(payload.data);
      cleaned_msg = utilities.paramsCleanup(incomingMessage);
      fs.writeFileSync(`${dir}${payload.to}_message.json`, cleaned_msg);
      msg_path = `${dir}${payload.to}_message.json`;

    }


    if (!fs.existsSync(code_path) || !fs.existsSync(init_path)) {
      // tocheck what is the expected behavior on jsonrpc
      debug_txn('Error, contract has not been created.')
      throw 'Contract has not been deployed.';
    }


    // Run Scilla Interpreter
    const exec = require('child_process').execSync;
    let scilla_cmd = `./components/scilla/scilla-runner -init ${init_path} -i ${code_path} -iblockchain ${blockchain_path} -o tmp/${contractAddr}_out.json -imessage ${msg_path} -istate ${state_path}`;
    const child = exec(scilla_cmd,
      (error, stdout, stderr) => {
        if (error !== null) {
          console.warn(`exec error: ${error}`);
          throw new Error(`Unable to run scilla. Error: ${error}`);
        }
      });
    debug_txn('Scilla run completed. Performing state changes now');

    // Extract state from tmp/out.json
    var retMsg = JSON.parse(fs.readFileSync(`tmp/${contractAddr}_out.json`, 'utf-8'));
    fs.writeFileSync(`${dir}${contractAddr}_state.json`, JSON.stringify(retMsg.states));
    debug_txn(`State logged down in ${contractAddr}_state.json`)

    console.log(`Contract Address Deployed: ` + `${contractAddr}`.green);
    debug_txn(`Next address: ${(retMsg.message._recipient)}`);
    return retMsg.message._recipient;

  }
}