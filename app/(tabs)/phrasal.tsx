import { COLORS } from "@/theme";
import { PHRASAL_VERBS_DATA, PhrasalVerbType } from "@/utils/phrasalVerbs";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
    FlatList,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Define the type for a single verb with favorite state
interface PhrasalVerb extends PhrasalVerbType {
  isFavorite: boolean;
}

export default function PhrasalListScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Convert static data to include favorite state
  const allVerbs: PhrasalVerb[] = PHRASAL_VERBS_DATA.map(verb => ({
    ...verb,
    isFavorite: favorites.has(verb.id)
  }));

  const filteredVerbs = useMemo(() => {
    if (!searchQuery) {
      return allVerbs;
    }
    return allVerbs.filter(
      (item) =>
        item.verb.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allVerbs, searchQuery]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  }, []);

  const renderItem = ({ item }: { item: PhrasalVerb }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.verb}>{item.verb}</Text>
        <Text style={styles.meaning}>{item.meaning}</Text>
        <Text style={styles.example}>"{item.example}"</Text>
      </View>
      <TouchableOpacity
        onPress={() => toggleFavorite(item.id)}
        style={styles.heartButton}
      >
        <Ionicons
          name={favorites.has(item.id) ? "heart" : "heart-outline"}
          size={26}
          color={favorites.has(item.id) ? COLORS.error : COLORS.textLight}
        />
      </TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <View>
      <Text style={styles.headerTitle}>Phrasal Verb Kütüphanesi</Text>
      <Text style={styles.headerSubtitle}>
        {PHRASAL_VERBS_DATA.length} phrasal verb'ü keşfet ve öğren.
      </Text>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Aramak için yazın..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredVerbs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? "Sonuç bulunamadı." : "Kütüphanede hiç kelime yok."}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => Keyboard.dismiss()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F7FF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 16, color: COLORS.text, textAlign: "center", marginBottom: 20 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: COLORS.primary, marginTop: 20 },
  headerSubtitle: { fontSize: 16, fontWeight: "500", color: COLORS.textLight, marginBottom: 20 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, borderRadius: 16, paddingHorizontal: 16, marginBottom: 20, borderWidth: 1, borderColor: "#E2E8F0" },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: COLORS.text },
  itemContainer: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", marginBottom: 16, shadowColor: "#A5B4CB", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, borderWidth: 1, borderColor: "#E2E8F0" },
  itemContent: { flex: 1 },
  verb: { fontSize: 20, fontWeight: "700", color: COLORS.primary },
  meaning: { fontSize: 16, color: COLORS.text, marginTop: 4, marginBottom: 8 },
  example: { fontSize: 14, color: COLORS.textLight, fontStyle: "italic" },
  heartButton: { padding: 8, marginLeft: 12 },
  emptyContainer: { marginTop: 40, alignItems: "center" },
  emptyText: { fontSize: 16, color: COLORS.textLight, textAlign: "center" },
});
