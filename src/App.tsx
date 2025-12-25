import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from './AdminPanel';
import VotingInterface from './VotingInterface';
import Home from './Home';
import Results from './Results';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/vote" element={<VotingInterface />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default App;
