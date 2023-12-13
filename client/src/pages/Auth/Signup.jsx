import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomButton, FormField, Dropdown } from '../../components/Producer'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/signup';

const Signup = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const [role, setRole] = useState('');
  const options = [
    { label: 'Producer', value: 'Producer' },
    { label: 'Broadcaster', value: 'Broadcaster' },
    { label: 'Distributor', value: 'Distributor' },
    { label: 'End User', value: 'End User' }
 
  ];

  useEffect(() => {
      setValidName(USER_REGEX.test(user));
  }, [user])

  useEffect(() => {
      setValidPwd(PWD_REGEX.test(pwd));
      setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
      setErrMsg('');
  }, [user, pwd, matchPwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  const handleRole = (e) => {
    setRole(e.target.value);
  }

  return (
    <div className='flex justify-center items-center'>
      <div>
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-[#1dc071]">Signup</h1>
        <form onSubmit={handleSubmit} className='w-[420px] h-[400px] mt-[15px] flex flex-col flex-start gap-[10px]'>
          <FormField 
            labelName="email"
            placeholder="Email"
            inputType="text"
            value={user}
            ref={userRef}
            autoComplete="off"
            handleChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? "false" : "true"}
          />

          <FormField 
            labelName="Password"
            placeholder="Create password"
            inputType="password"
            value={pwd}
            handleChange={(e) => setPwd(e.target.value)}
            required
            aria-invalid={validPwd ? "false" : "true"}
          />

          <FormField
            labelName="Confirm Password"
            placeholder="Repeat password"
            inputType="password"
            value={matchPwd}
            handleChange={(e) => setMatchPwd(e.target.value)}
            required
            aria-invalid={validMatch ? "false" : "true"}
          />

          <Dropdown
            labelName="Choose the role"
            options={options}
            value={role}
            onChange={handleRole}
          />

          <div className="flex justify-center items-center">
            <CustomButton
              disabled={!validName || !validPwd || !validMatch ? true : false}
              btnType="submit"
              title="Sign Up"
              styles="bg-[#1dc071]"
            />
          </div>
        </form>

      <div className="mt-[50px]">
        <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
            Already registered?<br />
            <span className="underline decoration-gray-500">
                {/*put router link here*/}
                <a href="#">Sign In</a>
            </span>
        </p>
      </div>
      </div>
    </div>
  )
}

export default Signup