import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

// ✅ sesuaikan kalau nama file styles kamu beda
import { styles } from "../components/styles/edit-profil.styles";

export default function EditProfilScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // ✅ baru
  const [bio, setBio] = useState("");     // ✅ baru
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    try {
      // ✅ Supabase v1
      const user = supabase.auth.user();
      if (!user) {
        Alert.alert("Kamu belum login");
        router.replace("/(tabs)/profil" as any);
        return;
      }

      // email dari auth (biar selalu sesuai login)
      const authEmail = user.email ?? "";
      setEmail(authEmail);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name, email, phone, bio")
        .eq("id", user.id)
        .single();

      // Kalau belum ada row profile, biarin kosong (nanti upsert pas save)
      if (error) {
        setFullName(authEmail ? authEmail.split("@")[0] : "");
        setPhone("");
        setBio("");
        return;
      }

      setFullName(profile?.full_name ?? (authEmail ? authEmail.split("@")[0] : ""));
      setEmail(profile?.email ?? authEmail);

      // ✅ default kosong kalau null
      setPhone(profile?.phone ?? "");
      setBio(profile?.bio ?? "");
    } catch (err) {
      console.log("loadProfile error:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const user = supabase.auth.user();
      if (!user) {
        Alert.alert("Kamu belum login");
        return;
      }

      setLoading(true);

      // ✅ upsert biar aman kalau row profiles belum ada
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            full_name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(), // ✅ baru
            bio: bio.trim(),     // ✅ baru
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      // cache biar profile screen cepet kebaca
      await AsyncStorage.setItem("user_name", fullName.trim());
      await AsyncStorage.setItem("user_email", email.trim());

      Alert.alert("Sukses", "Profil berhasil diperbarui");
      router.back(); // balik ke profile
    } catch (err: any) {
      console.log("save profile error:", err);
      Alert.alert("Gagal", err?.message ?? "Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Edit Profil</Text>

        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          placeholder="Nama kamu"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* ✅ Nomor Telepon */}
        <Text style={styles.label}>Nomor Telepon</Text>
        <TextInput
          style={styles.input}
          placeholder="08xxxxxxxxxx"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* ✅ Bio */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 120, textAlignVertical: "top" }]}
          placeholder="Tulis bio kamu..."
          value={bio}
          onChangeText={setBio}
          multiline
        />

        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Batal</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
