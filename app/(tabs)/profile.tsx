import Button from "@/components/Button";
import Skeleton from "@/components/ui/Skeleton";
import { COLORS } from "@/theme";
import { API_BASE_URL } from "@/utils/apiConfig";
import { clearTokens } from "@/utils/authTokens";
import { fetchWithToken } from "@/utils/fetchClient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const ProfileSkeleton = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Profil</Text>
    <View style={styles.infoBox}>
      <Skeleton width={100} height={16} style={{ marginBottom: 8 }} />
      <Skeleton width={200} height={20} />
    </View>
    <View style={styles.infoBox}>
      <Skeleton width={100} height={16} style={{ marginBottom: 8 }} />
      <Skeleton width={250} height={20} />
    </View>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithToken(`${API_BASE_URL}/api/users/me`);
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          // Token hatası - kullanıcıyı login sayfasına yönlendir
          await clearTokens();
          router.replace("/(auth)/login");
          return;
        }
        throw new Error(errorData.message || "Kullanıcı bilgileri alınamadı.");
      }
      const data = await response.json();
      setUser(data);
    } catch (e: any) {
      console.error("Profile fetch error:", e);
      if (e.message.includes("token") || e.message.includes("Token")) {
        // Token hatası - kullanıcıyı login sayfasına yönlendir
        await clearTokens();
        router.replace("/(auth)/login");
        return;
      }
      setError(e.message || "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    Alert.alert("Çıkış Yap", "Hesabınızdan çıkmak istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          try {
            await clearTokens();
            router.replace("/(auth)/login");
          } catch (e) {
            Alert.alert("Hata", "Çıkış yapılırken bir sorun oluştu.");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ProfileSkeleton />
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Veriler yüklenemedi."}</Text>
          <Button title="Tekrar Dene" onPress={fetchUser} />
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Profil</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>E-posta</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Hesap Oluşturma Tarihi</Text>
          <Text style={styles.value}>{formatDate(user.createdAt)}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 24 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  errorText: { fontSize: 18, color: COLORS.text, textAlign: "center", marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: COLORS.primary, marginBottom: 32 },
  infoBox: { marginBottom: 24, backgroundColor: COLORS.white, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  label: { color: COLORS.textLight, fontSize: 14, marginBottom: 8 },
  value: { fontSize: 18, color: COLORS.text, fontWeight: "600" },
  logoutButton: { marginTop: 40, backgroundColor: COLORS.error, paddingVertical: 16, borderRadius: 12, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  logoutText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
});