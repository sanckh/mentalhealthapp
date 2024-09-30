export interface InsightTrigger {
    type: 'mood' | 'stress' | 'sleep' | 'activity';
    condition: 'below' | 'above' | 'equals';
    value: number | string;
  }