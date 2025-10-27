import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EDE3",
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3B302A",
    marginBottom: 20,
    textAlign: "center",
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 35,
    alignItems: "center",
  },
  methodText: {
    flex: 1,
    marginLeft: 10,
  },
  methodType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B302A",
  },
  methodDetails: {
    fontSize: 12,
    color: "#7D6B5D",
  },
  addButton: {
    backgroundColor: "#C36A2D",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 15,
  },
  addText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
});
