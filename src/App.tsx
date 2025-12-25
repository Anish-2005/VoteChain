import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from './AdminPanel';
import VotingInterface from './VotingInterface';
import Home from './Home';
import Results from './Results';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div className="p-4 flex justify-end">
        <Auth />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/vote" element={<VotingInterface />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;
