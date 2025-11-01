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
  {
    id: 11,
    fen: 'rb1k4/n5R1/7N/p3pbrp/PPQ1PP2/8/8/1B2KN2 w - - 1 59',
    mates: ['Qg8#'],
  },
  {
    id: 12,
    fen: 'rb1k4/n5R1/7N/4pbrp/PpQ1PP2/8/2B5/4KN2 w - - 0 60',
    mates: ['Qg8#'],
  },
  {
    id: 13,
    fen: '4rb1r/p3p1p1/Pp1p1q1p/1Pp2B1k/2bP1P1P/4K3/3N2P1/6NR w - - 5 43',
    mates: ['g4#'],
  },
  {
    id: 14,
    fen: '4nB2/3p1ppr/4k3/1N1b3p/5QPP/3P4/PR2PK2/5QN1 w - - 4 30',
    mates: ['Nd4#', 'Qf5#'],
  },
  {
    id: 15,
    fen: '5B2/2np1ppr/4k3/1N1b3p/5QPP/3P4/P2RPK2/5QN1 w - - 6 31',
    mates: ['Nxc7#', 'Nd4#', 'Qd6#', 'Qf5#'],
  },
  {
    id: 16,
    fen: '5B1r/2np1pp1/4k3/1N1b3p/6PP/3P1Q2/P2RPK2/5QN1 w - - 8 32',
    mates: ['Qf5#'],
  },
  {
    id: 17,
    fen: '5B1r/2np1pp1/4k3/1N5p/6PP/1b1P1Q1N/P2RPK2/5Q2 w - - 10 33',
    mates: ['Qf5#'],
  },
  {
    id: 18,
    fen: '5B2/2np1pp1/4k2r/1N4Pp/7P/1b1P1Q1N/P2RPK2/5Q2 w - - 1 34',
    mates: ['Qe4#'],
  },
  {
    id: 19,
    fen: '8/2np1pp1/4k2r/1N4Pp/1Bb4P/3P1Q1N/P2RPK2/5Q2 w - - 3 35',
    mates: ['Qe4#'],
  },
  {
    id: 20,
    fen: '8/2np1p2/4k1pr/6Pp/1Bb4P/2NP1Q1N/P2RPK2/5Q2 w - - 0 36',
    mates: ['Qe4#', 'Qf6#'],
  },
];
