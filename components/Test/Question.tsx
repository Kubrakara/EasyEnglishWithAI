import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { COLORS } from "@/theme";

interface QuestionProps {
  question: string;
  currentIndex: number;
  total: number;
}

export default function Question({ question, currentIndex, total }: QuestionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.counter}>Soru {currentIndex} / {total}</Text>
      <Text style={styles.questionText}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  counter: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
});
