import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useData, EventFrame } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const HIGH_RES_SIZE = 4000;
const PREVIEW_SIZE = 500;

// Admin Modal for adding a new frame
const AddFrameModal = ({ onClose }: { onClose: () => void }) => {
    const { addEventFrame } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ name: '', imageUrl: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.imageUrl && formData.name) {
            addEventFrame(formData);
            showNotification('Frame added successfully!');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Add New Event Frame</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frame Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frame Image URL</label>
                        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md hover:bg-opacity-90">Add Frame</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Admin Modal for editing an existing frame
const EditFrameModal = ({ frame, onClose }: { frame: EventFrame; onClose: () => void }) => {
    const { updateEventFrame } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({ name: frame.name, imageUrl: frame.imageUrl });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.imageUrl && formData.name) {
            updateEventFrame({ ...frame, ...formData });
            showNotification('Frame updated successfully!');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Edit Event Frame</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frame Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frame Image URL</label>
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

// Main Page Component
const EventFramesPage: React.FC = () => {
    const { eventFrames, deleteEventFrame } = useData();
    const { isAdmin } = useAuth();
    const { showNotification } = useNotification();
    
    // Image and frame state
    const [userImage, setUserImage] = useState<string | null>(null);
    const [selectedFrame, setSelectedFrame] = useState<EventFrame | null>(null);
    
    // Processing state
    const [isProcessing, setIsProcessing] = useState(false);

    // Admin modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingFrame, setEditingFrame] = useState<EventFrame | null>(null);

    // Refs
    const highResCanvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const userImageRef = useRef<HTMLImageElement | null>(null);
    const frameImageRef = useRef<HTMLImageElement | null>(null);

    // Transform state for image manipulation
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Dragging state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Ref for multi-touch gesture state
    const pinchStateRef = useRef({
        initialPinchDistance: 0,
        initialRotationAngle: 0,
        initialZoom: 1,
        initialRotation: 0,
    });

    // Set initial frame on component mount
    useEffect(() => {
        if (eventFrames.length > 0 && !selectedFrame) {
            setSelectedFrame(eventFrames[0]);
        }
    }, [eventFrames, selectedFrame]);

    const drawPreview = useCallback(() => {
        const canvas = previewCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const userImg = userImageRef.current;
        if (userImg && userImg.complete) {
            const canvasAspect = canvas.width / canvas.height;
            const imgAspect = userImg.width / userImg.height;
            
            let baseScale = (imgAspect > canvasAspect) 
                ? canvas.height / userImg.height 
                : canvas.width / userImg.width;
            
            const effectiveScale = baseScale * zoom;
    
            ctx.save();
            ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);
            ctx.rotate(rotation * Math.PI / 180);
            ctx.scale(effectiveScale, effectiveScale);
            ctx.drawImage(userImg, -userImg.width / 2, -userImg.height / 2);
            ctx.restore();
        } else {
            ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#4B5563' : '#9CA3AF'; // gray-600 dark / gray-400 light
            ctx.font = '16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Your preview will appear here.', canvas.width / 2, canvas.height / 2);
        }
        
        const frameImg = frameImageRef.current;
        if (frameImg && frameImg.complete) {
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        }
    }, [zoom, rotation, offset]);

    useEffect(() => {
        drawPreview();
    }, [drawPreview]);
    
    useEffect(() => {
        const userImg = new Image();
        userImg.crossOrigin = "anonymous";
        userImg.onload = () => {
            userImageRef.current = userImg;
            drawPreview();
        };
        if (userImage) {
            userImg.src = userImage;
        } else {
            userImageRef.current = null;
            drawPreview();
        }
    }, [userImage, drawPreview]);

    useEffect(() => {
        const frameImg = new Image();
        frameImg.crossOrigin = "anonymous";
        frameImg.onload = () => {
            frameImageRef.current = frameImg;
            drawPreview();
        };
        if (selectedFrame) {
            frameImg.src = selectedFrame.imageUrl;
        } else {
            frameImageRef.current = null;
            drawPreview();
        }
    }, [selectedFrame, drawPreview]);

    const resetTransforms = () => {
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            resetTransforms();
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => setUserImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleDownload = async () => {
        const highResCanvas = highResCanvasRef.current;
        const userImg = userImageRef.current;
        const frameImg = frameImageRef.current;

        if (!highResCanvas || !userImg || !frameImg) {
            showNotification('Please upload a photo and select a frame.', 'error');
            return;
        }

        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 50));

        const ctx = highResCanvas.getContext('2d');
        if (!ctx) {
            setIsProcessing(false);
            showNotification('Could not generate image.', 'error');
            return;
        }

        const scaleRatio = highResCanvas.width / PREVIEW_SIZE;
        ctx.clearRect(0, 0, highResCanvas.width, highResCanvas.height);

        const canvasAspect = highResCanvas.width / highResCanvas.height;
        const imgAspect = userImg.width / userImg.height;
        let baseScale = (imgAspect > canvasAspect) 
            ? highResCanvas.height / userImg.height
            : highResCanvas.width / userImg.width;

        const effectiveScale = baseScale * zoom;

        ctx.save();
        ctx.translate(highResCanvas.width / 2 + offset.x * scaleRatio, highResCanvas.height / 2 + offset.y * scaleRatio);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(effectiveScale, effectiveScale);
        ctx.drawImage(userImg, -userImg.width / 2, -userImg.height / 2);
        ctx.restore();

        ctx.drawImage(frameImg, 0, 0, highResCanvas.width, highResCanvas.height);
        
        const dataUrl = highResCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `RNMSG_Frame_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsProcessing(false);
    };

    // Helper functions for touch gestures
    const getDistance = (touches: React.TouchList) => {
        const [touch1, touch2] = [touches[0], touches[1]];
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    };

    const getAngle = (touches: React.TouchList) => {
        const [touch1, touch2] = [touches[0], touches[1]];
        return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * 180 / Math.PI;
    };

    // Mouse handlers for panning
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!userImage) return;
        setIsDragging(true);
        setDragStart({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging || !userImage) return;
        const dx = e.nativeEvent.offsetX - dragStart.x;
        const dy = e.nativeEvent.offsetY - dragStart.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setDragStart({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };
    const handleMouseUpOrLeave = () => setIsDragging(false);

    // Touch handlers for pan, zoom, and rotate
    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!userImage) return;
        e.preventDefault();
        const touches = e.touches;
        if (touches.length === 1) {
            setIsDragging(true);
            setDragStart({ x: touches[0].clientX, y: touches[0].clientY });
        } else if (touches.length === 2) {
            setIsDragging(false); // Stop panning when a second finger is added
            pinchStateRef.current = {
                initialPinchDistance: getDistance(touches),
                initialRotationAngle: getAngle(touches),
                initialZoom: zoom,
                initialRotation: rotation,
            };
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!userImage) return;
        e.preventDefault();
        const touches = e.touches;
        if (touches.length === 1 && isDragging) {
            const touch = touches[0];
            const dx = touch.clientX - dragStart.x;
            const dy = touch.clientY - dragStart.y;
            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setDragStart({ x: touch.clientX, y: touch.clientY });
        } else if (touches.length === 2) {
            // Pinch to zoom
            const { initialPinchDistance, initialZoom } = pinchStateRef.current;
            const newPinchDistance = getDistance(touches);
            const zoomFactor = newPinchDistance / initialPinchDistance;
            const newZoom = Math.max(0.5, Math.min(initialZoom * zoomFactor, 3));
            setZoom(newZoom);

            // Rotate
            const { initialRotationAngle, initialRotation } = pinchStateRef.current;
            const newAngle = getAngle(touches);
            const angleDiff = newAngle - initialRotationAngle;
            let newRotation = initialRotation + angleDiff;
            setRotation(newRotation);
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
        // If transitioning from 2+ fingers to 1 finger, restart the pan
        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else {
            setIsDragging(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
            <canvas ref={highResCanvasRef} width={HIGH_RES_SIZE} height={HIGH_RES_SIZE} className="hidden" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">Event Photo Frames</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                        Create a memorable photo with our special event frames!
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side: Controls & Frames */}
                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-2">1. Upload Your Photo</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Click below to select a photo from your device.</p>
                             <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-scout-blue text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300"
                            >
                                Choose Photo
                            </button>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-scout-green dark:text-white">2. Select a Frame</h2>
                                    <p className="text-gray-600 dark:text-gray-400">Pick your favorite frame.</p>
                                </div>
                                {isAdmin && (
                                     <button onClick={() => setIsAddModalOpen(true)} className="bg-scout-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300 text-sm whitespace-nowrap">
                                        + Add Frame
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                                {eventFrames.map(frame => (
                                    <div key={frame.id} className="group relative">
                                        <img 
                                            src={frame.imageUrl} 
                                            alt={frame.name}
                                            onClick={() => setSelectedFrame(frame)}
                                            className={`w-full h-auto object-cover rounded-lg cursor-pointer border-4 transition-all duration-200 ${selectedFrame?.id === frame.id ? 'border-scout-yellow' : 'border-transparent hover:border-scout-yellow/50'}`} 
                                        />
                                        {isAdmin && (
                                            <div className="absolute top-1 right-1 z-20 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingFrame(frame)} className="bg-scout-blue text-white rounded-full p-1.5 leading-none hover:bg-blue-700" title="Edit frame"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V12h2.293z"/></svg></button>
                                                <button onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete the frame "${frame.name}"?`)) {
                                                        deleteEventFrame(frame.id);
                                                        showNotification('Frame deleted successfully!');
                                                    }
                                                }} className="bg-red-600 text-white rounded-full p-1.5 leading-none hover:bg-red-700" title="Delete frame"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3V2h11v1z"/></svg></button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-scout-green dark:text-white">3. Adjust Your Photo</h2>
                                <button
                                    onClick={resetTransforms}
                                    disabled={!userImage}
                                    className="text-sm font-semibold text-scout-blue hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed transition-colors"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className={`space-y-4 ${!userImage ? 'opacity-50' : ''}`}>
                                <div>
                                    <label htmlFor="zoom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Zoom</label>
                                    <input
                                        type="range"
                                        id="zoom"
                                        min="0.5"
                                        max="3"
                                        step="0.01"
                                        value={zoom}
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        disabled={!userImage}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-scout-green disabled:cursor-not-allowed disabled:accent-gray-400"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rotation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rotate</label>
                                    <input
                                        type="range"
                                        id="rotation"
                                        min="0"
                                        max="360"
                                        step="1"
                                        value={rotation}
                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                        disabled={!userImage}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-scout-green disabled:cursor-not-allowed disabled:accent-gray-400"
                                    />
                                </div>
                            </div>
                            {!userImage && <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Upload a photo to adjust its position, zoom, and rotation.</p>}
                        </div>
                    </div>

                    {/* Right Side: Preview & Download */}
                    <div className="lg:sticky top-28">
                         <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-4">4. Preview & Download</h2>
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden relative">
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 flex flex-col items-center justify-center z-10">
                                        <div className="w-12 h-12 border-4 border-scout-yellow border-t-transparent rounded-full animate-spin"></div>
                                        <p className="mt-4 text-gray-600 dark:text-gray-300 font-semibold">Generating Image...</p>
                                    </div>
                                )}
                                <canvas
                                    ref={previewCanvasRef}
                                    width={PREVIEW_SIZE}
                                    height={PREVIEW_SIZE}
                                    className={`w-full h-full object-contain touch-none ${userImage ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUpOrLeave}
                                    onMouseLeave={handleMouseUpOrLeave}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                />
                            </div>
                            <button
                                onClick={handleDownload}
                                disabled={!userImage || isProcessing}
                                className="mt-6 w-full bg-scout-yellow text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100 hover:bg-yellow-400 transform hover:scale-105"
                            >
                                {isProcessing ? 'Processing...' : 'Download Photo (HD)'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isAddModalOpen && <AddFrameModal onClose={() => setIsAddModalOpen(false)} />}
            {editingFrame && <EditFrameModal frame={editingFrame} onClose={() => setEditingFrame(null)} />}
        </div>
    );
};

export default EventFramesPage;