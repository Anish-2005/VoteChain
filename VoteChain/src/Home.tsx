import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white p-6">
      <header className="text-center py-10">
        <motion.h1
           className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-600 leading-snug"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Welcome to the Future of Voting
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 mt-4 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Deployed on Google Cloud | Secured by Blockchain
        </motion.p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 py-10">
        {/* Google Cloud Card */}
        <motion.div
          className="bg-white bg-opacity-40 backdrop-blur-md shadow-xl rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-500 hover:shadow-2xl border-2 border-transparent hover:border-blue-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
                <Cloud />
                Powered by Google Cloud
              </h3>
            </motion.div>
          </div>
          <div className="p-6">
            <p className="text-gray-700">
              Enjoy lightning-fast performance and global scalability with our Google Cloud infrastructure.
            </p>
          </div>
        </motion.div>

        {/* Blockchain Secured Card */}
        <motion.div
          className="bg-white bg-opacity-40 backdrop-blur-md shadow-xl rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-500 hover:shadow-2xl border-2 border-transparent hover:border-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold flex items-center gap-2 text-green-600">
                <ShieldCheck />
                Secured by Blockchain
              </h3>
            </motion.div>
          </div>
          <div className="p-6">
            <p className="text-gray-700">
              Your votes are encrypted and securely stored on the blockchain for unmatched transparency.
            </p>
          </div>
        </motion.div>

        {/* Participate in Polls Card */}
        <motion.div
          className="bg-white bg-opacity-40 backdrop-blur-md shadow-xl rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-500 hover:shadow-2xl border-2 border-transparent hover:border-blue-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold">Participate in Polls</h3>
            </motion.div>
          </div>
          <div className="p-6">
            <p className="text-gray-700">
              Engage in real-time voting and make your voice heard.
            </p>
            <div className="mt-4">
              <Link to="/vote">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-transform transform hover:scale-105">
                  View Active Polls
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Create Your Poll Card */}
        <motion.div
          className="bg-white bg-opacity-40 backdrop-blur-md shadow-xl rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-500 hover:shadow-2xl border-2 border-transparent hover:border-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold">Create Your Poll</h3>
            </motion.div>
          </div>
          <div className="p-6">
            <p className="text-gray-700">
              Start a new poll and gather opinions with ease.
            </p>
            <div className="mt-4">
              <Link to="/admin">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition-transform transform hover:scale-105">
                  Create Poll
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="text-center py-6">
        <div className="flex gap-4 justify-center">
          <Link to="/vote">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Vote Now
            </motion.button>
          </Link>
          <Link to="/results">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Results
            </motion.button>
          </Link>
        </div>
      </div>

      <footer className="text-center py-6 border-t mt-10">
        <p className="text-gray-500 text-sm">&copy; 2025 VoteChain. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
