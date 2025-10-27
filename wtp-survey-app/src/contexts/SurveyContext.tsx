import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SurveyData, Choice, APPS, INITIAL_TOKENS, AppName, TOKEN_AMOUNTS } from '../types/survey';

interface SurveyContextType {
  surveyData: SurveyData;
  setParticipantId: (id: string) => void;
  setComprehensionAnswer: (field: 'tokenValue' | 'rewardType', value: string) => void;
  addChoice: (choice: Choice) => void;
  removeChoice: (app: AppName, tokenAmount: number) => void;
  selectRandomChoice: () => Choice;
  updateTokenBalance: (amount: number) => void;
  completeSurvey: () => void;
  resetSurvey: () => void;
  setSwitchingPoint: (app: AppName, tokenAmount: number, switchedTo: 'tokens' | 'limit') => void;
  confirmSwitchingPoint: (app: AppName) => void;
  autoFillChoices: (app: AppName) => void;
  clearAutoFilledChoices: (app: AppName) => void;
  hasSwitchingPoint: (app: AppName) => boolean;
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
  tokenOrder: Math.random() < 0.5 ? 'ascending' : 'descending',
  choices: [],
  selectedChoice: null,
  completedAt: null,
  tokenBalance: INITIAL_TOKENS,
  comprehensionAnswers: {
    tokenValue: '',
    rewardType: '',
  },
  switchingPoints: {},
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
    setSurveyData(prev => {
      // Check if a choice with the same app and tokenAmount already exists
      const existingIndex = prev.choices.findIndex(
        c => c.app === choice.app && c.tokenAmount === choice.tokenAmount
      );

      if (existingIndex !== -1) {
        // Update existing choice
        const updatedChoices = [...prev.choices];
        updatedChoices[existingIndex] = choice;
        return { ...prev, choices: updatedChoices };
      } else {
        // Add new choice
        return { ...prev, choices: [...prev.choices, choice] };
      }
    });
  };

  const removeChoice = (app: AppName, tokenAmount: number) => {
    setSurveyData(prev => ({
      ...prev,
      choices: prev.choices.filter(
        choice => !(choice.app === app && choice.tokenAmount === tokenAmount)
      ),
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

  const setSwitchingPoint = (app: AppName, tokenAmount: number, switchedTo: 'tokens' | 'limit') => {
    setSurveyData(prev => ({
      ...prev,
      switchingPoints: {
        ...prev.switchingPoints,
        [app]: {
          tokenAmount,
          switchedTo,
          confirmed: false,
        },
      },
    }));
  };

  const confirmSwitchingPoint = (app: AppName) => {
    setSurveyData(prev => {
      const switchingPoint = prev.switchingPoints[app];
      if (!switchingPoint) return prev;

      return {
        ...prev,
        switchingPoints: {
          ...prev.switchingPoints,
          [app]: {
            ...switchingPoint,
            confirmed: true,
          },
        },
      };
    });
  };

  const autoFillChoices = (app: AppName) => {
    setSurveyData(prev => {
      const switchingPoint = prev.switchingPoints[app];
      if (!switchingPoint || !switchingPoint.confirmed) return prev;

      // Get the order of token amounts based on survey order
      const orderedTokenAmounts = prev.tokenOrder === 'ascending'
        ? [...TOKEN_AMOUNTS].reverse()
        : TOKEN_AMOUNTS;

      // Find the index of the switching point
      const switchIndex = orderedTokenAmounts.findIndex(amt => amt === switchingPoint.tokenAmount);
      if (switchIndex === -1) return prev;

      // Get all token amounts after the switching point
      const remainingTokenAmounts = orderedTokenAmounts.slice(switchIndex + 1);

      // Create auto-filled choices for remaining token amounts
      const autoFilledChoices: Choice[] = remainingTokenAmounts.map(tokenAmount => ({
        id: `${app}-${tokenAmount}-${Date.now()}-autofilled`,
        app,
        tokenAmount,
        selectedOption: switchingPoint.switchedTo,
        timestamp: new Date().toISOString(),
        autoFilled: true,
      }));

      // Add auto-filled choices to existing choices
      return {
        ...prev,
        choices: [...prev.choices, ...autoFilledChoices],
      };
    });
  };

  const clearAutoFilledChoices = (app: AppName) => {
    setSurveyData(prev => ({
      ...prev,
      choices: prev.choices.filter(choice => !(choice.app === app && choice.autoFilled)),
      switchingPoints: {
        ...prev.switchingPoints,
        [app]: undefined,
      },
    }));
  };

  const hasSwitchingPoint = (app: AppName): boolean => {
    return !!surveyData.switchingPoints[app]?.confirmed;
  };

  return (
    <SurveyContext.Provider
      value={{
        surveyData,
        setParticipantId,
        setComprehensionAnswer,
        addChoice,
        removeChoice,
        selectRandomChoice,
        updateTokenBalance,
        completeSurvey,
        resetSurvey,
        setSwitchingPoint,
        confirmSwitchingPoint,
        autoFillChoices,
        clearAutoFilledChoices,
        hasSwitchingPoint,
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
