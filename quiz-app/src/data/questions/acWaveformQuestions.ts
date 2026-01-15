import { TaggedQuestion } from './types';

/**
 * AC Waveform Characteristics Question Bank
 * Aligned with lesson 202-7C learning outcomes
 * Covers RMS, peak, peak-to-peak, period, frequency, amplitude, and average voltage
 */

export const acWaveformQuestions: TaggedQuestion[] = [
  // ===== DISCRIMINATION QUESTIONS (Easy - Difficulty 1-2) =====
  {
    id: 3800,
    question: "What does RMS stand for?",
    options: [
      "Root Mean Square",
      "Real Mains Supply",
      "Rotating Magnetic System",
      "Regulated Maximum Standard"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'discrimination', 'conceptual'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_TERMINOLOGY',
      2: 'CONFUSED_TERMINOLOGY',
      3: 'CONFUSED_TERMINOLOGY'
    },
    difficulty: 1,
    estimatedTime: 30,
    explanation: "RMS stands for Root Mean Square. It's the effective value of AC voltage that produces the same heating effect as DC."
  },
  {
    id: 3801,
    question: "UK mains voltage is specified as 230V. What type of voltage measurement is this?",
    options: [
      "RMS voltage",
      "Peak voltage",
      "Peak-to-peak voltage",
      "Average voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'discrimination'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'CONFUSED_RMS_WITH_PEAK',
      3: 'OTHER'
    },
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Equipment specifications and ratings almost always use RMS (Root Mean Square) voltage, which represents the effective value."
  },
  {
    id: 3802,
    question: "What is the peak voltage for UK mains (230V RMS)?",
    options: [
      "Approximately 325V",
      "230V",
      "460V",
      "650V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'peak-voltage', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'MULTIPLIED_INSTEAD',
      3: 'CONFUSED_PEAK_TO_PEAK'
    },
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Peak voltage = RMS × 1.414. For UK mains: 230V × 1.414 ≈ 325V. This is the maximum voltage reached during the cycle."
  },
  {
    id: 3803,
    question: "When you use a multimeter in AC voltage mode, what type of voltage does it display?",
    options: [
      "RMS voltage",
      "Peak voltage",
      "Average voltage",
      "Peak-to-peak voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'discrimination', 'application'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_METER_READING',
      2: 'CONFUSED_METER_READING',
      3: 'CONFUSED_METER_READING'
    },
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Multimeters in AC mode display RMS voltage, which is the effective value useful for power calculations."
  },
  {
    id: 3804,
    question: "What is the period of UK mains supply at 50 Hz?",
    options: [
      "20 milliseconds (0.02 seconds)",
      "50 milliseconds",
      "2 milliseconds",
      "100 milliseconds"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'frequency', 'calculation'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'USED_F_INSTEAD_OF_1_F',
      2: 'WRONG_UNITS',
      3: 'MULTIPLIED_INSTEAD'
    },
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Period T = 1/f = 1/50 = 0.02 seconds = 20 milliseconds. This is the time for one complete cycle."
  },
  {
    id: 3805,
    question: "What is peak-to-peak voltage?",
    options: [
      "The total voltage from positive peak to negative peak",
      "The voltage at the top of the waveform only",
      "The RMS voltage multiplied by 2",
      "The average voltage over one cycle"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'peak-to-peak', 'conceptual'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_PEAK_DEFINITIONS',
      2: 'CONFUSED_RMS_WITH_PEAK',
      3: 'OTHER'
    },
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Peak-to-peak is the full voltage swing from the maximum positive value to the maximum negative value (total range)."
  },
  {
    id: 3806,
    question: "If the peak voltage is 50V, what is the peak-to-peak voltage?",
    options: [
      "100V",
      "50V",
      "25V",
      "35.35V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'peak-to-peak', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'USED_PEAK_NOT_P_P',
      2: 'DIVIDED_INSTEAD',
      3: 'OTHER'
    },
    difficulty: 2,
    estimatedTime: 40,
    explanation: "Peak-to-peak = 2 × peak. So 2 × 50V = 100V. It measures from +50V to -50V."
  },
  {
    id: 3807,
    question: "What is the relationship between period (T) and frequency (f)?",
    options: [
      "T = 1/f",
      "T = f",
      "T = 2 × f",
      "T = f²"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'frequency', 'conceptual'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'FORMULA_WRONG',
      2: 'FORMULA_WRONG',
      3: 'FORMULA_WRONG'
    },
    difficulty: 1,
    estimatedTime: 35,
    explanation: "Period and frequency are inversely related: T = 1/f. When frequency increases, period decreases."
  },
  {
    id: 3808,
    question: "What is the average voltage over one complete cycle of a symmetrical AC sine wave?",
    options: [
      "0 volts",
      "RMS voltage",
      "Peak voltage",
      "Half the peak voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'average-voltage', 'conceptual'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_AVERAGE_RMS',
      2: 'CONFUSED_AVERAGE_PEAK',
      3: 'OTHER'
    },
    difficulty: 2,
    estimatedTime: 45,
    explanation: "The average is 0V because the positive half-cycle exactly cancels the negative half-cycle in a symmetrical AC waveform."
  },
  {
    id: 3809,
    question: "Which measurement tells you the 'effective' voltage that produces the same heating effect as DC?",
    options: [
      "RMS voltage",
      "Peak voltage",
      "Average voltage",
      "Peak-to-peak voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'conceptual'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'CONFUSED_AVERAGE_RMS',
      3: 'OTHER'
    },
    difficulty: 1,
    estimatedTime: 30,
    explanation: "RMS (Root Mean Square) is the effective value that produces the same heating/power effect as the equivalent DC voltage."
  },
  {
    id: 3810,
    question: "What is amplitude in a sine wave?",
    options: [
      "The maximum displacement from zero (same as peak value)",
      "The total voltage swing from top to bottom",
      "The RMS value",
      "The time for one cycle"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'amplitude', 'conceptual'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_PEAK_TO_PEAK',
      2: 'CONFUSED_AMPLITUDE_RMS',
      3: 'CONFUSED_TIME_VOLTAGE'
    },
    difficulty: 1,
    estimatedTime: 30,
    explanation: "Amplitude is the maximum displacement from zero, which equals the peak value. It shows the 'height' of the waveform."
  },
  {
    id: 3811,
    question: "An oscilloscope shows an AC waveform reaching +50V and -50V. What is the peak voltage?",
    options: [
      "50V",
      "100V",
      "35.35V",
      "25V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'peak-voltage', 'discrimination', 'application'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_PEAK_TO_PEAK',
      2: 'CALCULATED_RMS_WRONG',
      3: 'DIVIDED_INSTEAD'
    },
    difficulty: 2,
    estimatedTime: 40,
    explanation: "Peak voltage is the maximum in one direction. The waveform reaches +50V, so peak = 50V. (Peak-to-peak would be 100V.)"
  },
  {
    id: 3812,
    question: "For an AC supply with frequency 60 Hz, what is the period?",
    options: [
      "Approximately 16.7 milliseconds",
      "60 milliseconds",
      "30 milliseconds",
      "1.67 milliseconds"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'frequency', 'calculation'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'USED_F_INSTEAD_OF_1_F',
      2: 'DIVIDED_WRONG',
      3: 'WRONG_UNITS'
    },
    difficulty: 2,
    estimatedTime: 50,
    explanation: "T = 1/f = 1/60 ≈ 0.01667 seconds = 16.7 milliseconds."
  },
  {
    id: 3813,
    question: "Which voltage value would you use to calculate power consumption for AC equipment?",
    options: [
      "RMS voltage",
      "Peak voltage",
      "Average voltage",
      "Peak-to-peak voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'application'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 2,
    estimatedTime: 40,
    explanation: "Always use RMS voltage for power calculations (P = V × I) because RMS represents the effective value."
  },
  {
    id: 3814,
    question: "If an AC voltage has a period of 0.01 seconds, what is its frequency?",
    options: [
      "100 Hz",
      "10 Hz",
      "1000 Hz",
      "50 Hz"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'frequency', 'period', 'calculation'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'OTHER',
      3: 'WRONG_CALCULATION'
    },
    difficulty: 2,
    estimatedTime: 50,
    explanation: "f = 1/T = 1/0.01 = 100 Hz. Period and frequency are inversely related."
  },

  // ===== CONCEPTUAL QUESTIONS (Medium - Difficulty 2-3) =====
  {
    id: 3815,
    question: "Why is RMS voltage more useful than peak voltage for describing mains AC supply?",
    options: [
      "RMS represents the effective power-producing capability",
      "RMS is easier to measure with a multimeter",
      "RMS is always a whole number",
      "RMS changes less than peak during transmission"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'conceptual', 'explanation'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'WRONG_REASON',
      2: 'WRONG_REASON',
      3: 'WRONG_REASON'
    },
    difficulty: 2,
    estimatedTime: 60,
    explanation: "RMS voltage represents the equivalent DC voltage that would produce the same heating/power effect, making it useful for power calculations and equipment ratings."
  },
  {
    id: 3816,
    question: "UK mains is 230V RMS. Why is the peak voltage (325V) important for electrical safety?",
    options: [
      "Insulation must withstand the peak voltage, not just the RMS",
      "The peak voltage determines the current flow",
      "Equipment always operates at peak voltage",
      "Safety calculations use peak voltage for power"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'peak-voltage', 'application', 'conceptual'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_PEAK_CURRENT',
      2: 'WRONG_REASON',
      3: 'CONFUSED_PEAK_POWER'
    },
    difficulty: 3,
    estimatedTime: 70,
    explanation: "Insulation and safety clearances must withstand the peak voltage (325V), not the RMS (230V), because that's the actual maximum stress the insulation experiences."
  },
  {
    id: 3817,
    question: "Why is the average voltage of a pure AC sine wave zero?",
    options: [
      "Because the positive half cancels the negative half",
      "Because AC doesn't produce any power",
      "Because multimeters can't measure AC average",
      "Because frequency affects the average"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'average-voltage', 'conceptual', 'explanation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'WRONG_REASON',
      2: 'WRONG_REASON',
      3: 'WRONG_REASON'
    },
    difficulty: 2,
    estimatedTime: 60,
    explanation: "A symmetrical AC waveform spends equal time above and below zero, so the positive values exactly cancel the negative values, giving an average of zero."
  },
  {
    id: 3818,
    question: "What happens to the period if the frequency doubles (e.g., from 50 Hz to 100 Hz)?",
    options: [
      "The period is halved",
      "The period doubles",
      "The period stays the same",
      "The period increases by 1.414"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'frequency', 'conceptual'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'INVERSE_WRONG',
      3: 'CONFUSED_RELATIONSHIP'
    },
    difficulty: 2,
    estimatedTime: 60,
    explanation: "Period and frequency are inversely related (T = 1/f). If frequency doubles, period is halved. 50 Hz → 20ms, 100 Hz → 10ms."
  },
  {
    id: 3819,
    question: "An oscilloscope displays an AC waveform, but a multimeter connected to the same supply shows a different voltage. Why?",
    options: [
      "The oscilloscope shows peak values; the multimeter shows RMS",
      "One of the instruments is broken",
      "The oscilloscope can't measure AC correctly",
      "The multimeter shows average voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'application', 'conceptual'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'WRONG_REASON',
      2: 'WRONG_REASON',
      3: 'CONFUSED_AVERAGE_RMS'
    },
    difficulty: 3,
    estimatedTime: 70,
    explanation: "Oscilloscopes display the actual waveform with peak values clearly visible. Multimeters in AC mode display RMS voltage. Both are correct — just different representations."
  },
  {
    id: 3820,
    question: "If the RMS voltage is 110V, approximately what is the peak voltage?",
    options: [
      "About 155V",
      "110V",
      "220V",
      "78V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'MULTIPLIED_BY_2_WRONG',
      3: 'USED_0707_WRONG_WAY'
    },
    difficulty: 3,
    estimatedTime: 60,
    explanation: "Peak = RMS × 1.414. So 110 × 1.414 ≈ 155V. Alternatively, RMS = 0.707 × peak, so peak = RMS / 0.707."
  },
  {
    id: 3821,
    question: "Which measurement would you use to rate a capacitor's voltage capability?",
    options: [
      "Peak voltage (or peak-to-peak)",
      "RMS voltage",
      "Average voltage",
      "Frequency"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'peak-voltage', 'application'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 3,
    estimatedTime: 65,
    explanation: "Capacitors must withstand the peak voltage, not RMS. A capacitor on 230V RMS mains must be rated for at least 325V (peak)."
  },
  {
    id: 3822,
    question: "For UK mains at 50 Hz, how many times does the voltage reach its positive peak in one second?",
    options: [
      "50 times",
      "100 times",
      "25 times",
      "1 time"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'frequency', 'conceptual'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'COUNTED_BOTH_PEAKS',
      2: 'WRONG_CALCULATION',
      3: 'WRONG_CALCULATION'
    },
    difficulty: 2,
    estimatedTime: 60,
    explanation: "50 Hz means 50 complete cycles per second. Each cycle has one positive peak, so the positive peak occurs 50 times per second."
  },
  {
    id: 3823,
    question: "What is the relationship between RMS and peak voltage for a sine wave?",
    options: [
      "RMS ≈ 0.707 × peak (or peak ≈ 1.414 × RMS)",
      "RMS = peak",
      "RMS = 0.5 × peak",
      "RMS = 2 × peak"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'conceptual'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'WRONG_MULTIPLIER',
      3: 'WRONG_MULTIPLIER'
    },
    difficulty: 2,
    estimatedTime: 55,
    explanation: "For sine waves, RMS = 0.707 × peak (or peak = 1.414 × RMS). This is why 230V RMS = 325V peak."
  },
  {
    id: 3824,
    question: "If you measure 230V RMS on a multimeter, and then switch to an oscilloscope, you see the waveform reaching approximately ±325V. Are these measurements consistent?",
    options: [
      "Yes, they're both correct (RMS vs peak)",
      "No, one instrument must be faulty",
      "No, the oscilloscope reading should also be 230V",
      "Yes, but only if the frequency is 50 Hz"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'application', 'conceptual'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_INSTRUMENTS',
      2: 'CONFUSED_RMS_WITH_PEAK',
      3: 'WRONG_REASON'
    },
    difficulty: 3,
    estimatedTime: 75,
    explanation: "Yes, consistent! Multimeter shows RMS (230V), oscilloscope shows peak (±325V). Relationship: 230 × 1.414 ≈ 325. Both correct."
  },
  {
    id: 3825,
    question: "What does the period (T) of an AC waveform tell you?",
    options: [
      "The time taken for one complete cycle",
      "The maximum voltage reached",
      "The effective voltage value",
      "The number of cycles per second"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'conceptual'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_TIME_VOLTAGE',
      2: 'CONFUSED_TIME_VOLTAGE',
      3: 'CONFUSED_PERIOD_FREQUENCY'
    },
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Period (T) is the time duration for one complete cycle of the waveform, measured in seconds (or milliseconds)."
  },
  {
    id: 3826,
    question: "An AC supply has peak voltage of 170V. What is approximately the RMS voltage?",
    options: [
      "About 120V",
      "170V",
      "340V",
      "85V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'MULTIPLIED_BY_2_WRONG',
      3: 'DIVIDED_WRONG'
    },
    difficulty: 3,
    estimatedTime: 65,
    explanation: "RMS = 0.707 × peak = 0.707 × 170V ≈ 120V. (Or peak = 1.414 × RMS, so RMS = peak / 1.414)"
  },
  {
    id: 3827,
    question: "For an AC waveform, why don't we use 'average voltage' for power calculations?",
    options: [
      "Because average voltage is zero for a symmetrical AC wave",
      "Because average voltage is too difficult to calculate",
      "Because average voltage equals RMS anyway",
      "Because meters can't measure average voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'average-voltage', 'rms', 'conceptual', 'explanation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'WRONG_REASON',
      2: 'CONFUSED_AVERAGE_RMS',
      3: 'WRONG_REASON'
    },
    difficulty: 3,
    estimatedTime: 70,
    explanation: "Average voltage for pure AC is zero (positive cancels negative), which is useless for power calculations. We use RMS instead, which represents effective power."
  },
  {
    id: 3828,
    question: "What happens to the peak voltage if you double the RMS voltage (e.g., from 115V to 230V RMS)?",
    options: [
      "Peak voltage also doubles",
      "Peak voltage quadruples",
      "Peak voltage stays the same",
      "Peak voltage increases by 1.414"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'conceptual'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'WRONG_MULTIPLIER',
      2: 'OTHER',
      3: 'WRONG_MULTIPLIER'
    },
    difficulty: 3,
    estimatedTime: 65,
    explanation: "Peak and RMS maintain a constant ratio (peak = 1.414 × RMS). If RMS doubles, peak also doubles. 115V RMS → 163V peak; 230V RMS → 325V peak."
  },
  {
    id: 3829,
    question: "An oscilloscope shows a waveform with peak-to-peak voltage of 200V. What is the peak voltage?",
    options: [
      "100V",
      "200V",
      "400V",
      "141V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'peak-voltage', 'peak-to-peak', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_PEAK_TO_PEAK',
      2: 'MULTIPLIED_INSTEAD',
      3: 'CALCULATED_RMS_WRONG'
    },
    difficulty: 2,
    estimatedTime: 50,
    explanation: "Peak-to-peak = 2 × peak, so peak = peak-to-peak / 2 = 200V / 2 = 100V."
  },
  {
    id: 3830,
    question: "Which statement about UK mains supply (230V, 50 Hz) is TRUE?",
    options: [
      "230V is the RMS value; peak is about 325V; period is 20ms",
      "230V is the peak value; RMS is about 163V; period is 50ms",
      "230V is peak-to-peak; RMS is 115V; period is 20ms",
      "230V is the average value; peak is 325V; period is 50ms"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'period', 'application'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'CONFUSED_PEAK_TO_PEAK',
      3: 'CONFUSED_AVERAGE_RMS'
    },
    difficulty: 3,
    estimatedTime: 80,
    explanation: "UK mains: 230V RMS (specified), peak ≈ 325V (1.414 × 230), period = 1/50 = 0.02s = 20ms. All values consistent."
  },

  // ===== CALCULATION QUESTIONS (Medium-Hard - Difficulty 2-4) =====
  {
    id: 3831,
    question: "Calculate the period for a 100 Hz AC supply. Use T = 1/f.",
    options: [
      "0.01 seconds (10 milliseconds)",
      "100 seconds",
      "0.1 seconds",
      "0.001 seconds"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'frequency', 'calculation'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'USED_F_INSTEAD_OF_1_F',
      2: 'WRONG_UNITS',
      3: 'WRONG_DECIMAL'
    },
    difficulty: 2,
    estimatedTime: 55,
    explanation: "T = 1/f = 1/100 = 0.01 seconds = 10 milliseconds."
  },
  {
    id: 3832,
    question: "An AC waveform has a period of 0.005 seconds. What is its frequency?",
    options: [
      "200 Hz",
      "5 Hz",
      "500 Hz",
      "0.005 Hz"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'frequency', 'period', 'calculation'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'WRONG_CALCULATION',
      3: 'USED_T_INSTEAD_OF_1_T'
    },
    difficulty: 3,
    estimatedTime: 60,
    explanation: "f = 1/T = 1/0.005 = 200 Hz."
  },
  {
    id: 3833,
    question: "If the peak voltage is 141V, what is approximately the RMS voltage?",
    options: [
      "About 100V",
      "141V",
      "282V",
      "70.5V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'MULTIPLIED_BY_2_WRONG',
      3: 'DIVIDED_WRONG'
    },
    difficulty: 3,
    estimatedTime: 65,
    explanation: "RMS = 0.707 × peak = 0.707 × 141 ≈ 100V."
  },
  {
    id: 3834,
    question: "An oscilloscope shows peak-to-peak voltage of 650V. What is approximately the RMS voltage?",
    options: [
      "About 230V",
      "325V",
      "650V",
      "460V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-to-peak', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'FORGOT_TO_HALVE_P_P',
      2: 'CONFUSED_PEAK_TO_PEAK',
      3: 'WRONG_CALCULATION'
    },
    difficulty: 4,
    estimatedTime: 80,
    explanation: "Peak-to-peak = 650V, so peak = 325V. Then RMS = 0.707 × 325 ≈ 230V. (Or peak-to-peak / 2 / 1.414)"
  },
  {
    id: 3835,
    question: "For a 25 Hz AC supply, what is the period?",
    options: [
      "0.04 seconds (40 milliseconds)",
      "25 seconds",
      "0.025 seconds",
      "4 seconds"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'frequency', 'calculation'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'USED_F_INSTEAD_OF_1_F',
      2: 'WRONG_UNITS',
      3: 'WRONG_CALCULATION'
    },
    difficulty: 2,
    estimatedTime: 55,
    explanation: "T = 1/f = 1/25 = 0.04 seconds = 40 milliseconds."
  },
  {
    id: 3836,
    question: "If RMS voltage is 400V, what is approximately the peak voltage?",
    options: [
      "About 566V",
      "400V",
      "800V",
      "283V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_RMS_WITH_PEAK',
      2: 'MULTIPLIED_BY_2_WRONG',
      3: 'USED_0707_WRONG_WAY'
    },
    difficulty: 3,
    estimatedTime: 65,
    explanation: "Peak = RMS × 1.414 = 400 × 1.414 ≈ 566V."
  },
  {
    id: 3837,
    question: "An AC supply has a period of 0.0125 seconds. What is its frequency?",
    options: [
      "80 Hz",
      "12.5 Hz",
      "8 Hz",
      "125 Hz"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'frequency', 'period', 'calculation'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_INSTEAD',
      2: 'WRONG_CALCULATION',
      3: 'WRONG_DECIMAL'
    },
    difficulty: 3,
    estimatedTime: 70,
    explanation: "f = 1/T = 1/0.0125 = 80 Hz."
  },
  {
    id: 3838,
    question: "If peak voltage is 300V, what is the peak-to-peak voltage?",
    options: [
      "600V",
      "300V",
      "150V",
      "424V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'peak-voltage', 'peak-to-peak', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'USED_PEAK_NOT_P_P',
      2: 'DIVIDED_INSTEAD',
      3: 'CALCULATED_RMS_WRONG'
    },
    difficulty: 2,
    estimatedTime: 45,
    explanation: "Peak-to-peak = 2 × peak = 2 × 300V = 600V."
  },
  {
    id: 3839,
    question: "A 110V RMS AC supply has what approximate peak-to-peak voltage?",
    options: [
      "About 311V",
      "220V",
      "155V",
      "110V"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-to-peak', 'calculation'],
    learningOutcomeId: "202-7C-LO1",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'MULTIPLIED_BY_2_ONLY',
      2: 'CALCULATED_PEAK_NOT_P_P',
      3: 'CONFUSED_RMS_WITH_PEAK'
    },
    difficulty: 4,
    estimatedTime: 85,
    explanation: "RMS = 110V. Peak = 110 × 1.414 ≈ 155V. Peak-to-peak = 2 × 155 ≈ 311V. (Or RMS × 2.828)"
  },
  {
    id: 3840,
    question: "How long (in milliseconds) does it take for one cycle at 200 Hz?",
    options: [
      "5 milliseconds",
      "200 milliseconds",
      "0.5 milliseconds",
      "50 milliseconds"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'frequency', 'calculation'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'USED_F_INSTEAD_OF_1_F',
      2: 'WRONG_UNITS',
      3: 'WRONG_CALCULATION'
    },
    difficulty: 3,
    estimatedTime: 60,
    explanation: "T = 1/f = 1/200 = 0.005 seconds = 5 milliseconds."
  },

  // ===== APPLICATION QUESTIONS (Hard - Difficulty 4-5) =====
  {
    id: 3841,
    question: "A capacitor is connected to UK mains (230V RMS, 50 Hz). What minimum voltage rating should the capacitor have to be safe?",
    options: [
      "At least 325V (preferably higher, like 400V or 450V for safety margin)",
      "230V (the RMS rating)",
      "At least 650V (peak-to-peak)",
      "At least 460V (double RMS)"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'peak-voltage', 'application'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'USED_RMS_NOT_PEAK',
      2: 'USED_PEAK_TO_PEAK',
      3: 'WRONG_CALCULATION'
    },
    difficulty: 4,
    estimatedTime: 90,
    explanation: "Capacitors must withstand peak voltage (325V for 230V RMS). In practice, use a higher rating (400V or 450V) for a safety margin."
  },
  {
    id: 3842,
    question: "You're testing an AC circuit with a multimeter and oscilloscope. Multimeter shows 120V. Oscilloscope shows peak voltage of 200V. What's the most likely problem?",
    options: [
      "The waveform is distorted (not a pure sine wave)",
      "The multimeter is broken",
      "The oscilloscope is set incorrectly",
      "Nothing is wrong; this is normal"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'application', 'conceptual'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'WRONG_DIAGNOSIS',
      2: 'WRONG_DIAGNOSIS',
      3: 'OTHER'
    },
    difficulty: 5,
    estimatedTime: 100,
    explanation: "For a pure sine wave, peak should be RMS × 1.414 = 120 × 1.414 ≈ 170V. The peak is 200V, suggesting the waveform is distorted (not sinusoidal)."
  },
  {
    id: 3843,
    question: "An electrician measures 240V RMS on a circuit that should be 230V. Is this a problem?",
    options: [
      "No, mains voltage can vary within acceptable limits (typically ±10%)",
      "Yes, this indicates a serious fault",
      "Yes, equipment will be damaged",
      "No, because peak voltage is more important"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'application'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'WRONG_INTERPRETATION',
      2: 'WRONG_INTERPRETATION',
      3: 'OTHER'
    },
    difficulty: 4,
    estimatedTime: 80,
    explanation: "Mains voltage can vary (typically 230V ±10% in the UK), so 240V is within acceptable limits. Equipment is designed to handle this variation."
  },
  {
    id: 3844,
    question: "You need to select a meter to measure AC mains voltage. The meter can display either 'average' or 'RMS'. Which should you use?",
    options: [
      "RMS, because average voltage for AC is zero",
      "Average, because it's more accurate",
      "Either one will work equally well",
      "Average, because it's easier to measure"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'average-voltage', 'application'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_AVERAGE_RMS',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 4,
    estimatedTime: 75,
    explanation: "Always use RMS for AC measurements. Average voltage for symmetrical AC is zero (useless). RMS represents the effective voltage."
  },
  {
    id: 3845,
    question: "An AC motor nameplate states '230V'. If you measure the supply with an oscilloscope and see peaks of 350V, what should you do?",
    options: [
      "Investigate further — peak should be ~325V for 230V RMS",
      "Nothing — oscilloscopes always show higher readings",
      "Replace the motor — it can't handle 350V",
      "Reduce the supply voltage immediately"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'application'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'WRONG_ACTION',
      2: 'OTHER',
      3: 'WRONG_ACTION'
    },
    difficulty: 5,
    estimatedTime: 100,
    explanation: "For 230V RMS, peak should be ~325V. Seeing 350V suggests the RMS is higher than 230V (about 247V RMS). Investigate the supply voltage."
  },
  {
    id: 3846,
    question: "A circuit uses a transformer to reduce 230V RMS to 12V RMS at 50 Hz. How does the period change?",
    options: [
      "Period stays the same (20ms)",
      "Period reduces proportionally to voltage",
      "Period increases to maintain power",
      "Period becomes 1ms"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'frequency', 'application', 'conceptual'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'CONFUSED_VOLTAGE_FREQUENCY',
      2: 'OTHER',
      3: 'WRONG_CALCULATION'
    },
    difficulty: 4,
    estimatedTime: 85,
    explanation: "Period (and frequency) don't change through a transformer. Both primary and secondary operate at 50 Hz (20ms period). Only voltage changes."
  },
  {
    id: 3847,
    question: "Why do some oscilloscopes show 'RMS' as a calculated value rather than directly measuring it?",
    options: [
      "Because oscilloscopes measure the actual waveform (peak), then calculate RMS mathematically",
      "Because RMS is impossible to measure electronically",
      "Because RMS changes too quickly to measure",
      "Because oscilloscopes are designed for DC only"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'peak-voltage', 'application', 'conceptual'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'OTHER',
      3: 'OTHER'
    },
    difficulty: 5,
    estimatedTime: 90,
    explanation: "Oscilloscopes capture the actual waveform (showing peak values), then use the captured data to calculate RMS mathematically if requested."
  },
  {
    id: 3848,
    question: "You're comparing AC supplies from UK (230V, 50 Hz) and USA (120V, 60 Hz). Which has a longer period?",
    options: [
      "UK (20ms vs 16.7ms)",
      "USA (16.7ms vs 20ms)",
      "Both the same",
      "Can't determine without knowing peak voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'period', 'frequency', 'calculation', 'application'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'INVERSE_WRONG',
      2: 'OTHER',
      3: 'CONFUSED_VOLTAGE_FREQUENCY'
    },
    difficulty: 4,
    estimatedTime: 85,
    explanation: "Period = 1/f. UK: T = 1/50 = 20ms. USA: T = 1/60 = 16.7ms. Lower frequency = longer period. (Voltage is irrelevant to period.)"
  },
  {
    id: 3849,
    question: "A circuit has a fault causing the AC waveform to become distorted (not a pure sine wave). How does this affect the RMS measurement?",
    options: [
      "RMS may differ from the expected 0.707 × peak relationship",
      "RMS becomes zero",
      "RMS is unaffected (always 0.707 × peak)",
      "RMS equals peak voltage"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'rms', 'application', 'conceptual'],
    learningOutcomeId: "202-7C-LO3",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_DISTORTION_EFFECT',
      3: 'CONFUSED_DISTORTION_EFFECT'
    },
    difficulty: 5,
    estimatedTime: 95,
    explanation: "The 0.707 factor only applies to pure sine waves. Distorted waveforms have different RMS-to-peak ratios. This is one way to detect waveform distortion."
  },
  {
    id: 3850,
    question: "An AC generator's output frequency drops from 50 Hz to 45 Hz due to mechanical problems. How does this affect the RMS voltage output (assuming the generator design hasn't changed)?",
    options: [
      "RMS voltage decreases (lower frequency = lower voltage in this scenario)",
      "RMS voltage increases",
      "RMS voltage stays the same",
      "RMS becomes zero"
    ],
    correctAnswer: 0,
    section: "Science 2365 Level 2",
    category: "AC Waveform Characteristics",
    tags: ['ac-waveforms', 'frequency', 'rms', 'application', 'conceptual'],
    learningOutcomeId: "202-7C-LO2",
    answerType: 'mcq',
    misconceptionCodes: {
      1: 'OTHER',
      2: 'CONFUSED_FREQUENCY_WITH_VOLTAGE',
      3: 'OTHER'
    },
    difficulty: 5,
    estimatedTime: 100,
    explanation: "In a generator, voltage is proportional to the rate of change of magnetic flux. Lower rotational speed (lower frequency) produces lower voltage output."
  }
];
