import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f4f0",
  },
simpleHeader: {
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: "#fff",
},

simpleBack: {
  flexDirection: "row",
  alignItems: "center",
},

simpleTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginLeft: 8,
  color: "#4b2e05",
},

card: {
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 14,
  marginTop: 12,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

cardActive: {
  borderWidth: 1.5,
  borderColor: "#C36A2D",
},

cardLeft: {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
},

cardTitle: {
  fontWeight: "800",
  fontSize: 15,
  color: "#333",
},

cardSub: {
  marginTop: 2,
  color: "#777",
  fontSize: 12,
},

checkCircle: {
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: "#C36A2D",
  justifyContent: "center",
  alignItems: "center",
},

checkCircleOff: {
  width: 22,
  height: 22,
  borderRadius: 11,
  borderWidth: 1,
  borderColor: "#ddd",
},

overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "center",
  padding: 20,
},

modalBox: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 16,
},

modalTitle: {
  fontSize: 18,
  fontWeight: "800",
  marginBottom: 12,
  color: "#4b2e05",
},

label: {
  fontSize: 12,
  fontWeight: "700",
  marginTop: 10,
  marginBottom: 6,
  color: "#4b2e05",
},

input: {
  borderWidth: 1,
  borderColor: "#eee",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  backgroundColor: "#fafafa",
},

primaryBtn: {
  backgroundColor: "#111",
  borderRadius: 12,
  paddingVertical: 12,
  marginTop: 14,
  alignItems: "center",
},

primaryBtnText: {
  color: "#fff",
  fontWeight: "800",
},

secondaryBtn: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 12,
  paddingVertical: 12,
  marginTop: 10,
  alignItems: "center",
},

secondaryBtnText: {
  color: "#333",
  fontWeight: "800",
},

cancelText: {
  textAlign: "center",
  color: "#e63946",
  fontWeight: "700",
  marginTop: 12,
},
});