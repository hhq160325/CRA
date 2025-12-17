import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../style/VerificationModal.css';

const VerificationModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger animation after modal is visible
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleUploadLicense = () => {
    onClose();
    navigate('/profile'); // Navigate to profile page where users can upload their license
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div 
      className={`verification-modal-backdrop ${isAnimating ? 'open' : 'closed'}`}
      onClick={handleClose}
    >
      <div 
        className={`verification-modal-container ${isAnimating ? 'open' : 'closed'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="verification-modal-content">
          {/* Icon */}
          <div className={`verification-modal-icon ${isAnimating ? 'open' : 'closed'}`}>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className={`verification-modal-title ${isAnimating ? 'open' : 'closed'}`}>
            {t('verificationRequired')}
          </h3>

          {/* Message */}
          <p className={`verification-modal-message ${isAnimating ? 'open' : 'closed'}`}>
            {t('verificationRequiredMessage')}
          </p>

          {/* Buttons */}
          <div className={`verification-modal-buttons ${isAnimating ? 'open' : 'closed'}`}>
            <button
              onClick={handleUploadLicense}
              className="verification-modal-button verification-modal-button-primary"
            >
              {t('uploadDriverLicense')}
            </button>
            <button
              onClick={handleClose}
              className="verification-modal-button verification-modal-button-secondary"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;