import { useSelector } from 'react-redux';

export const useCurrency = () => {
  // Read currency preference from settings state, fallback to USD
  const currency = useSelector((state) => state.settings.preferences?.currency) || 'USD';

  const symbolMap = {
    USD: '$',
    EUR: '€',
    TRY: '₺'
  };

  const currencySymbol = symbolMap[currency] || '$';

  const formatCurrency = (val) => {
    const localeMap = {
      USD: 'en-US',
      EUR: 'de-DE',
      TRY: 'tr-TR'
    };

    const locale = localeMap[currency] || 'en-US';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  return { formatCurrency, currency, currencySymbol };
};

export default useCurrency;
