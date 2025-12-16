import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
   container: {
    flexGrow: 1,
    backgroundColor: "#f8f4f0",
    padding: 20,
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
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