import { TaggedQuestion } from './types';

/**
 * AC Generation Question Bank
 * Aligned with lesson 202-7B learning outcomes
 * 
 * Distribution:
 * - Easy (15): 3350-3364
 * - Medium (25): 3365-3389
 * - Hard (10): 3390-3399
 * 
 * Types:
 * - Conceptual (20, 40%): How generators work, principles
 * - Visual/Discrimination (15, 30%): Identify rotation positions, waveform points
 * - Application (10, 20%): Real-world generator scenarios
 * - Connections (5, 10%): Why transformers need AC, generator applications
 */

export const acGenerationQuestions: TaggedQuestion[] = [
  // ============================================
  // EASY QUESTIONS (15 questions: 3350-3364)
  // ============================================

  // Easy - Basic Component Identification
  {
    id: 3350,
    question: 'What is the rotating loop of wire in a generator called?',
    options: ['Armature', 'Stator', 'Rotor core', 'Field winding'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['generator-components', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-7B-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'The armature is the rotating loop or coil of wire that cuts through the magnetic field in a generator.'
  },

  {
    id: 3351,
    question: 'What component maintains electrical contact with the rotating armature in an AC generator?',
    options: ['Slip rings and brushes', 'Commutator and brushes', 'Bearings', 'Field coils'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['generator-components', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-7B-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_AC_DC_GENERATOR_PARTS',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'Slip rings (continuous rings) and brushes maintain contact in AC generators. DC generators use a commutator (split ring) instead.'
  },

  {
    id: 3352,
    question: 'What type of energy does a generator convert into electrical energy?',
    options: ['Mechanical rotational energy', 'Heat energy', 'Light energy', 'Chemical energy'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['generator-principle', 'conceptual', 'energy-conversion'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Generators convert mechanical rotation (from turbines, engines, wind, etc.) into electrical energy.'
  },

  {
    id: 3353,
    question: 'What shape is the waveform produced by a continuously rotating generator?',
    options: ['Sine wave', 'Square wave', 'Triangle wave', 'Sawtooth wave'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['waveform', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'A continuously rotating generator produces a smooth sine wave because the voltage varies sinusoidally with rotation angle.'
  },

  {
    id: 3354,
    question: 'When the generator loop is horizontal (parallel to the magnetic field), what is the output voltage?',
    options: ['Zero', 'Maximum positive', 'Maximum negative', 'Half of maximum'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['rotation-position', 'voltage-output', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_PARALLEL_PERPENDICULAR',
      2: 'CONFUSED_PARALLEL_PERPENDICULAR',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: 'When the loop is parallel to the field (horizontal), it moves parallel to field lines and doesn\'t cut through them, so voltage is zero.'
  },

  {
    id: 3355,
    question: 'When the generator loop is perpendicular to the magnetic field (vertical), what is the output voltage?',
    options: ['Maximum (positive or negative)', 'Zero', 'Half of maximum', 'Quarter of maximum'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['rotation-position', 'voltage-output', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_PARALLEL_PERPENDICULAR',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: 'When the loop is perpendicular to the field (vertical), it cuts through field lines at maximum rate, producing maximum voltage.'
  },

  {
    id: 3356,
    question: 'What is the principle called when a voltage is induced in a conductor moving through a magnetic field?',
    options: ['Electromagnetic induction', 'Electrostatic attraction', 'Magnetic resonance', 'Electric discharge'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['generator-principle', 'conceptual', 'electromagnetic-induction'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'Electromagnetic induction is the process discovered by Faraday where moving a conductor through a magnetic field induces a voltage.'
  },

  {
    id: 3357,
    question: 'If a generator loop completes 50 rotations per second, what is the frequency of the AC output?',
    options: ['50 Hz', '100 Hz', '25 Hz', '50 kHz'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['frequency', 'calculation', 'rotation-speed'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'DOUBLED_FREQUENCY',
      2: 'HALVED_FREQUENCY',
      3: 'WRONG_UNITS'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: 'One complete rotation produces one AC cycle. 50 rotations per second = 50 cycles per second = 50 Hz.'
  },

  {
    id: 3358,
    question: 'How many times does the generator voltage cross zero during one complete 360° rotation?',
    options: ['2 times', '1 time', '4 times', 'Never'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['waveform', 'rotation-position', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 30,
    explanation: 'The voltage crosses zero twice per rotation: once at 0°/180° and once at 180°/360° (start and halfway through).'
  },

  {
    id: 3359,
    question: 'What component in a generator provides the magnetic field that the armature rotates through?',
    options: ['Permanent magnet or electromagnet', 'Slip rings', 'Brushes', 'Bearings'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['generator-components', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-7B-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'The permanent magnet (or electromagnet in large generators) provides the stationary magnetic field.'
  },

  {
    id: 3360,
    question: 'At what rotation position does the generator produce maximum voltage: 0°, 45°, 90°, or 180°?',
    options: ['90° (and also 270°)', '0°', '45°', '180°'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['rotation-position', 'voltage-output', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_PARALLEL_PERPENDICULAR',
      2: 'OTHER',
      3: 'CONFUSED_PARALLEL_PERPENDICULAR'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 35,
    explanation: 'At 90° and 270°, the loop is perpendicular to the field and cutting through it at maximum rate, producing maximum voltage.'
  },

  {
    id: 3361,
    question: 'Why does the generator produce alternating current rather than direct current?',
    options: ['The voltage direction reverses every half rotation', 'The voltage stays constant', 'The speed varies', 'The magnetic field changes strength'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['ac-principle', 'conceptual', 'explanation'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_AC_DC',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'As the loop rotates past 180°, it cuts through the field in the opposite direction, reversing the voltage polarity and creating AC.'
  },

  {
    id: 3362,
    question: 'What material are generator brushes typically made from?',
    options: ['Carbon', 'Copper', 'Aluminum', 'Steel'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['generator-components', 'discrimination', 'conceptual'],
    learningOutcomeId: '202-7B-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 20,
    explanation: 'Carbon brushes are used because carbon is conductive, creates less friction, and doesn\'t damage the slip rings.'
  },

  {
    id: 3363,
    question: 'One complete rotation of a generator produces how many complete AC cycles?',
    options: ['1 cycle', '2 cycles', '4 cycles', '0.5 cycles'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['frequency', 'rotation-speed', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'DOUBLED_FREQUENCY',
      2: 'OTHER',
      3: 'HALVED_FREQUENCY'
    },
    answerType: 'mcq',
    difficulty: 1,
    estimatedTime: 25,
    explanation: 'One complete 360° rotation produces exactly one complete AC cycle (positive half + negative half).'
  },

  {
    id: 3364,
    question: 'What happens to the generator output frequency if the rotation speed doubles?',
    options: ['Frequency doubles', 'Frequency stays the same', 'Frequency halves', 'Frequency quadruples'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['frequency', 'rotation-speed', 'application'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'HALVED_INSTEAD_OF_DOUBLED',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'Frequency is directly proportional to rotation speed. Double the speed = double the frequency (twice as many cycles per second).'
  },

  // ============================================
  // MEDIUM QUESTIONS (25 questions: 3365-3389)
  // ============================================

  // Medium - Conceptual Understanding
  {
    id: 3365,
    question: 'Why is the generator output voltage zero when the loop is at 0° and 180°?',
    options: ['The loop moves parallel to field lines, not cutting through them', 'The magnetic field is zero at those positions', 'The loop stops rotating momentarily', 'The brushes lose contact'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['rotation-position', 'conceptual', 'explanation', 'electromagnetic-induction'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'At 0° and 180°, the loop sides move parallel to the magnetic field lines. Since they\'re not cutting through lines, no voltage is induced.'
  },

  {
    id: 3366,
    question: 'A generator loop rotates at 3000 rpm (revolutions per minute). What is the AC frequency produced?',
    options: ['50 Hz', '3000 Hz', '180 Hz', '25 Hz'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['frequency', 'calculation', 'rotation-speed'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'DID_NOT_CONVERT_RPM_TO_RPS',
      2: 'OTHER',
      3: 'HALVED_FREQUENCY'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: '3000 rpm = 3000/60 = 50 revolutions per second = 50 Hz. (Divide rpm by 60 to convert to Hz)'
  },

  {
    id: 3367,
    question: 'What is the main difference between slip rings (AC generator) and a commutator (DC generator)?',
    options: ['Slip rings are continuous; commutator is split into segments', 'Slip rings are split; commutator is continuous', 'Slip rings rotate; commutator is fixed', 'No difference, just different names'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['generator-components', 'conceptual', 'ac-vs-dc'],
    learningOutcomeId: '202-7B-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_AC_DC_GENERATOR_PARTS',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 50,
    explanation: 'Slip rings are continuous rings (allow AC to flow both directions). A commutator is split and reverses connections each half turn (producing DC).'
  },

  {
    id: 3368,
    question: 'If the loop cuts through the magnetic field more quickly, what happens to the voltage?',
    options: ['Voltage increases', 'Voltage decreases', 'Voltage stays the same', 'Voltage becomes zero'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['electromagnetic-induction', 'conceptual', 'voltage-factors'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'Faster cutting = faster rate of change of magnetic flux = higher induced voltage (Faraday\'s Law).'
  },

  {
    id: 3369,
    question: 'On a sine wave graph from a generator, what do the positive and negative halves represent?',
    options: ['Current flowing in opposite directions', 'Different voltages', 'Different speeds', 'Different magnetic field strengths'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['waveform', 'conceptual', 'ac-principle'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'The positive half represents current in one direction, the negative half represents current in the opposite direction - the hallmark of AC.'
  },

  {
    id: 3370,
    question: 'Why do large power station generators use electromagnets instead of permanent magnets?',
    options: ['Electromagnets produce much stronger, controllable magnetic fields', 'Electromagnets are cheaper', 'Electromagnets are lighter', 'Permanent magnets don\'t work at large scales'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['generator-components', 'application', 'real-world'],
    learningOutcomeId: '202-7B-LO1',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'Electromagnets can produce much stronger magnetic fields and the strength can be controlled by adjusting the current, making them ideal for large generators.'
  },

  {
    id: 3371,
    question: 'If you increase the number of turns in the generator loop coil, what happens to the output voltage?',
    options: ['Voltage increases', 'Voltage decreases', 'Voltage stays the same', 'Frequency increases'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['voltage-factors', 'conceptual', 'coil-design'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_VOLTAGE_WITH_FREQUENCY'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'More turns = more wire cutting through the field = more voltage induced. Each turn adds to the total voltage.'
  },

  {
    id: 3372,
    question: 'At which rotation angle does the sine wave cross from positive to negative: 0°, 90°, 180°, or 270°?',
    options: ['180°', '90°', '270°', '0°'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['rotation-position', 'waveform', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'At 180° (halfway through), the loop reverses direction through the field, causing voltage to cross from positive through zero to negative.'
  },

  {
    id: 3373,
    question: 'What would happen if the magnetic field strength in a generator was doubled?',
    options: ['Output voltage would double', 'Output voltage would halve', 'Output frequency would double', 'Nothing would change'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['voltage-factors', 'conceptual', 'magnetic-field'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'HALVED_INSTEAD_OF_DOUBLED',
      2: 'CONFUSED_VOLTAGE_WITH_FREQUENCY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'Induced voltage is proportional to magnetic field strength (Faraday\'s Law). Double the field = double the voltage.'
  },

  {
    id: 3374,
    question: 'Where does the energy to generate electricity ultimately come from in a power station generator?',
    options: ['Mechanical rotation from turbines (driven by steam, water, or wind)', 'The magnetic field', 'The armature coil', 'Chemical reactions'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['energy-conversion', 'application', 'real-world'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'The generator converts mechanical rotation into electricity. The rotation comes from turbines powered by steam (coal, gas, nuclear), water, or wind.'
  },

  {
    id: 3375,
    question: 'Why is AC (rather than DC) the standard output from large power station generators?',
    options: ['AC is naturally produced by rotating generators and is easier to transform to different voltages', 'AC is safer than DC', 'AC travels faster through wires', 'AC uses less copper'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['ac-principle', 'application', 'real-world', 'conceptual'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 50,
    explanation: 'Rotating generators naturally produce AC. AC can be easily transformed to high voltage (for efficient transmission) then back down for homes using transformers.'
  },

  {
    id: 3376,
    question: 'If a generator operates at exactly 50 Hz, how long does one complete cycle take?',
    options: ['0.02 seconds (20 milliseconds)', '0.01 seconds', '50 seconds', '2 seconds'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['frequency', 'calculation', 'time-period'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'DID_NOT_DIVIDE_BY_TIME'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 60,
    explanation: 'Period (T) = 1 / frequency. T = 1 / 50 = 0.02 seconds = 20 milliseconds per cycle.'
  },

  {
    id: 3377,
    question: 'What determines the frequency of the AC produced by a generator?',
    options: ['The rotation speed of the armature', 'The magnetic field strength', 'The number of turns in the coil', 'The length of the wire'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['frequency', 'rotation-speed', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_VOLTAGE_WITH_FREQUENCY',
      2: 'CONFUSED_VOLTAGE_WITH_FREQUENCY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'Frequency equals rotation speed (in Hz). Faster rotation = higher frequency. Magnetic field and coil turns affect voltage, not frequency.'
  },

  {
    id: 3378,
    question: 'In a simple generator diagram, if the loop is shown at 270°, where is it on the sine wave?',
    options: ['At the negative peak (bottom of wave)', 'At the positive peak (top of wave)', 'Crossing zero going up', 'Crossing zero going down'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['rotation-position', 'waveform', 'visual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'CONFUSED_POSITIVE_NEGATIVE_PEAKS',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'At 270°, the loop is perpendicular cutting maximum field in the opposite direction from 90°, producing maximum negative voltage (bottom of sine wave).'
  },

  {
    id: 3379,
    question: 'Why must the armature loop be able to rotate continuously (not just oscillate back and forth)?',
    options: ['Continuous rotation produces continuous AC; oscillation would produce irregular output', 'Oscillation would damage the bearings', 'The magnetic field only works with continuous rotation', 'Slip rings only work with continuous rotation'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['conceptual', 'explanation', 'generator-principle'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 50,
    explanation: 'Continuous rotation at constant speed produces smooth, regular sine wave AC. Back-and-forth oscillation would create irregular waveforms.'
  },

  {
    id: 3380,
    question: 'A bicycle dynamo produces AC to power lights. What provides the mechanical rotation?',
    options: ['The bicycle wheel rotating', 'The pedals', 'A battery', 'The magnetic field'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['application', 'real-world', 'energy-conversion'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_POWER_SUPPLY_VS_LOAD',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'The spinning bicycle wheel drives the dynamo, which converts that mechanical rotation into AC electricity for the lights.'
  },

  {
    id: 3381,
    question: 'What happens to generator output if the armature suddenly stops rotating?',
    options: ['Output voltage drops to zero immediately', 'Output voltage stays at whatever value it was', 'Output voltage increases', 'Output becomes DC'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['conceptual', 'electromagnetic-induction'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_AC_DC'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'No movement = no cutting of field lines = no induced voltage. The output immediately drops to zero when rotation stops.'
  },

  {
    id: 3382,
    question: 'How many degrees of rotation occur between the positive peak and negative peak of the AC waveform?',
    options: ['180°', '90°', '360°', '270°'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['rotation-position', 'waveform', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 40,
    explanation: 'From 90° (positive peak) to 270° (negative peak) is 180° of rotation - exactly half a turn.'
  },

  {
    id: 3383,
    question: 'If you reverse the direction of rotation (clockwise to counter-clockwise), what happens to the AC output?',
    options: ['The waveform inverts (positive becomes negative, negative becomes positive), but frequency stays the same', 'Nothing changes', 'Frequency reverses', 'Output becomes DC'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['conceptual', 'rotation-direction'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_VOLTAGE_WITH_FREQUENCY',
      3: 'CONFUSED_AC_DC'
    },
    answerType: 'mcq',
    difficulty: 3,
    estimatedTime: 50,
    explanation: 'Reversing rotation direction inverts which way the loop cuts the field first, flipping the waveform upside down. It\'s still AC at the same frequency.'
  },

  {
    id: 3384,
    question: 'Why do transformers only work with AC and not with the DC from a battery?',
    options: ['Transformers need a changing magnetic field; AC provides this, DC doesn\'t', 'Transformers are designed only for high voltages', 'DC is too weak for transformers', 'Batteries don\'t produce enough current'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['ac-principle', 'application', 'transformers', 'conceptual'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 50,
    explanation: 'Transformers work by electromagnetic induction, which requires a CHANGING magnetic field. AC constantly changes; DC is constant and creates no induction.'
  },

  {
    id: 3385,
    question: 'In a car alternator, what provides the mechanical energy to rotate the generator?',
    options: ['The car engine via a belt drive', 'The car battery', 'The wheels', 'An electric motor'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['application', 'real-world', 'energy-conversion'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_POWER_SUPPLY_VS_LOAD',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 35,
    explanation: 'The car engine drives the alternator via a belt. The alternator generates AC (which is then converted to DC to charge the battery).'
  },

  {
    id: 3386,
    question: 'What is an "alternator"?',
    options: ['Another name for an AC generator', 'A device that converts AC to DC', 'A type of transformer', 'A type of motor'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['discrimination', 'conceptual', 'terminology'],
    learningOutcomeId: '202-7B-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_TRANSFORMER_WITH_RECTIFIER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 30,
    explanation: 'Alternator is simply another word for AC generator. It produces alternating current from mechanical rotation.'
  },

  {
    id: 3387,
    question: 'If the generator loop has 100 turns instead of 1, what changes?',
    options: ['The voltage is 100 times larger; frequency stays the same', 'The frequency is 100 times higher', 'Nothing changes', 'The voltage and frequency both increase'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['voltage-factors', 'conceptual', 'coil-design'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_VOLTAGE_WITH_FREQUENCY',
      2: 'OTHER',
      3: 'CONFUSED_VOLTAGE_WITH_FREQUENCY'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'Each turn contributes to total voltage (they add). 100 turns = 100× voltage. Frequency depends only on rotation speed, not number of turns.'
  },

  {
    id: 3388,
    question: 'At what point in the rotation does the generator voltage change from positive to negative?',
    options: ['When the loop is horizontal (180° position)', 'When the loop is vertical (90° position)', 'When the loop is at 45°', 'It never changes'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['rotation-position', 'waveform', 'conceptual'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_AC_DC'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'At 180° (horizontal), the loop has rotated halfway and is about to cut the field in the opposite direction, so voltage passes through zero changing polarity.'
  },

  {
    id: 3389,
    question: 'Why is the sine wave "smooth" rather than having sudden jumps?',
    options: ['The loop rotates continuously at constant speed, producing gradual voltage changes', 'The magnetic field fluctuates smoothly', 'The slip rings smooth out the voltage', 'The brushes filter the output'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['waveform', 'conceptual', 'explanation'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 2,
    estimatedTime: 45,
    explanation: 'Constant rotation means the angle (and thus the rate of field cutting) changes gradually, not suddenly, producing a smooth sine wave.'
  },

  // ============================================
  // HARD QUESTIONS (10 questions: 3390-3399)
  // ============================================

  // Hard - Advanced Application and Analysis
  {
    id: 3390,
    question: 'A wind turbine generator produces 50 Hz AC. If wind speed drops and rotation slows to 80% of original speed, what is the new frequency?',
    options: ['40 Hz', '50 Hz', '62.5 Hz', '25 Hz'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['frequency', 'calculation', 'application', 'rotation-speed'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'HALVED_FREQUENCY'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 75,
    explanation: 'Frequency is proportional to speed. 80% of 50 Hz = 0.8 × 50 = 40 Hz. Slower rotation = lower frequency.'
  },

  {
    id: 3391,
    question: 'Why does the generator produce maximum voltage at 90° and 270° but zero voltage at 0° and 180°?',
    options: ['At 90°/270° the loop cuts perpendicular through field (max rate); at 0°/180° it moves parallel (zero cutting)', 'The magnetic field is stronger at 90° and 270°', 'The slip rings only make contact at 90° and 270°', 'The armature speed varies during rotation'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['conceptual', 'explanation', 'electromagnetic-induction', 'rotation-position'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 90,
    explanation: 'Induced voltage depends on the rate of cutting field lines. Perpendicular motion cuts maximum lines; parallel motion cuts zero lines. This creates the sine wave pattern.'
  },

  {
    id: 3392,
    question: 'A generator coil has 200 turns and produces 100V at 50 Hz. If you want to produce 200V at the same frequency, what must you change?',
    options: ['Increase to 400 turns (or double magnetic field strength)', 'Double the rotation speed', 'Halve the rotation speed', 'Change the slip rings'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['voltage-factors', 'application', 'conceptual', 'coil-design'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_VOLTAGE_WITH_FREQUENCY',
      2: 'CONFUSED_VOLTAGE_WITH_FREQUENCY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 80,
    explanation: 'To double voltage while keeping frequency constant: double the turns (voltage factor) or double field strength. Changing speed changes frequency, not just voltage.'
  },

  {
    id: 3393,
    question: 'Why do the electrons in the wire not travel large distances in AC, yet electricity still powers devices far away?',
    options: ['Electrons vibrate back and forth locally; electromagnetic energy propagates through the conductor', 'Electrons do travel long distances', 'The magnetic field carries the energy, not electrons', 'Voltage travels, not current'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['conceptual', 'ac-principle', 'explanation'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'CONFUSED_ELECTRON_DRIFT_WITH_SIGNAL',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 80,
    explanation: 'In AC, electrons oscillate in place (short distance back and forth). Energy propagates as an electromagnetic wave through the conductor at nearly light speed.'
  },

  {
    id: 3394,
    question: 'A hydroelectric generator at a dam rotates at 100 rpm. To produce UK mains frequency (50 Hz), how many pole pairs must the generator have?',
    options: ['30 pole pairs', '50 pole pairs', '100 pole pairs', '1 pole pair'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['frequency', 'calculation', 'application', 'advanced'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 120,
    explanation: 'Frequency = (rpm × pole pairs) / 60. Rearranging: pole pairs = (50 × 60) / 100 = 30. Multiple pole pairs allow lower rotation speeds to produce desired frequency.'
  },

  {
    id: 3395,
    question: 'What is the relationship between the angle of the rotating loop and the instantaneous voltage produced?',
    options: ['Voltage = V_max × sin(angle), following a sine function', 'Voltage = V_max × angle / 360', 'Voltage is constant at all angles', 'Voltage = V_max × cos(angle)'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['waveform', 'conceptual', 'mathematical', 'rotation-position'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 70,
    explanation: 'The voltage follows a sine function: V = V_max × sin(θ). This is why AC has a "sine wave" - it mathematically follows the sine of the rotation angle.'
  },

  {
    id: 3396,
    question: 'If a generator armature has significant resistance, where does some of the mechanical input energy go?',
    options: ['Converted to heat in the armature windings (I²R losses)', 'Lost to the magnetic field', 'Lost through the slip rings', 'Reflected back to the turbine'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['application', 'conceptual', 'efficiency', 'energy-conversion'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 70,
    explanation: 'Real conductors have resistance. Current flowing through resistance produces heat (P = I²R). This is wasted energy, reducing generator efficiency.'
  },

  {
    id: 3397,
    question: 'In a large power station generator, why is the armature often stationary (stator) and the magnetic field rotates (rotor)?',
    options: ['It\'s easier to transfer high currents from a stationary coil than through slip rings', 'It produces more voltage', 'It produces higher frequency', 'The magnetic field is lighter'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['application', 'real-world', 'generator-design', 'advanced'],
    learningOutcomeId: '202-7B-LO1',
    misconceptionCodes: {
      1: 'CONFUSED_VOLTAGE_WITH_FREQUENCY',
      2: 'CONFUSED_VOLTAGE_WITH_FREQUENCY',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 80,
    explanation: 'Large generators produce huge currents. Stationary output coils (stator) avoid transferring thousands of amps through slip rings. Only low-current field excitation needs slip rings.'
  },

  {
    id: 3398,
    question: 'What happens to the generator if the mechanical load (demand for electricity) suddenly increases?',
    options: ['The generator slows down slightly unless more mechanical power is supplied', 'The generator speeds up', 'The voltage stays exactly the same', 'The frequency increases'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['application', 'conceptual', 'energy-conversion', 'load-response'],
    learningOutcomeId: '202-7B-LO2',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'CONFUSED_VOLTAGE_WITH_FREQUENCY'
    },
    answerType: 'mcq',
    difficulty: 4,
    estimatedTime: 80,
    explanation: 'Increased electrical load resists rotation (back EMF effect), slowing the generator. To maintain frequency, the turbine must provide more mechanical power to compensate.'
  },

  {
    id: 3399,
    question: 'Why is the AC from a rotating generator naturally sinusoidal (sine wave) rather than some other wave shape?',
    options: ['The rate of cutting field lines varies as the sine of the rotation angle due to geometry', 'The slip rings shape the waveform', 'The magnetic field fluctuates sinusoidally', 'The brushes create the sine shape'],
    correctAnswer: 0,
    section: 'Science 2365 Level 2',
    category: 'AC Generation',
    tags: ['waveform', 'conceptual', 'explanation', 'mathematical'],
    learningOutcomeId: '202-7B-LO3',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    answerType: 'mcq',
    difficulty: 5,
    estimatedTime: 90,
    explanation: 'The component of velocity perpendicular to the field (which determines cutting rate and voltage) mathematically equals sin(θ) due to the circular geometry of rotation.'
  }
];
