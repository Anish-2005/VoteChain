const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying Voting contract...");

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.deployed();

  console.log("Voting deployed to:", voting.target);

  // Save contract address and ABI to frontend
  const contractData = {
    address: voting.target,
    abi: Voting.interface.format('json')
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