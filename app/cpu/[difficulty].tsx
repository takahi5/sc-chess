import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChessBoard } from "@/components/chess/chess-board";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useCpuChessGame } from "@/hooks/use-cpu-chess-game";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { CpuDifficulty } from "@/utils/cpu-engine";
import { deriveStatusLabel } from "@/utils/derive-status-label";

const DIFFICULTY_LABELS: Record<CpuDifficulty, string> = {
  easy: "Beginner",
  medium: "Intermediate",
  hard: "Advanced",
};

export default function CpuMatchScreen() {
  const router = useRouter();
  const { difficulty: difficultyParam } = useLocalSearchParams<{
    difficulty?: string;
  }>();
  const parsedDifficulty = parseDifficulty(difficultyParam);
  const effectiveDifficulty: CpuDifficulty = parsedDifficulty ?? "easy";

  const { width, height } = useWindowDimensions();
  const boardSize = useMemo(() => {
    const constrained = Math.min(width - 32, height * 0.7);
    return Math.max(constrained, 260);
  }, [height, width]);

  const {
    board,
    turn,
    status,
    highlights,
    selectSquare,
    resetGame,
    isCpuThinking,
  } = useCpuChessGame({ difficulty: effectiveDifficulty });
  const colorScheme = useColorScheme();
  const turnLabelColor = "#166534";
  const headerTextColors = useMemo(
    () => ({ light: "#0f172a", dark: "#f8fafc" }),
    []
  );

  const handleBackPress = useCallback(() => {
    Alert.alert("Leave match?", "Going back will forfeit the current game.", [
      { text: "Stay", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);
  }, [router]);

  const handleResetPress = useCallback(() => {
    Alert.alert("Reset board?", "All moves will be cleared and a new game will start.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: resetGame,
      },
    ]);
  }, [resetGame]);

  const statusLabel = useMemo(() => deriveStatusLabel(status, turn), [status, turn]);
  const isFinished =
    status.phase === "checkmate" ||
    status.phase === "stalemate" ||
    status.phase === "draw";
  const finishAnim = useRef(new Animated.Value(isFinished ? 1 : 0));
  const finishScale = useMemo(
    () =>
      finishAnim.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
      }),
    []
  );

  useEffect(() => {
    Animated.timing(finishAnim.current, {
      toValue: isFinished ? 1 : 0,
      duration: isFinished ? 320 : 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isFinished]);

  const finishedOverlay = useMemo(() => {
    switch (status.phase) {
      case "checkmate":
        return colorScheme === "dark"
          ? "rgba(148, 163, 184, 0.25)"
          : "rgba(203, 213, 225, 0.55)";
      case "stalemate":
      case "draw":
        return colorScheme === "dark"
          ? "rgba(148, 163, 184, 0.2)"
          : "rgba(226, 232, 240, 0.5)";
      default:
        return null;
    }
  }, [colorScheme, status.phase]);

  if (!parsedDifficulty) {
    return <Redirect href="/cpu" />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <ThemedView
        style={[styles.container, finishedOverlay && { backgroundColor: finishedOverlay }]}
      >
        <Animated.View
          pointerEvents={isFinished ? "auto" : "none"}
          style={[
            styles.finishOverlay,
            {
              opacity: finishAnim.current,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.finishCard,
              {
                transform: [{ scale: finishScale }],
              },
            ]}
          >
            <ThemedText style={styles.finishTitle}>{statusLabel}</ThemedText>
            <ThemedText style={styles.finishSubtitle}>
              Try another match or ramp up the difficulty.
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.finishButton}
              onPress={handleResetPress}
            >
              <ThemedText style={styles.finishButtonLabel}>Play Again</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        <View style={styles.header}>
          <Pressable style={styles.linkButton} onPress={handleBackPress}>
            <ThemedText
              style={styles.linkLabel}
              lightColor={headerTextColors.light}
              darkColor={headerTextColors.dark}
            >
              Back
            </ThemedText>
          </Pressable>
          <ThemedText
            type="subtitle"
            lightColor={headerTextColors.light}
            darkColor={headerTextColors.dark}
          >
            CPU Match · {DIFFICULTY_LABELS[effectiveDifficulty]}
          </ThemedText>
          <Pressable style={styles.linkButton} onPress={handleResetPress}>
            <ThemedText
              style={styles.linkLabel}
              lightColor={headerTextColors.light}
              darkColor={headerTextColors.dark}
            >
              Reset
            </ThemedText>
          </Pressable>
        </View>
        <View style={styles.statusContainer}>
          {statusLabel ? (
            <ThemedText
              style={[
                styles.statusLabel,
                status.phase === "checkmate" && styles.statusLabelCheckmate,
                status.phase === "draw" && styles.statusLabelDraw,
              ]}
            >
              {statusLabel}
            </ThemedText>
          ) : (
            <ThemedText style={styles.statusLabelPlaceholder}> </ThemedText>
          )}
        </View>
        <View style={styles.turnSlot}>
          {turn === "b" ? (
            <ThemedText style={[styles.turnLabel, { color: turnLabelColor }]}>
              CPU {isCpuThinking ? "thinking..." : "to move"}
            </ThemedText>
          ) : (
            <ThemedText
              style={[styles.turnLabelPlaceholder, { color: turnLabelColor }]}
            >
              {" "}
            </ThemedText>
          )}
        </View>
        <View style={[styles.boardContainer, { height: boardSize, width: boardSize }]}>
          <ChessBoard
            board={board}
            highlights={highlights}
            size={boardSize}
            onSelectSquare={selectSquare}
            orientation="w"
          />
          {isCpuThinking && status.phase === "playing" && (
            <View style={styles.thinkingOverlay} pointerEvents="none">
              <ActivityIndicator size="small" color="#facc15" />
              <ThemedText style={styles.thinkingLabel}>CPU thinking</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.turnSlot}>
          {turn === "w" ? (
            <ThemedText style={[styles.turnLabel, { color: turnLabelColor }]}>
              Your move
            </ThemedText>
          ) : (
            <ThemedText
              style={[styles.turnLabelPlaceholder, { color: turnLabelColor }]}
            >
              {" "}
            </ThemedText>
          )}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

function parseDifficulty(param: unknown): CpuDifficulty | null {
  if (typeof param !== "string") {
    return null;
  }

  if (param === "easy" || param === "medium" || param === "hard") {
    return param;
  }

  return null;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  finishOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    zIndex: 10,
  },
  finishCard: {
    paddingHorizontal: 32,
    paddingVertical: 36,
    borderRadius: 24,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderWidth: 2,
    borderColor: "#facc15",
    alignItems: "center",
    gap: 12,
  },
  finishTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#facc15",
    textAlign: "center",
  },
  finishSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e2e8f0",
    textAlign: "center",
  },
  finishButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#facc15",
    shadowColor: "#fbbf24",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  finishButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  statusContainer: {
    alignItems: "center",
    minHeight: 24,
    justifyContent: "center",
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusLabelCheckmate: {
    color: "#dc2626",
    fontWeight: "700",
  },
  statusLabelDraw: {
    color: "#2563eb",
  },
  statusLabelPlaceholder: {
    fontSize: 16,
    fontWeight: "600",
    opacity: 0,
  },
  boardContainer: {
    alignSelf: "center",
    position: "relative",
  },
  thinkingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    gap: 8,
  },
  thinkingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#facc15",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  turnSlot: {
    minHeight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  turnLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  turnLabelPlaceholder: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0,
  },
});
