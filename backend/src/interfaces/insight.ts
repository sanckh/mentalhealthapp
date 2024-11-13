import { InsightTrigger } from "./insightTrigger";

export interface Insight {
    id: string;
    title: string;
    description: string;
    trigger: InsightTrigger;
    icon: string;
    category: string;
    moreInformation: string;
  }