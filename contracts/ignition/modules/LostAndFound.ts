import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("LostAndFoundModule", (m) => {
  const lostAndFound = m.contract("LostAndFound");
  return { lostAndFound };
});