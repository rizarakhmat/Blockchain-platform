import React from 'react'
import { Route, Routes } from 'react-router-dom';

import { NavbarProducer, SidebarProducer } from './components';
import { Login, Signup, Payment, Home, Profile, CampaignDetails, CreateCampaign, BroadcasterProfile, ProducerCampaignDetails, BroadcasterCampaignDetails, DistributorCampaignDetails, DistributorProfile, EnduserProfile, EnduserCampaignDetails } from './pages';
const App = () => {
  return (
    <div>
      <Routes>
        {/* Common layout with Navbar and Sidebar */}
        <Route
          path="*"
          element={
            <div className='relative sm:-8 p-4 bg-[#f9fcff] min-h-screen flex flex-row'>
              <div className='sm:flex hidden mr-10 relative'>
                <SidebarProducer />
              </div>

              <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
              <NavbarProducer />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/producer-profile" element={<Profile />} />
                <Route path="/create-campaign" element={<CreateCampaign />}/>
                <Route path="/producer-campaign-details/:id" element={<ProducerCampaignDetails />}/>

                <Route path="/broadcaster-profile" element={<BroadcasterProfile />}/>
                <Route path="/campaign-details/:id" element={<CampaignDetails />}/>
                <Route path="/broadcaster-campaign-details/:id" element={<BroadcasterCampaignDetails />}/>

                <Route path="/distributor-profile" element={<DistributorProfile />}/>
                <Route path="/distributor-campaign-details/:id" element={<DistributorCampaignDetails />} />

                <Route path="/enduser-profile" element={<EnduserProfile />} />
                <Route path="/enduser-campaign-details/:id" element={<EnduserCampaignDetails />}/>
              </Routes>
              </div>

            </div>
          }
        />
        {/* Route for Signup without Navbar and Sidebar */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  )
}

export default App