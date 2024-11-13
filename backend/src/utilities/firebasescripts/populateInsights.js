const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json'); // Replace with the path to your service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const insights = [
    // Positive Insights
    {
      title: "Mood Boost!",
      description: "Your mood has been great lately! Keep doing what makes you happy.",
      trigger: {
        type: "mood",
        condition: "above",
        value: 8
      },
      icon: "sentiment_very_satisfied",
      category: "Mood"
    },
    {
      title: "Stress Under Control",
      description: "You've been managing your stress levels effectively. Keep it up!",
      trigger: {
        type: "stress",
        condition: "below",
        value: 4
      },
      icon: "self_improvement",
      category: "Stress"
    },
    {
      title: "Active and Healthy",
      description: "Your activity levels have been excellent. Staying active is great for your mental and physical health.",
      trigger: {
        type: "activity",
        condition: "above",
        value: 8
      },
      icon: "fitness_center",
      category: "Activity"
    },
    {
      title: "Restful Nights",
      description: "You've been getting plenty of good sleep lately. Keep up the healthy sleep habits.",
      trigger: {
        type: "sleep",
        condition: "above",
        value: 8
      },
      icon: "bedtime",
      category: "Sleep"
    },
    {
      title: "Balanced Life",
      description: "You've been balancing your mood, stress, activity, and sleep well. Great job maintaining your well-being!",
      trigger: {
        type: "mood",
        condition: "equals",
        value: 7
      },
      icon: "balance",
      category: "Mood"
    },
    {
      title: "Improved Mood",
      description: "Your mood has been steady over the past week. Keep engaging in activities that lift your spirits.",
      trigger: {
        type: "mood",
        condition: "above",
        value: 6
      },
      icon: "mood",
      category: "Mood"
    },
    {
      title: "Stress Resilience",
      description: "You're showing great resilience against stress. Continue with your coping strategies.",
      trigger: {
        type: "stress",
        condition: "below",
        value: 5
      },
      icon: "spa",
      category: "Stress"
    },
    {
      title: "Consistent Activity",
      description: "You've maintained consistent physical activity. This is excellent for your overall health.",
      trigger: {
        type: "activity",
        condition: "equals",
        value: 6
      },
      icon: "directions_walk",
      category: "Activity"
    },
    {
      title: "Good Sleep Patterns",
      description: "Your sleep patterns have been consistent. Quality sleep is key to maintaining good health.",
      trigger: {
        type: "sleep",
        condition: "equals",
        value: 6
      },
      icon: "night_shelter",
      category: "Sleep"
    },
    {
      title: "Productive and Calm",
      description: "You're staying productive while managing stress well. Keep up the great work!",
      trigger: {
        type: "stress",
        condition: "below",
        value: 5
      },
      icon: "thumb_up",
      category: "Stress"
    },
  
    // Neutral/Encouraging Insights
    {
      title: "Maintain Your Energy",
      description: "Your activity levels are good, but there's always room to challenge yourself. How about trying something new?",
      trigger: {
        type: "activity",
        condition: "equals",
        value: 5
      },
      icon: "local_activity",
      category: "Activity"
    },
    {
      title: "Keep Up the Routine",
      description: "Your daily routine is steady, but adding a little variety might boost your mood further.",
      trigger: {
        type: "mood",
        condition: "equals",
        value: 6
      },
      icon: "calendar_today",
      category: "Mood"
    },
    {
      title: "Improve Your Sleep",
      description: "Your sleep quality is decent, but improving your bedtime habits could help you feel even more rested.",
      trigger: {
        type: "sleep",
        condition: "equals",
        value: 6
      },
      icon: "hotel",
      category: "Sleep"
    },
    {
      title: "Mindful Relaxation",
      description: "Your stress levels are under control. Continue practicing relaxation techniques to maintain this balance.",
      trigger: {
        type: "stress",
        condition: "equals",
        value: 6
      },
      icon: "local_florist",
      category: "Stress"
    },
    {
      title: "Mood Stability",
      description: "Your mood has been stable recently. Keep doing what works for you, but don't be afraid to seek new experiences.",
      trigger: {
        type: "mood",
        condition: "equals",
        value: "average"
      },
      icon: "sentiment_neutral",
      category: "Mood"
    },
  
    // Cautionary/Negative Insights
    {
      title: "Low Activity Levels",
      description: "Your physical activity has been low. Try to get moving more to boost your energy and mood.",
      trigger: {
        type: "activity",
        condition: "below",
        value: 3
      },
      icon: "directions_run",
      category: "Activity"
    },
    {
      title: "High Stress Levels",
      description: "Your stress levels have been high. Consider taking time for yourself to relax and unwind.",
      trigger: {
        type: "stress",
        condition: "above",
        value: 8
      },
      icon: "warning",
      category: "Stress"
    },
    {
      title: "Sleep Disruptions",
      description: "Your sleep has been disrupted frequently. Try establishing a consistent bedtime routine to improve your sleep quality.",
      trigger: {
        type: "sleep",
        condition: "below",
        value: 4
      },
      icon: "nightlight_round",
      category: "Sleep"
    },
    {
      title: "Low Mood Alert",
      description: "Your mood has been consistently low. It might be helpful to talk to a friend or engage in an activity you enjoy.",
      trigger: {
        type: "mood",
        condition: "below",
        value: 3
      },
      icon: "sentiment_very_dissatisfied",
      category: "Mood"
    },
    {
      title: "Inactivity Warning",
      description: "Your activity levels are very low. Regular exercise can improve your mood and energy levels.",
      trigger: {
        type: "activity",
        condition: "below",
        value: 2
      },
      icon: "error_outline",
      category: "Activity"
    }
  ];
  

async function populateInsights() {
  const batch = db.batch();

  insights.forEach(insight => {
    const docRef = db.collection('personalizedinsights').doc(); // Auto-generate an ID for each document
    batch.set(docRef, insight);
  });

  await batch.commit();
  console.log('Personalized insights have been successfully added to Firebase!');
}

populateInsights().catch(error => {
  console.error("Error adding insights: ", error);
});
