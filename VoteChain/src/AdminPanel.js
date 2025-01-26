import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [correctCount, setCorrectCount] = useState(1);
  const [polls, setPolls] = useState([]);

  // Load polls from localStorage on component mount
  useEffect(() => {
    try {
      const savedPolls = JSON.parse(localStorage.getItem('polls'));
      setPolls(Array.isArray(savedPolls) ? savedPolls : []);
    } catch (error) {
      console.error('Error parsing polls from localStorage:', error);
      setPolls([]);
    }
  }, []);
  // Handle changes to the poll question
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  // Handle changes to the options
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Add a new option
  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  // Remove an option
  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Handle changes to the number of correct answers
  const handleCorrectCountChange = (e) => {
    const value = Math.min(e.target.value, options.length);
    setCorrectCount(value);
  };

  // Submit the poll
  const handleSubmit = () => {
    if (options.every((option) => option.trim() !== '') && correctCount <= options.length) {
      const newPoll = { question, options, correctCount };
      try {
        const updatedPolls = [...polls, newPoll];
        setPolls(updatedPolls);
        localStorage.setItem('polls', JSON.stringify(updatedPolls));

        // Reset form
        setQuestion('');
        setOptions(['']);
        setCorrectCount(1);
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        alert('An error occurred while saving the poll.');
      }
    } else {
      alert('Please fill in all options and ensure correct count is less than or equal to total options.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold text-center mb-6">Create a New Poll</h2>
      <input
        type="text"
        placeholder="Poll Question"
        value={question}
        onChange={handleQuestionChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {options.map((option, index) => (
        <div key={index} className="flex items-center mb-4">
          <input
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {options.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveOption(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          )}
        </div>
      ))}
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={handleAddOption}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <span className="mr-2">+</span>
          Add Option
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="correctCount" className="block text-sm font-medium text-gray-700">
          Number of Correct Options
        </label>
        <input
          type="number"
          id="correctCount"
          value={correctCount}
          onChange={handleCorrectCountChange}
          min="1"
          max={options.length}
          className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create Poll
      </button>

      {/* Active Polls Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Active Polls</h3>
        {polls.length > 0 ? (
          polls.map((poll, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-300 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">{poll.question}</h4>
              <ul className="list-disc pl-5">
                {poll.options.map((option, i) => (
                  <li key={i} className="mb-1">
                    {option}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                Correct Options Allowed: {poll.correctCount}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No active polls available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
