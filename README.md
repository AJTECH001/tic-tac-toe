# PvP Onchain Tic Tac Toe

A decentralized Tic Tac Toe game built on the Stacks blockchain where players can bet STX tokens and the winner takes all.

## Features

- **Onchain Game Logic**: All game state and logic is handled by smart contracts
- **STX Betting**: Players can bet STX tokens on their games
- **Fast Transactions**: Leverages Stacks microblocks for quick gameplay
- **Permissionless**: Anyone can create or join games
- **Modern UI**: Built with Next.js and Tailwind CSS

## Project Structure

```
tic-tac-toe/
├── contracts/
│   └── tic-tac-toe.clar          # Smart contract
├── tests/
│   └── tic-tac-toe.test.ts       # Contract tests
├── frontend/                      # Next.js application
│   ├── app/                      # App router pages
│   ├── components/               # React components
│   ├── lib/                      # Contract interaction utilities
│   └── hooks/                    # Custom React hooks
└── settings/                     # Deployment configurations
```

## Smart Contract Functions

### Public Functions
- `create-game(bet-amount: uint, move-index: uint, move: uint)` - Create a new game with initial move
- `join-game(game-id: uint, move-index: uint, move: uint)` - Join an existing game
- `play(game-id: uint, move-index: uint, move: uint)` - Make a move in an ongoing game

### Read-Only Functions
- `get-game(game-id: uint)` - Get game details by ID
- `get-latest-game-id()` - Get the ID for the next game to be created

## 🚀 Deployment Status

**✅ LIVE ON TESTNET!**

- **Contract Address**: `ST1PEM6ATK66PP1DC6FWMRVWNKR8MWRWD90GAAJQE.tic-tac-toe`
- **Transaction ID**: `55633bcb49ab179dfca427983704ce595437b8b684983bb6a30be03342e7f9b8`
- **Explorer**: https://explorer.stacks.co/txid/55633bcb49ab179dfca427983704ce595437b8b684983bb6a30be03342e7f9b8?chain=testnet
- **Deployment Cost**: 0.088460 STX
- **Status**: ✅ Confirmed on Testnet

## Getting Started

### Prerequisites
- Node.js 18+
- Clarinet 3.7.0+
- A Stacks wallet with testnet STX (get from [faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet))

### Smart Contract Setup

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Deploy to testnet:
```bash
# Update settings/Testnet.toml with your wallet mnemonic
clarinet deployments generate --testnet --medium-cost
clarinet deployments apply --testnet --no-dashboard
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Contract address is already configured for the deployed contract:
```typescript
const CONTRACT_ADDRESS = "ST1PEM6ATK66PP1DC6FWMRVWNKR8MWRWD90GAAJQE";
```

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## 🎮 Testing the Deployed Contract

You can test the deployed contract in several ways:

### 1. Using the Frontend (Recommended)
1. Start the frontend: `cd frontend && npm run dev`
2. Open http://localhost:3000
3. Connect your Hiro Wallet (make sure it's in testnet mode)
4. Create and play games!

### 2. Using Clarinet Console
```bash
clarinet console
# Then interact with the contract:
(contract-call? .tic-tac-toe get-latest-game-id)
(contract-call? .tic-tac-toe get-game u0)
```

### 3. Using Stacks Explorer
- View contract: https://explorer.stacks.co/txid/55633bcb49ab179dfca427983704ce595437b8b684983bb6a30be03342e7f9b8?chain=testnet
- Monitor transactions and game state

## How to Play

1. **Connect Wallet**: Connect your Stacks wallet to the application
2. **Create Game**: Click "Create Game", set your bet amount, and make your first move
3. **Join Game**: Browse available games and join one by making your first move
4. **Play**: Take turns making moves until someone wins
5. **Win**: The winner automatically receives both players' bet amounts

## Game Rules

- Player 1 always plays X and goes first
- Player 2 always plays O and goes second
- Players alternate turns
- First to get 3 in a row (horizontal, vertical, or diagonal) wins
- Winner receives both bet amounts automatically

## Improvements

This basic implementation could be enhanced with:
- Time limits for moves to prevent games from getting stuck
- Tournament modes
- Different bet amounts per game
- Spectator mode
- Game history and statistics

## Technologies Used

- **Clarity**: Smart contract language
- **Clarinet**: Development framework
- **Next.js**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Stacks.js**: Blockchain interaction


