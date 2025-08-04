import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PhrasalVerb = {
  id: string;
  verb: string;
  meaning: string;
  favorite: boolean;
};

export default function PhrasalList() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<PhrasalVerb[]>([]);

  useEffect(() => {
    // TODO: Backend çağrısı yapılacak
    setTimeout(() => {
      setList([
        {
          id: "1",
          verb: "Break down",
          meaning: "Arızalanmak",
          favorite: false,
        },
        { id: "2", verb: "Call off", meaning: "İptal etmek", favorite: true },
        {
          id: "3",
          verb: "Get along",
          meaning: "İyi geçinmek",
          favorite: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleFavorite = (id: string) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
    // TODO: Backend favori güncelleme
  };

  const renderItem = ({ item }: { item: PhrasalVerb }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        // TODO: Detay ekranına geçilebilir
      }}
    >
      <View>
        <Text style={styles.verb}>{item.verb}</Text>
        <Text style={styles.meaning}>{item.meaning}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
        <Ionicons
          name={item.favorite ? "heart" : "heart-outline"}
          size={24}
          color={item.favorite ? COLORS.error : COLORS.textLight}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  verb: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  meaning: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 48,
  },
});
