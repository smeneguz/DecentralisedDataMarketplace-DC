# SmartContracts

Here we find Smart Contracts implementation to enable transactions throguh Blockchain.

## Installation

### Getting started

Navigate to the "smartcontracts" folder and install all needed dependencies:

```bash
cd smartcontracts
npm install
```

If the installation of the packages is successful, the smart contracts can now be deployed on the blockchain (I am assuming that the blockchain is already instantiated and accessible at localhost:8545. In case you are following the installation guide from the backendAPIs repo, continue without worries)

```bash
npx truffle migrate
```

Now your smart contracts are deployed on the chain and you need to go to the "frontend" folder and follow the instructions in the readme of that folder to be able to use the dApp and contact smart contracts in the blockchain.