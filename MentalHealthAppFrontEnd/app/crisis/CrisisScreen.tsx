// CrisisScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ImageBackground,
  Platform,
} from "react-native";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { getCrisisDocuments } from "../../api/crisis";
import { crisisDocumentModel } from "@/models/crisisDocumentModel";
import { userContactModel } from "@/models/userContactModel";
import { getUserContacts } from "@/api/userContacts";
import { getCurrentUser } from "@/api/auth";

const CrisisScreen = () => {
  const [crisisDocuments, setCrisisDocuments] = useState<any>(null);
  const [userContacts, setUserContacts] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
  
        const crisisDocuments = await getCrisisDocuments();
        setCrisisDocuments(crisisDocuments);
        console.log(crisisDocuments);
  
        const userContacts = await getUserContacts(user.uid);
        setUserContacts(userContacts);
      } catch (error) {
        console.error('Error initializing home screen:', error);
      }
    };
    initialize();
  }, []);

  const makePhoneCall = (number: string) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crisis Support</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => makePhoneCall("1234567890")}
        >
          <Text style={styles.buttonText}>Suicide Hotline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => makePhoneCall("911")}
        >
          <Text style={styles.buttonText}>
            Emergency Services (Might change this)
          </Text>
        </TouchableOpacity>

        {userContacts !== null &&
          userContacts !== undefined &&
          userContacts.length > 0 && (
            <View style={styles.buttonContainer}>
              {userContacts.map((contact: userContactModel, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.callButton}
                  onPress={() => makePhoneCall(contact.phoneNumber)}
                >
                  <Text style={styles.buttonText}>
                    {contact.phoneNumberType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
      </View>

      <div className="slider-container">
        {crisisDocuments !== null &&
          crisisDocuments !== undefined &&
          crisisDocuments.length > 0 && (
            <Slider {...settings}>
              {crisisDocuments.map(
                (crisisDocument: crisisDocumentModel, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => Linking.openURL(crisisDocument.link)}
                  >
                    <View style={styles.carouselCard}>
                      <Text style={styles.cardTitle}>
                        {crisisDocument.title}
                      </Text>
                      <Text style={styles.cardDescription}>
                        {crisisDocument.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              )}
            </Slider>
          )}
      </div>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  webContainer: {
    flex: 1,
    backgroundColor: "#e0f7fa",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 30,
  },
  callButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  webCallButton: {
    backgroundColor: "#03A9F4",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  carouselCard: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  carousel: {
    marginTop: 20,
  },
});

export default CrisisScreen;
