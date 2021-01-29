/**
* Deploy Libraries
*/

function sleep_s(secs) {
  secs = (+new Date) + secs * 1000;
  while ((+new Date) < secs);
}
// truffle-flattener ./contracts/Berry.sol > ./flat_files/Berry_flat.sol
// truffle exec scripts/01_DeployBerry.js --network rinkeby
// const Web3 = require('web3');
// const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

const BerryFund = artifacts.require("./BerryFund.sol");
const BerryTransfer = require("usingberry/build/contracts/BerryTransfer.json")
const BerryGettersLibrary = require("usingberry/build/contracts/BerryGettersLibrary.json")
const BerryLibrary = require("usingberry/build/contracts/BerryLibrary.json")


const BerryMaster = require("usingberry/build/contracts/BerryMaster.json")
const Berry = require("usingberry/build/contracts/Berry.json")

const UserContract = require("usingberry/build/contracts/UserContract.json")
const UsingBerry = require("usingberry/build/contracts/UsingBerry.json")
const OracleIDDescriptions = require("usingberry/build/contracts/OracleIDDescriptions.json")

var calls = 0;
var _date = Date.now()/1000- (Date.now()/1000)%86400;
var bytes = "0x0d7effefdb084dfeb1621348c8c70cc4e871eba4000000000000000000000000";


advanceTime = (time) => {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time],
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err); }
            return resolve(result);
        });
    });
}
module.exports =async function(callback) {
    let oracle, event, _endDate
    let master
    let berry
    let userContract
    let usingBerry
    let berryOracle
    let berryFallbackOracle
    let berryOracleFactory
    let berryFallbackOracleFactory
    let berryTransfer
    let berryGettersLibrary
    let berryLibrary 
    let berryFund
    let factory
    let oracleIDDescriptions

        _endDate = ((_date - (_date % 86400000))/1000) + 86400 + (86400 * 4 * calls);
        calls = calls + 1
        /**********Start: Manually Deploy Berry*******************************/
        //Deploy BerryTransfer library
        let t = await new web3.eth.Contract(BerryTransfer.abi)
        let berryTransfer = await t.deploy({data:BerryTransfer.bytecode}).send({from:accounts[0], gas:3000000})
        t = await new web3.eth.Contract(BerryGettersLibrary.abi)
        //Deploy BerryGetters library
        berryGettersLibrary  =await t.deploy({data:BerryGettersLibrary.bytecode}).send({from:accounts[0], gas:3000000})
        //Link BerryLibary to BerryTransfer
        var libBytes = BerryLibrary.bytecode.replace(
          /_+BerryTransfer_+/g,
          berryTransfer._address.replace("0x", "")
        );
        //Deploy BerryLibary
        t = await new web3.eth.Contract(BerryLibrary.abi)
        berryLibrary  =await t.deploy({data:libBytes}).send({from:accounts[0], gas:5000000})
        //Link Berry to BerryTranfer
        var mainBytes = Berry.bytecode.replace(
          /_+BerryTransfer_+/g,
          berryTransfer._address.replace("0x", "")
        );
        //Link Berry to BerryLibrary 
        mainBytes = mainBytes.replace(
          /_+BerryLibrary_+/g,
          berryLibrary._address.replace("0x", "")
        );
        //Deploy Berry
        t = await new web3.eth.Contract(Berry.abi)
        berry  =await t.deploy({data:mainBytes}).send({from:accounts[0], gas:5000000})
        //Link BerryMaster to BerryGettersLibrary
        var masterBytes = BerryMaster.bytecode.replace(
          /_+BerryGettersLibrary_+/g,
          berryGettersLibrary._address.replace("0x", "")
        );
        //Link BerryMaster to BerryTransfer library
        masterBytes = masterBytes.replace(
          /_+BerryTransfer_+/g,
          berryTransfer._address.replace("0x", "")
        );
        //Deploy BerryMaster
        t = await new web3.eth.Contract(BerryMaster.abi)
        master = await t.deploy({data:masterBytes,arguments:[berry._address]}).send({from:accounts[0], gas:4000000})
        /**********End: Manually Deploy Berry*******************************/

  // // deploy dispute
  // dispute = await BerryDispute.new();
  // console.log('BerryDispute address:', dispute.address);
  // console.log('Use BerryTransfer and BerryDispute addresses to link library in BerryStake json file');
  // sleep_s(10);

  // // deploy stake
  // stake = await BerryStake.new();
  // console.log('BerryStake address:', stake.address);
  // sleep_s(10);

  // // deploy getters lib
  // getters = await BerryGettersLibrary.new();
  // console.log('BerryGettersLibrary address:', getters.address);
  // console.log('Use BerryTransfer, BerryDispute and BerryStake addresses to link library in BerryLibrary json file');
  // sleep_s(10);

  // // deploy lib

  // berryLib = await BerryLibrary.new();
  // console.log('BerryLib address:', berryLib.address);
  // console.log('Use BerryTransfer, BerryDispute,BerryStake, BerryLibrary addresses to link library in Berry json file');
  // sleep_s(10);

  // // deploy berry
  // berry = await Berry.new();
  // console.log('Berry address:', berry.address);
  // console.log('Use BerryTransfer, BerryGettersLibrary,BerryStake addresses to link library in BerryMaster json file');
  // sleep_s(10);

  // // deploy berry master
  // berryMaster = await BerryMaster(Berry.address);
  // console.log('BerryMaster address:', berryMaster.address);

}
