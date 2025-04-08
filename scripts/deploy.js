const { ethers, run } = require("hardhat");

async function deployMicrofinance() {
  console.log("Deploying Microfinance contract...");

  const Microfinance = await ethers.getContractFactory("Microfinance");
  const microfinance = await Microfinance.deploy();

  await microfinance.waitForDeployment();
  const address = await microfinance.getAddress();

  console.log(`Microfinance deployed to: ${address}`);

  console.log("Waiting for block confirmations...");
  await microfinance.deploymentTransaction().wait(5);

  console.log("Verifying Microfinance contract on Etherscan...");
  try {
    await run("verify:verify", {
      address,
      constructorArguments: [],
    });
    console.log("Microfinance contract verified.");
  } catch (error) {
    console.error("Microfinance verification failed:", error);
  }
}

// If you need defender functionality, use require instead of import
// const defender = require("@openzeppelin/hardhat-defender");

async function deployBoxUpgradeable() {
  console.log("Deploying Box upgradeable contract...");

  try {
    const Box = await ethers.getContractFactory("Box");

    // Comment out or fix defender functionality
    /*
    let upgradeApprovalProcess;
    try {
      upgradeApprovalProcess = await defender.getUpgradeApprovalProcess();
    } catch (error) {
      console.error("Failed to fetch upgrade approval process:", error);
      throw new Error("Upgrade approval process could not be retrieved.");
    }

    if (!upgradeApprovalProcess || !upgradeApprovalProcess.address) {
      throw new Error(
        `Upgrade approval process with id ${upgradeApprovalProcess?.approvalProcessId} has no assigned address`
      );
    }

    const boxProxy = await defender.deployProxy(Box, [5, upgradeApprovalProcess.address], {
      initializer: "initialize",
    });
    */

    // For now, deploy without proxy
    const box = await Box.deploy();
    await box.waitForDeployment();
    const boxAddress = await box.getAddress();

    console.log(`Box contract deployed to: ${boxAddress}`);
  } catch (error) {
    console.error("Error deploying Box:", error);
  }
}

async function main() {
  await deployMicrofinance();
  // Uncomment if you fix the Box deployment
  // await deployBoxUpgradeable();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
