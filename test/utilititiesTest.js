// const Web3 = require("web3");
// const web3 = new Web3(
//   new Web3.providers.WebsocketProvider("ws://localhost:8545")
// );
// const BerryMaster = artifacts.require("./BerryMaster.sol");
// var OldBerry = artifacts.require("./oldContracts/OldBerry.sol");
// var UtilitiesTests = artifacts.require("./UtilitiesTests.sol");

// contract("Utilities Tests", function(accounts) {
//   let oracle;
//   let oldBerry;
//   let utilities;

//   beforeEach("Setup contract for each test", async function() {
//     oldBerry = await OldBerry.new();
//     oracle = await BerryMaster.new(oldBerry.address);
//     utilities = await UtilitiesTests.new(oracle.address);
//   });
//   it("Test possible duplicates on top Requests", async function() {
//     const testGetMax = async () => {
//       let queue = [0];
//       let ref = [0];
//       for (var i = 0; i < 50; i++) {
//         let x = Math.floor(Math.random() * 998) + 1;
//         queue.push(x);
//         ref.push(x);
//       }
//       // console.log(queue);

//       let res = await utilities.testgetMax5(queue);
//       let values = [];
//       let idexes = [];

//       let tempsorted = queue.sort((a, b) => a - b);
//       let sorted = tempsorted.slice(46);
//       for (var i = 0; i < 5; i++) {
//         values.push(res["0"][i].toNumber());
//         idexes.push(res["1"][i].toNumber());
//       }
//       let svals = values.sort((a, b) => a - b);
//       for (var i = 0; i < 5; i++) {
//         assert(svals[i] == sorted[i], "Value supposed to be on the top5");
//       }
//     };

//     for (var k = 0; k < 25; k++) {
//       await testGetMax();
//     }
//   });
// });
