import { firestore } from 'firebase-admin';
import { Insight } from '../interfaces/insight';
import { Averages } from '../interfaces/averages';
import { InsightConditionEnum } from '../enums/insightConditionEnum';

/**
 * Fetches personalized insights from the database.
 * @returns Promise of an array of personalized insights.
 */
export async function getPersonalizedInsights(): Promise<Insight[]> {
  const insightsRef = firestore().collection('personalizedinsights');
  const snapshot = await insightsRef.get();
  if (snapshot.empty) {
    return [];
  }

  const insights: Insight[] = [];
  snapshot.forEach(doc => insights.push({ ...doc.data() as Insight }));

  return insights;
}

/**
 * Evaluates which insights should be displayed based on user data.
 * @param averages - Averages of the user's check-in data.
 * @param insights - Array of insights to evaluate.
 * @returns Array of applicable insights.
 */
export function evaluateInsights(averages: Averages, insights: Insight[]): Insight[] {
  if (averages.activity === 0) {
    return [];
  }

  return insights
    .filter(insight => {
      const { trigger } = insight;

      let conditionEnum: InsightConditionEnum;

      switch (trigger.condition) {
        case 'above':
          conditionEnum = InsightConditionEnum.above;
          break;
        case 'below':
          conditionEnum = InsightConditionEnum.below;
          break;
        case 'equals':
          conditionEnum = InsightConditionEnum.equals;
          break;
        default:
          return false;
      }

      return evaluateCondition(averages[trigger.type], conditionEnum, Number(trigger.value));
    })
    .sort((a, b) => {
      const aValue = Number(a.trigger.value);
      const bValue = Number(b.trigger.value);
      return Math.abs(averages[a.trigger.type] - aValue) - Math.abs(averages[b.trigger.type] - bValue);
    })
    .slice(0, 1); // Take only the closest match
}

/**
 * Evaluates whether a condition is met based on the given value and condition.
 * @param averageValue - The average value to compare against.
 * @param condition - The condition to evaluate.
 * @param triggerValue - The value to compare with.
 * @returns Boolean indicating whether the condition is met.
 */
function evaluateCondition(averageValue: number, condition: InsightConditionEnum, triggerValue: number): boolean {
  switch (condition) {
    case InsightConditionEnum.above:
      return averageValue > triggerValue;
    case InsightConditionEnum.below:
      return averageValue < triggerValue;
    case InsightConditionEnum.equals:
      return Math.abs(averageValue - Number(triggerValue)) < 0.5;
    default:
      return false;
  }
}
