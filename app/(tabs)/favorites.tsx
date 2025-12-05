import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { styles } from "../../components/styles/favorites.styles";

const COFFEE_DATA = [
  { id: '1', name: 'Espresso', price: '25K', image: require('@/assets/images/espresso.jpg') },
  { id: '2', name: 'Latte', price: '28K', image: require('@/assets/images/latte.jpg') },
  { id: '3', name: 'Cappuccino', price: '30K', image: require('@/assets/images/cappuccino.jpg') },
  { id: '4', name: 'Iced Coffee', price: '27K', image: require('@/assets/images/icedcoffee.jpg') },
  { id: '5', name: 'Mocha', price: '32K', image: require('@/assets/images/mocha.jpg') },
  { id: '6', name: 'Americano', price: '24K', image: require('@/assets/images/americano.jpg') },
  { id: '7', name: 'Macchiato', price: '29K', image: require('@/assets/images/macchiato.jpg') },
  { id: '8', name: 'Flat White', price: '31K', image: require('@/assets/images/flatwhite.jpg') },
  { id: '9', name: 'Hot Brew', price: '26K', image: require('@/assets/images/hotbrew.jpg') },
];


export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const stored = await AsyncStorage.getItem('favorites');
          if (stored) setFavorites(JSON.parse(stored));
        } catch (err) {
          console.log('Error loading favorites:', err);
        }
      };
      loadFavorites();
    }, [])
  );

  const favoriteItems = COFFEE_DATA.filter(item => favorites.includes(item.id));

  const renderItem = ({ item }: { item: (typeof COFFEE_DATA)[0] }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <ThemedText type="subtitle" style={styles.name}>{item.name}</ThemedText>
      <ThemedText style={styles.price}>{item.price}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>My Favorites ❤️</ThemedText>

      {favoriteItems.length === 0 ? (
        <ThemedText style={{ textAlign: 'center', marginTop: 50 }}>
          No favorite coffee yet.
        </ThemedText>
      ) : (
        <FlatList
          data={favoriteItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Tombol di bagian bawah tengah */}
      <View style={styles.footerButtons}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
          <ThemedText style={styles.buttonText}>Kembali</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/')} style={styles.addButton}>
          <ThemedText style={styles.buttonText}>Tambah</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}


