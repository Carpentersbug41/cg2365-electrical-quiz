import { TaggedQuestion } from './types';

/**
 * Magnetism & Electromagnetism Question Bank
 * Aligned with lesson 202-6A learning outcomes
 * 
 * Distribution:
 * - Easy (15): 3250-3264
 * - Medium (25): 3265-3289
 * - Hard (10): 3290-3299
 * 
 * Types:
 * - Conceptual (15, 30%): Understanding magnetism, electromagnets
 * - Application (20, 40%): Motors, relays, transformers
 * - Discrimination (15, 30%): Identifying poles, fields, components
 */

export const magnetismElectromagnetismQuestions: TaggedQuestion[] = [
  // ============================================
  // EASY QUESTIONS (15 questions: 3250-3264)
  // ============================================

  // Easy - Discrimination/Basic Properties
  {
    id: 3250,
    question: 'Which poles of two magnets will attract each other?',
    options: ['North and South', 'North and North', 'South and South', 'Neither will attract'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['magnetic-poles', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_POLE_BEHAVIOR',
      2: 'CONFUSED_POLE_BEHAVIOR',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Unlike poles attract each other. North and South poles will pull together, while like poles (North-North or South-South) repel.'
  },

  {
    id: 3251,
    question: 'What are the two poles of every magnet called?',
    options: ['North and South', 'Positive and Negative', 'East and West', 'Up and Down'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['magnetic-poles', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_WITH_ELECTRICAL_CHARGE',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Every magnet has a North pole and a South pole. These are different from positive and negative electrical charges.'
  },

  {
    id: 3252,
    question: 'What happens when two north poles of magnets are brought close together?',
    options: ['They repel each other', 'They attract each other', 'They have no effect on each other', 'They cancel each other out'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['magnetic-poles', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_POLE_BEHAVIOR',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Like poles repel. Two north poles (or two south poles) will push away from each other.'
  },

  {
    id: 3253,
    question: 'In which direction do magnetic field lines point?',
    options: ['From North to South', 'From South to North', 'From positive to negative', 'They point in all directions equally'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['magnetic-field', 'conceptual', 'discrimination'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'REVERSED_FIELD_DIRECTION',
      2: 'CONFUSED_WITH_ELECTRICAL_CHARGE',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'Magnetic field lines always point from the North pole to the South pole outside the magnet.'
  },

  {
    id: 3254,
    question: 'What type of magnet is a bar magnet?',
    options: ['Permanent magnet', 'Electromagnet', 'Temporary magnet', 'Variable magnet'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['permanent-magnet', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_MAGNET_TYPES',
      2: 'CONFUSED_MAGNET_TYPES',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'A bar magnet is a permanent magnet — it maintains its magnetic field without requiring external power.'
  },

  {
    id: 3255,
    question: 'What creates the magnetic field in an electromagnet?',
    options: ['Electric current flowing through a coil', 'Static electricity', 'The iron core alone', 'Heat from resistance'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'conceptual', 'discrimination'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_CORE_CREATES_FIELD',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'An electromagnet is created by electric current flowing through a coil of wire. The iron core strengthens the field but doesn\'t create it.'
  },

  {
    id: 3256,
    question: 'Which device converts electrical energy into rotational motion?',
    options: ['Electric motor', 'Generator', 'Transformer', 'Relay'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['motor', 'application', 'discrimination'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_MOTOR_GENERATOR',
      2: 'CONFUSED_DEVICE_FUNCTIONS',
      3: 'CONFUSED_DEVICE_FUNCTIONS'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'An electric motor converts electrical energy into mechanical rotational motion. A generator does the opposite.'
  },

  {
    id: 3257,
    question: 'What is the main purpose of a relay?',
    options: ['To control a large current with a small current', 'To convert AC to DC', 'To increase voltage', 'To measure current'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['relay', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_DEVICE_FUNCTIONS',
      2: 'CONFUSED_DEVICE_FUNCTIONS',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'A relay uses a small current in its coil to control (switch) a much larger current in a separate circuit, providing isolation and safety.'
  },

  {
    id: 3258,
    question: 'What does a transformer change?',
    options: ['AC voltage level', 'DC voltage level', 'Current to voltage', 'Resistance to capacitance'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'THOUGHT_WORKS_WITH_DC',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'A transformer changes AC voltage from one level to another (step-up or step-down). It only works with AC, not DC.'
  },

  {
    id: 3259,
    question: 'Can you isolate a single magnetic pole by cutting a magnet in half?',
    options: ['No, each piece will have both N and S poles', 'Yes, you get separate N and S poles', 'Yes, but only with electromagnets', 'Only if you cut it very carefully'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['magnetic-poles', 'conceptual', 'discrimination'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'THOUGHT_POLES_CAN_BE_ISOLATED',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'Magnetic poles always come in pairs. If you cut a magnet in half, each piece becomes a complete magnet with its own North and South poles.'
  },

  {
    id: 3260,
    question: 'What material is commonly used as the core of an electromagnet?',
    options: ['Iron', 'Copper', 'Aluminum', 'Plastic'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'conceptual', 'discrimination'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_CONDUCTOR_WITH_MAGNETIC_MATERIAL',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'Iron is used as the core because it\'s ferromagnetic, greatly strengthening the magnetic field. Copper is used for the wire coil, not the core.'
  },

  {
    id: 3261,
    question: 'What happens to an electromagnet when the current is switched off?',
    options: ['It loses its magnetism', 'It becomes a permanent magnet', 'It reverses polarity', 'Nothing changes'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'conceptual', 'discrimination'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'THOUGHT_ELECTROMAGNET_PERMANENT',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'An electromagnet is temporary — it only has a magnetic field when current flows. When the current stops, the magnetism disappears (though the iron core may retain a tiny residual field).'
  },

  {
    id: 3262,
    question: 'Where is the magnetic field strongest around a bar magnet?',
    options: ['At the poles', 'In the middle', 'Equally strong everywhere', 'Outside the magnet only'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['magnetic-field', 'conceptual', 'discrimination'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'THOUGHT_FIELD_UNIFORM',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'The magnetic field is strongest at the poles (North and South ends) where field lines are most concentrated.'
  },

  {
    id: 3263,
    question: 'Which type of current does a transformer require to operate?',
    options: ['AC (Alternating Current)', 'DC (Direct Current)', 'Both AC and DC', 'Pulsed DC only'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'THOUGHT_WORKS_WITH_DC',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'Transformers only work with AC because they rely on a changing magnetic field to induce voltage in the secondary coil. DC produces a constant field, which won\'t induce voltage.'
  },

  {
    id: 3264,
    question: 'What is a solenoid?',
    options: ['A coil of wire that acts as an electromagnet', 'A type of permanent magnet', 'A device that measures magnetic fields', 'A component that stores magnetic energy'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'solenoid', 'discrimination'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'A solenoid is a cylindrical coil of wire that produces a magnetic field when current flows through it, acting as an electromagnet with poles at each end.'
  },

  // ============================================
  // MEDIUM QUESTIONS (25 questions: 3265-3289)
  // ============================================

  {
    id: 3265,
    question: 'How can you reverse the polarity (N and S poles) of an electromagnet?',
    options: ['Reverse the direction of current flow', 'Turn it upside down', 'Increase the current', 'Remove the iron core'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'conceptual', 'application'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'THOUGHT_STRENGTH_AFFECTS_POLARITY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'Reversing the current direction reverses the magnetic field direction, swapping the North and South poles. This is a key advantage of electromagnets over permanent magnets.'
  },

  {
    id: 3266,
    question: 'What is the relationship between electricity and magnetism discovered by Ørsted?',
    options: ['Electric current creates a magnetic field', 'Magnets create electric current', 'Electricity and magnetism are unrelated', 'Magnetic fields cancel electric fields'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnetism', 'conceptual', 'historical'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_CAUSE_EFFECT',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'Ørsted discovered that electric current produces a magnetic field. This fundamental principle is the basis of electromagnetism.'
  },

  {
    id: 3267,
    question: 'Which factor does NOT increase the strength of an electromagnet?',
    options: ['Using copper instead of iron for the core', 'Increasing the current', 'Increasing the number of turns in the coil', 'Using an iron core'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'conceptual', 'application'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_CONDUCTOR_WITH_MAGNETIC_MATERIAL',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 45,
    explanation: 'Copper is a good electrical conductor but NOT ferromagnetic. An iron core greatly strengthens the field; copper would not. The coil wire is made of copper, but the core should be iron.'
  },

  {
    id: 3268,
    question: 'In a simple DC motor, what does the commutator do?',
    options: ['Reverses current direction every half turn', 'Increases the voltage', 'Slows down the rotation', 'Measures the speed'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['motor', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_DEVICE_FUNCTIONS',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'The commutator (split ring) reverses the current direction in the coil every half turn, keeping the motor rotating continuously in the same direction.'
  },

  {
    id: 3269,
    question: 'A relay coil requires 12V at 100mA. What is the main advantage of using this relay to switch a 230V, 10A load?',
    options: ['Safety: keeps high voltage isolated from the control switch', 'Cost: relays are cheaper than direct switches', 'Speed: relays switch faster', 'Efficiency: relays waste less energy'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['relay', 'application', 'safety'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 45,
    explanation: 'The main advantage is safety and isolation. The operator only handles the safe 12V control circuit, while the dangerous 230V power circuit is switched remotely by the relay contacts.'
  },

  {
    id: 3270,
    question: 'Why is an iron core used in a transformer?',
    options: ['To concentrate and strengthen the magnetic field', 'To conduct electricity between coils', 'To insulate the primary from secondary', 'To reduce the weight'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_CORE_CONDUCTS_ELECTRICITY',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'The iron core concentrates magnetic field lines and greatly increases field strength, improving transformer efficiency. The core does NOT conduct electricity between coils.'
  },

  {
    id: 3271,
    question: 'Which device would you use to reduce 230V AC mains to 12V AC for a doorbell?',
    options: ['Step-down transformer', 'Step-up transformer', 'Relay', 'Motor'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'application', 'discrimination'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_STEP_UP_DOWN',
      2: 'CONFUSED_DEVICE_FUNCTIONS',
      3: 'CONFUSED_DEVICE_FUNCTIONS'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'A step-down transformer reduces voltage. It has fewer turns on the secondary coil than the primary, resulting in lower output voltage.'
  },

  {
    id: 3272,
    question: 'What type of energy conversion occurs in an electric motor?',
    options: ['Electrical to mechanical', 'Mechanical to electrical', 'Electrical to thermal', 'Chemical to electrical'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['motor', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_MOTOR_GENERATOR',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'Motors convert electrical energy into mechanical energy (rotation). Generators do the reverse, converting mechanical to electrical.'
  },

  {
    id: 3273,
    question: 'Why do magnetic field lines never cross each other?',
    options: ['Because a compass can only point in one direction at any location', 'Because magnets repel crossing fields', 'Because they cancel each other out', 'Because of electrical resistance'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['magnetic-field', 'conceptual', 'discrimination'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'Field lines show the direction a compass needle would point. If lines crossed, a compass at that point would need to point in two directions at once, which is impossible.'
  },

  {
    id: 3274,
    question: 'If you double the current through an electromagnet, what happens to the magnetic field strength?',
    options: ['It increases', 'It decreases', 'It stays the same', 'It reverses direction'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'conceptual', 'application'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'THOUGHT_FIELD_INDEPENDENT_OF_CURRENT',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'Increasing current increases the magnetic field strength proportionally. More current means more magnetic field.'
  },

  {
    id: 3275,
    question: 'Which statement correctly describes a permanent magnet?',
    options: ['Maintains magnetism without external power', 'Only magnetic when connected to electricity', 'Can have its poles easily reversed', 'Requires an iron core to function'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['permanent-magnet', 'conceptual', 'discrimination'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_MAGNET_TYPES',
      2: 'CONFUSED_MAGNET_TYPES',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'A permanent magnet maintains its magnetic field indefinitely without needing electricity or external power. Its poles cannot be easily reversed.'
  },

  {
    id: 3276,
    question: 'In a transformer, what happens in the primary coil?',
    options: ['AC current creates a changing magnetic field', 'DC current creates a steady field', 'Voltage is stepped up', 'Mechanical energy is converted'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'THOUGHT_WORKS_WITH_DC',
      2: 'CONFUSED_PRIMARY_SECONDARY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'The primary coil carries AC current, which creates a changing (alternating) magnetic field in the iron core. This changing field induces voltage in the secondary coil.'
  },

  {
    id: 3277,
    question: 'What is electromagnetic induction?',
    options: ['Generating voltage in a coil by changing magnetic field', 'Magnetizing iron with electricity', 'Attracting magnetic materials', 'Heating a conductor with current'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnetism', 'induction', 'conceptual'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_INDUCTION_WITH_MAGNETIZATION',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'Electromagnetic induction is the production of voltage (EMF) in a conductor when it experiences a changing magnetic field. This is the principle behind transformers and generators.'
  },

  {
    id: 3278,
    question: 'Which material would be attracted to a magnet?',
    options: ['Iron nail', 'Copper wire', 'Aluminum foil', 'Plastic ruler'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['magnetic-materials', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-6A-LO1',
    misconceptionCodes: {
      1: 'THOUGHT_ALL_METALS_MAGNETIC',
      2: 'THOUGHT_ALL_METALS_MAGNETIC',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'Iron is ferromagnetic and strongly attracted to magnets. Copper and aluminum are not magnetic. Only iron, nickel, cobalt, and some alloys are strongly magnetic.'
  },

  {
    id: 3279,
    question: 'A relay is being used to control a 230V heater from a 12V switch. Where is the electromagnet located?',
    options: ['In the relay, energized by the 12V circuit', 'In the heater', 'In the 230V power supply', 'Between the switch and heater'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['relay', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_RELAY_COMPONENTS'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'The relay contains an electromagnet coil energized by the 12V control circuit. When energized, it attracts an armature that closes contacts in the separate 230V power circuit.'
  },

  {
    id: 3280,
    question: 'What determines whether a transformer steps voltage up or down?',
    options: ['The ratio of turns between primary and secondary coils', 'The amount of current flowing', 'The size of the iron core', 'The frequency of AC'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'The voltage ratio equals the turns ratio. More turns on secondary = step-up (higher voltage). Fewer turns on secondary = step-down (lower voltage).'
  },

  {
    id: 3281,
    question: 'An electric drill contains a motor. What physical phenomenon makes the motor spin?',
    options: ['Magnetic force on current-carrying conductors', 'Gravitational attraction', 'Electrostatic repulsion', 'Thermal expansion'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['motor', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'A motor works because a current-carrying conductor in a magnetic field experiences a force. This force causes the rotor to spin.'
  },

  {
    id: 3282,
    question: 'Why are electromagnets used in scrapyards to move metal?',
    options: ['They can be switched on to grab metal and off to release it', 'They are cheaper than permanent magnets', 'They are lighter than permanent magnets', 'They don\'t require power'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_MAGNET_TYPES'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'Electromagnets can be turned on (to pick up metal) and off (to release it). Permanent magnets would continuously hold metal and couldn\'t easily release it.'
  },

  {
    id: 3283,
    question: 'If a transformer primary coil has 1000 turns and secondary has 100 turns, what type is it?',
    options: ['Step-down (reduces voltage)', 'Step-up (increases voltage)', 'Isolation (same voltage)', 'Variable (adjustable voltage)'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'calculation', 'application'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_STEP_UP_DOWN',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'Fewer turns on secondary (100) than primary (1000) means voltage is reduced by a factor of 10. This is a step-down transformer.'
  },

  {
    id: 3284,
    question: 'What happens to the magnetic field around a straight wire carrying current?',
    options: ['Forms circular loops around the wire', 'Points straight along the wire', 'Forms a uniform field', 'No field is created'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnetism', 'magnetic-field', 'conceptual'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_FIELD_PATTERN',
      2: 'THOUGHT_FIELD_UNIFORM',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'Current in a straight wire creates a magnetic field in circular loops around the wire. The direction follows the right-hand rule.'
  },

  {
    id: 3285,
    question: 'Which device uses electromagnetic induction to operate?',
    options: ['Transformer', 'Relay', 'Electromagnet', 'Permanent magnet'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'induction', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_DEVICE_FUNCTIONS',
      2: 'CONFUSED_DEVICE_FUNCTIONS',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'A transformer uses electromagnetic induction: changing magnetic field in the primary induces voltage in the secondary. Relays use electromagnets but not induction.'
  },

  {
    id: 3286,
    question: 'In a relay, what moves when the coil is energized?',
    options: ['An iron armature', 'The iron core', 'The coil itself', 'The power contacts only'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['relay', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_RELAY_COMPONENTS',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 35,
    explanation: 'When the coil is energized, it attracts an iron armature. The armature moves and operates the contacts, switching the separate power circuit.'
  },

  {
    id: 3287,
    question: 'A laptop power supply contains a transformer. What does it do?',
    options: ['Steps down mains voltage to safe low voltage for the laptop', 'Steps up voltage for the screen', 'Converts DC to AC', 'Charges the battery directly'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'application', 'real-world'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_STEP_UP_DOWN',
      2: 'CONFUSED_DEVICE_FUNCTIONS',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'The laptop power supply uses a step-down transformer to reduce 230V mains to a safe voltage (typically 19V or less) for the laptop. It also includes rectification (AC to DC).'
  },

  {
    id: 3288,
    question: 'How does increasing the number of turns in an electromagnet coil affect the magnetic field?',
    options: ['Increases the field strength', 'Decreases the field strength', 'Has no effect', 'Reverses the poles'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'conceptual', 'application'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'THOUGHT_TURNS_IRRELEVANT',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'More turns means more current loops contributing to the magnetic field, resulting in a stronger electromagnet. Field strength is proportional to (current × turns).'
  },

  {
    id: 3289,
    question: 'What safety advantage does a relay provide in a car starter system?',
    options: ['Allows ignition switch to control high starter current safely', 'Reduces voltage to the starter motor', 'Prevents the battery from overcharging', 'Converts AC to DC'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['relay', 'application', 'safety', 'real-world'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_DEVICE_FUNCTIONS',
      2: 'OTHER',
      3: 'CONFUSED_DEVICE_FUNCTIONS'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 40,
    explanation: 'The starter motor draws hundreds of amps. A relay allows the small ignition switch (and thin wires) to control this safely. The relay handles the high current, not the ignition switch.'
  },

  // ============================================
  // HARD QUESTIONS (10 questions: 3290-3299)
  // ============================================

  {
    id: 3290,
    question: 'A transformer has 2000 turns on the primary and 100 turns on the secondary. If 230V AC is applied to the primary, what is the secondary voltage?',
    options: ['11.5V', '23V', '4600V', '115V'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'calculation', 'application'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CALCULATION_ERROR',
      2: 'MULTIPLIED_INSTEAD_OF_DIVIDED',
      3: 'CALCULATION_ERROR'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 60,
    explanation: 'Voltage ratio = turns ratio. Secondary voltage = Primary × (Secondary turns / Primary turns) = 230 × (100/2000) = 230 × 0.05 = 11.5V.'
  },

  {
    id: 3291,
    question: 'Why would an electromagnet with an air core be much weaker than one with an iron core?',
    options: ['Iron concentrates magnetic field lines hundreds of times more than air', 'Iron conducts electricity better', 'Iron is heavier so adds more force', 'Air resists magnetic fields'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'conceptual', 'application'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_ELECTRICAL_MAGNETIC_PROPERTIES',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 50,
    explanation: 'Iron is ferromagnetic with very high magnetic permeability — it concentrates and strengthens magnetic field lines by a factor of hundreds to thousands compared to air or vacuum.'
  },

  {
    id: 3292,
    question: 'In a motor, why must the current direction in the coil be reversed every half turn?',
    options: ['To maintain continuous rotation in the same direction', 'To prevent overheating', 'To increase the speed', 'To reduce electrical noise'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['motor', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 55,
    explanation: 'Without reversing current, the coil would rotate half a turn, then be pushed back. Reversing current every half turn keeps the force in the same rotational direction, maintaining continuous rotation.'
  },

  {
    id: 3293,
    question: 'A relay coil has a resistance of 120Ω and requires 12V to operate. What current flows through the coil?',
    options: ['0.1A (100mA)', '10A', '1.2A', '0.01A (10mA)'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['relay', 'calculation', 'application', 'ohms-law'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CALCULATION_ERROR',
      2: 'MULTIPLIED_INSTEAD_OF_DIVIDED',
      3: 'CALCULATION_ERROR'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 60,
    explanation: 'Using Ohm\'s Law: I = V / R = 12V / 120Ω = 0.1A = 100mA. This small current in the coil can control much larger currents in the switched circuit.'
  },

  {
    id: 3294,
    question: 'What would happen if you tried to use a transformer with DC instead of AC?',
    options: ['No voltage induced in secondary; only works at switch-on/off moments', 'It would work normally', 'The transformer would overheat and fail immediately', 'The voltage would be doubled'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'conceptual', 'application'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'THOUGHT_WORKS_WITH_DC',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 55,
    explanation: 'DC creates a constant magnetic field. Induction requires a CHANGING field. With DC, voltage is briefly induced only when switched on or off. For continuous operation, AC is required.'
  },

  {
    id: 3295,
    question: 'An electromagnet is lifting a 500kg steel beam in a scrapyard. What is the primary source of the lifting force?',
    options: ['Magnetic attraction between electromagnet and steel (ferromagnetic material)', 'Electrical attraction between charges', 'Gravitational field modification', 'Electrostatic forces'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'application', 'conceptual'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_ELECTRICAL_MAGNETIC_FORCES',
      2: 'OTHER',
      3: 'CONFUSED_ELECTRICAL_MAGNETIC_FORCES'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 50,
    explanation: 'The electromagnet creates a strong magnetic field that attracts the ferromagnetic steel. The magnetic force overcomes gravity, lifting the beam. This is purely magnetic attraction, not electrical charge attraction.'
  },

  {
    id: 3296,
    question: 'If a transformer primary has 500 turns and you want to step 230V down to 12V, how many turns should the secondary have?',
    options: ['Approximately 26 turns', '48 turns', '12 turns', '115 turns'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'calculation', 'application'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'CALCULATION_ERROR',
      2: 'WRONG_FORMULA_APPLIED',
      3: 'CALCULATION_ERROR'
    },
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 70,
    explanation: 'Turns ratio = Voltage ratio. Secondary turns = Primary turns × (Secondary V / Primary V) = 500 × (12/230) = 500 × 0.0522 ≈ 26 turns.'
  },

  {
    id: 3297,
    question: 'In an electric motor, what provides the force that causes rotation?',
    options: ['Interaction between the magnetic field and current in the coil', 'Centrifugal force from spinning', 'Electrical resistance heating', 'Capacitance in the windings'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['motor', 'conceptual', 'application'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 50,
    explanation: 'The motor force comes from the interaction between the magnetic field (from permanent magnets or stator) and the current-carrying coil (rotor). This electromagnetic force causes rotation.'
  },

  {
    id: 3298,
    question: 'Which factor has the LEAST effect on the strength of an electromagnet?',
    options: ['The material of the wire (copper vs aluminum)', 'The number of turns in the coil', 'The current flowing through the coil', 'The permeability of the core material'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['electromagnet', 'conceptual', 'application'],
    learningOutcomeId: '202-6A-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 60,
    explanation: 'Wire material (copper vs aluminum) affects resistance and efficiency but has minimal effect on field strength. Field strength primarily depends on: current, number of turns, and core permeability (iron vs air).'
  },

  {
    id: 3299,
    question: 'A step-up transformer increases 12V to 230V. If the primary draws 10A, approximately what is the maximum secondary current (assuming 100% efficiency)?',
    options: ['0.52A (520mA)', '10A', '19.2A', '191.7A'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'Magnetism & Electromagnetism',
    tags: ['transformer', 'calculation', 'application', 'power'],
    learningOutcomeId: '202-6A-LO3',
    misconceptionCodes: {
      1: 'THOUGHT_CURRENT_SAME',
      2: 'MULTIPLIED_INSTEAD_OF_DIVIDED',
      3: 'CALCULATION_ERROR'
    },
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 70,
    explanation: 'Power in = Power out (ideal transformer). Primary power = 12V × 10A = 120W. Secondary current = Power / Voltage = 120W / 230V ≈ 0.52A. Step-up voltage means step-down current.'
  }
];

