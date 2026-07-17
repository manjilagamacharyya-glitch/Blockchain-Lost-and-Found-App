import { expect } from "chai";
import { network } from "hardhat";
const { ethers } = await network.create();

describe("LostAndFound", function () {
  it("Should let a user report a found item", async function () {
    const lostAndFound = await ethers.deployContract("LostAndFound");

    await lostAndFound.reportItem(
      "Black Wallet",
      "Found near the library entrance",
      "ipfs://sample-hash-123",
      "Main Library",
      1
    );

    expect(await lostAndFound.itemCount()).to.equal(1n);

    const item = await lostAndFound.getItem(1);
    expect(item.itemName).to.equal("Black Wallet");
    expect(item.status).to.equal(1n);
  });

  it("Should let someone claim a found item with proof, and let the reporter resolve it", async function () {
    const [reporter, claimant] = await ethers.getSigners();
    const lostAndFound = await ethers.deployContract("LostAndFound");

    await lostAndFound.connect(reporter).reportItem(
      "Blue Backpack",
      "Found in the cafeteria",
      "ipfs://sample-hash-456",
      "Cafeteria",
      1
    );

    await lostAndFound.connect(claimant).submitClaim(1, "It has a torn front pocket and my name tag inside.");

    let item = await lostAndFound.getItem(1);
    expect(item.status).to.equal(2n);
    expect(item.claimant).to.equal(claimant.address);
    expect(item.claimProof).to.equal("It has a torn front pocket and my name tag inside.");

    await lostAndFound.connect(reporter).resolveClaim(1, true);

    item = await lostAndFound.getItem(1);
    expect(item.status).to.equal(3n);
  });

  it("Should NOT let a random person resolve a claim", async function () {
    const [reporter, claimant, randomPerson] = await ethers.getSigners();
    const lostAndFound = await ethers.deployContract("LostAndFound");

    await lostAndFound.connect(reporter).reportItem(
      "Red Umbrella",
      "Found near the gate",
      "ipfs://sample-hash-789",
      "Main Gate",
      1
    );

    await lostAndFound.connect(claimant).submitClaim(1, "It has a bent tip and a red strap.");

    await expect(
      lostAndFound.connect(randomPerson).resolveClaim(1, true)
    ).to.be.revertedWith("Only reporter can resolve");
  });
});