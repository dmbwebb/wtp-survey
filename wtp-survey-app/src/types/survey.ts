export type AppName = 'TikTok' | 'WhatsApp';
export type TokenOrder = 'ascending' | 'descending';

export interface Choice {
  id: string;
  app: AppName;
  tokenAmount: number;
  selectedOption: 'tokens' | 'limit' | null;
  timestamp: string;
  autoFilled?: boolean; // Indicates if this choice was auto-filled after switching point
}

export interface SwitchingPoint {
  tokenAmount: number;
  switchedTo: 'tokens' | 'limit';
  confirmed: boolean;
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
  switchingPoints: {
    [app in AppName]?: SwitchingPoint;
  };
}

export const TOKEN_AMOUNTS = [5, 2, 0, -1, -2, -5, -8, -10] as const;
export const APPS: AppName[] = ['TikTok', 'WhatsApp'];
export const TOKEN_VALUE_COP = 1000;
export const INITIAL_TOKENS = 10;

// Sync and storage types
export interface SyncStatus {
  pending: number;
  synced: number;
  failed: number;
  lastSyncAttempt: string | null;
  lastSuccessfulSync: string | null;
}
