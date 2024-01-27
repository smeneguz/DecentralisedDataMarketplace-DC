# SmartContracts

Here we find Smart Contracts implementation to enable transactions throguh Blockchain.

## Installation

### Getting started

First, go to the "smart contracts" folder and install all necessary dependencies.

```bash
cd smartcontracts
npm install
```

If the installation of the packages is successful, the smart contracts can now be deployed on the blockchain (I am assuming that the blockchain is already instantiated and accessible at localhost:8545. In case you are following the installation guide from the backendAPIs repo, continue without worries)

```bash
npx truffle migrate
```

Now your smart contracts are deployed on the chain and you can start interact with them