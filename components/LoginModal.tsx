
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logoBase64 } from '../assets/logo';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isLoginModalOpen) {
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password, pin);
    if (!success) {
      setError('Invalid credentials. Please try again.');
      setUsername('');
      setPassword('');
      setPin('');
    } else {
      handleClose(); // Clear fields and close on success
    }
  };
  
  const handleClose = () => {
    setUsername('');
    setPassword('');
    setPin('');
    setError('');
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={handleClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-sm text-center transform transition-all relative" onClick={(e) => e.stopPropagation()}>
        <img src={logoBase64} alt="RNMSG Logo" className="h-20 w-20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-2">Admin Access</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Verify yourself!</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              required
              autoFocus
            />
          </div>
          <div className="text-left">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              required
            />
          </div>
          <div className="text-left">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="pin">
              PIN Code
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-green"
              required
              maxLength={5}
            />
          </div>
          {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
          <div className="pt-4">
            <button type="submit" className="w-full bg-scout-green text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors duration-300">
              Login
            </button>
          </div>
        </form>

        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl">&times;</button>
      </div>
    </div>
  );
};

export default LoginModal;
