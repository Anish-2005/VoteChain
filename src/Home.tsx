import React, { useState } from 'react';
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
  Award,
  Menu,
  X
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-50 dark:via-blue-50 dark:to-indigo-50 text-white dark:text-gray-900 relative overflow-hidden">
      {/* 3D Background Scene */}
      <Blockchain3DScene />

      {/* Particle Field */}
      <ParticleField />

      {/* Navigation */}
      <nav className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            VoteChain
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors">How It Works</a>
            <a href="#stats" className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors">Statistics</a>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 dark:bg-gray-100/95 backdrop-blur-sm border-t border-slate-700 dark:border-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col space-y-4 p-6">
              <a href="#features" className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors" onClick={() => setIsMenuOpen(false)}>How It Works</a>
              <a href="#stats" className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Statistics</a>
            </div>
          </motion.div>
        )}
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
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              VoteChain
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-gray-300 dark:text-gray-700">Revolution</span>
          </MotionH1>

          <MotionP
            className="text-lg md:text-xl text-gray-300 dark:text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed"
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
            <button
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <Users className="w-6 h-6" />
              Start Voting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <BarChart3 className="w-6 h-6" />
              View Results
            </button>
          </MotionDiv>
        </div>
      </section>

      {/* Features Section */}
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
            <p className="text-xl text-gray-300 dark:text-gray-700 max-w-3xl mx-auto">
              Built on cutting-edge blockchain technology with enterprise-grade security and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blockchain Security */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-gray-100/50 dark:to-gray-200/50 backdrop-blur-sm rounded-2xl p-8 hover:from-cyan-900/20 hover:to-blue-900/20 dark:hover:from-cyan-100/20 dark:hover:to-blue-100/20 border border-slate-700/50 dark:border-gray-300/50 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Quantum Security</h3>
              <p className="text-gray-300 dark:text-gray-700 leading-relaxed mb-4">
                Military-grade encryption with blockchain immutability. Every vote is cryptographically secured and verifiable.
              </p>
              <div className="flex items-center text-cyan-400 dark:text-cyan-600 font-medium">
                <CheckCircle className="w-5 h-5 mr-2" />
                Immutable Records
              </div>
            </MotionDiv>

            {/* Real-time Analytics */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-gray-100/50 dark:to-gray-200/50 backdrop-blur-sm rounded-2xl p-8 hover:from-purple-900/20 hover:to-pink-900/20 dark:hover:from-purple-100/20 dark:hover:to-pink-100/20 border border-slate-700/50 dark:border-gray-300/50 hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Real-time Analytics</h3>
              <p className="text-gray-300 dark:text-gray-700 leading-relaxed mb-4">
                Live voting statistics with advanced data visualization. Track participation and results in real-time.
              </p>
              <div className="flex items-center text-purple-400 dark:text-purple-600 font-medium">
                <BarChart3 className="w-5 h-5 mr-2" />
                Live Dashboard
              </div>
            </MotionDiv>

            {/* Decentralized Access */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-gray-100/50 dark:to-gray-200/50 backdrop-blur-sm rounded-2xl p-8 hover:from-green-900/20 hover:to-emerald-900/20 dark:hover:from-green-100/20 dark:hover:to-emerald-100/20 border border-slate-700/50 dark:border-gray-300/50 hover:border-green-500/30 dark:hover:border-green-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Global Access</h3>
              <p className="text-gray-300 dark:text-gray-700 leading-relaxed mb-4">
                Borderless participation from anywhere in the world. No geographical restrictions or barriers.
              </p>
              <div className="flex items-center text-green-400 dark:text-green-600 font-medium">
                <Award className="w-5 h-5 mr-2" />
                Worldwide Voting
              </div>
            </MotionDiv>

            {/* Instant Verification */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-gray-100/50 dark:to-gray-200/50 backdrop-blur-sm rounded-2xl p-8 hover:from-orange-900/20 hover:to-red-900/20 dark:hover:from-orange-100/20 dark:hover:to-red-100/20 border border-slate-700/50 dark:border-gray-300/50 hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Instant Verification</h3>
              <p className="text-gray-300 dark:text-gray-700 leading-relaxed mb-4">
                Immediate vote confirmation with cryptographic proof. No waiting periods or uncertainty.
              </p>
              <div className="flex items-center text-orange-400 dark:text-orange-600 font-medium">
                <CheckCircle className="w-5 h-5 mr-2" />
                Instant Proof
              </div>
            </MotionDiv>

            {/* Privacy Protection */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-gray-100/50 dark:to-gray-200/50 backdrop-blur-sm rounded-2xl p-8 hover:from-indigo-900/20 hover:to-purple-900/20 dark:hover:from-indigo-100/20 dark:hover:to-purple-100/20 border border-slate-700/50 dark:border-gray-300/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Privacy First</h3>
              <p className="text-gray-300 dark:text-gray-700 leading-relaxed mb-4">
                Zero-knowledge proofs ensure voter privacy while maintaining result integrity and verifiability.
              </p>
              <div className="flex items-center text-indigo-400 dark:text-indigo-600 font-medium">
                <Shield className="w-5 h-5 mr-2" />
                Anonymous Voting
              </div>
            </MotionDiv>

            {/* Smart Contracts */}
            <MotionDiv
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 dark:from-gray-100/50 dark:to-gray-200/50 backdrop-blur-sm rounded-2xl p-8 hover:from-teal-900/20 hover:to-cyan-900/20 dark:hover:from-teal-100/20 dark:hover:to-cyan-100/20 border border-slate-700/50 dark:border-gray-300/50 hover:border-teal-500/30 dark:hover:border-teal-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Smart Contracts</h3>
              <p className="text-gray-300 dark:text-gray-700 leading-relaxed mb-4">
                Self-executing contracts that automatically enforce voting rules and tally results with perfect accuracy.
              </p>
              <div className="flex items-center text-teal-400 dark:text-teal-600 font-medium">
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
          <MotionButton
            className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-xl rounded-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="w-7 h-7" />
            Cast Your Vote Now
            <ArrowRight className="w-6 h-6" />
          </MotionButton>
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
          <MotionButton
            className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-xl rounded-xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="w-7 h-7" />
            Cast Your Vote Now
            <ArrowRight className="w-6 h-6" />
          </MotionButton>
        </div>
      </MotionSection>

      {/* How It Works Section */}
      <MotionSection
        id="how-it-works"
        className="relative z-10 py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              How VoteChain Works
            </h2>
            <p className="text-xl text-gray-300 dark:text-gray-700 max-w-3xl mx-auto">
              Three simple steps to participate in the future of democratic voting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <MotionDiv
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Sign In</h3>
              <p className="text-gray-300 dark:text-gray-700 leading-relaxed">
                Authenticate securely with Google OAuth for instant access to the platform.
              </p>
            </MotionDiv>

            <MotionDiv
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Vote Securely</h3>
              <p className="text-gray-300 dark:text-gray-700 leading-relaxed">
                Cast your vote on the blockchain with MetaMask. Every vote is encrypted and immutable.
              </p>
            </MotionDiv>

            <MotionDiv
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white dark:text-gray-900 mb-4">Track Results</h3>
              <p className="text-gray-300 dark:text-gray-700 leading-relaxed">
                View real-time results and analytics with complete transparency and verifiability.
              </p>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              VoteChain
            </h3>
            <p className="text-gray-400 dark:text-gray-600 max-w-md mx-auto">
              Secure, transparent, decentralized voting for the future of democracy.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
            <button className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors">
              Start Voting
            </button>
            <button className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors">
              View Results
            </button>
            <a href="#features" className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 dark:text-gray-600 hover:text-cyan-400 dark:hover:text-cyan-600 transition-colors">
              How It Works
            </a>
          </div>

          <div className="border-t border-slate-700 dark:border-gray-300 pt-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Built with ❤️ using React, TypeScript, Firebase, and Ethereum
            </p>
            <p className="text-gray-600 dark:text-gray-500 text-xs">
              © 2025 VoteChain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
