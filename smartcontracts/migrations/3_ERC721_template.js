const ERC721template = artifacts.require("ERC721template");

module.exports = function (deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(ERC721template);
};