import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Linking from "expo-linking";
import Icon from "react-native-vector-icons/MaterialIcons";
import { hasSubmittedDailyCheckin } from "@/api/checkin";
import { getCurrentUser } from "@/api/auth";
import { getPersonalizedInsights } from "@/api/insights";
import { insightModel } from "@/models/insightModel";
import { useAuth } from "../store/auth/auth-context";
import { useRouter } from "expo-router";
import { useThemeContext } from "@/components/ThemeContext";
import { recommendedResourceModel } from "@/models/recommendedResourceModel";
import {
  addFavoriteResource,
  getFavoriteResources,
  getRecommendedResources,
  removeFavoriteResource,
} from "@/api/recommendedResources";
import { colors } from '../theme/colors';
import InsightModal from "@/components/InsightModal";

export default function HomeScreen() {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const { isAuthenticated, token, uid, setIsAuthenticated } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const [resources, setResources] = useState<recommendedResourceModel[] | null>(
    null
  );
  const [favoriteResourceIds, setFavoriteResourceIds] = useState<string[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<insightModel | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
        const checkedIn = await hasSubmittedDailyCheckin(user.uid);
        setHasCheckedIn(checkedIn);
        const insights = await getPersonalizedInsights(user.uid);
        setInsights(insights);
        const resources = await getRecommendedResources();
        setResources(resources);
        const favorites = await getFavoriteResources(user.uid);
        setFavoriteResourceIds(favorites.map((resource) => resource.id));
      } catch (error) {
        console.error("Error initializing home screen:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const toggleFavorite = async (resourceId: string) => {
    const isFavorite = favoriteResourceIds.includes(resourceId);

    try {
      if (isFavorite) {
        await removeFavoriteResource(user.uid, resourceId);
        setFavoriteResourceIds(
          favoriteResourceIds.filter((id) => id !== resourceId)
        );
      } else {
        await addFavoriteResource(user.uid, resourceId);
        setFavoriteResourceIds([...favoriteResourceIds, resourceId]);
      }
    } catch (error) {
      console.error(
        `Failed to ${isFavorite ? "remove" : "add"} favorite resource:`,
        error
      );
    }
  };

  const handleInsightPress = (insight: insightModel) => {
    setSelectedInsight(insight);
  };

  const closeModal = () => {
    setSelectedInsight(null);
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
        <Text style={styles.header}>Welcome Back, {user?.name ?? "User"}!</Text>

        {user && !hasCheckedIn && (
          <View style={styles.card}>
            <Text style={styles.title}>Complete your daily check-in</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/dailycheckin")}
            >
              <Text style={styles.buttonText}>Go to Check-in</Text>
            </TouchableOpacity>
          </View>
        )}

        {insights && insights.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.header}>Personalized Insights</Text>
            {insights.map((insight: insightModel, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.reuseCard}
                onPress={() => handleInsightPress(insight)}
              >
                <View style={styles.cardIconContainer}>
                  <Icon name={insight.icon} size={30} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{insight.title}</Text>
                  <Text style={styles.cardCategory}>{insight.category}</Text>
                  <Text style={styles.cardDescription}>
                    {insight.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <InsightModal
          visible={!!selectedInsight}
          insight={selectedInsight!}
          onClose={closeModal}
        />

        {resources && resources.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.header}>Recommended Resources</Text>
            <Text style={styles.textSmall}>Tap to see more</Text>
            {resources.map(
              (resource: recommendedResourceModel, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.reuseCard}
                  onPress={() => Linking.openURL(resource.link)}
                >
                  <View style={styles.cardIconContainer}>
                    <Icon name={resource.icon} size={30} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.title}>{resource.title}</Text>
                    <Text style={styles.cardCategory}>{resource.category}</Text>
                    <Text style={styles.cardDescription}>
                      {resource.description}
                    </Text>
                  </View>
                  {/* Add favorite toggle button */}
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(resource.id)}
                  >
                    <Icon
                      name={
                        favoriteResourceIds.includes(resource.id)
                          ? "star"
                          : "star-border"
                      }
                      size={25}
                      color="gold"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            )}
          </View>
        ) : (
          <Text style={styles.cardDescription}>
            No recommended resources available today.
          </Text>
        )}

        <View style={styles.card}>
          <Text style={styles.title}>Crisis Support</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/crisis")}
          >
            <Text style={styles.buttonText}>Crisis Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Progress Overview</Text>
          <Text style={styles.contentText}>Your recent progress...</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: string) => {
  const isDark = theme === "dark";
  const themeColors = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: themeColors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: themeColors.background,
    },
    loadingText: {
      fontSize: 18,
      color: themeColors.textSecondary,
    },
    header: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 12,
      color: themeColors.text,
      textAlign: "center",
    },
    card: {
      backgroundColor: themeColors.surface,
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 8,
      color: themeColors.text,
    },
    contentText: {
      fontSize: 16,
      color: themeColors.textSecondary,
    },
    button: {
      backgroundColor: themeColors.primary,
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
    reuseCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: 10,
      backgroundColor: themeColors.surfaceVariant,
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    cardIconContainer: {
      marginRight: 10,
    },
    cardTextContainer: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
      color: themeColors.text,
    },
    cardCategory: {
      fontSize: 14,
      color: themeColors.textSecondary,
      marginBottom: 5,
    },
    cardDescription: {
      fontSize: 14,
      color: themeColors.text,
    },
    textSmall: {
      fontSize: 12,
      color: themeColors.textSecondary,
      marginBottom: 4,
      textAlign: "center",
    },
    favoriteButton: {
      position: "absolute",
      top: 10,
      right: 10,
    },
  });
};
