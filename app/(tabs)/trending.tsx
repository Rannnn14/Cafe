import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface CoffeeItem {
  id: string;
  name: string;
  price: string;
  image: any;
}

interface CartItem extends CoffeeItem {
  quantity: number;
}

export default function TrendingScreen() {
  const [trending, setTrending] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const stored = await AsyncStorage.getItem('cart');
        if (stored) {
          const cartData: CartItem[] = JSON.parse(stored);

          // Hitung total pembelian per item
          const trendMap: Record<string, CartItem> = {};
          cartData.forEach((item) => {
            if (trendMap[item.id]) {
              trendMap[item.id].quantity += item.quantity;
            } else {
              trendMap[item.id] = { ...item };
            }
          });

          const sorted = Object.values(trendMap).sort(
            (a, b) => b.quantity - a.quantity
          );
          setTrending(sorted);
        }
      } catch (err) {
        console.log('Error loading trending:', err);
      }
    };

    loadTrending();
    const interval = setInterval(loadTrending, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderStars = (quantity: number) => {
    const maxStars = 5;
    const filledStars = Math.min(maxStars, Math.ceil(quantity / 2));
    return (
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {[...Array(maxStars)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < filledStars ? 'star' : 'star-outline'}
            size={16}
            color={i < filledStars ? '#FFD700' : '#ccc'}
          />
        ))}
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: CartItem; index: number }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <ThemedText style={styles.rank}>#{index + 1}</ThemedText>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.price}>{item.price}</ThemedText>
        <ThemedText style={styles.count}>Sold: {item.quantity}</ThemedText>
        {renderStars(item.quantity)}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* 🔙 Tombol Panah Kembali */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/')}
      >
        <Ionicons name="arrow-back" size={26} color="#3e2723" />
      </TouchableOpacity>

      <ThemedText type="title" style={styles.title}>
        🔥 Trending Coffees
      </ThemedText>

      {trending.length === 0 ? (
        <ThemedText style={styles.emptyText}>
          No trending data yet. Buy some coffee to see trends!
        </ThemedText>
      ) : (
        <FlatList
          data={trending}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5f0',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    padding: 6,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    color: '#3e2723',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#7d6b5a',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
  },
  info: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rank: {
    fontSize: 13,
    color: '#9c7b56',
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4b2e05',
  },
  price: {
    fontSize: 13,
    color: '#8b6f4e',
  },
  count: {
    fontSize: 12,
    color: '#6c5a45',
  },
});
