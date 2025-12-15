import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { styles } from "./../components/styles/edit-profil.styles";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

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


