import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import './CarPhotoUpload.css';

// Register FilePond plugins
registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
);

const CarPhotoUpload = ({ 
    uploadedPhotos = [], 
    onPhotosChange, 
    error, 
    onErrorChange 
}) => {
    const { t, i18n } = useTranslation();
    const [files, setFiles] = useState([]);
    const errorTimeoutRef = useRef(null);
    const fileCountRef = useRef(0);
    const errorTypeRef = useRef(null); // Track error type
    const errorDataRef = useRef(null); // Track error data (filename, filesize)
    const MAX_FILES_ALLOWED = 10 - 4; // 6 files maximum

    useEffect(() => {
        return () => {
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
        };
    }, []);

    // Update error message when language changes
    useEffect(() => {
        if (error && errorTypeRef.current) {
            const errorType = errorTypeRef.current;
            const errorData = errorDataRef.current || {};
            
            if (errorType === 'maxFiles') {
                onErrorChange(t('maxFilesReached', { max: MAX_FILES_ALLOWED }));
            } else if (errorType === 'invalidType') {
                const fileName = errorData.fileName || '';
                onErrorChange(`${t('invalidFileType')}${fileName ? ': ' + fileName : ''}`);
            } else if (errorType === 'fileSize') {
                const fileName = errorData.fileName || '';
                const fileSizeText = errorData.fileSize ? ` (${errorData.fileSize})` : '';
                onErrorChange(`${t('fileSizeTooLarge')}${fileName ? ': ' + fileName : ''}${fileSizeText}`);
            }
        }
    }, [i18n.language, error, MAX_FILES_ALLOWED, onErrorChange, t]);

    const handleAddFile = (error, file) => {
        // Check if max files limit is reached using ref for accurate count
        if (fileCountRef.current >= MAX_FILES_ALLOWED) {
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
            errorTypeRef.current = 'maxFiles';
            errorDataRef.current = null;
            errorTimeoutRef.current = setTimeout(() => {
                onErrorChange(t('maxFilesReached', { max: MAX_FILES_ALLOWED }));
            }, 100);
            return false;
        }

        if (error) {
            // Clear any existing timeout
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }

            const fileName = file?.filename || file?.file?.name || '';
            const fileSize = file?.fileSize || file?.file?.size;
            const fileSizeText = fileSize ? `${(fileSize / 1024 / 1024).toFixed(2)}MB` : '';
            
            // Determine error type - check against both English and Vietnamese translations
            const errorMsg = error.main ? error.main.toLowerCase() : '';
            const invalidTypeEn = t('invalidFileType').toLowerCase();
            const fileSizeTooLargeEn = t('fileSizeTooLarge').toLowerCase();
            
            if (errorMsg.includes('type') || errorMsg.includes('file type') || 
                errorMsg.includes('tệp ảnh hợp lệ') || errorMsg.includes(invalidTypeEn)) {
                errorTypeRef.current = 'invalidType';
                errorDataRef.current = { fileName };
                errorTimeoutRef.current = setTimeout(() => {
                    onErrorChange(`${t('invalidFileType')}${fileName ? ': ' + fileName : ''}`);
                }, 100);
            } else if (errorMsg.includes('size') || errorMsg.includes('large') || 
                       errorMsg.includes('kích thước') || errorMsg.includes(fileSizeTooLargeEn)) {
                errorTypeRef.current = 'fileSize';
                errorDataRef.current = { fileName, fileSize: fileSizeText };
                errorTimeoutRef.current = setTimeout(() => {
                    onErrorChange(`${t('fileSizeTooLarge')}${fileName ? ': ' + fileName : ''}${fileSizeText ? ' (' + fileSizeText + ')' : ''}`);
                }, 100);
            } else {
                errorTypeRef.current = null;
                errorDataRef.current = null;
                errorTimeoutRef.current = setTimeout(() => {
                    if (error.main) {
                        onErrorChange(`${error.main}${fileName ? ': ' + fileName : ''}${fileSizeText ? ' (' + fileSizeText + ')' : ''}`);
                    } else if (error.body) {
                        onErrorChange(error.body);
                    }
                }, 100);
            }

            // Prevent file from being added
            return false;
        }
        
        // Increment count when file is successfully added
        fileCountRef.current += 1;
        errorTypeRef.current = null;
        errorDataRef.current = null;
        return true;
    };

    const handleUpdateFiles = (fileItems) => {
        // Filter out any items with errors
        const validItems = fileItems.filter(item => {
            return item.status !== 7 && item.status !== 8; // 7 = LOAD_ERROR, 8 = PROCESSING_ERROR
        });

        // Update the file count ref
        fileCountRef.current = validItems.length;

        // Check if exceeds max files and remove excess
        if (validItems.length > MAX_FILES_ALLOWED) {
            const limitedItems = validItems.slice(0, MAX_FILES_ALLOWED);
            setFiles(limitedItems);
            fileCountRef.current = MAX_FILES_ALLOWED;
            
            const photosData = limitedItems.map(fileItem => ({
                file: fileItem.file,
                preview: URL.createObjectURL(fileItem.file),
                name: fileItem.file.name,
                size: fileItem.file.size
            }));
            onPhotosChange(photosData);
            
            // Show error message immediately without timeout
            onErrorChange(t('maxFilesReached', { max: MAX_FILES_ALLOWED }) || `Maximum ${MAX_FILES_ALLOWED} files allowed`);
            return;
        }

        setFiles(validItems);
        
        // Only clear error and update photos if all files are valid
        if (validItems.length > 0) {
            const photosData = validItems.map(fileItem => ({
                file: fileItem.file,
                preview: URL.createObjectURL(fileItem.file),
                name: fileItem.file.name,
                size: fileItem.file.size
            }));
            
            onPhotosChange(photosData);
            
            // Don't clear error if it's a max files error
            if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current);
            }
            // Only clear error if we're not at max capacity
            if (validItems.length < MAX_FILES_ALLOWED) {
                onErrorChange('');
            }
        } else {
            onPhotosChange([]);
        }
    };

    const handleError = (error, file) => {
        // Clear any existing timeout
        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
        }

        const fileName = file?.filename || '';
        const fileSize = file?.fileSize;
        const fileSizeText = fileSize ? `${(fileSize / 1024 / 1024).toFixed(2)}MB` : '';

        // Determine error type from FilePond's warning
        if (error.main) {
            const errorMsg = error.main.toLowerCase();
            const invalidTypeEn = t('invalidFileType').toLowerCase();
            const fileSizeTooLargeEn = t('fileSizeTooLarge').toLowerCase();
            
            if (errorMsg.includes('type') || errorMsg.includes('file type') || 
                errorMsg.includes('tệp ảnh hợp lệ') || errorMsg.includes(invalidTypeEn)) {
                errorTypeRef.current = 'invalidType';
                errorDataRef.current = { fileName };
                errorTimeoutRef.current = setTimeout(() => {
                    onErrorChange(`${t('invalidFileType')}${fileName ? ': ' + fileName : ''}`);
                }, 300);
            } else if (errorMsg.includes('size') || errorMsg.includes('large') || 
                       errorMsg.includes('kích thước') || errorMsg.includes(fileSizeTooLargeEn)) {
                errorTypeRef.current = 'fileSize';
                errorDataRef.current = { fileName, fileSize: fileSizeText };
                errorTimeoutRef.current = setTimeout(() => {
                    onErrorChange(`${t('fileSizeTooLarge')}${fileName ? ': ' + fileName : ''}${fileSizeText ? ' (' + fileSizeText + ')' : ''}`);
                }, 300);
            } else {
                errorTypeRef.current = null;
                errorDataRef.current = null;
                errorTimeoutRef.current = setTimeout(() => {
                    onErrorChange(`${error.main}${fileName ? ': ' + fileName : ''}${fileSizeText ? ' (' + fileSizeText + ')' : ''}`);
                }, 300);
            }
        } else if (error.body) {
            errorTypeRef.current = null;
            errorDataRef.current = null;
            errorTimeoutRef.current = setTimeout(() => {
                onErrorChange(error.body);
            }, 300);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('photos')}
            </label>
            <p className="text-xs text-gray-500 mb-6">
                {t('photosDescription')}
            </p>

            {/* FilePond Upload Area */}
            <div className=" filepond-horizontal">
                <FilePond
                    files={files}
                    onupdatefiles={handleUpdateFiles}
                    onaddfile={handleAddFile}
                    onwarning={handleError}
                    allowMultiple={true}
                    maxFiles={10}
                    maxFileSize="5MB"
                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/jfif']}
                    instantUpload={false}
                    allowRevert={false}
                    allowProcess={false}
                    checkValidity={true}
                    itemInsertLocation="after"
                    labelIdle={`
                        <div class="flex flex-col items-center">
                            <svg class="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p class="mb-2 text-sm text-gray-700">
                                <span class="font-semibold">${t('clickToUpload')}</span> ${t('orDragAndDrop')}
                            </p>
                            <p class="text-xs text-gray-500">${t('imageFormatsAccepted')}</p>
                        </div>
                    `}
                    labelFileTypeNotAllowed={t('invalidFileType')}
                    fileValidateTypeLabelExpectedTypes={t('imageFormatsAccepted')}
                    labelMaxFileSizeExceeded={t('fileSizeTooLarge')}
                    labelMaxFileSize={t('maxFileSize', { size: '5MB' })}
                    credits={false}
                    stylePanelLayout="integrated"
                    imagePreviewHeight={100}
                    imageResizeTargetWidth={100}
                    imageResizeTargetHeight={100}
                />
            </div>

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
