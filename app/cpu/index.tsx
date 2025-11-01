import { Link, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";

const DIFFICULTY_OPTIONS = [
  {
    key: "easy",
    label: "Beginner",
    description: "Relaxed practice against mostly random moves.",
  },
  {
    key: "medium",
    label: "Intermediate",
    description: "CPU that looks for simple material gains.",
  },
  {
    key: "hard",
    label: "Advanced",
    description: "Stronger engine that plans multiple moves ahead.",
  },
] as const;

export default function CpuDifficultyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const controlTextColor = useMemo(
    () => (colorScheme === "dark" ? "#e2e8f0" : "#334155"),
    [colorScheme]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ImageBackground
        source={require("@/assets/images/chess-photo.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
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
                  style={[styles.linkLabel, { color: controlTextColor }]}
                >
                  Back
                </ThemedText>
              </Pressable>
              <ThemedText type="subtitle">VS CPU</ThemedText>
              <View style={styles.linkButtonPlaceholder} />
            </View>
            <ThemedText style={styles.description}>
              Choose a difficulty to challenge the CPU. You will always play as White.
            </ThemedText>
            <View style={styles.options}>
              {DIFFICULTY_OPTIONS.map((option) => (
                <Link
                  key={option.key}
                  href={`/cpu/${option.key}`}
                  asChild
                >
                  <TouchableOpacity activeOpacity={0.85} style={styles.option}>
                    <ThemedText style={styles.optionLabel}>
                      {option.label}
                    </ThemedText>
                    <ThemedText style={styles.optionDescription}>
                      {option.description}
                    </ThemedText>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
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
  background: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  contentCard: {
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  linkButtonPlaceholder: {
    width: 52,
    height: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#0f172a",
  },
  options: {
    gap: 16,
  },
  option: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "rgba(15, 23, 42, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(248, 250, 252, 0.4)",
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
    gap: 8,
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#facc15",
    letterSpacing: 0.4,
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: "#f8fafc",
  },
});
