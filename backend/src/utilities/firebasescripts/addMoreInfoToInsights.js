const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json'); // Replace with the path to your service account key file


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
const db = admin.firestore();

const collectionRef = db.collection('personalizedinsights');

const moreInformationDetails = {
  "4Mp6A1Q6923lovpxuzTt": "Building a consistent, relaxing bedtime routine can greatly improve your sleep quality. Consider setting a regular bedtime and winding down with a book or soothing music.",
  "4eqijH4sQLtHgYxI6iT7": "You're doing a great job managing stress! To maintain this balance, consider regular relaxation techniques like deep breathing, meditation, or light exercise.",
  "JCMTbetR0TUsRkLnEZYc": "Adding mindfulness exercises to your daily routine can reinforce your relaxation efforts. Aim for a few moments of calm each day to reset and recharge.",
  "Ja2GXMYjVRbIvLZTJFbL": "Your mood is vibrant! Engaging in activities that bring joy, like hobbies or social events, can help maintain and elevate this positive state.",
  "LwtCT5rvvHKlnCpbFiXf": "Keeping a positive outlook is key! Continue with activities that make you happy, and consider exploring new interests to add variety to your routine.",
  "SvlRba95oADpyoESb6GN": "Your sleep could improve further with a consistent bedtime. Try going to bed and waking up at the same time each day, even on weekends.",
  "UVnqISEhzc9CeyjELMdw": "Physical activity benefits both mind and body. To keep things fresh, try a new activity like yoga, swimming, or a group fitness class.",
  "Un9yvDQyksSJOo3XMwXW": "It's natural to feel low sometimes. Talking to friends or spending time on an activity you love can provide a much-needed lift and support.",
  "csozOewNgzRXvWMVzZhY": "Frequent sleep disruptions can impact your well-being. Consider minimizing screen time before bed, and create a calm environment for better rest.",
  "dn2DpQaHNpjfupvVYVsT": "Regular physical movement can do wonders for your mood and energy. A daily walk or stretching session could be a simple yet powerful habit to add.",
  "gpWw2y1dpTj1AAZRwljn": "Incorporating short bursts of exercise, like a brisk walk or quick workout, can help elevate both your mood and physical health over time.",
  "iGv76UgwzWdhRlEWeSti": "Your sleep habits are impressive! Continuing with consistent sleep routines will support your overall health and enhance daily energy levels.",
  "luGx8DepgZQKFVLzOEDZ": "High stress can affect various areas of life. Taking small breaks, practicing deep breathing, and carving out personal time can make a big difference.",
  "mknQ0fuRS1SeQpu1V4hO": "Balanced well-being is essential. Keep nurturing each area (mood, stress, activity, sleep) as part of a holistic approach to a healthier you.",
  "pcs262lL0OBRES5TaHbd": "Your resilience is admirable. Continuing with your coping strategies and reinforcing them regularly will help keep stress at bay in the long run.",
  "roUBFCxCDLkFcXuhedsl": "Routine is great, but a little variety can boost your mood even more. Trying a new activity or mixing up your schedule might provide added joy.",
  "tV8c36UFrjinqKqnXSph": "You're managing productivity and stress excellently! Remember to take occasional breaks to sustain this balance and avoid burnout.",
  "vB4lXKsZFpSE9fzsFCHC": "Consistent physical activity is a cornerstone of health. Keep up the good work, and consider setting new goals to stay motivated and challenged.",
  "xoCfteflt1WmRsdCa946": "Your energy levels are steady, and a new physical challenge could add excitement. Try a different exercise or outdoor activity to keep things engaging.",
  "zzV4Iyx0tQ9jR0RWkLno": "Stability is wonderful, and new experiences can add enrichment. Don't hesitate to explore new activities that align with your values and interests."
};

async function addMoreInformation() {
  const batch = db.batch();

  for (const [docId, moreInfo] of Object.entries(moreInformationDetails)) {
    const docRef = collectionRef.doc(docId);
    batch.update(docRef, { moreinformation: moreInfo });
  }

  try {
    await batch.commit();
    console.log("All documents updated with unique 'moreinformation' fields.");
  } catch (error) {
    console.error("Error updating documents: ", error);
  }
}

addMoreInformation();
