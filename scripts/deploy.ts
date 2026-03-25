import { network } from "hardhat";
const { ethers } = await network.connect();

async function main() {
  console.log("Deploying the VoteX Contract....");

  const VoteX = await ethers.getContractFactory("VoteX");
  const votex = await VoteX.deploy();
  await votex.waitForDeployment();

  const address = await votex.getAddress();
  console.log("VoteX Deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
