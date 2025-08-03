import { COLORS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
        /* Detay açılabilir */
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
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
  },
});
