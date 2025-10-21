import React from 'react';

const socialLinks = [
  { name: 'Facebook', url: 'https://facebook.com/rajosiknatoremuktoscoutgroup', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2.5 2.5-2.5H18V2.14C17.65 2.09 16.47 2 15.14 2 12.32 2 10 3.68 10 6.9V9.5H7v4h3v9h4v-9z"></path></svg>
  )},
  { name: 'YouTube', url: 'https://youtube.com/@rajosiknatoremuktoscoutgroup', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19c-.23-.86-.9-1.52-1.76-1.75C18.26 5 12 5 12 5s-6.26 0-7.82.44c-.86.23-1.52.89-1.75 1.75C2 8.74 2 12 2 12s0 3.26.43 4.81c.23.86.9 1.52 1.75 1.75C5.74 19 12 19 12 19s6.26 0 7.82-.44c.86-.23 1.52-.89 1.76-1.75C22 15.26 22 12 22 12s0-3.26-.42-4.81zM9.5 15.5V8.5l6 3.5-6 3.5z"></path></svg>
  )},
  { name: 'Instagram', url: 'https://instagram.com/rajosiknatoremuktoscoutgroup', icon: (
     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 2H16C19.31 2 22 4.69 22 8V16C22 19.31 19.31 22 16 22H8C4.69 22 2 19.31 2 16V8C2 4.69 4.69 2 8 2ZM12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9ZM16.5 6.5C16.22 6.5 16 6.72 16 7C16 7.28 16.22 7.5 16.5 7.5C16.78 7.5 17 7.28 17 7C17 6.72 16.78 6.5 16.5 6.5Z"></path></svg>
  )},
];

const SocialIcons: React.FC = () => {
  return (
    <div className="flex space-x-6">
      {socialLinks.map((social) => (
        <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-current hover:opacity-80 transition-opacity">
          <span className="sr-only">{social.name}</span>
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;