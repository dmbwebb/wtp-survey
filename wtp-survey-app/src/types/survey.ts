export type AppName = 'TikTok' | 'WhatsApp';

export interface Choice {
  id: string;
  app: AppName;
  tokenAmount: number;
  selectedOption: 'tokens' | 'block' | null;
  timestamp: string;
}

export interface SurveyData {
  participantId: string;
  startedAt: string;
  appOrder: AppName[];
  choices: Choice[];
  selectedChoice: Choice | null;
  completedAt: string | null;
  tokenBalance: number;
  comprehensionAnswers: {
    tokenValue: string;
    rewardType: string;
  };
}

export const TOKEN_AMOUNTS = [10, 5, 3, 2, 0, -2, -5] as const;
export const APPS: AppName[] = ['TikTok', 'WhatsApp'];
export const TOKEN_VALUE_COP = 1000;
export const INITIAL_TOKENS = 10;
