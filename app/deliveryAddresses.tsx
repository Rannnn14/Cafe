import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../components/styles/deliveryAddresses.styles";

type AddressKey = "home" | "office";

type AddressItem = {
  key: AddressKey;
  title: string;
  address: string;
};

const STORAGE_KEY = "delivery_addresses_v1";

export default function DeliveryAddressesScreen() {
  const [addresses, setAddresses] = useState<AddressItem[]>([
    { key: "home", title: "Home", address: "Jl. Kenanga No. 21, Cirebon Timur" },
    { key: "office", title: "Office", address: "Jl. Ahmad Yani No. 88, Kota Cirebon" },
  ]);

  const [selectedKey, setSelectedKey] = useState<AddressKey>("home");

  // overlay state
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState<AddressKey>("home");
  const [tempTitle, setTempTitle] = useState("");
  const [tempAddress, setTempAddress] = useState("");

  // ===== load saved addresses
  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.addresses) setAddresses(parsed.addresses);
        if (parsed?.selectedKey) setSelectedKey(parsed.selectedKey);
      } catch {}
    };
    load();
  }, []);

  const persist = async (nextAddresses: AddressItem[], nextSelected: AddressKey) => {
    setAddresses(nextAddresses);
    setSelectedKey(nextSelected);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ addresses: nextAddresses, selectedKey: nextSelected })
    );
  };

  const openOverlay = (key: AddressKey) => {
    const current = addresses.find((a) => a.key === key);
    setEditingKey(key);
    setTempTitle(current?.title ?? "");
    setTempAddress(current?.address ?? "");
    setShowModal(true);
  };

  const saveChanges = async () => {
    if (tempTitle.trim().length < 2) return;
    if (tempAddress.trim().length < 5) return;

    const next = addresses.map((a) =>
      a.key === editingKey ? { ...a, title: tempTitle.trim(), address: tempAddress.trim() } : a
    );

    await persist(next, selectedKey);
    setShowModal(false);
  };

  const setDefault = async () => {
    await persist(addresses, editingKey);
    setShowModal(false);
  };

  const Card = ({ item }: { item: AddressItem }) => {
    const active = item.key === selectedKey;

    return (
      <TouchableOpacity
        style={[styles.card, active && styles.cardActive]}
        onPress={() => openOverlay(item.key)}
        activeOpacity={0.8}
      >
        <View style={styles.cardLeft}>
          <Ionicons
            name={item.key === "home" ? "home-outline" : "business-outline"}
            size={22}
            color="#C36A2D"
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.address}</Text>
          </View>
        </View>

        {active ? (
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        ) : (
          <View style={styles.checkCircleOff} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header model "← Profile" */}
      <View style={styles.simpleHeader}>
        <TouchableOpacity style={styles.simpleBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#4b2e05" />
          <Text style={styles.simpleTitle}>Delivery Addresses</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        {addresses.map((a) => (
          <Card key={a.key} item={a} />
        ))}
      </View>

      {/* OVERLAY */}
      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowModal(false)}>
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <Text style={styles.modalTitle}>Setting Alamat</Text>

            <Text style={styles.label}>Nama</Text>
            <TextInput
              value={tempTitle}
              onChangeText={setTempTitle}
              placeholder="Contoh: Home"
              style={styles.input}
            />

            <Text style={styles.label}>Alamat</Text>
            <TextInput
              value={tempAddress}
              onChangeText={setTempAddress}
              placeholder="Isi alamat lengkap"
              style={[styles.input, { height: 90, textAlignVertical: "top" }]}
              multiline
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={saveChanges}>
              <Text style={styles.primaryBtnText}>Simpan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={setDefault}>
              <Text style={styles.secondaryBtnText}>Jadikan Default</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
