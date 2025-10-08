import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterCarStep3 = () => {
    const navigate = useNavigate();
    const [uploadedPhotos, setUploadedPhotos] = useState([]);

    const handleReturn = () => {
        navigate('/register-car/step-2');
    };

    const handleNext = () => {
        // TODO: Complete registration process
        console.log('Complete registration - implement final submission');
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        // TODO: Handle file upload logic
        console.log('Files selected:', files);
        setUploadedPhotos(prev => [...prev, ...files]);
    };

    const triggerFileUpload = () => {
        document.getElementById('photo-upload').click();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="relative flex items-center mb-8">
                    <button
                        onClick={handleReturn}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Return
                    </button>
                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-900">Register Car</h1>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">
                            1
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                        <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">
                            2
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-medium">
                            3
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {/* Photos Section */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Photos
                        </label>
                        <p className="text-xs text-gray-500 mb-6">
                            Select high-quality photos from different angles to attract customers.
                        </p>

                        {/* Upload Area */}
                        <div className="mb-8">
                            <div 
                                onClick={triggerFileUpload}
                                className="w-48 h-32 bg-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                            >
                                <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center mb-2">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <button className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition-colors">
                                    Upload
                                </button>
                            </div>
                            
                            {/* Hidden file input */}
                            <input
                                id="photo-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Uploaded Photos Preview */}
                        {uploadedPhotos.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {uploadedPhotos.map((photo, index) => (
                                    <div key={index} className="relative">
                                        <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <span className="text-xs text-gray-500">{photo.name}</span>
                                        </div>
                                        <button 
                                            onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== index))}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleReturn}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Return
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-medium cursor-not-allowed"
                            disabled
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCarStep3;