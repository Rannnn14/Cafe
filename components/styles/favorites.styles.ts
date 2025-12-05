import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 80) / 4;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f2ec',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#3e2723',
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: cardSize,
    height: cardSize + 40,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: cardSize - 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  name: {
    fontWeight: '600',
    color: '#4b2e05',
    fontSize: 11,
  },
  price: {
    color: '#9c7b56',
    fontSize: 11,
    fontWeight: '500',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#300f00ff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#300f00ff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});