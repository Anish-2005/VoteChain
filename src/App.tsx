import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { User } from 'firebase/auth';
import { onAuthChange, logout } from './firebase';
import AdminPanel from './AdminPanel';
import VotingInterface from './VotingInterface';
import Home from './Home';
import Results from './Results';
import Login from './Login';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      if (!user) {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user: User, role: 'user' | 'admin') => {
    setUser(user);
    setUserRole(role);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading VoteChain...</p>
        </div>
      </div>
    );
  }

  if (!user || !userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">VoteChain</h1>
                <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                  userRole === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {userRole === 'admin' ? 'Admin' : 'Voter'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user.displayName}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            {userRole === 'admin' ? (
              <>
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/vote" element={<Navigate to="/admin" replace />} />
                <Route path="/results" element={<Results />} />
              </>
            ) : (
              <>
                <Route path="/vote" element={<VotingInterface />} />
                <Route path="/results" element={<Results />} />
                <Route path="/admin" element={<Navigate to="/vote" replace />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
