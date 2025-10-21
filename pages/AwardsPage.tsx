import React, { useState, useEffect } from 'react';
import { useData, Award, Awardee, AwardCategory } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const getCategoryColor = (category: AwardCategory) => {
    switch (category) {
        case 'Cub Scout': return 'bg-scout-yellow text-gray-900';
        case 'Scout': return 'bg-scout-green text-white';
        case 'Rover Scout': return 'bg-scout-red text-white';
        case 'Adult Leader': return 'bg-scout-blue text-white';
        case 'Special': return 'bg-[#5E277D] text-white';
        default: return 'bg-gray-500 text-white';
    }
}

const AwardFormModal = ({ awardToEdit, onClose }: { awardToEdit: Award | null; onClose: () => void }) => {
    const { addAward, updateAward } = useData();
    const { showNotification } = useNotification();
    const isEditing = !!awardToEdit;

    const [formData, setFormData] = useState<Omit<Award, 'id' | 'awardees'>>({
        name: awardToEdit?.name || '',
        description: awardToEdit?.description || '',
        imageUrl: awardToEdit?.imageUrl || '',
        categories: awardToEdit?.categories || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const category = value as AwardCategory;
        setFormData(prev => {
            const currentCategories = prev.categories;
            if (checked) {
                return { ...prev, categories: [...currentCategories, category] };
            } else {
                return { ...prev, categories: currentCategories.filter(c => c !== category) };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.categories.length === 0) {
            showNotification('Please select at least one category.', 'error');
            return;
        }

        if (isEditing) {
            updateAward({ ...awardToEdit, ...formData });
            showNotification('Award updated successfully!');
        } else {
            addAward(formData);
            showNotification('Award added successfully!');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">{isEditing ? 'Edit Award' : 'Add New Award'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Award Name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <input type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categories</label>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
                            {(['Cub Scout', 'Scout', 'Rover Scout', 'Adult Leader', 'Special'] as AwardCategory[]).map((cat) => (
                                <label key={cat} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="categories"
                                        value={cat}
                                        checked={formData.categories.includes(cat)}
                                        onChange={handleCategoryChange}
                                        className="h-4 w-4 rounded border-gray-300 text-scout-green focus:ring-scout-green"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" rows={4} required />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Award'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AwardeeFormModal = ({
    awardId,
    awardeeToEdit,
    onClose,
}: {
    awardId: number;
    awardeeToEdit: Awardee | null;
    onClose: () => void;
}) => {
    const { addAwardeeToAward, updateAwardeeInAward } = useData();
    const { showNotification } = useNotification();
    const isEditing = !!awardeeToEdit;

    const [formData, setFormData] = useState({
        name: awardeeToEdit?.name || '',
        year: awardeeToEdit?.year || new Date().getFullYear(),
        imageUrl: awardeeToEdit?.imageUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' ? parseInt(value) || '' : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            year: Number(formData.year)
        };

        if (isEditing) {
            updateAwardeeInAward(awardId, { ...awardeeToEdit, ...finalData });
            showNotification('Awardee updated successfully!');
        } else {
            addAwardeeToAward(awardId, finalData);
            showNotification('Awardee added successfully!');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">{isEditing ? 'Edit Awardee' : 'Add New Awardee'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Awardee's Name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <input type="number" name="year" placeholder="Year Achieved" value={formData.year} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required min="1900" max={new Date().getFullYear() + 1} />
                    <input type="url" name="imageUrl" placeholder="Image URL (optional)" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">{isEditing ? 'Save Changes' : 'Add Awardee'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AwardDetailModal = ({ award, onClose, onEditAwardee, onAddAwardee, onDeleteAwardee, isAdmin }: { award: Award; onClose: () => void; onEditAwardee: (awardee: Awardee) => void; onAddAwardee: () => void; onDeleteAwardee: (awardee: Awardee) => void; isAdmin: boolean; }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] p-4" onClick={onClose}>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 md:p-12 overflow-y-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <div className="md:w-1/3 flex-shrink-0">
                            <div className={`aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center shadow-md`}>
                                <img src={award.imageUrl} alt={award.name} className="max-h-full max-w-full object-contain" />
                            </div>
                        </div>
                        <div className="md:w-2/3">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {award.categories.map(category => (
                                    <span key={category} className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(category)}`}>
                                        {category}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl font-extrabold text-scout-green dark:text-white tracking-tight mb-4">{award.name}</h1>
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{award.description}</p>
                        </div>
                    </div>

                    {/* Awardees */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Awardees</h2>
                            {isAdmin && (
                                <button
                                    onClick={onAddAwardee}
                                    className="bg-scout-green text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-opacity-90 transition-transform transform hover:scale-105"
                                >
                                    + Add Awardee
                                </button>
                            )}
                        </div>

                        {(award.awardees && award.awardees.length > 0) ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {[...award.awardees].sort((a, b) => b.year - a.year).map(awardee => (
                                    <div key={awardee.id} className="group relative text-center">
                                        <img
                                            src={awardee.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(awardee.name)}&background=random`}
                                            alt={awardee.name}
                                            className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                                        />
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{awardee.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Achieved on {awardee.year}</p>
                                        {isAdmin && (
                                            <div className="absolute top-0 right-0 z-10 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEditAwardee(awardee)}
                                                    className="bg-scout-blue text-white rounded-full p-2 leading-none hover:bg-blue-700" title="Edit Awardee">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg>
                                                </button>
                                                <button
                                                    onClick={() => onDeleteAwardee(awardee)}
                                                    className="bg-red-600 text-white rounded-full p-2 leading-none hover:bg-red-700" title="Delete Awardee">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Awardees for this award will be listed here soon.</p>
                        )}
                    </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700 mt-auto">
                    <button onClick={onClose} className="inline-block font-bold py-2 px-8 rounded-full text-lg transition-colors duration-300 border-2 border-scout-green text-scout-green hover:bg-scout-green hover:text-white dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700 dark:hover:border-gray-700">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


const AwardsPage: React.FC = () => {
    const { awards, deleteAward, deleteAwardeeFromAward } = useData();
    const { isAdmin } = useAuth();
    const { showNotification } = useNotification();

    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedAward, setSelectedAward] = useState<Award | null>(null);
    const [awardModalState, setAwardModalState] = useState<{ isOpen: boolean; award: Award | null }>({ isOpen: false, award: null });
    const [awardeeModalState, setAwardeeModalState] = useState<{ isOpen: boolean; awardId: number | null; awardee: Awardee | null; }>({ isOpen: false, awardId: null, awardee: null });

    useEffect(() => {
        if (selectedAward) {
            const freshAwardData = awards.find(a => a.id === selectedAward.id);
            if (freshAwardData) {
                if (JSON.stringify(freshAwardData) !== JSON.stringify(selectedAward)) {
                    setSelectedAward(freshAwardData);
                }
            } else {
                setSelectedAward(null);
            }
        }
    }, [awards, selectedAward]);

    const categories = ['All', 'Cub Scout', 'Scout', 'Rover Scout', 'Adult Leader', 'Special'];
    
    const filteredAwards = selectedCategory === 'All'
        ? awards
        : awards.filter(award => award.categories.includes(selectedCategory as AwardCategory));
    
    const handleDeleteAwardee = (awardee: Awardee) => {
        if (selectedAward && window.confirm(`Are you sure you want to delete the awardee "${awardee.name}"?`)) {
            deleteAwardeeFromAward(selectedAward.id, awardee.id);
            showNotification('Awardee deleted successfully!');
        }
    };

    const handleOpenAddAwardeeModal = () => {
        if (selectedAward) {
            setAwardeeModalState({ isOpen: true, awardId: selectedAward.id, awardee: null });
        }
    };
    
    const handleOpenEditAwardeeModal = (awardee: Awardee) => {
        if (selectedAward) {
            setAwardeeModalState({ isOpen: true, awardId: selectedAward.id, awardee: awardee });
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">Members Achievements</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                        Celebrating the achievements, dedication, and progression of our scouts through various ranks and proficiency badges.
                    </p>
                    {isAdmin && (
                        <button onClick={() => setAwardModalState({ isOpen: true, award: null })} className="mt-8 bg-scout-green text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300">
                            + Add New Award
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

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {filteredAwards.map((award) => (
                        <div key={award.id} className="group relative text-center">
                            <div onClick={() => setSelectedAward(award)} className="cursor-pointer space-y-3">
                                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                                    <img src={award.imageUrl} alt={award.name} className="max-h-full max-w-full object-contain" />
                                </div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-scout-green dark:group-hover:text-white transition-colors">{award.name}</h3>
                            </div>
                            {isAdmin && (
                                <div className="absolute top-2 right-2 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setAwardModalState({ isOpen: true, award })} className="bg-scout-blue text-white rounded-full p-2 leading-none hover:bg-blue-700" title="Edit Award">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg>
                                    </button>
                                    <button onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete the award "${award.name}"?`)) {
                                            deleteAward(award.id);
                                            showNotification('Award deleted successfully!');
                                        }
                                    }} className="bg-red-600 text-white rounded-full p-2 leading-none hover:bg-red-700" title="Delete Award">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {selectedAward && <AwardDetailModal award={selectedAward} onClose={() => setSelectedAward(null)} isAdmin={isAdmin} onAddAwardee={handleOpenAddAwardeeModal} onEditAwardee={handleOpenEditAwardeeModal} onDeleteAwardee={handleDeleteAwardee} />}
            {awardModalState.isOpen && <AwardFormModal awardToEdit={awardModalState.award} onClose={() => setAwardModalState({ isOpen: false, award: null })} />}
            {awardeeModalState.isOpen && awardeeModalState.awardId && <AwardeeFormModal awardId={awardeeModalState.awardId} awardeeToEdit={awardeeModalState.awardee} onClose={() => setAwardeeModalState({ isOpen: false, awardId: null, awardee: null })} />}
        </div>
    );
};

export default AwardsPage;