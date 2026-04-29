<div align="center">

# FundChain

### Decentralized Crowdfunding Platform on Ethereum

[![Live Demo](https://img.shields.io/badge/Live_Demo-fundchain--livid.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://fundchain-livid.vercel.app)
[![Ethereum](https://img.shields.io/badge/Network-Sepolia_Testnet-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://sepolia.etherscan.io/address/0xeD4EcC76f28e47Ba4bb2c8f63fA79d0b57066bAa)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A fully decentralized, trustless crowdfunding platform where anyone can create campaigns, contribute ETH, and receive automatic refunds — all governed by smart contracts with zero platform fees.**

[Live App](https://fundchain-livid.vercel.app) · [View Contract on Etherscan](https://sepolia.etherscan.io/address/0xeD4EcC76f28e47Ba4bb2c8f63fA79d0b57066bAa) · [Report Bug](https://github.com/Capechusami/web3-crowdfunding-platform/issues)

</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Smart Contract](#smart-contract)
- [Frontend Pages](#frontend-pages)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Security](#security)
- [License](#license)

---

## About the Project

Traditional crowdfunding platforms charge **5–12% in fees**, restrict access by geography, delay payouts, and require users to trust a centralized company with their money. **FundChain** eliminates all of these problems.

FundChain is built on a single Ethereum smart contract that acts as a **trustless escrow** — it holds all contributed funds and automatically enforces the rules:

- If a campaign **succeeds** (goal met by deadline) → the creator withdraws all funds
- If a campaign **fails** (goal not met by deadline) → every contributor claims a full refund

No middlemen. No approval process. No fees. Just code executing on the blockchain.

> **Contract Address:** [`0xeD4EcC76f28e47Ba4bb2c8f63fA79d0b57066bAa`](https://sepolia.etherscan.io/address/0xeD4EcC76f28e47Ba4bb2c8f63fA79d0b57066bAa)
> **Network:** Ethereum Sepolia Testnet (Chain ID: 11155111)

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Permissionless Campaigns** | Anyone with an Ethereum wallet can create a campaign — no sign-ups, no KYC, no approval needed |
| **Transparent Contributions** | Every donation is recorded on the blockchain and publicly verifiable on Etherscan |
| **Automatic Refunds** | If a campaign fails to reach its goal, contributors are guaranteed a 100% refund by the smart contract |
| **Instant Withdrawals** | Successful campaign creators withdraw funds directly to their wallet in one transaction |
| **Zero Platform Fees** | The smart contract takes no cut — contributors only pay standard Ethereum gas fees |
| **Immutable Rules** | Campaign goal and deadline are set at creation and can never be changed by anyone |
| **Reentrancy Protection** | Built with OpenZeppelin's `ReentrancyGuard` to prevent exploit attacks |
| **Real-Time UI** | Live progress bars, countdown timers, and instant status updates |
| **Banner Image Upload** | Campaign creators can upload a banner image with preview and validation |
| **Wallet Integration** | MetaMask connect/disconnect with automatic wrong-network detection and switch prompts |

---

## How It Works

### Campaign Lifecycle

```
  ┌──────────┐      ┌──────────┐      ┌──────────────┐      ┌────────────────┐
  │  CREATE   │ ───► │   FUND   │ ───► │   DEADLINE   │ ───► │   OUTCOME      │
  │ Campaign  │      │ Campaign │      │   Passes     │      │                │
  │           │      │          │      │              │      │  Goal Met?     │
  └──────────┘      └──────────┘      └──────────────┘      │  ├─ YES → Withdraw
                                                              │  └─ NO  → Refund
                                                              └────────────────┘
```

### Step 1: Create a Campaign
The creator connects their wallet, sets a **funding goal** (in ETH) and a **deadline** (duration in minutes). The smart contract records the campaign on-chain with an auto-incrementing ID. Campaign metadata (title, description, banner image) is stored off-chain in the browser's localStorage.

### Step 2: Fund a Campaign
Any user can browse active campaigns on the Explore page and contribute ETH. The smart contract adds the contribution to `totalRaised` and records the exact amount per contributor in a nested mapping. Funding is only accepted before the deadline.

### Step 3: Goal Reached — Withdraw
After the deadline passes, if `totalRaised >= goal`, the campaign creator calls `withdraw()`. The smart contract transfers **all raised ETH** directly to the creator's wallet. The `withdrawn` flag is set to `true` to prevent double withdrawals.

### Step 4: Goal Not Reached — Refund
If the deadline passes and `totalRaised < goal`, each contributor can call `refund()` to reclaim their **exact contribution**. The smart contract sets their contribution to `0` and transfers the ETH back to their wallet.

---

## Tech Stack

### Smart Contract Layer

| Technology | Version | Role |
|-----------|---------|------|
| **Solidity** | 0.8.24 | Smart contract language with built-in overflow protection |
| **OpenZeppelin** | Latest | `ReentrancyGuard` for security |
| **Hardhat** | ^2.22 | Development framework — compile, test, deploy |
| **Hardhat Toolbox** | Latest | Testing utilities (Mocha, Chai, network helpers) |

### Frontend Layer

| Technology | Version | Role |
|-----------|---------|------|
| **Next.js** | 16.2.4 | React framework with App Router and SSR |
| **React** | 19.2.4 | Component-based UI library |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Framer Motion** | 12.38.0 | Smooth animations and transitions |
| **Ethers.js** | v6 | Ethereum blockchain interaction |

### Infrastructure

| Service | Role |
|---------|------|
| **Vercel** | Frontend hosting with global CDN |
| **Ethereum Sepolia** | Test blockchain network |
| **MetaMask** | Browser-based Web3 wallet |
| **GitHub** | Version control and collaboration |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          USER (Browser)                          │
│                                                                  │
│   MetaMask Wallet  ◄──────────►  Next.js Frontend (Vercel)      │
│   - Signs transactions            - Displays campaigns           │
│   - Manages accounts               - Reads blockchain data        │
│   - Holds private keys             - Sends transactions           │
└────────────┬─────────────────────────────┬───────────────────────┘
             │                             │
             │  Write (fund, withdraw)     │  Read (getCampaign)
             │                             │
┌────────────▼─────────────────────────────▼───────────────────────┐
│                    Ethereum Sepolia Blockchain                    │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                 Crowdfunding.sol                           │   │
│   │                                                            │   │
│   │   Storage:                                                 │   │
│   │   ├── campaigns[id] → { creator, goal, deadline,          │   │
│   │   │                      totalRaised, withdrawn }          │   │
│   │   └── contributions[id][address] → amount                  │   │
│   │                                                            │   │
│   │   Functions:                                               │   │
│   │   ├── createCampaign(goal, duration) → campaignId          │   │
│   │   ├── fund(campaignId) payable                             │   │
│   │   ├── withdraw(campaignId)                                 │   │
│   │   ├── refund(campaignId)                                   │   │
│   │   ├── getCampaign(campaignId) → Campaign                   │   │
│   │   └── getContribution(campaignId, address) → uint256       │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Events: CampaignCreated, Funded, Withdrawn, Refunded           │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     Off-Chain Storage (localStorage)              │
│                                                                  │
│   Campaign metadata not stored on-chain to save gas:             │
│   ├── title (string)                                             │
│   ├── description (string)                                       │
│   └── banner image (base64)                                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Smart Contract

### Data Structure

```solidity
struct Campaign {
    address creator;      // Wallet address of the campaign creator
    uint256 goal;         // Funding target in wei
    uint256 deadline;     // Unix timestamp when campaign ends
    uint256 totalRaised;  // Total ETH contributed
    bool withdrawn;       // Whether funds have been withdrawn
}
```

### Public Functions

| Function | Type | Description |
|----------|------|-------------|
| `createCampaign(goal, duration)` | Write | Creates a new campaign with a goal (wei) and duration (seconds). Returns the campaign ID. |
| `fund(campaignId)` | Payable | Contributes ETH to an active campaign. Reverts if campaign ended or amount is zero. |
| `withdraw(campaignId)` | Write | Creator withdraws all funds after deadline if goal is met. Only callable by the creator. |
| `refund(campaignId)` | Write | Contributor reclaims their exact contribution if campaign failed. |
| `getCampaign(campaignId)` | View | Returns the full Campaign struct for a given ID. |
| `getContribution(campaignId, address)` | View | Returns the amount a specific address contributed to a campaign. |

### Custom Errors (Gas-Efficient)

| Error | Trigger |
|-------|---------|
| `InvalidGoal()` | Goal is 0 |
| `InvalidDuration()` | Duration is 0 |
| `CampaignNotFound()` | Campaign ID doesn't exist |
| `CampaignEnded()` | Funding after deadline |
| `CampaignNotEnded()` | Withdraw/refund before deadline |
| `ZeroContribution()` | Sending 0 ETH |
| `NotCreator()` | Non-creator calling withdraw |
| `GoalNotReached()` | Withdrawing when goal not met |
| `GoalReached()` | Refunding when goal was met |
| `AlreadyWithdrawn()` | Double withdrawal attempt |
| `NothingToRefund()` | No contribution to refund |
| `TransferFailed()` | ETH transfer failed |

### Events

| Event | Emitted When |
|-------|-------------|
| `CampaignCreated(campaignId, creator, goal, deadline)` | New campaign is created |
| `Funded(campaignId, contributor, amount, totalRaised)` | ETH is contributed |
| `Withdrawn(campaignId, creator, amount)` | Creator withdraws funds |
| `Refunded(campaignId, contributor, amount)` | Contributor claims refund |

---

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Home** | Landing page with hero, benefits, how-it-works preview, stats, testimonials, and call-to-action |
| `/explore` | **Explore** | Browse all campaigns with real-time progress bars, search, and status indicators |
| `/create` | **Create Campaign** | Form with title, description, category, goal, duration, and banner image upload |
| `/campaign/[id]` | **Campaign Detail** | Full campaign view with progress, countdown, donate form, withdraw/refund buttons |
| `/how-it-works` | **How It Works** | Detailed system explanation with lifecycle steps, contract features, function reference, FAQ |
| `/about` | **About** | Mission, core values, tech stack, and team information |
| `/faq` | **FAQ** | Frequently asked questions |

---

## Project Structure

```
web3-crowdfunding-platform/
│
├── contracts/
│   └── Crowdfunding.sol                  # Smart contract (199 lines)
│
├── scripts/
│   └── deploy.js                         # Deploy + auto-export ABI to frontend
│
├── test/
│   └── Crowdfunding.js                   # Unit tests
│
├── frontend/
│   ├── next.config.mjs                   # Next.js + image domains config
│   ├── package.json                      # Frontend dependencies
│   └── src/
│       ├── abi/
│       │   └── Crowdfunding.json         # Contract address + ABI (auto-generated)
│       ├── app/
│       │   ├── page.js                   # Landing page
│       │   ├── layout.js                 # Root layout (Header, Footer, Web3Provider)
│       │   ├── globals.css               # Global styles and theme
│       │   ├── explore/page.js           # Campaign explorer
│       │   ├── create/page.js            # Campaign creation form
│       │   ├── campaign/[id]/page.js     # Campaign detail + actions
│       │   ├── how-it-works/page.js      # System explanation
│       │   ├── about/page.js             # About the platform
│       │   └── faq/page.js               # FAQ
│       ├── components/
│       │   ├── ConnectWallet.jsx          # MetaMask wallet connection
│       │   ├── CreateCampaign.jsx         # Campaign creation form logic
│       │   ├── CampaignList.jsx           # Campaign grid with loading/error states
│       │   ├── CampaignCard.jsx           # Individual campaign card
│       │   ├── DonateForm.jsx             # ETH contribution form
│       │   ├── WithdrawButton.jsx         # Withdraw funds (creator)
│       │   ├── RefundButton.jsx           # Claim refund (contributor)
│       │   ├── landing/                   # Hero, Benefits, HowItWorks, Stats, etc.
│       │   ├── layout/                    # Header, Footer
│       │   └── ui/                        # AnimatedSection, reusable components
│       ├── hooks/
│       │   ├── useContract.js             # Contract instance hook
│       │   └── useCampaigns.js            # Campaign data fetching hooks
│       └── utils/
│           ├── constants.js               # Contract address, ABI, network config
│           ├── contract.js                # getContract() / getReadOnlyContract()
│           ├── campaignStorage.js         # localStorage metadata management
│           └── campaignMeta.js            # Campaign metadata helpers
│
├── hardhat.config.js                     # Hardhat networks, compiler, paths
├── .env                                  # Secrets: RPC URL, private key (gitignored)
├── FundChain_Presentation_Document.md    # Full project documentation
└── README.md                             # This file
```

---

## Getting Started

### Prerequisites

| Requirement | Purpose |
|-------------|---------|
| **Node.js** >= 18 | Runtime for Hardhat and Next.js |
| **MetaMask** | Browser wallet extension for signing transactions |
| **Sepolia ETH** | Free test ETH from a [faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) |
| **Alchemy Account** (optional) | RPC endpoint for Sepolia deployment |

### Installation

```bash
# Clone the repository
git clone https://github.com/Capechusami/web3-crowdfunding-platform.git
cd web3-crowdfunding-platform

# Install smart contract dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Environment Variables

Create a `.env` file in the project root:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key    # optional, for contract verification
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
```

### Running Locally

```bash
# Terminal 1 — Start local Hardhat blockchain
npx hardhat node

# Terminal 2 — Deploy contract to local node
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3 — Start the frontend dev server
cd frontend && npm run dev
```

Open **http://localhost:3000** and connect MetaMask to `localhost:8545` (Chain ID: `31337`).

### Running Tests

```bash
npx hardhat test
```

---

## Deployment

### Deploy Smart Contract to Sepolia

```bash
# Compile
npx hardhat compile

# Deploy
npx hardhat run scripts/deploy.js --network sepolia
```

The deploy script automatically:
1. Deploys `Crowdfunding.sol` to Sepolia
2. Prints the contract address and transaction hash
3. Exports the address + ABI to `frontend/src/abi/Crowdfunding.json`

### Verify on Etherscan (Optional)

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

### Deploy Frontend to Vercel

```bash
cd frontend
vercel --yes --prod
```

Set the environment variable on Vercel:
```bash
echo 11155111 | vercel env add NEXT_PUBLIC_CHAIN_ID production
vercel --yes --prod    # Redeploy with the env variable
```

---

## Security

| Threat | Protection |
|--------|-----------|
| **Reentrancy attacks** | OpenZeppelin `ReentrancyGuard` modifier on all state-changing functions |
| **State manipulation** | Checks-Effects-Interactions pattern — state is updated before external ETH transfers |
| **Double withdrawal** | `withdrawn` boolean checked and set to `true` before transfer |
| **Double refund** | Contributor's balance set to `0` before transfer |
| **Post-deadline funding** | `block.timestamp >= deadline` check rejects late contributions |
| **Unauthorized withdrawal** | `msg.sender == creator` enforced — only the original creator can withdraw |
| **Premature withdrawal** | `block.timestamp >= deadline` check prevents early withdrawal |
| **Failed-campaign withdrawal** | `totalRaised >= goal` enforced — cannot withdraw from unsuccessful campaigns |
| **Gas optimization** | Custom errors (`revert InvalidGoal()`) instead of `require()` with strings |
| **Integer overflow** | Solidity 0.8.24 has built-in overflow/underflow protection |
| **Private key exposure** | Keys loaded from `.env` file, which is in `.gitignore` |
| **Frontend key safety** | No private keys in frontend — all signing happens inside MetaMask |

---

## Contract Deployment Info

| Detail | Value |
|--------|-------|
| **Network** | Ethereum Sepolia Testnet |
| **Chain ID** | 11155111 |
| **Contract Address** | [`0xeD4EcC76f28e47Ba4bb2c8f63fA79d0b57066bAa`](https://sepolia.etherscan.io/address/0xeD4EcC76f28e47Ba4bb2c8f63fA79d0b57066bAa) |
| **Solidity Version** | 0.8.24 |
| **Optimizer** | Enabled (200 runs) |
| **Frontend URL** | [fundchain-livid.vercel.app](https://fundchain-livid.vercel.app) |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with Solidity, Next.js, and Ethereum**

[Live Demo](https://fundchain-livid.vercel.app) · [View on Etherscan](https://sepolia.etherscan.io/address/0xeD4EcC76f28e47Ba4bb2c8f63fA79d0b57066bAa) · [GitHub](https://github.com/Capechusami/web3-crowdfunding-platform)

</div>
