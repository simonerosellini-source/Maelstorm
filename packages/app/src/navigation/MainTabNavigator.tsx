import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import CharacterScreen from '../screens/main/CharacterScreen';
import PartyScreen from '../screens/main/PartyScreen';
import DungeonScreen from '../screens/main/DungeonScreen';
import ShopScreen from '../screens/main/ShopScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16213e' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#0f3460' },
        tabBarActiveTintColor: '#9d4edd',
        tabBarInactiveTintColor: '#94a1b2',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Character"
        component={CharacterScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>⚔️</Text>,
        }}
      />
      <Tab.Screen
        name="Party"
        component={PartyScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="Dungeon"
        component={DungeonScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏰</Text>,
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🛍️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
