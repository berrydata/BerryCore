/****Uncomment the body below to run this with Truffle migrate for truffle testing*/
var BerryTransfer = artifacts.require("./libraries/BerryTransfer.sol");
var BerryDispute = artifacts.require("./libraries/BerryDispute.sol");
var BerryStake = artifacts.require("./libraries/BerryStake.sol");
var BerryLibrary = artifacts.require("./libraries/BerryLibrary.sol");
var BerryGettersLibrary = artifacts.require("./libraries/BerryGettersLibrary.sol");
var OldBerry = artifacts.require("./oldContracts/OldBerry.sol");
var OldBerryTransfer = artifacts.require("./oldContracts/libraries/OldBerryTransfer.sol")
var OldBerryDispute = artifacts.require("./oldContracts/libraries/OldBerryDispute.sol")
var OldBerryLibrary = artifacts.require("./oldContracts/libraries/OldBerryLibrary.sol")
var Berry = artifacts.require("./Berry.sol");
var BerryMaster = artifacts.require("./BerryMaster.sol");
/****Uncomment the body to run this with Truffle migrate for truffle testing*/

/**
*@dev Use this for setting up contracts for testing 
*this will link the Factory and Berry Library

*These commands that need to be ran:
*truffle migrate --network rinkeby
*truffle exec scripts/Migrate_1.js --network rinkeby
*truffle exec scripts/Migrate_2.js --network rinkeby
*/
function sleep_s(secs) {
  secs = (+new Date) + secs * 1000;
  while ((+new Date) < secs);
}
/****Uncomment the body below to run this with Truffle migrate for truffle testing*/
// module.exports = function (deployer) {
//     deployer.deploy(BerryLibrary).then(() => {
//         deployer.deploy(Berry);
//     });
//     deployer.link(BerryLibrary, Berry);
// };

module.exports = async function (deployer) {

    //OLD DEPS
  await deployer.deploy(OldBerryTransfer);

  // deploy dispute
  await deployer.link(OldBerryTransfer,OldBerryDispute);
  await deployer.deploy(OldBerryDispute);

    // deploy stake
  await deployer.link(OldBerryTransfer,BerryStake);
  await deployer.link(OldBerryDispute,BerryStake);
  await deployer.deploy(BerryStake);

  // deploy getters lib
  await deployer.deploy(BerryGettersLibrary);

  // deploy lib
  await deployer.link(OldBerryDispute, OldBerryLibrary);
  await deployer.link(OldBerryTransfer, OldBerryLibrary);
  await deployer.link(BerryStake, OldBerryLibrary);
  await deployer.deploy(OldBerryLibrary);


  // deploy berry
  await deployer.link(OldBerryTransfer,OldBerry);
  await deployer.link(OldBerryDispute,OldBerry);
  await deployer.link(BerryStake,OldBerry);
  await deployer.link(OldBerryLibrary,OldBerry);
  await deployer.deploy(OldBerry);

  // deploy berry master
  await deployer.link(OldBerryTransfer,BerryMaster);
  await deployer.link(BerryGettersLibrary,BerryMaster);
    await deployer.link(BerryStake,BerryMaster);
  await deployer.deploy(OldBerry).then(async function() {
    await deployer.deploy(BerryMaster, OldBerry.address)
  });



  // deploy transfer
	await deployer.deploy(BerryTransfer);

  // deploy dispute
  await deployer.link(BerryTransfer,BerryDispute);
	await deployer.deploy(BerryDispute);

  // deploy stake
  await deployer.link(BerryTransfer,BerryStake);
  await deployer.link(BerryDispute,BerryStake);
	await deployer.deploy(BerryStake);


  // deploy lib
  await deployer.link(BerryDispute, BerryLibrary);
  await deployer.link(BerryTransfer, BerryLibrary);
  await deployer.link(BerryStake, BerryLibrary);
  await deployer.deploy(BerryLibrary);

  // deploy berry
  await deployer.link(BerryTransfer,Berry);
  await deployer.link(BerryDispute,Berry);
  await deployer.link(BerryStake,Berry);
  await deployer.link(BerryLibrary,Berry);
  await deployer.deploy(Berry);

  // deploy berry master
  // await deployer.link(BerryTransfer,BerryMaster);
  // await deployer.link(BerryGettersLibrary,BerryMaster);
  //   await deployer.link(BerryStake,BerryMaster);
  // await deployer.deploy(Berry).then(async function() {
  //   await deployer.deploy(BerryMaster, Berry.address)
  // });



};
/****Uncomment the body to run this with Truffle migrate for truffle testing*/