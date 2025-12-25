// Firebase setup - reads config from REACT_APP_* environment variables
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ''
};

const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser and when measurementId present
let analytics: ReturnType<typeof getAnalytics> | null = null;
try {
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (e) {
  // analytics may fail in some environments; ignore
}

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export const loginWithGoogle = async () => {
  return signInWithPopup(auth, provider);
};

export const logout = async () => {
  return signOut(auth);
};

export const onAuthChange = (cb: (user: User | null) => void) => {
  return onAuthStateChanged(auth, cb);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

// Firestore functions
export const createPoll = async (pollData: {
  title: string;
  description: string;
  candidates: string[];
  startDate: Date;
  endDate: Date;
  createdBy: string;
}) => {
  const pollRef = doc(collection(db, 'polls'));
  await setDoc(pollRef, {
    ...pollData,
    id: pollRef.id,
    status: 'draft',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return pollRef.id;
};

export const getPolls = async () => {
  const pollsRef = collection(db, 'polls');
  const q = query(pollsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getActivePoll = async () => {
  const pollsRef = collection(db, 'polls');
  const q = query(pollsRef, where('status', '==', 'active'));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0 ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null;
};

export const updatePollStatus = async (pollId: string, status: 'draft' | 'active' | 'ended') => {
  const pollRef = doc(db, 'polls', pollId);
  await updateDoc(pollRef, {
    status,
    updatedAt: Timestamp.now()
  });
};

export const recordVote = async (pollId: string, userId: string, candidateId: number, walletAddress: string) => {
  const voteRef = doc(collection(db, 'votes'));
  await setDoc(voteRef, {
    pollId,
    userId,
    candidateId,
    walletAddress,
    timestamp: Timestamp.now()
  });
};

export const getUserVotes = async (userId: string) => {
  const votesRef = collection(db, 'votes');
  const q = query(votesRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPollVotes = async (pollId: string) => {
  const votesRef = collection(db, 'votes');
  const q = query(votesRef, where('pollId', '==', pollId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const setUserRole = async (userId: string, role: 'user' | 'admin') => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    role,
    updatedAt: Timestamp.now()
  }, { merge: true });
};

export const getUserRole = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  return userDoc.exists() ? userDoc.data()?.role : 'user';
};

export { db, analytics };

export default auth;
