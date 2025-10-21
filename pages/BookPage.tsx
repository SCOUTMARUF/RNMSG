import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData, RNMSGBook } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

declare const pdfjsLib: any;

const BookCover = React.memo(({ fileUrl, coverUrl }: { fileUrl: string, coverUrl?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [coverImageError, setCoverImageError] = useState(false);

    const isImageFile = (url: string) => url.startsWith('data:image/') || /\.(jpe?g|png|gif|webp)$/i.test(url);
    const isPdfFile = (url: string) => url.startsWith('data:application/pdf') || /\.pdf$/i.test(url);
    const fileType = isImageFile(fileUrl) ? 'image' : (isPdfFile(fileUrl) ? 'pdf' : 'unknown');

    useEffect(() => {
        setIsLoading(true);
        setCoverImageError(false);
    }, [fileUrl, coverUrl]);

    useEffect(() => {
        if (coverUrl && !coverImageError) {
            return; // Image loading is handled by the <img> element's onLoad/onError
        }
        if (fileType === 'image') {
            setIsLoading(false);
            return;
        }

        if (fileType !== 'pdf') {
            setIsLoading(false);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;
        
        context.fillStyle = '#e5e7eb'; // gray-200
        context.fillRect(0, 0, canvas.width, canvas.height);

        const loadingTask = pdfjsLib.getDocument({ url: fileUrl, CMapReaderFactory: null, StandardFontDataFactory: null });
        loadingTask.promise.then((pdf: any) => {
            pdf.getPage(1).then((page: any) => {
                const desiredWidth = canvas.clientWidth || 200; // Provide a fallback width
                const viewport = page.getViewport({ scale: 1 });
                const scale = desiredWidth / viewport.width;
                const scaledViewport = page.getViewport({ scale });

                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport,
                };
                page.render(renderContext).promise.then(() => setIsLoading(false));
            });
        }).catch((error: any) => {
            console.error("Error rendering book cover:", error);
            setIsLoading(false);
        });
    }, [fileUrl, coverUrl, coverImageError, fileType]);

    const renderContent = () => {
        if (coverUrl && !coverImageError) {
            return (
                 <img 
                    src={coverUrl} 
                    alt="Book Cover" 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        console.error("Failed to load cover image URL:", coverUrl);
                        setCoverImageError(true);
                    }}
                />
            );
        }
        if (fileType === 'image') {
             return (
                 <img 
                    src={fileUrl} 
                    alt="Book Cover" 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                />
            );
        }
        if (fileType === 'pdf') {
            return <canvas ref={canvasRef} className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`} />;
        }
        return (
            <div className={`w-full h-full flex items-center justify-center p-2 text-center text-xs text-gray-500 dark:text-gray-400 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Preview unavailable
            </div>
        );
    };

    return (
        <div className="relative aspect-[210/297] w-full bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden shadow-sm">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {renderContent()}
        </div>
    );
});

