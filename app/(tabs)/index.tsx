import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../../components/styles/index.styles';

interface CoffeeItem {
  id: string;
  name: string;
  price: number; // ⬅️ NUMBER
  image: any;
}

const USER_ID = 'user1';

const COFFEE_DATA: CoffeeItem[] = [
  { id: '1', name: 'Espresso', price: 25000, image: require('@/assets/images/espresso.jpg') },
  { id: '2', name: 'Latte', price: 28000, image: require('@/assets/images/latte.jpg') },
  { id: '3', name: 'Cappuccino', price: 30000, image: require('@/assets/images/cappuccino.jpg') },
  { id: '4', name: 'Iced Coffee', price: 27000, image: require('@/assets/images/icedcoffee.jpg') },
  { id: '5', name: 'Mocha', price: 32000, image: require('@/assets/images/mocha.jpg') },
  { id: '6', name: 'Americano', price: 24000, image: require('@/assets/images/americano.jpg') },
  { id: '7', name: 'Macchiato', price: 29000, image: require('@/assets/images/macchiato.jpg') },
  { id: '8', name: 'Flat White', price: 31000, image: require('@/assets/images/flatwhite.jpg') },
  { id: '9', name: 'Hot Brew', price: 26000, image: require('@/assets/images/hotbrew.jpg') },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const heartScale = useRef(new Animated.Value(1)).current;

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const toggleFavorite = async (id: string) => {
    let updated = [...favorites];

    if (updated.includes(id)) {
      updated = updated.filter(f => f !== id);
      await supabase.from('favorites').delete().eq('user_id', USER_ID).eq('coffee_id', id);
    } else {
      updated.push(id);
      animateHeart();
      await supabase.from('favorites').insert({
        user_id: USER_ID,
        coffee_id: id,
      });
    }

    setFavorites(updated);
  };

  /** 🔥 ADD TO CART YANG BENAR */
  const addToCart = async (item: CoffeeItem) => {
    try {
      const { data: existing } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', USER_ID)
        .eq('product_id', item.id)
        .single();

      if (existing) {
        await supabase
          .from('cart')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);
      } else {
        await supabase.from('cart').insert({
          user_id: USER_ID,
          product_id: item.id,
          name: item.name,
          price: item.price, // NUMBER
          quantity: 1,
          selected: false,
        });
      }

      Alert.alert('Berhasil', `${item.name} masuk keranjang ☕`);
    } catch (err) {
      console.log('ADD CART ERROR:', err);
    }
  };

  const filteredCoffee = COFFEE_DATA.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: CoffeeItem }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />

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
          <ThemedText style={styles.price}>
            Rp {item.price.toLocaleString('id-ID')}
          </ThemedText>
        </View>

        <TouchableOpacity style={styles.cartBtn} onPress={() => addToCart(item)}>
          <ThemedText style={styles.cartBtnText}>Add to Cart</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerText}>
            Welcome to Cozy Coffee ☕
          </ThemedText>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search coffee..."
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filteredCoffee}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={4}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
        />
      </ScrollView>
    </ThemedView>
  );
}
