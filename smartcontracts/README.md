# SmartContracts

Here we find Smart Contracts implementation to enable transactions throguh Blockchain.

## Installation

### Getting started

First, clone the repository in local:

```bash
git clone https://gitlab.com/data-cellar/marketplace.git
```

Take attention the repository is private and so you need specfic allowances to clone the repo and modify some stuff!
In case you are not able to clone send an email to the owner of the repository: **alessandro.mozzato@linksfoundation.com**.
After that you can start installing all modules associated to the project (you should run the command inside the repo path):

```bash
npm install
```

If the installation of the packages is successful, the smart contracts can now be deployed on the blockchain (I am assuming that the blockchain is already instantiated and accessible at localhost:8545. In case you are following the installation guide from the backendAPIs repo, continue without worries)

```bash
npx truffle migrate
```

Now your smart contracts are deployed on the chain and you can start interact with them
