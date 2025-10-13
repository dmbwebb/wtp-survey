export type AppName = 'TikTok' | 'WhatsApp';
export type TokenOrder = 'ascending' | 'descending';

export interface Choice {
  id: string;
  app: AppName;
  tokenAmount: number;
  selectedOption: 'tokens' | 'limit' | null;
  timestamp: string;
}

export interface SurveyData {
  participantId: string;
  startedAt: string;
  appOrder: AppName[];
  tokenOrder: TokenOrder;
  choices: Choice[];
  selectedChoice: Choice | null;
  completedAt: string | null;
  tokenBalance: number;
  comprehensionAnswers: {
    tokenValue: string;
    rewardType: string;
  };
}

export const TOKEN_AMOUNTS = [5, 2, 1, 0, -1, -2, -5, -10] as const;
export const APPS: AppName[] = ['TikTok', 'WhatsApp'];
export const TOKEN_VALUE_COP = 1000;
export const INITIAL_TOKENS = 10;
