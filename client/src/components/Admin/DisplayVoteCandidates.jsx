import React from 'react'
import { FormField, CustomButton } from '../Producer'
import { loader } from '../../assets'

const DisplayVoteCandidates = (props) => {
    
  return (
    <div>
      {props.isLoading && (
        <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
      )}
      {!props.isLoading && (
        <div>
          <h1 className='font-epilogue font-semibold text-[18px] text-[#1dc071] text-left'>Voting to allow access / withdraw access</h1>

          <div className='mt-[20px]'>
            <div className='flex flex-wrap gap-[40px]'>
              <FormField 
                labelName="Candidate Index *"
                placeholder="Enter Candidate Index"
                inputType="text"
                inputMode="numeric"
                value={props.number}
                handleChange={props.handleNumberChange}
              />
            </div>
            </div>

            <div className='flex flex-row gap-[10px]'>
              <div className="mt-[30px]">
                <CustomButton 
                  btnType="button"
                  title="Vote to allow access"
                  styles="w-full bg-[#1dc071]"
                  handleClick={props.voteAccept}
                />
              </div>
              <div className="mt-[30px]">
                <CustomButton 
                  btnType="button"
                  title="Vote to withdraw access"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={props.voteDeny}
                />
              </div>
            </div>
          
        </div>
      )}

      {!props.isLoading && (
        <table id="myTable" className="min-w-full text-left text-sm font-light text-[#808191] mt-[20px]">
        <thead className='border-b font-medium dark:border-neutral-500'>
        <tr>
            <th>Index</th>
            <th>Candidate name</th>
            <th>Candidate votes</th>
        </tr>
        </thead>
        <tbody>
        {props.candidates.map((candidate, index) => (
            <tr key={index} className='border-b dark:border-neutral-500'>
            <td className='whitespace-nowrap px-6 py-4 font-medium'>{candidate.index}</td>
            <td className='whitespace-nowrap px-6 py-4'>{candidate.name}</td>
            <td className='whitespace-nowrap px-6 py-4'>{candidate.voteCount}</td>
            </tr>
        ))}
        </tbody>
        </table>
      )}
    </div>
  )
}

export default DisplayVoteCandidates