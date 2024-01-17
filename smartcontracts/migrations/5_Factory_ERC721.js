const FactoryERC721 = artifacts.require("FactoryERC721");
const ManagementPayment = artifacts.require("ManagementPayment");
const ERC721template = artifacts.require("ERC721template");
const ERC20template = artifacts.require("ERC20template");

module.exports = async function (deployer) {
  // Use deployer to state migration tasks.
  await deployer.deploy(FactoryERC721, ManagementPayment.address, ERC721template.address, ERC20template.address);

  const FactoryERC721Instance = await FactoryERC721.deployed();

  console.log("DataCellarRegistry contract deployed at:", FactoryERC721Instance.address);



};
