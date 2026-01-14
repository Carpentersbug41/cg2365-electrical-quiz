import { TaggedQuestion } from './types';

/**
 * Parallel Circuits Question Bank
 * Aligned with lesson 202-4B learning outcomes
 * Includes discrimination questions for interleaving with series
 */

export const parallelCircuitsQuestions: TaggedQuestion[] = [
  // Discrimination Questions (Identify series vs parallel)
  {
    id: 4001,
    question: "Two resistors are connected with both ends joined together. What type of circuit is this?",
    options: [
      "Series circuit",
      "Parallel circuit",
      "Mixed circuit",
      "Short circuit"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'TOPOLOGY_CONFUSION'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-4B-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "When components are connected with both ends joined together, they form a parallel circuit. Current can split between multiple paths."
  },

  {
    id: 4002,
    question: "Look at this circuit: Component A connects from point X to point Y. Component B also connects from point X to point Y. What type of circuit is this?",
    options: [
      "Series circuit",
      "Parallel circuit",
      "There is not enough information",
      "It's a short circuit"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'TOPOLOGY_CONFUSION',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'discrimination', 'topology'],
    learningOutcomeId: "202-4B-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "When two components share the same two connection points (X to Y), they are in parallel. Current can choose either path."
  },

  // Current Rule Questions
  {
    id: 4003,
    question: "In a parallel circuit, how does the current behave?",
    options: [
      "Current is the same everywhere",
      "Current splits between the branches",
      "Current is zero in one branch",
      "Current doubles in each branch"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'USED_SERIES_RULE',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'current-rule', 'conceptual'],
    learningOutcomeId: "202-4B-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "In parallel, current splits between branches. The total current from the supply equals the sum of branch currents: I_total = I1 + I2 + ..."
  },

  {
    id: 4004,
    question: "Why does current split in a parallel circuit?",
    options: [
      "Because voltage is the same across branches",
      "Because there are multiple paths available",
      "Because resistance is equal in all branches",
      "Because of Ohm's Law"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'current-rule', 'explanation'],
    learningOutcomeId: "202-4B-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Current splits in parallel because there are multiple paths. Like water flowing to two pipes, the flow divides between the available paths."
  },

  // Voltage Rule Questions
  {
    id: 4005,
    question: "In a parallel circuit, how does voltage across R1 compare to voltage across R2?",
    options: [
      "Voltage across R1 is always higher",
      "Voltage is the same across both",
      "Voltage divides between them",
      "Voltage across R2 is always higher"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      2: 'USED_SERIES_RULE',
      0: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'voltage-rule', 'conceptual'],
    learningOutcomeId: "202-4B-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "In parallel, voltage is the same across all branches. Each branch connects to the same two points, so each experiences the full supply voltage."
  },

  // Resistance Rule - Calculation Questions
  {
    id: 4006,
    question: "R1 = 6 Ω and R2 = 3 Ω are connected in parallel. Calculate the total resistance.",
    options: [
      "9 Ω",
      "2 Ω",
      "3 Ω",
      "4.5 Ω"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'USED_SERIES_RULE',      // Added instead
      2: 'RECIPROCAL_ERROR',      // Calculated but didn't take final reciprocal
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4B-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "For parallel: 1/R_total = 1/R1 + 1/R2 = 1/6 + 1/3 = 1/6 + 2/6 = 3/6. Therefore R_total = 6/3 = 2 Ω."
  },

  {
    id: 4007,
    question: "R1 = 4 Ω and R2 = 4 Ω are connected in parallel. Calculate the total resistance.",
    options: [
      "8 Ω",
      "2 Ω",
      "4 Ω",
      "0.5 Ω"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'USED_SERIES_RULE',
      2: 'RECIPROCAL_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4B-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 90,
    explanation: "Equal resistors in parallel: R_total = R/n. With two 4Ω resistors: R_total = 4/2 = 2 Ω. Or: 1/R_total = 1/4 + 1/4 = 2/4, so R_total = 2 Ω."
  },

  {
    id: 4008,
    question: "R1 = 12 Ω and R2 = 6 Ω are connected in parallel. Calculate the total resistance.",
    options: [
      "18 Ω",
      "4 Ω",
      "6 Ω",
      "2 Ω"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'USED_SERIES_RULE',
      2: 'RECIPROCAL_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4B-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "1/R_total = 1/12 + 1/6 = 1/12 + 2/12 = 3/12 = 1/4. Therefore R_total = 4 Ω."
  },

  // Mixed Discrimination Questions
  {
    id: 4009,
    question: "A circuit has three resistors. All current must flow through each one. This is a:",
    options: [
      "Series circuit",
      "Parallel circuit",
      "Mixed circuit",
      "Cannot determine"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Circuit Discrimination",
    tags: ['discrimination', 'series', 'conceptual', 'topology'],
    learningOutcomeId: "202-4B-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "If ALL current must flow through each resistor, there is only one path, making it a series circuit."
  },

  {
    id: 4010,
    question: "A circuit has two resistors. Current can flow through either one or both. This is a:",
    options: [
      "Series circuit",
      "Parallel circuit",
      "Mixed circuit",
      "Cannot determine"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'TOPOLOGY_CONFUSION',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Circuit Discrimination",
    tags: ['discrimination', 'parallel', 'conceptual', 'topology'],
    learningOutcomeId: "202-4B-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "If current can choose between paths, there are branches, making it a parallel circuit."
  },

  // Conceptual Understanding
  {
    id: 4011,
    question: "In a parallel circuit, total resistance is:",
    options: [
      "Greater than the largest resistor",
      "Between the smallest and largest resistor",
      "Smaller than the smallest resistor",
      "Equal to the average of all resistors"
    ],
    correctAnswer: 2,
    misconceptionCodes: {
      0: 'USED_SERIES_RULE',
      1: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'resistance-rule', 'conceptual'],
    learningOutcomeId: "202-4B-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "In parallel, adding more paths DECREASES total resistance. R_total is always less than the smallest individual resistor."
  },

  {
    id: 4012,
    question: "What happens to total resistance when you add more resistors in parallel?",
    options: [
      "Total resistance increases",
      "Total resistance decreases",
      "Total resistance stays the same",
      "It depends on the resistor values"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'USED_SERIES_RULE',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'resistance-rule', 'conceptual'],
    learningOutcomeId: "202-4B-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Adding resistors in parallel provides more paths for current, which DECREASES total resistance. Like adding more lanes to a highway."
  },

  // Formula Recognition
  {
    id: 4013,
    question: "Which formula is correct for total resistance in parallel?",
    options: [
      "R_total = R1 + R2 + R3",
      "1/R_total = 1/R1 + 1/R2 + 1/R3",
      "R_total = R1 × R2 × R3",
      "R_total = (R1 + R2 + R3) / 3"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'USED_SERIES_RULE',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'resistance-rule', 'formula'],
    learningOutcomeId: "202-4B-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Parallel resistance uses reciprocals: 1/R_total = 1/R1 + 1/R2 + 1/R3. Remember to take the reciprocal of the sum to find R_total."
  },

  // Application Questions
  {
    id: 4014,
    question: "Three 6Ω resistors are connected in parallel. What is the total resistance?",
    options: [
      "18 Ω",
      "2 Ω",
      "6 Ω",
      "3 Ω"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'USED_SERIES_RULE',
      2: 'RECIPROCAL_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'resistance-rule', 'calculation', 'application'],
    learningOutcomeId: "202-4B-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "For n equal resistors in parallel: R_total = R/n = 6/3 = 2 Ω. Or: 1/R_total = 3/6, so R_total = 6/3 = 2 Ω."
  },

  {
    id: 4015,
    question: "In a parallel circuit with 12V supply and two branches, what is the voltage across each branch?",
    options: [
      "6 V",
      "12 V",
      "24 V",
      "It depends on the resistance"
    ],
    correctAnswer: 1,
    misconceptionCodes: {
      0: 'USED_SERIES_RULE',
      2: 'OTHER',
      3: 'CONFUSED_I_V_R'
    },
    section: "Science 2365 Level 2",
    category: "Parallel Circuits",
    tags: ['parallel', 'voltage-rule', 'application'],
    learningOutcomeId: "202-4B-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "In parallel, voltage is the same across all branches. Each branch experiences the full supply voltage of 12V, regardless of resistance."
  }
];


