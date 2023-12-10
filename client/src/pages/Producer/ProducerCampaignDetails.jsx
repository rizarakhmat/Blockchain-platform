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
  const { onMintClick, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [donators, setDonators] = useState([]);

  const [form, setForm] = useState({
    startDate: '',
    deadline: '',
    uri: ''
  });

  const handleMint = async () => {
    setIsLoading(true);
    onMintClick();
    setIsLoading(false);
    navigate('/');
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

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

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
            <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Creator</h4>

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
        

          <div>
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

              <div className="my-[20px] w-full flex items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
                <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
                <h4 className="font-epilogue font-semibold text-[20px] leading-[22px] text-white p-4 ">Ready to release?</h4>
                <p className="font-epilogue font-normal text-white ml-[20px]">Share the ownership with other buyers.</p>
              </div>

              <div className="mt-[20px]">
                <CustomButton 
                  btnType="button"
                  title="Ready to Release"
                  styles="w-full bg-[#1dc071]"
                  handleClick={handleMint} // Call SM NFT
                />
              </div>
          </div>
        </div>  
        
      </div>
    </div>
  )
}

export default ProducerCampaignDetails