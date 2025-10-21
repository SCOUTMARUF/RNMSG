import React from 'react';
import { Link } from 'react-router-dom';

const HistoryPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-scout-green dark:text-white tracking-tight mb-12">
            Our History & Mission
          </h1>

          <div className="grid grid-cols-1 gap-12 items-center mb-16">
            <div className="order-2">
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-lg">
                The Rajosik Natore Mukto Scout Group (RNMSG) is a proud and dynamic scouting organization based in the Natore District of Bangladesh. Since our inception, we have been dedicated to the development of young people in achieving their full physical, intellectual, emotional, social, and spiritual potentials as individuals, as responsible citizens, and as members of their local, national, and international communities.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Our mission is to contribute to the education of young people, through a value system based on the Scout Promise and Law, to help build a better world where people are self-fulfilled as individuals and play a constructive role in society. We foster a spirit of camaraderie, leadership, and service, preparing our members for the challenges of today and tomorrow.
              </p>
            </div>
            <div className="order-1">
              <img src="https://res.cloudinary.com/dtqnpnzxj/image/upload/v1759689587/Screenshot_20251006_002627_Facebook_oen1i8.jpg" alt="Scouts in a circle" className="rounded-lg shadow-xl" />
            </div>
          </div>

          <div className="text-center">
            <Link to="/founders" className="group inline-flex items-center font-bold py-3 px-6 rounded-full text-lg bg-scout-yellow text-gray-900 hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
              Meet Our Founders
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
