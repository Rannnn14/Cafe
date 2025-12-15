import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
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