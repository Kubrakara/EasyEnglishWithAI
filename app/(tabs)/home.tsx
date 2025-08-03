import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PhrasalVerb = {
  id: string;
  verb: string;
  meaning: string;
  example: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [phrasal, setPhrasal] = useState<PhrasalVerb | null>(null);
  const [favorited, setFavorited] = useState(false);

  // TODO: Backend’ten veri çekilecek, şimdilik sabit data
  useEffect(() => {
    // Simule fetch
    setTimeout(() => {
      setPhrasal({
        id: "1",
        verb: "Give up",
        meaning: "Vazgeçmek, bırakmak",
        example: "She decided to give up smoking.",
      });
      setLoading(false);
    }, 1000);
  }, []);

  const toggleFavorite = () => {
    setFavorited(!favorited);
    // TODO: favori ekleme backend çağrısı yapılacak
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!phrasal) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Günlük deyim bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Günün Phrasal Verb’i</Text>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.verb}>{phrasal.verb}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={28}
              color={favorited ? COLORS.error : COLORS.textLight}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.meaning}>{phrasal.meaning}</Text>
        <Text style={styles.example}>"{phrasal.example}"</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  verb: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },
  meaning: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  example: {
    fontSize: 16,
    fontStyle: "italic",
    color: COLORS.textLight,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
  },
});
