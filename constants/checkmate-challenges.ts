export type CheckmateChallengeDefinition = {
  id: number;
  fen: string;
  mates: string[];
};

export const CHECKMATE_CHALLENGES: CheckmateChallengeDefinition[] = [
  {
    id: 1,
    fen: 'r2k1b2/p1pp1Qp1/1q4r1/1pP1p2p/N6P/P3n3/1P1RPK2/5BNR w - - 3 22',
    mates: ['Qxf8#', 'Qxd7#'],
  },
  {
    id: 2,
    fen: '2r1k1r1/p1n1p3/2b1Pb2/2pp2Qp/7p/1P1Pp3/4N3/1NB2K1R w - - 3 37',
    mates: ['Qxg8#'],
  },
  {
    id: 3,
    fen: '1n1k1N1r/r4p1p/2pBP3/1Q1P4/1p6/p1P3K1/P3P1PP/RN1b1B1R w - - 1 22',
    mates: ['Qxb8#'],
  },
  {
    id: 4,
    fen: '1n1qkb1r/rb1pnp1p/1p2p1p1/p1p5/1PN1P2P/P4N2/2PP1PP1/R1BQKB1R w KQk - 1 11',
    mates: ['Nd6#'],
  },
  {
    id: 5,
    fen: 'rn2kbnr/pp2ppp1/4P2p/3p4/2Q2P2/q1N4b/1PPP2P1/1RB1KBNR w kq - 0 13',
    mates: ['Qc8#'],
  },
  {
    id: 6,
    fen: 'rn2kbn1/pp2pppr/4P2p/3p4/2Q2P2/q6b/1PPPN1P1/1RB1KBNR w q - 2 14',
    mates: ['Qc8#'],
  },
  {
    id: 7,
    fen: 'rn2kbn1/pp2pppr/4P2p/3p4/q1QN1P2/7b/1PPP2P1/1RB1KBNR w q - 4 15',
    mates: ['Qc8#'],
  },
  {
    id: 8,
    fen: '2bq1kn1/r1pQppbr/8/6pp/1pB1PnPP/P7/2P5/RNB1K1NR w - - 1 15',
    mates: ['Qxd8#'],
  },
  {
    id: 9,
    fen: '1r4rk/1pp2Qp1/4b3/n2n1p2/2PbP2p/1P4PP/1R1P4/1BBK2NR w - - 8 34',
    mates: ['Qh5#'],
  },
  {
    id: 10,
    fen: '4r2r/4R3/p1P2bkn/5pPp/P6P/2q5/b2PN3/2B1K3 w - - 0 41',
    mates: ['Nf4#'],
  },
];
