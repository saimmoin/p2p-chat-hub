require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.4',
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/OVZbMpDeon6wu0xPYvGvm-t3_6jDTXjm",
      accounts: ["818ce4251c7eff9dfb77096c6cb5eac0af285098cb7f577dbaaf402b7a884adb"],
    },
  },
};