import { TaggedQuestion } from './types';

/**
 * test Question Bank
 * Aligned with lesson 202-TETS learning outcomes
 * Generated: 2026-01-25
 */

export const testQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "What is the SI unit used to measure electrical resistance during a circuit test?",
    "options": [
      "Ohm",
      "Volt",
      "Ampere",
      "Watt"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "WRONG_UNITS"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "units",
      "terminology",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "The Ohm (Ω) is the standard unit for electrical resistance."
  },
  {
    "id": 4052,
    "question": "Which instrument must be connected in parallel with a component to measure the voltage across it?",
    "options": [
      "Voltmeter",
      "Ammeter",
      "Ohmeter",
      "Wattmeter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "WRONG_UNITS"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "discrimination",
      "voltage-rule",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A voltmeter is designed with high internal resistance and must be connected in parallel to measure potential difference."
  },
  {
    "id": 4053,
    "question": "In electrical testing, what does the term 'continuity' refer to?",
    "options": [
      "An unbroken path for electrical current to flow",
      "The insulation thickness of a cable",
      "The frequency of an AC supply",
      "The total power consumed by a load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "conceptual",
      "terminology",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Continuity indicates that a circuit is complete and has a continuous path for current."
  },
  {
    "id": 4054,
    "question": "An electrician needs to measure the current flowing through a heater. How should the ammeter be connected?",
    "options": [
      "In series with the heater",
      "In parallel with the heater",
      "Between the neutral and earth terminals",
      "Across the supply terminals"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "application",
      "current-rule",
      "series"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "To measure the full current of a component, the ammeter must be placed in series so the current flows through it."
  },
  {
    "id": 4055,
    "question": "Using Ohm's Law, if a test shows a voltage of 230V and a resistance of 10 ohms, what is the current?",
    "options": [
      "23 A",
      "2300 A",
      "0.043 A",
      "240 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using I = V / R: 230 / 10 = 23 Amperes."
  },
  {
    "id": 4056,
    "question": "Which of these is the primary purpose of an Insulation Resistance test?",
    "options": [
      "To check that current does not leak between conductors",
      "To measure the resistance of the copper wire",
      "To ensure the circuit breaker is the correct size",
      "To verify the frequency of the supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Insulation resistance testing ensures that the insulation is effective and preventing leakage current between live parts or to earth."
  },
  {
    "id": 4057,
    "question": "When using a digital multimeter to test a battery, which setting should be selected?",
    "options": [
      "DC Voltage",
      "AC Voltage",
      "AC Current",
      "Frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "discrimination",
      "ac-dc",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Batteries provide Direct Current (DC), so the DC Voltage setting must be used."
  },
  {
    "id": 4058,
    "question": "What happens to the total resistance if two identical 10 ohm resistors are tested in series?",
    "options": [
      "It increases to 20 ohms",
      "It decreases to 5 ohms",
      "It stays at 10 ohms",
      "It becomes 100 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4059,
    "question": "Before carrying out a 'test for dead' on a circuit, what is the most important safety step?",
    "options": [
      "Verify the test instrument on a known live source",
      "Check the resistance of the probes",
      "Change the batteries in the tester",
      "Ensure the circuit is under full load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "health-safety",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "You must always verify your test instrument (e.g., on a proving unit) to ensure it is working correctly before trusting it to show a circuit is dead."
  },
  {
    "id": 4060,
    "question": "Which of the following is a unit of electrical energy often seen on utility meters?",
    "options": [
      "Kilowatt-hour (kWh)",
      "Volt-ampere (VA)",
      "Ohm-meter",
      "Hertz (Hz)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "energy",
      "units",
      "conceptual"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Electrical energy is typically measured in Kilowatt-hours (kWh) for billing and usage monitoring."
  },
  {
    "id": 4061,
    "question": "Which instrument is specifically designed to measure very low values of resistance, such as the continuity of a protective conductor?",
    "options": [
      "Low resistance ohm-meter",
      "Insulation resistance tester",
      "Voltmeter",
      "Frequency meter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "resistance-rule",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A low resistance ohm-meter is used for continuity testing because it can accurately measure small resistance values in ohms, whereas insulation testers measure in megohms."
  },
  {
    "id": 4062,
    "question": "When performing a continuity test on a circuit, what is the primary electrical property being measured to ensure the path is complete?",
    "options": [
      "Resistance",
      "Voltage",
      "Power",
      "Frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "resistance-rule",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Continuity testing measures the resistance of a conductor. A low resistance indicates a continuous, unbroken path."
  },
  {
    "id": 4063,
    "question": "What type of voltage is typically used by an Insulation Resistance tester to verify the integrity of cable insulation in a standard 230V circuit?",
    "options": [
      "High voltage DC",
      "Low voltage AC",
      "High voltage AC",
      "Low voltage DC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "ac-dc",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Insulation resistance tests use high voltage DC (typically 500V for a 230V system) to stress the insulation and detect leakage current."
  },
  {
    "id": 4064,
    "question": "Why is it essential to prove a test instrument is working correctly using a known source (proving unit) before and after use?",
    "options": [
      "To ensure the safety of the person testing",
      "To save the instrument's battery life",
      "To calibrate the instrument's internal clock",
      "To increase the resistance of the test leads"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "health-safety",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Proving the instrument ensures that a 'zero' reading actually means the circuit is dead, preventing the user from working on a live circuit accidentally."
  },
  {
    "id": 4065,
    "question": "An electrician is testing the total resistance of two identical 10 Ω resistors connected in series. What should the ohm-meter reading be?",
    "options": [
      "20 Ω",
      "5 Ω",
      "10 Ω",
      "100 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total resistance is the sum of the individual resistances (10 Ω + 10 Ω = 20 Ω)."
  },
  {
    "id": 4066,
    "question": "An electrician is about to use a digital multimeter to measure the resistance of a heating element. Why must the circuit be isolated from the power supply before taking this measurement?",
    "options": [
      "The meter applies its own small voltage, and external voltage will cause damage or an incorrect reading",
      "Resistance can only be measured when current is flowing through the circuit from the mains",
      "The meter requires the circuit's magnetic field to be active to calculate the Ohms",
      "Isolating the circuit increases the resistance of the copper, making it easier to read"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "resistance-rule",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Ohmmeters function by passing a small known current from an internal battery through the component. External voltage will interfere with this measurement and likely blow the meter's internal fuse or damage the circuitry."
  },
  {
    "id": 4067,
    "question": "Which specific instrument should be used to verify that the PVC insulation of a new circuit is effectively preventing current leakage between live conductors?",
    "options": [
      "Insulation Resistance Tester",
      "Low-resistance Ohmmeter",
      "Digital Clamp Meter",
      "Voltage Indicator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "discrimination",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "An Insulation Resistance Tester (Megohmmeter) applies a high DC voltage (typically 250V or 500V) to test the integrity of insulation, whereas a standard ohmmeter uses very low voltage."
  },
  {
    "id": 4068,
    "question": "A 230V AC immersion heater is rated at 4.6 kW. During a maintenance test, what should the approximate resistance of the element be?",
    "options": [
      "11.5 Ω",
      "50.0 Ω",
      "20.0 Ω",
      "1058 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "ohms-law",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using R = V² / P: 230 * 230 = 52,900. Then 52,900 / 4600 = 11.5 Ω. Alternatively, find I (P/V = 20A) then R (V/I = 230/20 = 11.5 Ω)."
  },
  {
    "id": 4069,
    "question": "During a long-duration load test, the temperature of a copper cable increases significantly. How will this temperature rise affect the resistance of the cable?",
    "options": [
      "The resistance will increase",
      "The resistance will decrease",
      "The resistance will remain constant",
      "The resistance will drop to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "resistance-rule",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Copper has a positive temperature coefficient, meaning its resistance increases as its temperature rises."
  },
  {
    "id": 4070,
    "question": "While testing a lighting circuit, an electrician measures two identical 120 Ω lamps connected in parallel. What is the total resistance that should be shown on the instrument?",
    "options": [
      "60 Ω",
      "240 Ω",
      "120 Ω",
      "0.016 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one (120 / 2 = 60 Ω)."
  },
  {
    "id": 4071,
    "question": "When using a multimeter to test the supply voltage at a standard UK industrial isolator (3-phase), which setting must be selected?",
    "options": [
      "AC Voltage (~V)",
      "DC Voltage (⎓V)",
      "AC Current (~A)",
      "Continuity (Audible)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "ac-dc",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Mains electricity in the UK is Alternating Current (AC). To measure voltage, the multimeter must be set to the AC Voltage range."
  },
  {
    "id": 4072,
    "question": "An electrician is testing a fixed resistor. If they increase the voltage applied to the resistor by three times, what will happen to the current flowing through it, assuming temperature remains constant?",
    "options": [
      "The current will increase by three times",
      "The current will decrease by three times",
      "The current will stay the same",
      "The current will increase by nine times"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "ohms-law",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Ohm's Law states that current is directly proportional to voltage (I = V/R). If voltage triples and resistance is constant, current also triples."
  },
  {
    "id": 4073,
    "question": "A circuit under test has a measured current of 12A. The cable resistance is found to be 0.2 Ω. Calculate the voltage drop across this cable.",
    "options": [
      "2.4 V",
      "60 V",
      "0.016 V",
      "28.8 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "ohms-law",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Voltage drop (V) = Current (I) x Resistance (R). 12A * 0.2 Ω = 2.4 V."
  },
  {
    "id": 4074,
    "question": "While using an oscilloscope to test an AC signal, the technician observes that one full cycle takes 0.01 seconds (10ms). What is the frequency of this signal?",
    "options": [
      "100 Hz",
      "10 Hz",
      "50 Hz",
      "0.01 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "sine-wave",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Frequency (f) = 1 / Period (T). f = 1 / 0.01 = 100 Hz."
  },
  {
    "id": 4075,
    "question": "A step-down transformer has a turns ratio of 20:1. If an electrician measures 240V AC at the primary input, what should they expect to measure at the secondary output?",
    "options": [
      "12V AC",
      "4800V AC",
      "240V AC",
      "12V DC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "transformers",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The voltage ratio is equal to the turns ratio (Vp/Vs = Np/Ns). 240 / Vs = 20 / 1. Therefore, Vs = 240 / 20 = 12V AC."
  },
  {
    "id": 4076,
    "question": "An electrician is performing an insulation resistance test on a new circuit. Why is the test voltage typically set to 500V DC for a 230V AC installation?",
    "options": [
      "To stress the insulation to ensure it can withstand voltage spikes above nominal levels",
      "Because DC travels faster through copper than AC during a test",
      "To ensure the circuit breakers do not trip during the measurement",
      "Because 500V is the sum of the line and neutral voltages"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "conceptual",
      "ac-dc",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Insulation resistance tests use a higher DC voltage to stress the dielectric material of the insulation, ensuring it can handle potential overvoltages without breaking down."
  },
  {
    "id": 4077,
    "question": "During a continuity test of a ring final circuit, an electrician measures two 10 ohm resistors connected in parallel. What should the total resistance reading be?",
    "options": [
      "5 ohms",
      "20 ohms",
      "100 ohms",
      "0.1 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one (Rt = R / n). 10 / 2 = 5 ohms."
  },
  {
    "id": 4078,
    "question": "Which instrument is specifically designed to measure very low values of resistance, such as those found in protective bonding conductors?",
    "options": [
      "A low-resistance ohmmeter (continuity tester)",
      "An insulation resistance tester",
      "A high-voltage discharge probe",
      "A kilovolt meter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "discrimination",
      "terminology",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Continuity testers are designed to measure low resistance (typically 0.01 to 100 ohms) using a low voltage, whereas IR testers measure high resistance (megohms) using high voltage."
  },
  {
    "id": 4079,
    "question": "If a heating element is tested and found to have a resistance of 46 ohms when connected to a 230V supply, what is the current flowing through it?",
    "options": [
      "5 A",
      "10.58 kA",
      "0.2 A",
      "10,580 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "WRONG_UNITS"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "ohms-law",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R): 230V / 46 ohms = 5A."
  },
  {
    "id": 4080,
    "question": "When using a digital multimeter to measure the mains voltage in a domestic property, the reading of 230V represents which value of the AC sine wave?",
    "options": [
      "Root Mean Square (RMS) value",
      "Peak value",
      "Average value",
      "Peak-to-Peak value"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "OTHER",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "sine-wave",
      "rms-peak",
      "discrimination"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Standard multimeters are calibrated to show the RMS (Root Mean Square) value of an AC supply, which is the equivalent DC heating value."
  },
  {
    "id": 4081,
    "question": "An electrician notes that the resistance of a copper conductor increases as the building warms up. This physical principle is known as:",
    "options": [
      "Positive temperature coefficient",
      "Negative temperature coefficient",
      "Magnetic hysteresis",
      "Mutual induction"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "conceptual",
      "resistance-rule",
      "terminology"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Copper is a conductor with a positive temperature coefficient, meaning its resistance increases as its temperature rises."
  },
  {
    "id": 4082,
    "question": "While testing a transformer, an electrician measures 230V on the primary winding and 23V on the secondary winding. What is the turns ratio of this transformer?",
    "options": [
      "10:1",
      "1:10",
      "23:1",
      "207:1"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "transformers",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The turns ratio is proportional to the voltage ratio (Vp/Vs). 230 / 23 = 10, so the ratio is 10:1."
  },
  {
    "id": 4083,
    "question": "A test on a circuit shows a current of 10A flowing through a total circuit resistance of 2 ohms. What is the power dissipated by the circuit?",
    "options": [
      "200 W",
      "20 W",
      "50 W",
      "100 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "power",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Power is calculated using P = I²R. So, 10² * 2 = 100 * 2 = 200 Watts."
  },
  {
    "id": 4084,
    "question": "Which of the following describes the relationship between current and voltage in a purely resistive AC circuit during a test?",
    "options": [
      "Current and voltage are in phase",
      "Current leads voltage by 90 degrees",
      "Voltage leads current by 90 degrees",
      "Current and voltage are 180 degrees out of phase"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "conceptual",
      "sine-wave",
      "ac-dc"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a purely resistive circuit, there is no reactance to cause a phase shift, so the current and voltage peaks occur at the same time (in phase)."
  },
  {
    "id": 4085,
    "question": "An oscilloscope used during a diagnostic test shows one full cycle of a sine wave occupies 20 milliseconds (0.02 seconds). What is the frequency of the supply?",
    "options": [
      "50 Hz",
      "60 Hz",
      "100 Hz",
      "20 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "frequency",
      "calculation",
      "sine-wave"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Frequency is the reciprocal of the period (f = 1 / T). 1 / 0.02s = 50 Hz."
  },
  {
    "id": 4086,
    "question": "An electrician is testing a component that relies on mutual induction to function. Which of the following components will only operate when connected to an alternating current (AC) supply?",
    "options": [
      "A double-wound transformer",
      "A carbon film resistor",
      "A tungsten filament lamp",
      "A permanent magnet DC motor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "ac-dc",
      "transformers",
      "electromagnetic-induction"
    ],
    "learningOutcomeId": "202-TETS-LO6",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Transformers require a changing magnetic field to induce a voltage in the secondary winding. This is provided by the continuously changing direction and magnitude of alternating current (AC)."
  },
  {
    "id": 4087,
    "question": "During a circuit test, an electrician connects three resistors of 10Ω, 20Ω, and 30Ω in a series configuration. If the total current measured at the start of the circuit is 2A, what is the current flowing through the 30Ω resistor?",
    "options": [
      "2.0 A",
      "0.66 A",
      "6.0 A",
      "0.33 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the current remains the same at all points. Therefore, the current through any individual resistor is equal to the total circuit current."
  },
  {
    "id": 4088,
    "question": "An electrician is performing a power consumption test on a 230V fixed heating appliance. If the resistance of the element is measured as 46Ω, what is the power dissipated by the appliance?",
    "options": [
      "1150 W",
      "5 W",
      "10580 W",
      "2116 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "power",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the formula P = V² / R. Power = (230 * 230) / 46 = 52900 / 46 = 1150 Watts (or 1.15 kW)."
  },
  {
    "id": 4089,
    "question": "When using an oscilloscope to test an AC waveform, the time taken for one complete cycle (the period) is measured as 0.02 seconds. What is the frequency of this supply?",
    "options": [
      "50 Hz",
      "0.02 Hz",
      "100 Hz",
      "20 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "sine-wave",
      "frequency",
      "calculation"
    ],
    "learningOutcomeId": "202-TETS-LO5",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Frequency (f) is the reciprocal of the period (T). f = 1 / T. Therefore, 1 / 0.02 = 50 Hz."
  },
  {
    "id": 4090,
    "question": "A digital multimeter is used to test the voltage at a UK plug socket and displays a reading of 230V. This value represents which specific measurement of the AC sine wave?",
    "options": [
      "The Root Mean Square (RMS) value",
      "The Peak-to-Peak voltage",
      "The Maximum Peak voltage",
      "The Average rectified voltage"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "rms-peak",
      "sine-wave",
      "discrimination"
    ],
    "learningOutcomeId": "202-TETS-LO5",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Standard test instruments like multimeters are calibrated to show the RMS (Root Mean Square) value of an AC supply, which is the equivalent DC heating value."
  },
  {
    "id": 4091,
    "question": "A technician is verifying a mixed circuit containing three resistors. Two 30 Ω resistors are connected in parallel, and this combination is in series with a 15 Ω resistor. What is the expected total resistance (Rt) reading during a continuity test?",
    "options": [
      "30 Ω",
      "75 Ω",
      "10 Ω",
      "45 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "USED_PARALLEL_RULE",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "mixed-circuit",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "First, calculate the parallel section: (30 * 30) / (30 + 30) = 15 Ω. Then add the series resistor: 15 Ω + 15 Ω = 30 Ω."
  },
  {
    "id": 4092,
    "question": "During a site inspection, a continuity test on a copper conductor yields a higher resistance in the afternoon when the ambient temperature is 35°C compared to a morning reading at 10°C. Which scientific principle explains this?",
    "options": [
      "The positive temperature coefficient of copper",
      "The increase in magnetic permeability of the conduit",
      "The reduction of cross-sectional area due to thermal expansion",
      "The dielectric breakdown of the cable insulation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "resistance-rule",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Copper has a positive temperature coefficient, meaning its resistance increases as the temperature rises due to increased molecular vibration hindering electron flow."
  },
  {
    "id": 4093,
    "question": "An Insulation Resistance (IR) tester is used to apply 500V DC to a circuit. Why is DC used for this specific test rather than AC, even if the circuit normally operates on a 230V AC supply?",
    "options": [
      "To eliminate the effects of capacitive reactance in the cable",
      "To ensure the peak voltage reaches 707V",
      "Because AC cannot penetrate PVC insulation",
      "To prevent the transformer in the tester from overheating"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "ac-dc",
      "conceptual",
      "sine-wave"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "DC is used in IR testing to avoid the charging current caused by the capacitance of the cables, which would occur with AC and result in an inaccurate (lower) resistance reading."
  },
  {
    "id": 4094,
    "question": "An electrician measures an insulation resistance of 2.0 MΩ on a 230V circuit. Using Ohm's Law, what is the calculated leakage current flowing through the insulation?",
    "options": [
      "115 µA",
      "460 µA",
      "0.115 mA",
      "11.5 mA"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "WRONG_UNITS",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "ohms-law",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "I = V / R. I = 230 / 2,000,000 = 0.000115 Amps. Converting to microamps: 0.000115 * 1,000,000 = 115 µA."
  },
  {
    "id": 4095,
    "question": "When using a clamp meter to measure the current in a load, clamping the meter around both the line and neutral conductors simultaneously results in a reading of 0A. What scientific phenomenon causes this?",
    "options": [
      "Magnetic flux cancellation",
      "Electrostatic shielding",
      "The Hall Effect saturation",
      "Mutual induction interference"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "magnetism",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a healthy circuit, the current in the line and neutral is equal but opposite in direction. Their magnetic fields cancel each other out, resulting in a net flux of zero for the clamp meter to detect."
  },
  {
    "id": 4096,
    "question": "A 50-meter radial circuit is wired in 2.5mm² copper cable (18.1 mΩ/m). If the measured R1+Rn value is 1.81 Ω, what does this indicate about the circuit's condition?",
    "options": [
      "The circuit is correctly wired as a radial",
      "There is a high-resistance joint in the line conductor",
      "The circuit has been cross-connected into a ring",
      "The measurement is exactly double the expected value"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "resistance-rule",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Expected resistance for one conductor is 50m * 18.1mΩ/m = 0.905 Ω. For R1+Rn (two conductors), it is 0.905 * 2 = 1.81 Ω. The reading is correct."
  },
  {
    "id": 4097,
    "question": "Which instrument uses the principle of electromagnetic induction to measure the current flowing in a conductor without breaking the circuit?",
    "options": [
      "Split-core current transformer (Clamp meter)",
      "Galvanometer in series",
      "Shunt-resistor ammeter",
      "Electrostatic voltmeter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "electromagnetic-induction",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "A clamp meter acts as a transformer; the conductor being measured is the primary winding, and the internal coil of the clamp is the secondary."
  },
  {
    "id": 4098,
    "question": "A digital multimeter is set to the 200 Ω range to test a heating element. The display shows '1'. What does this '1' (or 'OL') typically signify in the context of circuit science?",
    "options": [
      "The resistance exceeds the selected range (Open circuit)",
      "The circuit has exactly 1 Ohm of resistance",
      "The battery in the tester is at 1% capacity",
      "The circuit is perfectly continuous"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "UNITS_MISSING"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "resistance-rule",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "An 'OL' or '1' on a digital meter indicates 'Over Limit' or 'Open Loop', meaning the resistance is higher than the meter can measure on that scale."
  },
  {
    "id": 4099,
    "question": "If a technician fails to 'null' their test leads before a low-resistance continuity test, how will this affect the scientific validity of the results?",
    "options": [
      "The reading will be artificially high due to lead resistance",
      "The reading will be lower than the actual circuit resistance",
      "The meter will fuse due to excessive current",
      "The magnetic field of the leads will interfere with the battery"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "SIGN_ERROR",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "resistance-rule",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-TETS-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Test leads have their own resistance (typically 0.1 Ω to 0.3 Ω). Failing to null them adds this value to the circuit measurement, leading to an inaccurate, higher result."
  },
  {
    "id": 4100,
    "question": "A 230V AC sine wave is being monitored on an oscilloscope during a power quality test. If the RMS voltage is 230V, what is the approximate peak-to-peak voltage the insulation must withstand?",
    "options": [
      "650 V",
      "325 V",
      "460 V",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "test",
    "tags": [
      "sine-wave",
      "rms-peak",
      "calculation"
    ],
    "learningOutcomeId": "202-TETS-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Peak voltage (Vp) = RMS * 1.414 = 230 * 1.414 ≈ 325V. Peak-to-peak voltage (Vpp) is double the peak: 325 * 2 = 650V."
  }
];
