/**
//  * This tests the oracle functions, including mining.
//  */
// const Web3 = require("web3");
// const web3 = new Web3(
//   new Web3.providers.WebsocketProvider("ws://localhost:8545")
// );
// //var web3 = new Web3('http://localhost:8545');
// const helper = require("./helpers/test_helpers");
// const BerryMaster = artifacts.require("./BerryMaster.sol");
// const Berry = artifacts.require("./Berry.sol"); // globally injected artifacts helper
// var oracleAbi = Berry.abi;
// var oracleByte = Berry.bytecode;
// var OldBerry = artifacts.require("./oldContracts/OldBerry.sol");
// var oldBerryABI = OldBerry.abi;

// var masterAbi = BerryMaster.abi;
// var api = "json(https://api.gdax.com/products/BTC-USD/ticker).price";

// function promisifyLogWatch(_address, _event) {
//   return new Promise((resolve, reject) => {
//     web3.eth.subscribe(
//       "logs",
//       {
//         address: _address,
//         topics: [web3.utils.sha3(_event)],
//       },
//       (error, result) => {
//         if (error) {
//           console.log("Error", error);
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );
//   });
// }

// contract("Full Mining Tests", function(accounts) {
//   let oracle;
//   let oracle2;
//   let oracle3;
//   let newOracle;
//   let master;

//   beforeEach("Setup contract for each test", async function() {
//     oldBerry = await OldBerry.new();
//     oracle = await BerryMaster.new(oldBerry.address);
//     oracleBase = await Berry.new();
//     oracle2 = await new web3.eth.Contract(oracleAbi, oracle.address);
//     master = await new web3.eth.Contract(masterAbi, oracle.address);
//     oldBerryinst = await new web3.eth.Contract(
//       oldBerryABI,
//       oldBerry.address
//     );
//     for (var i = 0; i < 10; i++) {
//       //print tokens
//       await web3.eth.sendTransaction({
//         to: oracle.address,
//         from: accounts[0],
//         gas: 7000000,
//         data: oldBerryinst.methods
//           .theLazyMethod(accounts[i], web3.utils.toWei("1100", "ether"))
//           .encodeABI(),
//       });
//     }
//     for (var i = 6; i < 10; i++) {
//       await web3.eth.sendTransaction({
//         to: oracle.address,
//         from: accounts[i],
//         gas: 7000000,
//         data: oldBerryinst.methods.depositStake().encodeABI(),
//       });
//     }
//     for (var i = 0; i < 52; i++) {
//       x = "USD" + i;
//       apix = api + i;
//       await web3.eth.sendTransaction({
//         to: oracle.address,
//         from: accounts[0],
//         gas: 7000000,
//         data: oldBerryinst.methods
//           .requestData(apix, x, 1000, 52 - i)
//           .encodeABI(),
//       });
//     }
//     let q = await oracle.getRequestQ();
//     //Deploy new upgraded Berry
//     await oracle.changeBerryContract(oracleBase.address);
//     for (var i = 0; i < 5; i++) {
//       await web3.eth.sendTransaction({
//         to: oracle.address,
//         from: accounts[i],
//         gas: 7000000,
//         data: oracle2.methods[
//           "testSubmitMiningSolution(string,uint256,uint256)"
//         ]("nonce", 1, 1200).encodeABI(),
//       });
//     }
//   });
// //   it("Test miner", async function() {
// //      console.log("START MINING RIG!!");
// //      console.log(oracle.address)
// //     var logMineWatcher = await promisifyLogWatch(
// //       oracle.address,
// //       "NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)"
// //     );
// //     res = web3.eth.abi.decodeParameters(
// //       ["uint256", "uint256"],
// //       logMineWatcher.data
// //     );
// //     assert(res["1"] > 0, "value should be positive");
// //   });

// // it("Test 2 Mines", async function () {
// //   console.log(oracle.address)
// //       for(var i = 0;i < 2;i++){
// //           logMineWatcher = await promisifyLogWatch(oracle.address,'NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)');//or Event Mine?
// //     }
// //       res = web3.eth.abi.decodeParameters(['uint256','uint256'],logMineWatcher.data);
// //       assert(res[0] > 0, "value should be positive");
// //   });

// // it("Test Total Supply Increase", async function () {
// //       initTotalSupply = await oracle.totalSupply();
// //       logMineWatcher = await promisifyLogWatch(oracle.address,'NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)');//or Event Mine?
// //       newTotalSupply = await oracle.totalSupply();
// //       it= await web3.utils.fromWei(initTotalSupply, 'ether');
// //       ts= await web3.utils.fromWei(newTotalSupply, 'ether');
// //       assert(ts-it >= 13,"Difference should equal the payout");
// //       assert(ts-it < 15,"Difference should equal the payout");
// //   });

