import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPanel from './AdminPanel';
import VotingInterface from './VotingInterface';

const App = () => {

  const [isAdmin, setIsAdmin] = useState(false);
  const [polls, setPolls] = useState([]);

  return (
    
    <Router>
      

        <Routes>
          <Route path="/" element={<div className="text-center py-20"><h1 className="text-4xl font-bold">Welcome to the Voting App</h1></div>} />
          <Route path="/admin" element={<AdminPanel setPolls={setPolls} />} />
          <Route path="/vote" element={<VotingInterface polls={polls} />} />
        </Routes>
    
    </Router>
  );
};

export default App;
