require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path: '.env'});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    defaultNetwork: "quickstart",
    networks: {
      // in built test network to use when developing contracts
      hardhat: {},
      quickstart: {
        url: "http://127.0.0.1:8545",
        chainId: 1337,
        gas: "0x1ffffffffffffe",
        gasPrice: 0,
        // test accounts only, all good ;)
        accounts: [`0x${process.env.PRIVATE_KEY}`]
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
}