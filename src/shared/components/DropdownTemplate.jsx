import { useState, useEffect, useRef } from 'react';

/**
 * Reusable Dropdown Component with Search
 * @param {Object} props
 * @param {string} props.value - Current selected value
 * @param {Function} props.onChange - Callback when selection changes
 * @param {Array} props.options - Array of options {id, label, value}
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.searchable - Enable search functionality
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {boolean} props.loading - Show loading state
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disable dropdown
 * @param {Function} props.renderOption - Custom option renderer
 * @param {Function} props.renderSelected - Custom selected value renderer
 */
const DropdownTemplate = ({
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    searchable = false,
    searchPlaceholder = 'Search...',
    loading = false,
    className = '',
    disabled = false,
    renderOption = null,
    renderSelected = null
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const searchInputRef = useRef(null);

    // Update filtered options when options or search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredOptions(options);
        } else {
            const filtered = options.filter(option =>
                option.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredOptions(filtered);
        }
    }, [searchQuery, options]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Find selected option
    const selectedOption = options.find(opt => opt.value === value);

    // Default option renderer
    const defaultRenderOption = (option) => (
        <div className="flex items-center">
            {option.icon && <span className="mr-2">{option.icon}</span>}
            <span>{option.label}</span>
        </div>
    );

    // Default selected value renderer
    const defaultRenderSelected = (option) => (
        <span className={option ? 'text-gray-900' : 'text-gray-400'}>
            {option ? option.label : placeholder}
        </span>
    );

    return (
        <div className={`relative ${className}`}>
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={`w-full px-4 py-2 pr-10 border rounded-lg bg-white text-left transition-colors ${
                    disabled 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
                } ${isOpen ? 'border-blue-500' : 'border-gray-300'}`}
            >
                {renderSelected ? renderSelected(selectedOption) : defaultRenderSelected(selectedOption)}
            </button>

            {/* Dropdown Arrow */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={handleClose}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                        {/* Search Box */}
                        {searchable && (
                            <div className="p-3 border-b border-gray-200">
                                <div className="relative">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={searchPlaceholder}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <svg 
                                        className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Options List */}
                        <div className="max-h-60 overflow-y-auto">
                            {loading ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    Loading...
                                </div>
                            ) : filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.id || option.value}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                                            value === option.value 
                                                ? 'bg-gray-50 text-gray-900 font-medium' 
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {renderOption ? renderOption(option) : defaultRenderOption(option)}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    No options found
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DropdownTemplate;
