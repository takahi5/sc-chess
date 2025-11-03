import { Link, useRouter, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CHECKMATE_CHALLENGES } from "@/constants/checkmate-challenges";
import { getCompletedChallengeIds } from "@/storage/checkmate-progress";

export default function CheckmateChallengeListScreen() {
  const router = useRouter();
  const headerTextColor = "#0f172a";
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());

  const challenges = useMemo(
    () =>
      CHECKMATE_CHALLENGES.map((challenge) => challenge.id).sort(
        (a, b) => a - b
      ),
    []
  );

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const loadCompleted = async () => {
        const ids = await getCompletedChallengeIds();
        if (mounted) {
          setCompletedIds(new Set(ids));
        }
      };

      void loadCompleted();

      return () => {
        mounted = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ImageBackground
        source={require("@/assets/images/chess-photo.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      >
        <ThemedView
          style={styles.container}
          lightColor="transparent"
          darkColor="transparent"
        >
          <View style={styles.contentCard}>
            <View style={styles.header}>
              <Pressable
                style={styles.linkButton}
                onPress={() => router.back()}
              >
                <ThemedText
                  style={styles.linkLabel}
                  lightColor={headerTextColor}
                  darkColor={headerTextColor}
                >
                  Back
                </ThemedText>
              </Pressable>
              <ThemedText
                type="subtitle"
                lightColor={headerTextColor}
                darkColor={headerTextColor}
                style={styles.headerTitle}
              >
                Checkmate Challenge
              </ThemedText>
              <View style={styles.linkButtonPlaceholder} />
            </View>
            <ThemedText style={styles.description}>
              Choose a mate-in-one puzzle to test your tactics.
            </ThemedText>
            <ScrollView
              style={styles.grid}
              contentContainerStyle={styles.gridContent}
              showsVerticalScrollIndicator={false}>
              {challenges.map((id) => (
                <Link
                  key={id}
                  href={{
                    pathname: "/checkmate/[id]",
                    params: { id: String(id) },
                  }}
                  asChild
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.challengeButton}
                >
                  <View style={styles.challengeHeader}>
                    <ThemedText style={styles.challengeLabel}>
                      Challenge {id}
                    </ThemedText>
                    {completedIds.has(id) ? (
                      <ThemedText style={styles.challengeCheck}>✅</ThemedText>
                    ) : null}
                  </View>
                  <ThemedText style={styles.challengeSubLabel}>
                    Mate in 1
                  </ThemedText>
                </TouchableOpacity>
              </Link>
              ))}
            </ScrollView>
          </View>
        </ThemedView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    width: "100%",
    height: "100%",
  },
  contentCard: {
    flex: 1,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#0f172a",
  },
  linkButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  linkButtonPlaceholder: {
    width: 52,
    height: 32,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#0f172a",
  },
  grid: {
    flex: 1,
  },
  gridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    paddingBottom: 24,
  },
  challengeButton: {
    width: "45%",
    minWidth: 140,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    alignItems: "center",
    gap: 4,
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  challengeLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#facc15",
    letterSpacing: 0.3,
  },
  challengeCheck: {
    fontSize: 18,
    lineHeight: 22,
  },
  challengeSubLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#e2e8f0",
  },
});
