const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTFundraising", function () {
  this.timeout(50000);

  let mynftFundraising;
  let owner;
  let acc1;
  let acc2;
  let title = "test Title";
  let description = "testing";
  let target = 1000;
  let image = "https://tressays.files.wordpress.com/2015/09/test-clip-art-cpa-school-test.png"

  // This is executed before each test
  this.beforeEach(async () => {
    // Deploy the NFTMarket contract
    const NFTFundraising = await ethers.getContractFactory("NFTFundraising");
    mynftFundraising = await NFTFundraising.deploy();
    [owner, acc1, acc2] = await ethers.getSigners();
  
  });

  it("Should mint one NFT", async function () {
    const tokenURI = "https://some-token.uri/";
    const transaction = await mynftFundraising.createCampaign(owner.address, title, description, target, image, tokenURI);
    const receipt = await transaction.wait();
    const tokenID = receipt.events[0].args.tokenId;

    // Assert that the newly created NFT's token uri is the same one sent to the createNFT function
    const mintedTokenURI = await mynftFundraising.tokenURI(tokenID);
    expect(mintedTokenURI).to.equal(tokenURI);
  });

});