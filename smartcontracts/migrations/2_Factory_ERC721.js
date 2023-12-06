const FactoryERC721 = artifacts.require("FactoryERC721");
const DataCellarToken = artifacts.require("DataCellarToken");

module.exports = function (deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(FactoryERC721, DataCellarToken.address);
};
