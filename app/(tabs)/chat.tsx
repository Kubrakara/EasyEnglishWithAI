import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  corrected?: string;
  explanation?: string;
};

export default function Chat() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      // TODO: Backend çağrısı yapılacak
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "",
        isUser: false,
        corrected: "Corrected: " + userMessage.text,
        explanation: "This is an explanation from AI.",
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    if (item.isUser) {
      return (
        <View style={[styles.messageBubble, styles.userBubble]}>
          <Text style={styles.userText}>{item.text}</Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.messageBubble, styles.aiBubble]}>
          {item.corrected && (
            <Text style={styles.aiCorrected}>{item.corrected}</Text>
          )}
          {item.explanation && (
            <Text style={styles.aiExplanation}>{item.explanation}</Text>
          )}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="İngilizce cümle yazın..."
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            editable={!loading}
            multiline
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading || !inputText.trim()}
            style={[
              styles.sendButton,
              (loading || !inputText.trim()) && styles.sendButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Ionicons name="send" size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  messagesContainer: {
    paddingTop: 32, // ← Buraya üst padding eklendi
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  aiBubble: {
    backgroundColor: COLORS.lightGray,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  userText: {
    color: COLORS.white,
    fontSize: 16,
  },
  aiCorrected: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  aiExplanation: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    color: COLORS.text,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
});
