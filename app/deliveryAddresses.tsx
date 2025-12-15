import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./../components/styles/deliveryAddresses.styles";

export default function DeliveryAddressesScreen() {
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      label: "Home",
      address: "Jl. Kenanga No. 21, Cirebon Timur",
      selected: true,
    },
    {
      id: "2",
      label: "Office",
      address: "Jl. Ahmad Yani No. 88, Kota Cirebon",
      selected: false,
    },
  ]);

  const handleSelect = (id: string) => {
    setAddresses((prev) =>
      prev.map((item) => ({ ...item, selected: item.id === id }))
    );
  };

  const handleAddAddress = () => {
    Alert.alert("Add Address", "Fitur tambah alamat akan segera tersedia 🏠");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Delivery Addresses</Text>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.addressItem,
              item.selected && { borderColor: "#C36A2D", borderWidth: 1.5 },
            ]}
            onPress={() => handleSelect(item.id)}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={item.label === "Home" ? "home-outline" : "business-outline"}
                size={24}
                color="#C36A2D"
              />
            </View>
            <View style={styles.addressText}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.detail}>{item.address}</Text>
            </View>
            {item.selected && (
              <Ionicons name="checkmark-circle" size={22} color="#C36A2D" />
            )}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
        <Ionicons name="add-circle-outline" size={20} color="white" />
        <Text style={styles.addText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}


