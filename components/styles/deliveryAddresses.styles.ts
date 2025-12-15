import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EDE3",
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3B302A",
    marginBottom: 20,
    textAlign: "center",
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 35,
    alignItems: "center",
  },
  addressText: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B302A",
  },
  detail: {
    fontSize: 12,
    color: "#7D6B5D",
  },
  addButton: {
    backgroundColor: "#C36A2D",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 15,
  },
  addText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
});