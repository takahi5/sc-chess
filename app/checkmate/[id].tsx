import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Chess, Move, Square } from 'chess.js';

import { ChessBoard } from '@/components/chess/chess-board';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CHECKMATE_CHALLENGES } from '@/constants/checkmate-challenges';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useChessGame } from '@/hooks/use-chess-game';
import { deriveStatusLabel } from '@/utils/derive-status-label';

type ChallengeResult = 'idle' | 'success' | 'failure';

export default function CheckmateChallengeScreen() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const challengeId = Number(idParam);
  const challenge = useMemo(
    () => CHECKMATE_CHALLENGES.find((entry) => entry.id === challengeId),
    [challengeId],
  );
  const [result, setResult] = useState<ChallengeResult>('idle');
  const colorScheme = useColorScheme();
  const turnLabelColor = '#166534';

  const handleMove = useCallback(
    (_: Move, game: Chess) => {
      if (result !== 'idle') {
        return;
      }

      if (game.isCheckmate()) {
        setResult('success');
      } else {
        setResult('failure');
      }
    },
    [result],
  );

  const { board, highlights, selectSquare, status, turn, resetGame } = useChessGame({
    initialFen: challenge?.fen,
    onMove: handleMove,
  });

  const { width, height } = useWindowDimensions();
  const boardSize = useMemo(() => {
    const constrained = Math.min(width - 32, height * 0.7);
    return Math.max(constrained, 260);
  }, [height, width]);

  const controlTextColor = colorScheme === 'dark' ? '#e2e8f0' : '#334155';
  const successTint =
    colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.25)' : 'rgba(203, 213, 225, 0.55)';
  const failureTint =
    colorScheme === 'dark' ? 'rgba(248, 113, 113, 0.18)' : 'rgba(254, 226, 226, 0.45)';

  const successAnim = useRef(new Animated.Value(result === 'success' ? 1 : 0));
  const successScale = useMemo(
    () =>
      successAnim.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
      }),
    [],
  );

  useEffect(() => {
    Animated.timing(successAnim.current, {
      toValue: result === 'success' ? 1 : 0,
      duration: result === 'success' ? 320 : 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [result]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleReset = useCallback(() => {
    resetGame();
    setResult('idle');
  }, [resetGame]);

  const handleTryAgain = useCallback(() => {
    handleReset();
  }, [handleReset]);

  const handleGiveUp = useCallback(() => {
    setResult('idle');
    resetGame();
    router.back();
  }, [resetGame, router]);

  const handleSelectSquare = useCallback(
    (square: Square) => {
      if (result !== 'idle') {
        return;
      }
      selectSquare(square);
    },
    [result, selectSquare],
  );

  const statusLabel = useMemo(() => deriveStatusLabel(status, turn), [status, turn]);

  if (!challenge) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <ThemedView style={[styles.container, styles.missingContainer]}>
          <ThemedText style={styles.missingTitle}>Challenge not found</ThemedText>
          <TouchableOpacity activeOpacity={0.85} style={styles.finishButton} onPress={handleBackPress}>
            <ThemedText style={styles.finishButtonLabel}>Back to list</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ThemedView
        style={[
          styles.container,
          result === 'success' && { backgroundColor: successTint },
          result === 'failure' && { backgroundColor: failureTint },
        ]}>
        <Animated.View
          pointerEvents={result === 'success' ? 'auto' : 'none'}
          style={[
            styles.finishOverlay,
            {
              opacity: successAnim.current,
            },
          ]}>
          <Animated.View
            style={[
              styles.finishCard,
              {
                transform: [{ scale: successScale }],
              },
            ]}>
            <ThemedText style={styles.finishTitle}>Checkmate!</ThemedText>
            <ThemedText style={styles.finishSubtitle}>Nice work. Ready for the next puzzle?</ThemedText>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.finishButton}
              onPress={handleBackPress}>
              <ThemedText style={styles.finishButtonLabel}>Back to list</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        {result === 'failure' && (
          <View style={styles.failureOverlay} pointerEvents="auto">
            <View style={styles.failureCard}>
              <ThemedText style={styles.failureTitle}>Failed</ThemedText>
              <ThemedText style={styles.failureSubtitle}>
                That move does not deliver checkmate.
              </ThemedText>
              <View style={styles.failureActions}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.failurePrimaryButton}
                  onPress={handleTryAgain}>
                  <ThemedText style={styles.failurePrimaryLabel}>Try Again</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.failureSecondaryButton}
                  onPress={handleGiveUp}>
                  <ThemedText style={styles.failureSecondaryLabel}>Give Up</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View style={styles.header}>
          <Pressable style={styles.linkButton} onPress={handleBackPress}>
            <ThemedText style={[styles.linkLabel, { color: controlTextColor }]}>Back</ThemedText>
          </Pressable>
          <ThemedText type="subtitle">Challenge {challenge.id}</ThemedText>
          <Pressable style={styles.linkButton} onPress={handleReset}>
            <ThemedText style={[styles.linkLabel, { color: controlTextColor }]}>Reset</ThemedText>
          </Pressable>
        </View>
        <View style={styles.descriptionBlock}>
          <ThemedText style={styles.descriptionLine}>White to move.</ThemedText>
          <ThemedText style={styles.descriptionSubLine}>Deliver mate in one.</ThemedText>
        </View>
        <View style={styles.statusContainer}>
          {statusLabel ? (
            <ThemedText
              style={[
                styles.statusLabel,
                status.phase === 'checkmate' && styles.statusLabelCheckmate,
                status.phase === 'draw' && styles.statusLabelDraw,
              ]}>
              {statusLabel}
            </ThemedText>
          ) : (
            <ThemedText style={styles.statusLabelPlaceholder}> </ThemedText>
          )}
        </View>
        <View style={styles.turnSlot}>
          {turn === 'b' ? (
            <ThemedText style={[styles.turnLabel, { color: turnLabelColor }]}>
              Black to move
            </ThemedText>
          ) : (
            <ThemedText style={[styles.turnLabelPlaceholder, { color: turnLabelColor }]}>{' '}</ThemedText>
          )}
        </View>
        <View style={[styles.boardContainer, { height: boardSize, width: boardSize }]}>
          <ChessBoard
            board={board}
            highlights={highlights}
            onSelectSquare={handleSelectSquare}
            orientation="w"
            size={boardSize}
          />
        </View>
        <View style={styles.turnSlot}>
          {turn === 'w' ? (
            <ThemedText style={[styles.turnLabel, { color: turnLabelColor }]}>
              White to move
            </ThemedText>
          ) : (
            <ThemedText style={[styles.turnLabelPlaceholder, { color: turnLabelColor }]}>{' '}</ThemedText>
          )}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
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
  missingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  missingTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  finishOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    zIndex: 10,
  },
  finishCard: {
    paddingHorizontal: 32,
    paddingVertical: 36,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 2,
    borderColor: '#facc15',
    alignItems: 'center',
    gap: 12,
  },
  finishTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#facc15',
    textAlign: 'center',
  },
  finishSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e2e8f0',
    textAlign: 'center',
  },
  finishButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#facc15',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  finishButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  failureOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    zIndex: 10,
  },
  failureCard: {
    paddingHorizontal: 28,
    paddingVertical: 32,
    borderRadius: 24,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#ef4444',
    alignItems: 'center',
    gap: 16,
  },
  failureTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f87171',
  },
  failureSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f8fafc',
    textAlign: 'center',
  },
  failureActions: {
    flexDirection: 'row',
    gap: 12,
  },
  failurePrimaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#facc15',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  failurePrimaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  failureSecondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#facc15',
    backgroundColor: 'transparent',
  },
  failureSecondaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#facc15',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionBlock: {
    alignItems: 'center',
    gap: 4,
  },
  descriptionLine: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionSubLine: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  statusContainer: {
    alignItems: 'center',
    minHeight: 24,
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusLabelCheckmate: {
    color: '#dc2626',
    fontWeight: '700',
  },
  statusLabelDraw: {
    color: '#2563eb',
  },
  statusLabelPlaceholder: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0,
  },
  turnSlot: {
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  turnLabelPlaceholder: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0,
  },
  boardContainer: {
    alignSelf: 'center',
  },
});
