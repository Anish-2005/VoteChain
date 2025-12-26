import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import VotingInterface from './VotingInterface';
import Results from './Results';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vote" element={<VotingInterface />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
