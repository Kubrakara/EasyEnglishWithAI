import { COLORS } from "@/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScoreProps {
  score: number;
  total: number;
  onRestart: () => void;
  onExit: () => void;
}

export default function Score({ score, total, onRestart, onExit }: ScoreProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test tamamlandı!</Text>
      <Text style={styles.score}>
        Doğru cevaplar: {score} / {total}
      </Text>
      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Tekrar Dene</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.exitButton]}
        onPress={onExit}
      >
        <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.primary,
    textAlign: "center",
  },
  score: {
    fontSize: 22,
    marginBottom: 24,
    fontWeight: "600",
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    width: "60%",
    alignItems: "center",
  },
  exitButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 18,
  },
});
