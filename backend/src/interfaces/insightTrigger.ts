export interface InsightTrigger {
    type: 'mood' | 'stress' | 'sleep' | 'activity';
    condition: 'below' | 'above' | 'stable';
    value: number | string;
  }