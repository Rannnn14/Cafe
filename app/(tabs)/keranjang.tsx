import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { styles } from "../styles/cart.styles";
import {
  Alert, Image,
  ScrollView,
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
  const [cart, setCart] = useState<CartItem[]>([]); //Menyimpan daftar item di keranjang.
  const [total, setTotal] = useState<number>(0); //Menyimpan jumlah harga dari item yang dicentang.

  /** Load data keranjang */
  // Saat halaman keranjang dibuka, data produk diambil dari AsyncStorage (penyimpanan lokal).
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