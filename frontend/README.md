# DLT Data Marketplace: Frontend

The dApp (decentralized application) version of DataCellar is based on using MetaMask, as a secure wallet, to be able to sign transactions to smart contracts, using users' private keys, without them ever having to provide them explicitly and without the application saving any data and/or having a database, being precisely decentralized.

The following are all the features offered by the frontend, through functions, which invoke APIs, to interact with smart contracts, which reside in the blockchain, through the use of MetaMask:

- **SSI functionalities**:
  - Connection to DataCellar (log in as visitor)
  - Registration to DataCellar (sign up as a member)
  - Authentication in DataCellar (sign in as a member)
  - Delete your DataCellar account
  
- **Visitor functionalities**:
  - View all datasets available in DataCellar
  - View all available licenses for each dataset

- **Member functionalities**: 
  - View the balance of ETH and DataCellar tokens 
  - Convert ETH to DataCellar tokens
  - Add new datasets in DataCellar 
  - Create new licenses, single-use or periodic, for your datasets
  - View, edit and delete your own datasets 
  - View, edit, and delete your own licenses 
  - Buy licenses for datasets added by other users
  - View purchased licenses and reference datasets
  - Consume purchased licenses


## Table of Contents

- [DLT Data Marketplace: Frontend](#dlt-data-marketplace-frontend)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
    - [Folder Structure](#folder-structure)
    - [React Components](#react-components)
    - [Hooks functions](#hooks-functions)
  - [Libraries Used](#libraries-used)


## Installation

Navigate to the "frontend" folder and install all needed dependencies:

```bash
cd frontend
npm install
```

Once this is done, start the react app listening on port 3000:

```bash
npm start

Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.56.1:3000

Compiled successfully!
```

Now you can navigate to [localhost:3000](http://localhost:3000) and use the dApp. 


## Project Structure

Here we can find listed information about the project structure and organization of the architecture.

### Folder Structure

    .
    ├── public                    # React default folder
    └── src                       # Source files
        ├── assets                # Images, SVGs and videos 
        ├── components            # All react components of the dApp
        ├── contract              # ABIs of the contract used 
        ├── hooks                 # Application functionality and APIs 
        ├── App.js                # Index file of the react dApp
        ├── App.css               # Style of the whole application
        └──[...]
    └── README.md

It is important to remember that the project has been developed using React, Javascript and Bootstrap.

### React Components 

    .
    └── components                        # All react components of the dApp
        ├── Login.js                      # Login page to connect as visitor
        ├── MarketDatasets.js             # Homepage to view all dataset available 
        ├── MarketLicense.js              # Page to view all license available of a dataset
        ├── ModalDeleteDataset.js         # Modal to confirm the elimination of a dataset
        ├── ModalDeleteLicense.js         # Modal to confirm the elimination of a license
        ├── ModalDeleteUser.js            # Modal to confirm the elimination of a DataCellar account 
        ├── ModalLogin.js                 # Modal to view information about the login
        ├── ModalLogout.js                # Modal to confirm the logout 
        ├── ModalPurchase.js              # Modal to confirm the purchase of license
        ├── ModalSignin.js                # Modal to view information about the sign in
        ├── ModalSignup.js                # Modal to view information about the sign up    
        ├── ModalSignupConfirm.js         # Modal to confirm the sign up 
        ├── ModalUpdateDataset.js         # Modal to update a dataset
        ├── ModalUpdateLicense.js         # modal to update a license
        ├── ModalVc.js                    # Modal to download the DataCellar VC 
        ├── Navbar.js                     # Application navbar 
        ├── Profile.js                    # Profile page for member user 
        ├── ProfileBalance.js             # Profile sub-page to view balances  
        ├── ProfileCreateDataset.js       # Profile sub-page to create a new dataset
        ├── ProfileCreateLicense.js       # Profile sub-page to create a new license
        ├── ProfileCreateNew.js           # Profile sub-page to include the two previous pages
        ├── ProfileDatasets.js            # Profile sub-page to view all your datasets
        ├── ProfileDelete.js              # Profile sub-page to delete your DataCellar account
        ├── ProfileInfo.js                # Profile sub-page to view member user information from the session cookie
        ├── ProfileLicenses.js            # Profile sub-page to view all your licenses
        ├── ProfilePurchasedDataset.js    # Profile sub-page to view the datasets for which you have purchased licenses
        ├── ProfilePurchasedLicense.js    # Profile sub-page to view purchased licenses 
        ├── Signin.js                     # Sign in page to be authenticated as member 
        ├── Signup.js                     # Sign up page to register as member 
        └──[...]

### Hooks functions

    .
    └── hooks                             # Application's functionality and APIs 
        ├── API.js                        # APIs to the backend's functionality
        ├── useMetaMask.js                # Interaction to smart contracts through MetaMask for SSI 
        ├── useMMbalance.js               # Interaction to smart contracts through MetaMask for balance
        ├── useMMdataset.js               # Interaction to smart contracts through MetaMask for dataset
        ├── usedMMlicense.js              # Interaction to smart contracts through MetaMask for license
        ├── useMMmarket.js                # Interaction to smart contracts through MetaMask for market
        ├── useMMpurchased.js             # Interaction to smart contracts through MetaMask for purchased
        ├── utils.js                      # Functions utils in several components  
        ├── web3.core.js                  # Web3 initialization to contact the blockchain
        └──[...]


## Libraries Used

Features provided by the libraries used in the frontend:

- **react**: A JavaScript library for building user interfaces, commonly used for creating interactive and dynamic web applications.
- **react-scripts**: Scripts and configuration used by Create React App for building and running React applications.
- **react-dom**: The entry point for React on the web, facilitating the rendering of React components into the DOM.
- **bootstrap**: A popular CSS framework that simplifies the design and styling of web applications, offering pre-built components and a responsive grid system.
- **react-bootstrap**: Bootstrap components re-implemented for React, offering pre-built UI elements for building responsive web applications.
- **react-country-region-selector**: A React component for selecting countries and regions, providing a user-friendly interface for such selections.
- **react-router-dom**: A library for adding navigation and routing functionality to React applications, enabling the creation of single-page applications.
- **@metamask/detect-provider**: A utility library for detecting the presence of the MetaMask wallet provider in a web browser.
- **did-jwt-vc**: Library for creating and verifying JSON Web Tokens (JWT) for Verifiable Credentials (VC) in a decentralized identity (DID) context.
- **ethers**: A comprehensive JavaScript library for interacting with the Ethereum blockchain, providing APIs for key management, transaction creation, and more.
- **ethr-did-resolver**: Resolver library for Ethr-DID, providing functionality for resolving Ethereum-based Decentralized Identifiers.
- **did-resolver**: Resolver library for Decentralized Identifiers (DIDs), providing a standard interface for resolving DIDs to associated documents.network.
- **jwt-decode**: A library for decoding JSON Web Tokens (JWT) in JavaScript, commonly used for extracting information from JWT payloads.
- **web3**: A JavaScript library for interacting with the Ethereum blockchain, facilitating the development of decentralized applications (DApps) by enabling communication with the Ethereum network.