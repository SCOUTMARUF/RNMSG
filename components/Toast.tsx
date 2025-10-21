import React from 'react';
import { useNotification } from '../contexts/NotificationContext';

const Toast: React.FC = () => {
    const { notification, hideNotification } = useNotification();

    if (!notification) {
        return null;
    }

    const isSuccess = notification.type === 'success';

    return (
        <div
            className="fixed top-20 right-5 z-[200] flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white dark:bg-gray-800 divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-700 rounded-lg shadow-lg animate-slideIn"
            role="alert"
        >
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${isSuccess ? 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200' : 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200'} rounded-lg`}>
                {isSuccess ? (
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                    </svg>
                ) : (
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
                    </svg>
                )}
                <span className="sr-only">{isSuccess ? 'Success icon' : 'Error icon'}</span>
            </div>
            <div className="ps-4 text-sm font-normal text-gray-700 dark:text-gray-300">{notification.message}</div>
            <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex items-center justify-center h-8 w-8"
                onClick={hideNotification}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
    );
};

export default Toast;