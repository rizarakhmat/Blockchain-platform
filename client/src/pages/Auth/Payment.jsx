import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomButton, FormField } from '../../components/Producer'

const Payment = () => {
  const [state, setState] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (stateField, e) => {
    setState({ ...state, [stateField]: e.target.value });
  };

  const handleInputFocus = (e) => {
    setState((prev) => ({ ...prev, focus: e.target.name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(state)
    setIsSubmitted(true);
  }

  return (
    <div className='flex justify-center items-center mt-[60px]'>
      <div>
          <h4 className="font-epilogue font-semibold text-[16px] text-[#b2b3bd]">Annual Subscription</h4>
          <p className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-[#1dc071] my-[10px]">€100</p>
          <p className="font-epilogue font-medium text-[14x] text-[#b2b3bd] leading-[26px] break-ll">
          The sum will be refunded in case of rejection.
          </p>
      
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-[#1dc071] mt-[10px]">Invoice</h1>
        <form onSubmit={handleSubmit} className='w-[420px] h-[200px] mt-[15px] flex flex-col flex-start gap-[10px]'>
          <FormField 
            labelName="Card number"
            placeholder="1234 5678 9012 3456"
            inputType="text"
            inputMode="numeric"
            pattern="\d"
            value={state.number}
            handleChange={(e) => handleInputChange('number', e)}
            onFocus={handleInputFocus}
          />

          <FormField 
            labelName="Name on card"
            placeholder="Ex: John Website"
            inputType="text"
            value={state.name}
            handleChange={(e) => handleInputChange('name', e)}
            onFocus={handleInputFocus}
          />

          <FormField 
            labelName="Expiry date"
            placeholder="12/23"
            inputType="month"
            value={state.expiry}
            handleChange={(e) => handleInputChange('expiry', e)}
            onFocus={handleInputFocus}
          />

          <FormField 
            labelName="Security Code"
            placeholder="···"
            inputType="text"
            inputMode="numeric"
            pattern="\d{3,4}"
            value={state.cvc}
            handleChange={(e) => handleInputChange('cvc', e)}
            onFocus={handleInputFocus}
          />

          <div className="flex justify-center items-center">
            <CustomButton
              btnType="submit"
              title="Confirm"
              styles="bg-[#1dc071] mt-[10px]"
            />
          </div>
        </form>

        {isSubmitted ? (
          <div className="mt-[260px]  mb-[30px]">
          <p className="font-epilogue font-semibold text-[20px] text-[#b2b3bd] leading-[26px] break-ll">
              Thank you for your payment. ✅
          </p>
          <br />
          <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">You will be notified by email about the status of your request.</p> 
        </div>
        ) : (
          null
        )}

      </div>
    </div>
    )
}

export default Payment