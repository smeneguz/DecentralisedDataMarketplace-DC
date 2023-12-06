# SmartContracts

Here we find Smart Contracts implementation to enable transactions throguh Blockchain.

## Getting started

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

### Run Ganache Blockchain

In this first release the application leverages on Ganache Blockchain.
Ganache is a development environment and testing tool for the Ethereum network. It allows developers to create and deploy smart contracts, simulate blockchain behavior, and test decentralized applications (dApps) in a local and controlled environment. Ganache provides a personal Ethereum blockchain that can be used for development purposes without the need for real Ether transactions. It offers features such as account management, transaction simulation, and contract deployment, making it easier for developers to build and test their blockchain applications.
You can find more information in documentation here: [Ganache](https://trufflesuite.com/docs/ganache/)

To run the chain let's go through following points:

- First command needs to create the environmente for the blockchain (it's important to use always the same seed: in this case "1234", but you can insert what you prefer, but you will need to change a bit the migration files):

```bash
npx ganache -s 1234
```

Now the chain is turned on and you should be able to visualize all the information on terminal console.

- Next we should upload Smart Contract on the chain thanks to truffle suite [Truffle](https://trufflesuite.com/):

```bash
npx truffle migrate
```

If everything is ok you should be able to visualize all the information related to the transactions performed to upload the smart contracts. DON'T close the window with this information because with some of them you need to fill the .env.example file.

### Fill .env.example file

As you can see you find a lot of different field:

- JWT_SECRET: you can insert what you prefer. It's something related to the jwt token to permit secure connection beetwen server and users;
- encryption_KEY: you can insert what you prefer. It's an encryption key used to encrypt private key of the user;
- factory_ADDRESS: you should insert the address of the **FactoryERC721** contract previously uploaded on the chain. You can find this information on the window of before;
- dct_ADDRESS: you should insert the address of the **DataCellarToken** contract previously uploades on the chain. You can find this information on the window of before;
- owner_ADDRESS: It represents the address of the contracts owner, the one who uploaded it on the chain. The address is the first one in the list showed after the command: "npx ganache";
- privateKEY: It represents the private key associated to the address owner. You should find it at the first row of the list appeared after the "npx ganache" command.

It's important to fill with the right information, altought you will no be able to run the application.
The content of this file should be copy and paste on the repo [Marketplace WEBAPP](https://gitlab.com/FutureCitiesCommunities/Blockchain/data-cellar/marketplace)
