import React from 'react';
import { View, Text, Image } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { icons } from '@/constants';

type TabIconProps = {
  icon: any;
  color: string;
  name: string;

  focused: boolean;
};
//className='items-center justify-center gap-2'
const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View>
      <Image
        source={icon}
        resizeMethod='resize'
        tintColor={color}
        // className='w-6 h-6'
      />
      <Text
        // className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}
        style={{ color }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout: React.FC = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#161622',
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
    </>
  );
};

export default TabsLayout;
