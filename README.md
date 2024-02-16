<a href="https://datacellarproject.eu/">
  <img src="./backend/img/logo/Logo.png" title="DATA CELLAR" height="40" align="right">
</a>

# DataCellar dApp Project - dApp Branch README

This dApp version of DataCellar was born from the integration of a stand-alone SSI (Self-sovereign identity) system, based on the use of MetaMask as a secure wallet, with the original backend made DataCellar project.

The previous release contained a set of reduced features to start presenting the architecture, through the use of docker containers for external services, and Blockchain-based logic through the implementation of specific smart contracts.

The key aspect of the simulation is to highlight the process of digitization of energy data and its exchange between users through the purchase of periodic and one-time licenses.

This repository is organized into three main sub-folders, each dedicated to a specific aspect of the project. 


## Table of Contents

- [DataCellar dApp Project](#datacellar-dapp-project)
  - [Table of Contents](#table-of-contents)
  - [Folder Overview](#folder-overview)
    - [1. BackendAPIs](#1-backendapis)
    - [2. Frontend](#2-frontend)
    - [3. SmartContracts](#3-smartcontracts)
  - [Requirements](#requirements)
    - [dApp Version](#dapp-version)
  - [Installation](#installation)
  - [MetaMask Setup](#metamask-setup)
    - [Add Ganache Network](#add-ganache-network)
    - [Import accounts](#import-accounts)
  - [Contributions](#contributions)
  - [License](#license)


## Folder Overview
### 1. BackendAPIs

The `backendapis` folder contains the backend part of the DataCellar project. 
In the dApp (decentralized application) version of DataCellar, almost all of the APIs have been moved to the frontend, and in this section are left only: the functions to generate the access token, to be placed in the session cookie, and to generate the VC (verifiable credential), to be provided in order to sign in the dApp.
For detailed information on configuring the backend environment, please read the readme in the relevant folder: [BackendApis README](backendapis/README.md).

### 2. Frontend

The `frontend` folder encloses the frontend part of the DataCellar project. 
In this dApp (decentralized application) version of DataCellar, in addition to the user interface, this folder also encapsulates all the functions that enable communication with Smart Contracts via the MetaMask browser extension, which acts as a secure wallet for users' private keys.
For detailed information on configuring the fronted environment, please read the readme in the relevant folder: [Frontend README](frontend/README.md).

### 3. SmartContracts

The `smartcontracts` folder is dedicated to the blockchain part of the DataCellar project. Here, you will find the smart contracts and related resources for integrating blockchain functionality. If you are involved in blockchain development or smart contract deployment, refer to the [SmartContracts README](smartcontracts/README.md) for comprehensive information on setting up the blockchain environment, deploying smart contracts, and other blockchain-specific details.


## Requirements

System requirements:

- **Operating System**: Windows 10/11, Linux Ubuntu distribution 20.04/22.04 LTS. 
<span style="color: red;">It has not been tested on MacOS. It might work but we do not guarantee</span>;
- **Memory**: at least 4 GB of RAM;
- **Processor**: 64 bit, Intel Core i5 or more;

Software packages requirements:

<table>
  <tr style="background-color: lightgreen;">
    <td align="center">Packages</td>
    <td align="center">Installation guide</td>
  </tr>
  <tr>
    <td><b>NodeJS</b>: v18.17.*</td>
    <td rowspan="2" align="center">We suggest nvm (Node Version Manager)<p></p>[Windows](https://github.com/coreybutler/nvm-windows) | [Linux](https://gist.github.com/d2s/372b5943bce17b964a79)</td>
  </tr>
  <tr>
    <td><b>npm</b>: v9.6.*</td>
  </tr>
  <tr>
    <td><b>Docker</b>: v24</td>
    <td align="center">[Windows](https://docs.docker.com/desktop/install/windows-install/) | [Linux](https://docs.docker.com/engine/install/ubuntu/)</td>
  </tr>
  <tr>
    <td><b>docker-compose</b>: v2.21</td>
    <td align="center">[Linux](https://docs.docker.com/compose/install/linux/)</td>
  </tr>
  <tr>
    <td><b>git</b>: v2.41</td>
    <td align="center"> [Windows](https://git-scm.com/book/it/v2/Per-Iniziare-Installing-Git) | [Linux](https://git-scm.com/book/it/v2/Per-Iniziare-Installing-Git)</td>
  </tr>
</table>

The versions of the packages are those that are used to build the system and on which one is certain to function correctly. This doesn't exclude that older or later versions may work.

To verify the correct installation of all packages, write the following commands from the CLI:

```bash
$node --versions
v18.17.1
```
Repeat the same command for the other installed packages.

### dApp Version

This version of DataCellar relies on using MetaMask to be able to make transactions to the blockchain through user accounts. 

It is therefore necessary to install the browser extension via the link: [Download MetaMask](https://metamask.io/download/).

## Installation

The first thing is to clone the repository and change the current branch to "dApp" from the command line:

```bash
git clone https://github.com/smeneguz/DataCellar.git
cd DataCellar
git fetch
git checkout dApp
```

Now it is necessary to go to the "backendapis" folder and follow the instructions in the readme of that folder to be able to run the docker and the server.

The complete readme sequence you must follow in order to use this application is:

<p align="center">
<a href="backendapis/README.md">backendapis README</a><br>
  ↓<br>
  <a href="smartcontracts/README.md">smartcontracts README</a><br>
  ↓<br>
  <a href="frontend/README.md">frontend README</a>
</p>

After that you have to setup MetaMask for the usage with the blockchain Ganache running into the Docker. 

## MetaMask Setup

### Add Ganache Network

1. Open the MetaMask extension and click on the three dots at the top right.
2. Select "Settings" > "Networks" > "Add Network".
3. A browser page will open. Click on "Manually Add a Network" at the bottom.
4. Fill in the form fields with the following details:
   - "Network Name": "Ganache"
   - "RPC URL": "http://localhost:8545/"
   - "Chain ID": "1337"
   - "Currency Symbol": "ETH"
5. Click the "Save" button.
6. Back in the MetaMask extension, click on the network icon in the upper left corner.
7. Select "Show Network Dropdown" > "Ganache".

### Import accounts 

1. Open Docker Desktop.
2. Click on the "backend" container and then on "blockchain-DataCellar."
3. Go to the top of the transaction history on the blockchain until it is created.
4. Copy the private key of the account you want to import into MetaMask (not account 0).
5. Open the MetaMask extension.
6. Click on the name of the account in use at the top center.
7. Select "Add Account or Hardware Wallet" at the bottom.
8. Choose "Import Account."
9. Enter the private key copied earlier.
10. Press "Import."

## Contributions

- Author - [Luca Rota](https://it.linkedin.com/in/luca-rota-872036285), [Silvio Meneguzzo](https://www.linkedin.com/in/silvio-arras-meneguzzo-a29681127/), [Alessandro Mozzato](https://it.linkedin.com/in/alessandro-mozzato-32479420b?trk=people-guest_people_search-card), [Alfredo Favenza](https://www.linkedin.com/in/alfredofavenza/)
- Company - [Fondazione LINKS](https://linksfoundation.com/)

## License

The Data Cellar DLT Marketplace is [MIT licensed](LICENSE).
