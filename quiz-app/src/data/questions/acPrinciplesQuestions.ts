import { TaggedQuestion } from './types';

/**
 * AC Principles Question Bank
 * Aligned with lesson 202-7A learning outcomes
 * 
 * Distribution:
 * - Easy (15): 3300-3314
 * - Medium (25): 3315-3339
 * - Hard (10): 3340-3349
 * 
 * Types:
 * - Discrimination (10, 20%): Identifying AC vs DC
 * - Conceptual (20, 40%): Understanding frequency, AC principles
 * - Application (10, 20%): Real-world scenarios
 * - Calculation (10, 20%): Frequency and time calculations
 */

export const acPrinciplesQuestions: TaggedQuestion[] = [
  // ============================================
  // EASY QUESTIONS (15 questions: 3300-3314)
  // ============================================

  // Easy - Basic AC/DC Discrimination
  {
    id: 3300,
    question: 'What type of current flows from a battery?',
    options: ['Direct Current (DC)', 'Alternating Current (AC)', 'Both AC and DC', 'Neither AC nor DC'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_AC_DC_SOURCES',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Batteries supply Direct Current (DC), which flows in one direction only from positive to negative terminal.'
  },

  {
    id: 3301,
    question: 'What type of current is supplied by UK mains wall sockets?',
    options: ['Alternating Current (AC)', 'Direct Current (DC)', 'Both AC and DC', 'Pulsed DC'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'discrimination', 'conceptual', 'uk-mains'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_AC_DC_SOURCES',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'UK mains supply provides Alternating Current (AC) at 230V, 50Hz.'
  },

  {
    id: 3302,
    question: 'What does "DC" stand for?',
    options: ['Direct Current', 'Dual Current', 'Dynamic Current', 'Digital Current'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 15,
    explanation: 'DC stands for Direct Current, meaning current that flows in one direction continuously.'
  },

  {
    id: 3303,
    question: 'What does "AC" stand for?',
    options: ['Alternating Current', 'Automatic Current', 'Active Current', 'Amplified Current'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 15,
    explanation: 'AC stands for Alternating Current, meaning current that periodically reverses direction.'
  },

  {
    id: 3304,
    question: 'What is the nominal voltage of UK mains supply?',
    options: ['230 V', '110 V', '12 V', '415 V'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['uk-mains', 'conceptual', 'discrimination'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_INTERNATIONAL_VOLTAGE',
      2: 'CONFUSED_WITH_LOW_VOLTAGE',
      3: 'CONFUSED_WITH_THREE_PHASE'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'UK mains supply is nominally 230V AC. (The USA uses 110V, while 415V is three-phase supply.)'
  },

  {
    id: 3305,
    question: 'What is the frequency of UK mains supply?',
    options: ['50 Hz', '60 Hz', '100 Hz', '25 Hz'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'uk-mains', 'conceptual'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_INTERNATIONAL_FREQUENCY',
      2: 'DOUBLED_FREQUENCY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'UK mains supply has a frequency of 50 Hz (50 cycles per second). The USA and some other countries use 60 Hz.'
  },

  {
    id: 3306,
    question: 'What does the frequency of an AC supply measure?',
    options: ['Number of cycles per second', 'Voltage level', 'Current flow rate', 'Power consumption'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'conceptual'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_FREQUENCY_WITH_VOLTAGE',
      2: 'CONFUSED_FREQUENCY_WITH_CURRENT',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'Frequency measures how many complete cycles occur each second in an AC waveform.'
  },

  {
    id: 3307,
    question: 'What is the SI unit for frequency?',
    options: ['Hertz (Hz)', 'Watts (W)', 'Volts (V)', 'Seconds (s)'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'units', 'conceptual'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_FREQUENCY_UNIT',
      2: 'CONFUSED_FREQUENCY_UNIT',
      3: 'CONFUSED_FREQUENCY_UNIT'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Frequency is measured in hertz (Hz). One hertz equals one cycle per second.'
  },

  {
    id: 3308,
    question: 'How does current flow in a DC circuit?',
    options: ['In one direction only', 'Alternating back and forth', 'In pulses', 'Randomly'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_DC_WITH_AC',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Direct Current (DC) flows continuously in one direction, from positive to negative.'
  },

  {
    id: 3309,
    question: 'How does current flow in an AC circuit?',
    options: ['It alternates direction periodically', 'In one direction only', 'It stops and starts', 'In multiple directions at once'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_AC_WITH_DC',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'Alternating Current (AC) periodically reverses direction, flowing forward then backward in a repeating cycle.'
  },

  {
    id: 3310,
    question: 'What does 1 Hz mean?',
    options: ['1 cycle per second', '1 volt per second', '1 amp per second', '1 watt per second'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'units', 'conceptual'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_FREQUENCY_UNIT',
      2: 'CONFUSED_FREQUENCY_UNIT',
      3: 'CONFUSED_FREQUENCY_UNIT'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'One hertz (1 Hz) means one complete cycle per second.'
  },

  {
    id: 3311,
    question: 'Which of these devices supplies DC?',
    options: ['A car battery', 'A wall socket', 'A power station generator', 'A transformer'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'discrimination', 'application'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_AC_DC_SOURCES',
      2: 'CONFUSED_AC_DC_SOURCES',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'Car batteries supply DC (Direct Current). Wall sockets supply AC, and generators/transformers work with AC.'
  },

  {
    id: 3312,
    question: 'Which of these is a characteristic of AC?',
    options: ['Current reverses direction', 'Current flows in one direction only', 'Voltage is always constant', 'Frequency is always zero'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_AC_WITH_DC',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'The defining characteristic of AC is that the current periodically reverses direction.'
  },

  {
    id: 3313,
    question: 'What frequency does DC have?',
    options: ['0 Hz (no frequency)', '50 Hz', '60 Hz', '100 Hz'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'frequency', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'ASSIGNED_FREQUENCY_TO_DC',
      2: 'ASSIGNED_FREQUENCY_TO_DC',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'DC does not alternate, so it has no frequency (0 Hz). Frequency only applies to alternating current.'
  },

  {
    id: 3314,
    question: 'In the UK, what color is the live wire in mains wiring?',
    options: ['Brown', 'Blue', 'Green and Yellow', 'Red'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['uk-mains', 'safety', 'discrimination'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_WIRE_COLORS',
      2: 'CONFUSED_WIRE_COLORS',
      3: 'CONFUSED_OLD_WIRE_COLORS'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'The live wire in UK mains wiring is brown. Blue is neutral, and green/yellow is earth.'
  },

  // ============================================
  // MEDIUM QUESTIONS (25 questions: 3315-3339)
  // ============================================

  {
    id: 3315,
    question: 'If UK mains has a frequency of 50 Hz, how many complete cycles occur in 1 second?',
    options: ['50 cycles', '100 cycles', '25 cycles', '1 cycle'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'calculation', 'conceptual'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'DOUBLED_FREQUENCY',
      2: 'HALVED_FREQUENCY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'Hertz means cycles per second, so 50 Hz = 50 complete cycles per second.'
  },

  {
    id: 3316,
    question: 'Why is AC used for mains electricity distribution instead of DC?',
    options: ['AC voltage can be easily transformed to different levels', 'DC is more dangerous', 'AC travels faster through wires', 'DC cannot power appliances'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'conceptual', 'application'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'AC is used because transformers can easily step voltage up (for efficient transmission) or down (for safe use). This is difficult with DC.'
  },

  {
    id: 3317,
    question: 'A device is labeled "230V AC 50Hz". What does this tell you?',
    options: ['It\'s designed for UK mains supply', 'It\'s designed for USA mains supply', 'It requires a battery', 'It supplies power to the mains'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['uk-mains', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_INTERNATIONAL_STANDARDS',
      2: 'CONFUSED_POWER_SUPPLY_VS_LOAD',
      3: 'CONFUSED_POWER_SUPPLY_VS_LOAD'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: '230V AC 50Hz are the characteristics of UK mains supply, so this device is designed for UK use.'
  },

  {
    id: 3318,
    question: 'How many times does the current reverse direction in one complete AC cycle?',
    options: ['2 times (forward and backward)', '1 time', '4 times', '50 times'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_CYCLE_WITH_FREQUENCY'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'In one complete cycle, current flows forward, reaches a peak, reverses to flow backward, reaches a peak in the opposite direction, then returns to start. This is 2 direction changes per cycle.'
  },

  {
    id: 3319,
    question: 'At 50 Hz, how many times per second does the UK mains current reverse direction?',
    options: ['100 times', '50 times', '25 times', '200 times'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'calculation', 'uk-mains'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_FREQUENCY_WITH_REVERSALS',
      2: 'HALVED_FREQUENCY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: '50 Hz means 50 complete cycles per second. Each cycle has 2 reversals, so 50 × 2 = 100 reversals per second.'
  },

  {
    id: 3320,
    question: 'Which type of current would a solar panel produce?',
    options: ['DC', 'AC', 'Both AC and DC', 'Neither'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'discrimination', 'application'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_AC_DC_SOURCES',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'Solar panels produce DC (Direct Current). An inverter is needed to convert it to AC for feeding into the mains grid.'
  },

  {
    id: 3321,
    question: 'What device converts AC to DC?',
    options: ['Rectifier', 'Transformer', 'Inverter', 'Generator'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_TRANSFORMER_WITH_RECTIFIER',
      2: 'CONFUSED_INVERTER_WITH_RECTIFIER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'A rectifier converts AC to DC. (An inverter does the opposite: DC to AC. A transformer changes AC voltage levels.)'
  },

  {
    id: 3322,
    question: 'What device converts DC to AC?',
    options: ['Inverter', 'Rectifier', 'Transformer', 'Resistor'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_INVERTER_WITH_RECTIFIER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'An inverter converts DC to AC. This is used in solar systems and uninterruptible power supplies (UPS).'
  },

  {
    id: 3323,
    question: 'In the UK, what color is the neutral wire?',
    options: ['Blue', 'Brown', 'Green and Yellow', 'Black'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['uk-mains', 'safety', 'discrimination'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_WIRE_COLORS',
      2: 'CONFUSED_WIRE_COLORS',
      3: 'CONFUSED_OLD_WIRE_COLORS'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 25,
    explanation: 'The neutral wire in UK mains is blue. Brown is live, green/yellow is earth.'
  },

  {
    id: 3324,
    question: 'What is the purpose of the earth wire in UK mains wiring?',
    options: ['Safety: provides a path to ground for fault currents', 'Carries the return current', 'Provides the main voltage', 'Reduces energy consumption'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['uk-mains', 'safety', 'conceptual'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_NEUTRAL_WITH_EARTH',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'The earth (green/yellow) wire is a safety feature. It provides a low-resistance path to ground, causing fuses/breakers to trip if there is a fault.'
  },

  {
    id: 3325,
    question: 'If an AC supply has a frequency of 60 Hz, how many cycles occur per second?',
    options: ['60 cycles', '30 cycles', '120 cycles', '1 cycle'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'calculation'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'HALVED_FREQUENCY',
      2: 'DOUBLED_FREQUENCY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'Hertz directly tells you cycles per second. 60 Hz = 60 cycles per second.'
  },

  {
    id: 3326,
    question: 'Which electrical quantity is NOT affected by whether the supply is AC or DC?',
    options: ['Resistance', 'Frequency', 'Polarity', 'Direction of current flow'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'Resistance is a property of the material/component and does not change whether AC or DC is applied. Frequency, polarity, and current direction are all different between AC and DC.'
  },

  {
    id: 3327,
    question: 'A USB charger plugs into 230V AC mains but outputs 5V DC. What has happened?',
    options: ['The voltage has been stepped down and AC converted to DC', 'The voltage has been stepped up', 'Only the voltage has been reduced', 'AC has been converted to higher voltage DC'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'The USB charger contains a transformer (to step down voltage) and a rectifier (to convert AC to DC). Both voltage level and current type have changed.'
  },

  {
    id: 3328,
    question: 'Why might UK electrical equipment not work properly in the USA?',
    options: ['Different voltage (230V vs 110V) and frequency (50Hz vs 60Hz)', 'The plugs are a different shape', 'USA uses DC instead of AC', 'UK equipment uses more power'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['uk-mains', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_AC_DC_INTERNATIONALLY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'UK uses 230V 50Hz, USA uses 110V 60Hz. The different voltage can damage equipment or cause it to underperform. Different frequency affects timing devices and motors.'
  },

  {
    id: 3329,
    question: 'What is the time period of one complete cycle at 50 Hz?',
    options: ['0.02 seconds (20 milliseconds)', '0.01 seconds (10 milliseconds)', '0.05 seconds (50 milliseconds)', '1 second'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'calculation'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'ARITHMETIC_ERROR',
      2: 'ARITHMETIC_ERROR',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'Period = 1 / frequency. At 50 Hz: Period = 1/50 = 0.02 seconds = 20 milliseconds.'
  },

  {
    id: 3330,
    question: 'Which type of current is typically more dangerous to humans at the same voltage?',
    options: ['AC is generally more dangerous', 'DC is more dangerous', 'They are equally dangerous', 'Neither is dangerous'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'safety', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'AC is generally considered more dangerous at the same voltage because it can cause muscles to contract repeatedly, making it harder to let go. Always treat both with extreme caution.'
  },

  {
    id: 3331,
    question: 'What device is used to change AC voltage from one level to another?',
    options: ['Transformer', 'Rectifier', 'Inverter', 'Capacitor'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_TRANSFORMER_WITH_RECTIFIER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'A transformer changes AC voltage levels (steps up or steps down). It only works with AC, not DC.'
  },

  {
    id: 3332,
    question: 'What happens to the frequency of AC when it passes through a transformer?',
    options: ['The frequency stays the same', 'The frequency doubles', 'The frequency is halved', 'The frequency becomes zero'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'A transformer changes voltage but does not change frequency. If 50 Hz AC goes in, 50 Hz AC comes out (at a different voltage).'
  },

  {
    id: 3333,
    question: 'Which of these domestic appliances works on DC after internal conversion?',
    options: ['Laptop computer (via power adapter)', 'Electric heater', 'Incandescent light bulb', 'Toaster'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'Laptops use DC internally. The power adapter (brick) converts 230V AC mains to low-voltage DC. Heaters, bulbs, and toasters work directly on AC.'
  },

  {
    id: 3334,
    question: 'If the UK changed to 60 Hz frequency (keeping 230V), what would be most affected?',
    options: ['Electric clocks and motors', 'Light bulbs', 'Electric heaters', 'Extension cables'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'Frequency affects devices with timing (like clocks) or rotating parts (like motors). Resistive loads like heaters and bulbs are not affected by frequency.'
  },

  {
    id: 3335,
    question: 'What is the main advantage of using high voltage AC for long-distance power transmission?',
    options: ['Reduces energy losses in cables', 'Safer for workers', 'Cheaper cables can be used', 'Faster transmission of electricity'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'High voltage means lower current for the same power (P=VI). Lower current means less I²R losses in the cables. AC makes it easy to step voltage up and down.'
  },

  {
    id: 3336,
    question: 'A power station generates AC at 25,000V. Why is this stepped up to 400,000V for transmission?',
    options: ['To reduce current and minimize transmission losses', 'To make the electricity travel faster', 'Because cables require high voltage', 'To increase the power output'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_VOLTAGE_WITH_POWER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'Stepping up voltage reduces current (for same power). Lower current means lower I²R losses in transmission lines, making transmission more efficient.'
  },

  {
    id: 3337,
    question: 'At what voltage is electricity typically distributed to homes before final transformation?',
    options: ['11 kV or 33 kV', '230 V', '400 kV', '12 V'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['uk-mains', 'application'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_DISTRIBUTION_VOLTAGES',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'Electricity is distributed to neighborhoods at 11kV or 33kV, then local transformers step it down to 230V for homes.'
  },

  {
    id: 3338,
    question: 'Which wire carries the AC voltage in a UK mains supply?',
    options: ['Live (brown)', 'Neutral (blue)', 'Earth (green/yellow)', 'All three equally'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['uk-mains', 'safety', 'conceptual'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_LIVE_NEUTRAL_FUNCTION',
      2: 'CONFUSED_LIVE_NEUTRAL_FUNCTION',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'The live wire (brown) carries the 230V AC. The neutral (blue) is the return path at near 0V. Earth (green/yellow) is a safety connection at 0V.'
  },

  {
    id: 3339,
    question: 'If you measured the UK mains voltage with a voltmeter, what would you typically see?',
    options: ['Between 220V and 240V', 'Exactly 230V', 'Between 110V and 230V', 'Over 400V'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['uk-mains', 'measurement', 'conceptual'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'EXPECTED_EXACT_NOMINAL_VOLTAGE',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: '230V is the nominal (standard) voltage, but actual supply can vary. Typically 220-240V is acceptable. Voltmeters show RMS voltage for AC.'
  },

  // ============================================
  // HARD QUESTIONS (10 questions: 3340-3349)
  // ============================================

  {
    id: 3340,
    question: 'If an AC supply completes 100 cycles in 2 seconds, what is its frequency?',
    options: ['50 Hz', '100 Hz', '200 Hz', '25 Hz'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'calculation'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'DID_NOT_DIVIDE_BY_TIME',
      2: 'MULTIPLIED_INSTEAD',
      3: 'HALVED_FREQUENCY'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 50,
    explanation: 'Frequency = cycles / time = 100 cycles / 2 seconds = 50 Hz (cycles per second).'
  },

  {
    id: 3341,
    question: 'A 60 Hz AC supply powers a motor designed for 50 Hz. What is likely to happen?',
    options: ['Motor will run faster than designed', 'Motor will run slower than designed', 'Motor will not run at all', 'No effect on motor'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_FREQUENCY_EFFECT_ON_MOTORS',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 45,
    explanation: 'AC motor speed is proportional to frequency. 60 Hz instead of 50 Hz (20% increase) will cause the motor to run approximately 20% faster than designed.'
  },

  {
    id: 3342,
    question: 'If a 50 Hz AC supply has a period of 0.02 seconds, what would be the period at 25 Hz?',
    options: ['0.04 seconds', '0.01 seconds', '0.02 seconds', '0.08 seconds'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'calculation'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'HALVED_INSTEAD_OF_DOUBLED',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 50,
    explanation: 'Period = 1 / frequency. At 25 Hz: Period = 1/25 = 0.04 seconds. Lower frequency means longer period (half the frequency = double the period).'
  },

  {
    id: 3343,
    question: 'In one second, how much actual distance do electrons travel in UK mains AC wiring?',
    options: ['Very little - they vibrate back and forth in place', 'About 1 meter', 'About 50 meters (one for each cycle)', 'They travel at the speed of light'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_ELECTRON_DRIFT_WITH_SIGNAL',
      2: 'OTHER',
      3: 'CONFUSED_ELECTRON_SPEED_WITH_LIGHT_SPEED'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 45,
    explanation: 'In AC, electrons don\'t travel far - they vibrate back and forth. Energy is transmitted by the electromagnetic field, not by electrons moving long distances.'
  },

  {
    id: 3344,
    question: 'Why can transformers work with AC but not with DC?',
    options: ['Transformers require changing magnetic fields, which AC provides', 'DC voltage is too low', 'Transformers would overheat with DC', 'DC cannot pass through coils'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 50,
    explanation: 'Transformers work by electromagnetic induction, which requires a changing magnetic field. AC constantly changes, creating this field. DC is steady, so no induction occurs.'
  },

  {
    id: 3345,
    question: 'What is "three-phase" AC supply, commonly used in commercial and industrial settings?',
    options: ['Three separate AC supplies with phase differences, typically 415V', 'AC at three different frequencies', 'Three wires carrying DC', 'AC that alternates between three voltages'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 50,
    explanation: 'Three-phase supply consists of three AC voltages of the same frequency, offset by 120 degrees. It provides more efficient power for large motors and equipment. Voltage between phases is typically 415V in the UK.'
  },

  {
    id: 3346,
    question: 'A 12V battery can deliver 12V continuously. A "12V AC" supply delivers 12V... ',
    options: ['On average (RMS), with peaks higher than 12V', 'Continuously like DC', 'At peaks only, with average voltage lower', 'Only when devices are connected'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_DC',
      2: 'CONFUSED_RMS_WITH_PEAK',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 55,
    explanation: 'AC voltage ratings are RMS (Root Mean Square) values, representing an average. AC with 12V RMS has peaks of about 17V. This delivers equivalent power to 12V DC.'
  },

  {
    id: 3347,
    question: 'Which property of AC allows it to be transmitted over very long distances more efficiently than DC?',
    options: ['AC can be easily transformed to very high voltages, reducing current and losses', 'AC travels faster through wires', 'AC requires thinner cables', 'AC has less resistance'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_RESISTANCE_WITH_AC_DC'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 50,
    explanation: 'AC can be easily stepped up to very high voltages using transformers. Higher voltage = lower current for same power. Power loss = I²R, so lower current dramatically reduces losses over long distances.'
  },

  {
    id: 3348,
    question: 'Modern High-Voltage DC (HVDC) transmission is now sometimes preferred over AC for very long distances. Why?',
    options: ['DC has no reactive losses or skin effect at very high voltages', 'DC is cheaper to generate', 'DC transformers are more efficient', 'DC is safer than AC'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['ac-dc', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_TRANSFORMER_WITH_AC_DC',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 60,
    explanation: 'At very long distances (undersea cables, continental transmission), HVDC can be more efficient because it avoids AC-specific losses like reactive power and skin effect. However, DC voltage transformation is more complex and expensive.'
  },

  {
    id: 3349,
    question: 'If UK mains frequency changed from 50 Hz to 100 Hz (keeping 230V), what would happen to transformers designed for 50 Hz?',
    options: ['They would work but might saturate differently or have efficiency changes', 'They would not work at all', 'They would work exactly the same', 'They would produce double the voltage'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Principles',
    tags: ['frequency', 'application', 'conceptual'],
    learningOutcomeId: '202-7A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_FREQUENCY_WITH_VOLTAGE_RATIO'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 60,
    explanation: 'Transformer design depends on frequency. Higher frequency affects core saturation, eddy current losses, and efficiency. 50 Hz transformers would technically work at 100 Hz but with different characteristics and potentially reduced efficiency.'
  },
];

