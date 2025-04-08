import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@openzeppelin/hardhat-defender";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defender: {
    apiKey: "DroZ4MRDj8pHZ4KnPdieXtD3T6EW8Z68",
    apiSecret: "mnBJgSP5BZwDK3SrReX8P4WTpztuamZaZypnip1MDGjX4Zan1uwdxkzeoXx8xLxU",
  },
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia.publicnode.com",
      chainId: 11155111
    },
  },
};

export default config;

// require("@nomicfoundation/hardhat-toolbox")
// require("dotenv").config()

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.20",
//   networks: {
//     sepolia: {
//       url: process.env.SEPOLIA_RPC_URL || "",
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//     },
//   },
//   etherscan: {
//     apiKey: process.env.ETHERSCAN_API_KEY || "",
//   },
//   paths: {
//     artifacts: "./artifacts",
//     cache: "./cache",
//     sources: "./contracts",
//     tests: "./test",
//   },
// }