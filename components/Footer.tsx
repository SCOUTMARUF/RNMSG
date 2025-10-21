
import React, { useRef } from 'react';
import { logoBase64 } from '../assets/logo';
import { useAuth } from '../contexts/AuthContext';

const Footer: React.FC = () => {
  const { isAdmin, openLoginModal, logout } = useAuth();
  // FIX: Initialize useRef with null, not with a reference to itself before it's declared.
  const pressTimerRef = useRef<number | null>(null);

  const handlePressStart = () => {
    // Clear any existing timer to avoid multiple triggers
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
    
    // Set a new timer for 2 seconds
    pressTimerRef.current = window.setTimeout(() => {
      if (isAdmin) {
        logout();
      } else {
        openLoginModal();
      }
    }, 2000);
  };

  const handlePressEnd = () => {
    // Clear the timer if the press is released early
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };
  
  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/rajosiknatoremuktoscoutgroup' },
    { name: 'Instagram', url: 'https://instagram.com/rajosiknatoremuktoscoutgroup' },
    { name: 'YouTube', url: 'https://youtube.com/@rajosiknatoremuktoscoutgroup' },
  ];

  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--text-secondary)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
          
          {/* Column 1: RNMSG Info */}
          <div className="flex flex-col items-start space-y-2">
            <div 
              className="flex items-center space-x-3 mb-2 cursor-pointer select-none"
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              aria-label={isAdmin ? "Press and hold for 2 seconds to logout" : "Press and hold for 2 seconds for admin access"}
            >
              <img className="h-12 w-12" src={logoBase64} alt="RNMSG Logo" />
              <span className="font-bold text-xl text-[var(--text-primary)]">RNMSG</span>
            </div>
            <p>Scout Den: NichaBazar</p>
            <p>Natore Sadar, Natore 6400</p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[var(--text-primary)] text-lg font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#/frames" className="footer-link">Event Frames</a></li>
              <li><a href="#/books" className="footer-link">RNMSG Library</a></li>
              <li><a href="#/events" className="footer-link">Upcoming Events</a></li>
              <li><a href="#/Achievements" className="footer-link">Achievements</a></li>
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div className="lg:relative lg:-left-[60px]">
            <h3 className="text-[var(--text-primary)] text-lg font-semibold uppercase tracking-wider mb-4">Follow Us</h3>
            <ul className="space-y-3">
              {socialLinks.map(link => (
                <li key={link.name}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[var(--social-box-bg)] text-[var(--text-primary)] py-2 px-4 rounded-md hover:bg-[var(--social-box-hover-bg)] transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Contact Us */}
          <div className="space-y-2">
            <h3 className="text-[var(--text-primary)] text-lg font-semibold uppercase tracking-wider mb-4">Contact Us</h3>
            <p>Have a question? We're here to help!</p>
            <p>Phone: <a href="tel:+8801771810111" className="footer-link">+880 1771-810111</a></p>
            <p>Email: <a href="mailto:rnmsgnatore@gmail.com" className="footer-link">rnmsgnatore@gmail.com</a></p>
          </div>

        </div>
        
        <hr className="border-t border-[var(--social-box-bg)] my-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-center">
            <p className="mb-2 sm:mb-0">&copy;RNMSG. All Rights Reserved.</p>
            <a href="https://www.linkedin.com/in/mehedihasanmarufofficial/" target="_blank" rel="noopener noreferrer" className="footer-link">Designed by Mehedi Hasan Maruf</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
