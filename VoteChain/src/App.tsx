import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPanel from './AdminPanel';
import VotingInterface from './VotingInterface';
import Home from './Home.jsx';
const App = () => {

  const [isAdmin, setIsAdmin] = useState(false);
  const [polls, setPolls] = useState([]);

  return (
    
    <Router>
      

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel setPolls={setPolls} />} />
          <Route path="/vote" element={<VotingInterface polls={polls} />} />
        </Routes>
    
    </Router>
  );
};

export default App;
