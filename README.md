# 🗳️ VoteChain - Blockchain Voting Platform

A modern, secure, and transparent voting application built on blockchain technology. VoteChain revolutionizes the voting process by ensuring immutability, transparency, and security through distributed ledger technology.

## 🌟 Features

- **🔒 Blockchain Security**: All votes are encrypted and stored on an immutable blockchain
- **🎨 Modern UI/UX**: Beautiful, responsive design built with React and Tailwind CSS
- **📊 Real-time Results**: Live vote counting and results visualization
- **🔐 Secure Authentication**: Wallet-based authentication for voter verification
- **📱 Mobile Responsive**: Optimized for all devices and screen sizes
- **🌐 Transparent Process**: Complete audit trail for all voting activities
- **⚡ Smart Contracts**: Solidity-based voting contracts on Ethereum

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI framework
- **Tailwind CSS 3.4.10** - Utility-first styling
- **Framer Motion 11.5.6** - Smooth animations and transitions
- **React Router DOM 6.26.1** - Client-side routing
- **Ethers.js 6.16.0** - Ethereum blockchain interaction
- **Zustand 5.0.9** - State management

### Blockchain
- **Solidity 0.8.19** - Smart contract language
- **Hardhat** - Ethereum development environment
- **MetaMask** - Web3 wallet integration
- **Ethereum Networks** - Local, Sepolia testnet, and mainnet support

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/VoteChain.git
   cd VoteChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your RPC URLs and private keys
   ```

4. **Compile smart contracts**
   ```bash
   npm run compile
   ```

5. **Start local blockchain network**
   ```bash
   npm run node
   ```
   This starts a local Hardhat network on `http://127.0.0.1:8545`

6. **Deploy contracts to local network** (in a new terminal)
   ```bash
   npm run deploy:local
   ```

7. **Start the development server**
   ```bash
   npm start
   ```

8. **Open your browser**
   Navigate to `http://localhost:3000` to see the application running.

### Build for Production

```bash
npm run build
# 🗳️ VoteChain — Blockchain Voting Platform

[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE) [![Build](https://img.shields.io/badge/build-frontend-blue)](#)

VoteChain is a modern, secure, and auditable voting platform built on Ethereum-compatible blockchains. It combines a pleasant web UI with Solidity smart contracts to provide an immutable, transparent voting experience.

---

## Table of Contents
- [Why VoteChain?](#why-votechain)
- [Highlights — Blockchain Focus](#highlights--blockchain-focus)
- [Quick Start (Local Dev)](#quick-start-local-dev)
- [Firebase & Auth Notes](#firebase--auth-notes)
- [Architecture & How It Works](#architecture--how-it-works)
- [Project Structure](#project-structure)
- [Admin & Analytics](#admin--analytics)
- [Contributing](#contributing)
- [License](#license)

---

## Why VoteChain?

- Secure: votes are written to an auditable ledger (smart contract) so results can be independently verified.
- Transparent: on-chain state and event logs provide an immutable audit trail.
- Developer-friendly: built with Hardhat, Ethers.js v6, and React + TypeScript for quick iteration.

## Highlights — Blockchain Focus

- Smart contract: `contracts/Voting.sol` holds the voting logic (1-based candidate ids, one-address-one-vote restriction).
- Local-first developer experience: seamless Hardhat local network support (chainId 1337) with auto add/switch UI for MetaMask.
- On-chain results: votes are confirmed by blockchain transactions; frontend reads counts directly from the contract and keeps Firestore in sync for UX convenience.
- Security: smart contract patterns are kept simple and auditable; always run audits before production use.

Tip: For development, MetaMask can be configured to add/switch the local Hardhat network — the app includes helpers that attempt this automatically.

---

## Quick Start (Local Dev)

Prerequisites

- Node.js v16+ and `npm`
- MetaMask extension
- Git

1) Clone and install

```bash
git clone https://github.com/your-username/VoteChain.git
cd VoteChain
npm install
```

2) Copy environment example and fill values

```bash
cp .env.example .env
# Edit .env: set RPC URLs, keys, Firebase envs if using cloud features
```

3) Start Hardhat local node (runs at http://127.0.0.1:8545)

```bash
npm run node
```

4) Deploy contracts to local network (separate terminal)

```bash
npm run deploy:local
```

5) Start the frontend

```bash
npm start
```

6) Open http://localhost:3000 and connect MetaMask to the local network (the app can attempt to add/switch it for you)

Helpful commands

```bash
npm run compile      # compile smart contracts
npm run build        # build frontend for production
```

---

## Firebase & Auth Notes

VoteChain uses Firebase for user sessions and optional polling storage. For full auth and Firestore features:

1. Create a Firebase project and enable Google sign-in.
2. Add `http://localhost:3000` to Authorized domains in Firebase Auth.
3. Populate `.env` with your Firebase config from the console (see `.env.example`).

When Firebase envs are missing, the app will show a helpful message and operate in demo/fallback mode (mock polls/results) so you can still explore the UI and blockchain interactions.

---

## Architecture & How It Works

1. Voter connects wallet (MetaMask) and signs transactions.
2. When a vote is submitted, the frontend calls the deployed `Voting` contract (via `ethers.js`).
3. The contract stores vote counts on-chain; frontend reads counts and displays live results.
4. Firestore is used for a friendly indexed view (optional) and for demo data when Firestore is not configured.

Simple flow diagram

```
User (browser) → MetaMask → Smart Contract (Hardhat / Sepolia / Mainnet)
                       ↳ Event logs → Frontend display / Firestore (optional)
```

Security reminders

- Never expose private keys in the repo or `.env` that you commit.
- Test thoroughly on local or testnets before any mainnet deployment.

---

## Project Structure (brief)

```
src/
├─ components/
│  ├─ AdminPanel.tsx         # Admin + analytics UI
│  ├─ VotingInterface.tsx    # Voting UX (matches home design)
│  └─ Results.tsx            # Results & fallback sample results
├─ contracts/
│  └─ Voting.json            # Deployed ABI & address
├─ utils/
│  └─ blockchain.ts          # Ethers + wallet helpers (add/switch network)
├─ firebase.ts               # Optional Firebase helpers
└─ App.tsx                   # Routes & ProtectedRoute

contracts/
└─ Voting.sol                 # Solidity contract (1-based candidate ids)
```

---

## Admin & Analytics

The `AdminPanel` provides:

- Poll creation and candidate management
- Analytics tab with charts and per-poll breakdown
- Stats tab for aggregated totals and recent polls

When no real data exists (local dev without Firestore), the admin UI shows synthetic demo polls and results to let you explore the analytics and flows.

---

## Visuals & Screenshots

Add screenshots to `public/` (e.g. `public/screenshot-home.png`) and include them here. Example markdown:

```md
![Home screenshot](public/screenshot-home.png)
```

You can also add a short demo GIF to `public/demo.gif` and reference it from the README for a polished project landing.

---

## Contributing

We welcome contributions — please open issues and PRs. Quick guide:

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes, add tests, and update docs
4. Submit a PR and reference an issue if applicable

Guidelines: prefer TypeScript for new components, keep UI responsive, document new public APIs.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file.

---

_This README was updated to highlight the blockchain architecture, local developer workflow (Hardhat + MetaMask), and to provide a cleaner, more visual onboarding experience._

If you'd like, I can also:

- Add badges for CI and coverage
- Add a demo GIF and sample screenshots into `public/`
- Create a short `CONTRIBUTING.md` and `DEVELOPMENT.md` with step-by-step deploy and debug instructions