// // it("Test Total Supply decreasing increase", async function () {
// //       initTotalSupply = await oracle.totalSupply();
// //       logMineWatcher = await promisifyLogWatch(oracle.address,'NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)');//or Event Mine?
// //       newTotalSupply = await oracle.totalSupply();
// //       it= await web3.utils.fromWei(initTotalSupply, 'ether');
// //       ts= await web3.utils.fromWei(newTotalSupply, 'ether');
// //       tsChange = ts-it
// //       initTotalSupply = await oracle.totalSupply();
// //       logMineWatcher = await promisifyLogWatch(oracle.address,'NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)');//or Event Mine?
// //       newTotalSupply = await oracle.totalSupply();
// //       it= await web3.utils.fromWei(initTotalSupply, 'ether');
// //       ts= await web3.utils.fromWei(newTotalSupply, 'ether');
// //       tsChange2 = ts-it
// //       assert(tsChange2 < tsChange,"TS change should go down");
// //   });
// //   it("Test Is Data", async function () {
// //       res = await promisifyLogWatch(oracle.address, 'NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)');//or Event Mine?
// //       res = web3.eth.abi.decodeParameters(['uint256[5]','uint256','uint256[5]','uint256'],res.data)
// //       data = await oracle.getMinedBlockNum(1,res[1]);
// //       assert(data > 0, "Should be true if Data exist for that point in time");
// //   });
// //   it("Test Get Last Query", async function () {
// //       res = await promisifyLogWatch(oracle.address, 'NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)');//or Event Mine?
// //       res = web3.eth.abi.decodeParameters(['uint256[5]','uint256','uint256[5]','uint256'],res.data)
// //       res2 = await oracle.getLastNewValue();
// //       assert(res2 = res[0][4], "Ensure data exist for the last mine value");
// //   });
// //   it("Test Data Read", async function () {
// //       res = await promisifyLogWatch(oracle.address, 'NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)');//or Event Mine?
// //       res = web3.eth.abi.decodeParameters(['uint256[5]','uint256','uint256[5]','uint256'],res.data)
// //       res2 = await oracle.retrieveData(1,res[1]);
// //       assert(res2 = res[0][1], "Ensure data exist for the last mine value");
// //       res2 = await oracle.getTimestampbyRequestIDandIndex(2,0);
// //       assert(res2 == res[1]);
// //   });
// it("Test Miner Payout", async function () {
//     balances = []
//     for(var i = 0;i<6;i++){
//         balances[i] = await oracle.balanceOf(accounts[i]);
//     }
//     logMineWatcher = await promisifyLogWatch(oracle.address, 'NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)');//or Event Mine?
//     new_balances = []
//     for(var i = 0;i<6;i++){
//         new_balances[i] = await oracle.balanceOf(accounts[i]);
//     }
//     console.log(web3.utils.fromWei(new_balances[0]),web3.utils.fromWei(balances[0]))
//     assert(new_balances[0] -balances[0] <= web3.utils.toWei('3.75', 'ether'));
//     assert(new_balances[1] -balances[1] <= web3.utils.toWei('2.5', 'ether'));
//     assert(new_balances[2] - balances[2] <= web3.utils.toWei('2.5', 'ether'));
//     assert(new_balances[3] -balances[3] <= web3.utils.toWei('2.5', 'ether'));
//     assert(new_balances[4] -balances[4] <= web3.utils.toWei('2.5', 'ether'));
//     assert(new_balances[0] -balances[0] > web3.utils.toWei('2.5', 'ether'));
//     assert(new_balances[1] -balances[1] > web3.utils.toWei('2', 'ether'));
//     assert(new_balances[2] -balances[2] > web3.utils.toWei('2', 'ether'));
//     assert(new_balances[3] -balances[3] > web3.utils.toWei('2', 'ether'));
//     assert(new_balances[4] -balances[4] > web3.utils.toWei('2', 'ether'));
// });
// // it("Test miner upgrade", async function () {
// //         oldBerry = await OldBerry.new()
// //         oracle = await BerryMaster.new(oldBerry.address);
// //         master = await new web3.eth.Contract(masterAbi,oracle.address);
// //         oldBerryinst = await new web3.eth.Contract(oldBerryABI,oldBerry.address);
// //         for(var i = 0;i<6;i++){
// //             //print tokens
// //             await web3.eth.sendTransaction({to:oracle.address,from:accounts[0],gas:7000000,data:oldBerryinst.methods.theLazyMethod(accounts[i],web3.utils.toWei('1100', 'ether')).encodeABI()})
// //         }
// //         for(var i=0; i<52;i++){
// //             x = "USD" + i
// //             apix = api + i
// //             await web3.eth.sendTransaction({to: oracle.address,from:accounts[0],gas:7000000,data:oldBerryinst.methods.requestData(apix,x,1000,52-i).encodeABI()})
// //         }
// //         let q = await oracle.getRequestQ();
// //         //Deploy new upgraded Berry
// //         oracleBase = await Berry.new();
// //         oracle2 = await new web3.eth.Contract(oracleAbi,oracle.address);
// //         await oracle.changeBerryContract(oracleBase.address)
// //         for(var i = 0;i<5;i++){
// //           await web3.eth.sendTransaction({to:oracle.address,from:accounts[i],gas:7000000,data:oracle2.methods['submitMiningSolution(string,uint256,uint256)']("nonce",1,1200).encodeABI()})
// //         }
// //         res = await promisifyLogWatch(oracle.address, 'NewValue(uint256[5],uint256,uint256[5],uint256,bytes32)');
// //         res = web3.eth.abi.decodeParameters(['uint256[5]','uint256','uint256[5]','uint256'],res.data)
// //         data = await oracle.getMinedBlockNum(1,res[1]);
// //         assert(data > 0, "Should be true if Data exist for that point in time");
// //    })
// });
