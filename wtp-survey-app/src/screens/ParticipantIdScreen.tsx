import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useSurvey } from '../contexts/SurveyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import { AudioPlayer } from '../components/AudioPlayer';
import audioW1 from '../assets/audio_files/w1.mp3';

interface ParticipantIdScreenProps {
  onNext: () => void;
}

export const ParticipantIdScreen: React.FC<ParticipantIdScreenProps> = ({ onNext }) => {
  const [id, setId] = useState('');
  const { setParticipantId, resetSurvey } = useSurvey();
  const { language } = useLanguage();

  const handleSubmit = async () => {
    if (id.trim()) {
      // Clear any existing survey data before starting with new participant
      await resetSurvey();
      setParticipantId(id.trim());
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            {t('participantId.title', language)}
          </h1>
          <AudioPlayer audioSrc={audioW1} />
        </div>
        <p className="text-gray-600 mb-6 text-center">
          {t('participantId.description', language)}
        </p>
        <div className="mb-6">
          <label htmlFor="participantId" className="block text-sm font-medium text-gray-700 mb-2">
            {t('participantId.label', language)}
          </label>
          <input
            id="participantId"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('participantId.placeholder', language)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!id.trim()}
          className="w-full"
        >
          {t('common.continue', language)}
        </Button>
      </div>
    </div>
  );
};
