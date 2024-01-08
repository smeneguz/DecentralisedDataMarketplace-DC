const FactoryERC721 = artifacts.require("FactoryERC721");
const ManagementPayment = artifacts.require("ManagementPayment");
const ERC721template = artifacts.require("ERC721template");
const ERC20template = artifacts.require("ERC20template");

module.exports = function (deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(FactoryERC721, ManagementPayment.address, ERC721template.address, ERC20template.address);
};
