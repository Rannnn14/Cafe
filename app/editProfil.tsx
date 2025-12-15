import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../components/styles/edit-profil.styles";
import { supabase } from "../lib/supabase";

export default function EditProfilScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // ===============================
  // LOAD PROFILE
  // ===============================
  useEffect(() => {
    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, bio")
        .limit(1)
        .single();

      if (error || !data) return;

      setProfileId(data.id);
      setName(data.full_name || "");
      setEmail(data.email || "");
      setBio(data.bio || "");
    };

    loadProfile();
  }, []);

  // ===============================
  // SAVE PROFILE
  // ===============================
  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert("Validasi", "Nama dan email wajib diisi");
      return;
    }

    try {
      setLoading(true);

      let error;

      if (profileId) {
        // UPDATE
        ({ error } = await supabase
          .from("profiles")
          .update({
            full_name: name,
            email: email,
            bio: bio,
            updated_at: new Date(),
          })
          .eq("id", profileId));
      } else {
        // INSERT
        ({ error } = await supabase.from("profiles").insert({
          full_name: name,
          email: email,
          bio: bio,
        }));
      }

      if (error) throw error;

      Alert.alert("Berhasil", "Profil berhasil disimpan");
      router.back();
    } catch (err) {
      console.log("SAVE ERROR:", err);
      Alert.alert("Gagal", "Gagal menyimpan profil");
    } finally {
      setLoading(false);
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
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={bio}
          onChangeText={setBio}
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Batal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
