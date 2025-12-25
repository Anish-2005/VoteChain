const { ethers } = require("ethers");

async function main() {
  console.log("Deploying Voting contract using ethers.js...");

  // Connect to Hardhat local network
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

  // Read compiled artifact
  const fs = require("fs");
  const path = require("path");
  const artifactPath = path.join(__dirname, "../artifacts/contracts/Voting.sol/Voting.json");

  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Run 'npm run compile' first.`);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Deploy contract
  const VotingFactory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("Deploying contract...");
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