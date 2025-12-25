import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVotingStore } from './store/useVotingStore';
import { connectWallet, getCandidates, vote, hasVoted } from './utils/blockchain';
import { getActivePoll, recordVote, getUserVotes, Poll } from './firebase';
import { getCurrentUser } from './firebase';
import { Users, Calendar } from 'lucide-react';

const MotionH2 = motion.h2 as any;
const MotionButton = motion.button as any;
const MotionDiv = motion.div as any;

const VotingInterface = () => {
  const { setCandidates, setHasVoted } = useVotingStore();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [userHasVoted, setUserHasVoted] = useState(false);

  useEffect(() => {
    const loadActivePoll = async () => {
      try {
        const poll = await getActivePoll();
        if (poll) {
          setActivePoll(poll);
          // Check if user has already voted in this poll
          const user = getCurrentUser();
          if (user) {
            const userVotes = await getUserVotes(user.uid);
            const hasVotedInPoll = userVotes.some((v: any) => v.pollId === poll.id);
            setUserHasVoted(hasVotedInPoll);
          }
        }
      } catch (err) {
        console.error('Error loading active poll:', err);
      }
    };

    loadActivePoll();
  }, []);

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
    if (selectedCandidate !== null && !userHasVoted && activePoll) {
      setLoading(true);
      setError(null);
      try {
        // Record vote on blockchain
        await vote(selectedCandidate);

        // Record vote in Firestore
        const user = getCurrentUser();
        if (user) {
          await recordVote(activePoll.id, user.uid, selectedCandidate, userAddress);
        }

        setHasVoted(true);
        setUserHasVoted(true);

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

  if (!activePoll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading active poll...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Poll Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <MotionH2
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {activePoll.title}
          </MotionH2>
          <p className="text-gray-600 mb-4">{activePoll.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {activePoll.candidates.length} candidates
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Ends: {activePoll.endDate.toDate().toLocaleDateString()}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!walletConnected ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600">Connect your MetaMask wallet to participate in secure blockchain voting</p>
            </div>
            <MotionButton
              onClick={handleConnectWallet}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </MotionButton>
          </div>
        ) : (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 font-medium">Wallet Connected</span>
                <span className="text-green-600 ml-2 text-sm">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </span>
              </div>
            </div>

            {userHasVoted ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Vote Submitted Successfully!</h3>
                <p className="text-gray-600 mb-4">Your vote has been recorded on the blockchain and is immutable.</p>
                <div className="bg-white rounded-lg p-4 inline-block">
                  <p className="text-sm text-gray-500">Transaction secured by Ethereum blockchain</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Your Candidate</h3>
                  <p className="text-gray-600 mb-6">Choose the candidate you want to vote for. Your vote will be recorded on the blockchain.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {activePoll.candidates.map((candidateName, index) => (
                    <MotionDiv
                      key={index}
                      className={`p-6 bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
                        selectedCandidate === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      onClick={() => setSelectedCandidate(index)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{candidateName}</h4>
                        {selectedCandidate === index && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Candidate #{index + 1}
                      </div>
                    </MotionDiv>
                  ))}
                </div>

                {selectedCandidate !== null && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Confirm Your Vote</h4>
                      <p className="text-gray-600 mb-4">
                        You have selected: <span className="font-medium text-blue-600">{activePoll.candidates[selectedCandidate]}</span>
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        This action cannot be undone. Your vote will be permanently recorded on the blockchain.
                      </p>
                      <MotionButton
                        onClick={handleVote}
                        disabled={loading}
                        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting Vote...
                          </>
                        ) : (
                          'Submit Vote'
                        )}
                      </MotionButton>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VotingInterface;
