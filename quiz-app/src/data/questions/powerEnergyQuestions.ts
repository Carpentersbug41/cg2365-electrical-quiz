import { TaggedQuestion } from './types';

/**
 * Power & Energy Question Bank
 * Aligned with lesson 202-5A learning outcomes
 * 
 * Distribution:
 * - Easy (15): 3200-3214
 * - Medium (25): 3215-3239
 * - Hard (10): 3240-3249
 * 
 * Types:
 * - Discrimination (5, 10%): Identify units, formulas
 * - Conceptual (15, 30%): Understanding relationships
 * - Calculation (25, 50%): Power/energy/cost calculations
 * - Application (5, 10%): Real-world scenarios
 */

export const powerEnergyQuestions: TaggedQuestion[] = [
  // ============================================
  // EASY QUESTIONS (15 questions: 3200-3214)
  // ============================================

  // Easy - Discrimination/Formula Recognition
  {
    id: 3200,
    question: 'What is the correct formula for electrical power?',
    options: ['P = V × I', 'P = I ÷ V', 'P = V ÷ I', 'P = I - V'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['formula', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-5A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'CONFUSED_I_V_R',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Power equals voltage multiplied by current: P = V × I. This tells us the rate of energy transfer in watts.'
  },

  {
    id: 3201,
    question: 'What is the SI unit of electrical power?',
    options: ['Watt (W)', 'Joule (J)', 'Ampere (A)', 'Volt (V)'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-5A-LO1',
    misconceptionCodes: {
      1: 'UNITS_MISSING',
      2: 'WRONG_UNITS',
      3: 'WRONG_UNITS'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 15,
    explanation: 'The watt (W) is the SI unit of power. One watt equals one joule of energy per second.'
  },

  {
    id: 3202,
    question: 'What unit is used on electricity bills to measure energy consumption?',
    options: ['Kilowatt-hour (kWh)', 'Watt (W)', 'Kilowatt (kW)', 'Joule (J)'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['units', 'discrimination', 'application'],
    learningOutcomeId: '202-5A-LO1',
    misconceptionCodes: {
      1: 'WRONG_UNITS',
      2: 'WRONG_UNITS',
      3: 'UNITS_MISSING'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Electricity bills use kilowatt-hours (kWh) to measure energy consumption. 1 kWh is the energy used by a 1kW appliance running for 1 hour.'
  },

  {
    id: 3203,
    question: 'How many watts are in 1 kilowatt?',
    options: ['1000 W', '100 W', '10 W', '10000 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['units', 'conversion', 'conceptual'],
    learningOutcomeId: '202-5A-LO1',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 15,
    explanation: '1 kilowatt (kW) = 1000 watts (W). The prefix "kilo" means multiply by 1000.'
  },

  {
    id: 3204,
    question: 'A lamp is connected to a 12V supply and draws 2A. What is the power?',
    options: ['24 W', '14 W', '6 W', '10 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'DIVIDED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: 'Use P = V × I. P = 12 × 2 = 24W.'
  },

  {
    id: 3205,
    question: 'If voltage is 10V and current is 5A, what is the power?',
    options: ['50 W', '15 W', '2 W', '5 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'DIVIDED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: 'P = V × I = 10 × 5 = 50W.'
  },

  {
    id: 3206,
    question: 'What is power in electrical terms?',
    options: [
      'The rate of energy transfer',
      'The total amount of charge',
      'The resistance to current flow',
      'The voltage across a component'
    ],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['conceptual', 'explanation'],
    learningOutcomeId: '202-5A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'Power is the rate at which energy is transferred or consumed, measured in watts (joules per second).'
  },

  {
    id: 3207,
    question: 'A 100W light bulb is switched on. What does 100W represent?',
    options: [
      'The rate of energy consumption',
      'The total energy consumed',
      'The amount of current drawn',
      'The resistance of the bulb'
    ],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['conceptual', 'application'],
    learningOutcomeId: '202-5A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: '100W means the bulb uses energy at a rate of 100 joules per second.'
  },

  {
    id: 3208,
    question: 'Which of these is a unit of energy, not power?',
    options: ['Kilowatt-hour (kWh)', 'Watt (W)', 'Kilowatt (kW)', 'Megawatt (MW)'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['units', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-5A-LO2',
    misconceptionCodes: {
      1: 'WRONG_UNITS',
      2: 'WRONG_UNITS',
      3: 'WRONG_UNITS'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'kWh is a unit of energy (power × time). W, kW, and MW are all units of power (rate of energy transfer).'
  },

  {
    id: 3209,
    question: 'Calculate the power when V = 6V and I = 3A.',
    options: ['18 W', '9 W', '2 W', '3 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'DIVIDED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: 'P = V × I = 6 × 3 = 18W.'
  },

  {
    id: 3210,
    question: 'A device operates at 24V and draws 0.5A. Calculate the power.',
    options: ['12 W', '24.5 W', '48 W', '23.5 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'MULTIPLIED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'P = V × I = 24 × 0.5 = 12W.'
  },

  {
    id: 3211,
    question: 'What happens to power if voltage doubles while current stays constant?',
    options: ['Power doubles', 'Power halves', 'Power quadruples', 'Power stays the same'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['conceptual', 'explanation'],
    learningOutcomeId: '202-5A-LO4',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'From P = V × I, if V doubles and I stays constant, P also doubles. Power is directly proportional to voltage.'
  },

  {
    id: 3212,
    question: 'What happens to power if current doubles while voltage stays constant?',
    options: ['Power doubles', 'Power halves', 'Power quadruples', 'Power stays the same'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['conceptual', 'explanation'],
    learningOutcomeId: '202-5A-LO4',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'From P = V × I, if I doubles and V stays constant, P also doubles. Power is directly proportional to current.'
  },

  {
    id: 3213,
    question: 'Convert 2.5 kW to watts.',
    options: ['2500 W', '250 W', '25 W', '25000 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['units', 'conversion'],
    learningOutcomeId: '202-5A-LO1',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'To convert kW to W, multiply by 1000. 2.5 × 1000 = 2500W.'
  },

  {
    id: 3214,
    question: 'A 230V appliance draws 4A. Calculate the power in watts.',
    options: ['920 W', '234 W', '226 W', '57.5 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'DIVIDED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'P = V × I = 230 × 4 = 920W.'
  },

  // ============================================
  // MEDIUM QUESTIONS (25 questions: 3215-3239)
  // ============================================

  {
    id: 3215,
    question: 'A 230V kettle draws 13A. Calculate the power in kilowatts.',
    options: ['2.99 kW', '29.9 kW', '299 kW', '0.299 kW'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula', 'conversion'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'DIVIDED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'P = V × I = 230 × 13 = 2990W = 2.99kW (divide by 1000 to convert W to kW).'
  },

  {
    id: 3216,
    question: 'A 1.5kW heater runs for 2 hours. How much energy is consumed in kWh?',
    options: ['3 kWh', '1.5 kWh', '0.75 kWh', '4.5 kWh'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'DIVIDED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'Energy = Power × Time = 1.5kW × 2h = 3kWh.'
  },

  {
    id: 3217,
    question: 'A 2kW appliance runs for 30 minutes. Calculate energy consumed in kWh.',
    options: ['1 kWh', '2 kWh', '0.5 kWh', '4 kWh'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application', 'conversion'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'DIVIDED_INSTEAD',
      3: 'MULTIPLIED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 50,
    explanation: '30 minutes = 0.5 hours. Energy = 2kW × 0.5h = 1kWh.'
  },

  {
    id: 3218,
    question: 'If electricity costs 25p per kWh, how much does it cost to run a 2kW heater for 3 hours?',
    options: ['£1.50', '£0.75', '£2.00', '£3.00'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'MULTIPLIED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: 'Energy = 2kW × 3h = 6kWh. Cost = 6 × 25p = 150p = £1.50.'
  },

  {
    id: 3219,
    question: 'A device uses 0.5kWh of energy in 2 hours. What is its power rating?',
    options: ['0.25 kW', '1 kW', '0.5 kW', '2 kW'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'MULTIPLIED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 50,
    explanation: 'Rearrange E = P × t to get P = E ÷ t. P = 0.5 ÷ 2 = 0.25kW or 250W.'
  },

  {
    id: 3220,
    question: 'Why does a 3kW kettle draw more current than a 100W light bulb when both operate at 230V?',
    options: [
      'Higher power requires higher current at the same voltage',
      'The kettle has higher resistance',
      'The light bulb has higher voltage',
      'The kettle operates at lower voltage'
    ],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['conceptual', 'explanation', 'application'],
    learningOutcomeId: '202-5A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'From P = V × I, if voltage is constant (230V), higher power means higher current: I = P ÷ V. The kettle (3000W) draws 13A while the bulb (100W) draws 0.43A.'
  },

  {
    id: 3221,
    question: 'A 230V appliance has a power rating of 460W. Calculate the current drawn.',
    options: ['2 A', '4 A', '230 A', '115 A'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'CONFUSED_I_V_R',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'Rearrange P = V × I to get I = P ÷ V. I = 460 ÷ 230 = 2A.'
  },

  {
    id: 3222,
    question: 'Calculate the voltage across a device that consumes 120W with a current of 5A.',
    options: ['24 V', '125 V', '115 V', '600 V'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'MULTIPLIED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 50,
    explanation: 'Rearrange P = V × I to get V = P ÷ I. V = 120 ÷ 5 = 24V.'
  },

  {
    id: 3223,
    question: 'A 12V car battery supplies 60W to a device. What current does it draw?',
    options: ['5 A', '72 A', '48 A', '0.2 A'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'DIVIDED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'I = P ÷ V = 60 ÷ 12 = 5A.'
  },

  {
    id: 3224,
    question: 'Convert 750W to kilowatts.',
    options: ['0.75 kW', '7.5 kW', '75 kW', '0.075 kW'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['units', 'conversion'],
    learningOutcomeId: '202-5A-LO1',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'To convert W to kW, divide by 1000. 750 ÷ 1000 = 0.75kW.'
  },

  {
    id: 3225,
    question: 'A 500W microwave runs for 6 minutes. Calculate energy consumed in kWh.',
    options: ['0.05 kWh', '0.5 kWh', '3 kWh', '0.005 kWh'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application', 'conversion'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'MULTIPLIED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: 'Convert: 500W = 0.5kW, 6 minutes = 0.1 hours. Energy = 0.5 × 0.1 = 0.05kWh.'
  },

  {
    id: 3226,
    question: 'What is the relationship between electrical power and energy?',
    options: [
      'Energy = Power × Time',
      'Power = Energy × Time',
      'Energy = Power ÷ Time',
      'Power = Energy ÷ Current'
    ],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['formula', 'conceptual'],
    learningOutcomeId: '202-5A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'Energy equals power multiplied by time: E = P × t. Power is the rate of energy transfer, so total energy = rate × time.'
  },

  {
    id: 3227,
    question: 'A 100W lamp runs for 10 hours. How much energy is consumed in kWh?',
    options: ['1 kWh', '10 kWh', '0.1 kWh', '100 kWh'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'DIVIDED_INSTEAD',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'Convert 100W to 0.1kW. Energy = 0.1kW × 10h = 1kWh.'
  },

  {
    id: 3228,
    question: 'If a device uses 5kWh in 10 hours, what is its average power?',
    options: ['0.5 kW', '50 kW', '2 kW', '5 kW'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'DIVIDED_INSTEAD',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 50,
    explanation: 'P = E ÷ t = 5kWh ÷ 10h = 0.5kW or 500W.'
  },

  {
    id: 3229,
    question: 'A 3kW electric shower runs for 15 minutes. Calculate the energy used in kWh.',
    options: ['0.75 kWh', '3 kWh', '45 kWh', '0.2 kWh'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application', 'conversion'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'MULTIPLIED_INSTEAD',
      3: 'DIVIDED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: '15 minutes = 0.25 hours. Energy = 3kW × 0.25h = 0.75kWh.'
  },

  {
    id: 3230,
    question: 'Electricity costs 30p per kWh. How much does it cost to run a 2.5kW heater for 4 hours?',
    options: ['£3.00', '£1.50', '£2.50', '£4.50'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: 'Energy = 2.5 × 4 = 10kWh. Cost = 10 × 30p = 300p = £3.00.'
  },

  {
    id: 3231,
    question: 'A resistor has 12V across it and dissipates 24W. Calculate the current through it.',
    options: ['2 A', '12 A', '36 A', '0.5 A'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_I_V_R',
      2: 'ARITHMETIC_ERROR',
      3: 'DIVIDED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'I = P ÷ V = 24 ÷ 12 = 2A.'
  },

  {
    id: 3232,
    question: 'A 9V battery supplies 4.5W to a circuit. What current flows?',
    options: ['0.5 A', '2 A', '13.5 A', '40.5 A'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'MULTIPLIED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 50,
    explanation: 'I = P ÷ V = 4.5 ÷ 9 = 0.5A.'
  },

  {
    id: 3233,
    question: 'What happens to power if both voltage and current are doubled?',
    options: ['Power quadruples', 'Power doubles', 'Power halves', 'Power stays the same'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['conceptual', 'explanation'],
    learningOutcomeId: '202-5A-LO4',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 50,
    explanation: 'P = V × I. If both V and I double, P = (2V) × (2I) = 4VI, so power is multiplied by 4 (quadruples).'
  },

  {
    id: 3234,
    question: 'A lamp rated at 60W operates at 230V. Calculate the operating current.',
    options: ['0.26 A', '2.6 A', '26 A', '190 A'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 50,
    explanation: 'I = P ÷ V = 60 ÷ 230 = 0.26A (approximately).'
  },

  {
    id: 3235,
    question: 'A 1200W toaster operates for 5 minutes daily. How much energy does it use per week in kWh?',
    options: ['0.7 kWh', '7 kWh', '0.07 kWh', '70 kWh'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: '1200W = 1.2kW. 5 minutes = 5/60 hours per day. Daily energy = 1.2 × (5/60) = 0.1kWh. Weekly = 0.1 × 7 = 0.7kWh.'
  },

  {
    id: 3236,
    question: 'An appliance draws 8A from a 230V supply. Calculate the power consumed.',
    options: ['1840 W', '238 W', '222 W', '28.75 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'DIVIDED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'P = V × I = 230 × 8 = 1840W or 1.84kW.'
  },

  {
    id: 3237,
    question: 'Which appliance typically has the highest power rating?',
    options: [
      'Electric shower (8-10kW)',
      'Kettle (2-3kW)',
      'Laptop (50-100W)',
      'LED bulb (5-15W)'
    ],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['application', 'conceptual'],
    learningOutcomeId: '202-5A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'Electric showers have the highest typical power rating (8-10kW) as they must heat water instantly.'
  },

  {
    id: 3238,
    question: 'A device consumes 150W continuously for 24 hours. How much energy in kWh?',
    options: ['3.6 kWh', '36 kWh', '0.36 kWh', '360 kWh'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 50,
    explanation: '150W = 0.15kW. Energy = 0.15 × 24 = 3.6kWh.'
  },

  {
    id: 3239,
    question: 'Convert 5000W to kilowatts.',
    options: ['5 kW', '50 kW', '0.5 kW', '500 kW'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['units', 'conversion'],
    learningOutcomeId: '202-5A-LO1',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 25,
    explanation: '5000W ÷ 1000 = 5kW.'
  },

  // ============================================
  // HARD QUESTIONS (10 questions: 3240-3249)
  // ============================================

  {
    id: 3240,
    question: 'A resistor with resistance 10Ω has a current of 3A through it. Calculate the power dissipated using P = I²R.',
    options: ['90 W', '30 W', '300 W', '13 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'FORMULA_NOT_REARRANGED',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 70,
    explanation: 'P = I²R = 3² × 10 = 9 × 10 = 90W. Remember to square the current first.'
  },

  {
    id: 3241,
    question: 'A 24V supply is connected across a 6Ω resistor. Calculate power using P = V²/R.',
    options: ['96 W', '144 W', '4 W', '576 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'FORMULA_NOT_REARRANGED',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 70,
    explanation: 'P = V²/R = 24²/6 = 576/6 = 96W.'
  },

  {
    id: 3242,
    question: 'Three appliances run simultaneously: 3kW kettle for 5min, 2kW heater for 30min, and 100W TV for 2 hours. Calculate total energy consumed in kWh.',
    options: ['1.45 kWh', '5.45 kWh', '14.5 kWh', '0.45 kWh'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: 'Kettle: 3×(5/60) = 0.25kWh. Heater: 2×0.5 = 1kWh. TV: 0.1×2 = 0.2kWh. Total = 0.25+1+0.2 = 1.45kWh.'
  },

  {
    id: 3243,
    question: 'A heating element has 48V across it and dissipates 192W. Calculate its resistance.',
    options: ['12 Ω', '4 Ω', '0.25 Ω', '9216 Ω'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'formula'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'FORMULA_NOT_REARRANGED',
      2: 'FORMULA_NOT_REARRANGED',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 80,
    explanation: 'From P = V²/R, rearrange to R = V²/P. R = 48²/192 = 2304/192 = 12Ω. Alternatively: find I = P/V = 4A, then R = V/I = 12Ω.'
  },

  {
    id: 3244,
    question: 'A motor operates at 85% efficiency. If the input power is 500W, what is the useful output power?',
    options: ['425 W', '500 W', '585 W', '75 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'ARITHMETIC_ERROR',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 70,
    explanation: 'Output power = Input × Efficiency = 500 × 0.85 = 425W. The remaining 75W is wasted as heat.'
  },

  {
    id: 3245,
    question: 'If voltage across a resistor is halved while resistance stays constant, how does power change?',
    options: [
      'Power becomes one quarter',
      'Power halves',
      'Power doubles',
      'Power quadruples'
    ],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['conceptual', 'explanation'],
    learningOutcomeId: '202-5A-LO4',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 60,
    explanation: 'P = V²/R. If V is halved: P_new = (V/2)²/R = V²/(4R) = P_old/4. Power is proportional to voltage squared.'
  },

  {
    id: 3246,
    question: 'A 230V washing machine draws 6A during the heating cycle. The cycle lasts 45 minutes. Calculate the energy consumed in kWh.',
    options: ['1.035 kWh', '10.35 kWh', '0.103 kWh', '103.5 kWh'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: 'Power = 230 × 6 = 1380W = 1.38kW. Time = 45 minutes = 0.75 hours. Energy = 1.38 × 0.75 = 1.035kWh.'
  },

  {
    id: 3247,
    question: 'A 5Ω resistor and a 20Ω resistor are connected in parallel across a 12V supply. Calculate the total power dissipated.',
    options: ['36 W', '28.8 W', '7.2 W', '25 W'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'USED_SERIES_RULE',
      2: 'ARITHMETIC_ERROR',
      3: 'USED_SERIES_RULE'
    },
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 100,
    explanation: 'In parallel, voltage across each resistor is 12V. P1 = V²/R1 = 144/5 = 28.8W. P2 = V²/R2 = 144/20 = 7.2W. Total = 28.8 + 7.2 = 36W. Alternatively: R_parallel = 4Ω, so P = V²/R = 144/4 = 36W.'
  },

  {
    id: 3248,
    question: 'Electricity costs 28p per kWh. A household uses an average of 12kWh per day. What is the monthly cost (30 days)?',
    options: ['£100.80', '£10.08', '£1008', '£336'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'DIVIDED_INSTEAD'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 80,
    explanation: 'Monthly energy = 12 × 30 = 360kWh. Cost = 360 × 28p = 10080p = £100.80.'
  },

  {
    id: 3249,
    question: 'A 2.2kW electric fire runs for 3.5 hours. At 32p per kWh, calculate the running cost.',
    options: ['£2.46', '£24.60', '£0.25', '£7.04'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Power & Energy',
    tags: ['calculation', 'application'],
    learningOutcomeId: '202-5A-LO3',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'ARITHMETIC_ERROR'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 70,
    explanation: 'Energy = 2.2 × 3.5 = 7.7kWh. Cost = 7.7 × 32p = 246.4p = £2.46 (approximately).'
  }
];

