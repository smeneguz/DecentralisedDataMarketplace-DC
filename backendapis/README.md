<a href="https://datacellarproject.eu/">
  <img src="./img/logo/Logo.png" title="DATA CELLAR" height="60" align="right">
</a>

# DLT Data Marketplace

First prototype release of Data Marketplace based on DLT technology.
In this release, only a few reduced functionalities will be present in order to begin presenting the (partial) proposed architecture, through the use of docker containers for external services, and the logic based on Blockchain through the implementation of specific smart contracts.
The key aspect of the simulation will be the highlighting of the digitization of energy data and their exchange between users through the purchase of period and one-time licenses.

The following are the features offered by the backend in the dApp version of DataCellar:

- Verification of the user's signature and generation of an access token (which will be placed in the session cookie to verify user authentication)
- Generation of a VC (verifiable credential) demonstrating the sign up to DataCellar ​(the user must provide it in order to access the dApp)

Here are the external services used through docker containers:

- Ganache: Simulated Blockchain;

## Table of Contents

- [DLT Data Marketplace](#dlt-data-marketplace)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Project Structure](#project-structure)
    - [Folder Structure](#folder-structure)
    - [Environment variables](#environment-variables)
    - [Blockchain Infrastructure](#blockchain-infrastructure)

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

## Installation

The first thing is to clone the repository and change the current branch to "dApp" from the command line:

```bash
git clone https://github.com/smeneguz/DataCellar.git
cd DataCellar
git fetch
git checkout dApp
```

Now you have to go to the "backendapis" folder and install all needed dependencies

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

It is important to remember that the project has been developed using nestJS, so we will find all the files defining the routes (i.e. modules) and services inside the src/ folder and the compiled files in the dist/ folder.

### Environment variables

- `JWT_SECRET`: secret string to generate JWT to protect endpoint
- `OWN_ADDRESS`: Public address of the admin (and owner) of Data Cellar
- `PRIV_KEY`: Private Key of the admin

### Blockchain Infrastructure

Blockchain infrastructure is composed by following components:

- **Blockchain network**: For this prototype, we do not have a real Blockchain network, but rather a component that simulates its real behaviour: [Ganache](https://trufflesuite.com/ganache/). In fact, it is a private blockchain based on Ethereum. It proves to be the best choice for developing a data marketplace that needs to enable the digitisation of data through specific logic (smart contracts).
- **Smart contract**: It is the logic built on the Blockchain infrastructure made available. Smart contracts are written in Solidity and enable data digitisation and the exchange of resources through particular tokenomics. For further explanation follow this [link](https://github.com/smeneguz/DataCellar/tree/dApp/smartcontracts).