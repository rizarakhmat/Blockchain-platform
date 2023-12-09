import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { logo, profile } from '../../assets';
import { CustomButton } from './';
import { useStateContext } from '../../context';

const Navbar = () => {
  const navigate = useNavigate();
  // const [isActive, setIsAcrive] = useState('dashboard');
  const { connect, address } = useStateContext();


  return (
    <div className='flex flex-row flex-col-reverse justify-between mb-[48px] gap-6 '> 
      <div className='flex flex-row justify-end gap-4'>
        <CustomButton 
          btnType="button"
          title={address ? 'Create a campaign' : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => {
            if(address) navigate('create-campaign')
            else connect();
          }}
        />

        <Link>
          <div className='w-[52px] h-[52px] rounded-full bg-[#f9fcff] flex justify-center items-center cursor-pointer'>
            <img src={profile} alt='user' className='w-[60%] h-[60%] object-contain'/>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Navbar