import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityRole,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  const phrasalVerb = {
    id: "1",
    verb: "Break down",
    meaning: "To stop working (for machines) or to become very upset",
    example: "My car broke down on the way to work.",
  };

  const [isFavorite, setIsFavorite] = useState(false);
  const [learnedCount, setLearnedCount] = useState(24);
  const totalCount = 40;

  // Kalp ikonuna animasyon için değer
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Favori toggle animasyonlu
  const toggleFavorite = () => {
    // Animasyon
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setIsFavorite((prev) => {
      const newVal = !prev;
      // Modern toast / bildirim burada olmalı, demo için alert
      alert(
        newVal
          ? `${phrasalVerb.verb} favorilere eklendi!`
          : `${phrasalVerb.verb} favorilerden çıkarıldı!`
      );
      return newVal;
    });
  };

  const startTest = () => {
    router.push("../testscreen");
  };

  const goToList = () => {
    router.push("/phrasal");
  };

  // Sesli okuma fonksiyonu (expo-speech)
  const playSound = () => {
    Speech.speak(phrasalVerb.verb, { language: "en" });
  };

  // Animasyonlu progress bar genişliği
  const progressAnim = useRef(
    new Animated.Value((learnedCount / totalCount) * 100)
  ).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (learnedCount / totalCount) * 100,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [learnedCount]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Günün Phrasal Verbi</Text>
        <Text style={styles.subtitle}>Yeni kelime öğrenmeye hazır mısın?</Text>

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.verb}>{phrasalVerb.verb}</Text>
            <TouchableOpacity
              onPress={toggleFavorite}
              activeOpacity={0.7}
              accessibilityRole={"button" as AccessibilityRole}
              accessibilityLabel={
                isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"
              }
            >
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={28}
                  color={isFavorite ? COLORS.error : COLORS.primary}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          <Text style={styles.meaning}>{phrasalVerb.meaning}</Text>
          <Text style={styles.example}>Örnek: {phrasalVerb.example}</Text>

          <TouchableOpacity
            style={styles.listenButton}
            activeOpacity={0.7}
            onPress={playSound}
            accessibilityRole={"button"}
            accessibilityLabel={`Dinle: ${phrasalVerb.verb}`}
          >
            <Ionicons name="volume-high" size={22} color={COLORS.primary} />
            <Text style={styles.listenText}>Dinle</Text>
          </TouchableOpacity>
        </View>

        {/* İlerleme Kartı */}
        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            Öğrenilen Kelime: {learnedCount} / {totalCount}
          </Text>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Test Başlat Butonu */}
        <TouchableOpacity
          style={styles.testButton}
          activeOpacity={0.8}
          onPress={startTest}
          accessibilityRole={"button"}
          accessibilityLabel="Bugünün testine başla"
        >
          <Text style={styles.testButtonText}>Bugünün Testine Başla</Text>
        </TouchableOpacity>

        {/* Tüm Kelimeler Listesine Git */}
        <TouchableOpacity
          style={styles.listButton}
          activeOpacity={0.7}
          onPress={goToList}
          accessibilityRole={"button"}
          accessibilityLabel="Tüm phrasal verbler listesine git"
        >
          <Text style={styles.listButtonText}>Tüm Phrasal Verbler</Text>
        </TouchableOpacity>

        {/* Günlük Motivasyon / İpucu */}
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            🎯 İpucu: Yeni öğrendiğin kelimeleri küçük cümlelerde kullanmaya
            çalış!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textLight,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  verb: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primary,
  },
  meaning: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  example: {
    fontSize: 15,
    fontStyle: "italic",
    color: COLORS.textLight,
    marginBottom: 20,
    lineHeight: 22,
  },
  listenButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  listenText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 8,
  },
  progressCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  progressText: {
    flex: 1,
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.text,
  },
  progressBarBackground: {
    flex: 2,
    height: 14,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  testButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
  },
  listButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 28,
  },
  listButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  tipCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  tipText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textLight,
    textAlign: "center",
  },
});
