import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from './AdminPanel';
import VotingInterface from './VotingInterface';
import Home from './Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/vote" element={<VotingInterface />} />
      </Routes>
    </Router>
  );
};

export default App;
