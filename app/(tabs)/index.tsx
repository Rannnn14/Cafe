import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';




interface CoffeeItem {
  id: string;
  name: string;
  price: string;
  image: any;
}

interface CartItem extends CoffeeItem {
  quantity: number;
}

const COFFEE_DATA: CoffeeItem[] = [
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
const cardSize = (screenWidth - 80) / 4; // 4 kolom

export default function HomeScreen() {
  const [search, setSearch] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites
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

  const toggleFavorite = async (id: string) => {
    try {
      let updatedFavorites = [...favorites];
      if (updatedFavorites.includes(id)) {
        updatedFavorites = updatedFavorites.filter(fav => fav !== id);
      } else {
        updatedFavorites.push(id);
      }
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (err) {
      console.log('Error saving favorites:', err);
    }
  };

  const addToCart = async (item: CoffeeItem) => {
    try {
      const stored = await AsyncStorage.getItem('cart');
      let currentCart: CartItem[] = stored ? JSON.parse(stored) : [];

      const index = currentCart.findIndex(ci => ci.id === item.id);
      if (index >= 0) {
        currentCart[index].quantity += 1;
      } else {
        currentCart.push({ ...item, quantity: 1 });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(currentCart));
      Alert.alert('Success', `${item.name} added to cart!`);
    } catch (err) {
      console.log('Error adding to cart:', err);
    }
  };

  const filteredCoffee = COFFEE_DATA.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: CoffeeItem }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />

        {/* Tombol love di atas kanan */}
        <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(item.id)}>
          <ThemedText style={{ color: isFavorite ? '#e63946' : '#fff', fontSize: 18 }}>
            ♥
          </ThemedText>
        </TouchableOpacity>

        {/* Nama & harga di bawah gambar */}
        <View style={styles.infoContainer}>
          <ThemedText style={styles.name}>{item.name}</ThemedText>
          <ThemedText style={styles.price}>{item.price}</ThemedText>
        </View>

        {/* Tombol Add to Cart */}
        <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(item)}>
          <ThemedText style={styles.cartBtnText}>Add to Cart</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={require('@/assets/images/ini.png')} style={styles.headerImage} />
        <ThemedText type="title" style={styles.headerText}>
          Welcome to Cozy Coffee ☕
        </ThemedText>

        <TextInput
          style={styles.searchBar}
          placeholder="Search your favorite coffee..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filteredCoffee}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={4}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f2ec', paddingHorizontal: 16, paddingTop: 40 },
  headerImage: { width: '100%', height: 180, borderRadius: 20, marginBottom: 20 },
  headerText: { textAlign: 'center', fontWeight: '700', fontSize: 22, color: '#3e2723', marginBottom: 16 },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { justifyContent: 'space-between' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: cardSize,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: { width: '100%', height: cardSize - 20, borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 4,
    borderRadius: 12,
  },
  infoContainer: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 6,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  name: { fontWeight: '700', color: '#4b2e05', fontSize: 13 },
  price: { color: '#9c7b56', fontSize: 12, fontWeight: '600', marginTop: 2 },
  cartBtn: {
    backgroundColor: '#4b2e05',
    borderRadius: 12,
    paddingVertical: 4,
    marginHorizontal: 6,
    marginBottom: 6,
    alignItems: 'center',
  },
  cartBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});
