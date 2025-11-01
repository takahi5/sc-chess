import type { Color } from 'chess.js';

import type { GameStatus } from '@/hooks/use-chess-game';

export function deriveStatusLabel(status: GameStatus, turn: Color) {
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
