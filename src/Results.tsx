import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useVotingStore } from "./store/useVotingStore";
import { getCandidates } from "./utils/blockchain";
import { getPolls, getPollVotes, Poll } from "./firebase";
import { BarChart3, Users, Calendar } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

interface PollResult {
  poll: Poll;
  votes: any[];
  voteCounts: { name: string; votes: number; percentage: number }[];
  totalVotes: number;
}

const MotionDiv = motion.div;
const MotionH2 = motion.h2;

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

        // Try to load on-chain candidate snapshot, but do not require wallet connection
        try {
          const cands = await getCandidates();
          setCandidates(cands);
        } catch (e) {
          console.warn('Could not load on-chain candidates:', e);
        }

        const polls = await getPolls();
        const endedPolls = polls.filter((p: Poll) => p.status === 'ended');

        const results: PollResult[] = [];

        for (const poll of endedPolls) {
          const votes = await getPollVotes(poll.id);

          const voteCounts = poll.candidates.map((candidate) => ({
            name: candidate,
            votes: 0,
            percentage: 0,
          }));

          // normalize and count votes; support 1-based candidateId storage
          votes.forEach((v: any) => {
            const cid = Number(v.candidateId);
            const idx = cid > 0 ? cid - 1 : cid; // if stored 1-based, convert to index
            if (typeof idx === 'number' && idx >= 0 && idx < voteCounts.length) {
              voteCounts[idx].votes++;
            }
          });

          const totalVotes = voteCounts.reduce((s, c) => s + c.votes, 0);
          voteCounts.forEach((c) => {
            c.percentage = totalVotes ? (c.votes / totalVotes) * 100 : 0;
          });

          results.push({ poll, votes, voteCounts, totalVotes });
        }

        if (results.length === 0) {
          // Provide demo/sample results to show UI when no real results exist
          const samplePoll: any = {
            id: 'sample-1',
            title: 'Sample: Favorite Programming Language',
            description: 'Demo results to illustrate the results view.',
            candidates: ['JavaScript', 'Python', 'Rust', 'Go'],
            status: 'ended',
            endDate: { toDate: () => new Date() } as any,
          };

          const sampleVotes = [
            { candidateId: 0 },
            { candidateId: 0 },
            { candidateId: 1 },
            { candidateId: 2 },
            { candidateId: 0 },
          ];

          const voteCounts = samplePoll.candidates.map((candidate: string, index: number) => ({
            name: candidate,
            votes: sampleVotes.filter((v: any) => v.candidateId === index).length,
            percentage: 0,
          }));
          const totalVotes = voteCounts.reduce((s: number, c: any) => s + c.votes, 0);
          voteCounts.forEach((c: any) => (c.percentage = totalVotes ? (c.votes / totalVotes) * 100 : 0));

          results.push({ poll: samplePoll, votes: sampleVotes, voteCounts, totalVotes });
        }

        setPollResults(results);
      } catch (err: any) {
        const msg = err?.message || String(err) || 'Unknown error.';
        setError(`Failed to load results. ${msg}`);
      } finally {
        setLoading(false);
      }
    };
    // expose loader on retry
    (window as any).__loadResults = loadResults;

    loadResults();
  }, [setCandidates]);

  // detect incoming selected poll id from navigation state or query string
  const location = useLocation();
  const incomingPollId = (location.state as any)?.pollId || new URLSearchParams(location.search).get('pollId');

  useEffect(() => {
    if (!incomingPollId) return;
    // when pollResults are loaded, if incomingPollId exists, reorder so that poll appears first
    if (pollResults.length === 0) return;
    const idx = pollResults.findIndex(r => r.poll.id === incomingPollId);
    if (idx > 0) {
      const copy = [...pollResults];
      const [item] = copy.splice(idx, 1);
      copy.unshift(item);
      setPollResults(copy);
    }
  }, [incomingPollId, pollResults]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 light:bg-neutral-50">
        <div className="text-sm text-neutral-400">Loading governance results…</div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 light:bg-neutral-50 px-6">
        <div className="max-w-md p-6 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
          <h3 className="font-semibold mb-2">Error loading results</h3>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-md bg-red-600 text-white text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen px-6 py-12
        bg-neutral-950 text-neutral-100
        light:bg-neutral-50 light:text-neutral-900
      "
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-left">
          <Link to="/" className="text-sm text-neutral-400 light:text-neutral-600 hover:text-neutral-200 light:hover:text-neutral-900">← Back</Link>
        </div>

        <MotionH2
          className="text-3xl font-semibold mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Governance Results
        </MotionH2>

        {/* ---------------- NO RESULTS ---------------- */}
        {pollResults.length === 0 && (
          <div className="
            text-center p-10 rounded-2xl
            border border-neutral-800 light:border-neutral-200
            bg-neutral-900 light:bg-white
          ">
            <p className="text-neutral-400 light:text-neutral-600">
              No completed governance proposals yet.
            </p>
          </div>
        )}

        {/* ---------------- POLL RESULTS ---------------- */}
        <div className="space-y-10">
          {pollResults.map((result, pollIndex) => (
            <MotionDiv
              key={result.poll.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pollIndex * 0.1 }}
              className="
                rounded-2xl overflow-hidden
                border border-neutral-800 light:border-neutral-200
                bg-neutral-900 light:bg-white
              "
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-800 light:border-neutral-200">
                <h3 className="text-2xl font-semibold mb-2">
                  {result.poll.title}
                </h3>
                <p className="text-sm text-neutral-400 light:text-neutral-600 mb-4">
                  {result.poll.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-neutral-400 light:text-neutral-600">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    {result.totalVotes} votes
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {result.poll.candidates.length} candidates
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Ended {result.poll.endDate.toDate().toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Results */}
              <div className="p-6 space-y-4">
                {result.voteCounts
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate, index) => (
                    <MotionDiv
                      key={candidate.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="
                        p-4 rounded-xl
                        border border-neutral-800 light:border-neutral-200
                        bg-neutral-950 light:bg-neutral-50
                      "
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <span className="
                            w-7 h-7 rounded-full
                            flex items-center justify-center
                            text-xs font-semibold
                            bg-blue-600/20 text-blue-400
                          ">
                            {index + 1}
                          </span>
                          <span className="font-medium">{candidate.name}</span>
                        </div>

                        <span className="text-sm text-neutral-400">
                          {candidate.votes} votes
                        </span>
                      </div>

                      {/* Bar */}
                      <div className="h-1.5 w-full bg-neutral-800 light:bg-neutral-200 rounded-full overflow-hidden">
                        <MotionDiv
                          initial={{ width: 0 }}
                          animate={{ width: `${candidate.percentage}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-blue-500"
                        />
                      </div>

                      <div className="text-right text-xs text-neutral-500 mt-1">
                        {candidate.percentage.toFixed(1)}%
                      </div>
                    </MotionDiv>
                  ))}

                {result.totalVotes === 0 && (
                  <div className="
                    mt-4 p-4 rounded-lg
                    bg-yellow-500/10 border border-yellow-500/30
                    text-yellow-500 text-sm text-center
                  ">
                    No votes were cast for this proposal.
                  </div>
                )}
              </div>
            </MotionDiv>
          ))}
        </div>

        {/* ---------------- BLOCKCHAIN DATA ---------------- */}
        {candidates.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Live Blockchain Snapshot
            </h3>

            <div
              className="
                p-6 rounded-2xl
                border border-neutral-800 light:border-neutral-200
                bg-neutral-900 light:bg-white
              "
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidates.map((c) => (
                  <div
                    key={c.id}
                    className="
                      p-4 rounded-lg
                      bg-neutral-950 light:bg-neutral-50
                      border border-neutral-800 light:border-neutral-200
                    "
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-neutral-400">
                      On-chain votes: {c.voteCount}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-neutral-500 mt-4">
                On-chain data reflects real-time activity. Results above show
                finalized governance outcomes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
