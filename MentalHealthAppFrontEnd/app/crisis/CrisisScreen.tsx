// CrisisScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ImageBackground,
  Platform,
} from 'react-native';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from 'react';
import { getCrisisDocuments } from '../../api/crisis';
import { crisisDocumentModel } from '@/models/crisisDocumentModel';


const CrisisScreen = () => {
  const [crisisDocuments, setCrisisDocuments] = useState<any>(null);

  useEffect(() => {
    const fetchCrisisDocuments = async () => {
      try {
        const crisisDocuments = await getCrisisDocuments();
        setCrisisDocuments(crisisDocuments);
        console.log(crisisDocuments)
      } catch (error) {
        console.error('Error fetching crisis documents:', error);
      }
    };

    fetchCrisisDocuments();
  }, []);

  const makePhoneCall = (number: string) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
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

      <div className="slider-container">
      {crisisDocuments !== null && crisisDocuments !== undefined && crisisDocuments.length > 0 && (
        <Slider {...settings}>
          {crisisDocuments.map((crisisDocument: crisisDocumentModel, index: number) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(crisisDocument.link)}>
              <View style={styles.carouselCard}>
                <Text style={styles.cardTitle}>{crisisDocument.title}</Text>
                <Text>{crisisDocument.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Slider>
      )}
    </div>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    padding: 20,
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
  webCallButton: {
    backgroundColor: '#03A9F4',
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
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImage: {
    height: 200,
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
  carousel: {
    marginTop: 20,
  },
  h3: {
    fontSize: 40,
    backgroundColor: '#FF0000',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 15,
    margin: 5,
    fontFamily: 'sans-serif',
  },
});

export default CrisisScreen;
