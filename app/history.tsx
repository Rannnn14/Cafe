import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const USER_ID = "user1";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", USER_ID)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, []);

  return (
    <FlatList
      data={orders}
      keyExtractor={(i) => i.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: "#fff",
            padding: 14,
            marginBottom: 12,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            {item.name} x{item.quantity}
          </Text>
          <Text>Rp {item.price.toLocaleString("id-ID")}</Text>
          <Text>Order: {item.order_code}</Text>
          <Text>Rating: {item.rating ? "⭐".repeat(item.rating) : "-"}</Text>
        </View>
      )}
    />
  );
}
