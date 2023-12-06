# Data Cellar Marketplace

Here a first version of Marketplace of European project Data Cellar.

## Requisites

- **Node.js**: Be sure to have installed Node.js on you system. You can install it from [NodeJS](nodejs.org) following the instructions for installation. The suggested version is: x.x.x (to be defined)

- **Package Manager**: Along with node also installs the associated packet manager npm. You can verify the correct installation via the command **npm -v**. The suggested version is the one associated and compatible with your NodeJS version.

- **Configured Blockchain**: You need to run a Blockchain before follow the instructions for this repository. Go to this [folder](https://gitlab.com/data-cellar/smartcontracts) and follow README and after turn back here to continue the guide.

## Getting Started

First, clone the repository in local:

```bash
git clone https://gitlab.com/FutureCitiesCommunities/Blockchain/data-cellar/marketplace.git
```

Take attention the repository is private and so you need specfic allowances to clone the repo and modify some stuff!
In case you are not able to clone send an email to the owner of the repository: **alessandro.mozzato@linksfoundation.com**.
After that you can start installing all modules associated to the project (you should run the command inside the repo path):

```bash
npm install
```

Now you are able to run the application (in development mode) through this command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the home page.
