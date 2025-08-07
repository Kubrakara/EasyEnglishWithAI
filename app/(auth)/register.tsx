import Button from "@/components/Button";
import { COLORS } from "@/theme";
import { supabase } from "@/utils/supabaseClient";
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

// Kayıt sonrası kullanıcıyı veritabanına ekleyen fonksiyon
type UserPayload = { id: string; email: string };
const addUserToDatabase = async (user: UserPayload) => {
  if (!user) return;
  const { id, email } = user;
  const { error } = await supabase
    .from("users")
    .insert([{ id, email }]);
  if (error) {
    console.log("Kullanıcı eklenirken hata:", error.message);
  }
};

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor!");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    if (!password) {
      Alert.alert("Hata", "Lütfen şifre girin.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.0.103:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kayıt başarısız");
      }

      // Kayıt başarılıysa kullanıcıyı veritabanına ekle
      if (data && data.user) {
        await addUserToDatabase({ id: data.user.id, email: data.user.email });
      }

      router.replace("/login");
    
    } catch (error: any) {
      let message = error.message;
      if (message.includes("zaten kayıt olunmuş")) {
        message = "Bu e-posta ile zaten kayıt olunmuş.";
      } else if (message.includes("E-posta ve şifre alanları zorunludur")) {
        message = "E-posta ve şifre alanları zorunludur.";
      }
      Alert.alert("Hata", message || "Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.background}
        keyboardShouldPersistTaps="handled"
      >
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

          <TextInput
            placeholder="Şifre Tekrar"
            placeholderTextColor={COLORS.gray}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />

          {/* Buton */}
          <View style={styles.buttons}>
            <Button
              title="Kayıt Ol"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
            />
          </View>

          {/* Giriş Linki */}
          <TouchableOpacity
            onPress={() => router.push("/login")}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              Zaten hesabın var mı?{" "}
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
