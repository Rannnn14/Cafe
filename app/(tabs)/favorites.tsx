import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAnonymousUser } from '@/hooks/useAnonymousUser';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { styles } from "../../components/styles/favorites.styles";


export default function FavoritesScreen() {
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const userId = useAnonymousUser();

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
          product_id,
          Coffee (
            id,
            name,
            price,
            image
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        const items = data.map((item: any) => ({
          id: item.Coffee.id,
          name: item.Coffee.name,
          price: item.Coffee.price,
          image: typeof item.Coffee.image === 'string' ? { uri: item.Coffee.image } : item.Coffee.image
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


