# DataCellar dApp Project

This dApp version of DataCellar was born from the integration of a stand-alone SSI (Self-sovereign identity) system, based on the use of MetaMask as a secure wallet, with the DataCellar project itself.

This repository is organized into three main sub-folders, each dedicated to a specific aspect of the project. 

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

## Contributions

- Author - [Luca Rota](https://it.linkedin.com/in/luca-rota-872036285), [Alessandro Mozzato](https://it.linkedin.com/in/alessandro-mozzato-32479420b?trk=people-guest_people_search-card), [Silvio Meneguzzo](https://www.linkedin.com/in/silvio-arras-meneguzzo-a29681127/), [Alfredo Favenza](https://www.linkedin.com/in/alfredofavenza/)
- Company - [Fondazione LINKS](https://linksfoundation.com/)

## License

The Data Cellar DLT Marketplace is [MIT licensed](LICENSE).
