const ERC20template = artifacts.require("ERC20template");

module.exports = function (deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(ERC20template);
};