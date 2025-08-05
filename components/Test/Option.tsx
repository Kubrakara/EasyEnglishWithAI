import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@/theme";

interface OptionProps {
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isDisabled: boolean;
  onPress: () => void;
}

export default function Option({
  text,
  isSelected,
  isCorrect,
  isDisabled,
  onPress,
}: OptionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        isSelected && styles.selectedOption,
        isDisabled && isCorrect && styles.correctOption,
        isDisabled && isSelected && !isCorrect && styles.wrongOption,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  selectedOption: {
    borderColor: COLORS.primary,
  },
  correctOption: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  wrongOption: {
    backgroundColor: "#F44336",
    borderColor: "#F44336",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
});
