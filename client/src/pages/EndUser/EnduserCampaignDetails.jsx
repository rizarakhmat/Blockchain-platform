import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStateContext } from '../../context'
import { CustomButton, FormField } from '../../components/Producer'
import { CountBox, Loader } from '../../components'
import { calculateBarPercentage } from '../../utils'
import { profile, money } from '../../assets'


const EnduserCampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getSharesOf, getDonations, contract, nftMovieTokenContract, FractionalizeNFTContract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [donators, setDonators] = useState([]);
  const [isOwnerOfShare, setIsOwnerOfShare] = useState(false);

  const fetchDonators = async () => {
    setIsLoading(true);
    const data = await getDonations(state.pId);

    setDonators(data);
    setIsLoading(false);
  }

  // to chech is the address is owner of token that represent This movie NFT
  const fetchShares = async () => {
    setIsLoading(true);
    const ownedShares = await getSharesOf(address, state.pId);
    if (ownedShares.length > 0) {
      setIsOwnerOfShare(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  useEffect(() => {
    if(nftMovieTokenContract) fetchNumberOfTokens(); 
  }, [nftMovieTokenContract, address])

  useEffect(() => {
    if(FractionalizeNFTContract) fetchShares(); 
  }, [FractionalizeNFTContract, address])

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
          <CountBox title="You funded" value={calculateSum(address)} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
        <div>
            {donators.map((item, index) => (
              isOwnerOfShare ? (
                <>
                    <h4 className="font-epilogue font-semibold text-[18px] text-[#1dc071] uppercase">Ownership</h4>
    
                    <div className="mt-[20px]">
                      <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">You are the owner of {((item.donations * 100) / state.target).toFixed(2)} % of the "{state.title}" NFT. Now you can set up the Distribution Agreement.</p>
                    </div>
                  </>
              ) : (
              null
              )
            ))}
          </div>

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
                {donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donations}</p>
                  </div>
                ))}
              </div>
          </div>

        </div>  
        
      </div>
    </div>
  )
}

export default EnduserCampaignDetails