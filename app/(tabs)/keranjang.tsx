import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAnonymousUser } from '@/hooks/useAnonymousUser';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from "../../components/styles/cart.styles";

interface CartItem {
  id: string; // Cart Item unique ID
  product_id: string;
  name: string;
  price: string;
  image: any;
  quantity: number;
  checked?: boolean;
}

export default function KeranjangScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const userId = useAnonymousUser();

  useFocusEffect(
    useCallback(() => {
      if (userId) loadCart();
    }, [userId])
  );

  const loadCart = async () => {
    try {
      // Fetch cart items joined with Coffee data
      const { data, error } = await supabase
        .from('Cart')
        .select(`
          id,
          quantity,
          product_id,
          Coffee (
            name,
            price,
            image
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        const formattedCart = data.map((item: any) => ({
          id: item.id, // Cart item ID
          product_id: item.product_id,
          name: item.Coffee.name,
          price: item.Coffee.price,
          image: typeof item.Coffee.image === 'string' ? { uri: item.Coffee.image } : item.Coffee.image,
          quantity: item.quantity,
          checked: false,
        }));
        setCart(formattedCart);
      }
    } catch (err) {
      console.log('Error loading cart:', err);
    }
  };

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => {
      if (!item.checked) return sum;
      const priceNumber = parseInt(item.price.replace('K', '')) * 1000;
      return sum + priceNumber * item.quantity;
    }, 0);
    setTotal(newTotal);
  }, [cart]);

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('Cart')
        .update({ quantity: newQuantity })
        .eq('id', id);

      if (error) throw error;

      setCart(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.log('Error updating quantity:', err);
    }
  };

  const increase = (id: string) => {
    const item = cart.find(c => c.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decrease = (id: string) => {
    const item = cart.find(c => c.id === id);
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
  };

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase.from('Cart').delete().eq('id', id);
      if (error) throw error;
      setCart(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.log('Error removing item:', err);
    }
  };

  const toggleCheck = (id: string) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleCheckout = async () => {
    if (total === 0 || !userId) return;

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
          onPress: async () => {
            try {
              const checkedItems = cart.filter(c => c.checked);

              // Create orders for each checked item
              // Assuming 'orders' table structure. If it's one order per checkout:
              // We might want to group them. For now, inserting individual records or a JSON blob.
              // Letting's assume simple: Insert into 'orders' with details.

              const orderData = checkedItems.map(item => ({
                user_id: userId,
                product_id: item.product_id,
                quantity: item.quantity,
                total_price: (parseInt(item.price.replace('K', '')) * 1000) * item.quantity,
                created_at: new Date().toISOString(),
                status: 'pending' // if needed
              }));

              const { error: orderError } = await supabase
                .from('orders')
                .insert(orderData);

              if (orderError) throw orderError;

              // Remove checked items from cart
              const idsToDelete = checkedItems.map(c => c.id);
              const { error: deleteError } = await supabase
                .from('Cart')
                .delete()
                .in('id', idsToDelete);

              if (deleteError) throw deleteError;

              setCart(prev => prev.filter(c => !c.checked));
              Alert.alert("Success", "Order placed successfully!");
              router.push('/orderHistory');

            } catch (err) {
              console.log('Checkout error:', err);
              Alert.alert("Error", "Checkout failed.");
            }
          }
        }
      ]
    );
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
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>Checkout Sekarang</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}