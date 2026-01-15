/**
 * Utility functions for car rental pricing calculations
 */

/**
 * Calculate recommended rental price based on car type and year of manufacture
 * @param {Object} carData - Car data from step 1
 * @param {string} carData.modelId - Model ID
 * @param {string} carData.manufacturerId - Manufacturer ID
 * @param {string} carData.yearOfManufacture - Year of manufacture
 * @param {string} carData.model - Model name
 * @returns {Object|null} Price range object or null if insufficient data
 */
export const calculateRecommendedPrice = (carData) => {
    // console.log('calculateRecommendedPrice called with:', carData);
    
    if (!carData || !carData.yearOfManufacture) {
        // console.log('Missing required data for pricing calculation');
        return null;
    }

    // Base prices for different car types
    const basePrices = {
        'Standard': 500000,
        'Economy': 300000,
        'Economic': 300000,
        'Luxury': 1500000
    };

    // Get sizeClass from the carData directly (it should be in the passed data)
    let sizeClass = carData.sizeClass || 'Standard'; // default
    
    // console.log('Using sizeClass:', sizeClass);

    // If still no sizeClass found, use fallback mapping based on model name
    // if (sizeClass === 'Standard' && carData.model) {
    //     const typeMapping = {
    //         'sedan': 'Standard',
    //         'hatchback': 'Economic',
    //         'suv': 'Luxury',
    //         'luxury': 'Luxury',
    //         'economy': 'Economic',
    //         'economic': 'Economic',
    //         'compact': 'Economic',
    //         'mini': 'Economic',
    //         'crossover': 'Standard',
    //         'coupe': 'Luxury',
    //         'convertible': 'Luxury',
    //         'sports': 'Luxury',
    //         'truck': 'Standard',
    //         'van': 'Standard'
    //     };
        
    //     const modelLower = carData.model.toLowerCase();
    //     for (const [key, value] of Object.entries(typeMapping)) {
    //         if (modelLower.includes(key)) {
    //             sizeClass = value;
    //             break;
    //         }
    //     }
    // }

    const basePrice = basePrices[sizeClass] || basePrices['Standard'];
    const currentYear = new Date().getFullYear();
    const carYear = parseInt(carData.yearOfManufacture);
    
    // console.log('Base price:', basePrice, 'Car year:', carYear, 'Current year:', currentYear);
    
    // Validate car year
    if (isNaN(carYear) || carYear < 1900 || carYear > currentYear + 1) {
        // console.log('Invalid car year:', carYear);
        return null;
    }
    
    // Calculate depreciation factor using exponential decay
    const age = currentYear - carYear;
    // Each year lost ~7%
    let yearFactor = Math.pow(0.93, age);
    // New
    if (age <= 1) yearFactor *= 1.2;
    // Reasonable rental limits
    yearFactor = Math.min(Math.max(yearFactor, 0.7), 1.3);

    const recommendedPrice = Math.round(basePrice * yearFactor);
    const minPrice = Math.round(recommendedPrice * 0.8);
    const maxPrice = Math.round(recommendedPrice * 1.2);

    // console.log('Final calculation:', {
    //     basePrice,
    //     yearFactor,
    //     recommendedPrice,
    //     minPrice,
    //     maxPrice,
    //     carType: sizeClass
    // });

    return {
        min: minPrice,
        max: maxPrice,
        recommended: recommendedPrice,
        carType: sizeClass
    };
};

/**
 * Format price to Vietnamese locale string
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
export const formatPriceVN = (price) => {
    return price.toLocaleString('de-DE');
};