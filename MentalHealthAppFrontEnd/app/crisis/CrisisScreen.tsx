// CrisisScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel'; // Make sure to install this package

const CrisisScreen = () => {
  const [carouselItems] = useState([
    {
      title: 'Managing Anxiety',
      image: 'https://via.placeholder.com/300',
      link: 'https://example.com/anxiety',
    },
    {
      title: 'Mindfulness Techniques',
      image: 'https://via.placeholder.com/300',
      link: 'https://example.com/mindfulness',
    },
    {
      title: 'Dealing with Stress',
      image: 'https://via.placeholder.com/300',
      link: 'https://example.com/stress',
    },
  ]);

  const makePhoneCall = (number: string) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crisis Support</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => makePhoneCall('1234567890')}
        >
          <Text style={styles.buttonText}>Suicide Hotline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => makePhoneCall('911')}
        >
          <Text style={styles.buttonText}>Emergency Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => makePhoneCall('0987654321')}
        >
          <Text style={styles.buttonText}>Therapist</Text>
        </TouchableOpacity>
      </View>

      <Carousel
        loop
        width={300}
        height={200}
        autoPlay={true}
        data={carouselItems}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => console.log('current index:', index)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.link)}
            style={styles.carouselCard}
          >
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.cardImage}
              imageStyle={{ borderRadius: 10 }}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  callButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  carouselCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImage: {
    height: '100%',
    justifyContent: 'flex-end',
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default CrisisScreen;
