import React, { useState, useEffect } from 'react'
import { useStateContext } from '../../context'
import { DistributorDisplayCampaigns } from '../../components/Distributor'

const DistributorProfile = () => {
  const { address, contract, getUserFundedCampaigns, royaltiesRemunerationContract, getDAs, getCampaigns } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsWithRight, setCampaignsWithRight] = useState([]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserFundedCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }
  
  const fetchCampaignsWithRight = async () => {
    setIsLoading(true);
    const allCampaigns = await getCampaigns();
    const data = await getDAs();

    let matchingElements = [];
    for (let campaign of allCampaigns){
      for (let campaignRight of data) {
        if (campaign.title === campaignRight.title && campaignRight.distributorName === address) {
          matchingElements.push(campaign);
        }
      }
    }
    setCampaignsWithRight(matchingElements);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract])
  
  useEffect(() => {
    if(royaltiesRemunerationContract) fetchCampaignsWithRight();
  }, [address, royaltiesRemunerationContract])

  return (
    <div className="flex flex-col gap-5">
      <DistributorDisplayCampaigns 
        title="My Funded Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />

      {/* Display campaigns Distributor has streaming right for */}
      <DistributorDisplayCampaigns 
        title="My Streaming Rights Campaigns"
        isLoading={isLoading}
        campaigns={campaignsWithRight}
      />
    </div>
  )
}

export default DistributorProfile