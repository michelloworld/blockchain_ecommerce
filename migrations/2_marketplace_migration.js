const Marketplace = artifacts.require("Marketplace");

module.exports = function(_deployer) {
  _deployer.deploy(Marketplace);
};