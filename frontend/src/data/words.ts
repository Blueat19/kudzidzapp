export interface Word {
  id: string;
  english: string;
  shona: string;
  meaning: string;
  category: 'family' | 'animals' | 'school' | 'food' | 'nature' | 'colors' | 'actions' | 'home';
}

export const words: Word[] = [
  // Family
  { id: 'w1', english: 'Mother', shona: 'Amai', meaning: 'Female parent', category: 'family' },
  { id: 'w2', english: 'Father', shona: 'Baba', meaning: 'Male parent', category: 'family' },
  { id: 'w3', english: 'Child', shona: 'Mwana', meaning: 'A young boy or girl', category: 'family' },
  { id: 'w4', english: 'Girl', shona: 'Musikana', meaning: 'A female child', category: 'family' },
  { id: 'w5', english: 'Boy', shona: 'Mukomana', meaning: 'A male child', category: 'family' },
  { id: 'w6', english: 'Grandfather', shona: 'Sekuru', meaning: 'Father of mother or father', category: 'family' },
  { id: 'w7', english: 'Grandmother', shona: 'Ambuya', meaning: 'Mother of mother or father', category: 'family' },
  { id: 'w8', english: 'Sibling', shona: 'Hanzvadzi', meaning: 'Brother or sister', category: 'family' },
  
  // Animals
  { id: 'w9', english: 'Dog', shona: 'Imbwa', meaning: 'A domestic animal', category: 'animals' },
  { id: 'w10', english: 'Cat', shona: 'Katsi', meaning: 'A small domestic animal', category: 'animals' },
  { id: 'w11', english: 'Cow', shona: 'Mombe', meaning: 'Animal that gives milk', category: 'animals' },
  { id: 'w12', english: 'Sheep', shona: 'Gwai', meaning: 'Farm animal with wool', category: 'animals' },
  { id: 'w13', english: 'Goat', shona: 'Mbudzi', meaning: 'Farm animal with horns', category: 'animals' },
  { id: 'w14', english: 'Bird', shona: 'Shiri', meaning: 'Animal that can fly', category: 'animals' },
  { id: 'w15', english: 'Fish', shona: 'Hove', meaning: 'Animal that lives in water', category: 'animals' },
  
  // School
  { id: 'w16', english: 'School', shona: 'Chikoro', meaning: 'Place where children learn', category: 'school' },
  { id: 'w17', english: 'Teacher', shona: 'Mudzidzisi', meaning: 'Person who teaches', category: 'school' },
  { id: 'w18', english: 'Book', shona: 'Bhuku', meaning: 'Used for reading', category: 'school' },
  { id: 'w19', english: 'Pen', shona: 'Penzi', meaning: 'Used for writing', category: 'school' },
  { id: 'w20', english: 'Paper', shona: 'Pepa', meaning: 'Used for drawing or writing', category: 'school' },
  
  // Food
  { id: 'w21', english: 'Water', shona: 'Mvura', meaning: 'Liquid we drink', category: 'food' },
  { id: 'w22', english: 'Milk', shona: 'Mukaka', meaning: 'White drink from cows', category: 'food' },
  { id: 'w23', english: 'Bread', shona: 'Chingwa', meaning: 'Food made from flour', category: 'food' },
  { id: 'w24', english: 'Sadza', shona: 'Sadza', meaning: 'Main traditional food', category: 'food' },
  { id: 'w25', english: 'Rice', shona: 'Mupunga', meaning: 'White food made from grains', category: 'food' },
  { id: 'w26', english: 'Food', shona: 'Chikafu', meaning: 'What we eat', category: 'food' },
  
  // Nature
  { id: 'w27', english: 'Sun', shona: 'Zuva', meaning: 'Gives light and warmth', category: 'nature' },
  { id: 'w28', english: 'Moon', shona: 'Mwedzi', meaning: 'Seen at night', category: 'nature' },
  { id: 'w29', english: 'Star', shona: 'Nyeredzi', meaning: 'Small lights in the sky', category: 'nature' },
  { id: 'w30', english: 'Fire', shona: 'Moto', meaning: 'Produces heat', category: 'nature' },
  { id: 'w31', english: 'Wind', shona: 'Mhepo', meaning: 'Moving air', category: 'nature' },
  { id: 'w32', english: 'Stone', shona: 'Dombo', meaning: 'Hard object', category: 'nature' },
  { id: 'w33', english: 'Tree', shona: 'Muti', meaning: 'Big plant', category: 'nature' },
  { id: 'w34', english: 'Flower', shona: 'Ruva', meaning: 'Beautiful part of plant', category: 'nature' },
  
  // Colors
  { id: 'w35', english: 'Color', shona: 'Ruvara', meaning: 'What we see like red or blue', category: 'colors' },
  { id: 'w36', english: 'Red', shona: 'Tsvuku', meaning: 'Color of blood', category: 'colors' },
  { id: 'w37', english: 'Blue', shona: 'Bhuruu', meaning: 'Color of the sky', category: 'colors' },
  { id: 'w38', english: 'Green', shona: 'Girini', meaning: 'Color of grass', category: 'colors' },
  { id: 'w39', english: 'Yellow', shona: 'Yero', meaning: 'Color of the sun', category: 'colors' },
  { id: 'w40', english: 'Black', shona: 'Nhema', meaning: 'Dark color', category: 'colors' },
  { id: 'w41', english: 'White', shona: 'Chena', meaning: 'Light color', category: 'colors' },
  
  // Actions
  { id: 'w42', english: 'Read', shona: 'Verenga', meaning: 'To look at words', category: 'actions' },
  { id: 'w43', english: 'Write', shona: 'Nyora', meaning: 'To make letters', category: 'actions' },
  { id: 'w44', english: 'Play', shona: 'Tamba', meaning: 'To have fun', category: 'actions' },
  { id: 'w45', english: 'Run', shona: 'Mhanya', meaning: 'To move fast', category: 'actions' },
  { id: 'w46', english: 'Sit', shona: 'Gara', meaning: 'To rest on a chair', category: 'actions' },
  { id: 'w47', english: 'Stand', shona: 'Mira', meaning: 'To be upright', category: 'actions' },
  { id: 'w48', english: 'Sleep', shona: 'Rara', meaning: 'To rest at night', category: 'actions' },
  { id: 'w49', english: 'Cry', shona: 'Chema', meaning: 'To make sad sounds', category: 'actions' },
  { id: 'w50', english: 'Laugh', shona: 'Seka', meaning: 'To show happiness', category: 'actions' },
  { id: 'w51', english: 'Go', shona: 'Enda', meaning: 'To move to another place', category: 'actions' },
  { id: 'w52', english: 'Come', shona: 'Huya', meaning: 'To move closer', category: 'actions' },
  
  // Home
  { id: 'w53', english: 'House', shona: 'Imba', meaning: 'Place where people live', category: 'home' },
  { id: 'w54', english: 'Door', shona: 'Musuwo', meaning: 'Used to enter a house', category: 'home' },
  { id: 'w55', english: 'Window', shona: 'Hwindo', meaning: 'Glass opening in a house', category: 'home' },
  { id: 'w56', english: 'Bed', shona: 'Mubhedha', meaning: 'Used for sleeping', category: 'home' },
  { id: 'w57', english: 'Chair', shona: 'Chigaro', meaning: 'Used for sitting', category: 'home' },
  { id: 'w58', english: 'Table', shona: 'Tafura', meaning: 'Used for eating or writing', category: 'home' },
  { id: 'w59', english: 'Car', shona: 'Mota', meaning: 'Vehicle for transport', category: 'home' },
];

export const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const getWordsByCategory = (category: Word['category']) => {
  return words.filter(w => w.category === category);
};

export const categories: { id: Word['category']; name: string; icon: string }[] = [
  { id: 'family', name: 'Family', icon: 'people' },
  { id: 'animals', name: 'Animals', icon: 'paw' },
  { id: 'school', name: 'School', icon: 'school' },
  { id: 'food', name: 'Food', icon: 'restaurant' },
  { id: 'nature', name: 'Nature', icon: 'leaf' },
  { id: 'colors', name: 'Colors', icon: 'color-palette' },
  { id: 'actions', name: 'Actions', icon: 'walk' },
  { id: 'home', name: 'Home', icon: 'home' },
];
