require("@nomiclabs/hardhat-truffle5");
require("hardhat-gas-reporter");
require('solidity-coverage');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.4",
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
    currency: "USD",
    gasPrice: 114,
    onlyCalledMethods: false,
    showTimeSpent: true,
    coinmarketcap: process.env.COINMARKETCAP_KEY
  },
};

