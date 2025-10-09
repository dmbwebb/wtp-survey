import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-1 text-sm bg-white rounded-lg shadow-md px-3 py-2">
      <button
        onClick={() => setLanguage('es')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'es'
            ? 'bg-blue-600 text-white font-semibold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        ES
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white font-semibold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        EN
      </button>
    </div>
  );
};
