import React, { useContext, createContext } from 'react';
import { CROWDFUNDING_ADDRESS, NFTMOVIE_ADDRESS } from '../constants/addresses'
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(CROWDFUNDING_ADDRESS);
  const { contract: nftMovieContract } = useContract(NFTMOVIE_ADDRESS);

  // call createCampaign function
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const { mutateAsync: createNFTMovie, isLoading } = useContractWrite(nftMovieContract, 'createNFTMovie');

  const address = useAddress();
  const connect = useMetamask();

  const onMintClick = async () => {
    try { 
      // call my function createNFTMovie() -> error
      const tx = await createNFTMovie({
        args: [
          'https://gateway.ipfscdn.io/ipfs/QmZbovNXznTHpYn2oqgCFQYP4ZCpKDquenv5rFCX8irseo/0.png'
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      
      console.log("Contract NFTMovie call success. 🚀 Successfully Minted NFT!", data)
    } catch (error) {
      console.log("Contract NFTMovie call failure", error);
    }
  }

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
        nftMovieContract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        getUserFundedCampaigns,
        onMintClick
      }  
      }
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);