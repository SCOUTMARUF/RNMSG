
import React, { useState } from 'react';
import { useData, Event } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Community Service': return 'bg-scout-blue text-white';
        case 'Camping': return 'bg-scout-green text-white';
        case 'Training': return 'bg-scout-red text-white';
        case 'Gathering': return 'bg-scout-yellow text-gray-900';
        case 'Sports': return 'bg-[#5E277D] text-white';
        default: return 'bg-gray-500 text-white';
    }
}

const formatDateToDDMMYYYY = (dateString: string | undefined): string | undefined => {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

const parseDDMMYYYYtoDateInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
};


const AddEventModal = ({ onClose }: { onClose: () => void }) => {
    const { addEvent } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<Omit<Event, 'id'>>({
        title: '', date: '', endDate: '', time: '', location: '', category: 'Gathering', description: '', registrationLink: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addEvent({ 
            ...formData, 
            date: formatDateToDDMMYYYY(formData.date)!, 
            endDate: formatDateToDDMMYYYY(formData.endDate) 
        });
        showNotification('Event added successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Add New Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                        <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="time" placeholder="Time (e.g., 9:00 AM - 1:00 PM)" value={formData.time} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green">
                        <option>Community Service</option>
                        <option>Camping</option>
                        <option>Training</option>
                        <option>Gathering</option>
                        <option>Sports</option>
                    </select>
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" rows={4} required />
                    <input type="url" name="registrationLink" placeholder="Registration Link (optional)" value={formData.registrationLink || ''} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">Add Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditEventModal = ({ event, onClose }: { event: Event; onClose: () => void }) => {
    const { updateEvent } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<Omit<Event, 'id'>>({
        title: event.title,
        date: parseDDMMYYYYtoDateInput(event.date),
        endDate: parseDDMMYYYYtoDateInput(event.endDate),
        time: event.time,
        location: event.location,
        category: event.category,
        description: event.description,
        registrationLink: event.registrationLink || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedEventData = {
            ...event,
            ...formData,
            date: formatDateToDDMMYYYY(formData.date)!,
            endDate: formatDateToDDMMYYYY(formData.endDate)
        };
        updateEvent(updatedEventData);
        showNotification('Event updated successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Edit Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                        <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="time" placeholder="Time (e.g., 9:00 AM - 1:00 PM)" value={formData.time} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green">
                        <option>Community Service</option>
                        <option>Camping</option>
                        <option>Training</option>
                        <option>Gathering</option>
                        <option>Sports</option>
                    </select>
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" rows={4} required />
                    <input type="url" name="registrationLink" placeholder="Registration Link (optional)" value={formData.registrationLink || ''} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EventDetailModal: React.FC<{ event: Event; onClose: () => void }> = ({ event, onClose }) => {
    const { showNotification } = useNotification();
    const formatDateForDisplay = (dateString: string) => {
        const [day, month, year] = dateString.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] p-4" onClick={onClose}>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 md:p-12 overflow-y-auto">
                    <span className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-full mb-6 ${getCategoryColor(event.category)}`}>
                        {event.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight mb-6">{event.title}</h1>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-lg">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-scout-green dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="font-semibold">{formatDateForDisplay(event.date)}{event.endDate ? ` - ${formatDateForDisplay(event.endDate)}` : ''}</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-scout-green dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-semibold">{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-scout-green dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline break-all">{event.location}</a>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-300 leading-relaxed border-t dark:border-gray-600 pt-8">
                        <p>{event.description}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700 mt-auto">
                    {event.registrationLink ? (
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="inline-block font-bold py-2 px-8 rounded-full text-lg transition-colors duration-300 border-2 border-scout-green text-scout-green hover:bg-scout-green hover:text-white dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700 dark:hover:border-gray-700">
                            Register Now
                        </a>
                    ) : (
                        <button onClick={() => showNotification('Registration details will be available soon.', 'success')} className="inline-block bg-gray-300 text-gray-600 font-bold py-2 px-8 rounded-full text-lg cursor-not-allowed">
                            Registration Closed
                        </button>
                    )}
                    <button onClick={onClose} className="inline-block font-bold py-2 px-8 rounded-full text-lg transition-colors duration-300 border-2 border-scout-red text-scout-red hover:bg-scout-red hover:text-white dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-white">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const EventDateDisplay = ({ date, endDate }: { date: string, endDate?: string }) => {
    const getMonthName = (monthNum: string, length: 'long' | 'short' = 'long') => new Date(2000, parseInt(monthNum) - 1, 1).toLocaleString('en-US', { month: length });

    const startDateParts = date.split('/');
    const startDay = startDateParts[0];
    const startMonth = getMonthName(startDateParts[1]);
    const startYear = startDateParts[2];
    
    if (!endDate) {
        return (
            <>
                <div className="text-5xl font-bold text-scout-green dark:text-white">{startDay}</div>
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">{startMonth}</div>
                <div className="text-md text-gray-500 dark:text-gray-400">{startYear}</div>
            </>
        );
    }

    const endDateParts = endDate.split('/');
    const endDay = endDateParts[0];
    const endMonth = getMonthName(endDateParts[1]);
    const endYear = endDateParts[2];
    
    if (startYear !== endYear) {
        return <div className="text-xl font-bold text-scout-green dark:text-white">{`${startDay} ${getMonthName(startDateParts[1], 'short')} ${startYear}`} - <br/> {`${endDay} ${getMonthName(endDateParts[1], 'short')} ${endYear}`}</div>;
    }

    if (startMonth !== endMonth) {
         return <div className="text-center"><div className="text-2xl font-bold text-scout-green dark:text-white">{`${startDay} ${getMonthName(startDateParts[1], 'short')} - ${endDay} ${getMonthName(endDateParts[1], 'short')}`}</div><div className="text-md text-gray-500 dark:text-gray-400">{startYear}</div></div>;
    }

    return (
        <>
            <div className="text-5xl font-bold text-scout-green dark:text-white">{`${startDay}-${endDay}`}</div>
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">{startMonth}</div>
            <div className="text-md text-gray-500 dark:text-gray-400">{startYear}</div>
        </>
    );
};

const EventPage: React.FC = () => {
  const { events, deleteEvent } = useData();
  const { isAdmin } = useAuth();
  const { showNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Community Service', 'Camping', 'Training', 'Gathering', 'Sports'];

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">Upcoming Events</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Mark your calendars! Here's what's happening next at RNMSG.
          </p>
          {isAdmin && (
            <button onClick={() => setIsModalOpen(true)} className="mt-6 bg-scout-green text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300">
              + Add New Event
            </button>
          )}
        </div>

        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-scout-green ${
                selectedCategory === category
                  ? 'bg-scout-green text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="relative">
                <div onClick={() => setSelectedEvent(event)} className="block cursor-pointer">
                  <div className="md:flex bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
                    <div className="md:w-1/3 p-6 flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-700 text-center">
                        <EventDateDisplay date={event.date} endDate={event.endDate} />
                    </div>
                    <div className="p-8 md:w-2/3">
                      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3 ${getCategoryColor(event.category)}`}>
                          {event.category}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{event.title}</h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>{event.time}</span>
                      </div>
                       <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span>{event.location}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{event.description.substring(0, 100)}...</p>
                        {event.registrationLink ? (
                            <a
                                href={event.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-block font-bold py-2 px-5 rounded-lg text-sm transition-colors duration-300 border-2 border-scout-green text-scout-green hover:bg-scout-green hover:text-white dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700 dark:hover:border-gray-700"
                            >
                                Register Now
                            </a>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showNotification('Registration details will be available soon.', 'success');
                                }}
                                className="inline-block bg-gray-300 text-gray-600 font-bold py-2 px-5 rounded-lg text-sm cursor-not-allowed"
                            >
                                Registration Closed
                            </button>
                        )}
                    </div>
                  </div>
                </div>
                {isAdmin && (
                    <div className="absolute top-4 right-4 z-10 flex space-x-2">
                        <button
                              onClick={(e) => { e.stopPropagation(); setEditingEvent(event); }}
                              className="bg-scout-blue text-white rounded-full p-2 leading-none hover:bg-blue-700 transition-colors"
                              aria-label="Edit event"
                              title="Edit event"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/>
                              </svg>
                          </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete the event "${event.title}"?`)) {
                                    deleteEvent(event.id);
                                    showNotification('Event deleted successfully!');
                                }
                            }}
                            className="bg-red-600 text-white rounded-full p-2 leading-none hover:bg-red-700 transition-colors"
                            aria-label="Delete event"
                            title="Delete event"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">No events found for this category.</p>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && <AddEventModal onClose={() => setIsModalOpen(false)} />}
      {editingEvent && <EditEventModal event={editingEvent} onClose={() => setEditingEvent(null)} />}
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};

export default EventPage;
