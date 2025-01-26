import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      navigate('/Home');
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
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Active Polls</h2>

      {polls.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {polls.map((poll, index) => (
            <div
              key={index}
              className={`p-6 border rounded-lg shadow-lg ${
                completedPolls.includes(index) ? 'bg-green-100' : 'bg-white'
              }`}
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
                      <label htmlFor={`poll-${index}-option-${optIndex}`}>{option}</label>
                    </div>
                  ))}
                  <button
                    onClick={handleVote}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={selectedPollIndex !== index}
                  >
                    Submit Vote
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No polls available.</p>
      )}
    </div>
  );
};

export default VotingInterface;
