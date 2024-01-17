const EthereumDIDRegistry = artifacts.require("EthereumDIDRegistry");

module.exports = async function (deployer, accounts) {
  try {

    await deployer.deploy(EthereumDIDRegistry, accounts[0]); 

    const EthereumDIDRegistryInstance = await EthereumDIDRegistry.deployed();

    console.log("EthereumDIDRegistry contract deployed at:", EthereumDIDRegistryInstance.address);
  } catch (error) {
    console.error("Error deploying the contract:", error);
  }
};