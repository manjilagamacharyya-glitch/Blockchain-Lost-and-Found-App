import { useState } from "react";

const STATUS_STYLES = {
  0: "border-neutral-700 text-neutral-400",
  1: "border-amber-500/40 text-amber-400",
  2: "border-sky-500/40 text-sky-400",
  3: "border-neutral-700 text-neutral-500",
};

const STATUS_LABELS = ["LOST", "FOUND", "CLAIMED", "RESOLVED"];

function ItemCard({ item, account, onClaim, onResolve }) {
  const [proofText, setProofText] = useState("");
  const [showClaimBox, setShowClaimBox] = useState(false);

  const isReporter = account && item.reporter.toLowerCase() === account.toLowerCase();
  const status = Number(item.status);
  const canClaim = status === 1 && !isReporter;
  const canResolve = status === 2 && isReporter;

  const hasImage = item.ipfsHash && item.ipfsHash.startsWith("ipfs://");
  const imageUrl = hasImage
    ? `https://gateway.pinata.cloud/ipfs/${item.ipfsHash.replace("ipfs://", "")}`
    : null;

  function handleClaimSubmit() {
    if (!proofText.trim()) {
      alert("Please describe a detail proving this item is yours.");
      return;
    }
    onClaim(item.id, proofText);
    setProofText("");
    setShowClaimBox(false);
  }

  return (
    <div className="group border border-neutral-800/80 bg-neutral-950/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
      <div className="relative h-40 w-full overflow-hidden border-b border-neutral-800 bg-neutral-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.itemName}
            className="h-full w-full object-cover grayscale-[15%] transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-neutral-700">
            no image
          </div>
        )}
        <span className={`absolute left-0 top-0 border-b border-r bg-neutral-950/90 px-2.5 py-1 font-mono text-[11px] font-bold tracking-wide ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 p-5">
        <h3 className="font-semibold text-neutral-100">{item.itemName}</h3>
        <p className="line-clamp-2 text-sm text-neutral-400">{item.description}</p>

        <div className="mt-1 space-y-1 border-t border-neutral-800 pt-3 font-mono text-xs text-neutral-500">
          <p>loc: {item.location}</p>
          <p>reporter: {item.reporter.slice(0, 6)}...{item.reporter.slice(-4)}</p>
          {canResolve && (
            <>
              <p className="text-sky-400">claimant: {item.claimant.slice(0, 6)}...{item.claimant.slice(-4)}</p>
              <p className="mt-2 rounded border border-sky-500/20 bg-sky-500/5 p-2 text-neutral-300">
                proof: "{item.claimProof}"
              </p>
            </>
          )}
        </div>

        <div className="mt-2">
          {canClaim && !showClaimBox && (
            <button
              onClick={() => setShowClaimBox(true)}
              className="w-full rounded-md border border-amber-500/40 bg-amber-500/5 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/15"
            >
              Claim this item
            </button>
          )}

          {canClaim && showClaimBox && (
            <div className="space-y-2">
              <textarea
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                placeholder="Describe a detail proving this is yours (e.g. a scratch, an engraving, what's inside)..."
                rows={2}
                className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleClaimSubmit}
                  className="flex-1 rounded-md border border-amber-500/40 bg-amber-500/5 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/15"
                >
                  Submit Claim
                </button>
                <button
                  onClick={() => setShowClaimBox(false)}
                  className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-400 transition hover:bg-neutral-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {canResolve && (
            <div className="flex gap-2">
              <button
                onClick={() => onResolve(item.id, true)}
                className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/5 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/15"
              >
                Approve
              </button>
              <button
                onClick={() => onResolve(item.id, false)}
                className="flex-1 rounded-md border border-rose-500/40 bg-rose-500/5 py-2 text-sm font-medium text-rose-400 transition hover:bg-rose-500/15"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;