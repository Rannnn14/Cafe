import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5f0',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    padding: 6,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
    color: '#3e2723',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#7d6b5a',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
  },
  info: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rank: {
    fontSize: 13,
    color: '#9c7b56',
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4b2e05',
  },
  price: {
    fontSize: 13,
    color: '#8b6f4e',
  },
  count: {
    fontSize: 12,
    color: '#6c5a45',
  },
});