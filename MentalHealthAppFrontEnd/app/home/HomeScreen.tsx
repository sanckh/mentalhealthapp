import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { hasSubmittedDailyCheckin } from "@/api/checkin";
import { getCurrentUser } from "@/api/auth";
import { getPersonalizedInsights } from "@/api/insights";

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndCheckinStatus = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        setUser(fetchedUser);

        if (fetchedUser) {
          const checkedIn = await hasSubmittedDailyCheckin(fetchedUser.uid);
          setHasCheckedIn(checkedIn);
        }
      } catch (error) {
        console.error("Error fetching user or check-in status:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchUserAndCheckinStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back!</Text>

      {user && !hasCheckedIn && (
        <View style={styles.card}>
          <Text style={styles.title}>Complete your daily check-in</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace({ pathname: "/dailycheckin" })}
          >
            <Text style={styles.buttonText}>Go to Check-in</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Personalized Insights</Text>
        <Text style={styles.contentText}>Recent mood trends and tips...</Text>
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
        <Text style={styles.title}>Recommended Resources</Text>
        <Text style={styles.contentText}>Suggested articles, videos, etc.</Text>
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
    </View>
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
});
