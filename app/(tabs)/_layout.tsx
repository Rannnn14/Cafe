import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons'; // ✅ Tambahkan Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [cartCount, setCartCount] = useState<number>(0);
  const router = useRouter();

  // 🔁 Ambil jumlah item keranjang dari AsyncStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem('cart');
        if (stored) {
          const parsed = JSON.parse(stored);
          setCartCount(parsed.length);
        }
      } catch (err) {
        console.log('Error loading cart:', err);
      }
    };

    loadCart();
    const interval = setInterval(loadCart, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          height: 60,
          borderTopWidth: 0.5,
          borderTopColor: '#ccc',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {/* 🏠 HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />

      {/* 🛒 CART */}
      <Tabs.Screen
        name="keranjang"
        options={{
          title: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#e63946',
            color: '#fff',
            fontSize: 10,
            fontWeight: '700',
          },
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="cart.fill" color={color} />
          ),
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={() => router.push('/')}
            >
              <Ionicons name="arrow-back" size={24} color="#4b2e05" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* ❤️ FAVORITES */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="heart.fill" color={color} />
          ),
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={() => router.push('/')}
            >
              <Ionicons name="arrow-back" size={24} color="#4b2e05" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* 👤 PROFILE */}
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={26}
              name="person.crop.circle.fill"
              color={color}
            />
          ),
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={() => router.push('/')}
            >
              <Ionicons name="arrow-back" size={24} color="#4b2e05" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* 🔥 TRENDING */}
      <Tabs.Screen
        name="trending"
        options={{
          title: 'Trending',
          // ✅ pakai Ionicons agar icon muncul di semua platform
          tabBarIcon: ({ color }) => (
            <Ionicons name="flame" size={26} color={color} />
          ),
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={() => router.push('/')}
            >
              <Ionicons name="arrow-back" size={24} color="#4b2e05" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
