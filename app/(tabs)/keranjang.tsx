import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface CartItem {
  id: string;
  name: string;
  price: string; // "25K"
  image: any;
  quantity: number;
}

export default function KeranjangScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  // Load cart
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem('cart');
        if (stored) setCart(JSON.parse(stored));
      } catch (err) {
        console.log('Error loading cart:', err);
      }
    };
    loadCart();
  }, []);

  // Update total whenever cart changes
  useEffect(() => {
    let sum = 0;
    cart.forEach(item => {
      const priceNumber = parseInt(item.price.replace('K', '')) * 1000;
      sum += priceNumber * item.quantity;
    });
    setTotal(sum);
  }, [cart]);

  const saveCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  };

  const increase = (id: string) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(newCart);
  };

  const decrease = (id: string) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    saveCart(newCart);
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const priceNumber = parseInt(item.price.replace('K', '')) * 1000;
    return (
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <View style={styles.info}>
          <ThemedText style={styles.name}>{item.name}</ThemedText>
          <View style={styles.quantityRow}>
            <TouchableOpacity style={styles.btn} onPress={() => decrease(item.id)}>
              <Text style={styles.btnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => increase(item.id)}>
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.subtotal}>
          <ThemedText style={styles.subtotalText}>
            Rp { (priceNumber * item.quantity).toLocaleString('id-ID') }
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {cart.length === 0 ? (
          <ThemedText style={styles.emptyText}>Keranjang kosong 😢</ThemedText>
        ) : (
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        <View style={styles.totalRow}>
          <ThemedText style={styles.totalText}>Total:</ThemedText>
          <ThemedText style={styles.totalText}>
            Rp { total.toLocaleString('id-ID') }
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f6f2ec' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: 60, height: 60, borderRadius: 12, marginRight: 12 },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontWeight: '700', fontSize: 16, marginBottom: 8, color: '#000' },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    backgroundColor: '#4b2e05',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  qty: { marginHorizontal: 12, fontSize: 16, fontWeight: '600', color: '#000' },
  subtotal: { width: 90, alignItems: 'flex-end' },
  subtotalText: { fontWeight: '700', fontSize: 14, color: '#000' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalText: { fontWeight: '800', fontSize: 18, color: '#000' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#000' },
});
