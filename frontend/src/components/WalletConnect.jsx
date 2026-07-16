import { useState } from "react";
import { ethers } from "ethers";

function WalletConnect({ account, onConnect }) {
  const [connecting, setConnecting] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to use this app.");
      return;
    }
    try {
      setConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      onConnect(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. See console for details.");
    } finally {
      setConnecting(false);
    }
  }

  if (account) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-neutral-800/80 bg-neutral-900/60 px-3 py-1.5 font-mono text-xs backdrop-blur-sm">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
        </span>
        <span className="text-neutral-300">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={connecting}
      className="rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}

export default WalletConnect;