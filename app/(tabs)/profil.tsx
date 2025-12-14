
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../components/styles/profil.styles";

export default function ProfilScreen() {
  const [name, setName] = useState("Lucas Matias");
  const [email, setEmail] = useState("lucas@email.com");

  const loadProfile = async () => {
    try {
      const savedName = await AsyncStorage.getItem("user_name");
      const savedEmail = await AsyncStorage.getItem("user_email");

      if (savedName) setName(savedName);
      if (savedEmail) setEmail(savedEmail);
    } catch (err) {
      console.log("Error loading profile:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Profile */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("@/assets/images/avatar.png")}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("../editProfil")}
          >
            <Text style={styles.editText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("/orderHistory")}
          >
            <MaterialIcons name="receipt-long" size={22} color="#C36A2D" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Order History</Text>
              <Text style={styles.menuSubtitle}>Orders information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9C8C84" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("/paymentMethods")}
          >
            <MaterialIcons name="payment" size={22} color="#C36A2D" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Payment Methods</Text>
              <Text style={styles.menuSubtitle}>Pay your bill</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9C8C84" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo("/deliveryAddresses")}
          >
            <Ionicons name="location-outline" size={22} color="#C36A2D" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Delivery Addresses</Text>
              <Text style={styles.menuSubtitle}>Your delivery location</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9C8C84" />
          </TouchableOpacity>
        </View>



      </ScrollView>
    </View>
  );
}


