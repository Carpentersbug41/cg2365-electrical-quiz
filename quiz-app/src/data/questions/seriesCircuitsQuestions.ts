import { TaggedQuestion } from './types';

/**
 * Series Circuits Question Bank
 * Aligned with lesson 202-4A learning outcomes
 * Includes tagging and misconception codes for targeted feedback
 */

// #region agent log
fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'seriesCircuitsQuestions.ts:9',message:'Loading seriesCircuitsQuestions',data:{questionCount:0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

export const seriesCircuitsQuestions: TaggedQuestion[] = [
  // Discrimination Questions (Identify series vs parallel)
  {
    id: 3001,
    question: "Two resistors are connected one after the other with no branches. What type of circuit is this?",
    options: [
      "Series circuit",
      "Parallel circuit",
      "Mixed circuit",
      "Short circuit"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "When components are connected one after the other with no branches, they form a series circuit. There is only one path for current to flow."
  },

  // Current Rule Questions
  {
    id: 3002,
    question: "In a series circuit, how does the current through R1 compare to the current through R2?",
    options: [
      "Current through R1 is always higher",
      "Current through R2 is always higher",
      "Current is the same through both",
      "Current divides between them"
    ],
    correctAnswer: 2,
    misconceptionCodes: {
      3: 'TOPOLOGY_CONFUSION' // Thinking it divides like in parallel
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'current-rule', 'conceptual'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "In a series circuit, current is the same everywhere because there is only one path. The same current flows through all components."
  },

  {
    id: 3003,
    question: "Why is the current the same everywhere in a series circuit?",
    options: [
      "Because resistance is equal in all components",
      "Because voltage is the same across all components",
      "Because there is only one path with no branches",
      "Because of Ohm's Law"
    ],
    correctAnswer: 2,
    misconceptionCodes: {
      0: 'CONFUSED_I_V_R',
      1: 'TOPOLOGY_CONFUSION',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'current-rule', 'explanation'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Current is the same everywhere in series because there's only one path for the charge to flow. Like water in a single pipe, it must all flow together."
  },

  // Resistance Rule - Calculation Questions
  {
    id: 3004,
    question: "R1 = 5 Ω and R2 = 7 Ω are connected in series. Calculate the total resistance.",
    options: [
      "12 Ω",
      "2 Ω",
      "35 Ω",
      "2.9 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'USED_PARALLEL_RULE',      // 7 - 5
      2: 'MULTIPLIED_INSTEAD',      // 5 × 7
      3: 'RECIPROCAL_ERROR'         // Tried parallel reciprocal
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "In series, resistances ADD: R_total = R1 + R2 = 5 + 7 = 12 Ω"
  },

  {
    id: 3005,
    question: "Three resistors in series: R1 = 2 Ω, R2 = 3 Ω, R3 = 5 Ω. Find R_total.",
    options: [
      "10 Ω",
      "0.97 Ω",
      "30 Ω",
      "1.03 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'RECIPROCAL_ERROR',
      2: 'MULTIPLIED_INSTEAD',
      3: 'USED_PARALLEL_RULE'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "In series, add all resistances: R_total = 2 + 3 + 5 = 10 Ω"
  },

  {
    id: 3006,
    question: "R1 = 10 Ω and R2 = 15 Ω are in series. What is the total resistance?",
    options: [
      "25 Ω",
      "6 Ω",
      "5 Ω",
      "150 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'RECIPROCAL_ERROR',
      2: 'DIVIDED_INSTEAD',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 1,
    estimatedTime: 45,
    explanation: "In series circuits, resistances add: 10 + 15 = 25 Ω"
  },

  {
    id: 3007,
    question: "Four 5 Ω resistors are connected in series. What is the total resistance?",
    options: [
      "20 Ω",
      "1.25 Ω",
      "5 Ω",
      "25 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'USED_PARALLEL_RULE',
      2: 'OTHER',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "In series, add all resistances: 5 + 5 + 5 + 5 = 20 Ω (or 4 × 5 when all equal)"
  },

  // Voltage Rule Questions
  {
    id: 3008,
    question: "In a series circuit with a 12V supply, R1 has a 7V drop. What is the voltage drop across R2?",
    options: [
      "5 V",
      "7 V",
      "12 V",
      "19 V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    requiredUnits: 'V',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "In series, voltage drops add up to the supply voltage: V_R2 = V_supply - V_R1 = 12 - 7 = 5 V"
  },

  {
    id: 3009,
    question: "What happens to the voltage in a series circuit?",
    options: [
      "The supply voltage is shared between components",
      "Each component gets the full supply voltage",
      "Voltage increases through each component",
      "Voltage is always equal across all components"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'OTHER',
      3: 'TOPOLOGY_CONFUSION'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'conceptual'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "In series, the supply voltage is divided among components. Each component gets a portion of the total voltage."
  },

  // Mixed Application Questions
  {
    id: 3010,
    question: "Two resistors (6 Ω and 3 Ω) are in series with a 9V battery. What is the circuit current?",
    options: [
      "1 A",
      "1.5 A",
      "3 A",
      "0.67 A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'FORMULA_NOT_REARRANGED',
      2: 'USED_PARALLEL_RULE',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'calculation', 'application', 'ohms-law'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'A',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "First find total resistance: R_total = 6 + 3 = 9 Ω. Then use Ohm's Law: I = V/R = 9/9 = 1 A"
  },

  {
    id: 3011,
    question: "In a series circuit, if one component fails (open circuit), what happens?",
    options: [
      "The whole circuit stops working",
      "Only that component stops working",
      "The other components work harder",
      "Current increases in the other components"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'OTHER',
      3: 'CONFUSED_I_V_R'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'conceptual', 'application'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "In series, there's only one path. If that path is broken, no current can flow anywhere in the circuit."
  },

  // Formula Recognition
  {
    id: 3012,
    question: "Which formula is correct for total resistance in a series circuit?",
    options: [
      "R_total = R1 + R2 + R3 + ...",
      "1/R_total = 1/R1 + 1/R2 + 1/R3 + ...",
      "R_total = R1 × R2 × R3 × ...",
      "R_total = (R1 + R2) / 2"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'USED_PARALLEL_RULE',
      2: 'MULTIPLIED_INSTEAD',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'conceptual'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "In series, resistances simply add together: R_total = R1 + R2 + R3 + ..."
  },

  {
    id: 3013,
    question: "R1 = 8 Ω, R2 = 4 Ω, R3 = 3 Ω in series. Find R_total.",
    options: [
      "15 Ω",
      "1.6 Ω",
      "96 Ω",
      "5 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'RECIPROCAL_ERROR',
      2: 'MULTIPLIED_INSTEAD',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Add all resistances: 8 + 4 + 3 = 15 Ω"
  },

  // Discrimination - identify topology
  {
    id: 3014,
    question: "A circuit has three bulbs where the same current flows through each bulb. What type of connection is this?",
    options: [
      "Series connection",
      "Parallel connection",
      "Could be either",
      "Short circuit"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'discrimination', 'conceptual', 'current-rule'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "When current is the same through all components, they must be in series. In parallel, current divides."
  },

  {
    id: 3015,
    question: "R1 = 12 Ω, R2 = 18 Ω in series. What is the total resistance?",
    options: [
      "30 Ω",
      "7.2 Ω",
      "6 Ω",
      "216 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'RECIPROCAL_ERROR',
      2: 'DIVIDED_INSTEAD',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 1,
    estimatedTime: 45,
    explanation: "In series, add the resistances: 12 + 18 = 30 Ω"
  },

  // Harder application question
  {
    id: 3016,
    question: "Three 6 Ω resistors in series are connected to a 18V supply. What is the current through each resistor?",
    options: [
      "1 A",
      "3 A",
      "6 A",
      "0.33 A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'OTHER',
      2: 'FORMULA_NOT_REARRANGED',
      3: 'USED_PARALLEL_RULE'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'calculation', 'application', 'current-rule', 'ohms-law'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'A',
    difficulty: 4,
    estimatedTime: 120,
    explanation: "Total resistance = 6 + 6 + 6 = 18 Ω. Current I = V/R = 18/18 = 1 A. In series, current is same through all resistors."
  },

  {
    id: 3017,
    question: "If R_total in a series circuit increases, what happens to the circuit current (assuming constant voltage)?",
    options: [
      "Current decreases",
      "Current increases",
      "Current stays the same",
      "Current becomes zero"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'conceptual', 'ohms-law'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "From Ohm's Law (I = V/R), if resistance increases and voltage stays constant, current decreases."
  },

  {
    id: 3018,
    question: "Two identical resistors in series have a combined resistance of 20 Ω. What is the value of each resistor?",
    options: [
      "10 Ω",
      "40 Ω",
      "20 Ω",
      "5 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'DIVIDED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "If R1 + R2 = 20 Ω and R1 = R2, then 2R = 20, so R = 10 Ω"
  },

  {
    id: 3019,
    question: "Which statement about series circuits is TRUE?",
    options: [
      "The same current flows through all components",
      "Each component has the same voltage across it",
      "Total resistance is always less than the smallest resistor",
      "Current divides between the components"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'USED_PARALLEL_RULE',
      3: 'TOPOLOGY_CONFUSION'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'conceptual', 'discrimination'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The defining characteristic of series circuits is that current is the same through all components (one path, no branches)."
  },

  {
    id: 3020,
    question: "In a series circuit with R1 = 6 Ω and R2 = 6 Ω, if the voltage across R1 is 3V, what is the voltage across R2?",
    options: [
      "3 V",
      "6 V",
      "0 V",
      "9 V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'calculation', 'application'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'V',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "With equal resistances in series, voltage divides equally. If R1 = R2 and V_R1 = 3V, then V_R2 = 3V also."
  },

  // ----------------------------
  // +30 NEW QUESTIONS (3021–3050)
  // ----------------------------

  {
    id: 3021,
    question: "Which statement about voltage in a series circuit is TRUE?",
    options: [
      "The voltage drops across components add up to the supply voltage",
      "Each component gets the full supply voltage",
      "Voltage is the same across every component",
      "Voltage increases after each component"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'TOPOLOGY_CONFUSION',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'conceptual'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "In series, the supply voltage is shared. The drops across each component add up to the supply voltage."
  },

  {
    id: 3022,
    question: "A 24V supply is connected to two resistors in series: 8 Ω and 4 Ω. What is the circuit current?",
    options: [
      "2 A",
      "3 A",
      "6 A",
      "0.5 A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'CONFUSED_I_V_R',
      3: 'FORMULA_NOT_REARRANGED'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'calculation', 'ohms-law', 'application'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'A',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "R_total = 8 + 4 = 12 Ω. I = V/R = 24/12 = 2 A."
  },

  {
    id: 3023,
    question: "A 12V supply is connected to two resistors in series: R1 = 2 Ω and R2 = 4 Ω. What is the voltage drop across R2?",
    options: [
      "8 V",
      "6 V",
      "4 V",
      "2 V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'VOLTAGE_EQUAL_SPLIT_ERROR',
      2: 'CONFUSED_I_V_R',
      3: 'VOLTAGE_DIVIDER_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'calculation', 'application'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'V',
    difficulty: 4,
    estimatedTime: 120,
    explanation: "R_total = 2 + 4 = 6 Ω. I = 12/6 = 2 A. V_R2 = I × R2 = 2 × 4 = 8 V."
  },

  {
    id: 3024,
    question: "Where must an ammeter be connected to measure current through a component in a series circuit?",
    options: [
      "In series with the component",
      "In parallel across the component",
      "Across the supply only",
      "It doesn't matter where it goes"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'METER_CONNECTION_ERROR',
      2: 'METER_CONNECTION_ERROR',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'measurement', 'current-rule', 'conceptual'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "An ammeter must be connected in series so all current flows through it."
  },

  {
    id: 3025,
    question: "Where must a voltmeter be connected to measure the voltage drop across a resistor in a series circuit?",
    options: [
      "In parallel across the resistor",
      "In series with the resistor",
      "In series with the supply only",
      "Across a different resistor"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'METER_CONNECTION_ERROR',
      2: 'METER_CONNECTION_ERROR',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'measurement', 'voltage-rule', 'conceptual'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "A voltmeter measures potential difference between two points, so it must be connected across (in parallel with) the component."
  },

  {
    id: 3026,
    question: "Two resistors in series have R_total = 15 Ω. If one resistor is 9 Ω, what is the other resistor?",
    options: [
      "6 Ω",
      "24 Ω",
      "4 Ω",
      "1.67 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'USED_PARALLEL_RULE'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "In series: R_total = R1 + R2. So R2 = 15 - 9 = 6 Ω."
  },

  {
    id: 3027,
    question: "What happens to total resistance when you add another resistor in series (same supply voltage)?",
    options: [
      "Total resistance increases",
      "Total resistance decreases",
      "Total resistance stays the same",
      "Total resistance becomes zero"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'USED_PARALLEL_RULE',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'conceptual'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: "In series, resistances add. Adding another resistor increases the total resistance."
  },

  {
    id: 3028,
    question: "A series circuit has a fixed total resistance. If the supply voltage doubles, what happens to the current?",
    options: [
      "Current doubles",
      "Current halves",
      "Current stays the same",
      "Current becomes zero"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'CONFUSED_I_V_R',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'ohms-law', 'conceptual'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "Ohm’s Law: I = V/R. If R stays constant, doubling V doubles I."
  },

  {
    id: 3029,
    question: "Which formula can be used to find the voltage drop across R1 in a two-resistor series circuit?",
    options: [
      "V_R1 = V_total × (R1 / (R1 + R2))",
      "V_R1 = V_total × (R2 / (R1 + R2))",
      "V_R1 = I_total ÷ R1",
      "V_R1 = R1 ÷ V_total"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'VOLTAGE_DIVIDER_ERROR',
      2: 'CONFUSED_I_V_R',
      3: 'CONFUSED_I_V_R'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'formula', 'conceptual'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Voltage divider: in series, voltage drop is proportional to resistance. For R1, V_R1 = V_total × R1/(R1+R2)."
  },

  {
    id: 3030,
    question: "Two resistors in series: R1 = 2 Ω and R2 = 8 Ω across a 10V supply. What is the voltage drop across R1?",
    options: [
      "2 V",
      "8 V",
      "5 V",
      "10 V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'VOLTAGE_DIVIDER_ERROR',
      2: 'VOLTAGE_EQUAL_SPLIT_ERROR',
      3: 'TOPOLOGY_CONFUSION'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'calculation', 'application'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'V',
    difficulty: 4,
    estimatedTime: 120,
    explanation: "R_total = 10 Ω, I = 10/10 = 1 A. V_R1 = I×R1 = 1×2 = 2 V (also 10×2/10 = 2 V)."
  },

  {
    id: 3031,
    question: "In a series circuit, which resistor will have the larger voltage drop?",
    options: [
      "The resistor with the larger resistance",
      "The resistor with the smaller resistance",
      "They always have equal voltage drops",
      "The one closest to the supply"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'VOLTAGE_DIVIDER_ERROR',
      2: 'VOLTAGE_EQUAL_SPLIT_ERROR',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'conceptual'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "In series, the same current flows through each resistor. Voltage drop is V = I×R, so a larger R gives a larger voltage drop."
  },

  {
    id: 3032,
    question: "A string of Christmas lights is wired in series. If one bulb fails open-circuit, why do all bulbs go out?",
    options: [
      "Because the single path for current is broken",
      "Because voltage becomes zero everywhere",
      "Because current increases too much",
      "Because resistance becomes zero"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'CONFUSED_I_V_R',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'application', 'conceptual', 'current-rule'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "In series, there is only one path. An open circuit breaks the path, so no current flows anywhere."
  },

  {
    id: 3033,
    question: "Two identical resistors are in series across a 12V supply. What is the voltage across each resistor?",
    options: [
      "6 V",
      "12 V",
      "3 V",
      "9 V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'VOLTAGE_DIVIDER_ERROR',
      3: 'VOLTAGE_DIVIDER_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'calculation', 'application'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'V',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "Equal resistors in series share the voltage equally. 12V ÷ 2 = 6V each."
  },

  {
    id: 3034,
    question: "A circuit current is 500 mA in a series circuit. What is this current in amps (A)?",
    options: [
      "0.5 A",
      "5 A",
      "0.05 A",
      "500 A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'units', 'conversion', 'ohms-law'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "1000 mA = 1 A, so 500 mA = 0.5 A."
  },

  {
    id: 3035,
    question: "A series circuit has a 9V supply and a current of 0.5A. What is the total resistance?",
    options: [
      "18 Ω",
      "4.5 Ω",
      "9 Ω",
      "0.056 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'FORMULA_NOT_REARRANGED',
      2: 'CONFUSED_I_V_R',
      3: 'RECIPROCAL_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "Ohm’s Law: R = V/I = 9/0.5 = 18 Ω."
  },

  {
    id: 3036,
    question: "Two resistors are in series. R_total = 18 Ω and R1 = 10 Ω. What is R2?",
    options: [
      "8 Ω",
      "28 Ω",
      "1.8 Ω",
      "0.56 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'DIVIDED_INSTEAD',
      3: 'RECIPROCAL_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "R_total = R1 + R2 → R2 = 18 - 10 = 8 Ω."
  },

  {
    id: 3037,
    question: "A circuit has one loop and no junctions. What does that tell you about the current?",
    options: [
      "The current is the same everywhere in the circuit",
      "The current splits into branches",
      "The current is zero",
      "The current increases after each component"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'current-rule', 'conceptual', 'topology'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "One loop and no junctions means a series path. With one path, the same current flows through every component."
  },

  {
    id: 3038,
    question: "A series circuit has a 6V supply and total resistance of 3 Ω. What is the circuit current?",
    options: [
      "2 A",
      "0.5 A",
      "9 A",
      "3 A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'FORMULA_NOT_REARRANGED',
      2: 'MULTIPLIED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'ohms-law', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "I = V/R = 6/3 = 2 A."
  },

  {
    id: 3039,
    question: "A series circuit current is 0.2A. What is the voltage drop across a 20 Ω resistor in that circuit?",
    options: [
      "4 V",
      "0.01 V",
      "10 V",
      "20 V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'MULTIPLIED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'calculation', 'ohms-law'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'V',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "V = I × R = 0.2 × 20 = 4 V."
  },

  {
    id: 3040,
    question: "Which set of resistors gives a total of 30 Ω when connected in series?",
    options: [
      "10 Ω, 10 Ω, 10 Ω",
      "60 Ω and 60 Ω",
      "15 Ω and 15 Ω in parallel",
      "5 Ω and 25 Ω in parallel"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'TOPOLOGY_CONFUSION',
      3: 'TOPOLOGY_CONFUSION'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "In series, resistances add. 10 + 10 + 10 = 30 Ω."
  },

  {
    id: 3041,
    question: "Which description best matches a series circuit?",
    options: [
      "One path for current, no branches",
      "Multiple branches, same voltage across each branch",
      "Two paths for current, current splits at junctions",
      "A circuit with no resistance"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'TOPOLOGY_CONFUSION',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'discrimination', 'topology', 'conceptual'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 35,
    explanation: "A series circuit has one continuous path (one loop) with no branches."
  },

  {
    id: 3042,
    question: "A student says: 'The current through R1 is 2A, so the current through R2 must be 2A too.' In a series circuit, is the student correct?",
    options: [
      "Yes, current is the same everywhere in series",
      "No, current always splits between resistors",
      "No, current depends on which resistor is larger",
      "Only if both resistors are the same value"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'CONFUSED_I_V_R',
      3: 'VOLTAGE_EQUAL_SPLIT_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'current-rule', 'conceptual'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 55,
    explanation: "In series there is only one path, so the same current flows through every component."
  },

  {
    id: 3043,
    question: "In a series circuit, the voltage drop across R1 and R2 together is 10V, and the drop across R3 is 2V. What is the supply voltage?",
    options: [
      "12 V",
      "8 V",
      "10 V",
      "20 V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'CONFUSED_I_V_R',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'V',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "In series, voltage drops add to the supply: V_supply = 10 + 2 = 12 V."
  },

  {
    id: 3044,
    question: "Which equation describes the series voltage rule?",
    options: [
      "V_total = V1 + V2 + V3 + ...",
      "V_total = V1 = V2 = V3 = ...",
      "1/V_total = 1/V1 + 1/V2 + 1/V3 + ...",
      "V_total = V1 × V2 × V3 × ..."
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'formula', 'conceptual'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: "In series, the supply voltage is shared and the drops add up: V_total = V1 + V2 + ..."
  },

  {
    id: 3045,
    question: "Two resistors are in series across 12V. The voltage across R1 is 9V. If R2 = 2 Ω, what is R1?",
    options: [
      "6 Ω",
      "18 Ω",
      "0.67 Ω",
      "4 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'USED_PARALLEL_RULE',
      3: 'VOLTAGE_DIVIDER_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'calculation', 'voltage-divider'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 5,
    estimatedTime: 150,
    explanation: "If V_total = 12V and V_R1 = 9V, then V_R2 = 3V. Same current flows: I = V_R2/R2 = 3/2 = 1.5A. Then R1 = V_R1/I = 9/1.5 = 6 Ω."
  },

  {
    id: 3046,
    question: "A series circuit has a 20V supply and a current of 2A. What is the total resistance?",
    options: [
      "10 Ω",
      "40 Ω",
      "18 Ω",
      "0.1 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'RECIPROCAL_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'ohms-law', 'calculation'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "R = V/I = 20/2 = 10 Ω."
  },

  {
    id: 3047,
    question: "Which statement about total resistance in a series circuit is TRUE?",
    options: [
      "Total resistance is the sum of all resistors",
      "Total resistance is always less than the smallest resistor",
      "Total resistance is found using 1/R_total = 1/R1 + 1/R2 + ...",
      "Total resistance is found by multiplying the resistors"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'USED_PARALLEL_RULE',
      2: 'USED_PARALLEL_RULE',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'resistance-rule', 'conceptual', 'discrimination'],
    learningOutcomeId: "202-4A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 35,
    explanation: "Series resistors add directly: R_total = R1 + R2 + ..."
  },

  {
    id: 3048,
    question: "A resistor in a series circuit is bypassed by a wire (shorted). What happens to the total resistance of the circuit?",
    options: [
      "Total resistance decreases",
      "Total resistance increases",
      "Total resistance stays the same",
      "Total resistance becomes infinite"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'application', 'conceptual', 'faults'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: "A short provides a very low-resistance path that effectively removes that resistor from the circuit, lowering the total resistance."
  },

  {
    id: 3049,
    question: "In a series circuit, one resistor increases in value (e.g., from heating). Assuming supply voltage stays constant, what happens to the circuit current?",
    options: [
      "Current decreases",
      "Current increases",
      "Current stays the same",
      "Current becomes zero instantly"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'ohms-law', 'conceptual', 'application'],
    learningOutcomeId: "202-4A-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "If total resistance increases and voltage stays constant, Ohm’s Law says current must decrease (I = V/R)."
  },

  {
    id: 3050,
    question: "A 9V supply is connected to three series resistors: 1 Ω, 2 Ω, and 6 Ω. What is the voltage drop across the 6 Ω resistor?",
    options: [
      "6 V",
      "3 V",
      "9 V",
      "2 V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'VOLTAGE_EQUAL_SPLIT_ERROR',
      2: 'TOPOLOGY_CONFUSION',
      3: 'VOLTAGE_DIVIDER_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Series Circuits",
    tags: ['series', 'voltage-rule', 'calculation', 'voltage-divider', 'application'],
    learningOutcomeId: "202-4A-LO3",
    answerType: 'mcq',
    requiredUnits: 'V',
    difficulty: 5,
    estimatedTime: 150,
    explanation: "R_total = 1 + 2 + 6 = 9 Ω. I = 9V/9Ω = 1A. V_6Ω = I×R = 1×6 = 6V."
  }
];

// #region agent log
(()=>{const invalidCodes=new Set();const invalidTags=new Set();seriesCircuitsQuestions.forEach((q,i)=>{if(q.misconceptionCodes){Object.values(q.misconceptionCodes).forEach(code=>{if(!['USED_PARALLEL_RULE','USED_SERIES_RULE','UNITS_MISSING','WRONG_UNITS','MULTIPLIED_INSTEAD','DIVIDED_INSTEAD','RECIPROCAL_ERROR','SIGN_ERROR','ROUNDING_ERROR','FORMULA_NOT_REARRANGED','CONFUSED_I_V_R','TOPOLOGY_CONFUSION','OTHER'].includes(code)){invalidCodes.add(code);}});}if(q.tags){q.tags.forEach(tag=>{if(!['series','parallel','mixed-circuit','ohms-law','current-rule','voltage-rule','resistance-rule','calculation','discrimination','explanation','conceptual','application'].includes(tag)){invalidTags.add(tag);}});}});fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'seriesCircuitsQuestions.ts:1289',message:'Questions loaded - checking invalid codes/tags',data:{questionCount:seriesCircuitsQuestions.length,invalidCodes:Array.from(invalidCodes),invalidTags:Array.from(invalidTags)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});})();
// #endregion
