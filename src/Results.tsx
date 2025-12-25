import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVotingStore } from './store/useVotingStore';
import { getCandidates, connectWallet } from './utils/blockchain';
import { getPolls, getPollVotes, Poll } from './firebase';

interface PollResult {
  poll: Poll;
  votes: any[];
  voteCounts: { name: string; votes: number; percentage: number }[];
  totalVotes: number;
}

const MotionH2 = motion.h2 as any;
const MotionDiv = motion.div as any;

const Results = () => {
  const { candidates, setCandidates } = useVotingStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollResults, setPollResults] = useState<PollResult[]>([]);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Connect to wallet for blockchain data
        await connectWallet();
        const cands = await getCandidates();
        setCandidates(cands);

        // Load polls from Firestore
        const polls = await getPolls();
        const endedPolls = polls.filter((p: Poll) => p.status === 'ended');

        // Load vote data for each ended poll
        const results: PollResult[] = [];
        for (const poll of endedPolls) {
          const votes = await getPollVotes(poll.id);
          const voteCounts = poll.candidates.map((candidate, index) => ({
            name: candidate,
            votes: votes.filter((v: any) => v.candidateId === index).length,
            percentage: 0
          }));

          const totalVotes = voteCounts.reduce((sum, c) => sum + c.votes, 0);
          voteCounts.forEach(c => {
            c.percentage = totalVotes > 0 ? (c.votes / totalVotes) * 100 : 0;
          });

          results.push({
            poll,
            votes,
            voteCounts,
            totalVotes
          });
        }

        setPollResults(results);
      } catch (err: any) {
        console.error('Error loading results:', err);
        let errorMessage = 'Failed to load results. ';

        if (err.message?.includes('Chain ID: 1337')) {
          errorMessage += 'Please connect MetaMask to the local Hardhat network (localhost:8545, Chain ID: 1337).';
        } else if (err.message?.includes('Please install MetaMask')) {
          errorMessage += 'Please install MetaMask browser extension.';
        } else if (err.message?.includes('decode result data')) {
          errorMessage += 'Blockchain connection issue. Please ensure Hardhat node is running and MetaMask is connected to localhost:8545.';
        } else {
          errorMessage += err.message || 'Unknown error occurred.';
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [setCandidates]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading voting results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-md">
            <h3 className="font-semibold mb-2">Error Loading Results</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <MotionH2
          className="text-3xl font-bold text-gray-900 mb-6 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Election Results
        </MotionH2>

        {pollResults.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Elections</h3>
            <p className="text-gray-600">Results will appear here once polls are completed.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pollResults.map((result, pollIndex) => (
              <MotionDiv
                key={result.poll.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: pollIndex * 0.1 }}
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{result.poll.title}</h3>
                  <p className="text-gray-600 mb-4">{result.poll.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📊 {result.totalVotes} total votes</span>
                    <span>🗳️ {result.poll.candidates.length} candidates</span>
                    <span>📅 Ended: {result.poll.endDate.toDate().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {result.voteCounts
                      .sort((a, b) => b.votes - a.votes)
                      .map((candidate, index) => (
                      <MotionDiv
                        key={candidate.name}
                        className="p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </span>
                            <h4 className="text-lg font-semibold text-gray-900">{candidate.name}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">{candidate.votes}</span>
                            <span className="text-sm text-gray-500 ml-1">votes</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <MotionDiv
                            className={`h-3 rounded-full ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-500' :
                              index === 2 ? 'bg-orange-500' :
                              'bg-blue-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${candidate.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          ></MotionDiv>
                        </div>
                        <p className="text-right text-sm text-gray-600">
                          {candidate.percentage.toFixed(1)}% of total votes
                        </p>
                      </MotionDiv>
                    ))}
                  </div>

                  {result.totalVotes === 0 && (
                    <div className="text-center mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 font-medium">No votes were cast in this election.</p>
                    </div>
                  )}
                </div>
              </MotionDiv>
            ))}
          </div>
        )}

        {/* Blockchain Results Section */}
        {candidates.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Live Blockchain Data</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Current Blockchain Candidates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                    <p className="text-gray-600">Blockchain Votes: {candidate.voteCount}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Note: Blockchain data shows real-time voting activity. Poll results above show finalized election data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;