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
import * as Linking from 'expo-linking';
import { LineChart } from "react-native-chart-kit";
import * as ImagePicker from "expo-image-picker";
import { useThemeContext } from "@/components/ThemeContext";
import { updateProfilePicture } from "@/api/user";
import { getCurrentUser } from "@/api/auth";
import { getConsecutiveCheckins, getRecentCheckinData } from "@/api/checkin";
import ChangeDisplayNameModal from "@/components/modals/ChangeDisplayNameModal";
import { convertToUserLocalTime } from "../utilities/dateUtils";
import { recommendedResourceModel } from "@/models/recommendedResourceModel";
import { getFavoriteResources, removeFavoriteResource } from "@/api/recommendedResources";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [consecutiveCheckins, setConsecutiveCheckins] = useState<number>(0);
  const [recentCheckinData, setRecentCheckinData] = useState<number[]>([]);
  const [displayNameModalVisible, setDisplayNameModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const [moodData, setMoodData] = useState<number[]>([]);
  const [activityData, setActivityData] = useState<number[]>([]);
  const [stressData, setStressData] = useState<number[]>([]);
  const [sleepData, setSleepData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const [favoriteResources, setFavoriteResources] = useState<
    recommendedResourceModel[]
  >([]);

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

        const { mood, activity, stress, sleep, labels } =
          processCheckinData(checkinData);
        setMoodData(mood);
        setActivityData(activity);
        setStressData(stress);
        setSleepData(sleep);
        setLabels(labels);

        const resources = await getFavoriteResources(userData.uid);
        setFavoriteResources(resources);

      } catch (error) {
        console.error("Error initializing settings screen:", error);
      }
    };
    initialize();
  }, []);

  const handleRemoveFavorite = async (resourceId: string) => {
    try {
      if (user) {
        await removeFavoriteResource(user.uid, resourceId);
        setFavoriteResources((prevResources) =>
          prevResources.filter((resource) => resource.id !== resourceId)
        );
      }
    } catch (error) {
      console.error("Failed to remove favorite resource:", error);
    }
  };

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
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Profile Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
              <Image
                source={{ uri: profileImage || "https://via.placeholder.com/150" }}
                style={styles.profileImage}
              />
              <View style={styles.editImageBadge}>
                <Icon name="camera-alt" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{user?.name || "User"}</Text>
              <TouchableOpacity
                onPress={handleChangeDisplayName}
                style={styles.editButton}
              >
                <Icon name="edit" size={16} color={theme === "dark" ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Streak Card */}
          <View style={styles.streakCard}>
            <Icon 
              name={consecutiveCheckins > 0 ? "local-fire-department" : "timer"} 
              size={24} 
              color={consecutiveCheckins > 0 ? "#FF6B6B" : theme === "dark" ? "#ccc" : "#666"}
              style={styles.streakIcon}
            />
            {consecutiveCheckins !== null ? (
              consecutiveCheckins > 0 ? (
                <Text style={styles.streakText}>
                  <Text style={styles.streakNumber}>{consecutiveCheckins}</Text> day streak!
                  {consecutiveCheckins >= 7 && " 🎉"}
                </Text>
              ) : (
                <Text style={styles.streakText}>Start your streak today!</Text>
              )
            ) : (
              <Text style={styles.streakText}>Loading...</Text>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Text style={styles.sectionSubtitle}>Last 7 days</Text>
          </View>
          {moodData.length > 0 &&
          activityData.length > 0 &&
          stressData.length > 0 &&
          sleepData.length > 0 &&
          labels.length > 0 ? (
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
              width={Dimensions.get("window").width - 50}
              height={220}
              chartConfig={{
                backgroundColor: theme === "dark" ? "#333" : "#fff",
                backgroundGradientFrom: theme === "dark" ? "#333" : "#fff",
                backgroundGradientTo: theme === "dark" ? "#333" : "#fff",
                decimalPlaces: 0,
                color: () => (theme === "dark" ? "#fff" : "#333"),
                labelColor: () => (theme === "dark" ? "#ccc" : "#666"),
                strokeWidth: 2,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                },
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Icon name="timeline" size={40} color={theme === "dark" ? "#ccc" : "#666"} />
              <Text style={styles.noDataText}>No activity data yet</Text>
            </View>
          )}
        </View>

        {/* Resources Section */}
        <View style={styles.resourcesCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Resources</Text>
            <Text style={styles.sectionSubtitle}>Tap to open</Text>
          </View>
          {favoriteResources.length > 0 ? (
            favoriteResources.map((resource) => (
              <View key={resource.id} style={styles.resourceItem}>
                <TouchableOpacity 
                  onPress={() => Linking.openURL(resource.link)}
                  style={styles.resourceTextContainer}
                >
                  <Text style={styles.resourceTitle} numberOfLines={2}>
                    {resource.title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleRemoveFavorite(resource.id)}
                  style={styles.deleteButton}
                >
                  <Icon name="delete-outline" size={24} color={theme === "dark" ? "#ff4d4d" : "#d32f2f"} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Icon name="bookmark-border" size={40} color={theme === "dark" ? "#ccc" : "#666"} />
              <Text style={styles.noDataText}>No saved resources</Text>
            </View>
          )}
        </View>
      </View>

      {user && (
        <ChangeDisplayNameModal
          visible={displayNameModalVisible}
          onClose={() => setDisplayNameModalVisible(false)}
          currentDisplayName={user?.name}
          userId={user?.uid}
        />
      )}
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
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  return { mood, activity, stress, sleep, labels };
}

const createStyles = (theme: string) => {
  const isDark = theme === "dark";
  const themeColors = isDark ? colors.dark : colors.light;
  const screenWidth = Dimensions.get("window").width;

  return StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    container: {
      flexGrow: 1,
      padding: 16,
    },
    headerCard: {
      backgroundColor: themeColors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerContent: {
      alignItems: "center",
    },
    imageContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: themeColors.primary,
    },
    editImageBadge: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      backgroundColor: themeColors.primary,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'center',
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: themeColors.text,
      marginRight: 8,
    },
    editButton: {
      padding: 4,
      borderRadius: 12,
      backgroundColor: themeColors.surfaceVariant,
    },
    streakCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeColors.surfaceVariant,
      borderRadius: 12,
      padding: 12,
      marginTop: 16,
    },
    streakIcon: {
      marginRight: 8,
    },
    streakText: {
      fontSize: 16,
      color: themeColors.text,
    },
    streakNumber: {
      fontWeight: 'bold',
      color: themeColors.primary,
    },
    statsCard: {
      backgroundColor: themeColors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    sectionHeader: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: themeColors.textSecondary,
    },
    chart: {
      borderRadius: 12,
      marginTop: 8,
    },
    resourcesCard: {
      backgroundColor: themeColors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    resourceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    resourceTextContainer: {
      flex: 1,
      marginRight: 12,
    },
    resourceTitle: {
      fontSize: 16,
      color: themeColors.text,
      lineHeight: 22,
    },
    deleteButton: {
      padding: 4,
      borderRadius: 8,
    },
    noDataContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    noDataText: {
      fontSize: 16,
      color: themeColors.textSecondary,
      marginTop: 8,
    },
  });
};
