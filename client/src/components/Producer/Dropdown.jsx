import React, { useState } from 'react'
import { upArrow, downArrow } from '../../assets'

const Dropdown = ({ labelName, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <label className='flex-1 w-full flex flex-col'>
      {labelName && (
      <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">{labelName}</span>
    )}
    <select 
      value={value}
      onChange={onChange}
      className='py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#4b5264] text-[14px] min-h-[52px] px-4 rounded-[10px] flex flex-row justify-between items-center'
    >
      {options.map((option) => (

      <option value={option.value}>{option.label}</option>

      ))}
    </select>
    </label>
  )
}

export default Dropdown