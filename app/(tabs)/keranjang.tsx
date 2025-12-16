import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Tambahan untuk tautin ke checkout
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const USER_ID = "user1";

// Map untuk gambar lokal
const imageMap: Record<string, any> = {
  "espresso.jpg": require("@/assets/images/espresso.jpg"),
  "latte.jpg": require("@/assets/images/latte.jpg"),
  "cappuccino.jpg": require("@/assets/images/cappuccino.jpg"),
  "icedcoffee.jpg": require("@/assets/images/icedcoffee.jpg"),
  "mocha.jpg": require("@/assets/images/mocha.jpg"),
  "americano.jpg": require("@/assets/images/americano.jpg"),
  "macchiato.jpg": require("@/assets/images/macchiato.jpg"),
  "flatwhite.jpg": require("@/assets/images/flatwhite.jpg"),
  "hotbrew.jpg": require("@/assets/images/hotbrew.jpg"),
};

interface CartItem {
  id: string; // id row cart
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  selected: boolean;
  image: string; // nama file
  created_at: string;
}

export default function KeranjangScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  /** Load cart dari Supabase */
  const loadCart = async () => {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", USER_ID)
      .order("created_at", { ascending: false });

    if (!error) setCart((data as CartItem[]) || []);
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  /** Hitung total */
  useEffect(() => {
    const totalPrice = cart
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    setTotal(totalPrice);
  }, [cart]);

  /** Toggle select */
  const toggleSelect = async (id: string, value: boolean) => {
    await supabase.from("cart").update({ selected: value }).eq("id", id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: value } : item))
    );
  };

  /** Update quantity */
  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return;
    await supabase.from("cart").update({ quantity: qty }).eq("id", id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  /** Delete item */
  const deleteItem = async (id: string) => {
    await supabase.from("cart").delete().eq("id", id);
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /** ✅ Checkout -> simpan checkout_data lalu pindah ke halaman checkout */
  const checkout = async () => {
    const selectedItems = cart.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      Alert.alert("Pilih produk dulu");
      return;
    }

    // total aman dari item terpilih
    const totalPrice = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      setLoading(true);

      // simpan data untuk halaman checkout
      await AsyncStorage.setItem(
        "checkout_data",
        JSON.stringify({
          user_id: USER_ID,
          items: selectedItems.map((i) => ({
            id: i.id, // cart row id (untuk delete saat confirm)
            product_id: i.product_id,
            name: i.name,
            price: i.price, // number
            quantity: i.quantity,
            image: i.image, // nama file (opsional)
          })),
          total: totalPrice,
        })
      );

      // pindah ke checkout
      router.push("/checkout" as any);
    } catch (err) {
      console.log("Checkout store error:", err);
      Alert.alert("Gagal", "Tidak bisa lanjut ke checkout.");
    } finally {
      setLoading(false);
    }
  };

  /** Render item */
  const renderItem = ({ item }: { item: CartItem }) => (
    <View
      style={{
        flexDirection: "row",
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 12,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
        alignItems: "center",
      }}
    >
      {/* Checkbox */}
      <TouchableOpacity onPress={() => toggleSelect(item.id, !item.selected)}>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#6f4e37",
            backgroundColor: item.selected ? "#6f4e37" : "transparent",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          {item.selected && (
            <ThemedText style={{ color: "#fff", fontSize: 16 }}>✓</ThemedText>
          )}
        </View>
      </TouchableOpacity>

      {/* Thumbnail */}
      <Image
        source={imageMap[item.image]}
        style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
      />

      {/* Info */}
      <View style={{ flex: 1 }}>
        <ThemedText style={{ fontWeight: "bold", fontSize: 16 }}>
          {item.name}
        </ThemedText>
        <ThemedText style={{ color: "#6f4e37", marginVertical: 4 }}>
          Rp {item.price.toLocaleString("id-ID")}
        </ThemedText>

        {/* Quantity + Hapus */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
          <TouchableOpacity
            onPress={() => updateQty(item.id, item.quantity - 1)}
            style={{ padding: 6 }}
          >
            <ThemedText>➖</ThemedText>
          </TouchableOpacity>

          <ThemedText style={{ marginHorizontal: 12 }}>
            {item.quantity}
          </ThemedText>

          <TouchableOpacity
            onPress={() => updateQty(item.id, item.quantity + 1)}
            style={{ padding: 6 }}
          >
            <ThemedText>➕</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteItem(item.id)} style={{ marginLeft: 20 }}>
            <ThemedText style={{ color: "#e63946", fontWeight: "bold" }}>
              Hapus
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, backgroundColor: "#f8f4f0" }}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 12 }}
      />

      {/* Total & Checkout */}
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderColor: "#ddd",
          backgroundColor: "#fff",
        }}
      >
        <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
          Total: Rp {total.toLocaleString("id-ID")}
        </ThemedText>

        <TouchableOpacity
          onPress={checkout}
          disabled={loading || total === 0}
          style={{
            backgroundColor: "#6f4e37",
            padding: 14,
            borderRadius: 12,
            marginTop: 10,
            opacity: loading || total === 0 ? 0.6 : 1,
          }}
        >
          <ThemedText style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            {loading ? "Memproses..." : "Checkout"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
