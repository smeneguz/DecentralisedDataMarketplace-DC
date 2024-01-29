# DLT Data Marketplace: Backend

The following are the features offered by the backend in the dApp version of DataCellar:

- Verification of the user's signature and generation of an access token (which will be placed in the session cookie to verify user authentication)
- Generation of a VC (verifiable credential) demonstrating the sign up to DataCellar ​(the user must provide it in order to access the dApp)

Here are the external services used through docker containers:

- Ganache: Simulated Blockchain;


## Table of Contents

- [DLT Data Marketplace: Backend](#dlt-data-marketplace-backend)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
    - [Folder Structure](#folder-structure)
    - [Environment variables](#environment-variables)
    - [Blockchain Infrastructure](#blockchain-infrastructure)
  - [Libraries Used](#libraries-used)


## Installation

Navigate to the "backendapis" folder and install all needed dependencies:

```bash
cd backendapis
npm install
```

Download and enable all the container through Docker

```bash
$docker compose up -d
```
To verify that containers have indeed been made available on your local machine, run the command

```bash
$docker ps

CONTAINER ID   IMAGE                              COMMAND                  CREATED         STATUS         PORTS                    NAMES
ef8e2ac51e4b   trufflesuite/ganache-cli:v6.12.2   "node /app/ganache-c…"   5 seconds ago   Up 3 seconds   0.0.0.0:8545->8545/tcp   blockchain-DataCellar
```
We are shown the list of services available locally within docker containers. In particular, we have 1 services:

- **Ganache**: an Ethereum-based private blockchain simulation listening on local port 8545;

Once this is done, start the server listening on port 3001:

```bash
npm start run

[Nest] 3708  - 27/01/2024, 18:13:29     LOG [NestFactory] Starting Nest application...
[Nest] 3708  - 27/01/2024, 18:13:29     LOG [InstanceLoader] JwtModule dependencies initialized +16ms
[Nest] 3708  - 27/01/2024, 18:13:29     LOG [InstanceLoader] AppModule dependencies initialized +1ms
[Nest] 3708  - 27/01/2024, 18:13:29     LOG [InstanceLoader] AuthModule dependencies initialized +1ms
[Nest] 3708  - 27/01/2024, 18:13:29     LOG [RoutesResolver] AppController {/}: +70ms
[Nest] 3708  - 27/01/2024, 18:13:29     LOG [RoutesResolver] AuthController {/auth}: +1ms
[Nest] 3708  - 27/01/2024, 18:13:29     LOG [RouterExplorer] Mapped {/auth/signin, POST} route +7ms
[Nest] 3708  - 27/01/2024, 18:13:29     LOG [RouterExplorer] Mapped {/auth/signup, POST} route +1ms
[Nest] 3708  - 27/01/2024, 18:13:29     LOG [NestApplication] Nest application successfully started +4ms
```

Now it is necessary to go to the "smartcontracts" folder and follow the instructions in the readme of that folder to be able to deploy the smart contracts to the blockchain.


## Project Structure

Here we can find listed information about the project structure and organization of the architecture.

### Folder Structure

    .
    ├── dist                      # Compiled files
    ├── logs                      # Error logs generated
    ├── img                       # Images for README documentation
    └── src                       # Source files
        ├── auth                  # Authentication functionality
        ├── middleware            # Middleware to enable logger
        └──[...]
    ├── .env                      # Environment file
    ├── docker-compose.yml        # Enable services through docker
    ├── Dockerfile                # Creation of project image (to be tested)
    └── README.md

It is important to remember that the backend has been developed using nestJS, so we will find all the files defining the routes (i.e. modules) and services inside the src/ folder and the compiled files in the dist/ folder.

### Environment variables

- `JWT_SECRET`: secret string to generate JWT to protect endpoint
- `OWN_ADDRESS`: Public address of the admin (and owner) of Data Cellar
- `PRIV_KEY`: Private Key of the admin

### Blockchain Infrastructure

Blockchain infrastructure is composed by following components:

- **Blockchain network**: For this prototype, we do not have a real Blockchain network, but rather a component that simulates its real behaviour: [Ganache](https://trufflesuite.com/ganache/). In fact, it is a private blockchain based on Ethereum. It proves to be the best choice for developing a data marketplace that needs to enable the digitisation of data through specific logic (smart contracts).
- **Smart contract**: It is the logic built on the Blockchain infrastructure made available. Smart contracts are written in Solidity and enable data digitisation and the exchange of resources through particular tokenomics. For further explanation follow this [link](https://github.com/smeneguz/DataCellar/tree/dApp/smartcontracts).


## Libraries Used

Features provided by the libraries used in the backend:

- **@nestjs/common and @nestjs/core**: NestJS framework providing a structure for developing Node.js-based back-end applications, offering modularity, dependency injection, and ease of testing.
- **@nestjs/jwt**: NestJS module for managing and creating JSON Web Tokens (JWT), commonly used for authentication and authorization in web applications.    
- **did-jwt-vc**: Library for creating and verifying JSON Web Tokens (JWT) for Verifiable Credentials (VC) in the context of decentralized identity (DID).
- **dotenv**: Loads environment variables from a .env file in your project, simplifying the management of application configurations.
- **eth-sig-util**: Provides methods for signing and verifying Ethereum messages using private and public keys.
- **ethereumjs-util**: A utility library for common operations on Ethereum data, including address conversion, key manipulation, and more.
- **ethers**: A comprehensive JavaScript library for interacting with the Ethereum blockchain, providing APIs for key management, transaction creation, and more.
- **ethr-did**: Implementation of a Decentralized Identifier (DID) based on Ethereum, offering functionalities for creating and managing decentralized identities.
- **ganache-cli**: Local emulator for the Ethereum blockchain that simplifies the development and testing of smart contracts without the need for a real Ethereum network.