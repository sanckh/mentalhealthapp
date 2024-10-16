import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { icons } from '@/constants';
import ProtectedRoute from '@/utils/ProtectedRoute';

type TabIconProps = {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View style={styles.iconContainer}>
      <Image
        source={icon}
        resizeMethod='resize'
        style={[styles.icon, { tintColor: color }]}
      />

      <Text
        style={[
          styles.iconText,
          { color },
          focused ? styles.focusedText : styles.regularText,
        ]}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout: React.FC = () => {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: '#FFA001',
          // tabBarInactiveTintColor: '#CDCDE0',
          tabBarShowLabel: false,
          tabBarStyle: {
            // backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84,
          },
        }}>
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name='Home'
                color={color}
                icon={icons.home}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='dailycheckin'
          options={{
            title: 'Checkin',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name='Checkin'
                color={color}
                focused={focused}
                icon={icons.home}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name='Profile'
                color={color}
                focused={focused}
                icon={icons.profile}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='settings'
          options={{
            title: 'Settings',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name='Settings'
                color={color}
                focused={focused}
                icon={icons.plus}
              />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconText: {
    fontSize: 12,
  },
  focusedText: {
    fontWeight: 'bold',
  },
  regularText: {
    fontFamily: 'System',
  },
});

export default TabsLayout;
