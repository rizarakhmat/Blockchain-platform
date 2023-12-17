import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { profile } from '../../assets';
import { useStateContext } from '../../context';

const BroadcasterNavbar = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-row flex-col-reverse justify-between mb-[48px] gap-6 '> 
      <div className='flex flex-row justify-end gap-4'>
        <Link>
          <div className='w-[52px] h-[52px] rounded-full bg-[#f9fcff] flex justify-center items-center cursor-pointer'>
            <img 
              src={profile} 
              alt='user' 
              className='w-[60%] h-[60%] object-contain' 
            />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default BroadcasterNavbar