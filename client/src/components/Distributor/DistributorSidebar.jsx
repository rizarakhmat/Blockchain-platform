import React, { useState } from 'react';
import { Link, useNavigate }from 'react-router-dom';

import { ebu_logo } from '../../assets';
import { distributorNavbar } from '../../constants';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div className={`w-[52px] h-[52px] rounded-[10px] ${isActive && isActive === name && 'bg-[#f9fcff]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={'grayscale'} />
    )}
  </div>
)

const DistributorSidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  return (
    <div className='flex justify-between items-center flex-col sticky top-5 h-[93vh]'>
      <Link to="/distributor">
        <Icon styles='relative bg-[#f9fcff]' imgUrl={ebu_logo} />
      </Link>

      <div className='flex-1 flex flex-col justify-between items-center bg-[#e6e8eb] rounded-[20px] relative py-4 mt-12'>
        <div className='flex flex-col justify-center items-center gap-3'>
          <ul className='mb-4'>
            {distributorNavbar.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#e6e8eb]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  navigate(link.link);
                }}
              >

                <img 
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                  {link.name}
                </p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}

export default DistributorSidebar