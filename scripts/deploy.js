const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

async function main() {
  console.log("Deploying Voting contract using ethers.js to local network...");

  const rpc = process.env.RPC_URL || "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpc);

  // Use DEPLOYER_PRIVATE_KEY env var or Hardhat default first account private key for local node
  const deployerKey = process.env.DEPLOYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(deployerKey, provider);

  // Read compiled artifact
  const artifactPath = path.join(__dirname, "../artifacts/contracts/Voting.sol/Voting.json");
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Run 'npm run compile' first.`);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;
  const bytecode = artifact.bytecode;

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log("Voting deployed to:", contract.target || contract.address);

  // Save contract address and ABI to frontend
  const contractData = {
    address: contract.target || contract.address,
    abi: abi
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
  console.error(error);
  process.exitCode = 1;
});