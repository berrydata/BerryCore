const BN = require('bn.js');
const BerryMaster = artifacts.require("./BerryMaster.sol");
const Oracle = artifacts.require("./Berry.sol");
var oracleAbi = Oracle.abi;
var oracleByte = Oracle.bytecode;


//Mainnet
// var berryMasterAddress = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e';
// var berryAddress ='0x350E67De9E92f55c1164556b02deB320b45a4a2a';

/*//Rinkeby
var berryMasterAddress = '0xFe41Cb708CD98C5B20423433309E55b53F79134a' ;
var berryAddress = '0x795d57eC055226e99D95DF41E4Bd00e719dCF855'  ;
var acct = '0xe010ac6e0248790e08f42d5f697160dedf97e024';*/

//let acct  =  "0xe010ac6e0248790e08f42d5f697160dedf97e024";
//Rinkeby
const myOracle = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5';


//mainnet
//let acct  =  "0xC840ba62Aab90B8cD629649822F04300Ef5D1963";
//const myOracle = "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e";

function sleep_s(secs) {
  secs = (+new Date) + secs * 1000;
  while ((+new Date) < secs);
}

let myarr = [10]

module.exports = function() {
    let ins = BerryMaster.at(myOracle).then(ins=>{
      console.log("here")
             ins.getAllDisputeVars(30).call().then(res=>
              {console.log('sent addtip',res)}
              )
             
    });
}

