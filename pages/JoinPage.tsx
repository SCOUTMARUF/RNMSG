import React, { useState } from 'react';
import { useData, RecruitmentSection } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const EditRecruitmentModal = ({ section, onClose }: { section: RecruitmentSection; onClose: () => void }) => {
    const { updateRecruitmentSection } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ 
        imageUrl: section.imageUrl, 
        applyLink: section.applyLink 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateRecruitmentSection({ ...section, ...formData });
        showNotification(`${section.title} updated successfully!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Edit {section.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="applyLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">"Learn More & Apply" Link</label>
                        <input type="text" name="applyLink" id="applyLink" value={formData.applyLink} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md hover:bg-opacity-90">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface RecruitmentCardProps {
  title: string;
  age: string;
  description: string;
  imageUrl: string;
  colorClass: string;
  applyLink: string;
}

const getButtonClasses = (color: string) => {
    const baseClasses = "block mt-6 w-full font-bold py-3 rounded-lg text-base transition-colors duration-300 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800";
    switch (color) {
        case 'text-scout-yellow':
            return `${baseClasses} bg-scout-yellow text-white hover:bg-yellow-400 ring-scout-yellow`;
        case 'text-scout-green':
            return `${baseClasses} bg-[#005842] text-white hover:bg-scout-green ring-[#005842]`;
        case 'text-scout-red':
            return `${baseClasses} bg-scout-red text-white hover:bg-red-700 ring-scout-red`;
        default:
            return `${baseClasses} bg-gray-500 text-white ring-gray-500`;
    }
}


const RecruitmentCard: React.FC<RecruitmentCardProps> = ({ title, age, description, imageUrl, colorClass, applyLink }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col group h-full">
      <div className="relative overflow-hidden">
        <img className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" src={imageUrl} alt={title} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className={`text-2xl font-bold mb-2 ${colorClass}`}>{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 font-semibold mb-3">{age}</p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-grow">{description}</p>
        <a 
          href={applyLink}
          target={applyLink.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className={getButtonClasses(colorClass)}
        >
          Learn More & Apply
        </a>
      </div>
    </div>
  );
};

const JoinPage: React.FC = () => {
    const { recruitmentSections } = useData();
    const { isAdmin } = useAuth();
    const [editingSection, setEditingSection] = useState<RecruitmentSection | null>(null);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">Join Our Adventure</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Choose the right path.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recruitmentSections.map((section) => (
            <div key={section.id} className="relative group">
                <RecruitmentCard {...section} />
                {isAdmin && (
                    <button
                        onClick={() => setEditingSection(section)}
                        className="absolute top-2 right-2 z-10 bg-scout-blue text-white rounded-full p-2 leading-none hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={`Edit ${section.title}`}
                        title={`Edit ${section.title}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/>
                        </svg>
                    </button>
                )}
            </div>
          ))}
        </div>
      </div>
      {editingSection && (
            <EditRecruitmentModal 
                section={editingSection} 
                onClose={() => setEditingSection(null)} 
            />
        )}
    </div>
  );
};

export default JoinPage;