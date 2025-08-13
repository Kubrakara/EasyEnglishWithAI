import Constants from "expo-constants";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  findNodeHandle,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
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
  avranBlue: "#67ace9ff",
  wrongRed: "#c53129ff",
};

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  error?: boolean;
  wrongWords?: string[];
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
  const [tooltip, setTooltip] = useState<{
    word: string;
    translation: string;
    x: number;
    y: number;
    width: number;
    height: number;
    isTranslating: boolean;
  } | null>(null);
  const translationCacheRef = useRef<Map<string, string>>(new Map());
  const wordRefs = useRef<{ [key: string]: any }>({});

  // --- Gemini oran limiti ve retry yardımcıları (ücretsiz plan uyumlu) ---
  const REQUEST_INTERVAL_MS = 5000;
  const MAX_RETRIES = 3;
  const lastGeminiCallRef = useRef<number>(0);
  const apiKey = (Constants as any).expoConfig?.extra?.GEMINI_API_KEY;
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchGeminiWithRetry = async (prompt: string): Promise<Response> => {
    if (!apiKey) {
      throw new Error("Gemini API anahtarı tanımlı değil.");
    }

    let attempt = 0;
    let backoffMs = 1500;
    while (true) {
      const elapsed = Date.now() - lastGeminiCallRef.current;
      if (elapsed < REQUEST_INTERVAL_MS) {
        await delay(REQUEST_INTERVAL_MS - elapsed);
      }

      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (response.status === 429 || response.status === 503) {
        attempt += 1;
        if (attempt > MAX_RETRIES) {
          return response;
        }
        await delay(backoffMs);
        backoffMs = Math.min(backoffMs * 2, 10000);
        continue;
      }

      lastGeminiCallRef.current = Date.now();
      return response;
    }
  };

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
    
    //Burada API'ye istek atıyoruz
    // ve gelen cevabı işliyoruz
    
    try {
      const prompt = `You are a friendly English tutor. Return ONLY valid JSON with the following shape and nothing else (no markdown):\n\n{\n  "corrected": string,\n  "reply": string,\n  "wrongWords": string[]\n}\n\nRules:\n- corrected: provide a single corrected version of the user's sentence.\n- reply: a natural, friendly continuation in English to keep the conversation going.\n- wrongWords: array of individual words from the user's ORIGINAL message that are misspelled or ungrammatical and should be highlighted. Exclude punctuation, use lowercase, include each word at most once.\n\nUser: "${messageText}"`;

      const response = await fetchGeminiWithRetry(prompt);

      if (!response.ok) {
        let message = "Unknown error";
        try {
          const errorData = await response.json();
          message = errorData.error?.message || message;
        } catch {}
        if (response.status === 429) {
          throw new Error(
            "Ücretsiz kullanım kotasını aştınız. Lütfen biraz bekleyip tekrar deneyin."
          );
        }
        throw new Error(`API Error: ${response.status} - ${message}`);
      }
      // API cevabını işleme
      //burada API'den gelen cevabı JSON olarak alıyoruz
      // ve içindeki metni çıkarıyoruz
      // JSON parse denemeleri yapacağız
      const data = await response.json();
      const geminiResponseText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // JSON parse denemeleri
      const parseFromFences = (text: string): any | null => {
        const fenceRegex = /```(?:json)?\s*([\s\S]*?)```/i;
        const m = text.match(fenceRegex);
        if (m && m[1]) {
          try {
            return JSON.parse(m[1]);
          } catch {
            return null;
          }
        }
        return null;
      };

      const parseFromBraces = (text: string): any | null => {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          const candidate = text.slice(start, end + 1);
          try {
            return JSON.parse(candidate);
          } catch {
            return null;
          }
        }
        return null;
      };

      const parseLoosely = (
        text: string
      ): {
        corrected?: string;
        reply?: string;
        wrongWords?: string[];
      } | null => {
        const corrMatch = text.match(/"?corrected"?\s*:\s*"([\s\S]*?)"[,}]/i);
        const replyMatch = text.match(/"?reply"?\s*:\s*"([\s\S]*?)"[,}]/i);
        let ww: string[] | undefined;
        const wwMatch = text.match(/"?wrongWords"?\s*:\s*\[(.*?)\]/is);
        if (wwMatch && wwMatch[1]) {
          const raw = `[${wwMatch[1]}]`;
          try {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
              ww = arr.filter((x: any) => typeof x === "string");
            }
          } catch {}
        }
        if (corrMatch || replyMatch || ww) {
          return {
            corrected: corrMatch ? corrMatch[1] : undefined,
            reply: replyMatch ? replyMatch[1] : undefined,
            wrongWords: ww,
          };
        }
        return null;
      };

      let corrected = "";
      let reply = geminiResponseText.trim();
      let wrongWords: string[] | undefined = undefined;

      let parsed: any | null = null;
      try {
        parsed = JSON.parse(geminiResponseText);
      } catch {
        parsed = null;
      }
      if (!parsed) parsed = parseFromFences(geminiResponseText);
      if (!parsed) parsed = parseFromBraces(geminiResponseText);
      if (!parsed) parsed = parseLoosely(geminiResponseText);

      if (parsed && (parsed.corrected || parsed.reply || parsed.wrongWords)) {
        corrected = (parsed.corrected ?? "").toString();
        reply = (parsed.reply ?? reply).toString();
        if (Array.isArray(parsed.wrongWords)) {
          wrongWords = parsed.wrongWords
            .map((w: any) => (typeof w === "string" ? w : ""))
            .filter((w: string) => w);
        }
      } else {
        const looksJson = /\{\s*"?\w+"?\s*:/.test(geminiResponseText);
        if (looksJson) {
          reply = geminiResponseText
            .replace(/\{\s*|\s*\}|\"/g, "")
            .replace(/\b(corrected|reply|wrongWords)\s*:/gi, "")
            .trim();
        }
      }

      if (wrongWords && wrongWords.length > 0) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? { ...msg, wrongWords } : msg))
        );
      }

      // AI cevabını JSON string olarak saklıyoruz
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: JSON.stringify({ corrected, reply }),
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

  const splitIntoParts = (text: string) => {
    return text.split(/(\b[\w']+\b)/g);
  };

  const normalizeToken = (token: string) =>
    token.toLowerCase().replace(/[^a-z']/g, "");

  const renderUserTextWithHighlights = (
    text: string,
    wrongWords?: string[]
  ) => {
    if (!wrongWords || wrongWords.length === 0) {
      return <Text style={styles.userText}>{text}</Text>;
    }
    const wrongSet = new Set(wrongWords.map((w) => w.toLowerCase()));
    const parts = splitIntoParts(text);
    return (
      <Text style={styles.userText}>
        {parts.map((part, idx) => {
          const isWord = /\b[\w']+\b/.test(part);
          if (!isWord) return <Text key={idx}>{part}</Text>;
          const normalized = normalizeToken(part);
          const isWrong = wrongSet.has(normalized);
          return (
            <Text key={idx} style={isWrong ? styles.userTextWrong : undefined}>
              {part}
            </Text>
          );
        })}
      </Text>
    );
  };
  
  const translateWord = async (word: string): Promise<string> => {
    try {
      const cached = translationCacheRef.current.get(word.toLowerCase());
      if (cached) return cached;
      const tPrompt = `Translate the English word to Turkish. Respond with ONLY the Turkish single-word or short phrase, no punctuation or extra text.\nWord: "${word}"`;
      const res = await fetchGeminiWithRetry(tPrompt);
      if (!res.ok) {
        if (res.status === 429) {
          return "Sınır aşıldı, lütfen biraz bekleyin.";
        }
        return "Çeviri yapılamadı";
      }
      const j = await res.json();
      const txt = j.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.() || "";
      const clean = txt.replace(/^"|"$/g, "");
      if (clean) {
        translationCacheRef.current.set(word.toLowerCase(), clean);
      }
      return clean || "Çeviri bulunamadı";
    } catch {
      return "Çeviri yapılamadı";
    }
  };

  // Tooltip gösterme fonksiyonu
  const handleWordPress = async (word: string, idx: number) => {
    const ref = wordRefs.current[`${word}-${idx}`];
    if (!ref) return;
    const nodeHandle = findNodeHandle(ref);
    if (nodeHandle == null) return;
    UIManager.measure(nodeHandle, async (x, y, width, height, pageX, pageY) => {
      setTooltip({
        word,
        translation: "",
        x: pageX,
        y: pageY,
        width,
        height,
        isTranslating: true,
      });
      const tr = await translateWord(word);
      setTooltip((prev) =>
        prev ? { ...prev, translation: tr, isTranslating: false } : prev
      );
    });
  };

  // AI mesajındaki kelimeleri Pressable ile sarmala ve ref ata
  const renderAiInteractiveText = (text: string) => {
    const parts = splitIntoParts(text);
    return (
      <Text style={styles.aiText}>
        {parts.map((part, idx) => {
          const isWord = /\b[\w']+\b/.test(part);
          if (!isWord) return <Text key={idx}>{part}</Text>;
          return (
            <TouchableOpacity
              key={idx}
              ref={(ref) => {
                wordRefs.current[`${part}-${idx}`] = ref;
              }}
              onPress={() => handleWordPress(part, idx)}
              activeOpacity={0.6}
            >
              <Text style={styles.aiWord}>{part}</Text>
            </TouchableOpacity>
          );
        })}
      </Text>
    );
  };

  // Tooltip baloncuğu
  const renderTooltip = () => {
    if (!tooltip) return null;
    return (
      <View
        style={[
          styles.tooltip,
          {
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y + tooltip.height + 4,
            zIndex: 100,
          },
        ]}
      >
        <Text style={styles.tooltipWord}>{tooltip.word}</Text>
        <Text style={styles.tooltipTranslation}>
          {tooltip.isTranslating ? "Çeviriliyor..." : tooltip.translation}
        </Text>
        <TouchableOpacity
          style={styles.tooltipClose}
          onPress={() => setTooltip(null)}
        >
          <Text style={styles.tooltipCloseText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    );
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
            {renderUserTextWithHighlights(item.text, item.wrongWords)}
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

    // AI mesajıysa JSON parse edip ayrı ayrı göster
    let corrected = "";
    let reply = item.text;
    try {
      const parsed = JSON.parse(item.text);
      corrected = parsed.corrected ?? "";
      reply = parsed.reply ?? item.text;
    } catch {}

    return (
      <View style={[styles.messageBubble, styles.aiBubble]}>
        {corrected ? (
  <>
    <Text style={styles.aiCorrectionTitle}>✅ Correction:</Text>
    {renderAiInteractiveText(corrected)}
    <Text style={styles.aiReplyTitle}>💬 Reply:</Text>
    {renderAiInteractiveText(reply)}
  </>
    ) : (
    renderAiInteractiveText(reply)
    )}

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

        {renderTooltip()}
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
    paddingTop: 20,
    paddingBottom: 80,
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
  userTextWrong: {
    color: COLORS.wrongRed,
    borderRadius: 6,
    paddingHorizontal: 4,
    fontWeight: "bold",
  },
  aiText: {
    color: COLORS.text,
    fontSize: 16,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  aiWord: {
    color: COLORS.text,
    textDecorationLine: "underline",
  },
  aiCorrectionTitle: {
    fontWeight: "bold",
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: 4,
  },
  aiCorrectionText: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.text,
  },
  aiReplyTitle: {
    fontWeight: "bold",
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: 4,
  },
  aiReplyText: {
    fontSize: 16,
    color: COLORS.text,
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
  tooltip: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 120,
    maxWidth: 220,
  },
  tooltipWord: {
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
    fontSize: 16,
  },
  tooltipTranslation: {
    color: COLORS.text,
    fontSize: 15,
    marginBottom: 8,
  },
  tooltipClose: {
    alignSelf: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  tooltipCloseText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

