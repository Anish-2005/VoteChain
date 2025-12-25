import { ethers } from 'ethers';
import contractData from '../contracts/Voting.json';

const contractAddress = contractData.address;
const abi = contractData.abi;

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let contract: ethers.Contract | null = null;

export const connectWallet = async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("Connected to contract at:", contractAddress);
  } else {
    throw new Error('Please install MetaMask or another Web3 wallet');
  }
};

export const getCandidates = async () => {
  if (!contract) {
    throw new Error('Contract not connected. Please connect wallet first.');
  }

  try {
    const candidates = await contract.getCandidates();
    return candidates.map((c: any) => ({
      id: Number(c.id),
      name: c.name,
      voteCount: Number(c.voteCount)
    }));
  } catch (error) {
    console.error('Failed to get candidates:', error);
    throw error;
  }
};

export const vote = async (candidateId: number) => {
  if (!contract) {
    throw new Error('Contract not connected. Please connect wallet first.');
  }

  try {
    const tx = await contract.vote(candidateId);
    console.log('Transaction sent:', tx.hash);
    await tx.wait();
    console.log('Vote confirmed');
  } catch (error) {
    console.error('Failed to vote:', error);
    throw error;
  }
};

export const hasVoted = async (address: string) => {
  if (!contract) {
    throw new Error('Contract not connected. Please connect wallet first.');
  }

  try {
    return await contract.voters(address);
  } catch (error) {
    console.error('Failed to check voting status:', error);
    throw error;
  }
};

export const getVotingStatus = async () => {
  if (!contract) {
    throw new Error('Contract not connected. Please connect wallet first.');
  }

  try {
    const status = await contract.getVotingStatus();
    return {
      active: status[0],
      totalVotes: Number(status[1]),
      candidateCount: Number(status[2])
    };
  } catch (error) {
    console.error('Failed to get voting status:', error);
    throw error;
  }
};

export const getContractAddress = () => contractAddress;