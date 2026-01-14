import { TaggedQuestion } from './types';

/**
 * Ohm's Law Question Bank
 * Aligned with lesson 202-2A learning outcomes
 * 
 * 50 questions total:
 * - 15 Easy (difficulty 1-2): Basic recall and simple calculations
 * - 25 Medium (difficulty 2-3): Standard calculations and understanding
 * - 10 Hard (difficulty 4-5): Complex applications and analysis
 */

export const ohmsLawQuestions: TaggedQuestion[] = [
  // ===== EASY QUESTIONS (1-15) - Difficulty 1-2 =====
  
  // Discrimination & Recall
  {
    id: 3100,
    question: "What is the formula for Ohm's Law?",
    options: [
      "V = I × R",
      "V = I ÷ R",
      "V = R ÷ I",
      "V = I + R"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-2A-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'FORMULA_NOT_REARRANGED',
      2: 'CONFUSED_I_V_R',
      3: 'OTHER'
    },
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Ohm's Law states that Voltage = Current × Resistance, written as V = I × R"
  },
  {
    id: 3101,
    question: "In the formula V = I × R, what does 'V' represent?",
    options: [
      "Voltage in volts",
      "Volume in litres",
      "Velocity in metres per second",
      "Value in ohms"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-2A-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_I_V_R'
    },
    difficulty: 1,
    estimatedTime: 30,
    explanation: "In Ohm's Law, V stands for Voltage, measured in volts (V)"
  },
  {
    id: 3102,
    question: "What unit is current measured in?",
    options: [
      "Amperes (A)",
      "Volts (V)",
      "Ohms (Ω)",
      "Watts (W)"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-2A-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'WRONG_UNITS',
      2: 'WRONG_UNITS',
      3: 'WRONG_UNITS'
    },
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Current (I) is measured in amperes, abbreviated as A"
  },
  {
    id: 3103,
    question: "Which formula would you use to calculate current if you know voltage and resistance?",
    options: [
      "I = V ÷ R",
      "I = V × R",
      "I = R ÷ V",
      "I = V - R"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'discrimination', 'calculation'],
    learningOutcomeId: "202-2A-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'CONFUSED_I_V_R',
      3: 'OTHER'
    },
    difficulty: 1,
    estimatedTime: 40,
    explanation: "To find current, rearrange V = IR to get I = V ÷ R (divide voltage by resistance)"
  },
  {
    id: 3104,
    question: "A circuit has V = 10V and R = 5Ω. Calculate the current.",
    options: [
      "2A",
      "50A",
      "0.5A",
      "15A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'RECIPROCAL_ERROR',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "I = V ÷ R = 10 ÷ 5 = 2A"
  },
  {
    id: 3105,
    question: "If I = 4A and R = 3Ω, calculate the voltage.",
    options: [
      "12V",
      "7V",
      "1.33V",
      "0.75V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'DIVIDED_INSTEAD',
      3: 'RECIPROCAL_ERROR'
    },
    requiredUnits: 'V',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "V = I × R = 4 × 3 = 12V"
  },
  {
    id: 3106,
    question: "What is the resistance if V = 20V and I = 4A?",
    options: [
      "5Ω",
      "80Ω",
      "16Ω",
      "0.2Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'RECIPROCAL_ERROR'
    },
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "R = V ÷ I = 20 ÷ 4 = 5Ω"
  },
  {
    id: 3107,
    question: "A 6V battery is connected to a 2Ω resistor. What is the current?",
    options: [
      "3A",
      "12A",
      "8A",
      "0.33A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'RECIPROCAL_ERROR'
    },
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "I = V ÷ R = 6 ÷ 2 = 3A"
  },
  {
    id: 3108,
    question: "If current is 2A and voltage is 8V, find the resistance.",
    options: [
      "4Ω",
      "16Ω",
      "6Ω",
      "0.25Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'RECIPROCAL_ERROR'
    },
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "R = V ÷ I = 8 ÷ 2 = 4Ω"
  },
  {
    id: 3109,
    question: "Calculate the voltage when I = 5A and R = 6Ω.",
    options: [
      "30V",
      "11V",
      "1.2V",
      "0.83V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'DIVIDED_INSTEAD',
      3: 'RECIPROCAL_ERROR'
    },
    requiredUnits: 'V',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "V = I × R = 5 × 6 = 30V"
  },
  {
    id: 3110,
    question: "What happens to current if voltage doubles and resistance stays the same?",
    options: [
      "Current doubles",
      "Current halves",
      "Current stays the same",
      "Current quadruples"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'explanation'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 2,
    estimatedTime: 60,
    explanation: "V and I are directly proportional. If V doubles, I doubles (I = V ÷ R)"
  },
  {
    id: 3111,
    question: "A 9V battery supplies a 3Ω lamp. Calculate the current.",
    options: [
      "3A",
      "27A",
      "6A",
      "12A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "I = V ÷ R = 9 ÷ 3 = 3A"
  },
  {
    id: 3112,
    question: "Which two quantities do you need to know to calculate resistance using Ohm's Law?",
    options: [
      "Voltage and current",
      "Power and time",
      "Voltage and power",
      "Current and time"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-2A-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 1,
    estimatedTime: 45,
    explanation: "To find resistance, you need voltage and current: R = V ÷ I"
  },
  {
    id: 3113,
    question: "If V = 15V and R = 3Ω, what is I?",
    options: [
      "5A",
      "45A",
      "18A",
      "12A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "I = V ÷ R = 15 ÷ 3 = 5A"
  },
  {
    id: 3114,
    question: "Calculate V when I = 8A and R = 2Ω.",
    options: [
      "16V",
      "10V",
      "4V",
      "6V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'DIVIDED_INSTEAD',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "V = I × R = 8 × 2 = 16V"
  },

  // ===== MEDIUM QUESTIONS (16-40) - Difficulty 2-3 =====
  
  {
    id: 3115,
    question: "A resistor has 24V across it and draws 3A. What is its resistance?",
    options: [
      "8Ω",
      "72Ω",
      "27Ω",
      "21Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 75,
    explanation: "R = V ÷ I = 24 ÷ 3 = 8Ω"
  },
  {
    id: 3116,
    question: "What happens to current if resistance doubles while voltage remains constant?",
    options: [
      "Current halves",
      "Current doubles",
      "Current stays the same",
      "Current quadruples"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'explanation'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 3,
    estimatedTime: 75,
    explanation: "I and R are inversely proportional. If R doubles, I halves (I = V ÷ R)"
  },
  {
    id: 3117,
    question: "A circuit has a 12V supply and 0.5A current. Calculate the resistance.",
    options: [
      "24Ω",
      "6Ω",
      "12.5Ω",
      "11.5Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'Ω',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "R = V ÷ I = 12 ÷ 0.5 = 24Ω (dividing by 0.5 is the same as multiplying by 2)"
  },
  {
    id: 3118,
    question: "If a 100Ω resistor has 2A flowing through it, what is the voltage across it?",
    options: [
      "200V",
      "50V",
      "102V",
      "98V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "V = I × R = 2 × 100 = 200V"
  },
  {
    id: 3119,
    question: "A 230V supply is connected to a component drawing 0.5A. Find the resistance.",
    options: [
      "460Ω",
      "115Ω",
      "230.5Ω",
      "229.5Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'Ω',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "R = V ÷ I = 230 ÷ 0.5 = 460Ω"
  },
  {
    id: 3120,
    question: "Calculate the current when V = 18V and R = 9Ω.",
    options: [
      "2A",
      "162A",
      "27A",
      "9A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 70,
    explanation: "I = V ÷ R = 18 ÷ 9 = 2A"
  },
  {
    id: 3121,
    question: "If current through a resistor triples and resistance stays the same, what happens to voltage?",
    options: [
      "Voltage triples",
      "Voltage stays the same",
      "Voltage is divided by 3",
      "Voltage is squared"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'explanation'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_I_V_R',
      3: 'OTHER'
    },
    difficulty: 3,
    estimatedTime: 75,
    explanation: "V = I × R, so if I triples and R is constant, V must also triple"
  },
  {
    id: 3122,
    question: "A heating element has resistance 25Ω and operates at 10A. What voltage does it require?",
    options: [
      "250V",
      "2.5V",
      "35V",
      "15V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "V = I × R = 10 × 25 = 250V"
  },
  {
    id: 3123,
    question: "If V = 36V and I = 4A, calculate R.",
    options: [
      "9Ω",
      "144Ω",
      "40Ω",
      "32Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 70,
    explanation: "R = V ÷ I = 36 ÷ 4 = 9Ω"
  },
  {
    id: 3124,
    question: "A circuit component has 50V across it. If its resistance is 10Ω, what current flows?",
    options: [
      "5A",
      "500A",
      "60A",
      "40A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 70,
    explanation: "I = V ÷ R = 50 ÷ 10 = 5A"
  },
  {
    id: 3125,
    question: "What is the correct rearrangement of V = IR to solve for resistance?",
    options: [
      "R = V ÷ I",
      "R = I ÷ V",
      "R = V × I",
      "R = V - I"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-2A-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'MULTIPLIED_INSTEAD',
      3: 'OTHER'
    },
    difficulty: 2,
    estimatedTime: 60,
    explanation: "To isolate R, divide both sides by I: R = V ÷ I"
  },
  {
    id: 3126,
    question: "A 48V motor draws 6A. Calculate its resistance.",
    options: [
      "8Ω",
      "288Ω",
      "54Ω",
      "42Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'Ω',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "R = V ÷ I = 48 ÷ 6 = 8Ω"
  },
  {
    id: 3127,
    question: "If I = 0.25A and R = 40Ω, find V.",
    options: [
      "10V",
      "160V",
      "40.25V",
      "39.75V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 3,
    estimatedTime: 80,
    explanation: "V = I × R = 0.25 × 40 = 10V"
  },
  {
    id: 3128,
    question: "What happens to voltage if both current and resistance are doubled?",
    options: [
      "Voltage quadruples (×4)",
      "Voltage doubles (×2)",
      "Voltage stays the same",
      "Voltage halves (÷2)"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'explanation'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 3,
    estimatedTime: 90,
    explanation: "V = I × R. If I doubles (×2) and R doubles (×2), then V = (2I) × (2R) = 4IR, so V quadruples"
  },
  {
    id: 3129,
    question: "Calculate current when V = 27V and R = 9Ω.",
    options: [
      "3A",
      "243A",
      "36A",
      "18A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 70,
    explanation: "I = V ÷ R = 27 ÷ 9 = 3A"
  },
  {
    id: 3130,
    question: "A resistor with R = 15Ω has I = 2A flowing through it. What is V?",
    options: [
      "30V",
      "7.5V",
      "17V",
      "13V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 2,
    estimatedTime: 70,
    explanation: "V = I × R = 2 × 15 = 30V"
  },
  {
    id: 3131,
    question: "If voltage increases by 50% and resistance stays the same, what happens to current?",
    options: [
      "Current increases by 50%",
      "Current decreases by 50%",
      "Current stays the same",
      "Current doubles"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'explanation'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 3,
    estimatedTime: 80,
    explanation: "V and I are directly proportional. If V increases by 50%, I also increases by 50%"
  },
  {
    id: 3132,
    question: "A circuit has V = 100V and R = 20Ω. Find the current.",
    options: [
      "5A",
      "2000A",
      "120A",
      "80A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 70,
    explanation: "I = V ÷ R = 100 ÷ 20 = 5A"
  },
  {
    id: 3133,
    question: "If V = 72V and I = 8A, what is R?",
    options: [
      "9Ω",
      "576Ω",
      "80Ω",
      "64Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 70,
    explanation: "R = V ÷ I = 72 ÷ 8 = 9Ω"
  },
  {
    id: 3134,
    question: "A component operates at 24V with 0.8A current. Calculate its resistance.",
    options: [
      "30Ω",
      "19.2Ω",
      "24.8Ω",
      "23.2Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'Ω',
    difficulty: 3,
    estimatedTime: 80,
    explanation: "R = V ÷ I = 24 ÷ 0.8 = 30Ω"
  },
  {
    id: 3135,
    question: "If resistance is halved and voltage stays constant, what happens to current?",
    options: [
      "Current doubles",
      "Current halves",
      "Current stays the same",
      "Current quadruples"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'explanation'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 3,
    estimatedTime: 75,
    explanation: "I = V ÷ R. If R is halved, I doubles (inverse relationship)"
  },
  {
    id: 3136,
    question: "Calculate voltage when I = 7A and R = 5Ω.",
    options: [
      "35V",
      "1.4V",
      "12V",
      "2V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 2,
    estimatedTime: 70,
    explanation: "V = I × R = 7 × 5 = 35V"
  },
  {
    id: 3137,
    question: "A 60Ω resistor is connected to a 120V supply. What current flows?",
    options: [
      "2A",
      "7200A",
      "180A",
      "0.5A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'RECIPROCAL_ERROR'
    },
    requiredUnits: 'A',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "I = V ÷ R = 120 ÷ 60 = 2A"
  },
  {
    id: 3138,
    question: "If V = 45V and R = 5Ω, calculate I.",
    options: [
      "9A",
      "225A",
      "50A",
      "40A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 70,
    explanation: "I = V ÷ R = 45 ÷ 5 = 9A"
  },
  {
    id: 3139,
    question: "A lamp has 10Ω resistance and draws 1.5A. What is the supply voltage?",
    options: [
      "15V",
      "6.67V",
      "11.5V",
      "8.5V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "V = I × R = 1.5 × 10 = 15V"
  },

  // ===== HARD QUESTIONS (41-50) - Difficulty 4-5 =====
  
  {
    id: 3140,
    question: "A circuit has 3A current initially. If voltage is tripled and resistance is doubled, what is the new current?",
    options: [
      "4.5A",
      "6A",
      "1.5A",
      "9A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'explanation', 'application'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'DIVIDED_INSTEAD',
      3: 'CONFUSED_I_V_R'
    },
    difficulty: 4,
    estimatedTime: 120,
    explanation: "I = V ÷ R. New current = (3V) ÷ (2R) = 3/2 × (V/R) = 1.5 × original current = 1.5 × 3A = 4.5A"
  },
  {
    id: 3141,
    question: "A resistor has 80V across it with 4A current. If voltage drops to 60V, what will the new current be?",
    options: [
      "3A",
      "5A",
      "2A",
      "4A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 4,
    estimatedTime: 100,
    explanation: "First find R: R = 80 ÷ 4 = 20Ω. Then with new voltage: I = 60 ÷ 20 = 3A"
  },
  {
    id: 3142,
    question: "Two resistors are tested. Resistor A: 12V, 2A. Resistor B: 18V, 3A. Which has higher resistance?",
    options: [
      "Both have the same resistance (6Ω)",
      "Resistor A (6Ω)",
      "Resistor B (6Ω)",
      "Cannot determine"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application', 'conceptual'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 4,
    estimatedTime: 110,
    explanation: "R_A = 12 ÷ 2 = 6Ω. R_B = 18 ÷ 3 = 6Ω. Both have identical resistance."
  },
  {
    id: 3143,
    question: "A component at 20°C has R = 50Ω at V = 100V. If R increases to 60Ω at higher temperature with same voltage, what is the new current?",
    options: [
      "1.67A",
      "2A",
      "2.4A",
      "1.2A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'A',
    difficulty: 4,
    estimatedTime: 100,
    explanation: "I = V ÷ R = 100 ÷ 60 = 1.67A (rounded)"
  },
  {
    id: 3144,
    question: "A circuit needs 6A current through a 15Ω resistor. What minimum voltage supply is required?",
    options: [
      "90V",
      "2.5V",
      "21V",
      "9V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "V = I × R = 6 × 15 = 90V minimum"
  },
  {
    id: 3145,
    question: "A variable resistor is adjusted from 10Ω to 40Ω while connected to a 120V supply. By what factor does current change?",
    options: [
      "Current becomes 1/4 (quarters)",
      "Current becomes 1/2 (halves)",
      "Current quadruples (×4)",
      "Current doubles (×2)"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'explanation', 'application'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 5,
    estimatedTime: 120,
    explanation: "R increases by factor of 4 (10Ω → 40Ω). Since I = V ÷ R and V is constant, current decreases by factor of 4 (inverse relationship)."
  },
  {
    id: 3146,
    question: "If a circuit operates at 48V with 8Ω resistance, what resistance change would double the current?",
    options: [
      "Reduce to 4Ω",
      "Increase to 16Ω",
      "Reduce to 6Ω",
      "Increase to 10Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'application'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 5,
    estimatedTime: 110,
    explanation: "To double current while voltage is constant, resistance must halve: 8Ω ÷ 2 = 4Ω (inverse relationship between I and R)"
  },
  {
    id: 3147,
    question: "A 200Ω heating element draws 1.15A. Calculate the supply voltage.",
    options: [
      "230V",
      "173.9V",
      "201.15V",
      "198.85V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "V = I × R = 1.15 × 200 = 230V (typical UK mains voltage)"
  },
  {
    id: 3148,
    question: "A circuit component must not exceed 5A. If it has 75Ω resistance, what is the maximum safe voltage?",
    options: [
      "375V",
      "15V",
      "80V",
      "70V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'V',
    difficulty: 4,
    estimatedTime: 100,
    explanation: "V_max = I_max × R = 5 × 75 = 375V maximum"
  },
  {
    id: 3149,
    question: "A circuit has V = 84V and R = 21Ω. If you need to reduce current by 25%, what should the new resistance be?",
    options: [
      "28Ω",
      "15.75Ω",
      "26.25Ω",
      "21Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Ohm's Law",
    tags: ['ohms-law', 'conceptual', 'calculation', 'application'],
    learningOutcomeId: "202-2A-LO4",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    requiredUnits: 'Ω',
    difficulty: 5,
    estimatedTime: 120,
    explanation: "Reducing current by 25% means new current is 75% of original (×0.75). Since I and R are inversely proportional, R must increase by factor of 1/0.75 = 1.333. New R = 21 × 1.333 = 28Ω"
  }
];

