const hre = require("hardhat")

async function main() {
  console.log("Deploying Microfinance contract...")

  const Microfinance = await hre.ethers.getContractFactory("Microfinance")
  const microfinance = await Microfinance.deploy()

  await microfinance.waitForDeployment()

  const address = await microfinance.getAddress()
  console.log(`Microfinance deployed to: ${address}`)

  console.log("Waiting for block confirmations...")
  // Wait for 5 confirmations for Etherscan verification
  await microfinance.deploymentTransaction().wait(5)

  console.log("Verifying contract on Etherscan...")
  // Verify the contract on Etherscan
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    })
    console.log("Contract verified on Etherscan")
  } catch (error) {
    console.error("Error verifying contract:", error)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

