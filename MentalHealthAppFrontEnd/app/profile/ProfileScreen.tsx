import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as ImagePicker from "expo-image-picker";
import { useThemeContext } from "@/components/ThemeContext";
import { updateProfilePicture } from "@/api/user";
import { getCurrentUser } from "@/api/auth";
import { getConsecutiveCheckins, getRecentCheckinData } from "@/api/checkin";
import ChangeDisplayNameModal from "@/components/ChangeDisplayNameModal";
import { convertToUserLocalTime } from "../utilities/dateUtils"

export default function ProfileScreen() {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [consecutiveCheckins, setConsecutiveCheckins] = useState<number | null>(
    null
  );
  const [recentCheckinData, setRecentCheckinData] = useState<number[]>([]);
  const [displayNameModalVisible, setDisplayNameModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const [moodData, setMoodData] = useState<number[]>([]);
  const [activityData, setActivityData] = useState<number[]>([]);
  const [stressData, setStressData] = useState<number[]>([]);
  const [sleepData, setSleepData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const [favoriteResources, setFavoriteResources] = useState([
    { id: 1, title: "Mindfulness Basics", isFavorite: true },
    { id: 2, title: "Tips for Better Sleep", isFavorite: true },
    { id: 3, title: "Managing Stress", isFavorite: true },
  ]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        setProfileImage(userData.profileImageUrl);
        setDisplayName(userData?.name || "");

        const days = await getConsecutiveCheckins(userData.uid);
        setConsecutiveCheckins(days);

        const checkinData = await getRecentCheckinData(userData.uid);
        setRecentCheckinData(checkinData);

        const { mood, activity, stress, sleep, labels } = processCheckinData(checkinData);
        setMoodData(mood);
        setActivityData(activity);
        setStressData(stress);
        setSleepData(sleep);
        setLabels(labels);

      } catch (error) {
        console.error("Error initializing settings screen:", error);
      }
    };
    initialize();
  }, []);

  const handleChangeDisplayName = () => {
    setDisplayNameModalVisible(true);
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setProfileImage(uri);

        const formData = new FormData();
        const fileName = uri.split("/").pop();
        const response = await fetch(uri);
        const blob = await response.blob();

        formData.append("profileImage", blob, fileName || "profile_image.jpg");
        await updateProfilePicture(formData, user.uid);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            source={{ uri: profileImage || "https://via.placeholder.com/150" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{user?.name}</Text>
          <TouchableOpacity
            onPress={handleChangeDisplayName}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.userStats}>
          {consecutiveCheckins !== null ? (
            consecutiveCheckins > 0 ? (
              <>
                🎉{" "}
                <Text style={styles.highlightText}>{consecutiveCheckins}</Text>{" "}
                days in a row checked in! Keep it up! 💪
              </>
            ) : (
              <Text style={styles.zeroCheckinsNote}>
                😔 No consecutive days yet. Start today to build your streak! 🚀
              </Text>
            )
          ) : (
            "Loading..."
          )}
        </Text>
      </View>

      {user && (
        <ChangeDisplayNameModal
          visible={displayNameModalVisible}
          onClose={() => setDisplayNameModalVisible(false)}
          currentDisplayName={user?.name}
          userId={user?.uid}
        />
      )}

      {/* Graph Section */}
      <View style={styles.graphContainer}>
        <Text style={styles.sectionTitle}>Recent Check-in Stats</Text>
        {moodData.length > 0 && activityData.length > 0 && stressData.length > 0 && sleepData.length > 0 && labels.length > 0 ? (
        <LineChart
          data={{
            labels: labels,
            legend: ["Mood", "Activity", "Stress", "Sleep"], 
            datasets: [
              {
                data: moodData,
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: activityData,
                color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: stressData,
                color: (opacity = 1) => `rgba(255, 206, 86, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: sleepData,
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          fromZero={true}
          width={Dimensions.get("window").width}
          height={200}
          chartConfig={{
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            backgroundGradientFrom: theme === "dark" ? "#333" : "#fff",
            backgroundGradientTo: theme === "dark" ? "#333" : "#fff",
            decimalPlaces: 0,
            color: () => (theme === "dark" ? "#fff" : "#333"),
            labelColor: () => (theme === "dark" ? "#ccc" : "#666"),
          }}
          style={styles.chart}
        />
        ) : (
    <Text>Loading chart data...</Text>
  )}
      </View>

      {/* Favorite Resources */}
      <View style={styles.resourcesContainer}>
        <Text style={styles.sectionTitle}>Favorite Resources</Text>
        {favoriteResources.map((resource) => (
          <TouchableOpacity key={resource.id} style={styles.resourceItem}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.star}>⭐</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function processCheckinData(checkinData: any[]) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);


  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - (6 - i));
    return convertToUserLocalTime(date.getTime() / 1000);
  });

  const mood = Array(7).fill(0);
  const activity = Array(7).fill(0);
  const stress = Array(7).fill(0);
  const sleep = Array(7).fill(0);
  const mappedDays = new Set();

  checkinData.forEach((entry: any) => {
    const entryDate = convertToUserLocalTime(entry.timestamp._seconds);
    const dayIndex = last7Days.indexOf(entryDate);

    if (dayIndex !== -1 && !mappedDays.has(entryDate)) {
      mood[dayIndex] = Number(entry.mood) || 0;
      activity[dayIndex] = Number(entry.activity) || 0;
      stress[dayIndex] = Number(entry.stress) || 0;
      sleep[dayIndex] = Number(entry.sleep) || 0;
      mappedDays.add(entryDate);
    }
  });

  const labels = last7Days.map((dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  return { mood, activity, stress, sleep, labels };
}


const createStyles = (theme: string) => {
  const isDark = theme === "dark";
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
      alignItems: "center",
      padding: 20,
    },
    header: {
      alignItems: "center",
      marginBottom: 20,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: isDark ? "#333" : "#fff",
      marginBottom: 10,
    },
    userStats: {
      fontSize: 16,
      color: isDark ? "#eee" : "#222",
      textAlign: "center",
      marginBottom: 10,
      padding: 10,
      backgroundColor: isDark ? "#444" : "#e0f7fa",
      borderRadius: 10,
      borderColor: isDark ? "#666" : "#00acc1",
      borderWidth: 1,
    },

    highlightText: {
      fontWeight: "bold",
      color: "#ff9800",
    },

    zeroCheckinsNote: {
      fontSize: 16,
      color: isDark ? "#f0a" : "#d32f2f",
      textAlign: "center",
      marginTop: 10,
    },
    graphContainer: {
      width: "100%",
      marginVertical: 20,
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#fff" : "#333",
      marginBottom: 10,
    },
    chart: {
      borderRadius: 10,
      marginBottom: 10,
    },
    resourcesContainer: {
      width: "100%",
      marginTop: 20,
    },
    resourceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#333" : "#ddd",
    },
    resourceTitle: {
      fontSize: 16,
      color: isDark ? "#ccc" : "#333",
    },
    star: {
      fontSize: 18,
      color: isDark ? "#ffcc00" : "#ffd700",
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
      marginBottom: 5,
    },
    editButton: {
      marginLeft: 10,
      padding: 5,
      backgroundColor: isDark ? "#555" : "#e0f7fa",
      borderRadius: 5,
    },
    editButtonText: {
      fontSize: 16,
      color: isDark ? "#fff" : "#00acc1",
    },
  });
};
