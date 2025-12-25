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

    // Check if we're on the correct network
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name, "Chain ID:", network.chainId);

    if (network.chainId !== 1337n) {
      throw new Error(`Please connect to the local Hardhat network (Chain ID: 1337). Current network: ${network.name} (Chain ID: ${network.chainId})`);
    }

    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("Connected to contract at:", contractAddress);
  } else {
    throw new Error('Please install MetaMask or another Web3 wallet');
  }
};

export const addLocalNetwork = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x539', // 1337 in hex
        chainName: 'Hardhat Local Network',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['http://127.0.0.1:8545'],
        blockExplorerUrls: []
      }]
    });
    console.log('Local network added to MetaMask');
  } catch (error) {
    console.error('Failed to add local network:', error);
    throw error;
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

// Admin actions
export const addCandidateAdmin = async (name: string) => {
  if (!contract) throw new Error('Contract not connected.');
  try {
    const tx = await contract.addCandidate(name);
    await tx.wait();
  } catch (err) {
    console.error('addCandidate failed', err);
    throw err;
  }
};

export const startVotingAdmin = async () => {
  if (!contract) throw new Error('Contract not connected.');
  try {
    const tx = await contract.startVoting();
    await tx.wait();
  } catch (err) {
    console.error('startVoting failed', err);
    throw err;
  }
};

export const endVotingAdmin = async () => {
  if (!contract) throw new Error('Contract not connected.');
  try {
    const tx = await contract.endVoting();
    await tx.wait();
  } catch (err) {
    console.error('endVoting failed', err);
    throw err;
  }
};

export const getOwner = async () => {
  if (!contract) throw new Error('Contract not connected.');
  try {
    return await contract.owner();
  } catch (err) {
    console.error('getOwner failed', err);
    throw err;
  }
};