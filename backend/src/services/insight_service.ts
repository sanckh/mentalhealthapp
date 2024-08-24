import { firestore } from 'firebase-admin';
import { Insight } from '../interfaces/insight';

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
  snapshot.forEach(doc => insights.push({ id: doc.id, ...doc.data() as Insight }));

  return insights;
}

/**
 * Evaluates which insights should be displayed based on user data.
 * @param averages - Averages of the user's check-in data.
 * @param insights - Array of insights to evaluate.
 * @returns Array of applicable insights.
 */
export function evaluateInsights(averages: Record<string, number>, insights: Insight[]): Insight[] {
  return insights.filter(insight => {
    const { trigger } = insight;
    switch (trigger.type) {
      case 'mood':
      case 'stress':
      case 'sleep':
      case 'activity':
        return evaluateCondition(averages[trigger.type], trigger.condition, trigger.value);
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
function evaluateCondition(average: number, condition: string, value: number | string): boolean {
  switch (condition) {
    case 'below':
      return average < value;
    case 'above':
      return average > value;
    case 'equal':
      return Math.abs(average - Number(value)) < 0.5; // Adjust tolerance as needed
    default:
      return false;
  }
}
