import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SurveyData, Choice, AppName, APPS, INITIAL_TOKENS } from '../types/survey';

interface SurveyContextType {
  surveyData: SurveyData;
  setParticipantId: (id: string) => void;
  setComprehensionAnswer: (field: 'tokenValue' | 'rewardType', value: string) => void;
  addChoice: (choice: Choice) => void;
  selectRandomChoice: () => Choice;
  updateTokenBalance: (amount: number) => void;
  completeSurvey: () => void;
  resetSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createInitialSurveyData = (): SurveyData => ({
  participantId: '',
  startedAt: new Date().toISOString(),
  appOrder: shuffleArray(APPS),
  choices: [],
  selectedChoice: null,
  completedAt: null,
  tokenBalance: INITIAL_TOKENS,
  comprehensionAnswers: {
    tokenValue: '',
    rewardType: '',
  },
});

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyData>(() => {
    const saved = localStorage.getItem('surveyData');
    return saved ? JSON.parse(saved) : createInitialSurveyData();
  });

  useEffect(() => {
    localStorage.setItem('surveyData', JSON.stringify(surveyData));
  }, [surveyData]);

  const setParticipantId = (id: string) => {
    setSurveyData(prev => ({ ...prev, participantId: id }));
  };

  const setComprehensionAnswer = (field: 'tokenValue' | 'rewardType', value: string) => {
    setSurveyData(prev => ({
      ...prev,
      comprehensionAnswers: {
        ...prev.comprehensionAnswers,
        [field]: value,
      },
    }));
  };

  const addChoice = (choice: Choice) => {
    setSurveyData(prev => ({
      ...prev,
      choices: [...prev.choices, choice],
    }));
  };

  const selectRandomChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * surveyData.choices.length);
    const selected = surveyData.choices[randomIndex];
    setSurveyData(prev => ({ ...prev, selectedChoice: selected }));
    return selected;
  };

  const updateTokenBalance = (amount: number) => {
    setSurveyData(prev => ({ ...prev, tokenBalance: prev.tokenBalance + amount }));
  };

  const completeSurvey = () => {
    setSurveyData(prev => ({ ...prev, completedAt: new Date().toISOString() }));
  };

  const resetSurvey = () => {
    setSurveyData(createInitialSurveyData());
    localStorage.removeItem('surveyData');
  };

  return (
    <SurveyContext.Provider
      value={{
        surveyData,
        setParticipantId,
        setComprehensionAnswer,
        addChoice,
        selectRandomChoice,
        updateTokenBalance,
        completeSurvey,
        resetSurvey,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
