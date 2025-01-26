import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VotingInterface = () => {
  const [polls, setPolls] = useState([]);
  const [selectedPollIndex, setSelectedPollIndex] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [completedPolls, setCompletedPolls] = useState([]);
  const navigate = useNavigate();

  // Load polls from localStorage
  useEffect(() => {
    const savedPolls = JSON.parse(localStorage.getItem('polls') || '[]');
    setPolls(savedPolls);
  }, []);

  // Redirect to /Home if all polls are completed
  useEffect(() => {
    if (completedPolls.length === polls.length && polls.length > 0) {
      navigate('/');
    }
  }, [completedPolls, polls, navigate]);

  const handleVote = () => {
    if (selectedOption !== null && selectedPollIndex !== null) {
      setCompletedPolls([...completedPolls, selectedPollIndex]);
      setSelectedPollIndex(null);
      setSelectedOption(null);
    } else {
      alert('Please select an option to vote.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Active Polls
      </motion.h2>

      {polls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
                completedPolls.includes(index)
                  ? 'bg-green-100 border-green-500'
                  : 'bg-white border-gray-300'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">{poll.question}</h3>
              {completedPolls.includes(index) ? (
                <p className="text-green-600 font-medium">✔️ Completed</p>
              ) : (
                <>
                  {poll.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={`poll-${index}-option-${optIndex}`}
                        name={`poll-${index}`}
                        value={option}
                        onChange={() => {
                          setSelectedPollIndex(index);
                          setSelectedOption(option);
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`poll-${index}-option-${optIndex}`} className="text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                  <button
                    onClick={handleVote}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={selectedPollIndex !== index}
                  >
                    Submit Vote
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No polls available.</p>
      )}
    </div>
  );
};

export default VotingInterface;
