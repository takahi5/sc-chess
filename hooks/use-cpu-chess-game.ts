import type { PieceSymbol, Square } from "chess.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CpuDifficulty } from "@/utils/cpu-engine";
import { chooseCpuMove, getCpuThinkingDelay } from "@/utils/cpu-engine";
import { useChessGame } from "@/hooks/use-chess-game";

type UseCpuChessGameOptions = {
  difficulty: CpuDifficulty;
};

export function useCpuChessGame({ difficulty }: UseCpuChessGameOptions) {
  const {
    board,
    turn,
    status,
    highlights,
    lastMove,
    selectSquare,
    makeMove,
    resetGame: baseResetGame,
    fen,
  } = useChessGame();
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const difficultyRef = useRef<CpuDifficulty>(difficulty);
  const isThinkingRef = useRef(false);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  const updateThinking = useCallback((value: boolean) => {
    isThinkingRef.current = value;
    setIsCpuThinking(value);
  }, []);

  const clearPendingCpuMove = useCallback(() => {
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    if (isThinkingRef.current) {
      updateThinking(false);
    }
  }, [updateThinking]);

  useEffect(() => {
    if (turn !== "b" || status.phase !== "playing") {
      clearPendingCpuMove();
      return;
    }

    if (thinkingTimeoutRef.current || isThinkingRef.current) {
      return;
    }

    updateThinking(true);
    const delay = getCpuThinkingDelay(difficultyRef.current);

    const timeout = setTimeout(() => {
      const move = chooseCpuMove(fen, difficultyRef.current);

      if (move) {
        makeMove({
          from: move.from as Square,
          to: move.to as Square,
          promotion: move.promotion as PieceSymbol | undefined,
        });
      }

      thinkingTimeoutRef.current = null;
      updateThinking(false);
    }, delay);

    thinkingTimeoutRef.current = timeout;

    return () => {
      if (thinkingTimeoutRef.current === timeout) {
        clearTimeout(timeout);
        thinkingTimeoutRef.current = null;
        updateThinking(false);
      }
    };
  }, [clearPendingCpuMove, fen, makeMove, status.phase, turn, updateThinking]);

  const resetGame = useCallback(() => {
    clearPendingCpuMove();
    baseResetGame();
  }, [baseResetGame, clearPendingCpuMove]);

  const guardSelectSquare = useCallback(
    (square: Square) => {
      if (status.phase !== "playing" || turn !== "w" || isThinkingRef.current) {
        return;
      }
      selectSquare(square);
    },
    [selectSquare, status.phase, turn]
  );

  return useMemo(
    () => ({
      board,
      turn,
      status,
      highlights,
      lastMove,
      selectSquare: guardSelectSquare,
      resetGame,
      isCpuThinking,
      fen,
    }),
    [board, guardSelectSquare, highlights, isCpuThinking, lastMove, resetGame, status, turn, fen]
  );
}
