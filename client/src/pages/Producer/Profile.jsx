import React, { useState, useEffect } from 'react'

import { useStateContext } from '../../context'
import { ProducerDisplayCampaigns } from '../../components';

const Profile = () => {
const [isLoading, setIsLoading] = useState(false);
const [campaigns, setCampaigns] = useState([]);

const { address, contract, getUserCampaigns } = useStateContext();

const fetchCampaigns = async () => {
  setIsLoading(true);
  const data = await getUserCampaigns();
  console.log(data);
  setCampaigns(data);
  setIsLoading(false);
}

useEffect(() => {
  if(contract) fetchCampaigns();
}, [address, contract])

  return (
    <>
      <ProducerDisplayCampaigns
      title="My Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
      />
    </>
  )
}

export default Profile