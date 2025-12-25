import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  BarChart3,
  Lock,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import Blockchain3DScene from './components/Blockchain3DScene';
import ThemeToggle from './components/ThemeToggle';
import ParticleField from './components/ParticleField';

const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionSection = motion.section as any;

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 text-white relative overflow-hidden">
      {/* 3D Background Scene */}
      <Blockchain3DScene />

      {/* Particle Field */}
      <ParticleField />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            VoteChain
          </motion.div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#stats" className="text-gray-300 hover:text-cyan-400 transition-colors">Statistics</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Next-Generation Blockchain Voting
            </div>
          </MotionDiv>

          <MotionH1
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              VoteChain
            </span>
            <br />
            <span className="text-4xl md:text-6xl text-gray-300">Revolution</span>
          </MotionH1>

          <MotionP
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the future of democratic participation with our cutting-edge blockchain-powered voting platform.
            Secure, transparent, and decentralized - where every vote matters.
          </MotionP>

          <MotionDiv
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/vote">
              <MotionButton
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-6 h-6" />
                Start Voting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </MotionButton>
            </Link>
            <Link to="/results">
              <MotionButton
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="w-6 h-6" />
                View Results
              </MotionButton>
            </Link>
          </MotionDiv>
        </div>
      </section>

      {/* Features Grid */}
      <MotionSection
        id="features"
        className="relative z-10 py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on cutting-edge blockchain technology with enterprise-grade security and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blockchain Security */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:from-cyan-900/20 hover:to-blue-900/20 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Quantum Security</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Military-grade encryption with blockchain immutability. Every vote is cryptographically secured and verifiable.
              </p>
              <div className="flex items-center text-cyan-400 font-medium">
                <CheckCircle className="w-5 h-5 mr-2" />
                Immutable Records
              </div>
            </MotionDiv>

            {/* Real-time Analytics */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:from-purple-900/20 hover:to-pink-900/20 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-time Analytics</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Live voting statistics with advanced data visualization. Track participation and results in real-time.
              </p>
              <div className="flex items-center text-purple-400 font-medium">
                <BarChart3 className="w-5 h-5 mr-2" />
                Live Dashboard
              </div>
            </MotionDiv>

            {/* Decentralized Access */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:from-green-900/20 hover:to-emerald-900/20 border border-slate-700/50 hover:border-green-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Global Access</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Borderless participation from anywhere in the world. No geographical restrictions or barriers.
              </p>
              <div className="flex items-center text-green-400 font-medium">
                <Award className="w-5 h-5 mr-2" />
                Worldwide Voting
              </div>
            </MotionDiv>

            {/* Instant Verification */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:from-orange-900/20 hover:to-red-900/20 border border-slate-700/50 hover:border-orange-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instant Verification</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Immediate vote confirmation with cryptographic proof. No waiting periods or uncertainty.
              </p>
              <div className="flex items-center text-orange-400 font-medium">
                <CheckCircle className="w-5 h-5 mr-2" />
                Instant Proof
              </div>
            </MotionDiv>

            {/* Privacy Protection */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:from-indigo-900/20 hover:to-purple-900/20 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Privacy First</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Zero-knowledge proofs ensure voter privacy while maintaining result integrity and verifiability.
              </p>
              <div className="flex items-center text-indigo-400 font-medium">
                <Shield className="w-5 h-5 mr-2" />
                Anonymous Voting
              </div>
            </MotionDiv>

            {/* Smart Contracts */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 hover:from-teal-900/20 hover:to-cyan-900/20 border border-slate-700/50 hover:border-teal-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Contracts</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Self-executing contracts that automatically enforce voting rules and tally results with perfect accuracy.
              </p>
              <div className="flex items-center text-teal-400 font-medium">
                <Zap className="w-5 h-5 mr-2" />
                Automated Rules
              </div>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      {/* Statistics Section */}
      <MotionSection
        id="stats"
        className="relative z-10 py-20 px-6 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            By the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <MotionDiv
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-6xl font-bold text-cyan-400 mb-2">10K+</div>
              <div className="text-gray-300">Votes Cast</div>
            </MotionDiv>
            <MotionDiv
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-6xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-300">Elections</div>
            </MotionDiv>
            <MotionDiv
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-6xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </MotionDiv>
            <MotionDiv
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-6xl font-bold text-orange-400 mb-2">50+</div>
              <div className="text-gray-300">Countries</div>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      {/* CTA Section */}
      <MotionSection
        className="relative z-10 py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Ready to Shape the Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of voters who have already experienced the future of democratic participation.
          </p>
          <Link to="/vote">
            <MotionButton
              className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-xl rounded-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-7 h-7" />
              Cast Your Vote Now
              <ArrowRight className="w-6 h-6" />
            </MotionButton>
          </Link>
        </div>
      </MotionSection>

      {/* Features Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* User-Friendly Interface */}
          <MotionDiv
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
            transition={{ duration: 0.6, delay: 0.4 }}
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
      </main>

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
