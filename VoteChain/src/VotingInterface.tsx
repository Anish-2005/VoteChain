import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVotingStore } from './store/useVotingStore';
import { connectWallet, getCandidates, vote, hasVoted } from './utils/blockchain';

const MotionH2 = motion.h2 as any;
const MotionButton = motion.button as any;
const MotionDiv = motion.div as any;

const VotingInterface = () => {
  const { candidates, hasVoted: storeHasVoted, setCandidates, setHasVoted } = useVotingStore();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const cands = await getCandidates();
        setCandidates(cands);
      } catch (err) {
        setError('Failed to load candidates. Please make sure you are connected to the correct network.');
        console.error(err);
      }
    };
    if (walletConnected) {
      loadCandidates();
    }
  }, [walletConnected, setCandidates]);

  const handleConnectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      await connectWallet();
      const provider = new (window as any).ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const voted = await hasVoted(address);
      setHasVoted(voted);
      setWalletConnected(true);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (selectedCandidate !== null && !storeHasVoted) {
      setLoading(true);
      setError(null);
      try {
        await vote(selectedCandidate);
        setHasVoted(true);
        // Reload candidates to update vote counts
        const cands = await getCandidates();
        setCandidates(cands);
        setSelectedCandidate(null);
      } catch (err: any) {
        setError(err.message || 'Failed to submit vote');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <MotionH2
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Blockchain Voting
      </MotionH2>

      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!walletConnected ? (
        <div className="text-center">
          <MotionButton
            onClick={handleConnectWallet}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </MotionButton>
          <p className="mt-4 text-gray-600">
            Connect your MetaMask wallet to participate in blockchain voting
          </p>
        </div>
      ) : (
        <>
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </div>

          {storeHasVoted ? (
            <div className="text-center">
              <p className="text-green-600 font-medium text-xl">✓ You have successfully voted!</p>
              <p className="text-gray-600 mt-2">Your vote has been recorded on the blockchain.</p>
            </div>
          ) : (
            <p className="text-gray-700 mb-4 text-center">Select a candidate to vote.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <MotionDiv
                key={candidate.id}
                className="p-6 bg-white rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-2">{candidate.name}</h3>
                <p className="text-gray-600">Current Votes: {candidate.voteCount}</p>
                {!storeHasVoted && (
                  <button
                    onClick={() => setSelectedCandidate(candidate.id)}
                    className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
                      selectedCandidate === candidate.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {selectedCandidate === candidate.id ? 'Selected' : 'Select'}
                  </button>
                )}
              </MotionDiv>
            ))}
          </div>

          {!storeHasVoted && selectedCandidate && (
            <div className="text-center mt-6">
              <MotionButton
                onClick={handleVote}
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {loading ? 'Submitting Vote...' : 'Submit Vote'}
              </MotionButton>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VotingInterface;
