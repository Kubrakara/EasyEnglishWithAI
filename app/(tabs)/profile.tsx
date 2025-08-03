import { COLORS } from "@/theme";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const handleLogout = () => {
    Alert.alert("Çıkış", "Çıkış yapmak istediğinize emin misiniz?", [
      { text: "İptal" },
      {
        text: "Evet",
        onPress: () => {
          /* Logout işlemi */
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Kullanıcı Adı:</Text>
        <Text style={styles.value}>Kubra Kara</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>E-posta:</Text>
        <Text style={styles.value}>kubra@example.com</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
    color: COLORS.text,
  },
  infoBox: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.textLight,
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
