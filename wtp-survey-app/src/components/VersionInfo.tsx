import React from 'react';
import { APP_VERSION } from '../version';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';

export const VersionInfo: React.FC = () => {
  const { language } = useLanguage();

  const handleRefresh = () => {
    // Clear localStorage
    localStorage.clear();

    // Force hard refresh with cache clearing
    // Using multiple techniques to ensure cache is cleared across different browsers
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 text-gray-400 text-sm">
      <span>{APP_VERSION}</span>
      <button
        onClick={handleRefresh}
        className="hover:text-gray-600 transition-colors p-1"
        title={t('versionInfo.refreshTitle', language)}
        aria-label={t('versionInfo.refreshLabel', language)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
      </button>
    </div>
  );
};
