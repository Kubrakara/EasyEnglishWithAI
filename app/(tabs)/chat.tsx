import Constants from "expo-constants";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const COLORS = {
  white: "#fff",
  gray: "#999",
  primary: "#4A90E2",
  lightGray: "#e5e5ea",
  border: "#ddd",
  error: "#ff4d4f",
  text: "#222",
};

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  error?: boolean;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-intro",
      text: "Let's start chatting in English! What would you like to talk about today?",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Klavye açıldığında mesaj sonuna scroll
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
      scrollToBottom();
    });
    return () => keyboardShowListener.remove();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const userMessage: Message = {
      id: tempId,
      text: messageText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    scrollToBottom();
    setIsAiLoading(true);

    try {
      const prompt = `You are a friendly English tutor. First, correct the grammar and wording of this sentence, then respond naturally to keep the conversation going. Do not give multiple alternatives, just one corrected sentence and a natural reply.

User: "${messageText}"`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
          (Constants as any).expoConfig?.extra?.GEMINI_API_KEY
        }`,
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

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: geminiResponseText.trim(),
        isUser: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
      scrollToBottom();
    } catch (error: any) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...msg, error: true } : msg))
      );
      alert(error.message || "An unknown error occurred.");
    } finally {
      setIsAiLoading(false);
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
          activeOpacity={item.error ? 0.6 : 1}
          style={{ alignSelf: "flex-end", marginVertical: 4 }}
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
        <Text style={styles.aiText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
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
            placeholder="Type in English..."
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
  messagesContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    paddingTop: 20, // Üstten boşluk
    paddingBottom: 80, // Input için boşluk
  },
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
  userText: {
    color: COLORS.white,
    fontSize: 16,
  },
  aiText: {
    color: COLORS.text,
    fontSize: 16,
  },
  errorBubble: {
    backgroundColor: COLORS.error,
    flexDirection: "row",
    alignItems: "center",
  },
  errorIcon: {
    marginLeft: 8,
  },
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
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
});
