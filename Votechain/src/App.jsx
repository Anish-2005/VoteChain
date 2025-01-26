import React, { useState, useEffect } from "react";

const votingChoices = [
  "Google Search",
  "Google Maps",
  "YouTube",
  "Google Photos",
  "Google Drive"
];

const App = () => {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from local storage
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode) {
      setIsDarkMode(storedMode === "true");
    }
  }, []);

  // Save dark mode preference to local storage
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleVerification = () => {
    if (email.includes("@")) {
      setIsVerified(true);
    } else {
      alert("Please enter a valid email!");
    }
  };

  const handleVote = () => {
    if (!selectedChoice) {
      alert("Please select an option to vote!");
    } else {
      setHasVoted(true);
    }
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"} min-h-screen flex items-center justify-center py-10`}>
      <div className={`max-w-xl w-full p-8 rounded-xl shadow-xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <div className="text-center mb-6">
  <h1 className={`text-4xl font-bold text-transparent bg-clip-text ${isDarkMode ? 'bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500' : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500' } leading-tight`}>
    Voting App
  </h1>
</div>



        <p className="text-lg text-center mb-6">
          Cast your vote for your favorite Google service!
        </p>

        {!isVerified ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="w-full md:w-80 p-3 mb-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleVerification}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300"
            >
              Verify Email
            </button>
          </div>
        ) : hasVoted ? (
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-green-500 mb-4">Thank You for Voting!</h2>
            <p className="text-xl text-gray-600">
              Your vote for <span className="font-bold text-blue-600">{selectedChoice}</span> has been recorded.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Select your favorite Google service:</h2>
            {votingChoices.map((choice, index) => (
              <div key={index} className="flex items-center justify-start mb-4">
                <input
                  type="radio"
                  id={`choice-${index}`}
                  name="vote"
                  value={choice}
                  onChange={() => setSelectedChoice(choice)}
                  className={`mr-3 w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500`}
                />
                <label htmlFor={`choice-${index}`} className="text-lg">{choice}</label>
              </div>
            ))}
            <div className="text-center">
              <button
                onClick={handleVote}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 transition duration-300"
              >
                Vote
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dark/Light Mode Toggle Outside the Box */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-5 right-5 p-3 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700 transition duration-300"
      >
        <span className="material-icons">{isDarkMode ? "dark_mode" : "light_mode"}</span>
      </button>
    </div>
  );
};

export default App;
