// components/Button.tsx
import { COLORS } from "@/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
};

export default function Button({
  title,
  onPress,
  variant = "default",
  disabled,
  loading,
  icon,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        variant === "outline" && styles.outline,
        variant === "ghost" && styles.ghost,
        disabled && styles.disabled,
        loading && styles.disabled,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? COLORS.primary : COLORS.white} />
      ) : (
        <>
          {icon && (
            <>
              {typeof icon === 'string' ? (
                <Text style={styles.icon}>{icon}</Text>
              ) : (
                <>{icon}</>
              )}
            </>
          )}
          <Text style={[
            styles.text, 
            variant === "outline" && styles.outlineText,
            variant === "ghost" && styles.ghostText
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 56,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 12,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: "transparent",
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowColor: "transparent",
  },
  text: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.text,
  },
  icon: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.6,
  },
});
