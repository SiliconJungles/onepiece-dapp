# One Piece Election

This is a small DApp written by Scilla and can able to run on Zilliqa.

## Screenshot

![Home Page](App-Screen.png)

## How to run

### Install dependencies

- Run `npm install` or `yarn install` for both root and `client` directories.

- The project requires `Scilla-Runner` to compiling smart contract, so please follow the guide from [Kaya](https://github.com/Zilliqa/kaya#compiling-scilla) repository.

### Deploy the contract to Kaya - RPC Server

- Start Kaya from root directory

```
npm start
```

- You will see 10 fake ZIL accounts

```
Zilliqa kaya Server (ver: 0.0.1)

Available Accounts
=============================
(0) 2392675968222e10410634981f9c957afa162000 (Amt: 100000) (Nonce: 0)
(1) 3497bc187c27ebf52352cc6346fbd52718ff879a (Amt: 100000) (Nonce: 0)
(2) 6d1eac78cbdf052e8fb44fd8f4c98a7b10625ed8 (Amt: 100000) (Nonce: 0)
(3) 3986c1a1a05fa821e385e88494db873506f9c5b4 (Amt: 100000) (Nonce: 0)
(4) 65cc7415ef8513d2d3e0300f115123264e3a7580 (Amt: 100000) (Nonce: 0)
(5) d20d3a5bb8b5e902e9ec8567419390dfb500ae21 (Amt: 100000) (Nonce: 0)
(6) a0e3c7f5e77cdf58f01091464f9487a372943e1d (Amt: 100000) (Nonce: 0)
(7) 0442c36b521e249d324b1da24870cc9900012ba4 (Amt: 100000) (Nonce: 0)
(8) 047f3fe803af9d406e479b4eec6629386fee5f51 (Amt: 100000) (Nonce: 0)
(9) ce6550c33c667481c6f7b7424a7996aaa36b6256 (Amt: 100000) (Nonce: 0)

 Private Keys
=============================
(0) 33174fa13b7af445d04e116d0905c4627b6ab1fa771eef6527b5b06f7930d1cf
(1) 4e833710c6de2ffca449c111ee3ab6819d2887457f0f89c4107f7e15f7c9d1c1
(2) 3c0badf056e7c07f957b7fb77af7c86ef774dd8084eab1dda64ad5f9d22cdc8e
(3) 0a68008d87a1cac30290c0e6a80a9d693aefa66b4a8108bc0e01906c3203ed08
(4) c5a54d7db1099ff9672e93e00def3e8c6c350bf1fc81ab55a1cc17a64b99139a
(5) 8a3940c4c11f3002882f9b6a820dc6aa57ac530320b82519d55bc3aa0c0d0533
(6) 73e7a6a09dd2631ca1040f395e44923c1b423c0577141e526b53acaebeee267d
(7) 6ba86dfa87ce057b264f978bb5e1105e6d463fea24b903683defaf2ab8ba3217
(8) eaa869314662fb03606f26f411a56ecbe62fec51368bafff6e7eb010464eff4e
(9) 4ef30435a6b3ec58ba5c13a98f800e57f660699c2183580bd20829a39cad8bc3

Server listening on 127.0.0.1:4200
```

- From 10 accounts above, we will pick the first account to deploy the smart contract and run the transition to init candidates.

The first account is this case is: 

```
Account key: 2392675968222e10410634981f9c957afa162000

Private key: 33174fa13b7af445d04e116d0905c4627b6ab1fa771eef6527b5b06f7930d1cf
```

Open the `message.json` file in `template` directory and copy the value of account key to `_sender` attribute

```
  "_tag": "initCandidates",
  "_amount": "100",
  "_sender": "0x2392675968222e10410634981f9c957afa162000",
```

And then open another terminal console, and run this command to deploy election smart contract.

```
node src/js/deploy_election.js --key 33174fa13b7af445d04e116d0905c4627b6ab1fa771eef6527b5b06f7930d1cf
```

Back to the first terminal console, you will see the *Contract Address*

```
Contract Address Deployed: 1cee26bde67f44f82a250c4dbbc594a0a6a4e790
```

## Usage

- Go to `client` directory, create a new `.env` file

```
cp .env.sample .env
```

And then set the *Contract Address* value for `REACT_APP_SMART_CONTRACT_ADDRESS` environment variable.


```
# .env

REACT_APP_SMART_CONTRACT_ADDRESS="dd08f7888e538b1df1abe34bde5b1cdb71a27805"
REACT_APP_KAYA_RPC_SERVER="http://localhost:4200"
```

- Start the client server from `client` directory

```
yarn start
```

- Tada, now you will see a list of candidates.

### Let's vote for the candidate

- Copy fake account's private addresses to `Your Private Key` input field and then click to VOTE button for the candidate you want to vote. Voila! It works!

- Base on the election contract, one account can only vote once.

## Note

- This project is forked from [Kaya](https://github.com/Zilliqa/kaya) - Thanks Zilliqa team. Kaya is Zilliqa's RPC server for testing and development. 

- We wrote a smart contract using [Scilla](https://github.com/Zilliqa/scilla). Scilla is a Smart Contract Intermediate Level Language.

- The client app for DApp written by ReactJS.
