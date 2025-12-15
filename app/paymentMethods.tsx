import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { styles } from "./../components/styles/payment.styles";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PaymentMethodsScreen() {
  const [methods, setMethods] = useState([
    { id: "1", type: "Credit Card", details: "Visa **** 1234", selected: true },
    { id: "2", type: "E-Wallet", details: "GoPay - 0812****9988", selected: false },
    { id: "3", type: "Bank Transfer", details: "BCA - 9876543210", selected: false },
  ]);

  const handleSelect = (id: string) => {
    setMethods((prev) =>
      prev.map((item) => ({ ...item, selected: item.id === id }))
    );
  };

  const handleAddMethod = () => {
    Alert.alert("Add Payment", "Fitur ini akan segera tersedia 💳");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Payment Methods</Text>

      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.methodItem,
              item.selected && { borderColor: "#C36A2D", borderWidth: 1.5 },
            ]}
            onPress={() => handleSelect(item.id)}
          >
            <View style={styles.iconContainer}>
              {item.type === "Credit Card" && (
                <MaterialIcons name="credit-card" size={24} color="#C36A2D" />
              )}
              {item.type === "E-Wallet" && (
                <Ionicons name="wallet-outline" size={24} color="#C36A2D" />
              )}
              {item.type === "Bank Transfer" && (
                <MaterialIcons name="account-balance" size={24} color="#C36A2D" />
              )}
            </View>
            <View style={styles.methodText}>
              <Text style={styles.methodType}>{item.type}</Text>
              <Text style={styles.methodDetails}>{item.details}</Text>
            </View>
            {item.selected && (
              <Ionicons name="checkmark-circle" size={22} color="#C36A2D" />
            )}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddMethod}>
        <Ionicons name="add-circle-outline" size={20} color="white" />
        <Text style={styles.addText}>Add New Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
}


