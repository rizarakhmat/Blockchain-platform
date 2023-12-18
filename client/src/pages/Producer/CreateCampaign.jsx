import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'

import { useStateContext } from '../../context'
import { checkIfImage } from '../../utils'
import { CustomButton, FormField } from '../../components/Producer'
import { Loader } from '../../components'

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    title: '',
    description: '',
    target: '',
    image: '',
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if(exists) {
        setIsLoading(true);
        await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18)});
        setIsLoading(false);
        navigate('/producer/');
      } else {
        alert('Provide valid image URL');
        setForm({ ...form, image: '' });
      }
    })

    console.log(form);
  }

  return (
    <div className='bg-[#e6e8eb] flex justify-center item-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#1dc071] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className='w-full mt-[65px] flex flex-col gap-[30px]'>
        <div className='flex flex-wrap gap-[40px]'>
          <FormField 
            labelName="Movie Title *"
            placeholder="Write a movie title "
            inputType="title"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField 
          labelName="Movie Description"
          placeholder="Write your story "
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <FormField 
          labelName="Goal *"
          placeholder="Target amount of ETH"
          inputType="text"
          value={form.target}
          handleChange={(e) => handleFormFieldChange('target', e)}
        />
        <FormField 
          labelName="Thumbnail image"
          placeholder="Place image URL to upload thumbnail"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />
        
        <div className='flex justify-center items-center mt-[40px]'>
          <CustomButton 
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>
        
      </form>
    </div>
  )
}

export default CreateCampaign