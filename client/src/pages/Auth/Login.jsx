import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomButton, FormField, Dropdown } from '../../components/Producer'

const Login = () => {
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    navigate('/');
  }

  return (
    <div className='flex justify-center items-center mt-[200px]'>
      <div>
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-[#1dc071]">Login</h1>
        <form onSubmit={handleSubmit} className='w-[420px] h-[200px] mt-[15px] flex flex-col flex-start gap-[10px]'>
          <FormField 
            placeholder="Email"
            inputType="text"
            /* value={user}
            ref={userRef}
            autoComplete="off"
            handleChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? "false" : "true"} */
          />

          <FormField 
            placeholder="Password"
            inputType="password"
            /* value={pwd}
            handleChange={(e) => setPwd(e.target.value)}
            required
            aria-invalid={validPwd ? "false" : "true"} */
          />

          <div className="flex justify-center items-center">
            <CustomButton
              btnType="submit"
              title="Login"
              styles="bg-[#1dc071]"
            />
          </div>
        </form>

      <div className="mt-[30px]">
        <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
            New here?<br />
            <span className="underline decoration-gray-500">
                <a href="/signup">Sign up</a>
            </span>
        </p>
      </div>
      </div>
    </div>
  )
}

export default Login