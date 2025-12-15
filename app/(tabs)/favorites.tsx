import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, View, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { styles } from "../../components/styles/favorites.styles";

// Mapping nama kopi ke gambar lokal
const COFFEE_IMAGES: { [key: string]: any } = {
  'Espresso': require('@/assets/images/espresso.jpg'),
  'Latte': require('@/assets/images/latte.jpg'),
  'Cappuccino': require('@/assets/images/cappuccino.jpg'),
  'Iced Coffee': require('@/assets/images/icedcoffee.jpg'),
  'Mocha': require('@/assets/images/mocha.jpg'),
  'Americano': require('@/assets/images/americano.jpg'),
  'Macchiato': require('@/assets/images/macchiato.jpg'),
  'Flat White': require('@/assets/images/flatwhite.jpg'),
  'Hot Brew': require('@/assets/images/hotbrew.jpg'),
};

export default function FavoritesScreen() {
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const userId = 'user1'; // Ganti sesuai user Supabase Auth

  useFocusEffect(
    useCallback(() => {
      if (userId) loadFavorites();
    }, [userId])
  );

  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          coffee_id,
          coffee (
            id,
            name,
            price
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        const items = data.map((item: any) => ({
          id: item.coffee.id,
          name: item.coffee.name,
          price: item.coffee.price,
          image: COFFEE_IMAGES[item.coffee.name] // ambil gambar lokal
        }));
        setFavoriteItems(items);
      }
    } catch (err) {
      console.log('Error loading favorites:', err);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
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
          keyExtractor={(item) => item.id.toString()}
          numColumns={4}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

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
