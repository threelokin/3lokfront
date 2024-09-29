
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Import your CSS file for transitions
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const TopNav = ({ onLanguageSelect }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');


  useEffect(() => {
    // Update the language state when the component mounts
    setLanguage(localStorage.getItem('language') || 'english');
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setLanguageMenuOpen(false); // Close language menu when toggling main menu
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setLanguageMenuOpen(false); // Close language menu when closing main menu
  };


const logo = '/logo.png';

  const englishNavItems = {
    home: 'Home',
    about: 'About',
  };
  const navItems = {
    english: englishNavItems,
    telugu: {
    //   home: 'హోమ్',
    //   about: 'మా గురించి',
    home: 'Home',
    about: 'About',

    }
    // Add more languages as needed...
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full  bg-white shadow-md z-40 h-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="">
                <div className='-mt-3'>
            {/* <div className="text-gray-800 font-bold text-md  py-1 px-2 playwrite-dk-uloopet"> */}
            {/* <span className='text-blue-700 text-2xl'>3</span>{language === 'te' ? 'లోక్ న్యూస్' : 'Lok News'} */}
        <img src={logo} alt="3Lok News" className=' h-20'/>
            </div>
            </span>
          </div>
          <div className="flex items-center ">
            <>
              {!menuOpen && (
                <button onClick={toggleMenu} className="text-black-900 text-2xl mr-3 focus:outline-none -mt-3">
                  <HiMenuAlt3 />
                </button>
              )}
              {menuOpen && (
                <button onClick={closeMenu} className="text-2xl absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
                  <IoClose />
                </button>
              )}
            </>
          </div>
        </div>
      </nav>
      <div className={`fixed inset-0 bg-white z-30 transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="text-black text-center flex items-center justify-center h-full ">
          <ul className="space-y-4">
            <li>
              <Link to="/" onClick={closeMenu} className="text-2xl">{navItems[language].home}</Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu} className="text-2xl">{navItems[language].about}</Link>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
