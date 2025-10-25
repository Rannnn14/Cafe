import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfilScreen() {
  const [name, setName] = useState("Faqih Firansyah");
  const [email, setEmail] = useState("faqih@example.com");
  const [bio, setBio] = useState("Pecinta kopi dan suasana santai ☕");

  const loadProfile = async () => {
    try {
      const savedName = await AsyncStorage.getItem("user_name");
      const savedEmail = await AsyncStorage.getItem("user_email");
      const savedBio = await AsyncStorage.getItem("user_bio");

      if (savedName) setName(savedName);
      if (savedEmail) setEmail(savedEmail);
      if (savedBio) setBio(savedBio);
    } catch (err) {
      console.log("Error loading profile:", err);
    }
  };

  // Jalankan sekali saat mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Juga jalankan tiap kali layar difokuskan
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
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("@/assets/images/avatar.png")}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>

          {/* tampilkan bio jika ada */}
          {bio ? <Text style={styles.bio}>{bio}</Text> : null}

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("../editProfil")}
          >
            <Text style={styles.editText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/favorites")}
        >
          <Text style={styles.menuText}>❤️ Favorit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/keranjang")}
        >
          <Text style={styles.menuText}>🛒 Keranjang</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigateTo("/pengaturan")}
        >
          <Text style={styles.menuText}>⚙️ Pengaturan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EDE3",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3B302A",
  },
  email: {
    fontSize: 14,
    color: "#7D6B5D",
  },
  bio: {
    fontSize: 13,
    color: "#5C4B44",
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  editBtn: {
    backgroundColor: "#300f00ff",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,

  },
  editText: {
    color: "white",
    fontWeight: "bold",
  },
  menuItem: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 6,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  menuText: {
    fontSize: 16,
    color: "#3B302A",
  },
});
