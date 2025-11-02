import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AudioPlayerProps {
  audioSrc: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, className = '' }) => {
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Only create audio element if language is Spanish
    if (language !== 'es') {
      return;
    }

    // Create audio element
    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    // Set up event listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Try to autoplay
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        // Autoplay blocked by browser - user will need to click
        console.log('Autoplay blocked, waiting for user interaction');
      }
    };

    playAudio();

    // Cleanup on unmount
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, [audioSrc, language]);

  const handleReplay = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Don't render anything if language is not Spanish
  if (language !== 'es') {
    return null;
  }

  return (
    <button
      onClick={handleReplay}
      className={`inline-flex items-center justify-center p-2 rounded-full transition-all hover:bg-blue-50 ${
        isPlaying ? 'text-blue-600 bg-blue-50 animate-pulse' : 'text-gray-600 hover:text-blue-600'
      } ${className}`}
      aria-label="Reproducir audio"
      title="Reproducir audio"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
      >
        {isPlaying ? (
          // Speaker icon with sound waves when playing
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </>
        ) : (
          // Simple speaker icon when not playing
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
          />
        )}
      </svg>
    </button>
  );
};
