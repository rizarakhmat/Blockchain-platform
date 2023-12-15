import React, { useState, useEffect } from 'react'

import { useStateContext } from '../../context'
import { BroadcasterDisplayCampaigns } from '../../components/Broadcaster'

const EnduserProfile = () => {
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
      <BroadcasterDisplayCampaigns 
        title="My Funded Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </>
  )
}

export default EnduserProfile