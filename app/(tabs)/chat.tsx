import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  error?: boolean;
};

export default function ChatScreen() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSend = useCallback(async (messageText: string) => {
    const tempId = `temp-${Date.now()}`;
    const userMessage: Message = {
      id: tempId,
      text: messageText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    scrollToBottom();
    setIsAiLoading(true);

    try {
      const prompt = `Correct the following English sentence and provide an explanation for the correction. Respond in JSON format with 'corrected' and 'explanation' fields.
Sentence: '${messageText}'`;
      // expoconfig hatasını düzelteceğim
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${(Constants as any).expoConfig?.extra?.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${response.status} - ${errorData.error?.message || "Unknown error"}`
        );
      }

      const data = await response.json();
      const geminiResponseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      let correctedText = "";
      let explanationText = "";

      try {
        const parsedResponse = JSON.parse(geminiResponseText);
        correctedText = parsedResponse.corrected || "";
        explanationText = parsedResponse.explanation || "";
      } catch {
        correctedText = geminiResponseText;
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: "",
        isUser: false,
        corrected: correctedText,
        explanation: explanationText,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...msg, error: true } : msg))
      );
      Alert.alert("Hata", error.message || "Bilinmeyen hata oluştu.");
    } finally {
      setIsAiLoading(false);
      scrollToBottom();
    }
  }, []);

  const retrySendMessage = (failedMessage: Message) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== failedMessage.id));
    handleSend(failedMessage.text);
  };

  const renderItem = ({ item }: { item: Message }) => {
    if (item.isUser) {
      return (
        <TouchableOpacity
          onLongPress={() => item.error && retrySendMessage(item)}
          disabled={!item.error}
        >
          <View
            style={[
              styles.messageBubble,
              styles.userBubble,
              item.error && styles.errorBubble,
            ]}
          >
            <Text style={styles.userText}>{item.text}</Text>
            {item.error && (
              <Ionicons
                name="alert-circle"
                size={20}
                color={COLORS.white}
                style={styles.errorIcon}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    }
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
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
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
            editable={!isAiLoading}
            multiline
          />
          <TouchableOpacity
            onPress={() => handleSend(inputText)}
            disabled={isAiLoading || !inputText.trim()}
            style={[
              styles.sendButton,
              (isAiLoading || !inputText.trim()) && styles.sendButtonDisabled,
            ]}
          >
            {isAiLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Ionicons name="send" size={20} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1 },
  messagesContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.lightGray,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  userText: { color: COLORS.white, fontSize: 16 },
  aiCorrected: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  aiExplanation: { color: COLORS.text, fontSize: 14 },
  errorBubble: {
    backgroundColor: COLORS.error,
    flexDirection: "row",
    alignItems: "center",
  },
  errorIcon: { marginLeft: 8 },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 24,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: { backgroundColor: COLORS.gray },
});
