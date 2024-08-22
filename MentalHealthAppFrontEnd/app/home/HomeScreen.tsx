import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { hasSubmittedDailyCheckin } from "@/api/checkin";
import { getCurrentUser } from "@/api/auth";

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
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome Back!</Text>
        {/* Show this only if the user has NOT checked in */}
        {user && !hasCheckedIn && (
          <View style={styles.section}>
            <Text style={styles.title}>Complete your daily check-in</Text>
            <Button
              title="Go to Check-in"
              onPress={() => router.replace({ pathname: "/dailycheckin" })}
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Personalized Insights</Text>
        <Text>Recent mood trends and tips...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Mindfulness Exercise</Text>
        <Button
          title="Start Meditation"
          onPress={() => {} /* Navigation or function to start meditation */}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Recommended Resources</Text>
        <Text>Suggested articles, videos, etc.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Crisis Support</Text>
        <Button
          title="Emergency Contacts"
          //onPress={() => router.replace({pathname: '/crisisscreen'})}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Progress Overview</Text>
        <Text>Your recent progress...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
