const BN = require('bn.js');
        console.log(1)
/*var BerryMaster = artifacts.require("./BerryMaster.sol");
var Berry = artifacts.require("./Berry.sol");
var berryAbi = Oracle.abi;
var berryByte = Oracle.bytecode;*/
const Web3 = require('web3');
        console.log(2)


const BerryTransfer = require("../build/contracts/BerryTransfer.json")
        console.log(3)
const BerryDispute = require("../build/contracts/BerryDispute.json")
        console.log(4)
const BerryStake = require("../build/contracts/BerryStake.json")
console.log(5)
const BerryGettersLibrary = require("../build/contracts/BerryGettersLibrary.json")
console.log(6)
const BerryLibrary = require("../build/contracts/BerryLibrary.json")

console.log(7)
const BerryMaster = require("../build/contracts/BerryMaster.json")
console.log(8)
const Berry = require("../build/contracts/Berry.json")


console.log(9)

//Mainnet
// var berryMasterAddress = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e';
// var multi = '';

//Rinkeby
const berryMasterAddress = "0x3f1571E4DFC9f3A016D90e0C9824C56fD8107a3e";
var multi = '0x2F51C4Bf6B66634187214A695be6CDd344d4e9d1';

function sleep_s(secs) {
  secs = (+new Date) + secs * 1000;
  while ((+new Date) < secs);
}


//Deploy old Berry
module.exports = async function(callback) {
console.log('vars')
    let master
    let berry
    let berryTransfer
    let berryDispute
    let berryStake
    let berryLibrary 
    let berryGettersLibrary
    console.log("end vars")

        /**********Start: Manually Deploy Berry*******************************/
        //Deploy BerryTransfer library
        let t = await new web3.eth.Contract(BerryTransfer.abi)
        console.log(10)
        berryTransfer  =await t.deploy({data:BerryTransfer.bytecode}).send({from:accounts[0], gas:3000000})  
        console.log(1)
        t = await new web3.eth.Contract(BerryGettersLibrary.abi)
        //Deploy BerryGetters library
        berryGettersLibrary  =await t.deploy({data:BerryGettersLibrary.bytecode}).send({from:accounts[0], gas:3000000})
        console.log(2)
        //Link BerryTransfer to BerryDispute
        var libBytes = BerryDispute.bytecode.replace(
          /_+BerryTransfer_+/g,
          berryDispute._address.replace("0x", "")
        );

        //Deploy BerryDispute library
        berryDispute  =await t.deploy({data:BerryDispute.bytecode}).send({from:accounts[0], gas:3000000})
        

        //Link BerryTransfer to BerryStake
        var libBytes = BerryStake.bytecode.replace(
          /_+BerryTransfer_+/g,
          berryTransfer._address.replace("0x", "")
        );

        //Link BerryDispute to BerryStake
        var libBytes = BerryStake.bytecode.replace(
          /_+BerryDispute_+/g,
          berryDispute._address.replace("0x", "")
        );

        //Deploy BerryStake library
        berryStake  =await t.deploy({data:BerryStake.bytecode}).send({from:accounts[0], gas:3000000})
        

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
        console.log("BerryTransfer", berryTransfer._address )

        //Link Berry to BerryDispute
        var mainBytes = Berry.bytecode.replace(
          /_+BerryDispute_+/g,
          berryDispute._address.replace("0x", "")
        );
        console.log("BerryDispute", berryDispute._address )

        //Link Berry to BerryStake
        var mainBytes = Berry.bytecode.replace(
          /_+BerryStake_+/g,
          berryStake._address.replace("0x", "")
        );
        console.log("BerryStake", berryStake._address )

        //Link Berry to BerryLibrary 
        mainBytes = mainBytes.replace(
          /_+BerryLibrary_+/g,
          berryLibrary._address.replace("0x", "")
        );
        console.log("BerryLibrary", berryLibrary._address )


        //Deploy Berry
        t = await new web3.eth.Contract(Berry.abi)
        berry  =await t.deploy({data:mainBytes}).send({from:accounts[0], gas:5000000})
        /**********End: Manually Deploy Berry*******************************/

        /**********Start: Manually Deploy Berry Master*******************************/
        
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

        //Link BerryMaster to BerryStake library
        masterBytes = masterBytes.replace(
          /_+BerryStake_+/g,
          berryStake._address.replace("0x", "")
        );

        //Deploy BerryMaster
        t = await new web3.eth.Contract(BerryMaster.abi)
        master  =await t.deploy({data:masterBytes,arguments:[berry._address]}).send({from:accounts[0], gas:4000000})
        
        /**********End: Manually Deploy Berry Master*******************************/

}

//50 PSRs
module.exports = function() {

  async function requestData() {
    let ins = await Berry.at(berryMasterAddress);
    let ins2 = await BerryMaster.at(berryMasterAddress);

    for(i=4;i<51;i++){
           let req = 'PSR' + i
           console.log(req)
           await ins.requestData(req,req,10,0)
           console.log('sent req',i)
        } 

    }
  
  requestData();
}


//Deploy New Berry
module.exports = async function(callback) {
//use Deploy old berry if it runs

}

//Change Deity
module.exports = async function(callback) {
    let ins = await BerryMaster.at(berryMasterAddress);
    await inst.changeDeity(multis);
    console.log("Deity changed to", multis)
}

//Upgrade BerryContractAddress
module.exports = async function(callback) {
    let ins = await BerryMaster.at(berryMasterAddress);
    await inst.changeBerryContract(berryContractAddress);
    console.log("berryContractAddress changed to", berryContractAddress)


}