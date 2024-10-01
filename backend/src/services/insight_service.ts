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
    console.log('No matching insights.');
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

  //A new user may skip the daily check in, resulting in 0 for the averages.
  //If that is the case, we need to break out of this method.
  if (averages.activity == 0) {
    return []; // Return an empty array
  } 
  
  return insights.filter(insight => {
    const { trigger } = insight;

    // Map string condition to InsightConditionEnum
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
        return false; // Invalid condition, skip this insight
    }

    // Evaluate the condition using the mapped enum
    switch (trigger.type) {
      case 'mood':
      case 'stress':
      case 'sleep':
      case 'activity':
        return evaluateCondition(averages[trigger.type], conditionEnum, trigger.value);
      default:
        return false;
    }
  });
}

/**
 * Evaluates a specific condition.
 * @param average - The average value of the metric.
 * @param condition - The condition to evaluate ("below", "above", "equal").
 * @param value - The value to compare against.
 * @returns Whether the condition is met.
 */
function evaluateCondition(average: number, condition: InsightConditionEnum, value: number | string): boolean {
  const numericValue = typeof value === 'string' ? Number(value) : value;
  switch (condition) {
    case InsightConditionEnum.below:
      return average < numericValue;
    case InsightConditionEnum.above:
      return average > numericValue;
    case InsightConditionEnum.equals:
      return Math.abs(average - Number(numericValue)) < 0.5; // Adjust tolerance as needed
    default:
      return false;
  }
}
