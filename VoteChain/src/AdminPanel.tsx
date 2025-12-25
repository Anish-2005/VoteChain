import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVotingStore } from './store/useVotingStore';
import { getCandidates } from './utils/blockchain';

const AdminPanel = () => {
  const { candidates, setCandidates } = useVotingStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCandidates = async () => {
      const cands = await getCandidates();
      setCandidates(cands);
      setLoading(false);
    };
    loadCandidates();
  }, [setCandidates]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <motion.div
        className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Voting Results</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Candidates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                className="p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="font-semibold">{candidate.name}</h4>
                <p>Votes: {candidate.voteCount}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Vote Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={candidates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="voteCount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
