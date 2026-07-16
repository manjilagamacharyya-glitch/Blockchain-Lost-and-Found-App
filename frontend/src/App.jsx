import { useState, useEffect } from "react";
import WalletConnect from "./components/WalletConnect";
import ReportForm from "./components/ReportForm";
import ItemList from "./components/ItemList";
import { getContract } from "./utils/contract";

function App() {
  const [account, setAccount] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) loadItems();
  }, [account]);

  async function loadItems() {
    try {
      setLoading(true);
      const contract = await getContract();
      const count = await contract.itemCount();
      const loadedItems = [];
      for (let i = 1; i <= Number(count); i++) {
        loadedItems.push(await contract.getItem(i));
      }
      setItems(loadedItems.reverse());
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim(itemId) {
    try {
      const contract = await getContract();
      const tx = await contract.submitClaim(itemId);
      await tx.wait();
      alert("Claim submitted successfully!");
      loadItems();
    } catch (error) {
      console.error("Failed to submit claim:", error);
      alert("Failed to submit claim. See console for details.");
    }
  }

  async function handleResolve(itemId, approve) {
    try {
      const contract = await getContract();
      const tx = await contract.resolveClaim(itemId, approve);
      await tx.wait();
      alert(approve ? "Claim approved!" : "Claim rejected.");
      loadItems();
    } catch (error) {
      console.error("Failed to resolve claim:", error);
      alert("Failed to resolve claim. See console for details.");
    }
  }

  const foundCount = items.filter((i) => Number(i.status) === 1).length;
  const resolvedCount = items.filter((i) => Number(i.status) === 3).length;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-neutral-200">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-neutral-800/80 bg-[#0a0a0b]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 font-mono text-sm font-bold text-amber-400">
              L&F
            </div>
            <span className="text-base font-semibold tracking-tight text-neutral-100">
              Lost &amp; Found Registry
            </span>
            <span className="rounded border border-neutral-800 px-2 py-0.5 font-mono text-[11px] text-neutral-500">
              sepolia
            </span>
          </div>
          <WalletConnect account={account} onConnect={setAccount} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-14">
        {/* Hero */}
        <div className="mb-12 animate-fade-in-up border-b border-neutral-800 pb-12">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-amber-500">
            On-chain evidence · Decentralized storage
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight text-neutral-50 sm:text-5xl">
            A tamper-proof ledger for lost &amp; found items.
          </h1>
          <p className="mt-4 max-w-lg text-neutral-400">
            Every report, claim, and resolution is signed by a wallet and
            recorded on-chain — nobody can quietly rewrite what happened.
          </p>

          {items.length > 0 && (
            <div className="mt-8 flex gap-10 font-mono text-sm">
              <div>
                <span className="text-2xl font-bold text-neutral-50">{items.length}</span>
                <span className="ml-1.5 text-neutral-500">reports</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-amber-400">{foundCount}</span>
                <span className="ml-1.5 text-neutral-500">found</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-neutral-400">{resolvedCount}</span>
                <span className="ml-1.5 text-neutral-500">resolved</span>
              </div>
            </div>
          )}
        </div>

        <ReportForm account={account} onReported={loadItems} />

        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="font-mono text-sm uppercase tracking-widest text-neutral-400">
              Reported Items
            </h2>
            {loading && (
              <span className="flex items-center gap-2 font-mono text-xs text-neutral-500">
                <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-neutral-700 border-t-amber-400" />
                loading
              </span>
            )}
          </div>
          <ItemList
            items={items}
            account={account}
            onClaim={handleClaim}
            onResolve={handleResolve}
          />
        </div>
      </main>

      <footer className="border-t border-neutral-800 py-8 text-center font-mono text-xs text-neutral-600">
        GDGoC Gauhati University — Web Dev + Blockchain Hackathon
      </footer>
    </div>
  );
}

export default App;