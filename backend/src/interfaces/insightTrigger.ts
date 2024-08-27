export interface InsightTrigger {
    type: 'mood' | 'stress' | 'sleep' | 'activity';
    condition: 'below' | 'above' | 'equal';
    value: number | string;
  }