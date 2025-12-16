import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../components/styles/profil.styles";

const usernameFromEmail = (email: string) => {
  if (!email) return "User";
  return email.split("@")[0] || "User";
};

export default function ProfilScreen() {
  const [name, setName] = useState<string>("User");
  const [email, setEmail] = useState<string>("");

  const loadProfile = async () => {
    try {
      // ✅ Supabase v1
      const user = supabase.auth.user();

      if (!user) {
        setName("Guest");
        setEmail("");
        return;
      }

      const authEmail = user.email ?? "";
      setEmail(authEmail);

      // ambil dari profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      // kalau error atau row belum ada, fallback nama dari email
      const fullName = !error ? (profile?.full_name ?? "") : "";
      const profileEmail = !error ? (profile?.email ?? "") : "";

      const finalEmail = profileEmail || authEmail;
      const finalName = fullName && fullName.trim().length > 0
        ? fullName
        : usernameFromEmail(finalEmail);

      setName(finalName);
      setEmail(finalEmail);

      // ✅ cache per-user biar gak ketuker
      await AsyncStorage.setItem("profile_user_id", user.id);
      await AsyncStorage.setItem("user_name", finalName);
      await AsyncStorage.setItem("user_email", finalEmail);
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
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("@/assets/images/avatar.png")}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email || "-"}</Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/editProfil" as any)}
          >
            <Text style={styles.editText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

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
