import { network } from "hardhat";
const { ethers } = await network.connect();

async function main() {
  const [alice, bob] = await ethers.getSigners();

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const VoteX = await ethers.getContractFactory("VoteX");
  const votex = VoteX.attach(contractAddress) as any;

  console.log("--- Candidates before voting ---");
  const before = await votex.getCandidates();
  for (const c of before) {
    console.log(`${c.name}: ${c.voteCount} votes`);
  }

  console.log("\n--- Alice votes for Alice (candidate 0) ---");
  await votex.connect(alice).vote(0);
  console.log("Alice voted!");

  console.log("\n--- Bob votes for Bob (candidate 1) ---");
  await votex.connect(bob).vote(1);
  console.log("Bob voted!");

  console.log("\n--- Results after voting ---");
  const after = await votex.getCandidates();
  for (const c of after) {
    console.log(`${c.name}: ${c.voteCount} votes`);
  }

  console.log("\n--- Alice tries to vote again (should fail) ---");
  try {
    await votex.connect(alice).vote(0);
  } catch (e: any) {
    console.log(
      "Blocked! Reason:",
      e.revert?.args?.[0] ?? e.shortMessage ?? e.message
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
