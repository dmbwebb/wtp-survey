import React from 'react';
import { Button } from '../components/Button';
import { TokenCounter } from '../components/TokenCounter';
import tiktokLogo from '../assets/tiktok-logo.png';
import whatsappLogo from '../assets/whatsapp-logo.png';

interface AppIntroductionScreenProps {
  app: string;
  onNext: () => void;
  onBack: () => void;
}

export const AppIntroductionScreen: React.FC<AppIntroductionScreenProps> = ({ app, onNext, onBack }) => {
  const appLogo = app === 'TikTok' ? tiktokLogo : whatsappLogo;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="w-full flex justify-end mb-4">
        <TokenCounter />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src={appLogo}
            alt={`${app} logo`}
            className="w-24 h-24 mb-6 object-contain"
          />
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            App Blocking Questions: {app}
          </h1>
        </div>
        <div className="space-y-4 text-gray-700 text-lg leading-relaxed mb-8">
          <p className="text-center">
            We're now going to ask you some questions to see how willing you would be to block <strong className="font-bold">{app}</strong> for 1 week on your phone.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={onBack} className="px-6">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};
