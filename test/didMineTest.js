// const Web3 = require('web3')
// const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
// const helper = require("./helpers/test_helpers");
// const BerryMaster = artifacts.require("./BerryMaster.sol");
// const Berry = artifacts.require("./Berry.sol"); // globally injected artifacts helper
// var oracleAbi = Berry.abi;
// var oracleByte = Berry.bytecode;
// var OldBerry = artifacts.require("./oldContracts/OldBerry.sol")
// var oldBerryABI = OldBerry.abi;

// var masterAbi = BerryMaster.abi;
// var api = "json(https://api.gdax.com/products/BTC-USD/ticker).price";

// contract('didMine Tests', function(accounts) {
//   let oracleBase;
//   let oracle;
//   let oracle2;
//   let master;
//   let oldBerry;
//   let oldBerryinst;

//     beforeEach('DidMine test', async function () {
//         oldBerry = await OldBerry.new()    
//         oracle = await BerryMaster.new(oldBerry.address);
//         master = await new web3.eth.Contract(masterAbi,oracle.address);
//         oldBerryinst = await new web3.eth.Contract(oldBerryABI,oldBerry.address);
//         for(var i = 0;i<6;i++){
//             await web3.eth.sendTransaction({to:oracle.address,from:accounts[0],gas:7000000,data:oldBerryinst.methods.theLazyCoon(accounts[i],web3.utils.toWei('5000', 'ether')).encodeABI()})
//         }
//         for(var i=0; i<52;i++){
//             x = "USD" + i
//             apix = api + i
//             await web3.eth.sendTransaction({to: oracle.address,from:accounts[0],gas:7000000,data:oldBerryinst.methods.requestData(apix,x,1000,52-i).encodeABI()})
//         }
//         let q = await oracle.getRequestQ();
//         //Deploy new upgraded Berry
//         oracleBase = await Berry.new();
//         oracle2 = await new web3.eth.Contract(oracleAbi,oracle.address);
//         await oracle.changeBerryContract(oracleBase.address)
//         for(var i = 0;i<5;i++){
//           await web3.eth.sendTransaction({to:oracle.address,from:accounts[i],gas:7000000,data:oracle2.methods['testSubmitMiningSolution(string,uint256,uint256)']("nonce",1,1200).encodeABI()})
//         }
//     });

//     it("Test didMine ", async function () {
//     	console.log("1")
//         let vars = await oracle2.methods.getNewCurrentVariables().call()
//         console.log("2")
//         for(var i = 0;i<5;i++){
//             res = await web3.eth.sendTransaction({to:oracle.address,from:accounts[i],gas:7000000,data:oracle2.methods.testSubmitMiningSolution("nonce",[1,2,3,4,5],[1200,1300,1400,1500,1600]).encodeABI()})
//         }
//         console.log(vars[0],accounts[2])
//         let didMine = await oracle.didMine(vars[0],accounts[2],{from:accounts[0],gas:7000000});
//         assert(didMine);
//     });
//  });    