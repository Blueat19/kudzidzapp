export interface MathProblem {
  id: number;
  type: 'counting' | 'addition' | 'subtraction';
  question: string;
  questionShona: string;
  answer: number;
  options: number[];
  objectEmoji?: string;
  num1?: number;
  num2?: number;
}

export const mathProblems: MathProblem[] = [
  // Counting (1-10)
  { id: 1, type: 'counting', question: 'How many apples?', questionShona: 'Maapuro mangani?', answer: 1, options: [1, 2, 3], objectEmoji: '🍎', num1: 1 },
  { id: 2, type: 'counting', question: 'How many stars?', questionShona: 'Nyeredzi ngani?', answer: 2, options: [1, 2, 3], objectEmoji: '⭐', num1: 2 },
  { id: 3, type: 'counting', question: 'How many hearts?', questionShona: 'Mwoyo mingani?', answer: 3, options: [2, 3, 4], objectEmoji: '❤️', num1: 3 },
  { id: 4, type: 'counting', question: 'How many balls?', questionShona: 'Mabhora mangani?', answer: 4, options: [3, 4, 5], objectEmoji: '🏀', num1: 4 },
  { id: 5, type: 'counting', question: 'How many flowers?', questionShona: 'Maruva mangani?', answer: 5, options: [4, 5, 6], objectEmoji: '🌸', num1: 5 },
  { id: 6, type: 'counting', question: 'How many fish?', questionShona: 'Hove ngani?', answer: 6, options: [5, 6, 7], objectEmoji: '🐟', num1: 6 },
  { id: 7, type: 'counting', question: 'How many birds?', questionShona: 'Shiri ngani?', answer: 7, options: [6, 7, 8], objectEmoji: '🐦', num1: 7 },
  { id: 8, type: 'counting', question: 'How many cats?', questionShona: 'Makatsi mangani?', answer: 8, options: [7, 8, 9], objectEmoji: '🐱', num1: 8 },
  { id: 9, type: 'counting', question: 'How many dogs?', questionShona: 'Imbwa ngani?', answer: 9, options: [8, 9, 10], objectEmoji: '🐶', num1: 9 },
  { id: 10, type: 'counting', question: 'How many books?', questionShona: 'Mabhuku mangani?', answer: 10, options: [9, 10, 11], objectEmoji: '📚', num1: 10 },
  
  // Simple Addition
  { id: 11, type: 'addition', question: '1 + 1 = ?', questionShona: '1 + 1 = ?', answer: 2, options: [1, 2, 3], num1: 1, num2: 1 },
  { id: 12, type: 'addition', question: '1 + 2 = ?', questionShona: '1 + 2 = ?', answer: 3, options: [2, 3, 4], num1: 1, num2: 2 },
  { id: 13, type: 'addition', question: '2 + 2 = ?', questionShona: '2 + 2 = ?', answer: 4, options: [3, 4, 5], num1: 2, num2: 2 },
  { id: 14, type: 'addition', question: '2 + 3 = ?', questionShona: '2 + 3 = ?', answer: 5, options: [4, 5, 6], num1: 2, num2: 3 },
  { id: 15, type: 'addition', question: '3 + 3 = ?', questionShona: '3 + 3 = ?', answer: 6, options: [5, 6, 7], num1: 3, num2: 3 },
  { id: 16, type: 'addition', question: '3 + 4 = ?', questionShona: '3 + 4 = ?', answer: 7, options: [6, 7, 8], num1: 3, num2: 4 },
  { id: 17, type: 'addition', question: '4 + 4 = ?', questionShona: '4 + 4 = ?', answer: 8, options: [7, 8, 9], num1: 4, num2: 4 },
  { id: 18, type: 'addition', question: '4 + 5 = ?', questionShona: '4 + 5 = ?', answer: 9, options: [8, 9, 10], num1: 4, num2: 5 },
  { id: 19, type: 'addition', question: '5 + 5 = ?', questionShona: '5 + 5 = ?', answer: 10, options: [9, 10, 11], num1: 5, num2: 5 },
  { id: 20, type: 'addition', question: '6 + 4 = ?', questionShona: '6 + 4 = ?', answer: 10, options: [9, 10, 11], num1: 6, num2: 4 },
  
  // More counting (11-20)
  { id: 21, type: 'counting', question: 'How many suns?', questionShona: 'Mazuva mangani?', answer: 11, options: [10, 11, 12], objectEmoji: '☀️', num1: 11 },
  { id: 22, type: 'counting', question: 'How many moons?', questionShona: 'Mwedzi mingani?', answer: 12, options: [11, 12, 13], objectEmoji: '🌙', num1: 12 },
  { id: 23, type: 'counting', question: 'How many trees?', questionShona: 'Miti mingani?', answer: 13, options: [12, 13, 14], objectEmoji: '🌳', num1: 13 },
  { id: 24, type: 'counting', question: 'How many cars?', questionShona: 'Motokari ngani?', answer: 14, options: [13, 14, 15], objectEmoji: '🚗', num1: 14 },
  { id: 25, type: 'counting', question: 'How many houses?', questionShona: 'Dzimba ngani?', answer: 15, options: [14, 15, 16], objectEmoji: '🏠', num1: 15 },
];

export const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
