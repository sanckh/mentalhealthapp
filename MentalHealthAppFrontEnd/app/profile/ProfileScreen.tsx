import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as ImagePicker from 'expo-image-picker';
import { useThemeContext } from '@/components/ThemeContext';
import { updateProfilePicture } from '@/api/user';
import { getCurrentUser } from '@/api/auth';
import { getConsecutiveCheckins } from '@/api/checkin';

export default function ProfileScreen(){
  const { theme } = useThemeContext();
  const styles = createStyles(theme);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [consecutiveCheckins, setConsecutiveCheckins] = useState<number | null>(null);

  const [favoriteResources, setFavoriteResources] = useState([
    { id: 1, title: 'Mindfulness Basics', isFavorite: true },
    { id: 2, title: 'Tips for Better Sleep', isFavorite: true },
    { id: 3, title: 'Managing Stress', isFavorite: true },
  ]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await getCurrentUser();
        console.log
        setUser(userData);
        setProfileImage(userData.profileImageUrl);
        
        const days = await getConsecutiveCheckins(userData.uid);
        setConsecutiveCheckins(days);
        
      } catch (error) {
        console.error('Error initializing settings screen:', error);
      }
    };
    initialize();
  }, []);

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
        const fileName = uri.split('/').pop();
        const response = await fetch(uri);
        const blob = await response.blob();
        
        formData.append('profileImage', blob, fileName || 'profile_image.jpg');
        await updateProfilePicture(formData, user.uid);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            source={{ uri: profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userStats}>
  {consecutiveCheckins !== null ? (
    consecutiveCheckins > 0 ? (
      <>
        🎉 <Text style={styles.highlightText}>{consecutiveCheckins}</Text> days in a row checked in! Keep it up! 💪
      </>
    ) : (
      <Text style={styles.zeroCheckinsNote}>
        😔 No consecutive days yet. Start today to build your streak! 🚀
      </Text>
    )
  ) : (
    'Loading...'
  )}
</Text>

      </View>

      {/* Graph Section */}
      <View style={styles.graphContainer}>
        <Text style={styles.sectionTitle}>Recent Check-in Stats</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              { data: [5, 6, 7, 6, 5, 8, 7] },
              { data: [3, 4, 5, 4, 3, 5, 4] },
              { data: [4, 3, 2, 3, 4, 3, 2] },
              { data: [6, 7, 5, 6, 8, 6, 7] },
            ],
          }}
          width={Dimensions.get("window").width}
          height={200}
          yAxisSuffix="Days"
          chartConfig={{
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            backgroundGradientFrom: theme === 'dark' ? '#333' : '#fff',
            backgroundGradientTo: theme === 'dark' ? '#333' : '#fff',
            decimalPlaces: 0,
            color: () => (theme === 'dark' ? '#fff' : '#333'),
            labelColor: () => (theme === 'dark' ? '#ccc' : '#666'),
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Favorite Resources */}
      <View style={styles.resourcesContainer}>
        <Text style={styles.sectionTitle}>Favorite Resources</Text>
        {favoriteResources.map(resource => (
          <TouchableOpacity key={resource.id} style={styles.resourceItem}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.star}>⭐</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// Create dynamic styles based on the theme
const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
      alignItems: 'center',
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: isDark ? '#333' : '#fff',
      marginBottom: 10,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      marginBottom: 5,
    },
    userStats: {
      fontSize: 16, // Slightly larger font for better readability
      color: isDark ? '#eee' : '#222', // Brighter color for more fun
      textAlign: 'center',
      marginBottom: 10,
      padding: 10,
      backgroundColor: isDark ? '#444' : '#e0f7fa', // Background color for emphasis
      borderRadius: 10, // Rounded corners for a more modern look
      borderColor: isDark ? '#666' : '#00acc1', // Border for a touch of color
      borderWidth: 1,
    },
    
    highlightText: {
      fontWeight: 'bold',
      color: '#ff9800', // Highlight color for emphasis
    },
    
    zeroCheckinsNote: {
      fontSize: 16,
      color: isDark ? '#f0a' : '#d32f2f', // Bright color for the message
      textAlign: 'center',
      marginTop: 10,
    },    
    graphContainer: {
      width: '100%',
      marginVertical: 20,
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#333',
      marginBottom: 10,
    },
    chart: {
      borderRadius: 10,
      marginBottom: 10,
    },
    resourcesContainer: {
      width: '100%',
      marginTop: 20,
    },
    resourceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#ddd',
    },
    resourceTitle: {
      fontSize: 16,
      color: isDark ? '#ccc' : '#333',
    },
    star: {
      fontSize: 18,
      color: isDark ? '#ffcc00' : '#ffd700',
    },
  });
};
