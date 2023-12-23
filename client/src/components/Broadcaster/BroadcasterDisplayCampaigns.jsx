import React from 'react'
import { useNavigate } from 'react-router-dom'

import { loader } from '../../assets'
import { FundCard } from '..'

const BroadcasterDisplayCampaigns = ({ title, isLoading, campaigns, nftIsMinted }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`broadcaster-campaign-details/${campaign.title}`, { state:
      campaign
    })
  }

  
  return (
    <div>
      <h1 className='font-epilogue font-semibold text-[18px] text-[#1dc071] text-left'>{title}</h1>

      <div className='flex flex-wrap mt-[20px] gap-[26px]'>
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not funded any campigns yet
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map(
          (campaign) => <FundCard 
            key={campaign.id}
            {...campaign}
            handleClick={() => handleNavigate(campaign)}
        />)}
      </div>
    </div>
  )
}

export default BroadcasterDisplayCampaigns