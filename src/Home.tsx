import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  
  Lock,
  Zap,
  Globe,
  
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";
import { useNavigate } from 'react-router-dom';
import { logout } from './firebase';
import Blockchain3DScene from "./components/Blockchain3DScene";
import ParticleField from "./components/ParticleField";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const MotionH1 = motion.h1;
const MotionP = motion.p;

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn('Logout failed', e);
    }
    navigate('/login');
  };

  return (
    <div
      className="
      min-h-screen relative overflow-hidden
      bg-neutral-950 text-neutral-100
      light:bg-neutral-50 light:text-neutral-900
      transition-colors duration-300
    "
    >
      {/* Optional visuals */}
      <Blockchain3DScene />
      <ParticleField />

      {/* ---------------- NAVBAR ---------------- */}
      <nav
        className="
        sticky top-0 z-50
        border-b border-neutral-800 light:border-neutral-200
        bg-neutral-950/90 light:bg-neutral-50/90
        backdrop-blur
      "
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-sm font-semibold uppercase tracking-wide">
            Vote<span className="text-blue-500">Chain</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-neutral-400 light:text-neutral-600 hover:text-neutral-200 light:hover:text-neutral-900"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-neutral-400 light:text-neutral-600 hover:text-neutral-200 light:hover:text-neutral-900"
            >
              How it works
            </a>
            <a
              href="#stats"
              className="text-sm text-neutral-400 light:text-neutral-600 hover:text-neutral-200 light:hover:text-neutral-900"
            >
              Stats
            </a>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-2 rounded-md bg-transparent border border-neutral-800 light:border-neutral-200 hover:bg-neutral-900/50 light:hover:bg-neutral-100/50"
            >
              Logout
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md border border-neutral-800 light:border-neutral-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 light:border-neutral-200 px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm">
              Features
            </a>
            <a href="#how-it-works" className="block text-sm">
              How it works
            </a>
            <a href="#stats" className="block text-sm">
              Stats
            </a>
          </div>
        )}
      </nav>

      {/* ---------------- HERO ---------------- */}
      <MotionSection className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8
              rounded-full border border-neutral-800 light:border-neutral-200
              text-sm text-blue-500"
          >
            <Star className="w-4 h-4" />
            Decentralized Governance Platform
          </MotionDiv>

          <MotionH1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            VoteChain
            <span className="block text-neutral-400 light:text-neutral-600 text-3xl md:text-4xl mt-3">
              DAO-grade blockchain voting
            </span>
          </MotionH1>

          <MotionP
            className="text-lg text-neutral-400 light:text-neutral-600 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            A secure, transparent, and decentralized voting system built for
            institutions, communities, and DAOs.
          </MotionP>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/vote"
              className="px-8 py-4 rounded-xl bg-blue-600 text-white font-medium flex items-center gap-3"
            >
              <Users className="w-5 h-5" />
              Start Voting
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/results"
              className="
                px-8 py-4 rounded-xl
                border border-neutral-800 light:border-neutral-200
                text-sm
              "
            >
              View Results
            </Link>
          </div>
        </div>
      </MotionSection>

      {/* ---------------- FEATURES ---------------- */}
      <MotionSection id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Platform Capabilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Immutable Security",
                desc: "All votes are cryptographically signed and permanently recorded.",
              },
              {
                icon: TrendingUp,
                title: "Live Analytics",
                desc: "Real-time participation metrics and voting confidence signals.",
              },
              {
                icon: Globe,
                title: "Global Participation",
                desc: "Permissionless access from anywhere in the world.",
              },
              {
                icon: Zap,
                title: "Instant Finality",
                desc: "Votes are confirmed immediately with on-chain proof.",
              },
              {
                icon: Lock,
                title: "Privacy Preserving",
                desc: "Zero-knowledge mechanisms protect voter identity.",
              },
              {
                icon: Award,
                title: "Smart Contracts",
                desc: "Rules enforced automatically with no intermediaries.",
              },
            ].map((f, i) => (
              <MotionDiv
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="
                  p-8 rounded-2xl
                  border border-neutral-800 light:border-neutral-200
                  bg-neutral-900 light:bg-white
                "
              >
                <f.icon className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-400 light:text-neutral-600">
                  {f.desc}
                </p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* ---------------- STATS ---------------- */}
      <MotionSection
        id="stats"
        className="
          py-24 px-6
          border-t border-neutral-800 light:border-neutral-200
        "
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            ["10K+", "Votes Cast"],
            ["500+", "Elections"],
            ["99.9%", "Uptime"],
            ["50+", "Countries"],
          ].map(([v, l], i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-blue-500 mb-2">{v}</div>
              <div className="text-sm text-neutral-400 light:text-neutral-600">
                {l}
              </div>
            </MotionDiv>
          ))}
        </div>
      </MotionSection>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <MotionSection id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              ["1", "Authenticate", "Secure login via OAuth"],
              ["2", "Vote On-Chain", "Sign and submit via MetaMask"],
              ["3", "Verify Results", "Track live DAO analytics"],
            ].map(([n, t, d]) => (
              <div key={n}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {n}
                </div>
                <h3 className="text-xl font-semibold mb-2">{t}</h3>
                <p className="text-sm text-neutral-400 light:text-neutral-600">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* ---------------- FOOTER ---------------- */}
      <footer
        className="
          border-t border-neutral-800 light:border-neutral-200
          py-12 px-6
        "
      >
        <div className="max-w-7xl mx-auto text-center text-sm text-neutral-500">
          Built with React, Ethereum & Firebase — © 2025 VoteChain
        </div>
      </footer>
    </div>
  );
};

export default Home;
