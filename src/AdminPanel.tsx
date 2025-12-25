import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVotingStore } from './store/useVotingStore';
import { getCandidates, addCandidateAdmin, getVotingStatus, startVotingAdmin, endVotingAdmin, connectWallet, getOwner } from './utils/blockchain';
import Auth from './components/Auth';

const MotionDiv = motion.div as any;

const AdminPanel = () => {
  const { candidates, setCandidates } = useVotingStore();
  const [loading, setLoading] = useState(true);
  const [newCandidate, setNewCandidate] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        await connectWallet();
        const cands = await getCandidates();
        setCandidates(cands);
        const s = await getVotingStatus();
        setStatus(s);
        const owner = await getOwner();
        const accounts = (window as any).ethereum ? (await (new (window as any).ethers.BrowserProvider((window as any).ethereum)).send('eth_requestAccounts', [])) : [];
        const current = (window as any).ethereum && (window as any).ethereum.selectedAddress ? (window as any).ethereum.selectedAddress : null;
        setIsOwner(current && owner && current.toLowerCase() === owner.toLowerCase());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCandidates();
  }, [setCandidates]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <MotionDiv
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
              <MotionDiv
                key={candidate.id}
                className="p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="font-semibold">{candidate.name}</h4>
                <p>Votes: {candidate.voteCount}</p>
              </MotionDiv>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Vote Distribution</h3>
          <div className="mb-4">
            <strong>Voting Active:</strong> {status ? (status.active ? 'Yes' : 'No') : '—'}
            <div className="mt-2">
              {isOwner && (
                <div className="flex gap-2">
                  <button onClick={async () => { await startVotingAdmin(); const s = await getVotingStatus(); setStatus(s); }} className="px-3 py-2 bg-green-600 text-white rounded">Start Voting</button>
                  <button onClick={async () => { await endVotingAdmin(); const s = await getVotingStatus(); setStatus(s); }} className="px-3 py-2 bg-red-600 text-white rounded">End Voting</button>
                </div>
              )}
            </div>
          </div>
          {isOwner && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Add Candidate</h4>
              <div className="flex gap-2">
                <input value={newCandidate} onChange={(e) => setNewCandidate(e.target.value)} className="px-3 py-2 border rounded flex-1" placeholder="Candidate name" />
                <button onClick={async () => { if (newCandidate.trim()) { await addCandidateAdmin(newCandidate.trim()); const cands = await getCandidates(); setCandidates(cands); setNewCandidate(''); } }} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
              </div>
            </div>
          )}
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
      </MotionDiv>
    </div>
  );
};

export default AdminPanel;