const BookFormModal = ({ bookToEdit, onClose }: { bookToEdit: RNMSGBook | null; onClose: () => void }) => {
    const { addRnmsgBook, updateRnmsgBook } = useData();
    const { showNotification } = useNotification();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isInitialDataUrl = bookToEdit?.fileUrl.startsWith('data:') || false;

    const [formData, setFormData] = useState({
        title: bookToEdit?.title || '',
        fileUrl: bookToEdit?.fileUrl || '',
        coverUrl: bookToEdit?.coverUrl || '',
    });

    const [uploadedFileName, setUploadedFileName] = useState<string | null>(
        isInitialDataUrl ? 'Previously uploaded file' : null
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
                showNotification('Please select a valid PDF, PNG, or JPG file.', 'error');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            setUploadedFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileDataUrl = event.target?.result as string;
                setFormData(prev => ({ ...prev, fileUrl: fileDataUrl }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearFile = () => {
        setUploadedFileName(null);
        setFormData(prev => ({ ...prev, fileUrl: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const dataToSubmit: Omit<RNMSGBook, 'id'> = {
            title: formData.title,
            fileUrl: formData.fileUrl,
        };

        if (formData.coverUrl) {
            dataToSubmit.coverUrl = formData.coverUrl;
        }

        if (bookToEdit) {
            updateRnmsgBook({ ...bookToEdit, ...dataToSubmit });
            showNotification('Book updated successfully!');
        } else {
            addRnmsgBook(dataToSubmit);
            showNotification('Book added successfully!');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">{bookToEdit ? 'Edit Book' : 'Add New Book'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Book Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    
                    <div>
                        <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">PDF or Image URL</label>
                        <input 
                            type="text"
                            name="fileUrl" 
                            id="fileUrl" 
                            value={formData.fileUrl} 
                            onChange={e => setFormData({ ...formData, fileUrl: e.target.value })} 
                            className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green ${!!uploadedFileName ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : ''}`}
                            required 
                            placeholder="https://... or upload a file"
                            disabled={!!uploadedFileName}
                        />
                        {!uploadedFileName && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Enter a public file link or upload a file below.</p>}
                    </div>

                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <div>
                        {uploadedFileName ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selected File</label>
                                <div className="mt-1 flex justify-between items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{uploadedFileName}</span>
                                    <button type="button" onClick={handleClearFile} className="ml-2 text-sm font-semibold text-red-600 hover:text-red-800">
                                        Clear
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <input 
                                    type="file" 
                                    accept="application/pdf,image/png,image/jpeg" 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    id="file-upload"
                                />
                                <label 
                                    htmlFor="file-upload" 
                                    className="cursor-pointer w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-scout-green"
                                >
                                    Upload PDF/Image File
                                </label>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL (Optional)</label>
                        <input type="url" name="coverUrl" id="coverUrl" value={formData.coverUrl} onChange={e => setFormData({ ...formData, coverUrl: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" placeholder="https://..." />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Provide an image link. If blank, a cover is generated from the PDF/Image.</p>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md hover:bg-opacity-90">{bookToEdit ? 'Save Changes' : 'Add Book'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BookPage: React.FC = () => {
    const { rnmsgBooks, deleteRnmsgBook } = useData();
    const { isAdmin } = useAuth();
    const { showNotification } = useNotification();
    const [modalState, setModalState] = useState<{ isOpen: boolean; book: RNMSGBook | null }>({ isOpen: false, book: null });

    const handleDelete = (book: RNMSGBook) => {
        if (window.confirm(`Are you sure you want to delete the book "${book.title}"?`)) {
            deleteRnmsgBook(book.id);
            showNotification('Book deleted successfully!');
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">RNMSG Library</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                        Explore our collection of publications. Click on a book to start reading.
                    </p>
                    {isAdmin && (
                        <button onClick={() => setModalState({ isOpen: true, book: null })} className="mt-8 bg-scout-green text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300">
                            + Add New Book
                        </button>
                    )}
                </div>

                {rnmsgBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {rnmsgBooks.map(book => (
                            <div key={book.id} className="group relative">
                                <Link to={`/books/${book.id}`} className="flex flex-col items-center text-center space-y-3">
                                    <div className="w-full transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 rounded-md">
                                       <BookCover fileUrl={book.fileUrl} coverUrl={book.coverUrl} />
                                    </div>
                                    <h2 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-scout-green dark:group-hover:text-white transition-colors">{book.title}</h2>
                                </Link>
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setModalState({ isOpen: true, book: book })} className="bg-scout-blue text-white rounded-full p-2 leading-none hover:bg-blue-700" title="Edit Book">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg>
                                        </button>
                                        <button onClick={() => handleDelete(book)} className="bg-red-600 text-white rounded-full p-2 leading-none hover:bg-red-700" title="Delete Book">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500 dark:text-gray-400">The library is currently empty. Check back soon!</p>
                    </div>
                )}
            </div>
            {modalState.isOpen && <BookFormModal bookToEdit={modalState.book} onClose={() => setModalState({ isOpen: false, book: null })} />}
        </div>
    );
};

export default BookPage;