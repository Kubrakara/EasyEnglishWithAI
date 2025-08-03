import Button from "@/components/Button";
import { COLORS } from "@/theme";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.background}>
      <View style={styles.card}>
        {/* Logo ve Başlık */}
        <View style={styles.header}>
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={require("assets/images/logo.png")}
              style={styles.logo}
            />
          </Animated.View>
          <Text style={styles.title}>Easy English</Text>
          <Text style={styles.subtitle}>
            Yapay zeka destekli İngilizce öğrenme platformuna hoş geldiniz!
          </Text>
        </View>

        {/* Açıklama */}
        <View style={styles.description}>
          <Text style={styles.descText}>
            Hızlı ve etkili bir şekilde İngilizce öğrenmeye başlayın.
          </Text>
        </View>

        {/* Butonlar */}
        <View style={styles.buttons}>
          <Button title="Giriş Yap" onPress={() => router.push("/login")} />
          <Button
            title="Kayıt Ol"
            onPress={() => router.push("/register")}
            variant="outline"
          />
        </View>
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
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
  },
  description: {
    marginVertical: 24,
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
  buttons: {
    width: "100%",
    gap: 16,
    marginTop: 16,
    flexDirection: "column",
  },
});
