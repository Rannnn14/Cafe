import { StyleSheet } from "react-native";
import {
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 80) / 4; // 4 kolom

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f2ec', paddingHorizontal: 16, paddingTop: 40 },
  headerContainer: { position: 'relative', marginBottom: 16 },
  headerImage: { width: '100%', height: 180, borderRadius: 20, marginBottom: 12 },
  headerText: { textAlign: 'center', fontWeight: '700', fontSize: 22, color: '#3e2723' },

  cartIconContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
  cartBadge: {
    position: 'absolute',
    right: 4,
    top: 2,
    backgroundColor: '#e63946',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { justifyContent: 'space-between' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: cardSize,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: { width: '100%', height: cardSize - 20 },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 4,
    borderRadius: 12,
  },
  infoContainer: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 6,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  name: { fontWeight: '700', color: '#4b2e05', fontSize: 13 },
  price: { color: '#9c7b56', fontSize: 12, fontWeight: '600', marginTop: 2 },
  cartBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4b2e05',
    borderRadius: 12,
    paddingVertical: 4,
    marginHorizontal: 6,
    marginBottom: 6,
  },
  cartBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});