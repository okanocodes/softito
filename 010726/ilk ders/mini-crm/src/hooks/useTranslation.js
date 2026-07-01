import { useSelector } from 'react-redux';
import { translations } from '../utils/translations';

export const useTranslation = () => {
  // Read language preference from settings state, fallback to TR
  const language = useSelector((state) => state.settings.preferences?.language) || 'tr';
  
  const t = (key) => {
    return translations[language]?.[key] || translations['tr']?.[key] || key;
  };

  return { t, language };
};

export default useTranslation;
