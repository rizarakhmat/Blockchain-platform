import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStateContext } from '../../context'
import { CustomButton, FormField } from '../../components/Producer'
import { CountBox, Loader } from '../../components'
import { calculateBarPercentage } from '../../utils'
import { profile, money } from '../../assets'


const BroadcasterCampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getSharesOf, getId, getTimeWindow, getCountryList, setDistributionAggrem, getDonations, contract, royaltiesRemunerationContract, FractionalizeNFTContract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [donators, setDonators] = useState([]);

  const [countries, setCountries] = useState([{ id: 0, value: '' }]);
  const [count, setCount] = useState(1);
  const [isOwnerOfShare, setIsOwnerOfShare] = useState(false);

  const [timeWindow, setTimeWindow] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const [form, setForm] = useState({
    name: '',
    price: '',
    startDate: '',
    deadline: '',
    countries: [],
  });

  // function to update form
  const handleFormFieldChange = (fieldName, e) => {
   setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    await setDistributionAggrem(state.title, { ...form, startDate: Math.floor(new Date(form.startDate).getTime() / 1000), deadline: Math.floor(new Date(form.deadline).getTime() / 1000)} );

    setIsLoading(false);
    navigate('/broadcaster/');
  }

  // internal function to transfrom from timestamp to Date format
  function formatDate(inputDate) {
    const date = new Date(inputDate);
  
    if (isNaN(date)) {
      return "Invalid Date";
    }
  
    const month = date.getMonth() + 1; // Adding 1 because months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();
  
    // Pad the month and day with leading zeros if needed
    const formattedMonth = (month < 10) ? `0${month}` : month;
    const formattedDay = (day < 10) ? `0${day}` : day;
  
    return `${formattedMonth}/${formattedDay}/${year}`;
  }

  const fetchTimeCountry = async () => {
    setIsLoading(true);
    const curentId = await getId();
    
    // fetch Time window and convert using formatDate()
    const times = await getTimeWindow(curentId);

    const reversedTime = times.map(time => {
      return {
        startDate: formatDate(new Date(time.startDate * 1000)),
        deadline: formatDate(new Date(time.deadline * 1000))
      };
    });
    setTimeWindow(reversedTime);

    //fetch Counrty List
    const countries = await getCountryList(curentId);
    setCountryList(countries);
    
    setIsLoading(false);
  }
  // function to check if the address is owner of token that represent This movie NFT
  const fetchShares = async () => {
    setIsLoading(true);
    const ownedShares = await getSharesOf(address, state.pId);
    if (ownedShares.length > 0) {
      setIsOwnerOfShare(true);
    }
    setIsLoading(false);
  }

  const fetchDonators = async () => {
    setIsLoading(true);
    const data = await getDonations(state.pId);
    
    setDonators(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])
  
  useEffect(() => {
    if(FractionalizeNFTContract) fetchShares(); 
  }, [FractionalizeNFTContract, address])
  
  useEffect(() => {
    if(royaltiesRemunerationContract) fetchTimeCountry(); 
  }, [royaltiesRemunerationContract, address])

  // internal functions to update country list
  const handleAddCountry = () => {
    setCountries([...countries, { id: count, value: '' }]);
    setCount(count + 1);
  };

  const handleCountryChangeForm = (id, value) => {
    const updatedCountries = countries.map((country) =>
      country.id === id ? { ...country, value } : country
    );
    setCountries(updatedCountries);

    setForm((prevForm) => ({
      ...prevForm,
      countries: updatedCountries.map((country) => country.value),
    }))
  };

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
            {isOwnerOfShare ? ( 
                <div>
                  <h4 className="font-epilogue font-semibold text-[20px] text-[#1dc071] uppercase mb-[20px]">Distribution Agreement</h4>
                  <form onSubmit={handleSubmit}>
                  <div>
                    <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Distributor Info</h4>
    
                    <div> 
                      <div className="mt-[20px] flex flex-col gap-4">
                        <FormField 
                          labelName="Amount that the Distributor must pay to obtain the streaming right *"
                          placeholder="ETH 10"
                          inputType="text"
                          value={form.price}
                          handleChange={(e) => handleFormFieldChange('price', e)}
                        />
                      </div>
                    </div>
                  </div>
    
                  <div>
                    <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase mt-[20px]">Time Window</h4>
    
                    <div className="mt-[20px] flex flex-col gap-4">
                        <FormField 
                          labelName="Distribution start date *"
                          placeholder="Start Date"
                          inputType="date"
                          value={form.startDate}
                          handleChange={(e) => handleFormFieldChange('startDate', e)}
                        />
                    </div>
    
                    <div className="mt-[20px] flex flex-col gap-4">
                        <FormField 
                          labelName="Distribution end date *"
                          placeholder="End Date"
                          inputType="date"
                          value={form.deadline}
                          handleChange={(e) => handleFormFieldChange('deadline', e)}
                        />
                    </div>
    
                    <div>
                      <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase mt-[20px]">Country List</h4>
                      <div>
                        {countries.map((country) => (
                          <div key={country.id} className="mt-[20px] flex flex-row justify-between">
                            <FormField 
                              labelName="Country Name *"
                              placeholder="Enter country"
                              inputType="text"
                              value={country.value}
                              handleChange={(e) => handleCountryChangeForm(country.id, e.target.value)}
                            />
                            <div className="mt-[30px] ml-[10px]">
                              <CustomButton 
                                btnType="button"
                                title="+"
                                styles="w-[48px] h-[48px] bg-[#b2b3bd]"
                                handleClick={handleAddCountry}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
    
                  <div className="mt-[20px]">
                    <CustomButton 
                      btnType={countryList && timeWindow ? "button" : "submit"}
                      title={countryList && timeWindow ? "Distribution agreement is already settled" : "Set Distribution agreement"}
                      styles={countryList && timeWindow ? "w-full bg-[#9fb4aa]" : "w-full bg-[#1dc071]"}
                    />
                  </div>
                </form>
              </div>
            ) : (
              <>
                <h4 className="font-epilogue font-semibold text-[20px] text-[#1dc071] uppercase">Distribution Agreement</h4>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">You could be able to settle up the Distribution Agreement after you will become the owner of the NFT fraction.</p>
              </>
            )}
          </>

          <>
          {isOwnerOfShare && countryList && timeWindow ? (
            <>
              <div>
                <h4 className="font-epilogue font-semibold text-[20px] text-[#1dc071] uppercase mb-[20px]">Streaming right</h4>
                <div className='flex flex-col gap-[20px]'>
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
                    <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Country list</h4>
                    {countryList.map((item, index) => (
                      <div className='mt-[10px]'>
                        <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{item}</p>
                    </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
          </>
        </div>  
        
      </div>
    </div>
  )
}

export default BroadcasterCampaignDetails