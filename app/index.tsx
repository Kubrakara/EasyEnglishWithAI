import Button from "@/components/Button";
import { COLORS } from "@/theme";
import { supabase } from "@/utils/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const welcomeTextAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Önce Supabase session kontrolü yap
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.log("Session kontrolü hatası:", sessionError.message);
        }

        if (session) {
          // Kullanıcı oturum açmış, ana sayfaya yönlendir
          console.log("Kullanıcı oturum açmış, ana sayfaya yönlendiriliyor");
          router.replace("/home");
          return;
        }

        // Session yoksa, ilk açılış kontrolü yap
        const isFirstLaunch = await AsyncStorage.getItem("isFirstLaunch");
        console.log("İlk açılış kontrolü:", isFirstLaunch);
        
        if (isFirstLaunch === null) {
          // İlk açılış - hoşgeldin ekranını göster
          console.log("İlk açılış tespit edildi, hoşgeldin ekranı gösteriliyor");
          await AsyncStorage.setItem("isFirstLaunch", "false");
        }

        // İlk açılış değil, hoşgeldin ekranını göster
        console.log("İlk açılış değil, hoşgeldin ekranı gösteriliyor");
        setLoading(false);
        startAnimations();
        
      } catch (error) {
        console.error("Kullanıcı durumu kontrolü hatası:", error);
        // Hata durumunda da hoşgeldin ekranını göster
        setLoading(false);
        startAnimations();
      }
    };

    checkUserStatus();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowWelcomeText(true);
      Animated.timing(welcomeTextAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.background}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
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
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles.title}>Easy English</Text>
          <Text style={styles.slogan}>İngilizce öğrenmenin en kolay yolu!</Text>
        </View>

        {/* Animasyonlu hoşgeldin mesajı */}
        {showWelcomeText && (
          <Animated.Text
            style={[
              styles.welcomeText,
              {
                opacity: welcomeTextAnim,
                transform: [
                  {
                    scale: welcomeTextAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            Hoşgeldiniz! Başlamak için aşağıdaki seçeneklerden birini seçin.
          </Animated.Text>
        )}

        {/* Butonlar */}
        <View style={styles.buttons}>
          <Button title="Giriş Yap" onPress={() => router.push("/login")} />
          <View style={{ height: 16 }} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 32,
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
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
    marginBottom: 6,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  slogan: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 24,
  },
  buttons: {
    width: "100%",
  },
});
