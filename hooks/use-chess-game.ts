import type { Color, Move, PieceSymbol, Square } from "chess.js";
import { Chess } from "chess.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type HighlightKind = "selected" | "move" | "capture" | "lastMove";

export type HighlightMap = Record<Square, HighlightKind[]>;

export type BoardState = ReturnType<Chess["board"]>;

export type GameStatus =
  | {
      phase: "playing";
      turn: Color;
      inCheck: boolean;
    }
  | {
      phase: "checkmate";
      winner: Color;
    }
  | {
      phase: "stalemate";
    }
  | {
      phase: "draw";
      reason:
        | "insufficient-material"
        | "threefold"
        | "fifty-move"
        | "repetition";
    };

export type LastMove = { from: Square; to: Square; san: string };

type MoveInput = {
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
};

type UseChessGameOptions = {
  initialFen?: string;
  onMove?: (move: Move, game: Chess) => void;
};

export function useChessGame(options?: UseChessGameOptions) {
  const { initialFen, onMove } = options ?? {};
  const initialFenRef = useRef<string | null>(initialFen ?? null);
  const onMoveRef = useRef<UseChessGameOptions["onMove"]>(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  const gameRef = useRef<Chess | null>(null);

  if (!gameRef.current) {
    const game = new Chess();
    if (initialFenRef.current) {
      try {
        game.load(initialFenRef.current);
      } catch (error) {
        console.warn(
          "Failed to load FEN for chess game.",
          initialFenRef.current,
          error
        );
      }
    }
    gameRef.current = game;
  }

  const [fen, setFen] = useState<string>(() => gameRef.current!.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [candidateMoves, setCandidateMoves] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);

  const board = useMemo<BoardState>(() => gameRef.current!.board(), [fen]);

  const turn = useMemo<Color>(() => gameRef.current!.turn(), [fen]);

  const status = useMemo<GameStatus>(
    () => deriveStatus(gameRef.current!),
    [fen]
  );

  const highlights = useMemo<HighlightMap>(() => {
    // Initialize all squares with empty arrays to ensure type safety
    const map = Object.create(null) as HighlightMap;
    for (const file of ["a", "b", "c", "d", "e", "f", "g", "h"] as const) {
      for (let rank = 1 as const; rank <= 8; rank++) {
        const square = `${file}${rank}` as Square;
        map[square] = [];
      }
    }

    if (lastMove) {
      map[lastMove.from] = [...(map[lastMove.from] ?? []), "lastMove"];
      map[lastMove.to] = [...(map[lastMove.to] ?? []), "lastMove"];
    }

    if (selectedSquare) {
      map[selectedSquare] = [...(map[selectedSquare] ?? []), "selected"];
    }

    candidateMoves.forEach((move) => {
      const type: HighlightKind = move.captured ? "capture" : "move";
      map[move.to as Square] = [...(map[move.to as Square] ?? []), type];
    });

    return map;
  }, [candidateMoves, lastMove, selectedSquare]);

  const applyMove = useCallback(
    (moveResult: Move) => {
      setLastMove({
        from: moveResult.from as Square,
        to: moveResult.to as Square,
        san: moveResult.san,
      });
      setFen(gameRef.current!.fen());
      onMoveRef.current?.(moveResult, gameRef.current!);
    },
    []
  );

  const makeMove = useCallback(
    ({ from, to, promotion }: MoveInput) => {
      const moveResult = gameRef.current!.move({ from, to, promotion });

      if (!moveResult) {
        return false;
      }

      setSelectedSquare(null);
      setCandidateMoves([]);
      applyMove(moveResult);

      return true;
    },
    [applyMove]
  );

  const selectSquare = useCallback(
    (square: Square) => {
      // Attempt to complete a move if a target square is tapped.
      if (selectedSquare) {
        const move = candidateMoves.find(
          (candidate) =>
            candidate.from === selectedSquare && candidate.to === square
        );

        if (move) {
          const promotion = resolvePromotion(move);
          const completed = makeMove({
            from: move.from as Square,
            to: move.to as Square,
            promotion,
          });

          if (completed) {
            return;
          }
        }
      }

      // Toggle selection off when tapping the same square again.
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setCandidateMoves([]);
        return;
      }

      const piece = gameRef.current!.get(square);

      if (!piece || piece.color !== turn) {
        setSelectedSquare(null);
        setCandidateMoves([]);
        return;
      }

      const moves = gameRef.current!.moves({ square, verbose: true }) as Move[];

      setSelectedSquare(moves.length ? square : null);
      setCandidateMoves(moves);
    },
    [candidateMoves, makeMove, selectedSquare, turn]
  );

  const resetGame = useCallback(() => {
    if (initialFenRef.current) {
      try {
        gameRef.current!.load(initialFenRef.current);
      } catch (error) {
        console.warn(
          "Failed to reset to initial FEN.",
          initialFenRef.current,
          error
        );
        gameRef.current!.reset();
      }
    } else {
      gameRef.current!.reset();
    }
    setFen(gameRef.current!.fen());
    setSelectedSquare(null);
    setCandidateMoves([]);
    setLastMove(null);
  }, []);

  return {
    fen,
    board,
    turn,
    status,
    highlights,
    selectedSquare,
    lastMove,
    selectSquare,
    makeMove,
    resetGame,
  };
}

function deriveStatus(game: Chess): GameStatus {
  if (game.isCheckmate()) {
    const winner = game.turn() === "w" ? "b" : "w";
    return { phase: "checkmate", winner };
  }

  if (game.isStalemate()) {
    return { phase: "stalemate" };
  }

  if (game.isDraw()) {
    const reason: Extract<GameStatus, { phase: "draw" }>["reason"] =
      game.isInsufficientMaterial()
        ? "insufficient-material"
        : game.isThreefoldRepetition()
        ? "threefold"
        : game.isDrawByFiftyMoves()
        ? "fifty-move"
        : "repetition";

    return { phase: "draw", reason };
  }

  return {
    phase: "playing",
    turn: game.turn(),
    inCheck: game.isCheck(),
  };
}

function resolvePromotion(move: Move): PieceSymbol | undefined {
  if (move.promotion) {
    return move.promotion;
  }

  return move.flags.includes("p") ? "q" : undefined;
}
