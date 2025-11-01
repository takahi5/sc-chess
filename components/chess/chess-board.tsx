import { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import type { Square } from 'chess.js';

import { ChessPiece } from '@/components/chess/chess-piece';
import type { BoardState, HighlightMap } from '@/hooks/use-chess-game';

const files: Square[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as unknown as Square[];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

type ChessBoardProps = {
  board: BoardState;
  highlights: HighlightMap;
  onSelectSquare: (square: Square) => void;
  size: number;
  orientation: 'w' | 'b';
};

export const ChessBoard = memo(
  ({ board, highlights, onSelectSquare, size, orientation }: ChessBoardProps) => {
    const tileSize = useMemo(() => size / 8, [size]);
    const pieceSize = useMemo(() => tileSize * 0.9, [tileSize]);
    const rotationValue = useRef(new Animated.Value(orientation === 'w' ? 0 : 1));

    useEffect(() => {
      Animated.timing(rotationValue.current, {
        toValue: orientation === 'w' ? 0 : 1,
        duration: 320,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, [orientation]);

    const rotation = useMemo(
      () =>
        rotationValue.current.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      [],
    );

    return (
      <View style={[styles.board, { width: size, height: size }]}> 
        {board.map((row, rowIndex) => (
          <View key={`rank-${ranks[rowIndex]}`} style={styles.row}>
            {row.map((piece, columnIndex) => {
              const file = files[columnIndex];
              const rank = ranks[rowIndex];
              const square = `${file}${rank}` as Square;
              const squareHighlights = highlights[square] ?? [];
              const isLight = (rowIndex + columnIndex) % 2 === 0;

              return (
                <Pressable
                  key={square}
                  style={({ pressed }) => [
                    styles.square,
                    isLight ? styles.lightSquare : styles.darkSquare,
                    { width: tileSize, height: tileSize },
                    pressed && styles.squarePressed,
                  ]}
                  onPress={() => onSelectSquare(square)}>
                  <View style={styles.overlayContainer} pointerEvents="none">
                    {squareHighlights.includes('lastMove') && <View style={styles.lastMoveOverlay} />}
                    {squareHighlights.includes('selected') && (
                      <View style={styles.selectedOverlay} />
                    )}
                  </View>
                  {squareHighlights.includes('move') && !piece && (
                    <View style={styles.moveIndicator} pointerEvents="none" />
                  )}
                  {squareHighlights.includes('capture') && (
                    <View style={styles.captureIndicator} pointerEvents="none" />
                  )}
                  {piece && (
                    <Animated.View
                      style={[
                        styles.pieceContainer,
                        {
                          width: pieceSize,
                          height: pieceSize,
                          transform: [{ rotate: rotation }],
                        },
                      ]}>
                      <ChessPiece piece={piece} size={pieceSize} />
                    </Animated.View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    );
  },
);

ChessBoard.displayName = 'ChessBoard';

const styles = StyleSheet.create({
  board: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1f2a37',
    backgroundColor: '#0f172a',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lightSquare: {
    backgroundColor: '#f3d9b1',
  },
  darkSquare: {
    backgroundColor: '#a26a41',
  },
  squarePressed: {
    opacity: 0.9,
  },
  lastMoveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(250, 204, 21, 0.35)',
  },
  moveIndicator: {
    position: 'absolute',
    width: '28%',
    height: '28%',
    borderRadius: 999,
    backgroundColor: 'rgba(15, 118, 110, 0.9)',
  },
  captureIndicator: {
    position: 'absolute',
    width: '86%',
    height: '86%',
    borderRadius: 999,
    borderWidth: 5,
    borderColor: 'rgba(220, 38, 38, 0.9)',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  pieceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
