import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStateContext } from '../../context'
import { CustomButton, FormField } from '../../components/Producer'
import { CountBox, Loader } from '../../components'
import { calculateBarPercentage } from '../../utils'
import { profile, money } from '../../assets'

const ProducerCampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { contract, address, nftMovieContract, nftMovieTokenContract, FractionalizeNFTContract,
        /* CrowdFunding */
        getDonations,
        /* NFTMovie ERC721 */
        approveSC, onMintClick, getNFTs, tokenID,
        /* NFTMovieToken ERC20 */
        mintERC20Tokens, approveTokenSC, owners,
        /* FractionalizeNFT */
        lockNFT, depositTokens, distributeTokens, getLockedNFTs
      } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [donators, setDonators] = useState([]);

  const [form, setForm] = useState({
    startDate: '',
    deadline: '',
    uri: ''
  });

  const [nftMinted, setNFTMinted] = useState(false);
  const [nftIsLocked, setNFTIsLocked] = useState(false);
  const [balance, setBalance] = useState([]);

  const handleMint = async () => {
    if (nftMinted) return;

    setIsLoading(true);
    await onMintClick(state.title, state.description, form.uri);
    
    const mintedNFTid = await tokenID();  
    
    await approveSC(mintedNFTid);
    await lockNFT(mintedNFTid, state.title, state.description, form.uri);

    setNFTMinted(true);
    setIsLoading(false);
  }

  const processDonators = (donators) => {
    const funders = donators.map(item => item.donator);
    const donations = donators.map(item => item.donations);
    
    return [funders, donations];
  }

  const [funders, donations] = processDonators(donators);

  const handleShareOwnership = async () => {
    if (nftIsLocked) return;

    setIsLoading(true);
    const mintedNFTid = await tokenID(); 
    const amount = 10000;
    await mintERC20Tokens(amount, mintedNFTid); // hardcoded

    await approveTokenSC(amount); // hardcoded

    await depositTokens(amount); // hardcoded

    await distributeTokens(
      amount,
      mintedNFTid,
      funders,
      donations.map(donation => {
        const floatValue = parseFloat(donation);
        return floatValue.toString();
      })
      );

    setNFTIsLocked(true);
    setIsLoading(false);
  }

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  };

  const fetchDonators = async () => {
    setIsLoading(true);
    const data = await getDonations(state.pId);
    
    setDonators(data);
    setIsLoading(false);
  }

  const fetchNFTs = async () => {
    setIsLoading(true);
    const nfts = await getNFTs();
    console.log(nfts);
    const nftIsInList = nfts.some((nft) => 
      nft.description === state.description);

    if (nftIsInList) {
      setNFTMinted(true);
    }

    setIsLoading(false);
  }

  const fetchLockedNFTs = async () => {
    setIsLoading(true);
    const lockednfts = await getLockedNFTs();
    const nftIsInLocked = lockednfts.some((nft) => 
      nft.title === state.title);

    if (nftIsInLocked) {
      setNFTIsLocked(true);
    }
  
    setIsLoading(false);
  }

  const fetchOwnershipPercent = async () => {
    setIsLoading(true);
    const totalTokens = 10000;
    let balance = [];
    for (let i = 0; i < funders.length; i++) {
      let tokens = await owners(funders[i]);
      if (tokens = totalTokens) {
        balance.push(tokens);
        break;
      }
    }
    setBalance(balance);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  useEffect(() => {
    if(nftMovieContract) {
      fetchNFTs();
    }
  }, [nftMovieContract, address])

  useEffect(() => {
    if(FractionalizeNFTContract) fetchLockedNFTs();
  }, [FractionalizeNFTContract, address])
  
  useEffect(() => {
    if(nftMovieTokenContract) fetchOwnershipPercent(); 
  }, [nftMovieTokenContract, address])

  

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between md:mt-[50px]">
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="#Funders" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Producer</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#f9fcff] cursor-pointer">
                <img src={profile} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]"># Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Story</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
              </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Funders</h4>

              <div className="mt-[20px] flex flex-col gap-4">
                {donators.length > 0 ? donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donations}</p>
                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No Funders yet.</p>
                )}
              </div>
          </div>
        

          <>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#1dc071] uppercase">Additonal Info</h4>
              <div className="mt-[20px] flex flex-col gap-4">
                  <FormField 
                    labelName="Production start date *"
                    placeholder="Start Date"
                    inputType="date"
                    value={form.startDate}
                    handleChange={(e) => handleFormFieldChange('startDate', e)}
                  />
              </div>

              <div className="mt-[20px] flex flex-col gap-4">
                  <FormField 
                    labelName="Production end date *"
                    placeholder="End Date"
                    inputType="date"
                    value={form.deadline}
                    handleChange={(e) => handleFormFieldChange('deadline', e)}
                  />
              </div>

              <div className="mt-[20px] flex flex-col gap-4">
                <FormField 
                  labelName="Movie URI"
                  placeholder="Place movie IPFS URI"
                  inputType="url"
                  value={form.uri}
                  handleChange={(e) => handleFormFieldChange('uri', e)}
                />
              </div>
          </>

          <div>
              <CustomButton 
                btnType="button"
                title={nftMinted ? "Released" : "Ready to Release" }
                styles={nftMinted ? "w-full bg-[#9fb4aa]" : "w-full bg-[#1dc071]"}
                handleClick={nftMinted ? null : handleMint} // Call cascade / series of tx to mint, approve, lock NFT ERC721
              />
          </div>

          <div className="my-[10px] w-full flex items-center p-4 bg-[#8c6dfd] h-[130px] rounded-[10px]">
            <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
              <div>
                <h4 className="font-epilogue font-semibold text-[20px] leading-[22px] text-white p-4">First release the movie as NFT</h4>
                 <p className="font-epilogue font-normal leading-[22px] text-white p-4">Then share the fractions of NFT with funders according to their investments!</p>
              </div>            
          </div>

          <div>
              <CustomButton 
                btnType="button"
                title={nftIsLocked ? "Ownership is distributed" : "Share the Ownership"}
                styles={nftIsLocked ? "w-full bg-[#9fb4aa]" : "w-full bg-[#1dc071]"}
                handleClick={nftIsLocked ? null : handleShareOwnership} // Call cascade / series of tx to mint, deposit, distribute ERC20 tokens
              />
          </div>

          <div>
            {nftIsLocked ? (
              <>
              <h4 className="font-epilogue font-semibold text-[18px] text-[#1dc071] uppercase">Owners</h4>

              <div className="mt-[20px] flex flex-col gap-4">
                {donators.length > 0 ? donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>   
                    <p className="font-epilogue font-semibold text-[16px] text-[#1dc071] leading-[26px] break-ll">{((item.donations * 100) / state.target).toFixed(2)} %</p>
                  </div>
                )) : (
                  null
                )}
              </div>
              </>
            ) : (
              null
            )}
          </div>
        
         </div> 
      </div>
    </div>
  )
}

export default ProducerCampaignDetails