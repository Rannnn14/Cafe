import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { styles } from "../../components/styles/trending";
import { supabase } from '@/lib/supabase';

/**
 * SESUAI VIEW:
 * create view leaderboard_products as
 * select name, sum(quantity) as total_order
 */
interface TrendingItem {
  name: string;
  total_order: number;
}

export default function TrendingScreen() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadTrending = async () => {
      const { data, error } = await supabase
        .from('leaderboard_products')
        .select('*');

      if (error) {
        console.log('Error loading trending:', error);
        return;
      }

      setTrending(data || []);
    };

    loadTrending();
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

  const renderItem = ({ item, index }: { item: TrendingItem; index: number }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <ThemedText style={styles.rank}>#{index + 1}</ThemedText>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.count}>
          Sold: {item.total_order}
        </ThemedText>
        {renderStars(item.total_order)}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* 🔙 Tombol Kembali */}
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
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}
