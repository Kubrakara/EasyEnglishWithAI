import Button from "@/components/Button";
import { COLORS } from "@/theme";
import { API_BASE_URL } from "@/utils/apiConfig";
import { saveTokens } from "@/utils/authTokens";
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

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (password !== confirmPassword) {
      Alert.alert("Kayıt Başarısız", "Şifreler eşleşmiyor. Lütfen kontrol edin.");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Kayıt Başarısız", "Lütfen geçerli bir e-posta adresi girin.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Kayıt Başarısız", "Şifreniz en az 6 karakter olmalıdır.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kayıt işlemi sırasında bir hata oluştu.");
      }

      // Otomatik giriş için token'ları kaydet
      if (data.accessToken && data.refreshToken) {
        await saveTokens(data.accessToken, data.refreshToken);
      } else {
        // Token yoksa, kullanıcıyı bilgilendir ve login sayfasına yönlendir
        Alert.alert(
          "Kayıt Başarılı",
          "Kaydınız tamamlandı. Lütfen giriş yapın."
        );
        router.replace("/(auth)/login");
        return;
      }

      // Başarılı kayıt ve token kaydı sonrası ana ekrana yönlendir
      router.replace("/(tabs)/home");

    } catch (error: any) {
      let errorMessage = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      if (error.message.includes("Network request failed")) {
        errorMessage = "İnternet bağlantınızı kontrol edin.";
      } else {
        errorMessage = error.message;
      }
      Alert.alert("Hata", errorMessage);
      console.error("Register Error:", error);
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
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={styles.subtitle}>
            Yeni bir dünya keşfetmek için ilk adımı at.
          </Text>

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
            placeholder="Şifre (en az 6 karakter)"
            placeholderTextColor={COLORS.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />

          <TextInput
            placeholder="Şifre Tekrar"
            placeholderTextColor={COLORS.gray}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />

          <View style={styles.buttonContainer}>
            <Button title="Kayıt Ol" onPress={handleRegister} loading={loading} />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            disabled={loading}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>
              Zaten bir hesabın var mı? <Text style={styles.loginLink}>Giriş Yap</Text>
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
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
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
  loginButton: {
    marginTop: 24,
  },
  loginText: {
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
});