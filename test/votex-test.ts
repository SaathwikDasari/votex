import { expect } from "chai";
import { network } from "hardhat";
const { ethers } = await network.connect();

describe("VoteX Contract", function () {
  async function deployContract() {
    const VoteX = await ethers.getContractFactory("VoteX");
    const votex = await VoteX.deploy();
    await votex.waitForDeployment();
    return votex;
  }

  it("Should initialize with 2 candidates", async function () {
    const votex = await deployContract();
    const candidates = await votex.getCandidates();
    expect(candidates.length).to.equal(2);
  });

  it("Should allow a user to vote", async function () {
    const votex = await deployContract();

    await votex.vote(0);
    const candidates = await votex.getCandidates();

    expect(candidates[0].voteCount).to.equal(1);
  });

  it("Should prevent double voting", async function () {
    const votex = await deployContract();

    await votex.vote(0);

    await expect(votex.vote(0)).to.be.revertedWith("You have already voted");
  });
});
