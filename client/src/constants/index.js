import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: 'create-campaign',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '',
    disabled: true,
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: 'producer-profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/login',
    disabled: true,
  },
];

export const broadcasterNavbar = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '',
    disabled: true,
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: 'broadcaster-profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/login',
    disabled: true,
  },
];

export const enduserNavbar = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '',
    disabled: true,
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: 'enduser-profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/login',
    disabled: true,
  },
];

export const distributorNavbar = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '',
    disabled: true,
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: 'distributor-profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/login',
    disabled: true,
  },
];