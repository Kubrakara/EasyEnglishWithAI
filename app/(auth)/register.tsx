import Button from "@/components/Button";
import { COLORS } from "@/theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    // TODO: Backend bağlantısı sonrası gerçek kayıt işlemi yapılacak
    router.replace("/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.background}>
      <View style={styles.card}>
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.title}>Kayıt Ol</Text>
        </View>

        {/* Açıklama */}
        <View style={styles.description}>
          <Text style={styles.descText}>
            Hemen kaydol ve İngilizce öğrenmeye bugün başla.
          </Text>
        </View>

        {/* Form */}
        <TextInput
          placeholder="E-posta"
          placeholderTextColor={COLORS.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Şifre"
          placeholderTextColor={COLORS.gray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          placeholder="Şifre Tekrar"
          placeholderTextColor={COLORS.gray}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />

        {/* Buton */}
        <View style={styles.buttons}>
          <Button title="Kayıt Ol" onPress={handleRegister} />
        </View>

        {/* Giriş Linki */}
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>
            Zaten hesabın var mı?{" "}
            <Text style={styles.loginLink}>Giriş Yap</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 24,
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 32,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    alignItems: "center",
    borderColor: "rgba(226, 232, 240, 0.5)",
    borderWidth: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  description: {
    marginTop: 0,
    marginBottom: 28,
    width: "100%",
    alignItems: "center",
  },
  descText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 24,
    maxWidth: "90%",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  buttons: {
    width: "100%",
    gap: 16,
    marginTop: 16,
    flexDirection: "column",
  },
  loginText: {
    marginTop: 24,
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
