import { useState } from "react";
import { getContract } from "../utils/contract";
import { uploadImageToIPFS } from "../utils/ipfs";

function ReportForm({ account, onReported }) {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("1");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      setSubmitting(true);
      let ipfsHash = "";
      if (imageFile) {
        setUploadStatus("Uploading image to IPFS...");
        const cid = await uploadImageToIPFS(imageFile);
        ipfsHash = `ipfs://${cid}`;
        setUploadStatus("Image uploaded. Sending transaction...");
      } else {
        setUploadStatus("Sending transaction...");
      }
      const contract = await getContract();
      const tx = await contract.reportItem(
        itemName, description, ipfsHash, location, Number(status)
      );
      await tx.wait();
      alert("Item reported successfully!");
      setItemName(""); setDescription(""); setLocation(""); setImageFile(null);
      setUploadStatus("");
      onReported();
    } catch (error) {
      console.error("Error reporting item:", error);
      alert("Failed to report item. See console for details.");
      setUploadStatus("");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    "w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 transition focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30";

  return (
    <form onSubmit={handleSubmit} className="border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between border-b border-neutral-800 pb-4">
        <h2 className="font-mono text-sm uppercase tracking-widest text-neutral-400">
          File a Report
        </h2>
        <span className="font-mono text-xs text-neutral-600">requires 1 signature</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-neutral-400">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClasses}>
            <option value="0">Lost</option>
            <option value="1">Found</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-neutral-400">Item Name</span>
          <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)}
            placeholder="Black Wallet" required className={inputClasses} />
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block text-neutral-400">Description</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Any identifying details..." required rows={3}
            className={`${inputClasses} resize-none`} />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-neutral-400">Location</span>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="Main Library" required className={inputClasses} />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-neutral-400">Photo (optional)</span>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full text-sm text-neutral-500 file:mr-3 file:rounded file:border file:border-neutral-800 file:bg-neutral-900 file:px-3 file:py-2 file:text-xs file:text-neutral-300 hover:file:bg-neutral-800" />
        </label>
      </div>

      <button type="submit" disabled={submitting}
        className="mt-7 w-full rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500 sm:w-auto sm:px-8">
        {submitting ? "Submitting…" : "Submit Report"}
      </button>

      {uploadStatus && (
        <p className="mt-3 font-mono text-xs text-neutral-500">→ {uploadStatus}</p>
      )}
    </form>
  );
}

export default ReportForm;