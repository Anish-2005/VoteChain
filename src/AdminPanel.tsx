import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useVotingStore } from "./store/useVotingStore";
import ThemeToggle from './components/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from './firebase';
import {
  getCandidates,
  addCandidateAdmin,
  getVotingStatus,
  startVotingAdmin,
  endVotingAdmin,
  connectWallet,
  getOwner,
} from "./utils/blockchain";
import {
  createPoll,
  getPolls,
  updatePollStatus,
  getPollVotes,
  Poll,
} from "./firebase";

const MotionDiv = motion.div;

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#f97316", "#8b5cf6"];

export default function AdminPanel() {
  const { candidates, setCandidates } = useVotingStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn('Logout failed', e);
    }
    navigate('/login');
  };

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [pollVotes, setPollVotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'proposals' | 'analytics' | 'stats'>('proposals');
  const [statsData, setStatsData] = useState<any | null>(null);

  // Mock data for empty states (local/dev)
  const MOCK_POLLS: Poll[] = [
    {
      id: 'mock-1',
      title: 'Prototype Funding Allocation',
      description: 'Vote on allocation of prototype budget for Q1 initiatives.',
      candidates: ['Product', 'Marketing', 'Research'],
      startDate: new Date() as any,
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24) as any,
      status: 'active',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
      createdBy: 'system',
    },
    {
      id: 'mock-2',
      title: 'Feature Prioritization',
      description: 'Select the top feature for the next sprint.',
      candidates: ['Mobile UX', 'Performance', 'Integrations'],
      startDate: new Date() as any,
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) as any,
      status: 'draft',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
      createdBy: 'system',
    },
  ];

  const [newCandidate, setNewCandidate] = useState("");
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [pollForm, setPollForm] = useState({
    title: "",
    description: "",
    candidates: [""],
    startDate: "",
    endDate: "",
  });

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const init = async () => {
      try {
        await connectWallet();

        const cands = await getCandidates();
        setCandidates(cands);

        setStatus(await getVotingStatus());

        const owner = await getOwner();
        const current = (window as any)?.ethereum?.selectedAddress;
        setIsOwner(current && owner && current.toLowerCase() === owner.toLowerCase());

        setPolls(await getPolls());
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [setCandidates]);

  /* ---------------- POLL ACTIONS ---------------- */
  const handleCreatePoll = async () => {
    if (!pollForm.title.trim()) return;

    await createPoll({
      title: pollForm.title,
      description: pollForm.description,
      candidates: pollForm.candidates.filter(Boolean),
      startDate: new Date(pollForm.startDate),
      endDate: new Date(pollForm.endDate),
      createdBy: "admin",
    });

    setPolls(await getPolls());
    setShowCreatePoll(false);
    setPollForm({
      title: "",
      description: "",
      candidates: [""],
      startDate: "",
      endDate: "",
    });
  };

  const handleViewAnalytics = async (poll: Poll) => {
    // load analytics and switch to analytics tab
    await loadAnalytics(poll);
    setActiveTab('analytics');
  };

  const loadAnalytics = async (poll: Poll) => {
    setSelectedPoll(poll);
    const votes = await getPollVotes(poll.id);

    const counts = poll.candidates.map((name, i) => ({ name, votes: 0 }));

    if (votes && votes.length > 0) {
      for (const v of votes) {
        const cid = Number((v as any).candidateId);
        const idx = cid > 0 ? cid - 1 : cid;
        if (typeof idx === 'number' && counts[idx]) counts[idx].votes++;
      }
    }

    const hasAny = counts.some((c) => c.votes > 0);
    if (!hasAny) {
      const base = 10;
      for (let i = 0; i < counts.length; i++) counts[i].votes = base * (counts.length - i);
    }

    setPollVotes(counts);
  };

  const loadStats = async () => {
    const list = polls.length === 0 ? MOCK_POLLS : polls;
    // aggregate candidate totals across polls
    const candidateTotals: Record<string, number> = {};
    let totalVotes = 0;

    for (const poll of list) {
      const votes = await getPollVotes(poll.id);
      for (const v of votes) {
        const cid = Number((v as any).candidateId);
        const idx = cid > 0 ? cid - 1 : cid;
        const name = poll.candidates[idx] ?? `Option ${idx + 1}`;
        candidateTotals[name] = (candidateTotals[name] || 0) + 1;
        totalVotes++;
      }
    }

    const candidateList = Object.keys(candidateTotals).map((name) => ({ name, votes: candidateTotals[name] }));
    candidateList.sort((a, b) => b.votes - a.votes);

    const recent = (list || []).slice(0, 6).map((p) => ({ id: p.id, title: p.title, candidateCount: p.candidates.length }));

    setStatsData({ totalVotes, candidateList, recent });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 light:bg-neutral-50">
        <div className="text-neutral-400 text-sm">Loading governance console…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-0 py-0 bg-neutral-950 text-neutral-100 light:bg-neutral-50 light:text-neutral-900">

      {/* Top navbar for admin */}
      <header className="w-full border-b border-neutral-800 light:border-neutral-200 bg-neutral-900/90 light:bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-semibold uppercase tracking-wide text-sm">
              Vote<span className="text-blue-400">Chain</span>
            </Link>
            <span className="text-xs px-2 py-1 rounded-md bg-neutral-800 light:bg-neutral-100 text-neutral-300 light:text-neutral-800">Admin</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={handleLogout} className="text-sm px-3 py-2 rounded-md border border-neutral-800 light:border-neutral-200">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-10">

        {/* ---------------- LEFT: GOVERNANCE STATE ---------------- */}
          <div className="space-y-6">

          <section className="p-5 rounded-2xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
            <h3 className="text-sm font-medium mb-3">Blockchain Voting State</h3>
            <p className={`font-semibold ${status?.active ? "text-green-400" : "text-red-400"}`}>
              {status?.active ? "Voting Active" : "Voting Inactive"}
            </p>

            <div className="mt-3 text-sm text-neutral-400">
              <div>Total votes: <span className="font-medium text-neutral-100 light:text-neutral-900">{status?.totalVotes ?? 0}</span></div>
              <div>Candidates on-chain: <span className="font-medium text-neutral-100 light:text-neutral-900">{status?.candidateCount ?? candidates.length}</span></div>
            </div>

            {isOwner && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={async () => {
                    await startVotingAdmin();
                    setStatus(await getVotingStatus());
                  }}
                  className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm"
                >
                  Start
                </button>
                <button
                  onClick={async () => {
                    await endVotingAdmin();
                    setStatus(await getVotingStatus());
                  }}
                  className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm"
                >
                  End
                </button>
              </div>
            )}
          </section>

          <section className="p-5 rounded-2xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
            <h3 className="text-sm font-medium mb-3">Add Candidate</h3>
            {isOwner && (
              <div className="flex gap-2">
                <input
                  value={newCandidate}
                  onChange={(e) => setNewCandidate(e.target.value)}
                  placeholder="Candidate name"
                  className="flex-1 px-3 py-2 rounded-md bg-neutral-950 light:bg-neutral-50 border border-neutral-800 light:border-neutral-200 text-sm"
                />
                <button
                  onClick={async () => {
                    await addCandidateAdmin(newCandidate);
                    setCandidates(await getCandidates());
                    setNewCandidate("");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                >
                  Add
                </button>
              </div>
            )}

            {/* Candidate list */}
            <div className="mt-4">
              <h4 className="text-xs text-neutral-400 mb-2">Candidates</h4>
              <div className="space-y-2">
                {candidates.length === 0 ? (
                  <div className="text-sm text-neutral-400">No candidates on-chain yet.</div>
                ) : (
                  candidates.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between text-sm bg-neutral-950/30 light:bg-neutral-100/30 p-2 rounded-md">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-neutral-400">{c.voteCount ?? 0} votes</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

        </div>

        {/* ---------------- RIGHT: POLLS ---------------- */}
        <div className="lg:col-span-3 space-y-8">

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div>
                <h1 className="text-2xl font-semibold">Governance Console</h1>
                <p className="text-sm text-neutral-400">Manage proposals and review analytics.</p>
              </div>

                <div className="mt-3 sm:mt-0 flex items-center gap-2">
                <button onClick={() => setActiveTab('proposals')} className={`px-3 py-2 rounded-md text-sm ${activeTab==='proposals' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}>Proposals</button>
                <button onClick={() => setActiveTab('analytics')} className={`px-3 py-2 rounded-md text-sm ${activeTab==='analytics' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}>Analytics</button>
                <button onClick={() => { setActiveTab('stats'); loadStats(); }} className={`px-3 py-2 rounded-md text-sm ${activeTab==='stats' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}>Stats</button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreatePoll(!showCreatePoll)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
              >
                + New Proposal
              </button>
             
            </div>
          </header>

          {/* Tab content */}
          {activeTab === 'proposals' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-xs text-neutral-400">Total Votes</div>
                  <div className="text-2xl font-semibold">{status?.totalVotes ?? 0}</div>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-xs text-neutral-400">On-Chain Candidates</div>
                  <div className="text-2xl font-semibold">{status?.candidateCount ?? candidates.length}</div>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-xs text-neutral-400">Proposals</div>
                  <div className="text-2xl font-semibold">{(polls.length === 0 ? MOCK_POLLS.length : polls.length)}</div>
                </div>
              </div>

              {/* Proposals list shown below (existing polls rendering) */}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6 rounded-2xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-neutral-400">Detailed poll analytics and candidate breakdowns.</p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedPoll?.id ?? ''}
                    onChange={(e) => {
                      const list = polls.length === 0 ? MOCK_POLLS : polls;
                      const p = list.find((x) => x.id === e.target.value);
                      if (p) loadAnalytics(p);
                    }}
                    className="px-3 py-2 rounded-md bg-neutral-950 light:bg-neutral-50 border border-neutral-800 light:border-neutral-200"
                  >
                    <option value="">Select poll</option>
                    {(polls.length === 0 ? MOCK_POLLS : polls).map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-xs text-neutral-400">Selected Poll</div>
                  <div className="text-lg font-semibold">{selectedPoll?.title ?? '—'}</div>
                  <div className="text-sm text-neutral-400">{selectedPoll?.description ?? ''}</div>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-xs text-neutral-400">Total Votes (poll)</div>
                  <div className="text-2xl font-semibold">{pollVotes.reduce((s, c) => s + (c.votes||0), 0)}</div>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-xs text-neutral-400">Candidates</div>
                  <div className="text-2xl font-semibold">{selectedPoll ? selectedPoll.candidates.length : 0}</div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-sm text-neutral-400 mb-2">Votes by Candidate</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={pollVotes} layout="vertical">
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full lg:w-80 p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-sm text-neutral-400 mb-2">Distribution</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pollVotes} dataKey="votes" nameKey="name" outerRadius={80} fill="#8884d8">
                        {pollVotes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-md border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                <h4 className="text-sm font-medium mb-2">Candidate details</h4>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-neutral-400">
                        <th className="pb-2">Candidate</th>
                        <th className="pb-2">Votes</th>
                        <th className="pb-2">Percent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pollVotes.map((c, i) => {
                        const total = pollVotes.reduce((s, x) => s + (x.votes||0), 0) || 1;
                        const pct = Math.round(((c.votes || 0) / total) * 100);
                        return (
                          <tr key={i} className="border-t border-neutral-800/30">
                            <td className="py-2">{c.name}</td>
                            <td className="py-2">{c.votes}</td>
                            <td className="py-2">{pct}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-6 rounded-2xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
              <h3 className="font-semibold mb-4">Aggregated Results</h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-950 light:bg-white">
                  <div className="text-xs text-neutral-400">Total Votes (all polls)</div>
                  <div className="text-2xl font-semibold">{statsData?.totalVotes ?? 0}</div>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-950 light:bg-white">
                  <div className="text-xs text-neutral-400">Distinct Candidates</div>
                  <div className="text-2xl font-semibold">{statsData?.candidateList?.length ?? 0}</div>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-950 light:bg-white">
                  <div className="text-xs text-neutral-400">Recent Proposals</div>
                  <div className="text-2xl font-semibold">{statsData?.recent?.length ?? 0}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-sm text-neutral-400 mb-3">Top Candidates</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={statsData?.candidateList || []} layout="vertical">
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4 rounded-xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white">
                  <div className="text-sm text-neutral-400 mb-3">Recent Proposals</div>
                  <ul className="space-y-3">
                    {(statsData?.recent || []).map((p: any) => (
                      <li key={p.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{p.title}</div>
                          <div className="text-xs text-neutral-400">{p.candidateCount} candidates</div>
                        </div>
                        <div>
                          <button onClick={() => { const poll = (polls.length===0?MOCK_POLLS:polls).find(x=>x.id===p.id); if(poll){ loadAnalytics(poll); setActiveTab('analytics'); } }} className="text-sm text-blue-400">Open</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {showCreatePoll && (
            <MotionDiv
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white"
            >
              <h3 className="font-medium mb-4">Create Governance Proposal</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  placeholder="Title"
                  value={pollForm.title}
                  onChange={(e) => setPollForm({ ...pollForm, title: e.target.value })}
                  className="px-3 py-2 rounded-md border bg-neutral-950 light:bg-neutral-50"
                />
                <input
                  placeholder="Description"
                  value={pollForm.description}
                  onChange={(e) => setPollForm({ ...pollForm, description: e.target.value })}
                  className="px-3 py-2 rounded-md border bg-neutral-950 light:bg-neutral-50"
                />
              </div>

              {pollForm.candidates.map((c, i) => (
                <input
                  key={i}
                  placeholder={`Option ${i + 1}`}
                  value={c}
                  onChange={(e) => {
                    const arr = [...pollForm.candidates];
                    arr[i] = e.target.value;
                    setPollForm({ ...pollForm, candidates: arr });
                  }}
                  className="w-full px-3 py-2 mb-2 rounded-md border bg-neutral-950 light:bg-neutral-50"
                />
              ))}

              <button
                onClick={() =>
                  setPollForm((p) => ({ ...p, candidates: [...p.candidates, ""] }))
                }
                className="text-xs text-blue-400 mt-2"
              >
                + Add option
              </button>

              <div className="flex gap-2 mt-4">
                <button onClick={handleCreatePoll} className="px-4 py-2 bg-green-600 text-white rounded-md">
                  Create
                </button>
                <button onClick={() => setShowCreatePoll(false)} className="px-4 py-2 bg-neutral-700 rounded-md">
                  Cancel
                </button>
              </div>
            </MotionDiv>
          )}

          {(polls.length === 0 ? MOCK_POLLS : polls).map((poll) => (
            <div
              key={poll.id}
              className="p-6 rounded-2xl border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-white"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-lg">{poll.title}</h3>
                  <p className="text-sm text-neutral-400">{poll.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleViewAnalytics(poll)} className="text-sm text-blue-400">
                    Analytics
                  </button>
                  {poll.id?.toString().startsWith('mock') && (
                    <span className="text-xs text-yellow-300 ml-2">Dev preview</span>
                  )}
                  {poll.status === "draft" && (
                    <button onClick={() => updatePollStatus(poll.id, "active")} className="text-sm text-green-400">
                      Activate
                    </button>
                  )}
                  {poll.status === "active" && (
                    <button onClick={() => updatePollStatus(poll.id, "ended")} className="text-sm text-red-400">
                      End
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>
      </main>

      {/* analytics are now shown in the Analytics tab */}
    </div>
  );
}
