import React, { useContext, createContext } from 'react';
import { CROWDFUNDING_ADDRESS, NFTMOVIE_ADDRESS, NFTMOVIETOKEN_ADDRESS, FRACTIONALIZENFT_ADDRESS, ROYALTIESREMUNERATION_ADDRESS, VOTING_ADDRESS } from '../constants/addresses'
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {

  const { contract } = useContract(CROWDFUNDING_ADDRESS);
  const { contract: nftMovieContract } = useContract(NFTMOVIE_ADDRESS);
  const { contract: nftMovieTokenContract } = useContract(NFTMOVIETOKEN_ADDRESS);
  const { contract: FractionalizeNFTContract } = useContract(FRACTIONALIZENFT_ADDRESS);
  const { contract: royaltiesRemunerationContract } = useContract(ROYALTIESREMUNERATION_ADDRESS);
  const { contract: votingContract } = useContract(VOTING_ADDRESS);


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

  // call RoyaltiesRemuneration SC
  const { mutateAsync: setDistributionAggrement } = useContractWrite(royaltiesRemunerationContract, "setDistributionAggrement");
  const { mutateAsync: buyStreamRight } = useContractWrite(royaltiesRemunerationContract, "buyStreamingRights");
  const { mutateAsync: remunerateRoyalties } = useContractWrite(royaltiesRemunerationContract, "remunerateRoyalties");
  
  // call Voting SC
  const { mutateAsync: candidateAdd} = useContractWrite(votingContract, "addCandidate")
  const { mutateAsync: candidateRemove} = useContractWrite(votingContract, "removeCandidate")
  const { mutateAsync: acceptVote} = useContractWrite(votingContract, "voteAccept")
  const { mutateAsync: denyVote} = useContractWrite(votingContract, "voteDeny")
  


  const address = useAddress();
  const connect = useMetamask();

  //////////////////////////////// NFTMovie ERC721 SC functions

  const onMintClick = async (title, description, movieURI) => {
    try { 
      const tx = await createNFTMovie({
        args: [
          title,
          description,
          movieURI
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

  const approveSC = async (tokenId) => {
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

  const getNFTs = async () => {
    const nfts = await nftMovieContract.call('getNFTs');

    const parseNFTs = nfts.map((nft, i) => ({
      tokenID: nft.tokenID,
      title: nft.title,
      description: nft.description,
      movieURI: nft.movieURI,
      producer: nft.producer,
      nftId: i
    }));


    return parseNFTs;
  }

  const tokenID = async () => {
    const id = await nftMovieContract.call("_tokenIdCounter");

    return id - 1;
  }
  

  //////////////////////////////// NFTMovieToken ERC20 SC functions

  // use in Producer with address
  const owners = async (address) => {
    const data = await nftMovieTokenContract.call(
      'balanceOf', 
      [address]
    );

    return data.toNumber();
  }

  // pass tokenID that erc20 token Represent
  const mintERC20Tokens = async (amount, _tokenId) => {
    try {
      const data = await mintTokens({
        args: [
          amount,
          _tokenId
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

  const lockNFT = async (tokenId, title, description, movieURI) => {
    try {
      const data = await lockNFTMovie({
        args: [
          tokenId,
          title,
          description,
          movieURI
        ],
        overrides: {
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      console.info("FractionalizeNFT contract lockNFTMovie() call successs", data);
    } catch (err) {
      console.error("FractionalizeNFT contract lockNFTMovie() failure", err);
    }
  }

  const depositTokens = async (amount) => {
    try {
      const data = await depositERC20({
        args: [
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

  const distributeTokens = async (amount, _tokenId, buyers, donations) => {
    try {
      const data = await distributeERC20Tokens({
        args: [
          amount,
          _tokenId,
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

  const getLockedNFTs = async () => {
    const nfts = await FractionalizeNFTContract.call('getLockedNFTs');
  
    // transfer array of data to human readable format
    const parseLockedNFTs = nfts.map((nft, i) => ({
      tokenId: nft.tokenId,
      title: nft.title,
      description: nft.description,
      movieURI: nft.movieURI,
      producer: nft.producer,
      isLocked: nft.isLocked,
      buyers: nft.buyers,
      donations: nft.donations.map((i) => ethers.utils.formatEther(i.toString())),
      shares: nft.shares.map((i) => ethers.utils.formatEther(i.toString())),
      idLockedNFT: i
    }));

    return parseLockedNFTs;
  }
  
  const getSharesOf = async (owner, tokenId) => {
    const ownedShare = await FractionalizeNFTContract.call("shareOf", [owner, tokenId]);
    const numberOfShares = ownedShare.length;

    const parsedOwnedShare = [];

    for(let i = 0; i < numberOfShares; i++) {
      parsedOwnedShare.push(ownedShare.map((i) => i.toString()));
    }
  
    return parsedOwnedShare;
  }

  const getSharesOfNFT = async (tokenId) => {
    const shares = await FractionalizeNFTContract.call("getSharesOfNFT", [tokenId]);
    
    return shares;
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

    //////////////////////////////// RoyaltiesRemuneration SC functions

  const setDistributionAggrem = async (_title, form) => {
    try {
      const data = await setDistributionAggrement({ args: [
        _title,
        form.price,
        form.startDate,
        form.deadline,
        form.countries
      ],
      overrides: {
        gasLimit: 1000000,
        gasPrice: 0,
      },
    });
      console.info("RoyaltiesRemuneration contract setDistributionAggrement() call successs", data);
    } catch (err) {
      console.error("RoyaltiesRemuneration contract setDistributionAggrement() call failure", err);
    }
  }
  
  const buyStreamingRight = async (_id, amount) => {
    try {
      const data = await buyStreamRight({ args: 
        [_id],
      overrides: {
        value: ethers.utils.parseEther(amount),
        gasLimit: 1000000,
        gasPrice: 0,
      },
    });
      console.info("RoyaltiesRemuneration contract buyStreamingRights() call successs", data);
    } catch (err) {
      console.error("RoyaltiesRemuneration contract buyStreamingRights() call failure", err);
    }
  }

  const payRoyalties = async (_id, _buyers, _donations, _target, form) => {
    try {
      const amount = form.numberOfUsers * form.subscriptionFee * (form.shareOfRevenue / 100);
            
      const parsedDonations = [];
      for(let i = 0; i < _donations.length; i++) {
        parsedDonations.push(ethers.BigNumber.from(_donations[i]));
      }

      const data = await remunerateRoyalties({ args: [
        _id,
        form.numberOfUsers,
        _buyers,
        parsedDonations,
        ethers.utils.parseEther(_target.toString()),
        form.subscriptionFee,
        form.shareOfRevenue
        ],
        overrides: {
          value: ethers.utils.parseEther(amount.toString()),
          gasLimit: 1000000,
          gasPrice: 0,
        },
      });
      console.info("RoyaltiesRemuneration contract remunerateRoyalties() call successs", data);
    } catch (err) {
      console.error("RoyaltiesRemuneration contract remunerateRoyalties() call failure", err);
    }    
  }

  const getNumberOfDAs = async () => {
    const numberOfCampaigns = await royaltiesRemunerationContract.call('numberOfCampaigns');

    return numberOfCampaigns.toString();
  }

  const getTimeWindow = async (_id) => {
    const result = await royaltiesRemunerationContract.call('getTimeWindow', [_id]);
    const parsedTime = [];

    parsedTime.push({
      startDate: result[0].toString(),
      deadline: result[1].toString(),
    });

    return parsedTime;
  }
  
  const getCountryList = async (_id) => {
    const result = await royaltiesRemunerationContract.call('getCountryList', [_id]);

    return result;
  }

  const getDAs = async () => {
    const allDAs = await royaltiesRemunerationContract.call('getDistributionAggrements');

    return allDAs;
  }

  //////////////////////////////// Voting SC functions

  const addCandidate  = async (_name) => {
    try {
      const data = await candidateAdd({ args: [
        _name
      ],
      overrides: {
        gasLimit: 1000000,
        gasPrice: 0,
      },
     });
      console.info("VotingSC call addCandidate() successs", data);
    } catch (err) {
      console.error("VotingSC call addCandidate() failure", err);
    }
  }
  
  const removeCandidate  = async (_name) => {
    try {
      const data = await candidateRemove({ args: [
        _name
      ],
      overrides: {
        gasLimit: 1000000,
        gasPrice: 0,
      },
     });
      console.info("VotingSC call addCandidate() successs", data);
    } catch (err) {
      console.error("VotingSC call addCandidate() failure", err);
    }
  }
  
  const Accept  = async (_candidateIndex) => {
    try {
      const data = await acceptVote({ args: [
        _candidateIndex
      ],
      overrides: {
        gasLimit: 1000000,
        gasPrice: 0,
      },
     });
      console.info("VotingSC call voteAccept() successs", data);
    } catch (err) {
      console.error("VotingSC call voteAccept() failure", err);
    }
  }
  
  const Deny  = async (_candidateIndex) => {
    try {
      const data = await denyVote({ args: [
        _candidateIndex
      ],
      overrides: {
        gasLimit: 1000000,
        gasPrice: 0,
      },
     });
      console.info("VotingSC call voteDeny() successs", data);
    } catch (err) {
      console.error("VotingSC call voteDeny() failure", err);
    }
  }

  const readCandidates = async () => {
    const candidatesList = await votingContract.call("getAllVotesOfCandiates");
  
    // transfer array of data to human readable format
    const parseCandidates = candidatesList.map((candidate, index) => ({
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber()
    }));

    return parseCandidates;
  }
  

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        nftMovieContract,
        nftMovieTokenContract,
        FractionalizeNFTContract,
        royaltiesRemunerationContract,
        votingContract,
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
        getNFTs,
        tokenID,
        //ERC20 NFTMovieToken
        mintERC20Tokens,
        approveTokenSC,
        owners,
        //FractionalizeNFT
        lockNFT,
        depositTokens,
        distributeTokens,
        getLockedNFTs,
        getSharesOf,
        getSharesOfNFT,
        // RoyaltiesRemuneration
        setDistributionAggrem,
        buyStreamingRight,
        payRoyalties,
        getNumberOfDAs,
        getTimeWindow,
        getCountryList,
        getDAs,
        // VotingSC
        addCandidate,
        removeCandidate,
        Accept,
        Deny,
        readCandidates
      }  
      }
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);