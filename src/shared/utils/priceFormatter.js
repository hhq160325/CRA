/* Format price to Vietnamese locale string */
export const formatPrice = (price) => {
  const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  return numPrice.toLocaleString('vi-VN');
};

/* Format price with currency symbol */
export const formatPriceWithCurrency = (price, currency = '₫') => {
  return `${formatPrice(price)} ${currency}`;
};
