import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f2ec",
    padding: 20,
  },
  backBtn: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: "#4b2e05",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginVertical: 20,
  },
  settingItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
  settingSubText: {
    fontSize: 15,
    color: "#666",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#e57373",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
