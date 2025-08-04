import { COLORS } from "@/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // Demo verisi
  const phrasalVerb = {
    verb: "Break down",
    meaning: "To stop working (for machines) or to become very upset",
    example: "My car broke down on the way to work.",
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Günün Phrasal Verbi</Text>
        <View style={styles.card}>
          <Text style={styles.verb}>{phrasalVerb.verb}</Text>
          <Text style={styles.meaning}>{phrasalVerb.meaning}</Text>
          <Text style={styles.example}>Örnek: {phrasalVerb.example}</Text>
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
    paddingTop: 24, // Üst boşluk
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  verb: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 12,
  },
  meaning: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  example: {
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.textLight,
  },
});
