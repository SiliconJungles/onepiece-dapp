import { Zilliqa } from 'zilliqa-js'

export const zilliqa = new Zilliqa({
  nodeUrl: process.env.REACT_APP_KAYA_RPC_SERVER
})

export const zilliqaNode = zilliqa.getNode()

export const smartContractAddreses = process.env.REACT_APP_SMART_CONTRACT_ADDRESS
