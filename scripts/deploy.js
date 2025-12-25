const { ethers } = require("ethers");
const hre = require("hardhat");

async function main() {
  console.log("Deploying Voting contract using Hardhat...");

  // Read compiled artifact
  const fs = require("fs");
  const path = require("path");
  const artifactPath = path.join(__dirname, "../artifacts/contracts/Voting.sol/Voting.json");

  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Run 'npm run compile' first.`);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Get signer from Hardhat
  const [deployer] = await hre.ethers.getSigners();

  // Deploy using ethers directly
  const VotingFactory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const voting = await VotingFactory.deploy();

  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log("Voting deployed to:", address);

  // Save contract address and ABI to frontend
  const contractData = {
    address: address,
    abi: artifact.abi
  };

  const contractsDir = path.join(__dirname, "../src/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "Voting.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log("Contract address and ABI saved to src/contracts/Voting.json");
}

main().catch((error) => {
  console.error("Deployment failed:", error.message);
  process.exit(1);
});

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});