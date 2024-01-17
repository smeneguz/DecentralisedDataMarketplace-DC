const DataCellarToken = artifacts.require("DataCellarToken");

module.exports = async function (deployer) {
  // Use deployer to state migration tasks.
  await deployer.deploy(
    DataCellarToken,
    "0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc"
  );

  const dataCellarTokenInstance = await DataCellarToken.deployed();

  console.log("DataCellarRegistry contract deployed at:", dataCellarTokenInstance.address);


};
