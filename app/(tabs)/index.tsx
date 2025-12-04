import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { styles } from "../styles/index.styles";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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

export default function HomeScreen() {
  const [search, setSearch] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const heartScale = useRef(new Animated.Value(1)).current;

  // Load favorites & cart
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFav = await AsyncStorage.getItem('favorites');
        if (storedFav) setFavorites(JSON.parse(storedFav));

        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) setCartCount(JSON.parse(storedCart).length);
      } catch (err) {
        console.log('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const toggleFavorite = async (id: string) => {
    try {
      let updatedFavorites = [...favorites];
      if (updatedFavorites.includes(id)) {
        updatedFavorites = updatedFavorites.filter(fav => fav !== id);
      } else {
        updatedFavorites.push(id);
        animateHeart();
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
      setCartCount(currentCart.length);
      Alert.alert('☕ Added', `${item.name} added to cart!`);
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

        <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(item.id)}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#e63946' : '#fff'}
            />
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <ThemedText style={styles.name}>{item.name}</ThemedText>
          <ThemedText style={styles.price}>{item.price}</ThemedText>
        </View>

        <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(item)}>
          <ThemedText style={styles.cartBtnText}> Add to Cart</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image source={require('@/assets/images/ini.png')} style={styles.headerImage} />
          <ThemedText type="title" style={styles.headerText}>
            Welcome to Cozy Coffee ☕
          </ThemedText>
        </View>

        {/* Search */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search your favorite coffee..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />

        {/* List */}
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

