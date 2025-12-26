import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";

import { useVotingStore } from "./store/useVotingStore";
import { ethers } from 'ethers';
import { connectWallet, getCandidates, vote, hasVoted, addLocalNetwork } from "./utils/blockchain";
import { Timestamp } from 'firebase/firestore';
import {
  getActivePoll,
  recordVote,
  getUserVotes,
  Poll,
} from "./firebase";
import { getCurrentUser } from "./firebase";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const VotingInterface = () => {
  const { candidates, setCandidates, setHasVoted } = useVotingStore();

  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- LOAD POLL ---------------- */
  useEffect(() => {
    const loadPoll = async () => {
      const poll = await getActivePoll();
      if (!poll) return;

      setActivePoll(poll);
      const user = getCurrentUser();
      if (user) {
        const votes = await getUserVotes(user.uid);
        setUserHasVoted(votes.some((v: any) => v.pollId === poll.id));
      }
    };

    loadPoll();
  }, []);

  /* ---------------- LOAD CANDIDATES ---------------- */
  useEffect(() => {
    if (!walletConnected) return;
    getCandidates().then(setCandidates).catch(() => {
      setError("Unable to load candidates");
    });
  }, [walletConnected, setCandidates]);

  /* ---------------- SYNTHETIC ACTIVE POLL (local dev) ---------------- */
  useEffect(() => {
    if (activePoll) return;
    if (!walletConnected) return;
    if (!candidates || candidates.length === 0) return;

    try {
      const poll: Poll = {
        id: 'local-sample',
        title: 'Local Sample Poll (on-chain)',
        description: 'Sample poll generated from on-chain candidates for local testing.',
        candidates: candidates.map((c: any) => c.name || `Candidate ${c.id}`),
        startDate: Timestamp.fromDate(new Date()),
        endDate: Timestamp.fromDate(new Date(Date.now() + 1000 * 60 * 60 * 24)),
        status: 'active',
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        createdBy: 'local'
      } as Poll;

      setActivePoll(poll);
    } catch (e) {
      console.warn('Could not synthesize local poll', e);
    }
  }, [walletConnected, candidates, activePoll]);

  /* ---------------- WALLET ---------------- */
  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      await connectWallet();
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setUserAddress(address);
      setWalletConnected(true);
      setHasVoted(await hasVoted(address));
    } catch (e: any) {
      setError(e.message || "Wallet connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocalNetwork = async () => {
    setLoading(true);
    setError(null);
    try {
      await addLocalNetwork();
      // after adding, try to switch/connect
      await connectWallet();
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);
      setWalletConnected(true);
      setHasVoted(await hasVoted(address));
    } catch (e: any) {
      setError(e.message || 'Failed to add/switch network');
    } finally {
      setLoading(false);
    }
  };

  // Debug: log relevant state when it changes to help diagnose disabled button
  useEffect(() => {
    try {
      console.log('VotingInterface state: ' + JSON.stringify({
        walletConnected,
        userAddress,
        userHasVoted,
        selectedCandidate,
        loading,
        error,
        activePollExists: !!activePoll,
        activePollCandidates: activePoll?.candidates?.length ?? 0,
      }, null, 2));
    } catch (e) {
      console.log('VotingInterface state (could not stringify)', {
        walletConnected,
        userAddress,
        userHasVoted,
        selectedCandidate,
        loading,
        error,
        activePollExists: !!activePoll,
      });
    }
  }, [walletConnected, userAddress, userHasVoted, selectedCandidate, loading, error, activePoll]);

  /* ---------------- VOTE ---------------- */
  const handleVote = async () => {
    if (selectedCandidate === null || !activePoll) return;

    setLoading(true);
    try {
      // Contract uses 1-based candidate ids; prefer on-chain id if available
      const onChainId = (candidates[selectedCandidate] as any)?.id ?? (selectedCandidate + 1);
      await vote(onChainId);

      const user = getCurrentUser();
      if (user) {
        await recordVote(
          activePoll.id,
          user.uid,
          onChainId,
          userAddress
        );
      }

      setUserHasVoted(true);
    } catch (e: any) {
      // MetaMask/ethers user rejection produces error code 4001
      if (
        e &&
        (e.code === 4001 || e?.error?.code === 4001 || (e?.data && e.data?.code === 4001))
      ) {
        setError('Transaction rejected by user. You can retry.');
      } else {
        setError(e?.message || 'Vote submission failed');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CONFIDENCE ---------------- */
  const maxVotes = Math.max(
    ...candidates.map((c: any) => c.voteCount || 1),
    1
  );

  return (
    <div className="
      min-h-screen
      bg-neutral-950 text-neutral-100
      light:bg-neutral-50 light:text-neutral-900
      transition-colors duration-300
    ">
      {/* ---------------- NAVBAR ---------------- */}
      <nav className="
        border-b border-neutral-800
        light:border-neutral-200
        bg-neutral-950/90 light:bg-neutral-50/90
        backdrop-blur
      ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-sm font-semibold uppercase tracking-wide">
            Vote<span className="text-blue-500">Chain</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-neutral-400 light:text-neutral-600 hover:text-neutral-200 light:hover:text-neutral-900"
            >
              Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ---------------- MAIN GRID ---------------- */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ---------------- LEFT : DAO CONTEXT ---------------- */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            lg:col-span-1 rounded-2xl p-6
            bg-neutral-900 light:bg-white
            border border-neutral-800 light:border-neutral-200
          "
        >
          <h2 className="text-xl font-semibold mb-2">
            {activePoll?.title || "DAO Governance Proposal"}
          </h2>

          <p className="text-sm text-neutral-400 light:text-neutral-600 mb-6 leading-relaxed">
            {activePoll?.description ||
              "This proposal is governed via decentralized consensus."}
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-neutral-400 light:text-neutral-600">
              <span>Status</span>
              <span className="text-green-500">Active</span>
            </div>
            <div className="flex justify-between text-neutral-400 light:text-neutral-600">
              <span>Candidates</span>
              <span>{activePoll?.candidates.length ?? 0}</span>
            </div>
                <div className="flex justify-between text-neutral-400 light:text-neutral-600">
                  <span>Ends</span>
                  <span>{activePoll?.endDate ? activePoll.endDate.toDate().toLocaleDateString() : '—'}</span>
                </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800 light:border-neutral-200 text-xs text-neutral-500">
            Votes are cryptographically signed and immutable.
          </div>
        </MotionDiv>

        {/* ---------------- RIGHT : DAO ACTION ---------------- */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
            lg:col-span-2 rounded-2xl p-8
            bg-neutral-900 light:bg-white
            border border-neutral-800 light:border-neutral-200
          "
        >
          {/* Wallet */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-neutral-400 light:text-neutral-600">
              {walletConnected ? "Wallet Connected" : "Wallet Disconnected"}
            </span>

            {walletConnected ? (
              <span className="font-mono text-xs text-neutral-500">
                {userAddress.slice(0, 6)}…{userAddress.slice(-4)}
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <MotionButton
                  onClick={handleConnectWallet}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
                >
                  Connect Wallet
                </MotionButton>
                <MotionButton
                  onClick={handleAddLocalNetwork}
                  className="px-3 py-2 rounded-md bg-transparent text-sm border border-neutral-                  npm run node700 light:border-neutral-200"
                >
                  Add/Switch Local Network
                </MotionButton>
              </div>
            )}
          </div>

          {/* VOTED */}
          {userHasVoted && (
            <div className="
              p-6 rounded-xl text-center
              border border-green-600/30
              bg-green-600/10 text-green-500
            ">
              Your vote has been recorded on-chain.
            </div>
          )}

          {/* VOTING */}
          {!userHasVoted && (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Cast Your Governance Vote
              </h3>

              <div className="space-y-3">
                {activePoll?.candidates.map((name, index) => {
                  const votes = (candidates[index] as any)?.voteCount || 0;
                  const confidence = Math.round((votes / maxVotes) * 100);

                  return (
                    <MotionDiv
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedCandidate(index)}
                      className={`
                        p-4 rounded-xl cursor-pointer border transition
                        ${
                          selectedCandidate === index
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-neutral-800 light:border-neutral-200 hover:border-neutral-600"
                        }
                      `}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{name}</span>
                        <span className="text-xs text-neutral-400 light:text-neutral-600">
                          Confidence: {confidence}%
                        </span>
                      </div>

                      <div className="h-1.5 bg-neutral-800 light:bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </MotionDiv>
                  );
                })}
              </div>

              {/* SUBMIT */}
              <div className="mt-8 flex justify-between items-center border-t border-neutral-800 light:border-neutral-200 pt-6">
                <p className="text-xs text-neutral-500 max-w-sm">
                  Submitting your vote is irreversible and final.
                </p>

                <MotionButton
                  onClick={handleVote}
                  disabled={selectedCandidate === null || loading}
                  className="
                    px-6 py-3 rounded-lg
                    bg-blue-600 text-white text-sm
                    disabled:opacity-40
                  "
                >
                  Submit Vote
                </MotionButton>
              </div>
            </>
          )}

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </MotionDiv>
      </div>
    </div>
  );
};

export default VotingInterface;
