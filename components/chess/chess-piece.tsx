import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import type { Piece } from 'chess.js';

type ChessPieceProps = {
  piece: Piece;
  size: number;
};

export const ChessPiece = memo(({ piece, size }: ChessPieceProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {renderPiece(piece)}
    </Svg>
  );
});

ChessPiece.displayName = 'ChessPiece';

function renderPiece(piece: Piece) {
  switch (piece.type) {
    case 'p':
      return <Pawn color={piece.color} />;
    case 'r':
      return <Rook color={piece.color} />;
    case 'n':
      return <Knight color={piece.color} />;
    case 'b':
      return <Bishop color={piece.color} />;
    case 'q':
      return <Queen color={piece.color} />;
    case 'k':
      return <King color={piece.color} />;
    default:
      return null;
  }
}

type PieceProps = { color: Piece['color'] };

const palette = {
  lightFill: '#f9fafb',
  lightStroke: '#334155',
  darkFill: '#0f1729',
  darkStroke: '#1e293b',
};

const Pawn = ({ color }: PieceProps) => {
  const fill = color === 'w' ? palette.lightFill : palette.darkFill;
  const stroke = color === 'w' ? palette.lightStroke : palette.darkStroke;

  return (
    <>
      <Circle cx="50" cy="32" r="14" fill={fill} stroke={stroke} strokeWidth={4} />
      <Path
        d="M36 75h28c4 0 7-3 7-7 0-7-8-9-8-18 0-5-4-9-9-9h-8c-5 0-9 4-9 9 0 9-8 11-8 18 0 4 3 7 7 7Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M30 78h40a4 4 0 0 1 4 4v2c0 3-2 5-5 5H31c-3 0-5-2-5-5v-2a4 4 0 0 1 4-4Z"
        fill={stroke}
      />
    </>
  );
};

const Rook = ({ color }: PieceProps) => {
  const fill = color === 'w' ? palette.lightFill : palette.darkFill;
  const stroke = color === 'w' ? palette.lightStroke : palette.darkStroke;

  return (
    <>
      <Path
        d="M30 28V18h12v10h8V18h12v10h5v12l-6 4v10l6 4v12H30V58l6-4V44l-6-4V28h0Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M26 82h48a4 4 0 0 1 4 4v3c0 3-2 5-5 5H27c-3 0-5-2-5-5v-3a4 4 0 0 1 4-4Z"
        fill={stroke}
      />
    </>
  );
};

const Knight = ({ color }: PieceProps) => {
  const fill = color === 'w' ? palette.lightFill : palette.darkFill;
  const stroke = color === 'w' ? palette.lightStroke : palette.darkStroke;

  return (
    <>
      <Path
        d="M66 80H38c-6 0-11-5-11-11 0-9 8-12 8-18 0-4 0-8-6-11l16-24h4l20 22-6 8 10 6v12c0 9-6 16-14 16Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Circle cx="56" cy="44" r="3" fill={stroke} />
      <Path
        d="M28 83h48a4 4 0 0 1 4 4v2c0 3-2 5-5 5H29c-3 0-5-2-5-5v-2a4 4 0 0 1 4-4Z"
        fill={stroke}
      />
    </>
  );
};

const Bishop = ({ color }: PieceProps) => {
  const fill = color === 'w' ? palette.lightFill : palette.darkFill;
  const stroke = color === 'w' ? palette.lightStroke : palette.darkStroke;

  return (
    <>
      <Circle cx="50" cy="24" r="11" fill={fill} stroke={stroke} strokeWidth={4} />
      <Path
        d="M50 36c10 0 18 8 18 18 0 9-7 15-12 18 5 3 12 8 12 16v4H32v-4c0-8 7-13 12-16-5-3-12-9-12-18 0-10 8-18 18-18Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M32 84h36a4 4 0 0 1 4 4v1c0 3-2 5-5 5H33c-3 0-5-2-5-5v-1a4 4 0 0 1 4-4Z"
        fill={stroke}
      />
      <Path
        d="m44 46 12 12m0-12-12 12"
        stroke={stroke}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </>
  );
};

const Queen = ({ color }: PieceProps) => {
  const fill = color === 'w' ? palette.lightFill : palette.darkFill;
  const stroke = color === 'w' ? palette.lightStroke : palette.darkStroke;

  return (
    <>
      <Path
        d="M24 82h52l-6-16 6-18-12 6-12-24-12 24-12-6 6 18-6 16Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Circle cx="50" cy="20" r="8" fill={fill} stroke={stroke} strokeWidth={4} />
      <Path d="m38 20 12-16 12 16" stroke={stroke} strokeWidth={5} strokeLinecap="round" />
      <Path
        d="M30 84h40a4 4 0 0 1 4 4v1c0 3-2 5-5 5H31c-3 0-5-2-5-5v-1a4 4 0 0 1 4-4Z"
        fill={stroke}
      />
    </>
  );
};

const King = ({ color }: PieceProps) => {
  const fill = color === 'w' ? palette.lightFill : palette.darkFill;
  const stroke = color === 'w' ? palette.lightStroke : palette.darkStroke;

  return (
    <>
      <Path
        d="M40 44h20c8 0 14 6 14 14 0 6-4 12-10 14 6 3 10 9 10 16v2H26v-2c0-7 4-13 10-16-6-2-10-8-10-14 0-8 6-14 14-14Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M50 16v14M42 24h16"
        stroke={stroke}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Circle cx="50" cy="38" r="8" fill={fill} stroke={stroke} strokeWidth={4} />
      <Path
        d="M28 84h44a4 4 0 0 1 4 4v2c0 3-2 5-5 5H29c-3 0-5-2-5-5v-2a4 4 0 0 1 4-4Z"
        fill={stroke}
      />
    </>
  );
};
