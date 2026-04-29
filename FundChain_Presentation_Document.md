# FundChain — Decentralized Crowdfunding Platform
## Complete Project Documentation for Presentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Proposed Solution](#3-proposed-solution)
4. [System Architecture](#4-system-architecture)
5. [Technology Stack](#5-technology-stack)
6. [Smart Contract Deep Dive](#6-smart-contract-deep-dive)
7. [Frontend Application](#7-frontend-application)
8. [Project Structure](#8-project-structure)
9. [Complete Workflow — How the System Works](#9-complete-workflow)
10. [Security Features](#10-security-features)
11. [Deployment Pipeline](#11-deployment-pipeline)
12. [Live Demo Walkthrough](#12-live-demo-walkthrough)
13. [Future Enhancements](#13-future-enhancements)
14. [Conclusion](#14-conclusion)

---

## 1. Project Overview

**FundChain** is a decentralized crowdfunding platform built on the Ethereum blockchain. It allows anyone to create fundraising campaigns and receive contributions in ETH — without banks, intermediaries, or platform fees.

The entire system runs on a single Solidity smart contract deployed on the Ethereum Sepolia testnet. A modern Next.js frontend provides an intuitive user interface to interact with the contract through MetaMask.

**Live URL:** https://frontend-iota-virid-78.vercel.app  
**Contract Address:** `0xeD4EcC76f28e47Ba4bb2c8f63fA79d0b57066bAa`  
**Network:** Ethereum Sepolia Testnet (Chain ID: 11155111)  
**Source Code:** https://github.com/Capechusami/web3-crowdfunding-platform (Branch: PR_Las)

---

## 2. Problem Statement

Traditional crowdfunding platforms like GoFundMe, Kickstarter, and Indiegogo suffer from:

| Problem | Impact |
|---------|--------|
| **High platform fees** | 5-12% deducted from every campaign |
| **Centralized control** | Platform can freeze funds or reject campaigns |
| **Lack of transparency** | Contributors can't verify where funds go |
| **Geographic restrictions** | Not available in all countries |
| **Delayed payouts** | Creators wait days or weeks to receive funds |
| **No refund guarantee** | Contributors have no automatic protection if a campaign fails |
| **Trust dependency** | Must trust the platform and the creator |

---

## 3. Proposed Solution

FundChain eliminates all these problems by moving the crowdfunding logic onto the Ethereum blockchain:

| Feature | How FundChain Solves It |
|---------|------------------------|
| **Zero fees** | Smart contract takes no cut — only standard gas fees |
| **Permissionless** | Anyone with an Ethereum wallet can create or fund campaigns |
| **Full transparency** | Every transaction is publicly verifiable on Etherscan |
| **Global access** | Works anywhere with internet — no country restrictions |
| **Instant payouts** | Creator withdraws directly to their wallet in one transaction |
| **Automatic refunds** | If goal not met, contributors claim 100% refund — guaranteed by code |
| **Trustless** | No need to trust anyone — the smart contract enforces all rules |

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Browser)                       │
│  ┌───────────────────┐    ┌──────────────────────────────┐  │
│  │    MetaMask        │    │    Next.js Frontend           │  │
│  │    (Web3 Wallet)   │◄──►│    (Vercel Hosted)            │  │
│  └────────┬──────────┘    └──────────────┬───────────────┘  │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            │  Signs Transactions          │  Reads Campaign Data
            │                              │
┌───────────▼──────────────────────────────▼──────────────────┐
│                  Ethereum Blockchain (Sepolia)               │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐   │
│   │              Crowdfunding.sol Smart Contract           │   │
│   │                                                        │   │
│   │   campaigns[]  ─── stores all campaign data            │   │
│   │   contributions[][] ─── tracks every contribution      │   │
│   │                                                        │   │
│   │   createCampaign() → creates new campaign              │   │
│   │   fund()           → contribute ETH                    │   │
│   │   withdraw()       → creator claims funds              │   │
│   │   refund()         → backer reclaims contribution      │   │
│   └──────────────────────────────────────────────────────┘   │
│                                                              │
│   All data is immutable, public, and verifiable              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Off-Chain Storage                          │
│                                                              │
│   Browser localStorage stores campaign metadata:             │
│   - Campaign title                                           │
│   - Campaign description                                     │
│   - Banner image (base64)                                    │
│                                                              │
│   (Smart contract only stores: goal, deadline, creator,      │
│    totalRaised, withdrawn status)                            │
└──────────────────────────────────────────────────────────────┘
```

### Data Split: On-Chain vs Off-Chain

| Data | Stored Where | Why |
|------|-------------|-----|
| Creator address | Smart Contract | Needed for withdrawal authorization |
| Funding goal (ETH) | Smart Contract | Enforced by contract logic |
| Deadline | Smart Contract | Enforced by contract logic |
| Total raised | Smart Contract | Updated with every contribution |
| Withdrawn status | Smart Contract | Prevents double withdrawal |
| Per-contributor amounts | Smart Contract | Needed for refund calculations |
| Campaign title | localStorage | Descriptive metadata, not needed on-chain |
| Campaign description | localStorage | Descriptive metadata, not needed on-chain |
| Banner image | localStorage | Too large for blockchain storage |

---

## 5. Technology Stack

### Backend (Smart Contract Layer)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Solidity** | 0.8.24 | Smart contract programming language |
| **OpenZeppelin** | Latest | ReentrancyGuard security library |
| **Hardhat** | Latest | Development, testing, and deployment framework |
| **Ethers.js** | v6 | JavaScript library to interact with Ethereum |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.4 | React framework with server-side rendering |
| **React** | 19.2.4 | UI component library |
| **Tailwind CSS** | v4 | Utility-first CSS framework |
| **Framer Motion** | 12.38.0 | Animation library |
| **Ethers.js** | v6 | Blockchain interaction from browser |

### Infrastructure

| Technology | Purpose |
|-----------|---------|
| **Vercel** | Frontend hosting and deployment |
| **Ethereum Sepolia** | Test blockchain network |
| **MetaMask** | User's Web3 wallet |
| **GitHub** | Source code version control |

---

## 6. Smart Contract Deep Dive

### Contract: `Crowdfunding.sol`

The entire platform logic lives in a single Solidity smart contract (199 lines of code).

### 6.1 Data Structures

```solidity
struct Campaign {
    address creator;      // Wallet address of the campaign creator
    uint256 goal;         // Funding goal in wei (1 ETH = 10^18 wei)
    uint256 deadline;     // Unix timestamp — campaign ends at this time
    uint256 totalRaised;  // Total ETH contributed so far
    bool withdrawn;       // Whether creator has withdrawn funds
}

mapping(uint256 => Campaign) public campaigns;
mapping(uint256 => mapping(address => uint256)) public contributions;
```

- `campaigns` — maps campaign ID (0, 1, 2, ...) to its Campaign struct
- `contributions` — maps (campaignId, walletAddress) to the amount that wallet contributed

### 6.2 Core Functions

#### `createCampaign(uint256 _goal, uint256 _duration)`
- **Who can call:** Anyone
- **What it does:** Creates a new campaign with a funding goal and duration
- **Validations:** Goal must be > 0, duration must be > 0
- **Deadline calculation:** `block.timestamp + _duration` (current time + duration in seconds)
- **Returns:** The new campaign's ID
- **Event emitted:** `CampaignCreated(campaignId, creator, goal, deadline)`

#### `fund(uint256 _campaignId)`
- **Who can call:** Anyone (must send ETH with the transaction)
- **What it does:** Adds the sent ETH to the campaign's totalRaised
- **Validations:** Contribution must be > 0, campaign must not have ended
- **Protection:** ReentrancyGuard prevents attack exploits
- **Event emitted:** `Funded(campaignId, contributor, amount, totalRaised)`

#### `withdraw(uint256 _campaignId)`
- **Who can call:** Only the campaign creator
- **What it does:** Transfers all raised funds to the creator's wallet
- **Validations:**
  - Only the creator can call this
  - Deadline must have passed
  - Total raised must meet or exceed the goal
  - Cannot withdraw twice
- **Protection:** ReentrancyGuard + Checks-Effects-Interactions pattern
- **Event emitted:** `Withdrawn(campaignId, creator, amount)`

#### `refund(uint256 _campaignId)`
- **Who can call:** Any contributor to the campaign
- **What it does:** Returns the caller's exact contribution back to their wallet
- **Validations:**
  - Deadline must have passed
  - Goal must NOT have been reached
  - Caller must have contributed > 0
- **Protection:** ReentrancyGuard + sets contribution to 0 before transfer
- **Event emitted:** `Refunded(campaignId, contributor, amount)`

#### `getCampaign(uint256 _campaignId)` (View)
- Read-only function that returns the full Campaign struct

#### `getContribution(uint256 _campaignId, address _contributor)` (View)
- Read-only function that returns how much a specific address contributed

### 6.3 Custom Errors

Instead of using `require()` with string messages (which costs more gas), the contract uses custom errors:

| Error | When It's Thrown |
|-------|------------------|
| `InvalidGoal()` | Creating a campaign with goal = 0 |
| `InvalidDuration()` | Creating a campaign with duration = 0 |
| `CampaignNotFound()` | Accessing a campaign ID that doesn't exist |
| `CampaignEnded()` | Trying to fund a campaign after its deadline |
| `CampaignNotEnded()` | Trying to withdraw/refund before deadline |
| `ZeroContribution()` | Sending 0 ETH to fund() |
| `NotCreator()` | Non-creator trying to withdraw |
| `GoalNotReached()` | Creator trying to withdraw when goal not met |
| `GoalReached()` | Trying to refund when goal was actually met |
| `AlreadyWithdrawn()` | Creator trying to withdraw a second time |
| `NothingToRefund()` | Calling refund with 0 contribution |
| `TransferFailed()` | ETH transfer failed (rare edge case) |

### 6.4 Events

Events are emitted for every state-changing action. These are permanently stored in the blockchain logs and can be:
- Queried by the frontend to show transaction history
- Viewed on Etherscan by anyone
- Used as proof of activity

---

## 7. Frontend Application

### 7.1 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home (Landing) | Hero section, benefits, how it works preview, stats, testimonials, CTA |
| `/explore` | Explore Campaigns | Lists all campaigns from the smart contract with search and progress bars |
| `/create` | Create Campaign | Form to create a new campaign with image upload |
| `/campaign/[id]` | Campaign Detail | Full campaign info, progress, donate form, withdraw/refund buttons |
| `/how-it-works` | How It Works | Detailed explanation of the entire system with visuals |
| `/about` | About | Mission, values, tech stack, team description |
| `/faq` | FAQ | Frequently asked questions |

### 7.2 Key Components

| Component | File | Purpose |
|-----------|------|---------|
| `Header` | `layout/Header.jsx` | Navigation bar with wallet connection |
| `Footer` | `layout/Footer.jsx` | Site footer with links |
| `ConnectWallet` | `ConnectWallet.jsx` | MetaMask wallet connection/disconnection |
| `CreateCampaign` | `CreateCampaign.jsx` | Campaign creation form with validation |
| `CampaignList` | `CampaignList.jsx` | Renders grid of campaign cards |
| `CampaignCard` | `CampaignCard.jsx` | Individual campaign card with progress bar |
| `DonateForm` | `DonateForm.jsx` | ETH contribution form |
| `WithdrawButton` | `WithdrawButton.jsx` | Withdraw funds button (creator only) |
| `RefundButton` | `RefundButton.jsx` | Refund claim button (contributors only) |

### 7.3 Custom React Hooks

| Hook | Purpose |
|------|---------|
| `useCampaigns()` | Fetches all campaigns from the smart contract |
| `useCampaign(id)` | Fetches a single campaign by ID |
| `useContribution(campaignId, address)` | Fetches a user's contribution to a campaign |
| `useContract()` | Returns a contract instance connected to the user's wallet |

### 7.4 How the Frontend Communicates with the Blockchain

```
User Action → React Component → Ethers.js → MetaMask → Ethereum Network → Smart Contract
                                                ↑
                                    User confirms/rejects
                                    the transaction in MetaMask
```

**Read operations** (viewing campaigns): Use a JsonRpcProvider — no wallet needed.
**Write operations** (create, fund, withdraw, refund): Use a BrowserProvider + Signer — requires MetaMask.

---

## 8. Project Structure

```
solidity/
├── contracts/
│   └── Crowdfunding.sol              # The smart contract (199 lines)
├── scripts/
│   └── deploy.js                     # Deployment script
├── test/                             # Contract test files
├── hardhat.config.js                 # Hardhat configuration
├── .env                              # Blockchain credentials (not committed)
│
└── frontend/
    ├── next.config.mjs               # Next.js configuration
    ├── package.json                  # Dependencies
    └── src/
        ├── abi/
        │   └── Crowdfunding.json     # Contract address + ABI (auto-generated)
        ├── app/
        │   ├── page.js               # Landing page
        │   ├── layout.js             # Root layout (Header, Footer, Web3Provider)
        │   ├── globals.css           # Global styles
        │   ├── explore/page.js       # Explore campaigns page
        │   ├── create/page.js        # Create campaign page
        │   ├── campaign/[id]/page.js # Campaign detail page
        │   ├── how-it-works/page.js  # How it works page
        │   ├── about/page.js         # About page
        │   └── faq/page.js           # FAQ page
        ├── components/
        │   ├── ConnectWallet.jsx      # Wallet connection
        │   ├── CreateCampaign.jsx     # Campaign form
        │   ├── CampaignList.jsx       # Campaign grid
        │   ├── CampaignCard.jsx       # Campaign card
        │   ├── DonateForm.jsx         # Donation form
        │   ├── WithdrawButton.jsx     # Withdraw funds
        │   ├── RefundButton.jsx       # Claim refund
        │   ├── landing/               # Landing page sections
        │   ├── layout/                # Header, Footer
        │   └── ui/                    # Reusable UI components
        ├── hooks/
        │   ├── useCampaigns.js        # Campaign data hooks
        │   └── useContract.js         # Contract instance hook
        └── utils/
            ├── constants.js           # Contract address, ABI, network config
            ├── contract.js            # Contract instance factory
            ├── campaignStorage.js     # localStorage metadata management
            └── campaignMeta.js        # Campaign metadata helpers
```

---

## 9. Complete Workflow — How the System Works

### WORKFLOW 1: Creating a Campaign

```
Step 1: User opens the app and connects MetaMask
        → MetaMask prompts "Connect to this site?"
        → User approves → wallet address appears in header

Step 2: User navigates to "Start a Campaign" (/create)
        → Form appears with fields: title, description, category,
          funding goal (ETH), duration, and optional banner image

Step 3: User fills in the form and clicks "Create Campaign"
        → Frontend validates all fields
        → Converts goal from ETH to wei (1 ETH = 1,000,000,000,000,000,000 wei)
        → Converts duration from minutes to seconds
        → Calls contract.createCampaign(goalInWei, durationInSeconds)

Step 4: MetaMask pops up showing the transaction details
        → User reviews and clicks "Confirm"
        → Transaction is sent to the Ethereum Sepolia network

Step 5: Transaction is mined (~15-30 seconds on Sepolia)
        → Smart contract stores: creator address, goal, deadline, totalRaised=0
        → CampaignCreated event is emitted
        → Frontend saves title, description, and image to localStorage

Step 6: User is redirected to the Explore page
        → New campaign appears in the list
```

### WORKFLOW 2: Funding a Campaign

```
Step 1: User (backer) opens the Explore page (/explore)
        → Frontend calls contract.campaignCount() to get total campaigns
        → Calls contract.getCampaign(i) for each campaign
        → Merges on-chain data with localStorage metadata
        → Displays campaign cards with progress bars

Step 2: User clicks a campaign card
        → Campaign Detail page loads (/campaign/[id])
        → Shows: title, description, progress bar, goal, raised amount,
          deadline countdown, creator info

Step 3: User enters ETH amount in the "Support this campaign" form
        → Frontend validates: amount > 0, campaign not ended
        → Calls contract.fund(campaignId) with { value: amountInWei }

Step 4: MetaMask pops up showing the ETH amount being sent
        → User confirms the transaction

Step 5: Transaction is mined
        → Smart contract adds the ETH to campaign.totalRaised
        → Records the contribution: contributions[campaignId][userAddress] += amount
        → Funded event is emitted
        → Frontend updates the progress bar in real-time
```

### WORKFLOW 3: Withdrawing Funds (Campaign Succeeded)

```
Preconditions:
  - Campaign deadline has passed
  - totalRaised >= goal
  - The connected wallet is the campaign creator
  - Funds have not been withdrawn yet

Step 1: Creator opens their campaign detail page
        → Frontend detects: deadline passed + goal met + wallet is creator
        → "Withdraw Funds" card appears on the right side

Step 2: Creator clicks "Withdraw Funds"
        → Calls contract.withdraw(campaignId)

Step 3: MetaMask confirms the transaction
        → Smart contract verifies all 4 conditions
        → Sets campaign.withdrawn = true
        → Transfers all ETH to the creator's wallet
        → Withdrawn event is emitted

Step 4: Creator's MetaMask balance increases by the campaign total
        → Campaign detail page shows "Funds Withdrawn" status
```

### WORKFLOW 4: Claiming a Refund (Campaign Failed)

```
Preconditions:
  - Campaign deadline has passed
  - totalRaised < goal (goal was NOT reached)
  - The connected wallet contributed > 0 to this campaign

Step 1: Contributor opens the campaign detail page
        → Frontend detects: deadline passed + goal not met + user contributed
        → "Claim Refund" card appears

Step 2: Contributor clicks "Claim Refund"
        → Calls contract.refund(campaignId)

Step 3: MetaMask confirms the transaction
        → Smart contract verifies conditions
        → Sets contributions[campaignId][user] = 0
        → Subtracts the amount from totalRaised
        → Transfers the exact contribution back to the user
        → Refunded event is emitted

Step 4: Contributor's wallet balance is restored
        → Campaign shows updated raised amount
```

### WORKFLOW 5: Connecting a Wallet

```
Step 1: User clicks "Connect Wallet" in the header
        → Frontend calls window.ethereum.request({ method: 'eth_requestAccounts' })
        → MetaMask popup asks "Connect to this site?"

Step 2: User approves
        → Frontend receives the wallet address
        → Checks if the user is on the correct network (Sepolia)
        → If wrong network, prompts to switch

Step 3: Wallet is connected
        → Address is displayed in the header (truncated: 0xAb...cD12)
        → All write operations (create, fund, withdraw, refund) are now available
        → Read operations work without a wallet
```

---

## 10. Security Features

### 10.1 Smart Contract Security

| Feature | Implementation | Purpose |
|---------|---------------|---------|
| **ReentrancyGuard** | OpenZeppelin's `nonReentrant` modifier on `fund()`, `withdraw()`, `refund()` | Prevents reentrancy attacks where a malicious contract calls back into FundChain during a transfer |
| **Checks-Effects-Interactions** | State changes (effects) happen BEFORE external calls (interactions) | Prevents state manipulation during ETH transfers |
| **Custom Errors** | `revert InvalidGoal()` instead of `require(goal > 0, "msg")` | Gas-efficient error handling |
| **Input Validation** | Every function validates inputs before execution | Prevents invalid state transitions |
| **Access Control** | `withdraw()` checks `msg.sender == creator` | Only the campaign creator can withdraw |
| **Double-Withdraw Prevention** | `withdrawn` boolean flag checked and set before transfer | Cannot withdraw funds twice |
| **Immutable Rules** | Goal and deadline set at creation, never modified | No one can change campaign terms after creation |

### 10.2 Frontend Security

| Feature | Purpose |
|---------|---------|
| **No private keys stored** | All signing happens in MetaMask |
| **Network validation** | Prompts user to switch to correct network |
| **Input sanitization** | All form inputs are validated before contract calls |
| **Error handling** | Every contract call is wrapped in try-catch with user-friendly messages |

---

## 11. Deployment Pipeline

### 11.1 Smart Contract Deployment

```
Developer Machine → Hardhat → Sepolia RPC → Ethereum Sepolia Network

1. Configure .env with SEPOLIA_RPC_URL and PRIVATE_KEY
2. Run: npx hardhat run scripts/deploy.js --network sepolia
3. deploy.js:
   - Connects to Sepolia via RPC
   - Deploys the Crowdfunding contract
   - Waits for deployment confirmation
   - Exports contract address + ABI to frontend/src/abi/Crowdfunding.json
4. Contract is now live and immutable on Sepolia
```

### 11.2 Frontend Deployment

```
GitHub Repository → Vercel Build → Vercel CDN → Users Worldwide

1. Code is pushed to GitHub (branch: PR_Las)
2. Vercel CLI deploys from the frontend/ directory
3. Vercel runs: npm install → next build
4. Static pages are pre-rendered, dynamic pages use SSR
5. Environment variable NEXT_PUBLIC_CHAIN_ID=11155111 configures Sepolia
6. App is served globally via Vercel's CDN
```

### 11.3 How the Pieces Connect

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Hardhat     │────►│  Sepolia      │◄────│   Frontend    │
│   (Deploy)    │     │  Blockchain   │     │   (Vercel)    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                         ▲
       │  Generates ABI + Address                 │
       ▼                                         │
┌──────────────────────────────────────────────────┐
│         frontend/src/abi/Crowdfunding.json        │
│         (Contract Address + ABI)                  │
│         Committed to GitHub                       │
└──────────────────────────────────────────────────┘
```

---

## 12. Live Demo Walkthrough

**Live URL:** https://frontend-iota-virid-78.vercel.app

### Prerequisites
- MetaMask browser extension installed
- MetaMask set to Sepolia test network
- At least 0.05 Sepolia ETH in wallet (free from faucets)

### Demo Script

| Time | Action | What to Show |
|------|--------|-------------|
| 0:00 | Open the landing page | Professional UI, hero section, benefits |
| 0:30 | Click "How It Works" in nav | Full system explanation with images and contract details |
| 1:00 | Click "Connect Wallet" | MetaMask popup, network verification |
| 1:30 | Navigate to "Create Campaign" | Fill form: title, description, goal=0.01 ETH, duration=10 min |
| 2:00 | Submit and confirm in MetaMask | Show transaction pending, then confirmed |
| 2:30 | View campaign on Explore page | Card with banner image, progress bar at 0% |
| 3:00 | Open campaign detail page | Show all campaign info, countdown timer |
| 3:30 | Switch to second wallet account | Simulate a different user (backer) |
| 4:00 | Fund the campaign with 0.005 ETH | Show MetaMask confirmation, progress bar updates |
| 4:30 | Fund again to meet the goal | Progress bar reaches 100% |
| 5:00 | Show transaction on Etherscan | Paste contract address, show events and transactions |
| 5:30 | (After deadline) Switch to creator wallet | Withdraw funds, show balance increase |
| 6:00 | Show About and FAQ pages | Complete professional platform overview |

### Verifying on Etherscan
1. Go to https://sepolia.etherscan.io
2. Search: `0xeD4EcC76f28e47Ba4bb2c8f63fA79d0b57066bAa`
3. Click "Events" tab to see all CampaignCreated, Funded, Withdrawn, Refunded events
4. Each event shows the campaign ID, addresses, and amounts

---

## 13. Future Enhancements

| Enhancement | Description |
|------------|-------------|
| **IPFS Storage** | Store campaign metadata on IPFS instead of localStorage for persistence across devices |
| **Multi-chain Support** | Deploy to Polygon, Arbitrum, or Base for lower gas fees |
| **Campaign Categories** | On-chain category tagging for better discovery |
| **Social Sharing** | Generate shareable campaign links with preview cards |
| **Notification System** | Email/push alerts when campaigns hit milestones |
| **Governance** | DAO-based platform governance for dispute resolution |
| **Milestone-Based Funding** | Release funds in stages as creator delivers milestones |
| **ERC-20 Token Support** | Allow funding with stablecoins (USDC, DAI) in addition to ETH |
| **Campaign Updates** | Allow creators to post progress updates |
| **Mainnet Deployment** | Deploy to Ethereum mainnet for real-world usage |

---

## 14. Conclusion

FundChain demonstrates how blockchain technology can solve real problems in the crowdfunding industry:

- **Trust is replaced by code** — the smart contract enforces all rules automatically
- **Transparency is built-in** — every transaction is publicly verifiable
- **Fees are eliminated** — 100% of funds go to the intended destination
- **Protection is guaranteed** — contributors always get refunds if campaigns fail
- **Access is universal** — anyone with a wallet can participate globally

The project combines Solidity smart contract development, modern web development with Next.js and React, and blockchain infrastructure knowledge into a fully functional, deployed, real-world application.

**Built with:** Solidity 0.8.24 | Next.js 16 | React 19 | Tailwind CSS 4 | Ethers.js v6 | Hardhat | OpenZeppelin | Vercel

---

*Document prepared for FundChain project presentation*
*Contract deployed on Ethereum Sepolia Testnet*
*Frontend hosted on Vercel*
