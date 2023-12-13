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
  const { erc20tokens, getDonations, contract, nftMovieTokenContract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [donators, setDonators] = useState([]);
  const [numberOfTokens, setNumberOfTokens] = useState();

  const [countries, setCountries] = useState([{ id: 0, value: '' }]);
  const [count, setCount] = useState(1);

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
   console.log(form)
  }

  const fetchDonators = async () => {
    setIsLoading(true);
    const data = await getDonations(state.pId);

    setDonators(data);
    setIsLoading(false);
  }

  const fetchNumberOfTokens = async () => {
    setIsLoading(true);
    let tokens = await erc20tokens();
    setNumberOfTokens(tokens);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address])

  useEffect(() => {
    if(nftMovieTokenContract) fetchNumberOfTokens(); 
  }, [nftMovieTokenContract, address])

  // Functions to update country list
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

    console.log(form);

  };

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
            {numberOfTokens > 0 ? (
              <>
                <h4 className="font-epilogue font-semibold text-[18px] text-[#1dc071] uppercase">Ownership</h4>

                <div className="mt-[20px]">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">You are the owner of {(numberOfTokens * 100) / 10} % of the "{state.title}" NFT. Now you can set up the Distribution Agreement.</p>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

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
                {donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donations}</p>
                  </div>
                ))}
              </div>
          </div>

          <>
            {numberOfTokens > 0 ? ( 
                <div>
                  <h4 className="font-epilogue font-semibold text-[20px] text-[#1dc071] uppercase mb-[20px]">Distribution Agreement Info</h4>
                  <div>
                    <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Distributor Info</h4>
    
                    <div> 
                      <div className="mt-[20px] flex flex-col gap-4">
                        <FormField 
                          labelName="Distributor Name *"
                          placeholder="Name of Distributor company"
                          inputType="text"
                          value={form.name}
                          handleChange={(e) => handleFormFieldChange('name', e)}
                        />
                      </div>
                      <div className="mt-[20px] flex flex-col gap-4">
                        <FormField 
                          labelName="Price paid by Distributor *"
                          placeholder="ETH 0.01"
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
                      btnType="button"
                      title="Set Distribution aggrement"
                      styles="w-full bg-[#1dc071]"
                      //handleClick={} // Call SM NFT
                    />
                  </div>
              </div>
            ) : (
              <>
                <h4 className="font-epilogue font-semibold text-[20px] text-[#1dc071] uppercase mb-[20px]">Distribution Agreement Info</h4>

                <div className="mt-[20px]">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">You could be able to set up the Distribution Agreement after you will become the owner of the NFT fraction.</p>
                </div>
              </>
            )}
          </>

        </div>  
        
      </div>
    </div>
  )
}

export default BroadcasterCampaignDetails