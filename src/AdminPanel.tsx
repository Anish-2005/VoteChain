import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useVotingStore } from './store/useVotingStore';
import { getCandidates, addCandidateAdmin, getVotingStatus, startVotingAdmin, endVotingAdmin, connectWallet, getOwner } from './utils/blockchain';
import { createPoll, getPolls, updatePollStatus, getPollVotes, Poll } from './firebase';

const MotionDiv = motion.div as any;

const AdminPanel = () => {
  const { candidates, setCandidates } = useVotingStore();
  const [loading, setLoading] = useState(true);
  const [newCandidate, setNewCandidate] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [pollForm, setPollForm] = useState({
    title: '',
    description: '',
    candidates: [''],
    startDate: '',
    endDate: ''
  });
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [pollVotes, setPollVotes] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await connectWallet();
        const cands = await getCandidates();
        setCandidates(cands);
        const s = await getVotingStatus();
        setStatus(s);
        const owner = await getOwner();
        const current = (window as any).ethereum && (window as any).ethereum.selectedAddress ? (window as any).ethereum.selectedAddress : null;
        setIsOwner(current && owner && current.toLowerCase() === owner.toLowerCase());

        // Load polls from Firestore
        const pollsData = await getPolls();
        setPolls(pollsData as Poll[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [setCandidates]);

  const handleCreatePoll = async () => {
    if (!pollForm.title.trim() || !pollForm.candidates.filter(c => c.trim()).length) return;

    try {
      await createPoll({
        title: pollForm.title,
        description: pollForm.description,
        candidates: pollForm.candidates.filter(c => c.trim()),
        startDate: new Date(pollForm.startDate),
        endDate: new Date(pollForm.endDate),
        createdBy: 'admin' // In a real app, this would be the current user ID
      });

      // Reload polls
      const pollsData = await getPolls();
      setPolls(pollsData as Poll[]);

      // Reset form
      setPollForm({
        title: '',
        description: '',
        candidates: [''],
        startDate: '',
        endDate: ''
      });
      setShowCreatePoll(false);
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const handleUpdatePollStatus = async (pollId: string, newStatus: 'draft' | 'active' | 'ended') => {
    try {
      await updatePollStatus(pollId, newStatus);
      const pollsData = await getPolls();
      setPolls(pollsData as Poll[]);
    } catch (error) {
      console.error('Error updating poll status:', error);
    }
  };

  const handleViewPollAnalytics = async (poll: Poll) => {
    setSelectedPoll(poll);
    try {
      const votes = await getPollVotes(poll.id);
      // Process votes for analytics
      const voteCounts = poll.candidates.map((candidate, index) => ({
        name: candidate,
        votes: votes.filter((v: any) => v.candidateId === index).length
      }));
      setPollVotes(voteCounts);
    } catch (error) {
      console.error('Error loading poll analytics:', error);
    }
  };

  const addCandidateField = () => {
    setPollForm(prev => ({
      ...prev,
      candidates: [...prev.candidates, '']
    }));
  };

  const updateCandidate = (index: number, value: string) => {
    setPollForm(prev => ({
      ...prev,
      candidates: prev.candidates.map((c, i) => i === index ? value : c)
    }));
  };

  const removeCandidate = (index: number) => {
    setPollForm(prev => ({
      ...prev,
      candidates: prev.candidates.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage polls and view analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Polls</h3>
            <p className="text-3xl font-bold text-blue-600">{polls.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Polls</h3>
            <p className="text-3xl font-bold text-green-600">{polls.filter(p => p.status === 'active').length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Status</h3>
            <p className={`text-lg font-semibold ${status?.active ? 'text-green-600' : 'text-red-600'}`}>
              {status?.active ? 'Voting Active' : 'Voting Inactive'}
            </p>
          </div>
        </div>

        {/* Create Poll Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreatePoll(!showCreatePoll)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {showCreatePoll ? 'Cancel' : '+ Create New Poll'}
          </button>
        </div>

        {/* Create Poll Form */}
        {showCreatePoll && (
          <MotionDiv
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4">Create New Poll</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={pollForm.title}
                  onChange={(e) => setPollForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Poll title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={pollForm.description}
                  onChange={(e) => setPollForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Poll description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  value={pollForm.startDate}
                  onChange={(e) => setPollForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="datetime-local"
                  value={pollForm.endDate}
                  onChange={(e) => setPollForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Candidates</label>
              {pollForm.candidates.map((candidate, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={candidate}
                    onChange={(e) => updateCandidate(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Candidate ${index + 1}`}
                  />
                  {pollForm.candidates.length > 1 && (
                    <button
                      onClick={() => removeCandidate(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCandidateField}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                + Add Candidate
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreatePoll}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Poll
              </button>
              <button
                onClick={() => setShowCreatePoll(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </MotionDiv>
        )}

        {/* Polls List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Polls Management</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {polls.map((poll) => (
              <div key={poll.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{poll.title}</h3>
                    <p className="text-gray-600 mt-1">{poll.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Status: <span className={`px-2 py-1 rounded-full text-xs ${
                        poll.status === 'active' ? 'bg-green-100 text-green-800' :
                        poll.status === 'ended' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{poll.status}</span></span>
                      <span>Candidates: {poll.candidates.length}</span>
                      <span>Created: {poll.createdAt?.toDate().toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewPollAnalytics(poll)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                    >
                      View Analytics
                    </button>
                    {poll.status === 'draft' && (
                      <button
                        onClick={() => handleUpdatePollStatus(poll.id, 'active')}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                      >
                        Activate
                      </button>
                    )}
                    {poll.status === 'active' && (
                      <button
                        onClick={() => handleUpdatePollStatus(poll.id, 'ended')}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                      >
                        End Poll
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Candidates:</strong> {poll.candidates.join(', ')}
                </div>
              </div>
            ))}
            {polls.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No polls created yet. Create your first poll above.
              </div>
            )}
          </div>
        </div>

        {/* Poll Analytics Modal */}
        {selectedPoll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Analytics: {selectedPoll.title}</h2>
                  <button
                    onClick={() => setSelectedPoll(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Vote Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={pollVotes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="votes" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Vote Share</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pollVotes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="votes"
                        >
                          {pollVotes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Detailed Results</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Candidate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Votes
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pollVotes.map((candidate, index) => {
                          const totalVotes = pollVotes.reduce((sum, c) => sum + c.votes, 0);
                          const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0';
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {candidate.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {candidate.votes}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Blockchain Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Voting Status</h3>
              <p className={`text-lg ${status?.active ? 'text-green-600' : 'text-red-600'}`}>
                {status?.active ? 'Voting is currently active' : 'Voting is currently inactive'}
              </p>
              {isOwner && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={async () => {
                      await startVotingAdmin();
                      const s = await getVotingStatus();
                      setStatus(s);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Start Voting
                  </button>
                  <button
                    onClick={async () => {
                      await endVotingAdmin();
                      const s = await getVotingStatus();
                      setStatus(s);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    End Voting
                  </button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Add Candidate</h3>
              {isOwner && (
                <div className="flex gap-2">
                  <input
                    value={newCandidate}
                    onChange={(e) => setNewCandidate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Candidate name"
                  />
                  <button
                    onClick={async () => {
                      if (newCandidate.trim()) {
                        await addCandidateAdmin(newCandidate.trim());
                        const cands = await getCandidates();
                        setCandidates(cands);
                        setNewCandidate('');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Current Candidates ({candidates.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                  <p className="text-gray-600">Votes: {candidate.voteCount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
