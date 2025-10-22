import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
    name="keranjang"
    options={{
      title: 'Cart',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={26} name="cart.fill" color={color} />
      ),
    }}
  />
  <Tabs.Screen
    name="favorites"
    options={{
      title: 'Favorites',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={26} name="heart.fill" color={color} />
      ),
    }}
  />

  <Tabs.Screen
    name="profil"
    options={{
      title: 'Profile',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={26} name="person.crop.circle.fill" color={color} />
      ),
    }}
  />
</Tabs>
   
  );
}
