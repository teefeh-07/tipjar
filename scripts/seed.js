// Seed script for local development
// Populates sample data for testing

const SAMPLE_CREATORS = [
  { name: 'Alice', description: 'Digital artist and NFT creator', category: 'Art' },
  { name: 'Bob', description: 'Open source developer', category: 'Development' },
  { name: 'Charlie', description: 'Blockchain educator and writer', category: 'Education' },
  { name: 'Diana', description: 'Community moderator', category: 'Community' },
  { name: 'Eve', description: 'Smart contract auditor', category: 'Security' },
];

const SAMPLE_TIPS = [
  { from: 0, to: 1, amount: 5000000, memo: 'Great art!' },
  { from: 1, to: 2, amount: 2000000, memo: 'Thanks for the code review' },
  { from: 2, to: 0, amount: 1000000, memo: 'Love the tutorial' },
  { from: 3, to: 1, amount: 3000000, memo: 'Keep building!' },
  { from: 4, to: 0, amount: 10000000, memo: 'Awesome work' },
  { from: 0, to: 3, amount: 500000, memo: 'Community hero' },
];

