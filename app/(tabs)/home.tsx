import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  AccessibilityRole,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/Button";

// Define types for our data
interface PhrasalVerb {
  id: string;
  verb: string;
  meaning: string;
  example: string;
}

interface UserProgress {
  learnedCount: number;
  totalCount: number;
  isFavorite: boolean;
}

// Loading Skeleton Component
const HomeScreenSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.card}>
      <Skeleton width="60%" height={24} style={{ marginBottom: 20 }} />
      <Skeleton width="80%" height={40} style={{ marginBottom: 16 }} />
      <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={20} style={{ marginBottom: 24 }} />
      <Skeleton width="100%" height={50} borderRadius={16} />
    </View>
    <View style={styles.progressSection}>
      <Skeleton width="50%" height={22} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={12} />
    </View>
    <Skeleton width="100%" height={60} borderRadius={20} style={{ marginBottom: 16 }} />
    <Skeleton width="70%" height={20} style={{ alignSelf: 'center' }} />
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [word, setWord] = useState<PhrasalVerb | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockWord: PhrasalVerb = {
        id: "1",
        verb: "Look up",
        meaning: "To find information about something in a book or on a computer.",
        example: "If you don't know the meaning of a word, you can look it up in a dictionary.",
      };

      const mockProgress: UserProgress = {
        learnedCount: 15,
        totalCount: 50,
        isFavorite: false,
      };

      setWord(mockWord);
      setProgress(mockProgress);

    } catch (e: any) {
      setError(e.message || "Bir hata oluştu.");
      console.error("Home screen mock data error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (progress) {
      Animated.timing(progressAnim, {
        toValue: (progress.learnedCount / progress.totalCount) * 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [progress]);

  const toggleFavorite = async () => {
    if (!word) return;
    // Optimistic UI update
    setProgress(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // In a real app, you'd send this to your backend
      console.log(`Toggling favorite for word ID: ${word.id}`);
    } catch (e) {
      Alert.alert("Hata", "Favori durumu güncellenemedi.");
      // Revert UI on error
      setProgress(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const playSound = () => {
    if (word) {
      Speech.speak(word.verb, { language: "en" });
    }
  };

  if (isLoading) {
    return <SafeAreaView style={styles.safeArea}><HomeScreenSkeleton /></SafeAreaView>;
  }

  if (error || !word || !progress) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Veriler yüklenemedi."}</Text>
          <Button title="Tekrar Dene" onPress={fetchData} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Günün Kelimesi</Text>
            <Ionicons name="sparkles" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.verbRow}>
            <Text style={styles.verb}>{word.verb}</Text>
            <TouchableOpacity
              onPress={toggleFavorite}
              activeOpacity={0.7}
              accessibilityRole={"button" as AccessibilityRole}
              accessibilityLabel={progress.isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
            >
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons
                  name={progress.isFavorite ? "heart" : "heart-outline"}
                  size={32}
                  color={progress.isFavorite ? COLORS.error : COLORS.primary}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
          <Text style={styles.meaning}>{word.meaning}</Text>
          <Text style={styles.example}>"{word.example}"</Text>
          <TouchableOpacity style={styles.listenButton} activeOpacity={0.7} onPress={playSound}>
            <Ionicons name="volume-high-outline" size={24} color={COLORS.white} />
            <Text style={styles.listenText}>Dinle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Genel İlerleme</Text>
            <Text style={styles.progressCount}>
              {progress.learnedCount} / {progress.totalCount}
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

        <TouchableOpacity style={styles.testButton} onPress={() => router.push("/testscreen")}>
          <Ionicons name="game-controller" size={24} color={COLORS.white} />
          <Text style={styles.testButtonText}>Hadi Teste Başla!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listButton} onPress={() => router.push("/phrasal")}>
          <Text style={styles.listButtonText}>Tüm Phrasal Verbleri Gör</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>

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
  safeArea: { flex: 1, backgroundColor: "#F4F7FF" },
  scrollView: { flex: 1 },
  container: { paddingVertical: 20, paddingHorizontal: 24 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
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
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  cardTitle: { fontSize: 20, fontWeight: "700", color: COLORS.textLight },
  verbRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  verb: { fontSize: 36, fontWeight: "900", color: COLORS.primary, flex: 1 },
  meaning: { fontSize: 18, fontWeight: "500", color: COLORS.text, marginBottom: 12, lineHeight: 26 },
  example: { fontSize: 16, fontStyle: "italic", color: COLORS.textLight, marginBottom: 24, lineHeight: 24, backgroundColor: "#F8FAFC", padding: 12, borderRadius: 12 },
  listenButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 16, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  listenText: { fontSize: 18, fontWeight: "700", color: COLORS.white, marginLeft: 10 },
  progressSection: { marginBottom: 32 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  progressCount: { fontSize: 16, fontWeight: "600", color: COLORS.primary },
  progressBarBackground: { height: 12, backgroundColor: "#E2E8F0", borderRadius: 10, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: COLORS.primary, borderRadius: 10 },
  testButton: { backgroundColor: "#10B981", paddingVertical: 20, borderRadius: 20, alignItems: "center", justifyContent: "center", flexDirection: "row", marginBottom: 16, shadowColor: "#10B981", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8 },
  testButtonText: { color: COLORS.white, fontSize: 20, fontWeight: "800", marginLeft: 12 },
  listButton: { paddingVertical: 14, alignItems: "center", justifyContent: "center", flexDirection: "row", marginBottom: 32 },
  listButtonText: { fontSize: 16, fontWeight: "700", color: COLORS.primary, marginRight: 8 },
  tipCard: { backgroundColor: "#E0E7FF", padding: 20, borderRadius: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#C7D2FE" },
  tipEmoji: { fontSize: 24, marginRight: 16 },
  tipText: { flex: 1, fontSize: 15, fontWeight: "500", color: "#4338CA", lineHeight: 22 },
});
