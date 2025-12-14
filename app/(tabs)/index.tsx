import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAnonymousUser } from '@/hooks/useAnonymousUser';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from "../../components/styles/index.styles";

interface CoffeeItem {
  id: string;
  name: string;
  price: string;
  image: any;
}

interface CartItem extends CoffeeItem {
  quantity: number;
}



export default function HomeScreen() {
  const [coffeeData, setCoffeeData] = useState<CoffeeItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const heartScale = useRef(new Animated.Value(1)).current;
  const userId = useAnonymousUser();

  useEffect(() => {
    fetchCoffee();
  }, []);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId]);

  const fetchCoffee = async () => {
    try {
      const { data, error } = await supabase.from('Coffee').select('*');
      if (error) {
        throw error;
      }
      if (data) {
        setCoffeeData(data);
      }
    } catch (e) {
      console.error('Error fetching coffee:', e);
      Alert.alert('Error', 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId);

      if (error) throw error;
      if (data) {
        setFavorites(data.map(f => f.product_id));
      }
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
  };

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const toggleFavorite = async (id: string) => {
    if (!userId) return;

    try {
      const isFav = favorites.includes(id);
      let error;

      if (isFav) {
        const { error: err } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('favorites')
          .insert({ user_id: userId, product_id: id });
        error = err;
      }

      if (error) throw error;

      if (isFav) {
        setFavorites(prev => prev.filter(fav => fav !== id));
      } else {
        setFavorites(prev => [...prev, id]);
        animateHeart();
      }
    } catch (err) {
      console.log('Error saving favorites:', err);
      Alert.alert('Error', 'Failed to update favorite');
    }
  };

  const addToCart = async (item: CoffeeItem) => {
    if (!userId) return;

    try {
      // Check if item exists in cart
      const { data: existing, error: fetchError } = await supabase
        .from('Cart')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', item.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is no rows returned
        throw fetchError;
      }

      if (existing) {
        const { error } = await supabase
          .from('Cart')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Cart')
          .insert({
            user_id: userId,
            product_id: item.id,
            quantity: 1,
            // Assuming Cart table might want denormalized data or just ID. 
            // If just ID, join is needed in Cart screen.
          });
        if (error) throw error;
      }

      Alert.alert('☕ Added', `${item.name} added to cart!`);
    } catch (err) {
      console.log('Error adding to cart:', err);
      Alert.alert('Error', 'Failed to add to cart');
    }
  };

  const filteredCoffee = coffeeData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: CoffeeItem }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={styles.card}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image} // Handle both URL strings and local requires if mixed
          style={styles.image}
          resizeMode="cover"
        />

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
          keyExtractor={(item) => item.id.toString()}
          numColumns={4}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </ScrollView>
    </ThemedView>
  );
}

