import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditProfilScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    // Ambil data dari penyimpanan saat halaman dibuka
    const loadProfile = async () => {
      const savedName = await AsyncStorage.getItem("user_name");
      const savedEmail = await AsyncStorage.getItem("user_email");
      const savedBio = await AsyncStorage.getItem("user_bio");

      if (savedName) setName(savedName);
      if (savedEmail) setEmail(savedEmail);
      if (savedBio) setBio(savedBio);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem("user_name", name);
      await AsyncStorage.setItem("user_email", email);
      await AsyncStorage.setItem("user_bio", bio);
      Alert.alert("Profil Disimpan", "Perubahan profil kamu berhasil disimpan!");
      router.back(); // kembali ke halaman profil
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan profil!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profil</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Masukkan nama lengkap"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Masukkan email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tulis sesuatu tentang kamu..."
          multiline
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Simpan Perubahan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Batal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F6EFE8",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3B2F2F",
    textAlign: "center",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3B2F2F",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  saveBtn: {
    backgroundColor: "#6B4F4F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelBtn: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#A33",
    fontWeight: "600",
  },
});
