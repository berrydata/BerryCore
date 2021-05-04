// const Web3 = require("web3");
// const web3 = new Web3(
//   new Web3.providers.WebsocketProvider("ws://localhost:8545")
// );

// const Berry = artifacts.require("MockBerry.sol"); // globally injected artifacts helper
// const RefBerry = artifacts.require("RefBerry.sol");

// contract("Gas Tests", function(accounts) {
//   let oracleBase;
//   let oracle;
//   let oracleRef;
//   let master;
//   let oldBerry;
//   let oldBerryinst;
//   let utilities;

//   beforeEach("Setup contract for each test", async function() {
//     oracle = await Berry.new();
//     oracleRef = await RefBerry.new();
//     await oracle.theLazyMethod(accounts[0], web3.utils.toWei("7000", "ether"));
//     await oracleRef.theLazyMethod(accounts[0], web3.utils.toWei("7000", "ether"));
//   });

//   it("SubmitMinningSolution", async () => {
//     let gases = [];
//     let refs = [];
//     for (var i = 0; i < 5; i++) {
//       let receipt = await oracle.submitMiningSolution(
//         "nonce",
//         [1, 2, 3, 4, 5],
//         [1600, 1500, 1400, 1300, 1200],
//         { from: accounts[i] }
//       );
//       gases.push(receipt.receipt.gasUsed);

//       let bench = await oracleRef.submitMiningSolution(
//         "nonce",
//         [1, 2, 3, 4, 5],
//         [1600, 1500, 1400, 1300, 1200],
//         { from: accounts[i] }
//       );
//       refs.push(bench.receipt.gasUsed);
//     }
//     console.log("Gas used: ", gases, "Gas Reference: ", refs);

//     assert.isTrue(gases[4] < refs[4], "Gas did not reduce");
//   });

//   it("Transfers", async () => {
//     let gas = await oracle.transfer(
//       accounts[2],
//       web3.utils.toWei("1", "ether")
//     );
//     let ref = await oracleRef.transfer(
//       accounts[2],
//       web3.utils.toWei("1", "ether")
//     );
//     console.log(
//       "Gas used: ",
//       gas.receipt.gasUsed,
//       "Gas Reference: ",
//       ref.receipt.gasUsed
//     );
//     assert.isTrue(gas.receipt.gasUsed < ref.receipt.gasUsed);
//   });
// });
