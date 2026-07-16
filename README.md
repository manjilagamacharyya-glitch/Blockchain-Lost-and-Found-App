# 🔍 Blockchain Lost & Found

A decentralized lost & found registry built for the **GDGoC Gauhati University Web Dev + Blockchain Hackathon**.

**Live demo:** https://blockchain-lost-and-found-app.vercel.app
**Smart contract (Sepolia):** `0xf4482bdFaB7396B4668c83e1Ca85Dd50A2e6E16e`

## Problem Statement

> Using blockchain, Web3 wallets, and decentralized storage, users can report lost/found items, verify ownership claims, and maintain tamper-proof records that prevent fraud while ensuring trust and transparency throughout the recovery process.

## How it works

1. **Connect Wallet** — users sign in with MetaMask.
2. **Report an Item** — as "Lost" or "Found," with a name, description, location, and optional photo. Photos are uploaded to **IPFS** (via Pinata), and only the content hash is stored on-chain.
3. **Claim** — anyone (other than the original reporter) can submit a claim on a "Found" item.
4. **Resolve** — only the original reporter can approve or reject a claim, moving the item to "Resolved." This is enforced directly by the smart contract, not just the UI.

Every report, claim, and resolution is a real transaction recorded permanently on the Ethereum Sepolia testnet — publicly verifiable, and impossible to quietly alter.

## Tech Stack

- **Smart Contract:** Solidity, deployed with Hardhat 3 + Hardhat Ignition
- **Frontend:** React (Vite) + Tailwind CSS
- **Blockchain interaction:** ethers.js
- **Wallet:** MetaMask
- **Decentralized storage:** IPFS via Pinata
- **Network:** Ethereum Sepolia Testnet
- **Deployment:** Vercel

## Project Structure

    lostfound-dapp/
      contracts/
        contracts/LostAndFound.sol
        test/LostAndFound.ts
        ignition/modules/LostAndFound.ts

      frontend/
        src/
          components/
            WalletConnect.jsx
            ReportForm.jsx
            ItemList.jsx
            ItemCard.jsx
          utils/
            contract.js
            ipfs.js
            contractConfig.js


## Running locally

### Smart contract
```bash
cd contracts
npm install
npx hardhat test
npx hardhat ignition deploy ignition/modules/LostAndFound.ts --network sepolia
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend/` with:
VITE_PINATA_JWT=your_pinata_jwt_here


## Team

Built by Manjil Agamacharyya for GDGoC Gauhati University's Web Dev + Blockchain Hackathon.
