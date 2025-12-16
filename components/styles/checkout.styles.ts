import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },

  rowLeft: { color: "#111" },
  rowRight: { color: "#111", fontWeight: "800" },

  total: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
  },

  // choice
  choiceRow: { flexDirection: "row", gap: 10 },

  choiceBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },

  choiceBtnActive: {
    backgroundColor: "#111",
    borderColor: "#111",
  },

  choiceText: {
    textAlign: "center",
    fontWeight: "800",
    color: "#111",
  },

  choiceTextActive: { color: "#fff" },

  label: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    color: "#222",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },

  // payment
  paymentBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginTop: 10,
  },

  paymentBtnActive: {
    borderColor: "#111",
    backgroundColor: "#f7f7f7",
  },

  paymentText: { fontSize: 14, fontWeight: "800", color: "#111" },

  // primary button
  primaryBtn: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
  },

  primaryBtnDisabled: { opacity: 0.45 },

  primaryBtnText: { color: "#fff", fontWeight: "900", fontSize: 14 },

  helperText: { marginTop: 10, fontSize: 12, color: "#666" },

  // overlay
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  modalBox: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: { fontSize: 16, fontWeight: "900", color: "#111" },
  modalText: { fontSize: 13, color: "#333", marginTop: 8 },

  codeBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  codeText: { fontSize: 16, fontWeight: "900", letterSpacing: 1, color: "#111" },

  closeBtn: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
  },

  closeText: { color: "#fff", fontWeight: "900", fontSize: 14 },

  // fake QR
  fakeQr: {
    width: 220,
    minHeight: 220,
    borderWidth: 2,
    borderColor: "#111",
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },

  fakeQrText: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
    color: "#111",
  },

  fakeQrSub: { fontSize: 11, color: "#555", textAlign: "center" },
});
