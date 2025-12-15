import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/lib/supabase';
import { useCallback, useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const USER_ID = 'user1';

// Map untuk gambar lokal
const imageMap: Record<string, any> = {
  'espresso.jpg': require('@/assets/images/espresso.jpg'),
  'latte.jpg': require('@/assets/images/latte.jpg'),
  'cappuccino.jpg': require('@/assets/images/cappuccino.jpg'),
  'icedcoffee.jpg': require('@/assets/images/icedcoffee.jpg'),
  'mocha.jpg': require('@/assets/images/mocha.jpg'),
  'americano.jpg': require('@/assets/images/americano.jpg'),
  'macchiato.jpg': require('@/assets/images/macchiato.jpg'),
  'flatwhite.jpg': require('@/assets/images/flatwhite.jpg'),
  'hotbrew.jpg': require('@/assets/images/hotbrew.jpg'),
};

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  selected: boolean;
  image: string; // simpan nama file
  created_at: string;
}

export default function KeranjangScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  /** Load cart dari Supabase */
  const loadCart = async () => {
    const { data, error } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', USER_ID)
      .order('created_at', { ascending: false });

    if (!error) setCart(data || []);
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  /** Hitung total */
  useEffect(() => {
    const totalPrice = cart
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalPrice);
  }, [cart]);

  /** Toggle select */
  const toggleSelect = async (id: string, value: boolean) => {
    await supabase.from('cart').update({ selected: value }).eq('id', id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, selected: value } : item));
  };

  /** Update quantity */
  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return;
    await supabase.from('cart').update({ quantity: qty }).eq('id', id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  /** Delete item */
  const deleteItem = async (id: string) => {
    await supabase.from('cart').delete().eq('id', id);
    setCart(prev => prev.filter(item => item.id !== id));
  };

  /** Checkout */
  const checkout = async () => {
    const selectedItems = cart.filter(item => item.selected);
    if (selectedItems.length === 0) {
      Alert.alert('Pilih produk dulu');
      return;
    }

    setLoading(true);
    try {
      const orderRows = selectedItems.map(item => ({
        user_id: USER_ID,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
      }));

      // Masukkan ke orders
      const { error: orderError } = await supabase.from('orders').insert(orderRows);
      if (orderError) throw orderError;

      // Hapus dari cart
      const ids = selectedItems.map(i => i.id);
      const { error: deleteError } = await supabase.from('cart').delete().in('id', ids);
      if (deleteError) throw deleteError;

      loadCart();
      Alert.alert('Sukses', 'Checkout berhasil ☕');
    } catch (err) {
      console.log('Checkout error:', err);
      Alert.alert('Checkout gagal');
    } finally {
      setLoading(false);
    }
  };

  /** Render item */
  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={{
      flexDirection: 'row',
      padding: 12,
      marginVertical: 6,
      marginHorizontal: 12,
      backgroundColor: '#fff',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
      alignItems: 'center',
    }}>
      {/* Checkbox */}
      <TouchableOpacity onPress={() => toggleSelect(item.id, !item.selected)}>
        <View style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#6f4e37',
          backgroundColor: item.selected ? '#6f4e37' : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          {item.selected && <ThemedText style={{ color: '#fff', fontSize: 16 }}>✓</ThemedText>}
        </View>
      </TouchableOpacity>

      {/* Thumbnail */}
      <Image source={imageMap[item.image]} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />

      {/* Info */}
      <View style={{ flex: 1 }}>
        <ThemedText style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</ThemedText>
        <ThemedText style={{ color: '#6f4e37', marginVertical: 4 }}>Rp {item.price.toLocaleString('id-ID')}</ThemedText>

        {/* Quantity + Hapus */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <TouchableOpacity onPress={() => updateQty(item.id, item.quantity - 1)} style={{ padding: 6 }}>
            <ThemedText>➖</ThemedText>
          </TouchableOpacity>
          <ThemedText style={{ marginHorizontal: 12 }}>{item.quantity}</ThemedText>
          <TouchableOpacity onPress={() => updateQty(item.id, item.quantity + 1)} style={{ padding: 6 }}>
            <ThemedText>➕</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteItem(item.id)} style={{ marginLeft: 20 }}>
            <ThemedText style={{ color: '#e63946', fontWeight: 'bold' }}>Hapus</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#f8f4f0' }}>
      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 12 }}
      />

      {/* Total & Checkout */}
      <View style={{
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
      }}>
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>Total: Rp {total.toLocaleString('id-ID')}</ThemedText>
        <TouchableOpacity
          onPress={checkout}
          disabled={loading}
          style={{
            backgroundColor: '#6f4e37',
            padding: 14,
            borderRadius: 12,
            marginTop: 10,
          }}
        >
          <ThemedText style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Checkout</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
