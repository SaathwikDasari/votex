'use client';

import { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'candidates',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'uint256', name: 'voteCount', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCandidates',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'uint256', name: 'voteCount', type: 'uint256' },
        ],
        internalType: 'struct VoteX.Candidate[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'hasVoted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_candidateId', type: 'uint256' }],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export interface Candidate {
  id: bigint;
  name: string;
  voteCount: bigint;
}

export function useVoteX() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Connect wallet
  const connectWallet = async () => {
    try {
      setError('');
      if (!window.ethereum) {
        setError('MetaMask not installed');
        return;
      }

      const newProvider = new BrowserProvider(window.ethereum);
      const accounts = await newProvider.send('eth_requestAccounts', []);
      const address = accounts[0];

      setProvider(newProvider);
      setWalletAddress(address);

      const signer = await newProvider.getSigner();
      const newContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(newContract);

      // Fetch candidates and voting status
      await fetchCandidates(newContract);
      await checkVotingStatus(newContract, address);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setContract(null);
    setWalletAddress('');
    setCandidates([]);
    setHasVoted(false);
  };

  // Fetch candidates from contract
  const fetchCandidates = async (contractInstance: Contract) => {
    try {
      const data = await contractInstance.getCandidates();
      setCandidates(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidates');
    }
  };

  // Check if current user has voted
  const checkVotingStatus = async (contractInstance: Contract, address: string) => {
    try {
      const voted = await contractInstance.hasVoted(address);
      setHasVoted(!!voted);
    } catch (err: any) {
      // Silently fail - hasVoted might not be available on old contracts
      console.warn('Could not check voting status:', err.message);
      setHasVoted(false);
    }
  };

  // Submit vote
  const submitVote = async (candidateId: number) => {
    if (!contract) {
      setError('Contract not initialized');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const tx = await contract.vote(candidateId);
      await tx.wait();

      setHasVoted(true);
      await fetchCandidates(contract);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.reason || err.message || 'Failed to submit vote');
    }
  };

  // Refresh candidates
  const refreshCandidates = async () => {
    if (contract) {
      await fetchCandidates(contract);
    }
  };

  return {
    walletAddress,
    candidates,
    hasVoted,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    submitVote,
    refreshCandidates,
  };
}
