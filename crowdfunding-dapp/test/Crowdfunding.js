const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Crowdfunding", function () {
  let crowdfunding;
  let owner, creator, alice, bob;

  const ONE_ETH = ethers.parseEther("1");
  const TWO_ETH = ethers.parseEther("2");
  const HALF_ETH = ethers.parseEther("0.5");
  const GOAL = ethers.parseEther("2");
  const DURATION = 7 * 24 * 60 * 60; // 7 days

  beforeEach(async function () {
    [owner, creator, alice, bob] = await ethers.getSigners();
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await Crowdfunding.deploy();
    await crowdfunding.waitForDeployment();
  });

  async function createDefaultCampaign(signer = creator) {
    const tx = await crowdfunding.connect(signer).createCampaign(GOAL, DURATION);
    await tx.wait();
    return 0n;
  }

  describe("createCampaign", function () {
    it("creates a campaign with correct fields and emits event", async function () {
      const tx = await crowdfunding
        .connect(creator)
        .createCampaign(GOAL, DURATION);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      const expectedDeadline = BigInt(block.timestamp) + BigInt(DURATION);

      await expect(tx)
        .to.emit(crowdfunding, "CampaignCreated")
        .withArgs(0n, creator.address, GOAL, expectedDeadline);

      const c = await crowdfunding.getCampaign(0);
      expect(c.creator).to.equal(creator.address);
      expect(c.goal).to.equal(GOAL);
      expect(c.deadline).to.equal(expectedDeadline);
      expect(c.totalRaised).to.equal(0n);
      expect(c.withdrawn).to.equal(false);

      expect(await crowdfunding.campaignCount()).to.equal(1n);
    });

    it("reverts on zero goal", async function () {
      await expect(
        crowdfunding.connect(creator).createCampaign(0, DURATION)
      ).to.be.revertedWithCustomError(crowdfunding, "InvalidGoal");
    });

    it("reverts on zero duration", async function () {
      await expect(
        crowdfunding.connect(creator).createCampaign(GOAL, 0)
      ).to.be.revertedWithCustomError(crowdfunding, "InvalidDuration");
    });

    it("increments ids for multiple campaigns", async function () {
      await crowdfunding.connect(creator).createCampaign(GOAL, DURATION);
      await crowdfunding.connect(alice).createCampaign(GOAL, DURATION);
      expect(await crowdfunding.campaignCount()).to.equal(2n);
    });
  });

  describe("fund", function () {
    beforeEach(async function () {
      await createDefaultCampaign();
    });

    it("accepts contributions and tracks totals per user", async function () {
      await expect(
        crowdfunding.connect(alice).fund(0, { value: ONE_ETH })
      )
        .to.emit(crowdfunding, "Funded")
        .withArgs(0n, alice.address, ONE_ETH, ONE_ETH);

      await crowdfunding.connect(alice).fund(0, { value: HALF_ETH });
      await crowdfunding.connect(bob).fund(0, { value: ONE_ETH });

      const c = await crowdfunding.getCampaign(0);
      expect(c.totalRaised).to.equal(ONE_ETH + HALF_ETH + ONE_ETH);

      expect(
        await crowdfunding.getContribution(0, alice.address)
      ).to.equal(ONE_ETH + HALF_ETH);
      expect(
        await crowdfunding.getContribution(0, bob.address)
      ).to.equal(ONE_ETH);
    });

    it("reverts on zero contribution", async function () {
      await expect(
        crowdfunding.connect(alice).fund(0, { value: 0 })
      ).to.be.revertedWithCustomError(crowdfunding, "ZeroContribution");
    });

    it("reverts when campaign does not exist", async function () {
      await expect(
        crowdfunding.connect(alice).fund(99, { value: ONE_ETH })
      ).to.be.revertedWithCustomError(crowdfunding, "CampaignNotFound");
    });

    it("reverts when funding after deadline", async function () {
      await time.increase(DURATION + 1);
      await expect(
        crowdfunding.connect(alice).fund(0, { value: ONE_ETH })
      ).to.be.revertedWithCustomError(crowdfunding, "CampaignEnded");
    });
  });

  describe("withdraw", function () {
    beforeEach(async function () {
      await createDefaultCampaign();
    });

    it("allows creator to withdraw after success", async function () {
      await crowdfunding.connect(alice).fund(0, { value: ONE_ETH });
      await crowdfunding.connect(bob).fund(0, { value: ONE_ETH });

      await time.increase(DURATION + 1);

      const before = await ethers.provider.getBalance(creator.address);
      const tx = await crowdfunding.connect(creator).withdraw(0);
      const receipt = await tx.wait();
      const gas = receipt.gasUsed * receipt.gasPrice;
      const after = await ethers.provider.getBalance(creator.address);

      expect(after - before + gas).to.equal(TWO_ETH);

      await expect(tx)
        .to.emit(crowdfunding, "Withdrawn")
        .withArgs(0n, creator.address, TWO_ETH);

      const c = await crowdfunding.getCampaign(0);
      expect(c.withdrawn).to.equal(true);
    });

    it("reverts when non-creator tries to withdraw", async function () {
      await crowdfunding.connect(alice).fund(0, { value: TWO_ETH });
      await time.increase(DURATION + 1);

      await expect(
        crowdfunding.connect(alice).withdraw(0)
      ).to.be.revertedWithCustomError(crowdfunding, "NotCreator");
    });

    it("reverts when withdrawing before deadline", async function () {
      await crowdfunding.connect(alice).fund(0, { value: TWO_ETH });
      await expect(
        crowdfunding.connect(creator).withdraw(0)
      ).to.be.revertedWithCustomError(crowdfunding, "CampaignNotEnded");
    });

    it("reverts when goal not reached", async function () {
      await crowdfunding.connect(alice).fund(0, { value: ONE_ETH });
      await time.increase(DURATION + 1);

      await expect(
        crowdfunding.connect(creator).withdraw(0)
      ).to.be.revertedWithCustomError(crowdfunding, "GoalNotReached");
    });

    it("prevents double withdraw", async function () {
      await crowdfunding.connect(alice).fund(0, { value: TWO_ETH });
      await time.increase(DURATION + 1);

      await crowdfunding.connect(creator).withdraw(0);
      await expect(
        crowdfunding.connect(creator).withdraw(0)
      ).to.be.revertedWithCustomError(crowdfunding, "AlreadyWithdrawn");
    });
  });

  describe("refund", function () {
    beforeEach(async function () {
      await createDefaultCampaign();
    });

    it("refunds contributors when goal not reached", async function () {
      await crowdfunding.connect(alice).fund(0, { value: ONE_ETH });
      await crowdfunding.connect(bob).fund(0, { value: HALF_ETH });

      await time.increase(DURATION + 1);

      const before = await ethers.provider.getBalance(alice.address);
      const tx = await crowdfunding.connect(alice).refund(0);
      const receipt = await tx.wait();
      const gas = receipt.gasUsed * receipt.gasPrice;
      const after = await ethers.provider.getBalance(alice.address);

      expect(after - before + gas).to.equal(ONE_ETH);

      await expect(tx)
        .to.emit(crowdfunding, "Refunded")
        .withArgs(0n, alice.address, ONE_ETH);

      expect(
        await crowdfunding.getContribution(0, alice.address)
      ).to.equal(0n);

      const c = await crowdfunding.getCampaign(0);
      expect(c.totalRaised).to.equal(HALF_ETH);
    });

    it("reverts when refunding before deadline", async function () {
      await crowdfunding.connect(alice).fund(0, { value: ONE_ETH });
      await expect(
        crowdfunding.connect(alice).refund(0)
      ).to.be.revertedWithCustomError(crowdfunding, "CampaignNotEnded");
    });

    it("reverts when goal reached", async function () {
      await crowdfunding.connect(alice).fund(0, { value: TWO_ETH });
      await time.increase(DURATION + 1);
      await expect(
        crowdfunding.connect(alice).refund(0)
      ).to.be.revertedWithCustomError(crowdfunding, "GoalReached");
    });

    it("reverts when caller has no contribution", async function () {
      await crowdfunding.connect(alice).fund(0, { value: ONE_ETH });
      await time.increase(DURATION + 1);
      await expect(
        crowdfunding.connect(bob).refund(0)
      ).to.be.revertedWithCustomError(crowdfunding, "NothingToRefund");
    });

    it("prevents double refund", async function () {
      await crowdfunding.connect(alice).fund(0, { value: ONE_ETH });
      await time.increase(DURATION + 1);

      await crowdfunding.connect(alice).refund(0);
      await expect(
        crowdfunding.connect(alice).refund(0)
      ).to.be.revertedWithCustomError(crowdfunding, "NothingToRefund");
    });
  });
});
