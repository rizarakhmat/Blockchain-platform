import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStateContext } from '../../context'
import { CustomButton, FormField } from '../../components/Producer'
import { Loader, CountBox } from '../../components'
import { calculateTimeLeft, daysLeft, formatDate } from '../../utils'
import { profile, money } from '../../assets'

const DistributorCampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { buyStreamingRight, payRoyalties, getDAs, getTimeWindow, getCountryList, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [donators, setDonators] = useState([]);
  // states needed for remunirateRoyalties();
  const [buyers, setBuyers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ 
    numberOfUsers: '',
    subscriptionFee: '',
    shareOfRevenue: ''
  });

  const [timeWindow, setTimeWindow] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [price, setPrice] = useState();
  const [isDASet, setIsDASet] = useState(false);
  const [isSteamingRightOwner, setIsSteamingRightOwner] = useState();

  // function to update form
  const handleFormFieldChange = (fieldName, e) => {
   setForm({ ...form, [fieldName]: e.target.value });
  }

  const fetchDonators = async () => {
    setIsLoading(true);
    const data = await getDonations(state.pId);
    setDonators(data);
    setIsLoading(false);
  }

  // function to get Info about Distribution Agreement
  const fetchTimeCountry = async () => {
    setIsLoading(true);
    
    // fetch Time window and convert using formatDate()
    const times = await getTimeWindow(state.pId);

    const reversedTime = times.map(time => {
      return {
        startDate: formatDate(new Date(time.startDate * 1000)),
        deadline: formatDate(new Date(time.deadline * 1000))
      };
    });
    setTimeWindow(reversedTime);

    //fetch Counrty List
    const countries = await getCountryList(state.pId);
    setCountryList(countries);

    setIsLoading(false);
  }

  const getDAInfo = async () => {
    setIsLoading(true);
    const allDAs = await getDAs();

      if (allDAs[state.pId].isDASet) {
        setIsDASet(allDAs[state.pId].isDASet);
        const price = allDAs[state.pId].priceDA.toString();
        setPrice(price);
  
        const isPricePaid = allDAs[state.pId].isPricePaid;
        setIsSteamingRightOwner(isPricePaid);

        fetchTimeCountry();
      }
    setIsLoading(false);
  }

  // function to "Buy" rights
  const buyRight = async () => {
    setIsLoading(true);

    await buyStreamingRight(state.pId, price);
    navigate('/distributor/');
    setIsLoading(false);
  }

  const remunerateRoyalties = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    const data = await payRoyalties(
      state.pId,
      { ...form}
    );
    setIsLoading(false);
    navigate('/distributor/');
  }


  // internal function to calculate Sum of all donationions of this address
  const calculateSum = (owner) => {
    let sum = 0;

    donators.forEach((item) => {
      for (const prop in item) {

        if (prop === "donator" && item.donator === owner) {
          sum += parseFloat(item.donations);
        } 
      }
    })

    return sum;
  };

  useEffect(() => {
    if(contract) 
    fetchDonators();
    getDAInfo();
  }, [contract, address])

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateTimeLeft(timeWindow.map(i => i.startDate), timeWindow.map(i => i.deadline))}%`, maxWidth: '100%'}}> 
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between md:mt-[50px]">
          <CountBox title="You payed" value={calculateSum(address)} />
          <CountBox title="#Funders" value={donators.length} />
          {isDASet ? (
            <CountBox title="Days left" value={daysLeft(timeWindow.map(i => i.deadline))} />
          ) : null}
          
        </div>
      </div> 

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Producer</h4>

            <div className="flex flex-row items-center flex-wrap gap-[14px]">
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
            <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Title</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.title}</p>
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

          <>
          {isDASet ? (
            <>
                <h4 className="font-epilogue font-semibold text-[20px] text-[#1dc071] uppercase">Streaming right</h4>
                <div className='flex lg:flex-row flex-col gap-5'>
                <div className='flex-1 flex-col gap-[40px]'>
                  <div>
                    <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Time Window</h4>
                    {timeWindow.map((item, index) => (
                      <div>
                        <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll mt-[20px]">Start Date: {item.startDate}</p>
                        <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll mt-[10px]">End Date: {item.deadline}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase mt-[20px]">Country list</h4>
                    {countryList.map((item, index) => (
                      <div className='mt-[10px]'>
                        <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{item}</p>
                    </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase mt-[20px]">Price requested to redeem the streaming right</h4>
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll mt-[10px]">{price}</p>
                  </div>
                  <div className="w-full mt-[10px]">
                    <CustomButton 
                      btnType="button"
                      title={isSteamingRightOwner ? "You already posess the Streaming right" : "Buy"}
                      styles={isSteamingRightOwner ? "w-full bg-[#9fb4aa]" : "w-full bg-[#8c6dfd]"}
                      handleClick={isSteamingRightOwner ? () => {} : buyRight}
                    />
                  </div>
                </div>
                </div>
            </>
          ) : null}
    
          {isSteamingRightOwner ? (
             <form onSubmit={remunerateRoyalties}  className='flex-1'>
             <h4 className="font-epilogue font-semibold text-[18px] text-[#1dc071] uppercase">Royalties remuneration</h4>
               <div className="mt-[20px]">
                 <FormField 
                   labelName="Numbers of users"
                   placeholder="Enter # users"
                   inputType="text"
                   inputMode="numeric"
                   value={form.numberOfUsers}
                   handleChange={(e) => handleFormFieldChange('numberOfUsers', e)}
                 />
               </div>
               <div className="mt-[20px]">
                 <FormField 
                   labelName="User subscription fee"
                   placeholder="1 ETH"
                   inputType="text"
                   inputMode="numeric"
                   value={form.subscriptionFee}
                   handleChange={(e) => handleFormFieldChange('subscriptionFee', e)}
                 />
               </div>
               <div className="mt-[20px]">
                 <FormField 
                   labelName="Share of revenue"
                   placeholder="10"
                   inputType="text"
                   inputMode="numeric"
                   value={form.shareOfRevenue}
                   handleChange={(e) => handleFormFieldChange('shareOfRevenue', e)}
                 />
               </div>
             
             <div>
               <div className="mt-[20px] flex flex-col p-4 bg-[#e6e8eb] rounded-[10px]">
                 <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                   Payment of the royalties back to the funders of the movie
                 </p>
                 <div className="mt-[30px]">
                   <CustomButton 
                     btnType="submit"
                     title="Pay royalties"
                     styles="w-full bg-[#1dc071]"
                   />
                 </div>
               </div>
             </div>
           </form>
          ) : (
            null
          )}
           
          </>
        </div>  
      </div>
    </div>
  )
}

export default DistributorCampaignDetails