import React, { useState } from 'react';
import { useData, Founder } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const BulkUpdateFounderSessionModal = ({ onClose }: { onClose: () => void }) => {
    const { updateAllFounderSessions } = useData();
    const { showNotification } = useNotification();
    const [session, setSession] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            showNotification('Please enter a session value.', 'error');
            return;
        }
        if (window.confirm(`Are you sure you want to update the session to "${session}" for ALL founders? This action cannot be undone.`)) {
            updateAllFounderSessions(session);
            showNotification('All founder sessions updated successfully!');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Bulk Update Session</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Enter a new session below. This will overwrite the session for <strong className="text-gray-800 dark:text-gray-200">all</strong> current founders.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        name="session" 
                        placeholder="Session (e.g., Founding Member)" 
                        value={session} 
                        onChange={(e) => setSession(e.target.value)} 
                        className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" 
                        required 
                    />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-red text-white rounded-md">Update All</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FounderFormModal = ({ member, onClose }: { member: Omit<Founder, 'id'> | Founder | null; onClose: () => void }) => {
    const { addFounder, updateFounder } = useData();
    const { showNotification } = useNotification();
    const isEditing = member && 'id' in member;

    const [formData, setFormData] = useState({
        name: member?.name || '',
        designation: member?.designation || '',
        session: member?.session || '',
        imageUrl: member?.imageUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updateFounder({ ...member, ...formData });
            showNotification('Founder updated successfully!');
        } else {
            addFounder(formData);
            showNotification('Founder added successfully!');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">{isEditing ? 'Edit Founder' : 'Add New Founder'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <input type="text" name="session" placeholder="Session (e.g., Founding Member)" value={formData.session} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <input type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Member'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FoundersPage: React.FC = () => {
    const { founders, deleteFounder } = useData();
    const { isAdmin } = useAuth();
    const { showNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Founder | null>(null);
    const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);

    const openAddModal = () => {
        setEditingMember(null);
        setIsModalOpen(true);
    };

    const openEditModal = (member: Founder) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    const handleDelete = (member: Founder) => {
        if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
            deleteFounder(member.id);
            showNotification('Founder removed successfully!');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">RNMSG Founders</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                        Meet the visionaries who started it all.
                    </p>
                    {isAdmin && (
                         <div className="mt-8 flex justify-center items-center gap-4">
                            <button onClick={openAddModal} className="bg-scout-green text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300">
                                + Add New Founder
                            </button>
                            <button onClick={() => setIsBulkUpdateModalOpen(true)} className="bg-scout-blue text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300">
                                Update All Sessions
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
                    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Founder
                                </th>
                                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                                    Designation
                                </th>
                                <th scope="col" className="px-6 py-3 hidden sm:table-cell">
                                    Session
                                </th>
                                {isAdmin && (
                                     <th scope="col" className="px-6 py-3 text-right">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {founders.map((member) => (
                                <tr key={member.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="w-12 h-12 rounded-full object-cover" src={member.imageUrl} alt={`${member.name}'s photo`} />
                                        <div className="pl-3">
                                            <div className="text-base font-semibold">{member.name}</div>
                                            <div className="font-normal text-gray-500 md:hidden">{member.designation}</div>
                                            <div className="font-normal text-gray-500 sm:hidden">{member.session}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        {member.designation}
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <span className="bg-scout-green/10 text-scout-green dark:bg-scout-green/20 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{member.session}</span>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center space-x-3">
                                                <button onClick={() => openEditModal(member)} className="font-medium text-scout-blue dark:text-blue-500 hover:underline">Edit</button>
                                                <button onClick={() => handleDelete(member)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <FounderFormModal member={editingMember} onClose={() => setIsModalOpen(false)} />}
            {isBulkUpdateModalOpen && <BulkUpdateFounderSessionModal onClose={() => setIsBulkUpdateModalOpen(false)} />}
        </div>
    );
};

export default FoundersPage;