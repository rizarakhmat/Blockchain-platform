import React, { useState, useEffect } from 'react'
import { useStateContext } from '../../context'
import { Loader, DisplayVoteCandidates } from '../../components'

const VotingPage = () => {
  const { Deny, Accept, readCandidates, address, contrac, votingContract } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState('');
  const [candidates, setCandidates] = useState([]);
 
  async function voteAccept() {
    setIsLoading(true); 
    const vote = await Accept(number);
    setIsLoading(false);  
  }
  
  async function voteDeny() {
    setIsLoading(true); 
    const vote = await Deny(number);
    setIsLoading(false);  
  }

  async function getCandidates() {
    setIsLoading(true);
    const parseCandidates = await readCandidates();
    setCandidates(parseCandidates);
    setIsLoading(false); 
  } 
  
  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  useEffect(() => {
    if(votingContract) 
      getCandidates();
  }, [address, votingContract])

  return (
    <div className='bg-[#e6e8eb] flex justify-center item-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader />}

      <DisplayVoteCandidates
        isLoading={isLoading}
        candidates = {candidates}
        number= {number}
        handleNumberChange = {handleNumberChange}
        voteAccept = {voteAccept}
        voteDeny = {voteDeny}
      />
    </div>
  )
}

export default VotingPage