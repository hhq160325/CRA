// Vietnamese License Plate Validation Utility

/**
 * Vietnam license plate formats:
 * - Old format: 29A-12345 (2 digits + 1 letter + 4-5 digits)
 * - New format: 29A-123.45 (2 digits + 1 letter + 3 digits + dot + 2 digits)
 * - Motorcycle: 29-A1 12345 (2 digits + dash + letter + digit + space + 5 digits)
 * - Special vehicles: Various formats with specific prefixes
 */

// Province codes (first 2 digits)
const PROVINCE_CODES = {
  '11': 'Cao Bằng', '12': 'Lạng Sơn', '14': 'Quảng Ninh', '15': 'Hải Phòng',
  '16': 'Hải Dương', '17': 'Thái Bình', '18': 'Nam Định', '19': 'Phú Thọ',
  '20': 'Thái Nguyên', '21': 'Yên Bái', '22': 'Tuyên Quang', '23': 'Hà Giang',
  '24': 'Lào Cai', '25': 'Lai Châu', '26': 'Sơn La', '27': 'Điện Biên',
  '28': 'Hòa Bình', '29': 'Hà Nội', '30': 'Hà Nam', '31': 'Ninh Bình',
  '32': 'Thanh Hóa', '33': 'Nghệ An', '34': 'Hà Tĩnh', '35': 'Quảng Bình',
  '36': 'Quảng Trị', '37': 'Thừa Thiên Huế', '38': 'Đà Nẵng',
  '43': 'Quảng Nam', '47': 'Đắk Lắk', '49': 'Lâm Đồng',
  '50': 'Hồ Chí Minh', '51': 'Đồng Nai', '52': 'Bà Rịa - Vũng Tàu',
  '53': 'Long An', '54': 'Tiền Giang', '55': 'Bến Tre', '56': 'Vĩnh Long',
  '57': 'Trà Vinh', '58': 'Cần Thơ', '59': 'Đồng Tháp', '60': 'An Giang',
  '61': 'Kiên Giang', '62': 'Cà Mau', '63': 'Tây Ninh', '64': 'Bình Dương',
  '65': 'Bình Phước', '66': 'Bình Thuận', '67': 'Ninh Thuận',
  '68': 'Gia Lai', '69': 'Đắk Nông', '70': 'Kon Tum', '71': 'Quảng Ngãi',
  '72': 'Bình Định', '73': 'Phú Yên', '74': 'Khánh Hòa', '75': 'Đắk Nông',
  '76': 'Sóc Trăng', '77': 'Hậu Giang', '79': 'Bạc Liêu', '80': 'Bắc Kạn',
  '81': 'Bắc Giang', '82': 'Bắc Ninh', '83': 'Hưng Yên', '85': 'Vĩnh Phúc',
  '86': 'Hà Tây', '88': 'Vĩnh Long', '89': 'Phú Thọ', '90': 'Hà Nam',
  '92': 'Quảng Ninh', '93': 'Bắc Giang', '94': 'Bắc Ninh', '95': 'Hải Dương',
  '97': 'Hà Nội', '98': 'Hà Nội', '99': 'Hà Nội'
};

/**
 * Validate Vietnamese license plate format
 * @param {string} plate - License plate string
 * @returns {object} - { isValid: boolean, format: string, message: string }
 */
export const validateLicensePlate = (plate) => {
  if (!plate || typeof plate !== 'string') {
    return { isValid: false, format: null, message: 'License plate is required' };
  }

  // Remove extra spaces and convert to uppercase
  const cleanPlate = plate.trim().toUpperCase().replace(/\s+/g, '');

  // Car format patterns
  const carOldFormat = /^(\d{2})([A-Z]{1})[-]?(\d{4,5})$/; // 29A-12345 or 29A12345
  const carNewFormat = /^(\d{2})([A-Z]{1})[-]?(\d{3})\.(\d{2})$/; // 29A-123.45 or 29A123.45

  // Check car old format
  const oldMatch = cleanPlate.match(carOldFormat);
  if (oldMatch) {
    const [, provinceCode, letter, numbers] = oldMatch;
    
    if (!PROVINCE_CODES[provinceCode]) {
      return { 
        isValid: false, 
        format: 'old', 
        message: 'Invalid province code' 
      };
    }

    return {
      isValid: true,
      format: 'old',
      message: 'Valid license plate (old format)',
      provinceCode,
      province: PROVINCE_CODES[provinceCode],
      formatted: `${provinceCode}${letter}-${numbers}`
    };
  }

  // Check car new format
  const newMatch = cleanPlate.match(carNewFormat);
  if (newMatch) {
    const [, provinceCode, letter, firstPart, secondPart] = newMatch;
    
    if (!PROVINCE_CODES[provinceCode]) {
      return { 
        isValid: false, 
        format: 'new', 
        message: 'Invalid province code' 
      };
    }

    return {
      isValid: true,
      format: 'new',
      message: 'Valid license plate (new format)',
      provinceCode,
      province: PROVINCE_CODES[provinceCode],
      formatted: `${provinceCode}${letter}-${firstPart}.${secondPart}`
    };
  }

  return {
    isValid: false,
    format: null,
    message: 'Invalid license plate format. Expected format: 29A-12345 or 29A-123.45'
  };
};

/**
 * Format license plate with proper separators
 * @param {string} plate - License plate string
 * @returns {string} - Formatted license plate
 */
export const formatLicensePlate = (plate) => {
  const validation = validateLicensePlate(plate);
  return validation.isValid ? validation.formatted : plate;
};

/**
 * Get province name from license plate
 * @param {string} plate - License plate string
 * @returns {string|null} - Province name or null
 */
export const getProvinceFromPlate = (plate) => {
  const validation = validateLicensePlate(plate);
  return validation.isValid ? validation.province : null;
};

/**
 * Check if province code is valid
 * @param {string} code - Province code (2 digits)
 * @returns {boolean}
 */
export const isValidProvinceCode = (code) => {
  return PROVINCE_CODES.hasOwnProperty(code);
};

/**
 * Get all province codes
 * @returns {object} - Object with province codes and names
 */
export const getProvinceCodes = () => {
  return { ...PROVINCE_CODES };
};
