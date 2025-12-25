import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud, ShieldCheck, Users, BarChart3, Lock, Zap } from 'lucide-react';

const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <header className="text-center py-16 px-6">
        <MotionH1
          className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          VoteChain
        </MotionH1>
        <MotionP
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Secure, transparent, and decentralized voting powered by blockchain technology and Firebase
        </MotionP>
        <MotionDiv
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/vote">
            <MotionButton
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-5 h-5" />
              Start Voting
            </MotionButton>
          </Link>
          <Link to="/results">
            <MotionButton
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 className="w-5 h-5" />
              View Results
            </MotionButton>
          </Link>
        </MotionDiv>
      </header>

      {/* Features Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blockchain Security */}
          <MotionDiv
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Blockchain Security</h3>
            <p className="text-gray-600 leading-relaxed">
              Every vote is recorded on the Ethereum blockchain, ensuring complete transparency and immutability. No vote can be altered or deleted.
            </p>
          </MotionDiv>

          {/* Firebase Authentication */}
          <MotionDiv
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Authentication</h3>
            <p className="text-gray-600 leading-relaxed">
              Google OAuth integration provides secure login for both voters and administrators. Role-based access ensures proper permissions.
            </p>
          </MotionDiv>

          {/* Real-time Analytics */}
          <MotionDiv
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Comprehensive dashboards for administrators with live vote tracking, detailed analytics, and comprehensive reporting tools.
            </p>
          </MotionDiv>

          {/* Decentralized Storage */}
          <MotionDiv
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
              <Cloud className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Cloud Infrastructure</h3>
            <p className="text-gray-600 leading-relaxed">
              Scalable Firebase backend handles user data, poll management, and real-time updates with global availability and high reliability.
            </p>
          </MotionDiv>

          {/* User-Friendly Interface */}
          <MotionDiv
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Intuitive Experience</h3>
            <p className="text-gray-600 leading-relaxed">
              Clean, modern interface designed for accessibility. Whether you're voting or managing polls, the experience is smooth and straightforward.
            </p>
          </MotionDiv>

          {/* Lightning Fast */}
          <MotionDiv
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">
              Optimized performance with fast loading times and instant vote confirmation. Built with modern web technologies for the best user experience.
            </p>
          </MotionDiv>
        </div>

        {/* How It Works Section */}
        <MotionDiv
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold mb-6">How VoteChain Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign In</h3>
              <p className="text-blue-100">Authenticate securely with Google OAuth</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vote Securely</h3>
              <p className="text-blue-100">Cast your vote on the blockchain with MetaMask</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Results</h3>
              <p className="text-blue-100">View real-time results and analytics</p>
            </div>
          </div>
        </MotionDiv>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            Built with ❤️ using React, TypeScript, Firebase, and Ethereum
          </p>
          <p className="text-sm text-gray-500">
            © 2025 VoteChain. Secure, transparent, decentralized voting for the future.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
