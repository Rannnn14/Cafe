import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../components/styles/checkout.styles";

type Fulfillment = "delivery" | "dinein";
type PaymentMethod = "qris" | "va" | "kasir";

const USER_ID = "user1";
const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

type CheckoutItem = {
  id: string; // cart row id (buat delete nanti kalau kamu mau)
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CheckoutScreen() {
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [total, setTotal] = useState(0);

  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [address, setAddress] = useState("");
  const [dineInNote, setDineInNote] = useState("");

  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const [orderCode, setOrderCode] = useState("");
  const [vaNumber, setVaNumber] = useState("");
  const [qrisPayload, setQrisPayload] = useState("");

  const [saving, setSaving] = useState(false);

  // ===============================
  // LOAD CHECKOUT DATA
  // ===============================
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem("checkout_data");
        if (!stored) {
          Alert.alert("Checkout kosong", "Kembali ke keranjang dulu ya.");
          router.back();
          return;
        }
        const parsed = JSON.parse(stored);
        setItems(parsed.items ?? []);
        setTotal(parsed.total ?? 0);
      } catch (e) {
        Alert.alert("Error", "Gagal memuat data checkout.");
      }
    };

    load();
  }, []);

  const canProceed = useMemo(() => {
    if (!payment) return false;
    if (items.length === 0) return false;
    if (fulfillment === "delivery" && address.trim().length < 5) return false;
    return true;
  }, [payment, items.length, fulfillment, address]);

  // ===============================
  // BUAT PESANAN (HANYA GENERATE KODE + SHOW OVERLAY)
  // ===============================
  const handleCreateOrder = () => {
    if (!canProceed) {
      Alert.alert("Lengkapi dulu", "Pilih metode bayar dan isi data yang dibutuhkan.");
      return;
    }

    const stamp = Date.now().toString().slice(-6);
    const newOrderCode = `ORD-${stamp}`;
    const newVa = `12345${stamp}`;
    const newQris = `QRIS|ORDER=${newOrderCode}|TOTAL=${total}`;

    setOrderCode(newOrderCode);
    setVaNumber(newVa);
    setQrisPayload(newQris);

    setShowOverlay(true);
  };

  // ===============================
  // SIMPAN ORDER KE SUPABASE SAAT KLIK SELESAI
  // ===============================
  const saveOrderToSupabase = async () => {
    // insert 1 row per item (paling gampang dan sesuai tabel kamu sekarang)
    const rows = items.map((i) => ({
      user_id: USER_ID,
      name: i.name, // kalau kolom name ada
      product_id: i.product_id ?? null, // kalau kolom product_id ada
      price: i.price,
      quantity: i.quantity,
      order_code: orderCode, // kalau kolom order_code ada
      payment_method: payment ?? null, // kalau kolom payment_method ada
      fulfillment, // kalau kolom fulfillment ada
      address: fulfillment === "delivery" ? address : null, // kalau kolom address ada
      note: fulfillment === "dinein" ? dineInNote : null, // kalau kolom note ada
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("orders").insert(rows);
    if (error) throw error;
  };

  // ===============================
  // OVERLAY
  // ===============================
  const OverlayModal = () => {
    if (!payment) return null;

    const title =
      payment === "qris"
        ? "QRIS"
        : payment === "va"
        ? "Virtual Account"
        : "Bayar di Kasir";

    return (
      <Modal
        transparent
        animationType="fade"
        visible={showOverlay}
        presentationStyle="overFullScreen"
        statusBarTranslucent
        onRequestClose={() => setShowOverlay(false)}
      >
        {/* background */}
        <Pressable style={styles.overlay} onPress={() => setShowOverlay(false)}>
          {/* box */}
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalText}>Total: {formatRp(total)}</Text>

            {payment === "qris" && (
              <View style={{ alignItems: "center", marginTop: 14 }}>
                <View style={styles.fakeQr}>
                  <Text style={styles.fakeQrText}>QRIS</Text>
                  <Text style={styles.fakeQrSub}>{orderCode}</Text>
                  <Text style={[styles.fakeQrSub, { marginTop: 8 }]}>
                    {qrisPayload}
                  </Text>
                </View>
              </View>
            )}

            {payment === "va" && (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.modalText}>Kode Virtual Account</Text>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{vaNumber}</Text>
                </View>
              </View>
            )}

            {payment === "kasir" && (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.modalText}>Kode Pesanan</Text>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{orderCode}</Text>
                </View>
                <Text style={[styles.modalText, { marginTop: 8 }]}>
                  Tunjukkan kode ini ke kasir.
                </Text>
              </View>
            )}

            {/* ✅ SELESAI = simpan ke supabase */}
            <TouchableOpacity
              style={[styles.closeBtn, saving && { opacity: 0.6 }]}
              disabled={saving}
              onPress={async () => {
                try {
                  setSaving(true);
                  await saveOrderToSupabase();
                  await AsyncStorage.removeItem("checkout_data");
                  setShowOverlay(false);
                  router.replace("/orderHistory" as any);
                } catch (e) {
                  console.log("save order error:", e);
                  Alert.alert("Gagal", "Pesanan gagal disimpan ke history.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <Text style={styles.closeText}>
                {saving ? "Menyimpan..." : "Selesai"}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER model: ← Checkout */}
      <View style={styles.simpleHeader}>
        <TouchableOpacity
          style={styles.simpleBack}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#4b2e05" />
          <Text style={styles.simpleTitle}>Checkout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* DETAIL PESANAN */}
        <View style={styles.section}>
          <Text style={styles.title}>Detail Pesanan</Text>

          {items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.rowLeft}>
                {item.name} x{item.quantity}
              </Text>
              <Text style={styles.rowRight}>
                {formatRp(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <Text style={styles.total}>Total: {formatRp(total)}</Text>
        </View>

        {/* PILIHAN */}
        <View style={styles.section}>
          <Text style={styles.title}>Pilihan</Text>

          <View style={styles.choiceRow}>
            <TouchableOpacity
              style={[
                styles.choiceBtn,
                fulfillment === "delivery" && styles.choiceBtnActive,
              ]}
              onPress={() => setFulfillment("delivery")}
            >
              <Text
                style={[
                  styles.choiceText,
                  fulfillment === "delivery" && styles.choiceTextActive,
                ]}
              >
                Delivery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choiceBtn,
                fulfillment === "dinein" && styles.choiceBtnActive,
              ]}
              onPress={() => setFulfillment("dinein")}
            >
              <Text
                style={[
                  styles.choiceText,
                  fulfillment === "dinein" && styles.choiceTextActive,
                ]}
              >
                Dine In
              </Text>
            </TouchableOpacity>
          </View>

          {fulfillment === "delivery" ? (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Alamat Rumah</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan alamat untuk delivery"
                value={address}
                onChangeText={setAddress}
              />
            </View>
          ) : (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Catatan Caffe (opsional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: meja 3 / outlet A"
                value={dineInNote}
                onChangeText={setDineInNote}
              />
            </View>
          )}
        </View>

        {/* PEMBAYARAN */}
        <View style={styles.section}>
          <Text style={styles.title}>Metode Pembayaran</Text>

          <TouchableOpacity
            style={[
              styles.paymentBtn,
              payment === "qris" && styles.paymentBtnActive,
            ]}
            onPress={() => setPayment("qris")}
          >
            <Text style={styles.paymentText}>QRIS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentBtn,
              payment === "va" && styles.paymentBtnActive,
            ]}
            onPress={() => setPayment("va")}
          >
            <Text style={styles.paymentText}>Virtual Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentBtn,
              payment === "kasir" && styles.paymentBtnActive,
            ]}
            onPress={() => setPayment("kasir")}
          >
            <Text style={styles.paymentText}>Bayar ke Kasir</Text>
          </TouchableOpacity>

          {/* ✅ tombol bawah jadi Buat Pesanan */}
          <TouchableOpacity
            style={[styles.primaryBtn, !canProceed && styles.primaryBtnDisabled]}
            disabled={!canProceed}
            onPress={handleCreateOrder}
          >
            <Text style={styles.primaryBtnText}>Buat Pesanan</Text>
          </TouchableOpacity>

          {!canProceed && (
            <Text style={styles.helperText}>
              {!payment
                ? "Pilih metode pembayaran dulu."
                : fulfillment === "delivery" && address.trim().length < 5
                ? "Isi alamat delivery dulu."
                : ""}
            </Text>
          )}
        </View>

        <OverlayModal />
      </ScrollView>
    </View>
  );
}
