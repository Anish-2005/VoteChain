import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useVotingStore } from './store/useVotingStore';
import { getCandidates } from './utils/blockchain';

const MotionH2 = motion.h2 as any;
const MotionDiv = motion.div as any;

const Results = () => {
  const { candidates, setCandidates } = useVotingStore();

  useEffect(() => {
    const loadCandidates = async () => {
      const cands = await getCandidates();
      setCandidates(cands);
    };
    loadCandidates();
  }, [setCandidates]);

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

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
        <p className="text-center text-gray-600 mb-8">Total Votes: {totalVotes}</p>
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <MotionDiv
              key={candidate.id}
              className="p-6 bg-white rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{candidate.name}</h3>
                <span className="text-gray-600">{candidate.voteCount} votes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <MotionDiv
                  className="bg-blue-600 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></MotionDiv>
              </div>
              <p className="text-right text-sm text-gray-500 mt-1">
                {totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0}%
              </p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;