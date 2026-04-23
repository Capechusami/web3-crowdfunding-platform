const { ethers, network, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  if (network.name === "sepolia") {
    if (!process.env.SEPOLIA_RPC_URL) {
      throw new Error("SEPOLIA_RPC_URL is not set in .env");
    }
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY is not set in .env");
    }
  }

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("Network :", network.name);
  console.log("Deployer:", deployer.address);
  console.log("Balance :", ethers.formatEther(balance), "ETH");

  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy();
  await crowdfunding.waitForDeployment();

  const address = await crowdfunding.getAddress();
  const deployTx = crowdfunding.deploymentTransaction();

  console.log("\nCrowdfunding deployed to:", address);
  if (deployTx) {
    console.log("Tx hash                 :", deployTx.hash);
  }

  await exportToFrontend(address);
}

async function exportToFrontend(address) {
  const frontendAbiDir = path.join(__dirname, "..", "frontend", "src", "abi");
  if (!fs.existsSync(frontendAbiDir)) {
    fs.mkdirSync(frontendAbiDir, { recursive: true });
  }

  const artifact = await artifacts.readArtifact("Crowdfunding");

  fs.writeFileSync(
    path.join(frontendAbiDir, "Crowdfunding.json"),
    JSON.stringify({ address, abi: artifact.abi }, null, 2)
  );

  console.log("\nABI + address written to frontend/src/abi/Crowdfunding.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
