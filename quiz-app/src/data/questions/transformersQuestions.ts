import { TaggedQuestion } from './types';

/**
 * Transformers Question Bank
 * Aligned with lesson 202-7D learning outcomes
 * Covers mutual induction, step-up/down transformers, and basic transformer principles
 */

export const transformersQuestions: TaggedQuestion[] = [
  // ===== EASY QUESTIONS (Difficulty 1-2) - 15 questions =====
  // Discrimination & Basic Concepts
  
  {
    id: 3700,
    question: "What are the three main parts of a basic transformer?",
    options: [
      "Primary coil, secondary coil, and soft iron core",
      "Battery, resistor, and switch",
      "Ammeter, voltmeter, and wire",
      "Commutator, brushes, and slip rings"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      3: 'CONFUSED_AC_DC_GENERATOR_PARTS'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'discrimination', 'conceptual', 'generator-components'],
    learningOutcomeId: "202-7D-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "A transformer consists of a primary coil (input), secondary coil (output), and a soft iron core that links the magnetic field between them."
  },

  {
    id: 3701,
    question: "Which coil in a transformer is connected to the AC supply?",
    options: [
      "The primary coil",
      "The secondary coil",
      "Both coils equally",
      "Neither coil"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'discrimination', 'conceptual', 'generator-components'],
    learningOutcomeId: "202-7D-LO1",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "The primary coil is connected to the AC supply. It creates the changing magnetic field that induces voltage in the secondary coil."
  },

  {
    id: 3702,
    question: "Will a transformer work with a DC (direct current) supply?",
    options: [
      "No, transformers only work with AC",
      "Yes, transformers work with both AC and DC",
      "Yes, but only step-down transformers",
      "Yes, but only step-up transformers"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_AC_WITH_DC',
      2: 'CONFUSED_TRANSFORMER_WITH_AC_DC',
      3: 'CONFUSED_TRANSFORMER_WITH_AC_DC'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'ac-dc', 'conceptual', 'electromagnetic-induction'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 45,
    explanation: "Transformers ONLY work with AC because they need a changing magnetic field for induction. DC creates a steady field that doesn't induce voltage."
  },

  {
    id: 3703,
    question: "What is mutual induction?",
    options: [
      "When a changing magnetic field in one coil induces voltage in a nearby coil",
      "When two coils are connected by wires",
      "When current flows from primary to secondary",
      "When voltage stays the same in both coils"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_TERMINOLOGY',
      2: 'TOPOLOGY_CONFUSION',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'electromagnetic-induction', 'conceptual', 'terminology'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Mutual induction is when a changing magnetic field in one coil induces a voltage in another nearby coil without direct electrical connection."
  },

  {
    id: 3704,
    question: "Why is soft iron used for the transformer core?",
    options: [
      "It easily magnetizes and concentrates the magnetic field",
      "It conducts electricity better than copper",
      "It is lighter than other metals",
      "It doesn't rust"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_TERMINOLOGY',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'magnetic-field'],
    learningOutcomeId: "202-7D-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Soft iron has high permeability - it easily magnetizes and concentrates magnetic field lines, efficiently linking the primary and secondary coils."
  },

  {
    id: 3705,
    question: "A transformer has 100 turns on the primary and 200 turns on the secondary. Is this step-up or step-down?",
    options: [
      "Step-up (voltage increases)",
      "Step-down (voltage decreases)",
      "Neither (voltage stays same)",
      "It depends on the current"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'CONFUSED_RELATIONSHIP'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'discrimination', 'application', 'calculation'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "More secondary turns than primary = step-up. The secondary has double the turns (200 vs 100), so voltage doubles (steps up)."
  },

  {
    id: 3706,
    question: "A transformer has 400 turns on the primary and 100 turns on the secondary. Is this step-up or step-down?",
    options: [
      "Step-down (voltage decreases)",
      "Step-up (voltage increases)",
      "Neither (voltage stays same)",
      "It depends on the supply voltage"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'CONFUSED_RELATIONSHIP'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'discrimination', 'application', 'calculation'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Fewer secondary turns than primary = step-down. The secondary has 1/4 the turns, so voltage becomes 1/4 (steps down)."
  },

  {
    id: 3707,
    question: "Are the primary and secondary coils electrically connected to each other?",
    options: [
      "No, they are electrically isolated",
      "Yes, they are connected by wire",
      "Yes, through the iron core",
      "Only in step-up transformers"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'CONFUSED_TERMINOLOGY',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'safety', 'electromagnetic-induction'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "The coils are electrically isolated - no direct connection. Energy transfers through the magnetic field in the core, not by electrical connection."
  },

  {
    id: 3708,
    question: "What happens to frequency through a transformer?",
    options: [
      "Frequency stays the same",
      "Frequency increases in step-up transformers",
      "Frequency decreases in step-down transformers",
      "Frequency doubles through any transformer"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_FREQUENCY_WITH_VOLTAGE_RATIO',
      2: 'CONFUSED_FREQUENCY_WITH_VOLTAGE_RATIO',
      3: 'CONFUSED_RELATIONSHIP'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'frequency', 'conceptual'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Frequency does NOT change through a transformer. Only voltage changes. If 50 Hz goes in, 50 Hz comes out."
  },

  {
    id: 3709,
    question: "Which type of transformer increases voltage?",
    options: [
      "Step-up transformer",
      "Step-down transformer",
      "Isolation transformer",
      "All transformers increase voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'discrimination', 'terminology'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: "A step-up transformer increases (steps up) voltage. It has more turns on the secondary than the primary."
  },

  {
    id: 3710,
    question: "A phone charger uses a transformer to reduce 230V mains to 5V. What type of transformer is this?",
    options: [
      "Step-down transformer",
      "Step-up transformer",
      "Isolation transformer",
      "Power transformer"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'application', 'real-world', 'discrimination'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Reducing voltage from 230V to 5V requires a step-down transformer (fewer secondary turns than primary)."
  },

  {
    id: 3711,
    question: "In the UK National Grid, transformers increase voltage from 25kV to 400kV for transmission. What type are these?",
    options: [
      "Step-up transformers",
      "Step-down transformers",
      "Isolation transformers",
      "Distribution transformers"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'application', 'real-world', 'discrimination'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Increasing voltage from 25kV to 400kV requires step-up transformers. High voltage transmission reduces current losses."
  },

  {
    id: 3712,
    question: "If a step-up transformer increases voltage, what happens to current (assuming no losses)?",
    options: [
      "Current decreases",
      "Current increases",
      "Current stays the same",
      "Current becomes zero"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_RELATIONSHIP',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'application'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Transformers conserve power (ignoring losses). If voltage increases, current must decrease to keep power constant: P = V × I."
  },

  {
    id: 3713,
    question: "What creates the changing magnetic field in a transformer?",
    options: [
      "AC current in the primary coil",
      "DC current in the primary coil",
      "The iron core",
      "The secondary coil"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_AC_WITH_DC',
      2: 'CONFUSED_TERMINOLOGY',
      3: 'TOPOLOGY_CONFUSION'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'electromagnetic-induction', 'conceptual', 'ac-principle'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "The changing AC current in the primary coil creates a changing magnetic field. This changing field induces voltage in the secondary."
  },

  {
    id: 3714,
    question: "If the primary and secondary have equal numbers of turns, what happens to voltage?",
    options: [
      "Voltage stays the same",
      "Voltage doubles",
      "Voltage halves",
      "Voltage becomes zero"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'conceptual'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Equal turns means 1:1 ratio, so voltage stays the same. This is called an isolation transformer (used for safety)."
  },

  // ===== MEDIUM QUESTIONS (Difficulty 2-3) - 25 questions =====

  {
    id: 3715,
    question: "Why is AC essential for transformer operation?",
    options: [
      "AC creates a constantly changing magnetic field needed for induction",
      "AC is safer than DC",
      "AC has higher voltage than DC",
      "AC flows faster through the coils"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_AC_WITH_DC',
      2: 'CONFUSED_VOLTAGE_WITH_POWER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'explanation', 'conceptual', 'ac-principle', 'electromagnetic-induction'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "AC constantly changes direction and magnitude, creating a constantly changing magnetic field. This changing field is essential for inducing voltage in the secondary coil."
  },

  {
    id: 3716,
    question: "A transformer has 500 primary turns and 100 secondary turns. If the primary voltage is 230V, what is the secondary voltage?",
    options: [
      "46V",
      "1150V",
      "130V",
      "230V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'ARITHMETIC_ERROR',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "Turns ratio = 100/500 = 1/5 or 0.2. Secondary voltage = 230V × 0.2 = 46V. Fewer secondary turns means step-down."
  },

  {
    id: 3717,
    question: "A step-up transformer has 200 primary turns and 1000 secondary turns. Primary voltage is 50V. What is the secondary voltage?",
    options: [
      "250V",
      "10V",
      "50V",
      "1000V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "Turns ratio = 1000/200 = 5. Secondary voltage = 50V × 5 = 250V. More secondary turns means voltage steps up."
  },

  {
    id: 3718,
    question: "What happens when DC is applied to a transformer's primary coil?",
    options: [
      "A voltage is induced only at switch-on and switch-off, but not during steady DC flow",
      "A steady DC voltage appears on the secondary",
      "The transformer works normally",
      "The transformer voltage increases"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_AC_WITH_DC',
      2: 'CONFUSED_TRANSFORMER_WITH_AC_DC',
      3: 'CONFUSED_RELATIONSHIP'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'ac-dc', 'electromagnetic-induction'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "DC creates a steady magnetic field. Only when DC is switched on or off does the field change briefly, inducing a voltage pulse. During steady DC flow, no induction occurs."
  },

  {
    id: 3719,
    question: "How does the iron core help in transformer operation?",
    options: [
      "It concentrates and links the magnetic field from primary to secondary",
      "It conducts current from primary to secondary",
      "It increases the voltage automatically",
      "It converts AC to DC"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'CONFUSED_TERMINOLOGY',
      3: 'CONFUSED_TRANSFORMER_WITH_RECTIFIER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'explanation', 'conceptual', 'magnetic-field'],
    learningOutcomeId: "202-7D-LO1",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "The soft iron core concentrates magnetic field lines and provides an efficient path for the field from primary to secondary, improving energy transfer."
  },

  {
    id: 3720,
    question: "A transformer reduces 230V to 12V. What is the approximate turns ratio (secondary:primary)?",
    options: [
      "About 1:19 (or 0.052)",
      "About 19:1 (or 19)",
      "About 1:1 (or 1)",
      "About 1:2 (or 0.5)"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "Secondary voltage / Primary voltage = 12/230 ≈ 0.052 or about 1:19. The secondary has about 1/19th the turns of the primary."
  },

  {
    id: 3721,
    question: "In a transformer, energy is transferred from primary to secondary through:",
    options: [
      "The magnetic field in the iron core",
      "Direct electrical connection",
      "Radio waves",
      "Heat conduction"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'OTHER',
      3: 'CONFUSED_TERMINOLOGY'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'electromagnetic-induction', 'explanation'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "Energy transfers through the magnetic field in the core via mutual induction. There's no direct electrical connection between primary and secondary."
  },

  {
    id: 3722,
    question: "Why do we step UP voltage for long-distance power transmission?",
    options: [
      "Higher voltage means lower current, reducing power losses in cables",
      "Higher voltage is safer for transmission",
      "Higher voltage makes the power travel faster",
      "Higher voltage is easier to generate"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_VOLTAGE_WITH_POWER',
      2: 'OTHER',
      3: 'CONFUSED_RELATIONSHIP'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'application', 'real-world', 'explanation'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "For constant power (P=V×I), increasing voltage decreases current. Lower current means less power loss (P=I²R) in transmission cables."
  },

  {
    id: 3723,
    question: "A transformer has a turns ratio of 1:5 (primary:secondary). If 20V is applied to primary, what is secondary voltage?",
    options: [
      "100V",
      "4V",
      "20V",
      "25V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "1:5 ratio means secondary has 5 times more turns than primary. Voltage also multiplies by 5: 20V × 5 = 100V."
  },

  {
    id: 3724,
    question: "What would happen if you wound the secondary coil backwards (opposite direction to primary)?",
    options: [
      "The secondary voltage would be inverted (180° phase shift)",
      "The transformer wouldn't work at all",
      "The voltage would be doubled",
      "Nothing different would happen"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_TERMINOLOGY',
      2: 'WRONG_REASON',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'advanced', 'conceptual'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "Reversing the secondary winding direction inverts the output voltage (180° phase shift), but the transformer still works. The voltage magnitude stays the same."
  },

  {
    id: 3725,
    question: "A transformer primary takes 2A at 120V. If the secondary gives 240V (ignoring losses), what is the secondary current?",
    options: [
      "1A",
      "2A",
      "4A",
      "0.5A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_RELATIONSHIP',
      3: 'INVERSE_WRONG'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application', 'advanced'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "Power in = Power out. Primary: 120V × 2A = 240W. Secondary: 240V × I = 240W, so I = 240W/240V = 1A. Voltage doubled, current halved."
  },

  {
    id: 3726,
    question: "Which statement about transformer coils is TRUE?",
    options: [
      "They are magnetically linked but electrically isolated",
      "They are both magnetically and electrically linked",
      "They are neither magnetically nor electrically linked",
      "They are electrically linked but magnetically isolated"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'TOPOLOGY_CONFUSION',
      2: 'CONFUSED_TERMINOLOGY',
      3: 'INVERSE_WRONG'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'explanation', 'electromagnetic-induction'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "The coils share the magnetic field (magnetically linked) but have no wire connection between them (electrically isolated). This is the principle of mutual induction."
  },

  {
    id: 3727,
    question: "A step-down transformer reduces 400V to 100V. What is the turns ratio (secondary:primary)?",
    options: [
      "1:4 or 0.25",
      "4:1 or 4",
      "1:1 or 1",
      "2:1 or 2"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "Voltage ratio = turns ratio. 100V/400V = 0.25 or 1:4. Secondary has 1/4 the turns of primary, giving 1/4 the voltage."
  },

  {
    id: 3728,
    question: "If a transformer is 100% efficient and the primary power is 500W, what is the secondary power?",
    options: [
      "500W",
      "1000W",
      "250W",
      "It depends on the turns ratio"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_RELATIONSHIP',
      2: 'ARITHMETIC_ERROR',
      3: 'WRONG_REASON'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'calculation'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "An ideal transformer doesn't create or destroy energy. Power in = Power out = 500W. Turns ratio affects voltage/current split, not total power."
  },

  {
    id: 3729,
    question: "Why can't a transformer create more power out than power in?",
    options: [
      "It would violate the law of conservation of energy",
      "The wire resistance is too high",
      "The magnetic field is too weak",
      "The frequency is too low"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_VOLTAGE_WITH_POWER',
      2: 'CONFUSED_TERMINOLOGY',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'explanation'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "Conservation of energy means you can't create energy. Transformers can change voltage, but power out cannot exceed power in (minus losses)."
  },

  {
    id: 3730,
    question: "A transformer primary has 800 turns. To get a 1:4 step-down, how many secondary turns are needed?",
    options: [
      "200 turns",
      "3200 turns",
      "800 turns",
      "400 turns"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "1:4 step-down means secondary:primary = 1:4, so secondary = 800/4 = 200 turns. Fewer secondary turns gives lower voltage."
  },

  {
    id: 3731,
    question: "What would happen if the iron core was removed from a transformer?",
    options: [
      "The transformer would still work but very inefficiently",
      "The transformer would work better",
      "The transformer would not work at all",
      "The transformer would produce DC instead of AC"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'WRONG_REASON',
      2: 'CONFUSED_TERMINOLOGY',
      3: 'CONFUSED_TRANSFORMER_WITH_RECTIFIER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'explanation', 'magnetic-field'],
    learningOutcomeId: "202-7D-LO1",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "Without the core, the magnetic field would spread out in air (low permeability). The transformer would work but very inefficiently due to poor magnetic coupling."
  },

  {
    id: 3732,
    question: "Transformers in the National Grid reduce 400kV to 11kV for local distribution. What is the approximate turns ratio?",
    options: [
      "About 1:36 step-down",
      "About 36:1 step-up",
      "About 1:1 isolation",
      "About 1:400 step-down"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'application', 'real-world', 'calculation'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "11kV/400kV ≈ 0.0275 or about 1:36. The secondary needs about 1/36th the turns of the primary to step down from 400kV to 11kV."
  },

  {
    id: 3733,
    question: "Which is NOT a practical use of step-down transformers?",
    options: [
      "Increasing voltage for power transmission lines",
      "Phone chargers (230V to 5V)",
      "Doorbell transformers (230V to 12V)",
      "Power supplies for electronics"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'application', 'real-world', 'discrimination'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: "Increasing voltage requires STEP-UP transformers. All other options involve reducing voltage, which requires step-down transformers."
  },

  {
    id: 3734,
    question: "At what moment does a transformer induce the maximum voltage in the secondary?",
    options: [
      "When the primary current is changing most rapidly",
      "When the primary current is at maximum",
      "When the primary current is zero",
      "When the primary voltage is at maximum"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_RELATIONSHIP',
      2: 'CONFUSED_RELATIONSHIP',
      3: 'WRONG_REASON'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'advanced', 'conceptual', 'electromagnetic-induction'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 75,
    explanation: "Induced voltage depends on RATE OF CHANGE of magnetic field. Maximum induced voltage occurs when current (and thus field) is changing most rapidly."
  },

  {
    id: 3735,
    question: "A transformer steps 230V down to 12V. If secondary current is 5A, what is the approximate primary current (ignoring losses)?",
    options: [
      "About 0.26A",
      "About 5A",
      "About 96A",
      "About 10A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'OTHER',
      2: 'INVERSE_WRONG',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application', 'advanced'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 120,
    explanation: "Power in = Power out. Secondary: 12V × 5A = 60W. Primary: 230V × I = 60W, so I = 60/230 ≈ 0.26A. Higher voltage = lower current."
  },

  {
    id: 3736,
    question: "If a transformer's primary coil has 1000 turns and you want the secondary voltage to be 1/5 of the primary voltage, how many secondary turns do you need?",
    options: [
      "200 turns",
      "5000 turns",
      "1000 turns",
      "500 turns"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "For 1/5 voltage, you need 1/5 the turns: 1000 ÷ 5 = 200 turns on the secondary."
  },

  {
    id: 3737,
    question: "Transformers are more efficient at transferring power than direct cable connections over long distances because:",
    options: [
      "They allow voltage to be stepped up, reducing current and resistive losses",
      "They convert AC to DC which has lower losses",
      "They amplify the power",
      "They eliminate all resistance in the cables"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_TRANSFORMER_WITH_RECTIFIER',
      2: 'CONFUSED_VOLTAGE_WITH_POWER',
      3: 'WRONG_REASON'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'explanation', 'application', 'real-world'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 75,
    explanation: "High voltage transmission reduces current for the same power. Since power loss = I²R, lower current dramatically reduces losses in cables."
  },

  {
    id: 3738,
    question: "What type of material is a transformer core typically made from?",
    options: [
      "Soft iron (easily magnetized and demagnetized)",
      "Permanent magnet material",
      "Copper (high conductivity)",
      "Plastic (insulator)"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_TERMINOLOGY',
      2: 'CONFUSED_TERMINOLOGY',
      3: 'WRONG_REASON'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'conceptual', 'magnetic-field'],
    learningOutcomeId: "202-7D-LO1",
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Soft iron is used because it easily magnetizes when current flows and quickly demagnetizes when current changes. This is ideal for AC transformers."
  },

  {
    id: 3739,
    question: "A transformer has 300 primary turns and 900 secondary turns. Primary voltage is 110V. What is the secondary voltage?",
    options: [
      "330V",
      "36.7V",
      "110V",
      "990V"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 90,
    explanation: "Turns ratio = 900/300 = 3. Secondary voltage = 110V × 3 = 330V. Triple the turns gives triple the voltage (step-up)."
  },

  // ===== HARD QUESTIONS (Difficulty 4-5) - 10 questions =====

  {
    id: 3740,
    question: "A transformer operates at 50Hz with 230V input. If the primary has 2000 turns, approximately how many turns are needed on the secondary for a 12V output?",
    options: [
      "About 104 turns",
      "About 19167 turns",
      "About 2000 turns",
      "About 500 turns"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application', 'advanced'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 120,
    explanation: "Turns ratio = voltage ratio. 12V/230V ≈ 0.052. Secondary turns = 2000 × 0.052 ≈ 104 turns. Note: frequency doesn't affect the turns calculation."
  },

  {
    id: 3741,
    question: "In a real transformer, the secondary voltage under load is slightly less than predicted by the turns ratio. Why?",
    options: [
      "Resistance in the windings causes voltage drops, and the core has losses",
      "The turns ratio formula is incorrect",
      "AC frequency reduces the voltage",
      "Mutual induction is not perfect"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'FORMULA_WRONG',
      2: 'CONFUSED_FREQUENCY_WITH_VOLTAGE_RATIO',
      3: 'WRONG_REASON'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'advanced', 'conceptual', 'real-world'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Real transformers have wire resistance (causing I²R losses) and core losses (eddy currents and hysteresis). These reduce efficiency and cause voltage drop under load."
  },

  {
    id: 3742,
    question: "A 2:1 step-down transformer supplies 10A at 120V. What is the primary current (ignoring losses)?",
    options: [
      "5A",
      "10A",
      "20A",
      "2.5A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'OTHER',
      2: 'INVERSE_WRONG',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application', 'advanced'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 120,
    explanation: "2:1 step-down means primary is 240V. Power: 120V × 10A = 1200W. Primary current: 1200W ÷ 240V = 5A. Voltage doubled = current halved."
  },

  {
    id: 3743,
    question: "Why are transformer cores made of thin laminated sheets rather than solid iron?",
    options: [
      "To reduce eddy current losses in the core",
      "To make them lighter",
      "To increase magnetic field strength",
      "To reduce manufacturing costs"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'WRONG_REASON',
      2: 'CONFUSED_TERMINOLOGY',
      3: 'OTHER'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'advanced', 'conceptual', 'explanation'],
    learningOutcomeId: "202-7D-LO1",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 75,
    explanation: "Laminated sheets with insulation between them break up current paths, reducing eddy currents (circular currents induced in the core that waste energy as heat)."
  },

  {
    id: 3744,
    question: "A transformer has a 10:1 step-up ratio. If 1A flows in the primary, what is the ideal secondary current (assuming 100% efficiency)?",
    options: [
      "0.1A",
      "1A",
      "10A",
      "100A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'OTHER',
      2: 'INVERSE_WRONG',
      3: 'MULTIPLIED_INSTEAD'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application', 'advanced'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: "10:1 step-up means voltage multiplies by 10. For constant power, current divides by 10: 1A ÷ 10 = 0.1A. High voltage = low current."
  },

  {
    id: 3745,
    question: "A power station generates 25kV which is stepped up to 400kV for transmission. If the transmission line carries 1000A, what was the approximate generator output current?",
    options: [
      "16000A",
      "1000A",
      "62.5A",
      "25000A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'OTHER',
      2: 'INVERSE_WRONG',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application', 'real-world', 'advanced'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: "Transmission power: 400kV × 1000A = 400MW. Generator: 400MW ÷ 25kV = 16000A. Voltage stepped up 16x, so current steps down 16x."
  },

  {
    id: 3746,
    question: "If a transformer's efficiency is 95%, and the output power is 950W, what is the input power?",
    options: [
      "1000W",
      "950W",
      "902.5W",
      "1050W"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_RELATIONSHIP',
      2: 'ARITHMETIC_ERROR',
      3: 'FORMULA_WRONG'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'advanced', 'efficiency'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 120,
    explanation: "Efficiency = Output/Input × 100%. So 95% = 950W/Input × 100%, therefore Input = 950W/0.95 = 1000W. 50W is lost as heat."
  },

  {
    id: 3747,
    question: "What would be the effect of using a higher frequency AC supply (e.g., 400Hz instead of 50Hz) in a transformer of fixed design?",
    options: [
      "Better coupling and possibly smaller core needed for same power",
      "Lower voltage output",
      "Higher current losses",
      "The transformer would not work at all"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_FREQUENCY_WITH_VOLTAGE',
      2: 'WRONG_REASON',
      3: 'CONFUSED_RELATIONSHIP'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'advanced', 'conceptual', 'frequency'],
    learningOutcomeId: "202-7D-LO2",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 90,
    explanation: "Higher frequency means faster magnetic field changes, improving induction. Aircraft use 400Hz transformers - they can be smaller and lighter for the same power."
  },

  {
    id: 3748,
    question: "In a step-down transformer reducing 230V to 12V with 10A output, approximately how much current flows in the primary (assuming 90% efficiency)?",
    options: [
      "About 0.58A",
      "About 0.52A",
      "About 10A",
      "About 192A"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'CONFUSED_RELATIONSHIP',
      2: 'INVERSE_WRONG',
      3: 'ARITHMETIC_ERROR'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'calculation', 'application', 'advanced', 'efficiency'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: "Output power: 12V × 10A = 120W. Input power: 120W/0.9 = 133.3W. Primary current: 133.3W ÷ 230V ≈ 0.58A. Efficiency reduces output power."
  },

  {
    id: 3749,
    question: "A transformer is rated 230V to 12V, 2A. If you try to draw 5A from the secondary, what is likely to happen?",
    options: [
      "The transformer overheats due to excessive current, possibly burning out",
      "The voltage automatically increases to compensate",
      "The transformer works normally but less efficiently",
      "The primary fuse blows but the transformer is undamaged"
    ],
    correctAnswer: 0,
    misconceptionCodes: {
      1: 'WRONG_DIAGNOSIS',
      2: 'CONFUSED_RELATIONSHIP',
      3: 'WRONG_REASON'
    },
    section: "Science 2365 Level 2",
    category: "Transformers",
    tags: ['transformers', 'application', 'real-world', 'safety', 'advanced'],
    learningOutcomeId: "202-7D-LO3",
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 90,
    explanation: "Exceeding the rated current (2A) by drawing 5A causes excessive I²R heating in the windings. The transformer will overheat and can burn out if protection doesn't operate."
  }
];
