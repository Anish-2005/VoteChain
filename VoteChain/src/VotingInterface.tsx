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

  useEffect(() => {
    const loadCandidates = async () => {
      const cands = await getCandidates();
      setCandidates(cands);
    };
    if (walletConnected) {
      loadCandidates();
    }
  }, [walletConnected, setCandidates]);

  const handleConnectWallet = async () => {
    await connectWallet();
    setWalletConnected(true);
    const address = await (window as any).ethereum.selectedAddress;
    const voted = await hasVoted(address);
    setHasVoted(voted);
  };

  const handleVote = async () => {
    if (selectedCandidate !== null && !storeHasVoted) {
      await vote(selectedCandidate);
      setHasVoted(true);
      // Reload candidates to update vote counts
      const cands = await getCandidates();
      setCandidates(cands);
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

      {!walletConnected ? (
        <MotionButton
          onClick={handleConnectWallet}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Connect Wallet
        </MotionButton>
      ) : (
        <>
          {storeHasVoted ? (
            <p className="text-green-600 font-medium">You have already voted.</p>
          ) : (
            <p className="text-gray-700 mb-4">Select a candidate to vote.</p>
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
                <p className="text-gray-600">Votes: {candidate.voteCount}</p>
                {!storeHasVoted && (
                  <button
                    onClick={() => setSelectedCandidate(candidate.id)}
                    className={`mt-4 px-4 py-2 rounded-lg ${
                      selectedCandidate === candidate.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Select
                  </button>
                )}
              </MotionDiv>
            ))}
          </div>

          {!storeHasVoted && selectedCandidate && (
            <MotionButton
              onClick={handleVote}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Submit Vote
            </MotionButton>
          )}
        </>
      )}
    </div>
  );
};

export default VotingInterface;
