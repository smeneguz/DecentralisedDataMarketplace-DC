const DataCellarToken = artifacts.require("DataCellarToken");
const ManagementPayment = artifacts.require("ManagementPayment");

module.exports = function (deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(ManagementPayment, DataCellarToken.address);
};