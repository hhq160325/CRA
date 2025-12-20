import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CarPhotoUpload = ({ 
    uploadedPhotos = [], 
    onPhotosChange, 
    error, 
    onErrorChange 
}) => {
    const { t, i18n } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const MAX_FILES_ALLOWED = 5; // 5 files maximum

    // Translate error when language changes
    useEffect(() => {
        if (error === "Please upload a photo of your valid driver's license." || error === "Vui lòng tải ảnh bằng lái hợp lệ") {
            onErrorChange(t('invalidImg'));
        } else if (error.includes('Invalid file type') || error.includes('Vui lòng tải lên ảnh hợp lệ')) {
            onErrorChange(t('invalidFileType'));
        } else if (error.includes('File size too large') || error.includes('Kích thước tệp quá lớn')) {
            onErrorChange(t('fileSizeTooLarge'));
        } else if (error.includes('Maximum') || error.includes('Tối đa')) {
            onErrorChange(t('maxFilesReached', { max: MAX_FILES_ALLOWED }));
        }
    }, [i18n.language, t, error, onErrorChange, MAX_FILES_ALLOWED]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        
        if (!files.length) return;

        // Check if adding these files would exceed the limit
        if (selectedFiles.length + files.length > MAX_FILES_ALLOWED) {
            onErrorChange(t('maxFilesReached', { max: MAX_FILES_ALLOWED }));
            return;
        }

        // Validate each file
        const validFiles = [];
        const newPreviewUrls = [];

        for (const file of files) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                onErrorChange(`${t('invalidFileType')}: ${file.name}`);
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                const fileSizeText = `${(file.size / 1024 / 1024).toFixed(2)}MB`;
                onErrorChange(`${t('fileSizeTooLarge')}: ${file.name} (${fileSizeText})`);
                return;
            }

            validFiles.push(file);
            newPreviewUrls.push(URL.createObjectURL(file));
        }

        // Update state with new files
        const updatedFiles = [...selectedFiles, ...validFiles];
        const updatedPreviews = [...previewUrls, ...newPreviewUrls];

        setSelectedFiles(updatedFiles);
        setPreviewUrls(updatedPreviews);

        // Create photos data for parent component
        const photosData = updatedFiles.map((file, index) => ({
            file: file,
            preview: updatedPreviews[index],
            name: file.name,
            size: file.size
        }));

        onPhotosChange(photosData);
        onErrorChange(''); // Clear any previous errors
    };

    const handleRemove = (index) => {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(previewUrls[index]);

        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        const updatedPreviews = previewUrls.filter((_, i) => i !== index);

        setSelectedFiles(updatedFiles);
        setPreviewUrls(updatedPreviews);

        // Update photos data for parent component
        const photosData = updatedFiles.map((file, i) => ({
            file: file,
            preview: updatedPreviews[i],
            name: file.name,
            size: file.size
        }));

        onPhotosChange(photosData);
        onErrorChange(''); // Clear any errors when removing files
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('photos')}
            </label>
            <p className="text-xs text-gray-500 mb-6">
                {t('photosDescription')}
            </p>

            {/* Upload Area */}
            <div className="mb-6">
                <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-700">
                            <span className="font-semibold">{t('clickToUpload')}</span> {t('orDragAndDrop')}
                        </p>
                        <p className="text-xs text-gray-500">{t('imageFormatsAccepted')}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {selectedFiles.length}/{MAX_FILES_ALLOWED} {t('filesSelected')}
                        </p>
                    </div>
                    <input
                        id="photo-upload"
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        multiple
                        onChange={handleFileSelect}
                        disabled={selectedFiles.length >= MAX_FILES_ALLOWED}
                    />
                </label>
            </div>

            {/* Preview Grid */}
            {selectedFiles.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">{t('selectedPhotos')}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                />
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                    {selectedFiles[index].name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Info Section */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">{t('importantInformation')}</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• {t('photoTip1')}</li>
                    <li>• {t('photoTip2')}</li>
                    <li>• {t('photoTip3')}</li>
                    <li>• {t('photoTip4')}</li>
                </ul>
            </div>
        </div>
    );
};

export default CarPhotoUpload;
