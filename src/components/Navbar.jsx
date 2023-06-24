import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthContext } from '../hooks/useAuthContext';
import { NavLink } from "react-router-dom";
import Hamburger from '../assets/hamburger.svg'
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const { session } = useAuthContext();
  const [toggleNavbar, setToggleNavbar] = useState(false)
  const location = useLocation();

  useEffect(() => {
    setToggleNavbar(false);
  }, [location]);


  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/')
  }

  return (
    <div className='bg-[#5367FF] p-4 flex justify-between items-center'>
      <NavLink to='/' className='font-bold text-4xl text-white'>
        LibGen
      </NavLink>

      <button className="md:hidden" onClick={() => setToggleNavbar(!toggleNavbar)}>
        <img src={Hamburger} alt="Logo" loading=""></img>
      </button>

      <div className={`md:flex md:gap-4 md:justify-center ${toggleNavbar ? "bg-blue-600 text-white absolute top-16 left-0 z-10 w-full flex flex-col items-center gap-4 py-4" : "hidden"}`}>
        <NavLink to='/' className='px-4 py-1 rounded-md font-bold text-white'>
          Home
        </NavLink>


        {
          !session ?
            <>
              <NavLink to='/signin' className='px-4 py-1 border-2 border-white rounded-md font-bold bg-white text-blue-600'>
                Sign In
              </NavLink>
            </>
            :
            <>
              <NavLink to='/cart' className='px-4 py-1 rounded-md font-bold text-white'>
                Cart
              </NavLink>
              <NavLink to='/shop' className='px-4 py-1 rounded-md font-bold text-white'>
                Shop
              </NavLink>
              <button onClick={signOut} className='px-4 py-1 border-2 border-white rounded-md font-bold bg-white text-blue-600'>
                Sign Out
              </button>
            </>
        }
      </div>

    </div>
  )
}
