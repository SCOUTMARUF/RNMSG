


import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
        >
            <span>Switch Theme</span>
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
        </button>
    );
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<number | null>(null);

  const { isAdmin, currentUser, logout } = useAuth();
  const { navLinks } = useData();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const linkClasses = "px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-scout-green dark:hover:text-white transition-colors duration-300";
  const activeLinkClasses = "text-scout-green dark:text-white border-b-2 border-scout-green dark:border-white";

  const linkTree = navLinks
    .filter(link => !link.parentId)
    .sort((a, b) => a.order - b.order)
    .map(parent => ({
        ...parent,
        children: navLinks
            .filter(child => child.parentId === parent.id)
            .sort((a, b) => a.order - b.order)
    }));

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
        setOpenMobileSubmenu(null);
    }, 500);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (isOpen && !isClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, isClosing]);

  return (
    <header className={`shadow-md sticky top-0 z-50 transition-colors duration-300 ${isOpen ? 'bg-white dark:bg-gray-900' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-3">
              <img className="h-14 w-14" src={'https://res.cloudinary.com/dtqnpnzxj/image/upload/v1756393479/RNMSG_LOGO_ihktdl.png'} alt="RNMSG Logo" />
              <span className="font-bold text-lg text-scout-green dark:text-white hidden sm:block">
                RNMSG
              </span>
            </NavLink>
          </div>
          <div className="hidden md:flex items-center">
            <nav className="flex items-center space-x-1">
              {linkTree.map(link => {
                const hasChildren = link.children.length > 0;
                if (hasChildren) {
                  return (
                    <div 
                      key={link.id} 
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(link.id)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button className={`${linkClasses} flex items-center`}>
                        {link.title}
                        <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                      {openDropdown === link.id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none py-1 animate-slideDown">
                          {link.children.map(child => (
                             <NavLink key={child.id} to={child.path} onClick={() => setOpenDropdown(null)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{child.title}</NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                return (
                  <NavLink key={link.id} to={link.path} className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>
                    {link.title}
                  </NavLink>
                )
              })}
            </nav>
            <div className="ml-4">
              {isAdmin ? (
                  <div className="relative" ref={profileMenuRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="h-10 w-10 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-scout-green flex items-center justify-center overflow-hidden">
                      <span className="sr-only">Open user menu</span>
                       {currentUser?.imageUrl ? (
                        <img className="h-full w-full object-cover" src={currentUser.imageUrl} alt={currentUser.fullName || 'User'} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
                      )}
                    </button>
                    {isProfileOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none py-1 animate-slideDown">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-900 dark:text-white">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{currentUser?.fullName}</p>
                        </div>
                        <NavLink to="/dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</NavLink>
                        <ThemeToggle />
                        <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-scout-green"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        )}
                    </button>
                )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
             <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-scout-green hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
            </button>
            <button
              onClick={() => isOpen ? closeMenu() : setIsOpen(true)}
              type="button"
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-scout-green hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-scout-green"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-50'}`} onClick={closeMenu} aria-hidden="true"></div>
          <div className={`md:hidden fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white dark:bg-gray-800 shadow-lg z-50 ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`} id="mobile-menu">
            <div className="flex justify-between items-center h-20 px-4 border-b border-gray-200 dark:border-gray-700">
                <span className="font-bold text-lg text-scout-green dark:text-white">Menu</span>
                <button onClick={closeMenu} className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="p-2">
              {linkTree.map(link => {
                const hasChildren = link.children.length > 0;
                const isSubmenuOpen = openMobileSubmenu === link.id;
                if (hasChildren) {
                  return (
                    <div key={link.id}>
                      <button onClick={() => setOpenMobileSubmenu(isSubmenuOpen ? null : link.id)} className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span>{link.title}</span>
                        <svg className={`w-5 h-5 transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                      <div className={`pl-4 border-l-2 border-scout-green/50 ml-3 overflow-hidden transition-all duration-300 ease-in-out ${isSubmenuOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                           {link.children.map(child => (
                              <NavLink key={child.id} to={child.path} onClick={closeMenu} className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-scout-green text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{child.title}</NavLink>
                           ))}
                        </div>
                    </div>
                  )
                }
                return (
                  <NavLink key={link.id} to={link.path} onClick={closeMenu} className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-scout-green text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{link.title}</NavLink>
                )
              })}
              {isAdmin && (
                <>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <NavLink to="/dashboard" onClick={closeMenu} className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-scout-green text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>Dashboard</NavLink>
                  <button onClick={() => { logout(); closeMenu(); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;