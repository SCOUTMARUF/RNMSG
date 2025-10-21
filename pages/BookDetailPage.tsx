import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';

declare const pdfjsLib: any;

const BookDetailPage: React.FC = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const { rnmsgBooks } = useData();
    const book = rnmsgBooks.find(b => b.id.toString() === bookId);

    const [pdf, setPdf] = useState<any>(null);
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('1');
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { showNotification } = useNotification();

    const isImage = book && (book.fileUrl.startsWith('data:image/') || /\.(jpe?g|png|gif|webp)$/i.test(book.fileUrl));
    const isPdf = book && (book.fileUrl.startsWith('data:application/pdf') || /\.pdf$/i.test(book.fileUrl));

    useEffect(() => {
        if (!book) return;

        if (isImage) {
            setIsLoading(false);
            return;
        }

        if (!isPdf) {
            setIsLoading(false);
            showNotification('Unsupported file type.', 'error');
            return;
        }

        setIsLoading(true);
        const loadingTask = pdfjsLib.getDocument({ url: book.fileUrl, CMapReaderFactory: null, StandardFontDataFactory: null });
        loadingTask.promise.then((loadedPdf: any) => {
            setPdf(loadedPdf);
            setNumPages(loadedPdf.numPages);
            setCurrentPage(1);
            setPageInput('1');
            setIsLoading(false);
        }).catch((error: any) => {
            console.error("Error loading PDF:", error);
            showNotification('Failed to load PDF file. It may be an invalid link or blocked by CORS policy.', 'error');
            setPdf(null);
            setNumPages(0);
            setIsLoading(false);
        });
    }, [book, isImage, isPdf, showNotification]);

    const renderPage = useCallback((pageNumber: number) => {
        if (!pdf) return;
        pdf.getPage(pageNumber).then((page: any) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const container = canvas.parentElement;
            if (!container) return;

            const scale = 2; // Render at higher resolution
            const viewport = page.getViewport({ scale: scale });
            const context = canvas.getContext('2d');
            if (!context) return;
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.width = "100%";
            canvas.style.height = "100%";

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            page.render(renderContext);
        });
    }, [pdf]);

    useEffect(() => {
        if (pdf && isPdf) {
            renderPage(currentPage);
        }
    }, [pdf, currentPage, renderPage, isPdf]);

    useEffect(() => {
        setPageInput(String(currentPage));
    }, [currentPage]);

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, numPages || 1));
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < numPages) {
            goToPage(currentPage + 1);
        }
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageInput(e.target.value);
    };

    const handlePageInputSubmit = () => {
        const newPage = parseInt(pageInput, 10);
        if (!isNaN(newPage) && newPage >= 1 && newPage <= numPages) {
            goToPage(newPage);
        } else {
            setPageInput(String(currentPage)); // Reset if invalid
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handlePageInputSubmit();
            e.currentTarget.blur();
        }
    };

    const handleSliderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageInput(e.target.value);
    };
    
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        goToPage(parseInt(e.target.value, 10));
    };

    if (!book && !isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-3xl font-bold text-scout-green dark:text-white">Book Not Found!</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-4">The book you are looking for does not exist.</p>
                <Link to="/books" className="mt-8 inline-block bg-scout-yellow text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-colors duration-300">
                    &larr; Back to Library
                </Link>
            </div>
        );
    }

    const navDisabled = isLoading || !pdf;
    const downloadButtonText = isImage ? 'Download Image' : (isPdf ? 'Download PDF' : 'Download File');

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">{book?.title || 'Loading...'}</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 text-center">
                    An interactive publication from RNMSG.
                </p>

                <div className="w-full max-w-2xl my-8">
                    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center p-2 sm:p-4 ${isPdf ? 'aspect-[210/297]' : 'min-h-[400px]'}`}>
                        {isLoading ? (
                            <div className="text-center text-gray-800 dark:text-gray-200">
                                <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-xl font-bold">LOADING BOOK...</p>
                            </div>
                        ) : isPdf && pdf ? (
                            <canvas ref={canvasRef} className="w-full h-full object-contain rounded-md shadow-inner" />
                        ) : isImage ? (
                            <img src={book.fileUrl} alt={book.title} className="max-w-full max-h-[80vh] object-contain" />
                        ) : (
                             <div className="text-center text-gray-800 dark:text-gray-200 p-4">
                                <p className="text-2xl font-bold mb-2">DOCUMENT</p>
                                <p>Could not load the publication.</p>
                            </div>
                        )}
                    </div>
                </div>

                {isPdf && (
                    <div className="w-full max-w-sm">
                        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                            <button onClick={handlePrevPage} disabled={navDisabled || currentPage <= 1} className="bg-green-500 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <span className="sr-only">Previous Page</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </button>
                            
                            <div className="flex items-center justify-center border-2 border-green-500 rounded-md font-bold text-lg dark:text-gray-200">
                                <input
                                    type="text"
                                    className="w-12 sm:w-16 text-center bg-transparent focus:outline-none p-2"
                                    value={pageInput}
                                    onChange={handlePageInputChange}
                                    onBlur={handlePageInputSubmit}
                                    onKeyPress={handleKeyPress}
                                    disabled={navDisabled}
                                    aria-label="Current Page"
                                />
                                <span className="text-lg text-gray-600 dark:text-gray-400 border-l-2 border-green-500 px-3 sm:px-4 py-2">
                                {numPages > 0 ? numPages : '-'}
                                </span>
                            </div>

                            <button onClick={handleNextPage} disabled={navDisabled || currentPage >= numPages} className="bg-green-500 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <span className="sr-only">Next Page</span>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>

                        {numPages > 1 && (
                            <div className="mt-4 px-4 sm:px-0">
                                <input
                                    type="range"
                                    min="1"
                                    max={numPages}
                                    value={pageInput}
                                    onInput={handleSliderInput}
                                    onChange={handleSliderChange}
                                    disabled={navDisabled}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-scout-green disabled:cursor-not-allowed disabled:accent-gray-500"
                                    aria-label="Page slider"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
                     <Link to="/books" className="inline-flex items-center gap-2 text-scout-green dark:text-white dark:hover:bg-gray-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition-colors duration-300">
                        &larr; Back to Library
                    </Link>
                    <a 
                        href={book?.fileUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        download
                        className={`inline-flex items-center gap-2 bg-scout-yellow text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-transform transform hover:scale-105 duration-300 ${!book ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={(e) => !book && e.preventDefault()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                        {downloadButtonText}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;