import type { Move } from "chess.js";
import { Chess } from "chess.js";

export type CpuDifficulty = "easy" | "medium" | "hard";

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export function getCpuThinkingDelay(difficulty: CpuDifficulty): number {
  switch (difficulty) {
    case "easy":
      return 350;
    case "medium":
      return 650;
    case "hard":
      return 950;
    default: {
      const exhaustiveCheck: never = difficulty;
      return exhaustiveCheck;
    }
  }
}

export function chooseCpuMove(
  fen: string,
  difficulty: CpuDifficulty
): Move | null {
  const game = new Chess(fen);

  if (game.turn() !== "b") {
    return null;
  }

  const moves = game.moves({ verbose: true }) as Move[];
  if (!moves.length) {
    return null;
  }

  switch (difficulty) {
    case "easy":
      return selectRandomMove(moves);
    case "medium":
      return selectGreedyMove(game, moves);
    case "hard":
      return selectMinimaxMove(game, moves, 3);
    default: {
      const exhaustiveCheck: never = difficulty;
      return exhaustiveCheck;
    }
  }
}

function evaluateMaterial(game: Chess): number {
  const board = game.board();

  let score = 0;

  board.forEach((row) => {
    row.forEach((piece) => {
      if (!piece) {
        return;
      }
      const value = PIECE_VALUES[piece.type];
      score += piece.color === "w" ? value : -value;
    });
  });

  return score;
}

function selectRandomMove(moves: Move[]): Move {
  const index = Math.floor(Math.random() * moves.length);
  return moves[index];
}

function selectGreedyMove(game: Chess, moves: Move[]): Move {
  let bestScore = Number.POSITIVE_INFINITY;
  const bestMoves: Move[] = [];

  moves.forEach((move) => {
    game.move(move);
    const score = evaluateMaterial(game);
    game.undo();

    if (score < bestScore - 1e-6) {
      bestScore = score;
      bestMoves.length = 0;
      bestMoves.push(move);
    } else if (Math.abs(score - bestScore) < 1e-6) {
      bestMoves.push(move);
    }
  });

  return selectRandomMove(bestMoves);
}

function selectMinimaxMove(game: Chess, moves: Move[], depth: number): Move {
  let bestScore = Number.POSITIVE_INFINITY;
  const bestMoves: Move[] = [];

  moves.forEach((move) => {
    game.move(move);
    const score = minimax(game, depth - 1, -Infinity, Infinity, true);
    game.undo();

    if (score < bestScore - 1e-6) {
      bestScore = score;
      bestMoves.length = 0;
      bestMoves.push(move);
    } else if (Math.abs(score - bestScore) < 1e-6) {
      bestMoves.push(move);
    }
  });

  return selectRandomMove(bestMoves);
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateMaterial(game);
  }

  const moves = game.moves({ verbose: true }) as Move[];

  if (!moves.length) {
    return evaluateMaterial(game);
  }

  if (maximizingPlayer) {
    let value = -Infinity;

    for (const move of moves) {
      game.move(move);
      value = Math.max(
        value,
        minimax(game, depth - 1, alpha, beta, false)
      );
      game.undo();
      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        break;
      }
    }

    return value;
  }

  let value = Infinity;

  for (const move of moves) {
    game.move(move);
    value = Math.min(
      value,
      minimax(game, depth - 1, alpha, beta, true)
    );
    game.undo();
    beta = Math.min(beta, value);
    if (beta <= alpha) {
      break;
    }
  }

  return value;
}
