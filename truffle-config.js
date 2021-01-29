require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKey = process.env.PRIVATE_KEY;

// ganache-cli -m "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish" -l 10000000 --allowUnlimitedContractSize
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 10000000, // default ganache-cli value
    },
    testnet: {
      provider: () => new HDWalletProvider(privateKey, 'https://data-seed-prebsc-1-s1.binance.org:8545'),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(privateKey, 'https://bsc-dataseed1.binance.org'),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  mocha: {
    enableTimeouts: false,
    before_timeout: 210000, // Here is 2min but can be whatever timeout is suitable for you.
    //reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
    },
  },

  solc: {
    optimizer: {
      enabled: false,
      //runs: 5000,
    },
  },

  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    bscscan: '53QVFXTM8112VSM56U9R21JHHRGRQIAPYE'
  }
};
