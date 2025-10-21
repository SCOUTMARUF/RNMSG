import React, { useState } from 'react';
import { useData, PatrolSection, Patrol, PatrolMember } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const themeColors = [
    { name: 'Scout Yellow', hex: '#FFD700' },
    { name: 'Scout Green', hex: '#006A4E' },
    { name: 'Scout Red', hex: '#E4002B' },
    { name: 'Scout Blue', hex: '#0033A0' },
    { name: 'World Scout Purple', hex: '#5E277D' },
];

const ColorPicker = ({ selectedColor, onSelectColor }: { selectedColor: string, onSelectColor: (color: string) => void}) => (
    <div className="flex flex-wrap items-center gap-2 mt-1">
        {themeColors.map(color => (
            <button
                key={color.hex}
                type="button"
                onClick={() => onSelectColor(color.hex)}
                className={`w-8 h-8 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-scout-blue dark:ring-offset-gray-800 ${selectedColor === color.hex ? 'border-scout-blue dark:border-white ring-2' : 'border-white/50 dark:border-gray-600'}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={color.name}
            />
        ))}
    </div>
);

// Modal for managing sections
const ManageSectionsModal = ({ onClose }: { onClose: () => void }) => {
    const { patrolSections, addPatrolSection, updatePatrolSection, deletePatrolSection, togglePatrolSectionVisibility } = useData();
    const { showNotification } = useNotification();

    const [newSectionName, setNewSectionName] = useState('');
    const [newSectionColor, setNewSectionColor] = useState(themeColors[0].hex);
    const [editingSection, setEditingSection] = useState<PatrolSection | null>(null);

    const handleAddSection = (e: React.FormEvent) => {
        e.preventDefault();
        addPatrolSection({ name: newSectionName, color: newSectionColor });
        showNotification('New section added!');
        setNewSectionName('');
        setNewSectionColor(themeColors[0].hex);
    };
    
    const handleUpdateSection = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSection) {
            updatePatrolSection(editingSection.id, { name: editingSection.name, color: editingSection.color });
            showNotification('Section updated!');
            setEditingSection(null);
        }
    };

    const handleDeleteSection = (section: PatrolSection) => {
        if (window.confirm(`Are you sure you want to delete the "${section.name}" section? All patrols within it will also be deleted.`)) {
            deletePatrolSection(section.id);
            showNotification('Section deleted!');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Manage Sections</h2>
                
                {/* List of Sections */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-6">
                    {patrolSections.map(section => (
                         <div key={section.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {editingSection?.id === section.id ? (
                                <form onSubmit={handleUpdateSection} className="flex-grow space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input type="text" value={editingSection.name} onChange={(e) => setEditingSection({...editingSection, name: e.target.value})} className="flex-grow p-1 bg-white dark:bg-gray-600 border border-gray-300 rounded-md" />
                                        <button type="submit" className="px-3 py-1 bg-scout-green text-white rounded-md text-sm">Save</button>
                                        <button type="button" onClick={() => setEditingSection(null)} className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm">Cancel</button>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {themeColors.map(color => (
                                            <button
                                                key={color.hex}
                                                type="button"
                                                onClick={() => setEditingSection({...editingSection!, color: color.hex})}
                                                className={`w-6 h-6 rounded-full border-2 transition-all ${editingSection.color === color.hex ? 'border-scout-blue dark:border-white ring-1 ring-offset-1 ring-scout-blue dark:ring-offset-gray-700' : 'border-transparent'}`}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            >
                                                <span className="sr-only">{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded" style={{ backgroundColor: section.color }}></div>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{section.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => togglePatrolSectionVisibility(section.id)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" title={section.isVisible ? 'Hide Section' : 'Show Section'}>
                                            {section.isVisible ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.878 1.43-2.348 2.457-3.668 2.957C9.879 11.832 8.12 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.133 13.133 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.878 1.43-2.348 2.457-3.668 2.957l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/></svg>}
                                        </button>
                                        <button onClick={() => setEditingSection(section)} className="text-blue-500 hover:text-blue-700" title="Edit Section"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg></button>
                                        <button onClick={() => handleDeleteSection(section)} className="text-red-500 hover:text-red-700" title="Delete Section"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                
                {/* Add New Section Form */}
                <div className="border-t pt-6 border-gray-200 dark:border-gray-600">
                     <h3 className="text-xl font-bold text-scout-green dark:text-white mb-4">Add New Section</h3>
                    <form onSubmit={handleAddSection} className="space-y-4">
                        <div>
                            <label htmlFor="new-section-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section Name</label>
                            <input id="new-section-name" type="text" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} className="w-full p-2 mt-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                            <ColorPicker selectedColor={newSectionColor} onSelectColor={setNewSectionColor} />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">Add Section</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


// Modal for Patrol (Add/Edit)
const PatrolFormModal = ({ sectionId, patrol, onClose }: { sectionId: string; patrol: Omit<Patrol, 'id' | 'members'> | Patrol | null; onClose: () => void }) => {
    const { addPatrol, updatePatrol } = useData();
    const { showNotification } = useNotification();
    const isEditing = patrol && 'id' in patrol;
    const [name, setName] = useState(patrol?.name || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updatePatrol(sectionId, { ...patrol, name });
            showNotification('Patrol updated successfully!');
        } else {
            addPatrol(sectionId, { name });
            showNotification('Patrol added successfully!');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">{isEditing ? 'Edit Patrol' : 'Add New Patrol'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Patrol Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Patrol'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal for Patrol Member (Add/Edit)
const PatrolMemberFormModal = ({ sectionId, patrolId, member, onClose }: { sectionId: string; patrolId: string; member: Omit<PatrolMember, 'id'> | PatrolMember | null; onClose: () => void }) => {
    const { addPatrolMember, updatePatrolMember } = useData();
    const { showNotification } = useNotification();
    const isEditing = member && 'id' in member;

    const [formData, setFormData] = useState({
        name: member?.name || '',
        role: member?.role || 'Member',
        imageUrl: member?.imageUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updatePatrolMember(sectionId, patrolId, { ...member, ...formData });
            showNotification('Member updated successfully!');
        } else {
            addPatrolMember(sectionId, patrolId, formData);
            showNotification('Member added successfully!');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">{isEditing ? 'Edit Member' : 'Add New Member'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" required />
                    <input type="text" name="role" placeholder="Role (e.g., Patrol Leader)" value={formData.role} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" required />
                    <input type="url" name="imageUrl" placeholder="Image URL (optional)" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Member'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Determines if text should be light or dark based on background color
const getTextColorForBackground = (hexColor: string): string => {
    try {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? 'text-gray-900' : 'text-white';
    } catch (e) {
        return 'text-white'; // Fallback for invalid color
    }
};

const PatrolPage: React.FC = () => {
    const { patrolSections, deletePatrol, deletePatrolMember } = useData();
    const { isAdmin } = useAuth();
    const { showNotification } = useNotification();

    const [isManageSectionsModalOpen, setIsManageSectionsModalOpen] = useState(false);
    const [patrolModal, setPatrolModal] = useState<{ isOpen: boolean; sectionId: string; patrol: Patrol | null }>({ isOpen: false, sectionId: '', patrol: null });
    const [memberModal, setMemberModal] = useState<{ isOpen: boolean; sectionId: string; patrolId: string; member: PatrolMember | null }>({ isOpen: false, sectionId: '', patrolId: '', member: null });
    
    const handleDeletePatrol = (sectionId: string, patrol: Patrol) => {
        if (window.confirm(`Are you sure you want to delete the patrol "${patrol.name}"?`)) {
            deletePatrol(sectionId, patrol.id);
            showNotification('Patrol deleted successfully!');
        }
    };
    
    const handleDeleteMember = (sectionId: string, patrolId: string, member: PatrolMember) => {
        if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
            deletePatrolMember(sectionId, patrolId, member.id);
            showNotification('Member removed successfully!');
        }
    };

    const sectionsToDisplay = isAdmin ? patrolSections : patrolSections.filter(s => s.isVisible);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">Our Patrols</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                        The core of our group: small teams working, learning, and growing together.
                    </p>
                    {isAdmin && (
                        <button onClick={() => setIsManageSectionsModalOpen(true)} className="mt-8 bg-scout-blue text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300">
                            Manage Sections
                        </button>
                    )}
                </div>

                <div className="space-y-16">
                    {sectionsToDisplay.map((section) => {
                        const textColor = getTextColorForBackground(section.color);
                        return (
                            <section key={section.id} className={isAdmin && !section.isVisible ? 'opacity-60' : ''}>
                                <div className={`flex justify-between items-center p-4 rounded-t-lg`} style={{ backgroundColor: section.color }}>
                                    <h2 className={`text-3xl font-bold ${textColor}`}>{section.name} Section</h2>
                                    {isAdmin && (
                                        <button onClick={() => setPatrolModal({ isOpen: true, sectionId: section.id, patrol: null })} className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                                            + Add Patrol
                                        </button>
                                    )}
                                </div>
                                <div className={`border-l-4 border-r-4 border-b-4 p-6 rounded-b-lg bg-white dark:bg-gray-800`} style={{ borderColor: section.color }}>
                                    {section.patrols.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {section.patrols.map((patrol) => (
                                                <div key={patrol.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-2xl font-bold text-scout-green dark:text-white">{patrol.name}</h3>
                                                        {isAdmin && (
                                                            <div className="flex space-x-2">
                                                                <button onClick={() => setPatrolModal({ isOpen: true, sectionId: section.id, patrol })} className="text-blue-500 hover:text-blue-700" title="Edit Patrol"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg></button>
                                                                <button onClick={() => handleDeletePatrol(section.id, patrol)} className="text-red-500 hover:text-red-700" title="Delete Patrol"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-4 flex-grow">
                                                        {patrol.members.map((member) => (
                                                            <div key={member.id} className="group flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <img src={member.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                                                    <div>
                                                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{member.name}</p>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                                                                    </div>
                                                                </div>
                                                                 {isAdmin && (
                                                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button onClick={() => setMemberModal({ isOpen: true, sectionId: section.id, patrolId: patrol.id, member })} className="text-blue-500 hover:text-blue-700" title="Edit Member"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg></button>
                                                                        <button onClick={() => handleDeleteMember(section.id, patrol.id, member)} className="text-red-500 hover:text-red-700" title="Delete Member"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {isAdmin && (
                                                        <button onClick={() => setMemberModal({ isOpen: true, sectionId: section.id, patrolId: patrol.id, member: null })} className="mt-4 w-full border-2 border-dashed border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400 rounded-md py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                            + Add Member
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 dark:text-gray-400">No patrols have been added to this section yet.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
            
            {isManageSectionsModalOpen && <ManageSectionsModal onClose={() => setIsManageSectionsModalOpen(false)} />}
            {patrolModal.isOpen && <PatrolFormModal sectionId={patrolModal.sectionId} patrol={patrolModal.patrol} onClose={() => setPatrolModal({ isOpen: false, sectionId: '', patrol: null })} />}
            {memberModal.isOpen && <PatrolMemberFormModal sectionId={memberModal.sectionId} patrolId={memberModal.patrolId} member={memberModal.member} onClose={() => setMemberModal({ isOpen: false, sectionId: '', patrolId: '', member: null })} />}
        </div>
    );
};

export default PatrolPage;