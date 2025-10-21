
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData, RoverMate, Testimonial } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';


const EditRoverMateModal = ({ roverMate, onClose }: { roverMate: RoverMate; onClose: () => void }) => {
    const { updateRoverMate } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ ...roverMate });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateRoverMate(formData);
        showNotification('Senior Rover Mate updated successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg text-gray-800 dark:text-gray-200" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Edit Senior Rover Mate</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID Number</label>
                        <input type="text" name="idNumber" id="idNumber" value={formData.idNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
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

const AddTestimonialModal = ({ onClose }: { onClose: () => void }) => {
    const { addTestimonial } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ quote: '', author: '', relation: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTestimonial(formData);
        showNotification('Testimonial added successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Add New Testimonial</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="quote" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quote</label>
                        <textarea name="quote" id="quote" value={formData.quote} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                        <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="relation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Relation (e.g., Parent, Rover Scout)</label>
                        <input type="text" name="relation" id="relation" value={formData.relation} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md hover:bg-opacity-90">Add Testimonial</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditTestimonialModal = ({ testimonial, onClose }: { testimonial: Testimonial; onClose: () => void }) => {
    const { updateTestimonial } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ ...testimonial });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateTestimonial(formData);
        showNotification('Testimonial updated successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Edit Testimonial</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="quote" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quote</label>
                        <textarea name="quote" id="quote" value={formData.quote} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                        <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="relation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Relation (e.g., Parent, Rover Scout)</label>
                        <input type="text" name="relation" id="relation" value={formData.relation} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
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

const HomePage: React.FC = () => {
    const { roverMates, testimonials, deleteTestimonial } = useData();
    const { isAdmin } = useAuth();
    const { showNotification } = useNotification();
    const [editingRoverMate, setEditingRoverMate] = useState<RoverMate | null>(null);
    const [isAddTestimonialModalOpen, setIsAddTestimonialModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  return (
    <>
      <div className="fade-in">
        {/* Hero Section */}
        <section className="relative bg-cover bg-center aspect-square md:aspect-auto md:h-[80vh]" style={{backgroundImage: "url('https://picsum.photos/1920/1080?image=1073')"}}>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-shadow-lg">Rajosik Natore<br className="sm:hidden" /> Mukto Scout Group</h1>
            <p className="text-lg md:text-2xl max-w-3xl mb-8">Building Leaders, Serving Community.</p>
            <Link to="/join" className="bg-scout-yellow text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-300 transition-transform transform hover:scale-105 duration-300">
              Join The Adventure
            </Link>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="block group relative rounded-lg shadow-xl overflow-hidden">
                <img src="https://res.cloudinary.com/dtqnpnzxj/image/upload/v1759689587/Screenshot_20251006_002627_Facebook_oen1i8.jpg" alt="Scouts in a circle" className="w-full object-cover transition-transform duration-500 transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12 text-white">
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>About RNMSG</h2>
                  <p className="text-lg md:text-xl mb-5 max-w-2xl" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
                    Discover our history, meet our dedicated committee members, and learn about the visionaries who founded our group.
                  </p>
                  <Link to="/history" className="mt-2 inline-flex items-center font-bold py-2 px-5 rounded-full text-lg bg-scout-yellow text-gray-900 group-hover:bg-yellow-300 transition-colors duration-300">
                    <span>HISTORY</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-scout-green dark:text-white mb-12">Our Core Activities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <ActivityCard icon="🏕️" title="Camping & Outdoors" description="Developing survival skills, appreciating nature, and building teamwork through exciting outdoor adventures." />
              <ActivityCard icon="🤝" title="Community Service" description="Making a positive impact in Natore through volunteering, clean-up drives, and social awareness campaigns." />
              <ActivityCard icon="🧭" title="Leadership Training" description="Empowering youth with essential leadership qualities, decision-making skills, and self-confidence." />
              <ActivityCard icon="🏅" title="Skill Development" description="Offering a wide range of proficiency badges and skills, from first-aid and navigation to digital literacy." />
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-scout-green dark:text-white mb-4">What Our Members Say</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                  Hear directly from our scouts, leaders, and parents about their experiences with RNMSG.
              </p>
               {isAdmin && (
                  <div className="mb-12">
                      <button 
                          onClick={() => setIsAddTestimonialModalOpen(true)}
                          className="bg-scout-green text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300"
                      >
                          + Add Testimonial
                      </button>
                  </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                  {testimonials.map(testimonial => (
                      <div key={testimonial.id} className="relative group">
                          <TestimonialCard 
                              quote={testimonial.quote}
                              author={testimonial.author}
                              relation={testimonial.relation}
                          />
                          {isAdmin && (
                               <div className="absolute top-4 right-4 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                      onClick={() => setEditingTestimonial(testimonial)}
                                      className="bg-scout-blue text-white rounded-full p-2 leading-none hover:bg-blue-700"
                                      aria-label="Edit testimonial"
                                      title="Edit testimonial"
                                  >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg>
                                  </button>
                                  <button
                                      onClick={() => {
                                          if (window.confirm(`Are you sure you want to delete the testimonial by "${testimonial.author}"?`)) {
                                              deleteTestimonial(testimonial.id);
                                              showNotification('Testimonial deleted successfully!');
                                          }
                                      }}
                                      className="bg-red-600 text-white rounded-full p-2 leading-none hover:bg-red-700"
                                      aria-label="Delete testimonial"
                                      title="Delete testimonial"
                                  >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                  </button>
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
        </section>

        {/* Our Senior Rover Mates Section */}
        <section className="py-20 bg-scout-green dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-12 text-white dark:text-white">Our Senior Rover Mates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {roverMates.map(mate => (
                <div key={mate.id} className="relative group">
                  <RoverMateCard 
                    imageUrl={mate.imageUrl} 
                    name={mate.name} 
                    title={mate.title} 
                    idNumber={mate.idNumber} 
                  />
                   {isAdmin && (
                      <button
                        onClick={() => setEditingRoverMate(mate)}
                        className="absolute top-0 right-0 m-2 bg-scout-blue text-white rounded-full p-2 leading-none hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Edit Senior Rover Mate"
                        title="Edit Senior Rover Mate"
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
        </section>
      </div>
      {editingRoverMate && (
          <EditRoverMateModal roverMate={editingRoverMate} onClose={() => setEditingRoverMate(null)} />
      )}
      {isAddTestimonialModalOpen && (
          <AddTestimonialModal onClose={() => setIsAddTestimonialModalOpen(false)} />
      )}
      {editingTestimonial && (
          <EditTestimonialModal testimonial={editingTestimonial} onClose={() => setEditingTestimonial(null)} />
      )}
    </>
  );
};


interface ActivityCardProps {
    icon: string;
    title: string;
    description: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ icon, title, description }) => {
    return (
        <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );
};

interface TestimonialCardProps {
    quote: string;
    author: string;
    relation: string;
}
const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, relation }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg h-full flex flex-col">
             <div className="text-6xl text-scout-green/20 dark:text-white/20 mb-4">❝</div>
            <p className="text-gray-600 dark:text-gray-400 italic mb-6 flex-grow">"{quote}"</p>
            <div className="mt-auto">
                <p className="font-bold text-gray-800 dark:text-gray-200">{author}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{relation}</p>
            </div>
        </div>
    );
};

interface RoverMateCardProps {
  imageUrl: string;
  name: string;
  title: string;
  idNumber: string;
}

const RoverMateCard: React.FC<RoverMateCardProps> = ({ imageUrl, name, title, idNumber }) => {
  return (
    <div className="text-center transition-transform transform hover:scale-105 duration-300">
      <img
        className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
        src={imageUrl}
        alt={name}
      />
      <h3 className="mt-4 text-xl font-bold text-white dark:text-white">{name}</h3>
      <p className="mt-1 text-gray-200 dark:text-gray-300 font-semibold">{title}</p>
      <p className="text-gray-200 dark:text-gray-300 text-sm">{idNumber}</p>
    </div>
  );
};


export default HomePage;
