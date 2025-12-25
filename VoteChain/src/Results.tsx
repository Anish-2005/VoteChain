import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVotingStore } from './store/useVotingStore';
import { getCandidates, connectWallet } from './utils/blockchain';

const MotionH2 = motion.h2 as any;
const MotionDiv = motion.div as any;

const Results = () => {
  const { candidates, setCandidates } = useVotingStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);
        // Connect to wallet if not already connected
        await connectWallet();
        const cands = await getCandidates();
        setCandidates(cands);
      } catch (err: any) {
        setError(err.message || 'Failed to load voting results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [setCandidates]);

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading voting results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md">
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <MotionH2
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Voting Results
      </MotionH2>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-center mb-4">Election Summary</h3>
          <p className="text-center text-2xl font-bold text-blue-600">Total Votes: {totalVotes}</p>
          <p className="text-center text-gray-600 mt-2">Live results from the blockchain</p>
        </div>

        <div className="space-y-4">
          {candidates.map((candidate, index) => (
            <MotionDiv
              key={candidate.id}
              className="p-6 bg-white rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{candidate.name}</h3>
                <span className="text-gray-600 font-medium">{candidate.voteCount} votes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <MotionDiv
                  className="bg-blue-600 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></MotionDiv>
              </div>
              <p className="text-right text-sm text-gray-500">
                {totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0}% of total votes
              </p>
            </MotionDiv>
          ))}
        </div>

        {totalVotes === 0 && (
          <div className="text-center mt-8 p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
            <p className="font-medium">No votes have been cast yet.</p>
            <p className="text-sm mt-1">Results will appear here once voting begins.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;