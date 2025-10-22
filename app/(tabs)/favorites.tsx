import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

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

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 80) / 4;

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) setFavorites(JSON.parse(stored));
      } catch (err) {
        console.log('Error loading favorites:', err);
      }
    };
    loadFavorites();
  }, []);

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
      <ThemedText type="title" style={styles.title}>Your Favorites ❤️</ThemedText>
      {favoriteItems.length === 0 ? (
        <ThemedText style={{ textAlign: 'center', marginTop: 50 }}>No favorite coffee yet.</ThemedText>
      ) : (
        <FlatList
          data={favoriteItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f2ec',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#3e2723',
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: cardSize,
    height: cardSize + 40,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: cardSize - 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  name: {
    fontWeight: '600',
    color: '#4b2e05',
    fontSize: 11,
  },
  price: {
    color: '#9c7b56',
    fontSize: 11,
    fontWeight: '500',
  },
});
