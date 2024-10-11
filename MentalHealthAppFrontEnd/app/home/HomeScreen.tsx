
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { hasSubmittedDailyCheckin } from "@/api/checkin";
import { getCurrentUser, signout } from "@/api/auth";
import { getPersonalizedInsights } from "@/api/insights";
import { insightModel } from "@/models/insightModel";
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const navigation = useNavigation();
  
  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
        const checkedIn = await hasSubmittedDailyCheckin(user.uid);
        setHasCheckedIn(checkedIn);
        const insights = await getPersonalizedInsights(user.uid);
        setInsights(insights);
      } catch (error) {
        console.error('Error initializing home screen:', error);
      } finally {
        setLoading(false);
      }
    };

  initialize();
}, []);

  const handleSignout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
      <Text style={styles.header}>Welcome Back!</Text>

      {user && !hasCheckedIn && (
        <View style={styles.card}>
          <Text style={styles.title}>Complete your daily check-in</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('dailycheckin')}
          >
            <Text style={styles.buttonText}>Go to Check-in</Text>
          </TouchableOpacity>
        </View>
      )}

{insights.length > 0 && (
  <View style={styles.card}>
    <View style={styles.insightsContainer}>
    <Text style={styles.insightsHeader}>Personalized Insights</Text>
    {insights.map((insight: insightModel, index: number) => (
      <View key={index} style={styles.insightCard}>
        <View style={styles.insightIconContainer}>
          <Icon
            name={insight.icon}
            size={30}
          />
        </View>
        <View style={styles.insightTextContainer}>
          <Text style={styles.insightTitle}>{insight.title}</Text>
          <Text style={styles.insightCategory}>{insight.category}</Text>
          <Text style={styles.insightDescription}>{insight.description}</Text>
        </View>
      </View>
    ))}
  </View>
  </View>
)}

      <View style={styles.card}>
        <Text style={styles.title}>Recommended Resources</Text>
        <Text style={styles.contentText}>Suggested articles, videos, etc.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Mindfulness Exercise</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {} /* Navigation or function to start meditation */}
        >
          <Text style={styles.buttonText}>Start Meditation</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Crisis Support</Text>
        <TouchableOpacity
          style={styles.button}
          //onPress={() => router.replace({ pathname: '/crisisscreen' })}
        >
          <Text style={styles.buttonText}>Emergency Contacts</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Progress Overview</Text>
        <Text style={styles.contentText}>Your recent progress...</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleSignout();
        }}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  contentText: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  insightsContainer: {
    marginTop: 16,
  },
  insightsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
    insightCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#fff',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
  
    insightIconContainer: {
      marginRight: 10,
    },
  
    insightIcon: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
    },
  
    insightTextContainer: {
      flex: 1,
    },
  
    insightTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
  
    insightCategory: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
  
    insightDescription: {
      fontSize: 14,
      color: '#333',
    },
});
