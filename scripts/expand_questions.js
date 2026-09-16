import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const existingFilePath = path.join(__dirname, '../src/data/questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(existingFilePath, 'utf8'));

const extraQuestions = [
  // ====================================================
  // PERCENTAGE (PCT-026 to PCT-050)
  // ====================================================
  {
    id: "PCT-026",
    topic: "Percentage",
    question: "If the numerator of a fraction is increased by 200% and the denominator is increased by 400%, the resultant fraction is 1 1/20 (21/20). What was the original fraction?",
    options: {
      A: "1 3/4",
      B: "7/4",
      C: "3/4",
      D: "5/7"
    },
    correctAnswer: "B",
    explanation: "Let original fraction = x / y.\nNew numerator = x + 200% of x = 3x.\nNew denominator = y + 400% of y = 5y.\n3x / 5y = 21 / 20 ⇒ x / y = (21 / 20) × (5 / 3) = 7 / 4.",
    memoryTrick: "🧠 Multiplier Shift: An increase of +200% means 300% (3x); +400% means 500% (5y). Then x/y = (21/20) × (5/3) = 7/4."
  },
  {
    id: "PCT-027",
    topic: "Percentage",
    question: "In an examination, 35% of students failed in Hindi and 42% failed in English. If 20% failed in both subjects, what percentage of students passed in both subjects?",
    options: {
      A: "43%",
      B: "35%",
      C: "47%",
      D: "51%"
    },
    correctAnswer: "A",
    explanation: "Total failed in at least one subject = Fail(Hindi) + Fail(English) - Fail(Both).\n= 35% + 42% - 20% = 57% failed in at least one.\nPercentage passing both = 100% - 57% = 43%.",
    memoryTrick: "🧠 Set Complement Rule: Pass both = 100 - (A + B - Both) = 100 - (35 + 42 - 20) = 100 - 57 = 43%."
  },
  {
    id: "PCT-028",
    topic: "Percentage",
    question: "Due to a 25% price increase per dozen eggs, 2 fewer eggs are available for Rs. 24. What was the original price per egg?",
    options: {
      A: "Rs. 2.00",
      B: "Rs. 2.40",
      C: "Rs. 2.50",
      D: "Rs. 3.00"
    },
    correctAnswer: "A",
    explanation: "25% of 24 = Rs. 6, which accounts for the 2 fewer eggs.\nNew price per egg = 6 / 2 = Rs. 3 per egg.\nSince new price = 125% of original: Original price = 3 / 1.25 = Rs. 2.00 per egg.",
    memoryTrick: "🧠 Cash Deficit Rule: 25% of 24 = Rs. 6 pays for 2 eggs → New price = Rs. 3. Original = 3 / 1.25 = Rs. 2."
  },
  {
    id: "PCT-029",
    topic: "Percentage",
    question: "A number is increased by 10% and then decreased by 10%. The final number is 20 less than the original number. What was the original number?",
    options: {
      A: "1,500",
      B: "2,000",
      C: "2,400",
      D: "3,000"
    },
    correctAnswer: "B",
    explanation: "Net change = - (10² / 100)% = -1%.\n1% of Original Number = 20.\nOriginal Number = 20 / 0.01 = 2,000.",
    memoryTrick: "🧠 Net 1% Gap: Equal 10% rise & fall drops exactly 1%. If 1% = 20, then 100% = 2,000."
  },
  {
    id: "PCT-030",
    topic: "Percentage",
    question: "In an alloy, there is 12% copper. To get 69 kg of copper, how much alloy will be required?",
    options: {
      A: "424 kg",
      B: "575 kg",
      C: "525 kg",
      D: "600 kg"
    },
    correctAnswer: "B",
    explanation: "12% of Total Alloy = 69 kg.\nTotal Alloy = (69 × 100) / 12 = 6,900 / 12 = 575 kg.",
    memoryTrick: "🧠 Direct Division: Total = Target / Fraction = 69 / 0.12 = 6900 / 12 = 575 kg."
  },

  // ====================================================
  // RATIO & PROPORTION (RAT-026 to RAT-030)
  // ====================================================
  {
    id: "RAT-026",
    topic: "Ratio & Proportion",
    question: "If (a + b) : (b + c) : (c + a) = 6 : 7 : 8 and a + b + c = 14, what is the value of c?",
    options: {
      A: "6",
      B: "7",
      C: "8",
      D: "5"
    },
    correctAnswer: "A",
    explanation: "Sum: 2(a + b + c) = (6 + 7 + 8)k = 21k ⇒ a + b + c = 10.5k.\nGiven a + b + c = 14 ⇒ 10.5k = 14 ⇒ k = 14 / 10.5 = 4 / 3.\nNow, a + b = 6k = 6(4/3) = 8.\nc = (a + b + c) - (a + b) = 14 - 8 = 6.",
    memoryTrick: "🧠 Sum of Pairs: Total sum = 21/2 = 10.5 units = 14. c is (10.5 - 6) = 4.5 units. 4.5 × (14/10.5) = 6."
  },
  {
    id: "RAT-027",
    topic: "Ratio & Proportion",
    question: "A sum of money is to be distributed among A, B, C, D in the proportion of 5 : 2 : 4 : 3. If C gets Rs. 1,000 more than D, what is B's share?",
    options: {
      A: "Rs. 500",
      B: "Rs. 1,500",
      C: "Rs. 2,000",
      D: "Rs. 2,500"
    },
    correctAnswer: "C",
    explanation: "Ratio parts for C and D are 4 and 3.\nDifference between C and D = 4 - 3 = 1 part = Rs. 1,000.\nB's share has 2 parts = 2 × 1,000 = Rs. 2,000.",
    memoryTrick: "🧠 Delta Ratio Part: C - D = 4 - 3 = 1 unit = 1,000. B gets 2 units = Rs. 2,000."
  },
  {
    id: "RAT-028",
    topic: "Ratio & Proportion",
    question: "The ratio of the number of boys and girls in a college is 7 : 8. If the percentage increase in the number of boys and girls be 20% and 10% respectively, what will be the new ratio?",
    options: {
      A: "8 : 9",
      B: "17 : 18",
      C: "21 : 22",
      D: "23 : 24"
    },
    correctAnswer: "C",
    explanation: "Let boys = 70, girls = 80.\nNew boys = 70 × 1.20 = 84.\nNew girls = 80 × 1.10 = 88.\nNew ratio = 84 : 88 = 21 : 22 (dividing by 4).",
    memoryTrick: "🧠 Multiplier Pairing: 7(1.2) : 8(1.1) = 8.4 : 8.8 = 84 : 88 = 21 : 22."
  },
  {
    id: "RAT-029",
    topic: "Ratio & Proportion",
    question: "Salaries of Ravi and Sumit are in the ratio 2 : 3. If the salary of each is increased by Rs. 4,000, the new ratio becomes 40 : 57. What is Sumit's present salary?",
    options: {
      A: "Rs. 17,000",
      B: "Rs. 38,000",
      C: "Rs. 25,500",
      D: "Rs. 34,000"
    },
    correctAnswer: "B",
    explanation: "(2x + 4000) / (3x + 4000) = 40 / 57.\n57(2x + 4000) = 40(3x + 4000).\n114x + 228,000 = 120x + 160,000 ⇒ 6x = 68,000 ⇒ x = 68,000 / 6.\nSumit's salary = 3x = 3 × (68,000 / 6) = 68,000 / 2 = Rs. 34,000. Wait: 3x = 34,000 or 38,000? 6x = 68,000 -> 3x = 34,000.",
    options: {
      A: "Rs. 17,000",
      B: "Rs. 34,000",
      C: "Rs. 25,500",
      D: "Rs. 38,000"
    },
    correctAnswer: "B",
    explanation: "57(2x + 4000) = 40(3x + 4000) ⇒ 114x + 228,000 = 120x + 160,000 ⇒ 6x = 68,000.\nSumit's present salary = 3x = 68,000 / 2 = Rs. 34,000.",
    memoryTrick: "🧠 Cross Difference: 6x = 68,000. Sumit is 3x, which is half of 6x = Rs. 34,000."
  },
  {
    id: "RAT-030",
    topic: "Ratio & Proportion",
    question: "If a carton containing a dozen mirrors is dropped, which of the following cannot be the ratio of broken to unbroken mirrors?",
    options: {
      A: "2 : 1",
      B: "3 : 1",
      C: "3 : 2",
      D: "7 : 5"
    },
    correctAnswer: "C",
    explanation: "A dozen = 12 mirrors.\nFor broken + unbroken = 12, the sum of terms in the ratio must be an exact factor of 12.\n2+1=3 (12/3=4), 3+1=4 (12/4=3), 7+5=12 (12/12=1).\nFor 3 : 2, sum = 5, and 12 is not divisible by 5.",
    memoryTrick: "🧠 Divisibility Test: Sum of ratio terms must evenly divide total items (12). 3 + 2 = 5 doesn't divide 12."
  },

  // ====================================================
  // PROFIT & LOSS (PNL-026 to PNL-030)
  // ====================================================
  {
    id: "PNL-026",
    topic: "Profit & Loss",
    question: "A trader sells two bullocks for Rs. 8,400 each, neither losing nor gaining in the total deal. If he sold one bullock at a gain of 20%, the other was sold at a loss of:",
    options: {
      A: "20%",
      B: "14 2/7%",
      C: "16 2/3%",
      D: "18 1/4%"
    },
    correctAnswer: "B",
    explanation: "Total SP = 2 × 8,400 = Rs. 16,800. Since no profit/loss, Total CP = Rs. 16,800.\nCP of first bullock = 8,400 / 1.20 = Rs. 7,000 (gain = Rs. 1,400).\nCP of second bullock = 16,800 - 7,000 = Rs. 9,800 (loss = Rs. 1,400).\nLoss % on second bullock = (1,400 / 9,800) × 100 = (1 / 7) × 100 = 14 2/7% (14.28%).",
    memoryTrick: "🧠 Constant Gain Shift: First gained 1,400. Second must lose 1,400 on CP of 9,800. 1400/9800 = 1/7 = 14 2/7%."
  },
  {
    id: "PNL-027",
    topic: "Profit & Loss",
    question: "A dishonest milkman sells milk at cost price but mixes water and thereby gains 25%. What is the percentage of water in the mixture?",
    options: {
      A: "25%",
      B: "20%",
      C: "16.67%",
      D: "30%"
    },
    correctAnswer: "B",
    explanation: "Gain of 25% means ratio of Water : Milk = 25 : 100 = 1 : 4.\nTotal mixture = 1 + 4 = 5 parts.\nPercentage of water in mixture = (1 / 5) × 100 = 20%.",
    memoryTrick: "🧠 Gain on Base: Gain 25% = 1/4 water to milk. Water fraction of total mixture = 1/(4+1) = 1/5 = 20%."
  },
  {
    id: "PNL-028",
    topic: "Profit & Loss",
    question: "A shopkeeper sells an article at 12.5% loss. If he had sold it for Rs. 51.80 more, he would have gained 6%. What is the cost price of the article?",
    options: {
      A: "Rs. 280",
      B: "Rs. 300",
      C: "Rs. 320",
      D: "Rs. 350"
    },
    correctAnswer: "A",
    explanation: "Total percentage gap = 12.5% + 6% = 18.5%.\n18.5% of CP = Rs. 51.80.\nCP = (51.80 / 18.5) × 100 = 2.80 × 100 = Rs. 280.",
    memoryTrick: "🧠 Sum of Deficit and Surplus: -12.5% to +6% = 18.5%. 51.8 / 0.185 = Rs. 280."
  },
  {
    id: "PNL-029",
    topic: "Profit & Loss",
    question: "A person bought a horse and a carriage for Rs. 20,000. Later, he sold the horse at 20% profit and the carriage at 10% loss. Thus, he gained 2% on the whole. What was the cost price of the horse?",
    options: {
      A: "Rs. 7,200",
      B: "Rs. 8,000",
      C: "Rs. 9,000",
      D: "Rs. 10,000"
    },
    correctAnswer: "B",
    explanation: "By Alligation:\nHorse (+20%) and Carriage (-10%), Average = +2%.\nRatio of CP = |(-10) - 2| : |20 - 2| = 12 : 18 = 2 : 3.\nTotal parts = 2 + 3 = 5 parts.\nCP of Horse = (2 / 5) × 20,000 = Rs. 8,000.",
    memoryTrick: "🧠 Alligation with Negatives: Distance from -10 to 2 is 12; 20 to 2 is 18. Ratio = 12:18 = 2:3. Horse = 2/5 of 20k = 8,000."
  },
  {
    id: "PNL-030",
    topic: "Profit & Loss",
    question: "A publisher sells books to a retail dealer at Rs. 5 a copy, but allows 25 copies to be counted as 24. If the retailer sells each copy at Rs. 6, what is his profit percentage?",
    options: {
      A: "20%",
      B: "24%",
      C: "25%",
      D: "26%"
    },
    correctAnswer: "C",
    explanation: "Retailer pays for 24 copies = 24 × 5 = Rs. 120.\nRetailer receives 25 copies and sells all 25 at Rs. 6 = 25 × 6 = Rs. 150.\nProfit = 150 - 120 = Rs. 30.\nProfit % = (30 / 120) × 100 = 25%.",
    memoryTrick: "🧠 Total Outflow vs Inflow: CP = 24 × 5 = 120; SP = 25 × 6 = 150. Profit = 30/120 = 1/4 = 25%."
  },

  // ====================================================
  // DSA (DSA-026 to DSA-030)
  // ====================================================
  {
    id: "DSA-026",
    topic: "DSA",
    question: "What is the worst-case time complexity of searching for an element in an unindexed Hash Table where all N keys hash to the exact same bucket (chaining)?",
    options: {
      A: "O(1)",
      B: "O(log N)",
      C: "O(N)",
      D: "O(N log N)"
    },
    correctAnswer: "C",
    explanation: "When all keys collide into the same bucket, the linked list chain contains all N elements.\nSearching requires traversing the entire linked list sequentially, degrading lookup to O(N).",
    memoryTrick: "🧠 Hash Collapse: All collisions in one bucket = plain Linked List traversal = linear O(N)."
  },
  {
    id: "DSA-027",
    topic: "DSA",
    question: "Which algorithmic paradigm does the Floyd-Warshall All-Pairs Shortest Path algorithm utilize?",
    options: {
      A: "Greedy algorithm",
      B: "Dynamic Programming",
      C: "Divide and Conquer",
      D: "Backtracking"
    },
    correctAnswer: "B",
    explanation: "Floyd-Warshall iteratively optimizes dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) through intermediate vertices k in O(V³) time using Dynamic Programming.",
    memoryTrick: "🧠 Triple Loop DP: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) is pure overlapping subproblem DP."
  },
  {
    id: "DSA-028",
    topic: "DSA",
    question: "In a min-heap with N elements, where is the MAXIMUM element located?",
    options: {
      A: "At the root node",
      B: "Always at index N-1",
      C: "Among the leaf nodes",
      D: "In the left-most subtree only"
    },
    correctAnswer: "C",
    explanation: "In a min-heap, every parent is smaller than or equal to its children.\nTherefore, the maximum element cannot be a parent of any node and must reside in one of the leaf nodes (indices ⌊N/2⌋ to N-1).",
    memoryTrick: "🧠 Leaves Hold the Max: Since parents must be smaller than children, the largest element can only hide in the leaves."
  },
  {
    id: "DSA-029",
    topic: "DSA",
    question: "What is the space complexity of Depth-First Search (DFS) on a tree of height H?",
    options: {
      A: "O(1)",
      B: "O(H)",
      C: "O(N)",
      D: "O(N log N)"
    },
    correctAnswer: "B",
    explanation: "DFS traverses down branch paths recursively.\nThe call stack depth at any moment is proportional to the current depth/height of the tree, giving O(H) auxiliary space.",
    memoryTrick: "🧠 Call Stack Height: DFS only keeps current branch in memory, which equals tree height O(H)."
  },
  {
    id: "DSA-030",
    topic: "DSA",
    question: "What is the time complexity to find the diameter (longest path between any two nodes) of a binary tree in a single bottom-up traversal?",
    options: {
      A: "O(N log N)",
      B: "O(N²)",
      C: "O(N)",
      D: "O(H)"
    },
    correctAnswer: "C",
    explanation: "By computing the height of left and right subtrees post-order, the diameter at each node (left_height + right_height) can be updated in O(1) per node, visiting each of the N nodes once for O(N) total time.",
    memoryTrick: "🧠 Post-order 2-in-1: Return height up the tree while maintaining global max diameter = O(N) single pass."
  }
];

const merged = [...existingQuestions, ...extraQuestions];
fs.writeFileSync(existingFilePath, JSON.stringify(merged, null, 2), 'utf-8');
console.log(`Successfully updated questions.json! New total: ${merged.length} questions.`);
