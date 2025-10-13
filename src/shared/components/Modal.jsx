import React from 'react';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-3xl shadow-xl max-w-md w-full mx-auto transform transition-all ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Placeholder circle at top */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-300 rounded-full"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
