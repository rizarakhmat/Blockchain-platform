import React, { useContext, createContext } from 'react';
import { CROWDFUNDING_ADDRESS, NFTMOVIE_ADDRESS, NFTMOVIETOKEN_ADDRESS, FRACTIONALIZENFT_ADDRESS } from '../constants/addresses'
import { useAddress, useContract, useMetamask, useContractWrite, useContractRead } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  let tokenId = 0; // needed to approve();

  const { contract } = useContract(CROWDFUNDING_ADDRESS);
  const { contract: nftMovieContract } = useContract(NFTMOVIE_ADDRESS);
  const { contract: nftMovieTokenContract } = useContract(NFTMOVIETOKEN_ADDRESS);
  const { contract: FractionalizeNFTContract } = useContract(FRACTIONALIZENFT_ADDRESS);


  // call CrowdFunding SC
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  // call NFTMovie ERC721 SC
  const { mutateAsync: createNFTMovie } = useContractWrite(nftMovieContract, 'createNFTMovie');
  const { mutateAsync: approve } = useContractWrite(nftMovieContract, 'approve');

  // call NFTMovieToken ERC20 SC
  const { mutateAsync: approveToken } = useContractWrite(nftMovieTokenContract, 'approve');
  const { mutateAsync: mintTokens } = useContractWrite(nftMovieTokenContract, 'mintTokens');

   // call FractionalizeNFT SC
  const { mutateAsync: lockNFTMovie } = useContractWrite(FractionalizeNFTContract, 'lockNFTMovie');
  const { mutateAsync:  depositERC20 } = useContractWrite(FractionalizeNFTContract, 'depositERC20');
  const { mutateAsync:  distributeERC20Tokens } = useContractWrite(FractionalizeNFTContract, 'distributeERC20Tokens');


  const address = useAddress();
  const connect = useMetamask();

  //////////////////////////////// NFTMovie ERC721 SC functions

  const onMintClick = async (title, description, image) => {
    try { 
      // call my function createNFTMovie() -> error
      const tx = await createNFTMovie({
        args: [
          title,
          description,
          image //hardcoded2
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      
      console.log("Contract NFTMovie call success. Successfully Minted NFT!", data)
    } catch (error) {
      console.log("Contract NFTMovie call failure", error);
    }
  }

  const approveSC = async () => {
    try {
      const data = await approve({
        args: [
          FRACTIONALIZENFT_ADDRESS,
          tokenId
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      console.info("NFTMovie contract approve() call successs", data);
    } catch (err) {
      console.error("NFTMovie contract approve() failure", err);
    }
  }

  

  //////////////////////////////// NFTMovieToken ERC20 SC functions

  const erc20tokens = async () => {
    const data = await nftMovieTokenContract.call(
      'balanceOf', 
      [address]
    );

    return data.toNumber();
  }

  const mintERC20Tokens = async (amount) => {
    try {
      const data = await mintTokens({
        args: [
          amount
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      console.info("NFTMovieToken contract mintTokens() call successs", data);
    } catch (err) {
      console.error("NFTMovieToken contract mintTokens() failure", err);
    }
  }

  const approveTokenSC = async (amount) => {
    try {
      const data = await approveToken({
        args: [
          FRACTIONALIZENFT_ADDRESS,
          amount
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      console.info("NFTMovieToken contract approve() call successs", data);
    } catch (err) {
      console.error("NFTMovieToken contract approve() call failure", err);
    }
  }

  //////////////////////////////// FractionalizeNFT SC functions

  const lockNFT = async () => {
    try {
      const data = await lockNFTMovie({
        args: [
          tokenId
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      tokenId++; // the next approve() call tokenId point to correct NFT;
      console.info("FractionalizeNFT contract lockNFTMovie() call successs", data);
    } catch (err) {
      console.error("FractionalizeNFT contract lockNFTMovie() failure", err);
    }
  }

  const depositTokens = async (amount) => {
    try {
      const data = await depositERC20({
        args: [
          FRACTIONALIZENFT_ADDRESS,
          amount
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      console.info("FractionalizeNFT contract depositERC20() call successs", data);
    } catch (err) {
      console.error("FractionalizeNFT contract depositERC20() failure", err);
    }
  }

  const distributeTokens = async (amount, buyers, donations) => {
    try {
      const data = await distributeERC20Tokens({
        args: [
          amount,
          buyers,
          donations
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      console.info("FractionalizeNFT contract distributeERC20Tokens() call successs", data);
    } catch (err) {
      console.error("FractionalizeNFT contract distributeERC20Tokens() failure", err);
    }
  }


  //////////////////////////////// CrowdFunding SC functions

  const publishCampaign =  async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, //owner of campaign
          form.title, // title
          form.description, // description
          form.target,
          form.image
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });

      console.log("Contract CrowdFunding call success", data)
    } catch (error) {
      console.log("Contract CrowdFunding call failure", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    // transfer array of data to human readable format
    const parseCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parseCampaigns;

  }

  const donate = async (pId, amount) => {
    const data = await contract.call(
      'donateToCampaign', 
      [pId], 
      { 
        value: ethers.utils.parseEther(amount),
        gasLimit: 1000000,
        gasPrice: 0,
      }
    );

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donations: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) =>
    campaign.owner === address);

    return filteredCampaigns;
  }

  const getUserFundedCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    const userFundedCampaigns = [];

    for (const campaign of allCampaigns) {
      const donations = await getDonations(campaign.pId);

      const isDonator = donations.some((donation) =>
      donation.donator === address);

      if (isDonator) {
        userFundedCampaigns.push(campaign);
      }
    }
    
    return userFundedCampaigns;
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        nftMovieTokenContract,
        //CrowdFunding
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        getUserFundedCampaigns,
        //ERC721 NFTMovie
        onMintClick,
        approveSC,
        //ERC20 NFTMovieToken
        mintERC20Tokens,
        approveTokenSC,
        erc20tokens,
        //FractionalizeNFT
        lockNFT,
        depositTokens,
        distributeTokens
      }  
      }
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);