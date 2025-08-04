import { COLORS } from "@/theme";
import React from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const handleLogout = () => {
    Alert.alert("Çıkış", "Çıkış yapmak istediğinize emin misiniz?", [
      { text: "İptal" },
      {
        text: "Evet",
        onPress: () => {
          // TODO: Logout işlemi yapılacak
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 52 : 52,
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
