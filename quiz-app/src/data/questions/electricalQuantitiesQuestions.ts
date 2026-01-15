import { TaggedQuestion } from './types';

/**
 * Electrical Quantities & Units Question Bank
 * Aligned with lesson 202-1A learning outcomes
 * Covers identification of quantities/units, prefix understanding, and conversions
 */

export const electricalQuantitiesQuestions: TaggedQuestion[] = [
  // ===== EASY QUESTIONS (Difficulty 1-2) =====
  
  {
    id: 3051,
    question: "What is the unit of electric current?",
    options: [
      "Ampere (A)",
      "Volt (V)",
      "Ohm (Ω)",
      "Watt (W)"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Current is measured in amperes (A). This is one of the fundamental electrical quantities."
  },

  {
    id: 3052,
    question: "What is the unit of voltage?",
    options: [
      "Volt (V)",
      "Ampere (A)",
      "Watt (W)",
      "Ohm (Ω)"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Voltage (potential difference) is measured in volts (V)."
  },

  {
    id: 3053,
    question: "What is the unit of resistance?",
    options: [
      "Ohm (Ω)",
      "Ampere (A)",
      "Volt (V)",
      "Watt (W)"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Resistance is measured in ohms (Ω). It represents opposition to current flow."
  },

  {
    id: 3054,
    question: "What is the unit of electrical power?",
    options: [
      "Watt (W)",
      "Volt (V)",
      "Ampere (A)",
      "Joule (J)"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Power is measured in watts (W). It represents the rate of energy transfer."
  },

  {
    id: 3055,
    question: "What does the prefix 'kilo' mean?",
    options: [
      "× 1000",
      "÷ 1000",
      "× 100",
      "÷ 100"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'conceptual'],
    learningOutcomeId: "202-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The prefix 'kilo' means multiply by 1000. For example, 1 km = 1000 m, 1 kΩ = 1000 Ω."
  },

  {
    id: 3056,
    question: "What does the prefix 'milli' mean?",
    options: [
      "÷ 1000",
      "× 1000",
      "÷ 100",
      "× 100"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'conceptual'],
    learningOutcomeId: "202-1A-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The prefix 'milli' means divide by 1000 (or multiply by 0.001). For example, 1 mA = 0.001 A."
  },

  // ===== MEDIUM QUESTIONS (Difficulty 2-3) =====

  {
    id: 3057,
    question: "Convert 2500 mA to amperes (A).",
    options: [
      "2.5 A",
      "25 A",
      "0.25 A",
      "250 A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'DIVIDED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'A',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "To convert from mA to A, divide by 1000: 2500 ÷ 1000 = 2.5 A."
  },

  {
    id: 3058,
    question: "Convert 3.5 kΩ to ohms (Ω).",
    options: [
      "3500 Ω",
      "0.0035 Ω",
      "35 Ω",
      "350 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'Ω',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "To convert from kΩ to Ω, multiply by 1000: 3.5 × 1000 = 3500 Ω."
  },

  {
    id: 3059,
    question: "Convert 0.5 A to milliamps (mA).",
    options: [
      "500 mA",
      "0.0005 mA",
      "5 mA",
      "50 mA"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'mA',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "To convert from A to mA, multiply by 1000: 0.5 × 1000 = 500 mA."
  },

  {
    id: 3060,
    question: "Convert 4700 Ω to kilohms (kΩ).",
    options: [
      "4.7 kΩ",
      "47 kΩ",
      "0.47 kΩ",
      "470 kΩ"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'DIVIDED_INSTEAD',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'kΩ',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "To convert from Ω to kΩ, divide by 1000: 4700 ÷ 1000 = 4.7 kΩ."
  },

  {
    id: 3061,
    question: "Which quantity represents the 'flow of electric charge'?",
    options: [
      "Current",
      "Voltage",
      "Resistance",
      "Power"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'CONFUSED_I_V_R',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conceptual', 'discrimination'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Current is defined as the rate of flow of electric charge, measured in amperes (A)."
  },

  {
    id: 3062,
    question: "Which quantity represents 'opposition to current flow'?",
    options: [
      "Resistance",
      "Current",
      "Voltage",
      "Power"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'CONFUSED_I_V_R',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conceptual', 'discrimination'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Resistance is the opposition to current flow in a material, measured in ohms (Ω)."
  },

  {
    id: 3063,
    question: "Convert 220 V to millivolts (mV).",
    options: [
      "220,000 mV",
      "0.22 mV",
      "2200 mV",
      "22 mV"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'mV',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "To convert from V to mV, multiply by 1000: 220 × 1000 = 220,000 mV."
  },

  {
    id: 3064,
    question: "What does the prefix 'mega' mean?",
    options: [
      "× 1,000,000",
      "× 1,000",
      "÷ 1,000,000",
      "÷ 1,000"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'conceptual'],
    learningOutcomeId: "202-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: "The prefix 'mega' means multiply by 1,000,000 (one million). For example, 1 MΩ = 1,000,000 Ω."
  },

  {
    id: 3065,
    question: "Which is equal to 2.2 kΩ?",
    options: [
      "2200 Ω",
      "220 Ω",
      "22,000 Ω",
      "0.0022 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'MULTIPLIED_INSTEAD',
      3: 'DIVIDED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "2.2 kΩ = 2.2 × 1000 = 2200 Ω."
  },

  {
    id: 3066,
    question: "Convert 0.015 A to milliamps (mA).",
    options: [
      "15 mA",
      "0.000015 mA",
      "150 mA",
      "1.5 mA"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'MULTIPLIED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'mA',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "To convert from A to mA, multiply by 1000: 0.015 × 1000 = 15 mA."
  },

  // ===== HARD QUESTIONS (Difficulty 4-5) =====

  {
    id: 3067,
    question: "A circuit component has a resistance of 0.0047 Ω. What is the most appropriate way to express this value?",
    options: [
      "4.7 mΩ",
      "47 mΩ",
      "0.47 mΩ",
      "4700 μΩ"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'DIVIDED_INSTEAD',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'application', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "0.0047 Ω = 0.0047 × 1000 mΩ = 4.7 mΩ. This is the most appropriate representation using standard prefixes."
  },

  {
    id: 3068,
    question: "A power supply delivers 2.5 kW. A measuring instrument displays power in watts. What value will it show?",
    options: [
      "2500 W",
      "0.0025 W",
      "250 W",
      "25,000 W"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'application'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 75,
    explanation: "2.5 kW = 2.5 × 1000 = 2500 W. When converting from kilo to base unit, multiply by 1000."
  },

  {
    id: 3069,
    question: "An ammeter displays 0.00025 A. Which of these is the correct way to express this current using an appropriate prefix?",
    options: [
      "250 μA or 0.25 mA",
      "2.5 mA",
      "25 μA",
      "2500 μA"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'application', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: "0.00025 A = 0.00025 × 1,000,000 = 250 μA. Also 0.00025 × 1000 = 0.25 mA. Both expressions are correct."
  },

  {
    id: 3070,
    question: "A resistor value is marked as 6.8 kΩ with a tolerance of ±5%. What is the maximum possible resistance in ohms?",
    options: [
      "7140 Ω",
      "7480 Ω",
      "6460 Ω",
      "6800 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'application', 'units'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: "First convert: 6.8 kΩ = 6800 Ω. Then calculate 5% tolerance: 6800 × 0.05 = 340 Ω. Maximum = 6800 + 340 = 7140 Ω."
  },

  // ===== ADDITIONAL EASY QUESTIONS (9 more) =====

  {
    id: 3071,
    question: "What symbol is used to represent ohms?",
    options: [
      "Ω",
      "A",
      "V",
      "W"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The symbol Ω (Greek letter omega) represents ohms, the unit of resistance."
  },

  {
    id: 3072,
    question: "What quantity is measured in watts?",
    options: [
      "Power",
      "Current",
      "Voltage",
      "Resistance"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Power is measured in watts (W). It represents the rate of energy transfer."
  },

  {
    id: 3073,
    question: "Which is equal to 1000 mA?",
    options: [
      "1 A",
      "0.001 A",
      "10 A",
      "0.1 A"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 35,
    explanation: "1000 mA = 1000 ÷ 1000 = 1 A. Milli means divide by 1000."
  },

  {
    id: 3074,
    question: "Which is equal to 1 kΩ?",
    options: [
      "1000 Ω",
      "100 Ω",
      "10 Ω",
      "10,000 Ω"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 35,
    explanation: "1 kΩ = 1 × 1000 = 1000 Ω. Kilo means multiply by 1000."
  },

  {
    id: 3075,
    question: "What does 'V' stand for in electrical measurements?",
    options: [
      "Volt",
      "Variation",
      "Volume",
      "Value"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "V is the symbol for volt, the unit of voltage (potential difference)."
  },

  {
    id: 3076,
    question: "What does the prefix 'micro' (μ) mean?",
    options: [
      "÷ 1,000,000",
      "÷ 1000",
      "× 1000",
      "× 1,000,000"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'conceptual'],
    learningOutcomeId: "202-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: "Micro (μ) means divide by 1,000,000 (one millionth). For example, 1 μA = 0.000001 A."
  },

  {
    id: 3077,
    question: "Which quantity represents the 'electrical push' in a circuit?",
    options: [
      "Voltage",
      "Current",
      "Resistance",
      "Power"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conceptual', 'discrimination'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: "Voltage represents the electrical potential difference or 'push' that drives current through a circuit."
  },

  {
    id: 3078,
    question: "Convert 5000 mV to volts (V).",
    options: [
      "5 V",
      "50 V",
      "0.5 V",
      "500 V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'DIVIDED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'V',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "To convert from mV to V, divide by 1000: 5000 ÷ 1000 = 5 V."
  },

  {
    id: 3079,
    question: "Which unit symbol represents ampere?",
    options: [
      "A",
      "Am",
      "Ap",
      "a"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The symbol 'A' (capital letter) represents ampere, the unit of electric current."
  },

  // ===== ADDITIONAL MEDIUM QUESTIONS (15 more) =====

  {
    id: 3080,
    question: "Convert 12 V to millivolts (mV).",
    options: [
      "12,000 mV",
      "0.012 mV",
      "120 mV",
      "1200 mV"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'mV',
    difficulty: 2,
    estimatedTime: 50,
    explanation: "To convert from V to mV, multiply by 1000: 12 × 1000 = 12,000 mV."
  },

  {
    id: 3081,
    question: "Convert 8200 Ω to kilohms (kΩ).",
    options: [
      "8.2 kΩ",
      "82 kΩ",
      "0.82 kΩ",
      "820 kΩ"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'DIVIDED_INSTEAD',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'kΩ',
    difficulty: 2,
    estimatedTime: 50,
    explanation: "To convert from Ω to kΩ, divide by 1000: 8200 ÷ 1000 = 8.2 kΩ."
  },

  {
    id: 3082,
    question: "What is 0.75 A expressed in milliamps (mA)?",
    options: [
      "750 mA",
      "0.00075 mA",
      "7.5 mA",
      "75 mA"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'mA',
    difficulty: 2,
    estimatedTime: 50,
    explanation: "To convert from A to mA, multiply by 1000: 0.75 × 1000 = 750 mA."
  },

  {
    id: 3083,
    question: "Which is larger: 500 mA or 0.6 A?",
    options: [
      "0.6 A",
      "500 mA",
      "They are equal",
      "Cannot compare"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'conceptual', 'conceptual'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "500 mA = 0.5 A, which is less than 0.6 A. Therefore 0.6 A is larger."
  },

  {
    id: 3084,
    question: "Convert 0.0082 A to milliamps (mA).",
    options: [
      "8.2 mA",
      "82 mA",
      "0.82 mA",
      "820 mA"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'DIVIDED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'mA',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "To convert from A to mA, multiply by 1000: 0.0082 × 1000 = 8.2 mA."
  },

  {
    id: 3085,
    question: "A component has 15,000 Ω resistance. What is the most appropriate way to express this?",
    options: [
      "15 kΩ",
      "0.015 MΩ",
      "15,000 Ω",
      "1.5 kΩ"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'application', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 55,
    explanation: "15,000 Ω = 15 kΩ. This is the most common and practical way to express this value."
  },

  {
    id: 3086,
    question: "Which is smaller: 3.3 kΩ or 5600 Ω?",
    options: [
      "3.3 kΩ",
      "5600 Ω",
      "They are equal",
      "Cannot compare"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'conceptual', 'conceptual'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 65,
    explanation: "3.3 kΩ = 3300 Ω, which is less than 5600 Ω. Therefore 3.3 kΩ is smaller."
  },

  {
    id: 3087,
    question: "Convert 180 W to kilowatts (kW).",
    options: [
      "0.18 kW",
      "1.8 kW",
      "18 kW",
      "180,000 kW"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'kW',
    difficulty: 2,
    estimatedTime: 50,
    explanation: "To convert from W to kW, divide by 1000: 180 ÷ 1000 = 0.18 kW."
  },

  {
    id: 3088,
    question: "A circuit has 0.025 A current. Express this in microamps (μA).",
    options: [
      "25,000 μA",
      "25 μA",
      "2500 μA",
      "250 μA"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'μA',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "To convert from A to μA, multiply by 1,000,000: 0.025 × 1,000,000 = 25,000 μA."
  },

  {
    id: 3089,
    question: "What is 47,000 μA in milliamps (mA)?",
    options: [
      "47 mA",
      "4.7 mA",
      "470 mA",
      "0.47 mA"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'DIVIDED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'mA',
    difficulty: 3,
    estimatedTime: 70,
    explanation: "First convert μA to A: 47,000 μA = 0.047 A. Then to mA: 0.047 × 1000 = 47 mA."
  },

  {
    id: 3090,
    question: "A resistor is 1.2 MΩ. What is this in kilohms (kΩ)?",
    options: [
      "1200 kΩ",
      "12 kΩ",
      "120 kΩ",
      "12,000 kΩ"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'kΩ',
    difficulty: 3,
    estimatedTime: 70,
    explanation: "1 MΩ = 1000 kΩ, so 1.2 MΩ = 1.2 × 1000 = 1200 kΩ."
  },

  {
    id: 3091,
    question: "Which quantity represents 'rate of energy transfer'?",
    options: [
      "Power",
      "Current",
      "Voltage",
      "Resistance"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conceptual', 'discrimination'],
    learningOutcomeId: "202-1A-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Power is defined as the rate of energy transfer, measured in watts (W)."
  },

  {
    id: 3092,
    question: "Convert 3.3 kW to watts (W).",
    options: [
      "3300 W",
      "0.0033 W",
      "330 W",
      "33,000 W"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'DIVIDED_INSTEAD',
      2: 'ARITHMETIC_ERROR',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'W',
    difficulty: 2,
    estimatedTime: 50,
    explanation: "To convert from kW to W, multiply by 1000: 3.3 × 1000 = 3300 W."
  },

  {
    id: 3093,
    question: "A meter displays 560 μV. What is this in millivolts (mV)?",
    options: [
      "0.56 mV",
      "5.6 mV",
      "56 mV",
      "560,000 mV"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    requiredUnits: 'mV',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "560 μV = 560 × 10^-6 V = 0.00056 V. Then 0.00056 × 1000 = 0.56 mV."
  },

  {
    id: 3094,
    question: "Which prefix represents the largest multiplier?",
    options: [
      "Mega (M)",
      "Kilo (k)",
      "Milli (m)",
      "Micro (μ)"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'conceptual'],
    learningOutcomeId: "202-1A-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Mega (M) = ×1,000,000 is the largest multiplier. Kilo = ×1000, milli = ÷1000, micro = ÷1,000,000."
  },

  // ===== ADDITIONAL HARD QUESTIONS (6 more) =====

  {
    id: 3095,
    question: "A circuit draws 250 mA from a 12 V supply. If the supply voltage is measured in millivolts, what value would be displayed?",
    options: [
      "12,000 mV",
      "120 mV",
      "1200 mV",
      "0.012 mV"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'DIVIDED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'application'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "12 V = 12 × 1000 = 12,000 mV. The current value doesn't affect the voltage conversion."
  },

  {
    id: 3096,
    question: "A component specification lists resistance as 2.7 kΩ ±10%. What is the minimum resistance in ohms?",
    options: [
      "2430 Ω",
      "2700 Ω",
      "2970 Ω",
      "270 Ω"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'OTHER',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'application', 'units'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: "2.7 kΩ = 2700 Ω. 10% tolerance = 2700 × 0.10 = 270 Ω. Minimum = 2700 - 270 = 2430 Ω."
  },

  {
    id: 3097,
    question: "Convert 0.0000035 A to the most appropriate prefix form.",
    options: [
      "3.5 μA",
      "35 μA",
      "0.0035 mA",
      "350 μA"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'application', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 100,
    explanation: "0.0000035 A = 0.0000035 × 1,000,000 = 3.5 μA. This is the most appropriate representation."
  },

  {
    id: 3098,
    question: "A power supply delivers 2.2 kW. An energy meter displays power in watts. After 30 minutes, how many watt-hours of energy have been consumed?",
    options: [
      "1100 Wh",
      "2200 Wh",
      "660 Wh",
      "66 Wh"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'OTHER',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'application'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: "2.2 kW = 2200 W. Energy = Power × Time = 2200 W × 0.5 h = 1100 Wh."
  },

  {
    id: 3099,
    question: "Which is larger: 0.0082 MΩ or 6800 Ω?",
    options: [
      "0.0082 MΩ",
      "6800 Ω",
      "They are equal",
      "Cannot be compared"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'conceptual', 'calculation'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "0.0082 MΩ = 0.0082 × 1,000,000 = 8200 Ω, which is larger than 6800 Ω."
  },

  {
    id: 3100,
    question: "A technician measures 0.000450 A. Which of these represents the same value?",
    options: [
      "450 μA or 0.45 mA",
      "45 μA",
      "4.5 mA",
      "0.045 mA"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Electrical Quantities",
    tags: ['conversion', 'calculation', 'application', 'conversion'],
    learningOutcomeId: "202-1A-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: "0.000450 A = 450 μA (multiply by 1,000,000) or 0.45 mA (multiply by 1000). Both are correct."
  }
];

