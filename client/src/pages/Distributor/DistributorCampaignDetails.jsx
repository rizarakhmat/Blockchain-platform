import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStateContext } from '../../context'
import { CustomButton, FormField } from '../../components/Producer'
import { Loader, CountBox } from '../../components'
import { calculateTimeLeft } from '../../utils'
import { profile, money } from '../../assets'

const DistributorCampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [donators, setDonators] = useState([]);
  const [form, setForm] = useState({ users: '' });

  // function to update form
  const handleFormFieldChange = (fieldName, e) => {
   setForm({ ...form, [fieldName]: e.target.value })
   console.log(form)
  }

  const fetchDonators = async () => {
    setIsLoading(true);
    const data = await getDonations(state.pId);

    setDonators(data);
    console.log(data);
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
          <img src={state.image} /* src={money}  */alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ /* width: `${calculateTimeLeft(startDate, deadline)}%`, */ maxWidth: '100%'}}> {/* pass here the startDate, deadline info from broadcaster */}
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between md:mt-[50px]">
          <CountBox title="You payed" /* value={calculateSum(address)} */ />
          <CountBox title="#Funders" /* value={donators.length} */ />
          <CountBox title={`Time left`} /* value={state.amountCollected}  *//>
        </div>
      </div> 

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          {/* <div>
            {donators ? (
              <>
                <h4 className="font-epilogue font-semibold text-[18px] text-[#1dc071] uppercase">Streaming right possession</h4>

                <div className="mt-[20px]">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">You have the right to stream "{state.title}" movie.</p>
                </div>
              </>
            ) : (
              <></>
            )}
          </div> */}

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Producer</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] break-all">{state.owner}</h4>
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
            <h4 className="font-epilogue font-semibold text-[20px] text-[#1dc071] uppercase">Streaming right</h4>
            <div className='flex lg:flex-row flex-col gap-5'>
            <div className='flex-[0.8] flex-col gap-[40px]'>
              <div>
                <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Time Window</h4>
                <div className="mt-[10px]">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">12-01-2023</p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">12-31-2023</p>
                </div>
              </div>

              <div className="mt-[20px]">
                <h4 className="font-epilogue font-semibold text-[18px] text-[#808191] uppercase">Country list</h4>
                <div className="mt-[10px]">
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">Italy</p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">France</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              {/* <h4 className="font-epilogue font-semibold text-[18px] text-[#1dc071] uppercase">Streaming right</h4> */}   

              <div className="mt-[20px] flex flex-col p-4 bg-[#e6e8eb] rounded-[10px]">
                <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                  Price requested to redeem the streaming right
                </p>
                <p className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-center text-[#1dc071] mt-[10px]">€100 000</p>
                <div className="w-full mt-[10px]">
                  <CustomButton 
                    btnType="button"
                    title="Buy"
                    styles="w-full bg-[#8c6dfd]"
                    //handleClick={}
                  />
                </div>
              </div>
            </div>
            
            </div>
    
            <form /* onSubmit={}  */ className='flex-1 mt-[20px]'>
              <h4 className="font-epilogue font-semibold text-[18px] text-[#1dc071] uppercase">Royalties remuneration</h4>
                <div className="mt-[20px]">
                  <FormField 
                    labelName="Numbers of users"
                    placeholder="Enter # users"
                    inputType="text"
                    inputMode="numeric"
                    value={form.users}
                    handleChange={(e) => handleFormFieldChange('users', e)}
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
          </>
        </div>  
      </div>
    </div>
  )
}

export default DistributorCampaignDetails