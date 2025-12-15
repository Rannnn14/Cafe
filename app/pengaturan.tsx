import { useRouter } from "expo-router";
import React, { useState } from "react";
import { styles } from "./../components/styles/pengaturan.styles";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PengaturanScreen() {
  const router = useRouter();
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah kamu yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Ya", onPress: () => router.replace("/") },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
      </TouchableOpacity>

      <Text style={styles.title}>Pengaturan</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Notifikasi</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Versi Aplikasi</Text>
        <Text style={styles.settingSubText}>v1.0.0</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}


