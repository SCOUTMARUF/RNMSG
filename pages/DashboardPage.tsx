

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData, Moderator, NavLink } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';


const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-scout-green/10 dark:bg-scout-green/20 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const OverviewSection: React.FC = () => {
    const { blogPosts, events, galleryImages, awards } = useData();
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Blog Posts" value={blogPosts.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-scout-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                <StatCard title="Events" value={events.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-scout-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <StatCard title="Gallery Photos" value={galleryImages.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-scout-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
                <StatCard title="Awards" value={awards.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-scout-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" /></svg>} />
            </div>
        </div>
    );
};

const ModeratorsSection: React.FC = () => {
    const { moderators, addModerator, deleteModerator } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ fullName: '', username: '', password_val: '', pin: '', imageUrl: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (moderators.some(mod => mod.username.toLowerCase() === formData.username.toLowerCase())) {
            showNotification('A moderator with this username already exists.', 'error');
            return;
        }
        addModerator(formData);
        showNotification('Moderator added successfully!');
        setFormData({ fullName: '', username: '', password_val: '', pin: '', imageUrl: '' });
    };

    const handleDelete = (mod: Moderator) => {
        if (window.confirm(`Are you sure you want to remove moderator "${mod.fullName}"?`)) {
            deleteModerator(mod.id);
            showNotification('Moderator removed successfully!');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Manage Moderators</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Add New Moderator</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" required />
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} name="password_val" placeholder="Password" value={formData.password_val} onChange={handleChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                               {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C3.732 4.943 7.523 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-7.03 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.477 4 12 4c-1.268 0-2.49.232-3.653.653L3.707 2.293zM12 14c-1.34 0-2.584-.37-3.693-1.01L12 9.393 15.693 13a7.973 7.973 0 01-3.693 1zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" /></svg>}
                            </button>
                        </div>
                        <input type="password" name="pin" placeholder="PIN (5 digits)" value={formData.pin} onChange={handleChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" required maxLength={5} pattern="\d{5}" />
                    </div>
                    <input type="url" name="imageUrl" placeholder="Image URL (optional)" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" />
                    <div className="flex justify-end">
                        <button type="submit" className="bg-scout-green text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90">Add Moderator</button>
                    </div>
                </form>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Current Moderators</h3>
                <ul className="space-y-3">
                    {moderators.length > 0 ? moderators.map(mod => (
                        <li key={mod.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div>
                                <span className="font-medium text-gray-800 dark:text-gray-200">{mod.fullName}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({mod.username})</span>
                            </div>
                            <button onClick={() => handleDelete(mod)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                        </li>
                    )) : <p className="text-gray-500 dark:text-gray-400">No moderators have been added yet.</p>}
                </ul>
            </div>
        </div>
    );
};

const NavigationSettingsSection: React.FC = () => {
    const { navLinks, setNavLinks } = useData();
    const { showNotification } = useNotification();
    const [editingLink, setEditingLink] = useState<NavLink | null>(null);

    const reorderAndSave = (updatedLinks: NavLink[]) => {
        const reordered = updatedLinks.map((link, index) => ({ ...link, order: index + 1}));
        setNavLinks(reordered);
    };

    const handleMove = (linkId: number, direction: 'up' | 'down') => {
        let links = [...navLinks];
        const linkIndex = links.findIndex(l => l.id === linkId);
        if (linkIndex === -1) return;

        const link = links[linkIndex];
        const siblings = links.filter(l => l.parentId === link.parentId).sort((a, b) => a.order - b.order);
        const siblingIndex = siblings.findIndex(s => s.id === linkId);

        if (direction === 'up' && siblingIndex > 0) {
            const prevSibling = siblings[siblingIndex - 1];
            [link.order, prevSibling.order] = [prevSibling.order, link.order];
        } else if (direction === 'down' && siblingIndex < siblings.length - 1) {
            const nextSibling = siblings[siblingIndex + 1];
            [link.order, nextSibling.order] = [nextSibling.order, link.order];
        }
        setNavLinks([...links]);
    };

    const handleIndent = (linkId: number) => {
        let links = [...navLinks];
        const link = links.find(l => l.id === linkId);
        if (!link) return;

        const siblings = links.filter(l => l.parentId === link.parentId).sort((a,b) => a.order - b.order);
        const siblingIndex = siblings.findIndex(s => s.id === linkId);

        if (siblingIndex > 0) {
            const newParent = siblings[siblingIndex - 1];
            link.parentId = newParent.id;
            setNavLinks([...links]);
        }
    };

    const handleOutdent = (linkId: number) => {
        let links = [...navLinks];
        const link = links.find(l => l.id === linkId);
        if (!link || link.parentId === null) return;

        const oldParent = links.find(l => l.id === link.parentId);
        if (oldParent) {
            link.parentId = oldParent.parentId;
        }
        setNavLinks([...links]);
    };

    const handleAddLink = () => {
        setEditingLink({ id: 0, title: '', path: '', order: navLinks.length + 1, parentId: null });
    };

    const handleDeleteLink = (linkId: number) => {
        if (window.confirm('Are you sure you want to delete this link? Any child links will also be removed.')) {
            const linksToDelete = new Set<number>([linkId]);
            let changed = true;
            while(changed) {
                changed = false;
                navLinks.forEach(link => {
                    if (link.parentId && linksToDelete.has(link.parentId) && !linksToDelete.has(link.id)) {
                        linksToDelete.add(link.id);
                        changed = true;
                    }
                });
            }
            const updatedLinks = navLinks.filter(l => !linksToDelete.has(l.id));
            reorderAndSave(updatedLinks);
            showNotification('Link(s) deleted successfully!');
        }
    };
    
    const handleSaveLink = (linkData: NavLink) => {
        if(linkData.id === 0) { // New link
            setNavLinks([...navLinks, {...linkData, id: Date.now() }]);
            showNotification('Link added successfully!');
        } else { // Existing link
            setNavLinks(navLinks.map(l => l.id === linkData.id ? linkData : l));
            showNotification('Link updated successfully!');
        }
        setEditingLink(null);
    };

    // FIX: Explicitly type NavItem as a React.FC to ensure the 'key' prop is handled correctly by TypeScript.
    const NavItem: React.FC<{ link: NavLink, level?: number }> = ({ link, level = 0 }) => {
        const children = navLinks.filter(l => l.parentId === link.id).sort((a, b) => a.order - b.order);
        return (
            <div>
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-md" style={{ marginLeft: `${level * 2}rem`}}>
                    <div className="flex-grow font-semibold text-gray-800 dark:text-gray-200">{link.title} <span className="text-sm text-gray-500">({link.path})</span></div>
                    <div className="flex space-x-1">
                        <button onClick={() => handleMove(link.id, 'up')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Move Up">↑</button>
                        <button onClick={() => handleMove(link.id, 'down')} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Move Down">↓</button>
                        <button onClick={() => handleIndent(link.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Indent (make child)">→</button>
                        <button onClick={() => handleOutdent(link.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Outdent (make parent)">←</button>
                        <button onClick={() => setEditingLink(link)} className="p-1 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Edit">Edit</button>
                        <button onClick={() => handleDeleteLink(link.id)} className="p-1 text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="Delete">Delete</button>
                    </div>
                </div>
                {children.map(child => <NavItem key={child.id} link={child} level={level + 1} />)}
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Manage Navigation</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                 <div className="space-y-2 mb-6">
                    {navLinks.filter(l => l.parentId === null).sort((a,b) => a.order - b.order).map(link => <NavItem key={link.id} link={link} />)}
                </div>
                <button onClick={handleAddLink} className="w-full bg-scout-green text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90">Add New Link</button>
            </div>
            {editingLink && <EditNavLinkModal link={editingLink} allLinks={navLinks} onSave={handleSaveLink} onClose={() => setEditingLink(null)} />}
        </div>
    );
};

const EditNavLinkModal = ({ link, allLinks, onSave, onClose } : { link: NavLink, allLinks: NavLink[], onSave: (link: NavLink) => void, onClose: () => void }) => {
    const [formData, setFormData] = useState(link);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: name === 'parentId' ? (value ? parseInt(value) : null) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    // Prevent a link from being its own parent or a descendant of itself.
    const getPossibleParents = () => {
        const descendants = new Set<number>();
        const queue = [link.id];
        while (queue.length > 0) {
            const currentId = queue.shift();
            if (currentId) {
                descendants.add(currentId);
                allLinks.filter(l => l.parentId === currentId).forEach(child => queue.push(child.id));
            }
        }
        return allLinks.filter(l => !descendants.has(l.id));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">{link.id === 0 ? 'Add Link' : 'Edit Link'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" required />
                    <input type="text" name="path" placeholder="Path (e.g., /gallery or #)" value={formData.path} onChange={handleChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md" required />
                    <div>
                        <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Parent Link (for sub-menus)</label>
                        <select id="parentId" name="parentId" value={formData.parentId || ''} onChange={handleChange} className="w-full p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md mt-1">
                            <option value="">-- No Parent --</option>
                            {getPossibleParents().map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const DashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [activeSection, setActiveSection] = useState('overview');

    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return <OverviewSection />;
            case 'moderators':
                return <ModeratorsSection />;
            case 'navigation':
                return <NavigationSettingsSection />;
            default:
                return <OverviewSection />;
        }
    };
    
    if (!currentUser) return null;

    const navButtonClasses = (sectionName: string) => 
        `w-full text-left font-semibold px-4 py-2 rounded-lg transition-colors ${
            activeSection === sectionName 
            ? 'bg-scout-green text-white' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-scout-green dark:text-white">Admin Dashboard</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">Welcome, {currentUser.fullName}!</p>
                </header>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    <aside className="md:w-1/4 lg:w-1/5">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <nav className="space-y-2">
                                <button onClick={() => setActiveSection('overview')} className={navButtonClasses('overview')}>Overview</button>
                                {currentUser.role === 'CHIEF_ADMIN' && (
                                    <>
                                        <button onClick={() => setActiveSection('navigation')} className={navButtonClasses('navigation')}>Navigation</button>
                                        <button onClick={() => setActiveSection('moderators')} className={navButtonClasses('moderators')}>Manage Moderators</button>
                                    </>
                                )}
                            </nav>
                        </div>
                    </aside>
                    <main className="flex-1">
                        {renderSection()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;