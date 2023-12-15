import React, { useState, useEffect } from 'react'

import { useStateContext } from '../../context'
import { DistributorDisplayCampaigns } from '../../components/Distributor'

const DistributorProfile = () => {
  const { address, contract, getUserFundedCampaigns } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserFundedCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract])

  return (
    <>
      <DistributorDisplayCampaigns 
        title="My Funded Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />

      {/* Display campaigns Distributor has streaming right for */}
    </>
  )
}

export default DistributorProfile