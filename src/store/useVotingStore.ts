import { create } from 'zustand';

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

interface VotingState {
  candidates: Candidate[];
  hasVoted: boolean;
  setCandidates: (candidates: Candidate[]) => void;
  setHasVoted: (hasVoted: boolean) => void;
}

export const useVotingStore = create<VotingState>((set) => ({
  candidates: [],
  hasVoted: false,
  setCandidates: (candidates) => set({ candidates }),
  setHasVoted: (hasVoted) => set({ hasVoted }),
}));