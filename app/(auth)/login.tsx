import Button from "@/components/Button";
import { COLORS } from "@/theme";
import { saveTokens } from "@/utils/authTokens";
import { API_BASE_URL } from "@/utils/apiConfig";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Giriş Başarısız", "Lütfen e-posta ve şifre alanlarını doldurun.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Sunucudan gelen hata mesajını kullan, yoksa genel bir mesaj göster
        throw new Error(data.message || "E-posta veya şifre hatalı.");
      }

      // accessToken ve refreshToken'ı güvenli şekilde sakla
      if (data.accessToken && data.refreshToken) {
        await saveTokens(data.accessToken, data.refreshToken);
      } else {
        throw new Error("Token alınamadı. Lütfen tekrar deneyin.");
      }
      
      // Başarılı giriş sonrası ana ekrana yönlendir
      router.replace("/(tabs)/home");

    } catch (error: any) {
      let errorMessage = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      if (error.message.includes("Network request failed")) {
        errorMessage = "İnternet bağlantınızı kontrol edin.";
      } else {
        errorMessage = error.message;
      }
      Alert.alert("Hata", errorMessage);
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Giriş Yap</Text>

          <TextInput
            placeholder="E-posta"
            placeholderTextColor={COLORS.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            editable={!loading}
          />

          <TextInput
            placeholder="Şifre"
            placeholderTextColor={COLORS.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />

          <View style={styles.buttonContainer}>
            <Button title="Giriş Yap" onPress={handleLogin} loading={loading} />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            disabled={loading}
            style={styles.registerButton}
          >
            <Text style={styles.registerText}>
              Hesabın yok mu? <Text style={styles.registerLink}>Kayıt Ol</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: COLORS.background,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
  },
  registerButton: {
    marginTop: 24,
  },
  registerText: {
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
});