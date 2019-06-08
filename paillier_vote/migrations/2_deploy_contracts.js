const VoteContract = artifacts.require("./Paillier_vote.sol");

module.exports = function(deployer) {
  deployer.deploy(VoteContract);
};
