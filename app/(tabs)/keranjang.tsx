import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: any;
  quantity: number;
  checked?: boolean;
}

export default function KeranjangScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  /** Load data keranjang */
  useFocusEffect(
    useCallback(() => {
      const loadCart = async () => {
        try {
          const stored = await AsyncStorage.getItem('cart');
          if (stored) {
            const parsed = JSON.parse(stored).map((item: CartItem) => ({
              ...item,
              checked: item.checked ?? false,
            }));
            setCart(parsed);
          } else setCart([]);
        } catch (err) {
          console.log('Error loading cart:', err);
        }
      };
      loadCart();
    }, [])
  );

  /** Hitung total berdasarkan item yang dicentang */
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => {
      if (!item.checked) return sum;
      const priceNumber = parseInt(item.price.replace('K', '')) * 1000;
      return sum + priceNumber * item.quantity;
    }, 0);
    setTotal(newTotal);
  }, [cart]);

  /** Simpan ke AsyncStorage */
  const saveCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
  };

  /** Aksi + dan - */
  const increase = (id: string) => {
    saveCart(
      cart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrease = (id: string) => {
    saveCart(
      cart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  /** Hapus item */
  const removeItem = async (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    await saveCart(newCart);
  };

  /** Toggle checkbox */
  const toggleCheck = (id: string) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    saveCart(updated);
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>MY CART</ThemedText>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {cart.length === 0 ? (
          <ThemedText style={styles.emptyText}>Keranjang Kosong</ThemedText>
        ) : (
          cart.map(item => {
            const priceNumber = parseInt(item.price.replace('K', '')) * 1000;
            const subtotal = priceNumber * item.quantity;

            return (
              <View key={item.id} style={styles.card}>
                {/* Checkbox */}
                <TouchableOpacity onPress={() => toggleCheck(item.id)} style={styles.checkbox}>
                  <Ionicons
                    name={item.checked ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={item.checked ? '#4b2e05' : '#aaa'}
                  />
                </TouchableOpacity>

                {/* Gambar & Info */}
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                  <View style={styles.rowBetween}>
                    <ThemedText style={styles.name}>{item.name}</ThemedText>
                    <ThemedText style={styles.subtotalText}>
                      Rp {subtotal.toLocaleString('id-ID')}
                    </ThemedText>
                  </View>

                  <View style={styles.quantityRow}>
                    <TouchableOpacity style={styles.btn} onPress={() => decrease(item.id)}>
                      <Text style={styles.btnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.btn} onPress={() => increase(item.id)}>
                      <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Text style={styles.removeText}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}

        {/* Total & Checkout */}
        {cart.length > 0 && (
          <>
            <View style={styles.totalRow}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalValue}>
                Rp {total.toLocaleString('id-ID')}
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.checkoutButton, { opacity: total === 0 ? 0.5 : 1 }]}
              disabled={total === 0}
              onPress={() => {
                if (total === 0) return;
                Alert.alert(
                  "Konfirmasi Checkout",
                  "Kesuwun uis Tuku ning Coffe Shop",
                  [
                    {
                      text: "Batal",
                      style: "cancel"
                    },
                    {
                      text: "Sama-sama",
                      onPress: () => {
                        console.log('Checkout:', cart.filter(c => c.checked));
                        // di sini nanti kamu bisa arahkan ke halaman pembayaran, misalnya:
                        // navigation.navigate("Pembayaran");
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.checkoutText}>Checkout Sekarang</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f6f2ec' },

  /** HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3e2723',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#4b2e05',
    padding: 2,
    borderRadius: 10,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: { marginRight: 8 },
  image: { width: 55, height: 55, borderRadius: 10, marginRight: 10 },
  name: { fontWeight: '700', fontSize: 14, color: '#000' },
  subtotalText: { fontWeight: '600', fontSize: 13, color: '#000' },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  btn: {
    backgroundColor: '#4b2e05',
    borderRadius: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  qty: { fontWeight: '600', fontSize: 14, color: '#000' },
  removeText: { color: '#e63946', fontWeight: '600', fontSize: 13, marginLeft: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#d1c7b8',
  },
  totalLabel: { fontWeight: '700', fontSize: 16, color: '#3e2723' },
  totalValue: { fontWeight: '800', fontSize: 16, color: '#3e2723' },
  checkoutButton: {
    backgroundColor: '#4b2e05',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 20,
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 60, fontSize: 16, color: '#3e2723' },
});
