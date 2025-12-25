import { ethers } from 'ethers';

// Contract ABI - simplified
const abi = [
  "function vote(uint _candidateId) public",
  "function getCandidates() public view returns (tuple(uint id, string name, uint voteCount)[])",
  "function voters(address) public view returns (bool)"
];

// Contract address - for local, will be set after deploy
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // example, replace with actual

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;

export const connectWallet = async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
  } else {
    alert('Please install MetaMask');
  }
};

export const getCandidates = async () => {
  // Mock data for demonstration
  return [
    { id: 1, name: 'Candidate 1', voteCount: 10 },
    { id: 2, name: 'Candidate 2', voteCount: 15 },
  ];
  // Uncomment below when contract is deployed
  // if (contract) {
  //   try {
  //     const candidates = await contract.getCandidates();
  //     return candidates.map((c: any) => ({ id: Number(c[0]), name: c[1], voteCount: Number(c[2]) }));
  //   } catch (error) {
  //     console.error('Contract call failed:', error);
  //   }
  // }
  // return [];
};

export const vote = async (candidateId: number) => {
  // Mock vote for demonstration
  console.log('Voted for candidate', candidateId);
  // Uncomment below when contract is deployed
  // if (contract) {
  //   const tx = await contract.vote(candidateId);
  //   await tx.wait();
  // }
};

export const hasVoted = async (address: string) => {
  // Mock: assume not voted for demonstration
  return false;
  // Uncomment below when contract is deployed
  // if (contract) {
  //   return await contract.voters(address);
  // }
  // return false;
};