import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityRole,
  Animated,
  ScrollView,
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
    meaning: "Bir makinenin çalışmayı durdurması veya birinin çok üzülmesi",
    example: "My car broke down on the way to work.",
  };

  const [isFavorite, setIsFavorite] = useState(false);
  const [learnedCount, setLearnedCount] = useState(24);
  const totalCount = 40;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleFavorite = () => {
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

    setIsFavorite((prev) => !prev);
  };

  const startTest = () => {
    router.push("/testscreen");
  };

  const goToList = () => {
    router.push("/phrasal");
  };

  const playSound = () => {
    Speech.speak(phrasalVerb.verb, { language: "en" });
  };

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (learnedCount / totalCount) * 100,
      duration: 1000,
      useNativeDriver: false, // width animation not supported by native driver
    }).start();
  }, [learnedCount]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Günün Kelimesi Kartı */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Günün Kelimesi</Text>
            <Ionicons name="sparkles" size={22} color={COLORS.primary} />
          </View>

          <View style={styles.verbRow}>
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
                  size={32}
                  color={isFavorite ? COLORS.error : COLORS.primary}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          <Text style={styles.meaning}>{phrasalVerb.meaning}</Text>
          <Text style={styles.example}>"{phrasalVerb.example}"</Text>

          <TouchableOpacity
            style={styles.listenButton}
            activeOpacity={0.7}
            onPress={playSound}
          >
            <Ionicons name="volume-high-outline" size={24} color={COLORS.white} />
            <Text style={styles.listenText}>Dinle</Text>
          </TouchableOpacity>
        </View>

        {/* İlerleme Bölümü */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Genel İlerleme</Text>
            <Text style={styles.progressCount}>
              {learnedCount} / {totalCount}
            </Text>
          </View>
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
        <TouchableOpacity style={styles.testButton} onPress={startTest}>
          <Ionicons name="game-controller" size={24} color={COLORS.white} />
          <Text style={styles.testButtonText}>Hadi Teste Başla!</Text>
        </TouchableOpacity>

        {/* Tüm Kelimeler Listesine Git */}
        <TouchableOpacity style={styles.listButton} onPress={goToList}>
          <Text style={styles.listButtonText}>Tüm Phrasal Verbleri Gör</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Günlük Motivasyon / İpucu */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={styles.tipText}>
            Her gün bir kelime öğrenmek, bir yılda 365 yeni kelime demektir!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FF", // Daha yumuşak bir arka plan
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#A5B4CB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  verbRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  verb: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.primary,
    flex: 1, // Yazının butona taşmasını engeller
  },
  meaning: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 26,
  },
  example: {
    fontSize: 16,
    fontStyle: "italic",
    color: COLORS.textLight,
    marginBottom: 24,
    lineHeight: 24,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
  },
  listenButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  listenText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginLeft: 10,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  progressCount: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  testButton: {
    backgroundColor: "#10B981", // Canlı bir yeşil
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 12,
  },
  listButton: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 32,
  },
  listButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginRight: 8,
  },
  tipCard: {
    backgroundColor: "#E0E7FF",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#4338CA",
    lineHeight: 22,
  },
});