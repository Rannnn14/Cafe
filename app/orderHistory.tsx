import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAnonymousUser } from '@/hooks/useAnonymousUser';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  image: any;
  quantity: number;
  date: string;
  total: number;
}

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const userId = useAnonymousUser();

  // Ambil data dari AsyncStorage tiap kali halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      if (userId) loadOrders();
    }, [userId])
  );

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          quantity,
          total_price,
          created_at,
          Coffee (
            name,
            image
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedOrders = data.map((item: any) => ({
          id: item.id,
          name: item.Coffee.name,
          price: '', // Price per unit might not be stored or needed if total is there
          image: typeof item.Coffee.image === 'string' ? { uri: item.Coffee.image } : item.Coffee.image,
          quantity: item.quantity,
          date: new Date(item.created_at).toLocaleDateString('id-ID'),
          total: item.total_price,
        }));
        setOrders(formattedOrders);
      }
    } catch (err) {
      console.log('Error loading order history:', err);
    }
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: '#fefefe', paddingHorizontal: 16, paddingTop: 40 }}>
      {/* HEADER */}

      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <ThemedText style={{ textAlign: 'center', marginTop: 100, fontSize: 16, color: '#777' }}>
            Belum ada riwayat pesanan.
          </ThemedText>
        ) : (
          orders.map((item, index) => (
            <View
              key={`${item.id}-${index}`}
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                elevation: 2,
              }}
            >
              <Image source={item.image} style={{ width: 70, height: 70, borderRadius: 10, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontWeight: '600', fontSize: 16 }}>{item.name}</ThemedText>
                <ThemedText style={{ fontSize: 14, color: '#555' }}>
                  Jumlah: {item.quantity}
                </ThemedText>
                <ThemedText style={{ fontSize: 14, color: '#555' }}>
                  Total: Rp {item.total.toLocaleString('id-ID')}
                </ThemedText>
                <ThemedText style={{ fontSize: 13, color: '#999', marginTop: 4 }}>
                  {item.date}
                </ThemedText>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}
