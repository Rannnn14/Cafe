import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const USER_ID = "user1";

type OrderRow = {
  id: string;
  name: string | null;
  price: number;
  quantity: number;
  created_at: string;
  order_code: string | null;
};

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id,name,price,quantity,created_at,order_code")
      .eq("user_id", USER_ID)
      .order("created_at", { ascending: false });

    if (!error) setOrders((data as OrderRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f4f0" }}>
      {/* HEADER model: ← Profile / History */}
      <View style={{ padding: 16, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={22} color="#4b2e05" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "800", color: "#4b2e05" }}>
          Order History
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(i) => i.id}
        refreshing={loading}
        onRefresh={loadOrders}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 14,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: "800", fontSize: 16 }}>
              {item.name ?? "Menu"}
            </Text>

            <Text style={{ marginTop: 4 }}>
              Qty: {item.quantity} • Rp {(item.price * item.quantity).toLocaleString("id-ID")}
            </Text>

            {item.order_code ? (
              <Text style={{ marginTop: 4, color: "#666" }}>
                Order: {item.order_code}
              </Text>
            ) : null}

            <Text style={{ marginTop: 4, color: "#666" }}>
              {new Date(item.created_at).toLocaleString("id-ID")}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
