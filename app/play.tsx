import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChessBoard } from '@/components/chess/chess-board';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useChessGame } from '@/hooks/use-chess-game';

export default function PlayScreen() {
  const { width, height } = useWindowDimensions();
  const boardSize = useMemo(() => {
    const constrained = Math.min(width - 32, height * 0.7);
    return Math.max(constrained, 260);
  }, [height, width]);
  const colorScheme = useColorScheme();
  const controlTextColor = colorScheme === 'dark' ? '#e2e8f0' : '#334155';
  const turnLabelColor = '#166534';
  const router = useRouter();

  const { board, highlights, selectSquare, turn, status, resetGame } = useChessGame();

  const handleBackPress = useCallback(() => {
    Alert.alert('Leave match?', 'Going back will forfeit the current game.', [
      { text: 'Stay', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: () => router.back(),
      },
    ]);
  }, [router]);

  const handleResetPress = useCallback(() => {
    Alert.alert('Reset board?', 'All moves will be cleared and a new game will start.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: resetGame,
      },
    ]);
  }, [resetGame]);

  const statusLabel = useMemo(() => deriveStatusLabel(status, turn), [status, turn]);
  const finishedOverlay = useMemo(() => {
    switch (status.phase) {
      case 'checkmate':
        return colorScheme === 'dark'
          ? 'rgba(148, 163, 184, 0.25)'
          : 'rgba(203, 213, 225, 0.55)';
      case 'stalemate':
      case 'draw':
        return colorScheme === 'dark'
          ? 'rgba(148, 163, 184, 0.2)'
          : 'rgba(226, 232, 240, 0.5)';
      default:
        return null;
    }
  }, [colorScheme, status.phase]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ThemedView
        style={[styles.container, finishedOverlay && { backgroundColor: finishedOverlay }]}>
        <View style={styles.header}>
          <Pressable style={styles.linkButton} onPress={handleBackPress}>
            <ThemedText style={[styles.linkLabel, { color: controlTextColor }]}>Back</ThemedText>
          </Pressable>
          <ThemedText type="subtitle">Local Match</ThemedText>
          <Pressable style={styles.linkButton} onPress={handleResetPress}>
            <ThemedText style={[styles.linkLabel, { color: controlTextColor }]}>Reset</ThemedText>
          </Pressable>
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
            <ThemedText
              style={[styles.turnLabelPlaceholder, { color: turnLabelColor }]}>{' '}</ThemedText>
          )}
        </View>
        <View style={[styles.boardContainer, { height: boardSize, width: boardSize }]}>
          <ChessBoard
            board={board}
            highlights={highlights}
            size={boardSize}
            onSelectSquare={selectSquare}
            orientation={turn}
          />
        </View>
        <View style={styles.turnSlot}>
          {turn === 'w' ? (
            <ThemedText style={[styles.turnLabel, { color: turnLabelColor }]}>
              White to move
            </ThemedText>
          ) : (
            <ThemedText
              style={[styles.turnLabelPlaceholder, { color: turnLabelColor }]}>{' '}</ThemedText>
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
  boardContainer: {
    alignSelf: 'center',
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
});

function deriveStatusLabel(
  status: ReturnType<typeof useChessGame>['status'],
  turn: ReturnType<typeof useChessGame>['turn'],
) {
  switch (status.phase) {
    case 'playing':
      return status.inCheck ? `${turn === 'w' ? 'White' : 'Black'} is in check` : '';
    case 'checkmate':
      return `${status.winner === 'w' ? 'White' : 'Black'} wins by checkmate`;
    case 'stalemate':
      return 'Draw by stalemate';
    case 'draw':
      switch (status.reason) {
        case 'insufficient-material':
          return 'Draw – insufficient material';
        case 'threefold':
          return 'Draw – threefold repetition';
        case 'fifty-move':
          return 'Draw – fifty-move rule';
        default:
          return 'Draw';
      }
    default:
      return '';
  }
}
