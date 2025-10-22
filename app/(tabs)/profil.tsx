import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function ProfilScreen() {
  const handleEditProfile = () => {
    alert('Edit Profil clicked!');
  };

  const handleLogout = () => {
    alert('Logout clicked!');
  };

  const handleMenuClick = (menu: string) => {
    alert(`${menu} clicked!`);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Profil */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/avatar.png')}
            style={styles.avatar}
          />
          <ThemedText style={styles.name}>Faqih Firansyah</ThemedText>
          <ThemedText style={styles.email}>faqih@example.com</ThemedText>

          <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
            <ThemedText style={styles.editBtnText}>Edit Profil</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <ThemedText style={styles.logoutBtnText}>Logout</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Menu Profil */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuClick('Favorit')}>
            <ThemedText style={styles.menuText}>❤️ Favorit</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuClick('Keranjang')}>
            <ThemedText style={styles.menuText}>🛒 Keranjang</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuClick('Pengaturan')}>
            <ThemedText style={styles.menuText}>⚙️ Pengaturan</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f2ec',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  editBtn: {
    backgroundColor: '#4b2e05',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: '#e63946',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  menuContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
});
