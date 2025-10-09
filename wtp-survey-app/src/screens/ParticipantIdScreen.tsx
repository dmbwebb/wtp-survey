import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useSurvey } from '../contexts/SurveyContext';

interface ParticipantIdScreenProps {
  onNext: () => void;
}

export const ParticipantIdScreen: React.FC<ParticipantIdScreenProps> = ({ onNext }) => {
  const [id, setId] = useState('');
  const { setParticipantId, resetSurvey } = useSurvey();

  const handleSubmit = () => {
    if (id.trim()) {
      // Clear any existing survey data before starting with new participant
      resetSurvey();
      setParticipantId(id.trim());
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Welcome to the Survey
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Please enter your participant ID to begin.
        </p>
        <div className="mb-6">
          <label htmlFor="participantId" className="block text-sm font-medium text-gray-700 mb-2">
            Participant ID
          </label>
          <input
            id="participantId"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter your ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!id.trim()}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
