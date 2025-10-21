
import React, { useState, useEffect } from 'react';
import { useData, GalleryImage } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const AddGalleryModal = ({ onClose }: { onClose: () => void }) => {
    const { addGalleryImage } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ imageUrl: '', alt: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.imageUrl && formData.alt) {
            addGalleryImage(formData);
            showNotification('Photo added successfully!');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Add New Gallery Photo</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="alt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Alt Text)</label>
                        <input type="text" name="alt" id="alt" value={formData.alt} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md hover:bg-opacity-90">Add Photo</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditGalleryModal = ({ image, onClose }: { image: GalleryImage; onClose: () => void }) => {
    const { updateGalleryImage } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ imageUrl: image.imageUrl, alt: image.alt });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.imageUrl && formData.alt) {
            updateGalleryImage({ ...image, ...formData });
            showNotification('Photo updated successfully!');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Edit Gallery Photo</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="alt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Alt Text)</label>
                        <input type="text" name="alt" id="alt" value={formData.alt} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
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

const Modal = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoading(false);
        img.onerror = () => setIsLoading(false); // Also stop loading on error
    }, [src]);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={onClose} 
                  className="absolute -top-2 -right-2 md:-top-1 md:-right-8 bg-black/50 rounded-full h-8 w-8 flex items-center justify-center text-white z-10 hover:bg-black/75 transition-colors"
                  aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                 <div className="relative flex justify-center items-center max-h-[85vh] max-w-[90vw] min-w-[200px] min-h-[200px]">
                    {isLoading && (
                        <div className="absolute w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <figure className={`relative transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                        <img src={src} alt={alt} className="block max-h-[85vh] max-w-full rounded-lg shadow-2xl" />
                        <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-white text-center text-base md:text-lg rounded-b-lg">
                            {alt}
                        </figcaption>
                    </figure>
                </div>
            </div>
        </div>
    );
};


const GalleryPage: React.FC = () => {
    const { galleryImages, deleteGalleryImage } = useData();
    const { isAdmin } = useAuth();
    const { showNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

    const generateImageProps = (imageUrl: string) => {
        try {
            const url = new URL(imageUrl);
            const pathParts = url.pathname.split('/').filter(p => p);
            if (url.hostname === 'picsum.photos' && pathParts[0] === 'id' && pathParts.length >= 2) {
                const id = pathParts[1];
                const base = `${url.protocol}//${url.hostname}/id/${id}`;
                const srcSet = [300, 500, 800, 1200].map(size => `${base}/${size}/${size} ${size}w`).join(', ');
                const sizes = `(max-width: 639px) 90vw, (max-width: 767px) 45vw, (max-width: 1023px) 30vw, 22vw`;
                return { src: `${base}/500/500`, srcSet, sizes };
            }
        } catch (e) { /* Invalid URL, fallback below */ }
        return { src: imageUrl };
    };
    
    const getHighResUrl = (imageUrl: string) => {
        try {
            const url = new URL(imageUrl);
            const pathParts = url.pathname.split('/').filter(p => p);
            if (url.hostname === 'picsum.photos' && pathParts[0] === 'id' && pathParts.length >= 2) {
                const id = pathParts[1];
                return `${url.protocol}//${url.hostname}/id/${id}/1200/1200`;
            }
        } catch (e) { /* Invalid URL */ }
        return imageUrl; // Fallback to original URL
    };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">Our Memorable Moments</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Some glimpse of our journey.
          </p>
          {isAdmin && (
            <button onClick={() => setIsModalOpen(true)} className="mt-6 bg-scout-green text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300">
              + Add New Photo
            </button>
          )}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryImages.map((image) => (
              <div key={image.id} className="group relative break-inside-avoid">
                <div 
                  className="cursor-pointer rounded-lg overflow-hidden shadow-md"
                  onClick={() => setSelectedImage(image)}
                >
                    <img
                      {...generateImageProps(image.imageUrl)}
                      alt={image.alt}
                      loading="lazy"
                      className="w-full h-auto block transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                </div>
                {isAdmin && (
                    <div className="absolute top-2 right-2 z-20 flex space-x-2">
                         <button
                            onClick={(e) => { e.stopPropagation(); setEditingImage(image); }}
                            className="bg-scout-blue text-white rounded-full p-2 leading-none hover:bg-blue-700 transition-colors"
                            aria-label="Edit image"
                            title="Edit image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/>
                            </svg>
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete the photo: "${image.alt}"?`)) {
                                    deleteGalleryImage(image.id);
                                    showNotification('Photo deleted successfully!');
                                }
                            }}
                            className="bg-red-600 text-white rounded-full p-2 leading-none hover:bg-red-700 transition-colors"
                            aria-label="Delete image"
                            title="Delete image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </div>
                )}
              </div>
            ))}
        </div>
      </div>
      {selectedImage && <Modal src={getHighResUrl(selectedImage.imageUrl)} alt={selectedImage.alt} onClose={() => setSelectedImage(null)} />}
      {isModalOpen && <AddGalleryModal onClose={() => setIsModalOpen(false)} />}
      {editingImage && <EditGalleryModal image={editingImage} onClose={() => setEditingImage(null)} />}
    </div>
  );
};

export default GalleryPage;
