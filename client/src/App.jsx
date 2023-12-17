import React from 'react'
import { Route, Routes } from 'react-router-dom';

import { NavbarProducer, SidebarProducer, BroadcasterNavbar, BroadcasterSidebar, DistributorSidebar, EndUserSidebar } from './components';
import { Login, Signup, Payment, Home, Profile, CampaignDetails, CreateCampaign, BroadcasterProfile, ProducerCampaignDetails, BroadcasterCampaignDetails, DistributorCampaignDetails, DistributorProfile, EnduserProfile, EnduserCampaignDetails } from './pages';
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producer/*" element={
          <div className='relative sm:-8 p-4 bg-[#f9fcff] min-h-screen flex flex-row'>
            <div className='sm:flex hidden mr-10 relative'>
              <SidebarProducer />
            </div>

            <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
            <NavbarProducer />
            <Routes>
              <Route path="" element={<Home />}/>
              <Route path="producer-profile" element={<Profile />}/>
              <Route path="campaign-details/:id" element={<CampaignDetails />}/>
              <Route path="create-campaign" element={<CreateCampaign />}/>
              <Route path="producer-profile/producer-campaign-details/:id" element={<ProducerCampaignDetails />}/>
            </Routes>
          </div>
          </div>
        }>
        </Route>

        <Route path="/broadcaster/*" element={
          <div className='relative sm:-8 p-4 bg-[#f9fcff] min-h-screen flex flex-row'>
            <div className='sm:flex hidden mr-10 relative'>
              <BroadcasterSidebar />
            </div>

            <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
            <BroadcasterNavbar />
            <Routes>
              <Route path="" element={<Home />}/>
              <Route path="broadcaster-profile" element={<BroadcasterProfile />}/>
              <Route path="campaign-details/:id" element={<CampaignDetails />}/>
              <Route path="broadcaster-profile/broadcaster-campaign-details/:id" element={<BroadcasterCampaignDetails />}/>
            </Routes>
          </div>
          </div>
        }>
        </Route>

        <Route path="/enduser/*" element={
          <div className='relative sm:-8 p-4 bg-[#f9fcff] min-h-screen flex flex-row'>
            <div className='sm:flex hidden mr-10 relative'>
              <EndUserSidebar />
            </div>

            <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
            <BroadcasterNavbar />
            <Routes>
              <Route path="" element={<Home />}/>
              <Route path="enduser-profile" element={<EnduserProfile />}/>
              <Route path="campaign-details/:id" element={<CampaignDetails />}/>
              <Route path="enduser-profile/broadcaster-campaign-details/:id" element={<EnduserCampaignDetails />}/>
            </Routes>
          </div>
          </div>
        }>
        </Route>

        <Route path="/distributor/*" element={
          <div className='relative sm:-8 p-4 bg-[#f9fcff] min-h-screen flex flex-row'>
            <div className='sm:flex hidden mr-10 relative'>
              <DistributorSidebar />
            </div>

            <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
            <BroadcasterNavbar />
            <Routes>
              <Route path="" element={<Home />}/>
              <Route path="distributor-profile" element={<DistributorProfile />}/>
              <Route path="campaign-details/:id" element={<CampaignDetails />}/>
              <Route path="distributor-profile/distributor-campaign-details/:id" element={<DistributorCampaignDetails />}/>
            </Routes>
          </div>
          </div>
        }>
        </Route>

        {/* Route for Signup without Navbar and Sidebar */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  )
}

export default App