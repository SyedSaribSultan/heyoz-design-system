// Sample data for the Oz dashboard prototype. Everything here is fictional and labelled "Sample data" on screen.
// In production each block comes from a source HeyOz already has or can get (see README.md in this folder).

export const BRAND = { name: 'Brilliant', site: 'brilliant.org', logo: '/home/brand-logo.webp', niche: 'learning apps' };

// An ad creative is drawn as a static ad (no stock photos): a ground colour from the primitive scales,
// a headline, a small mark. `look` picks the composition.
export const IDEAS = [
  { id: 'i1', title: '15 minutes a day beats a 2-hour class', format: 'Image ad', why: "Quizzo's version has run 214 days. Short time promises work in learning apps.", ad: { ground: 'green', head: '15 min a day > a 2-hour class', look: 'type' } },
  { id: 'i2', title: 'Guess the answer before you scroll', format: 'Video', why: 'People watch puzzle ads to the end. No one in your niche runs them yet.', ad: { ground: 'blue', head: 'Can you solve this before it ends?', look: 'puzzle' } },
  { id: 'i3', title: 'Brilliant vs. a $40 textbook', format: 'Image ad', why: 'Price comparisons stay live 2× longer than other ads in your niche.', ad: { ground: 'amber', head: '$40 textbook or 15 fun minutes?', look: 'versus' } },
  { id: 'i4', title: 'A real learner shows their streak', format: 'Video', why: "Mathly's best ad is a real person showing a 100-day streak.", ad: { ground: 'orange', head: 'Day 100. Still going.', look: 'streak' } },
  { id: 'i5', title: 'One puzzle, three ways to solve it', format: 'Carousel', why: 'Carousels get saved. Saved ads are shown to more people.', ad: { ground: 'gray', head: '3 ways to solve one puzzle →', look: 'type' } },
];

export const WORKING = [
  { id: 'w1', brand: 'Quizzo', days: 214, why: 'Promises one small thing: 15 minutes a day.', ad: { ground: 'blue', head: 'Learn anything in 15 minutes a day', look: 'type', mark: 'Q' } },
  { id: 'w2', brand: 'Mathly', days: 156, why: 'A real person, a real result, in the first second.', ad: { ground: 'orange', head: 'My 100-day streak', look: 'streak', mark: 'M' } },
  { id: 'w3', brand: 'Elevo', days: 97, why: 'Makes the reader feel smart for trying.', ad: { ground: 'red', head: 'Smarter than a textbook', look: 'type', mark: 'E' } },
  { id: 'w4', brand: 'Quizzo', days: 63, why: 'Asks a question people want to answer.', ad: { ground: 'green', head: 'Only 4% get this right', look: 'puzzle', mark: 'Q' } },
  { id: 'w5', brand: 'Mathly', days: 41, why: 'Shows the price gap in one picture.', ad: { ground: 'amber', head: '$0 vs. a $40 textbook', look: 'versus', mark: 'M' } },
];

export const COMPETITORS = [
  { name: 'Quizzo', mark: 'Q', ground: 'blue', active: 38, longest: 214, new: 6 },
  { name: 'Mathly', mark: 'M', ground: 'orange', active: 21, longest: 156, new: 0 },
  { name: 'Elevo', mark: 'E', ground: 'red', active: 14, longest: 97, new: 2 },
  { name: 'Learnwise', mark: 'L', ground: 'green', active: 9, longest: 44, new: 1 },
];

// Day-3 test results. `cost` = dollars per free trial. One number per ad on screen.
export const RESULTS = { spent: 60, trials: 41, perDay: 20, day: 3, of: 7,
  byAd: { i1: { status: 'okay', cost: 1.6 }, i2: { status: 'winning', cost: 0.9, clicks: '2.8%' }, i3: { status: 'okay', cost: 1.4 }, i4: { status: 'okay', cost: 1.9 }, i5: { status: 'stopped', cost: 4.8 } } };

export const STATES = [
  ['new', 'New'],
  ['brand', 'Knows brand'],
  ['ready', 'Ads ready'],
  ['live', 'Ads live'],
  ['next', 'Next day'],
];
