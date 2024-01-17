const DataCellarRegistry = artifacts.require("DataCellarRegistry");

module.exports = async function (deployer, accounts) {
  try {

    await deployer.deploy(DataCellarRegistry, accounts[0]); 

    const dataCellarRegistryInstance = await DataCellarRegistry.deployed();

    console.log("DataCellarRegistry contract deployed at:", dataCellarRegistryInstance.address);
  } catch (error) {
    console.error("Error deploying the contract:", error);
  }
};