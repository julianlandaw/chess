(function () {
  'use strict';

  window.QK_PUZZLES = Object.freeze([
    {
      id: 'back-rank-seal', theme: 'Back-rank mate',
      title: 'The back rank', prompt: 'White to move. Deliver checkmate in one.',
      fen: '6k1/5ppp/8/8/8/8/6PP/4R1K1 w - - 0 1',
      line: ['e1e8'], objective: 'checkmate',
      hints: ['Start with a forcing rook check.', 'The rook belongs on the eighth rank.'],
      answer: 'Re8# seals the back rank.'
    },
    {
      id: 'queen-king-net', theme: 'Queen mate',
      title: 'Queen and king', prompt: 'White to move. Deliver checkmate in one.',
      fen: '7k/8/6K1/8/8/8/5Q2/8 w - - 0 1',
      line: ['f2f8'], objective: 'checkmate',
      hints: ['Use the queen to cover the entire eighth rank.', 'Move the queen to f8.'],
      answer: 'Qf8# covers every escape square.'
    },
    {
      id: 'smothered-knight', theme: 'Smothered mate',
      title: 'Smothered king', prompt: 'White to move. Deliver checkmate in one.',
      fen: '6rk/6pp/7N/8/8/8/8/6K1 w - - 0 1',
      line: ['h6f7'], objective: 'checkmate',
      hints: ['A knight can check without opening an escape square.', 'The knight jumps to f7.'],
      answer: 'Nf7# mates the boxed-in king.'
    },
    {
      id: 'long-rook-lift', theme: 'Rook mate',
      title: 'The long rook lift', prompt: 'White to move. Deliver checkmate in one.',
      fen: '7k/6pp/8/5K2/8/8/8/R7 w - - 0 1',
      line: ['a1a8'], objective: 'checkmate',
      hints: ['Control every square on the eighth rank.', 'Lift the rook from a1 to a8.'],
      answer: 'Ra8# controls the entire eighth rank.'
    },
    {
      id: 'legals-mate', theme: 'Mating combination',
      title: "Légal's mate", prompt: 'White to move. Find the three-move mating combination.',
      fen: 'r1bqkbnr/ppp2ppp/2np4/4p2b/2B1P3/2N2N1P/PPPP1PP1/R1BQK2R w KQkq - 0 6',
      line: ['f3e5', 'h5d1', 'c4f7', 'e8e7', 'c3d5'], objective: 'checkmate',
      hints: ['The pinned knight can move if the attack ends in mate.', 'Begin with Nxe5, allowing ...Bxd1.', 'After Bxf7+, finish with Nd5#.'],
      answer: 'Nxe5! Bxd1 Bxf7+ Ke7 Nd5# completes Légal’s mate.'
    }
  ]);
}());
