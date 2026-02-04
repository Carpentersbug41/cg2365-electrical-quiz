import { TaggedQuestion } from './types';

/**
 * Sequential Generator Test Question Bank
 * Aligned with lesson 203-TEST learning outcomes
 * Generated: 2026-02-04
 */

export const sequentialGeneratorTestQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary reason for following a specific sequence when testing an electrical installation?",
    "options": [
      "To ensure the safety of the person testing and prevent damage to the installation",
      "To ensure the testing is completed in the shortest possible time",
      "To allow the use of a single testing instrument for all tests",
      "To ensure the battery life of the test equipment is preserved"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "health-safety",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Safety is the paramount concern in electrical testing. Following a sequence ensures that fundamental safety paths (like earthing) are verified before the system is energized or subjected to higher voltage tests."
  },
  {
    "id": 4017,
    "question": "Which of these tests is typically carried out first in the standard sequence of dead tests?",
    "options": [
      "Continuity of protective conductors",
      "Insulation resistance",
      "Polarity (dead test)",
      "Earth fault loop impedance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Continuity of protective conductors is the first test to ensure that a continuous path to earth exists for safety before any other tests are performed."
  },
  {
    "id": 4018,
    "question": "An electrician is testing a new radial circuit. After successfully completing the continuity of protective conductors, what is the next logical dead test in the sequence?",
    "options": [
      "Insulation resistance",
      "Functional testing",
      "Earth fault loop impedance",
      "RCD operation test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "After protective conductor continuity, insulation resistance is performed to ensure there are no short circuits or leakage paths between conductors before the circuit is ever made live."
  },
  {
    "id": 4019,
    "question": "Why must 'dead tests' be completed and verified before 'live tests' are started?",
    "options": [
      "To ensure the installation is safe to be energized for the live tests",
      "Because dead tests require higher current than live tests",
      "Because the testing instruments for live tests only work if dead tests are done",
      "To prevent the utility meter from recording the test energy"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Dead tests identify faults that could cause a danger to life or damage to the installation if power were applied."
  },
  {
    "id": 4020,
    "question": "Which instrument is the correct choice for performing the initial continuity test in a sequence?",
    "options": [
      "Low resistance ohm meter",
      "Insulation resistance tester set to 500V",
      "Earth electrode tester",
      "Voltmeter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Continuity tests require a low resistance ohm meter (typically using a low voltage DC source) to accurately measure the small resistance of copper conductors."
  },
  {
    "id": 4021,
    "question": "A student has just confirmed the polarity of a circuit while it is dead. According to the standard sequence, which of these would be the first 'live' test performed after the board is energized?",
    "options": [
      "Earth fault loop impedance (Zs)",
      "Insulation resistance",
      "Continuity of protective conductors",
      "Resistance of the phase conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Once the installation is live, Earth Fault Loop Impedance (Zs) is usually the first live test to verify that the protective device will trip under fault conditions."
  },
  {
    "id": 4022,
    "question": "In a sequential test procedure, what is the 'polarity' test specifically checking?",
    "options": [
      "That the phase conductor is connected to the correct terminals of switches and fuses",
      "That the earth wire is colored green and yellow correctly",
      "That the supply is alternating current (AC) and not direct current (DC)",
      "That the circuit breakers are of the correct 'Type' (e.g., Type B)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Polarity ensures that switches and protective devices are placed in the line (phase) conductor, not the neutral, so that the circuit is safely isolated when the switch is off."
  },
  {
    "id": 4023,
    "question": "Which of the following is categorized as a 'Live Test' in a sequential testing procedure?",
    "options": [
      "RCD operation test",
      "Continuity of protective conductors",
      "Insulation resistance",
      "Continuity of ring final conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "RCD testing requires the circuit to be energized at normal supply voltage to measure the disconnection time, making it a live test."
  },
  {
    "id": 4024,
    "question": "While following a test sequence, an electrician finds a reading of 0.02 MΩ during an Insulation Resistance test. What is the correct action to take?",
    "options": [
      "Investigate and rectify the fault before proceeding to any further tests",
      "Proceed to live testing as the value is above zero",
      "Increase the test voltage to 1000V to clear the fault",
      "Record the value and move to the polarity test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "0.02 MΩ is well below the minimum acceptable limit (usually 1.0 MΩ for new installations). The fault must be fixed before the installation is energized to prevent danger."
  },
  {
    "id": 4025,
    "question": "What is the purpose of the 'Prospective Fault Current' (PFC) test in the live test sequence?",
    "options": [
      "To ensure protective devices can safely interrupt the maximum possible current at that point",
      "To calculate the total energy consumption of the building",
      "To measure the resistance of the earth electrode in the garden",
      "To check if the voltage drop is within the 3% limit for lighting"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "UNITS_MISSING"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "PFC testing ensures that the breaking capacity of the circuit breakers or fuses is higher than the highest current that could flow during a fault."
  },
  {
    "id": 4026,
    "question": "In the correct sequence of electrical testing, why are 'dead' tests carried out before 'live' tests?",
    "options": [
      "To ensure the safety of the person testing and the installation",
      "Because dead tests require more battery power",
      "To allow the circuit to warm up before applying voltage",
      "Because live tests can only be done during the day"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "health-safety",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Safety is the primary concern in electrical testing. Performing dead tests first ensures there are no major faults before the installation is energized."
  },
  {
    "id": 4027,
    "question": "When testing a circuit, which electrical property is measured to determine the flow of electrons through a conductor?",
    "options": [
      "Current",
      "Voltage",
      "Resistance",
      "Frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_CURRENT"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "terminology",
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Current is the measure of the rate of flow of electrons in a circuit, measured in Amperes (A)."
  },
  {
    "id": 4028,
    "question": "Using Ohm's Law, if a test shows a circuit has a constant resistance, what will happen to the current if the supply voltage is doubled?",
    "options": [
      "The current will double",
      "The current will be halved",
      "The current will stay the same",
      "The current will drop to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "ohms-law",
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Ohm's Law (I = V/R) states that current is directly proportional to voltage. If voltage doubles and resistance is constant, the current also doubles."
  },
  {
    "id": 4029,
    "question": "Which of these instruments would an electrician use to measure the resistance of a conductor during a dead test?",
    "options": [
      "Ohmmeter",
      "Voltmeter",
      "Ammeter",
      "Wattmeter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "WRONG_UNITS"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "units",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Resistance is measured in Ohms using an Ohmmeter (often part of a multi-function tester)."
  },
  {
    "id": 4030,
    "question": "An electrician is testing two heating elements connected in series. If each element has a resistance of 25Ω, what should the total resistance reading be?",
    "options": [
      "50Ω",
      "12.5Ω",
      "25Ω",
      "625Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "series",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2). Therefore, 25Ω + 25Ω = 50Ω."
  },
  {
    "id": 4031,
    "question": "Why is it essential to follow a specific sequence when testing an electrical generator and its associated circuits?",
    "options": [
      "To ensure that safety-critical 'dead' tests are completed before the system is energised",
      "To ensure the generator reaches its maximum operating temperature before testing",
      "To allow the magnetic fields in the windings to dissipate completely",
      "To prevent the digital multimeter from blowing its internal fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Introduction to test concepts",
    "category": "Science 2365 Level 2",
    "tags": [
      "health-safety",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Safety is the primary driver for sequential testing. By performing 'dead' tests (continuity and insulation resistance) first, we ensure the installation is safe to receive power before 'live' tests are attempted."
  },
  {
    "id": 4032,
    "question": "Which instrument is specifically required to perform the initial continuity test of the protective conductors in a generator installation?",
    "options": [
      "A low-resistance ohmmeter",
      "A high-voltage insulation resistance tester",
      "A standard voltmeter set to the 600V AC range",
      "A clamp meter measuring current in the neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Core testing principles",
    "category": "Science 2365 Level 2",
    "tags": [
      "units",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Continuity testing requires a low-resistance ohmmeter (usually delivering at least 200mA) to accurately measure very small resistance values in protective conductors."
  },
  {
    "id": 4033,
    "question": "An electrician has confirmed the continuity of the earth path (0.04 Ω) for a new generator. What is the next logical step in the sequential test procedure?",
    "options": [
      "Insulation resistance testing",
      "Functional testing of the generator governor",
      "Phase rotation testing",
      "Measuring the output voltage under full load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Practical test applications",
    "category": "Science 2365 Level 2",
    "tags": [
      "application",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Following continuity, insulation resistance is the next 'dead' test in the sequence to ensure there are no short circuits or leakage paths to earth before energisation."
  },
  {
    "id": 4034,
    "question": "In the context of generator science, why is a 'dead' polarity test performed before the generator is started?",
    "options": [
      "To verify that single-pole control devices are connected in the line conductor",
      "To ensure the generator is rotating in a clockwise direction",
      "To calibrate the frequency meter against the engine RPM",
      "To check if the fuel solenoid is receiving the correct DC voltage"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Core testing principles",
    "category": "Science 2365 Level 2",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Polarity testing ensures that switches and circuit breakers are placed in the 'live' (line) conductor, which is a critical safety requirement for disconnecting power."
  },
  {
    "id": 4035,
    "question": "A student is asked to identify the correct sequence of tests for a generator installation. Which order is correct?",
    "options": [
      "Continuity, Insulation Resistance, Polarity, Live Testing",
      "Live Testing, Polarity, Continuity, Insulation Resistance",
      "Insulation Resistance, Live Testing, Continuity, Polarity",
      "Polarity, Live Testing, Insulation Resistance, Continuity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Introduction to test concepts",
    "category": "Science 2365 Level 2",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The standard sequence always begins with dead tests (Continuity and IR) followed by polarity and finally live functional/voltage tests."
  },
  {
    "id": 4036,
    "question": "During an insulation resistance test on a 230V generator's windings, a reading of 0.45 MΩ is obtained. What does this result indicate to the tester?",
    "options": [
      "The insulation is failing and the system should not be energised",
      "The insulation is in excellent condition for a Level 2 installation",
      "The test was performed at the wrong frequency",
      "The resistance is too low because the generator is currently running"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Practical test applications",
    "category": "Science 2365 Level 2",
    "tags": [
      "application",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For a standard 230V system, the minimum acceptable insulation resistance is 1.0 MΩ. A reading of 0.45 MΩ is a fail and indicates a fault."
  },
  {
    "id": 4037,
    "question": "What scientific principle explains why an insulation resistance tester uses a high DC voltage (e.g., 500V) rather than a low-voltage battery?",
    "options": [
      "To stress the insulation enough to identify potential leakage paths",
      "To match the AC frequency of the generator output",
      "To overcome the high inductance of the generator windings",
      "To ensure the magnetism in the rotor is correctly aligned"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Core testing principles",
    "category": "Science 2365 Level 2",
    "tags": [
      "conceptual",
      "ac-dc"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "High DC voltage is used in IR testing to 'stress' the insulation, allowing the meter to detect small leakage currents that wouldn't be apparent at low voltages."
  },
  {
    "id": 4038,
    "question": "Which of these units would be expected when recording the result of a generator's winding continuity test?",
    "options": [
      "Ohms (Ω)",
      "Megohms (MΩ)",
      "Hertz (Hz)",
      "Microfarads (μF)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "WRONG_UNITS"
    },
    "section": "Introduction to test concepts",
    "category": "Science 2365 Level 2",
    "tags": [
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Continuity measures the resistance of a conductor, which is a low value recorded in Ohms (Ω). MΩ is used for insulation resistance."
  },
  {
    "id": 4039,
    "question": "A generator is started for the 'live' phase of the sequential test. The output voltage is 230V, but the frequency is measured at 55Hz. What does this indicate about the generator's state?",
    "options": [
      "The engine speed (RPM) is too high",
      "The magnetic field strength is too low",
      "The output windings have a short circuit",
      "The insulation resistance is decreasing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Practical test applications",
    "category": "Science 2365 Level 2",
    "tags": [
      "application",
      "frequency",
      "sine-wave"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In an AC generator, the frequency is directly proportional to the rotational speed of the engine/rotor. 55Hz (above 50Hz) indicates the engine is running too fast."
  },
  {
    "id": 4040,
    "question": "During the final stage of a sequential generator test, why is a load test performed?",
    "options": [
      "To verify that the generator can maintain voltage and frequency under demand",
      "To ensure the insulation resistance increases as the windings get hot",
      "To check that the earth electrode resistance decreases when current flows",
      "To discharge the capacitors used in the starting circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Practical test applications",
    "category": "Science 2365 Level 2",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A load test is the functional culmination of the sequence, ensuring the generator's governor and AVR (Automatic Voltage Regulator) respond correctly to electrical demand."
  },
  {
    "id": 4041,
    "question": "Which specific component is used in a DC generator to ensure the output current flows in only one direction through the external circuit?",
    "options": [
      "A split-ring commutator",
      "A pair of slip rings",
      "A set of permanent magnets",
      "A laminated iron core"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "ac-dc",
      "generator-components",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A split-ring commutator acts as a mechanical rectifier, reversing the connections to the external circuit every half-turn to maintain a DC output."
  },
  {
    "id": 4042,
    "question": "In the sequence of electromagnetic induction, what happens to the induced EMF if the speed of the conductor through the magnetic field is doubled while the magnetic flux density remains constant?",
    "options": [
      "The induced EMF doubles",
      "The induced EMF remains the same",
      "The induced EMF is halved",
      "The induced EMF increases fourfold"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "electromagnetic-induction",
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Induced EMF is directly proportional to the rate of cutting flux; therefore, doubling the speed doubles the rate of cutting and the resulting EMF."
  },
  {
    "id": 4043,
    "question": "A 4-pole AC generator is rotating at a speed of 1500 revolutions per minute (RPM). Calculate the frequency of the generated output.",
    "options": [
      "50 Hz",
      "100 Hz",
      "25 Hz",
      "60 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "frequency",
      "calculation",
      "sine-wave"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Frequency (f) = (Number of poles × RPM) / 120. So, (4 × 1500) / 120 = 6000 / 120 = 50 Hz."
  },
  {
    "id": 4044,
    "question": "When applying Fleming's Right Hand Rule to a generator, what does the 'Second Finger' represent in the sequence of induction?",
    "options": [
      "The direction of the induced current",
      "The direction of the magnetic field",
      "The direction of the motion of the conductor",
      "The direction of the magnetic poles"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "electromagnetic-induction",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In Fleming's Right Hand Rule: Thumb = Motion, First Finger = Field, Second Finger = Induced Current (I)."
  },
  {
    "id": 4045,
    "question": "In the context of a sequential test on a generator, what is the primary role of the 'Prime Mover'?",
    "options": [
      "To provide the mechanical energy to rotate the armature",
      "To provide the initial DC excitation for the magnets",
      "To regulate the output voltage to a constant 230V",
      "To collect the current from the rotating slip rings"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_AC_DC_GENERATOR_PARTS"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "generator-components",
      "conceptual",
      "energy"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The prime mover is the external source of mechanical energy (like a diesel engine or turbine) that rotates the generator's shaft."
  },
  {
    "id": 4046,
    "question": "A generator produces a sine wave with an RMS voltage of 230V. What is the approximate peak voltage (Vp) produced during the cycle?",
    "options": [
      "325 V",
      "162 V",
      "460 V",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "rms-peak",
      "calculation",
      "sine-wave"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Peak voltage = RMS × 1.414. Therefore, 230V × 1.414 ≈ 325V."
  },
  {
    "id": 4047,
    "question": "At which point in a single rotation of a simple AC generator is the induced EMF at its maximum positive value?",
    "options": [
      "When the conductor is cutting the flux lines at 90 degrees",
      "When the conductor is moving parallel to the flux lines",
      "When the conductor is at the 180-degree position",
      "When the conductor is at the 0-degree starting position"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "SIGN_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "sine-wave",
      "conceptual",
      "electromagnetic-induction"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Maximum EMF is induced when the conductor cuts the magnetic flux at the maximum rate, which occurs at 90 degrees."
  },
  {
    "id": 4048,
    "question": "An electrician is testing a generator and notices the output frequency is 60Hz instead of 50Hz. To correct this, the sequence of operations should involve:",
    "options": [
      "Reducing the speed of the prime mover",
      "Increasing the strength of the magnetic field",
      "Adding more turns to the armature winding",
      "Replacing the slip rings with a commutator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "frequency",
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Frequency is directly proportional to the speed of rotation. If the frequency is too high, the rotational speed (RPM) must be reduced."
  },
  {
    "id": 4049,
    "question": "Which principle describes why a transformer cannot function if connected to a steady DC supply in a sequential test?",
    "options": [
      "A steady DC supply does not create a changing magnetic field",
      "DC supply has too much resistance for the primary coil",
      "The commutator in the transformer prevents DC flow",
      "The secondary coil only reacts to peak voltage values"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "transformers",
      "ac-dc",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Transformers rely on mutual induction, which requires a continually changing magnetic field produced by alternating current (AC)."
  },
  {
    "id": 4050,
    "question": "To produce a 60 Hz frequency from a 2-pole generator, at what speed (RPM) must the prime mover rotate the shaft?",
    "options": [
      "3600 RPM",
      "3000 RPM",
      "1800 RPM",
      "1500 RPM"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "frequency",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using RPM = (120 × f) / p: (120 × 60) / 2 = 7200 / 2 = 3600 RPM."
  },
  {
    "id": 4051,
    "question": "In a simple AC generator, what happens to the induced electromotive force (EMF) if the speed of rotation of the conductor within the magnetic field is doubled?",
    "options": [
      "The induced EMF doubles in magnitude",
      "The induced EMF remains the same but frequency increases",
      "The induced EMF is halved",
      "The induced EMF increases by four times"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "electromagnetic-induction",
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "According to Faraday's Law, the induced EMF is proportional to the rate of change of magnetic flux linkage. Doubling the speed doubles the rate at which the conductor cuts the flux, thereby doubling the EMF."
  },
  {
    "id": 4052,
    "question": "Which specific component is found in a DC generator to provide a unidirectional current output, which is not present in a standard AC alternator?",
    "options": [
      "A split-ring commutator",
      "A pair of continuous slip rings",
      "A set of permanent magnets",
      "A laminated steel armature core"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "generator-components",
      "discrimination",
      "ac-dc"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A DC generator uses a split-ring commutator to reverse the connections to the external circuit every half-turn, ensuring the current always flows in one direction. AC generators use continuous slip rings."
  },
  {
    "id": 4053,
    "question": "An electrician is testing a portable generator and measures a peak voltage (Vmax) of 325V on an oscilloscope. What is the equivalent Root Mean Square (RMS) voltage that would be displayed on a standard digital multimeter?",
    "options": [
      "230 V",
      "325 V",
      "460 V",
      "162.5 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "rms-peak",
      "sine-wave",
      "calculation"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To find the RMS voltage from the peak voltage, the formula is Vrms = Vmax × 0.707 (or Vmax / √2). 325V × 0.707 is approximately 230V."
  },
  {
    "id": 4054,
    "question": "A 4-pole AC generator is required to produce a standard UK frequency of 50 Hz. At what speed must the generator shaft be rotated?",
    "options": [
      "1500 rpm",
      "3000 rpm",
      "750 rpm",
      "100 rpm"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "frequency",
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Using the formula f = (N × P) / 120, where f is frequency, N is speed in rpm, and P is number of poles. Rearranging for N: N = (f × 120) / P. So, (50 × 120) / 4 = 1500 rpm."
  },
  {
    "id": 4055,
    "question": "During a site inspection, a generator output frequency is measured at 48 Hz instead of the required 50 Hz. Based on the principles of generator operation, which mechanical action would most likely correct this?",
    "options": [
      "Increase the speed of the prime mover",
      "Increase the number of poles in the alternator",
      "Increase the strength of the magnetic field",
      "Decrease the resistance of the connected load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Sequential Generator Test",
    "tags": [
      "frequency",
      "application",
      "generator-components"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The frequency of a generator is directly proportional to its rotational speed. If the frequency is low, the engine (prime mover) must be sped up to increase the cycles per second."
  },
  {
    "id": 4056,
    "question": "A technician is testing a double-wound transformer by connecting the primary winding to a 12V DC battery. After the initial connection, the voltmeter on the secondary winding reads 0V. What is the primary scientific reason for this result?",
    "options": [
      "A constant magnetic field cannot induce a current in the secondary winding because there is no change in flux linkage",
      "The 12V DC supply is of insufficient magnitude to overcome the reactance of the primary winding",
      "The secondary winding requires a commutator to convert the DC input into an AC output for induction",
      "DC current cannot flow through copper windings due to the high resistance of the primary coil"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Core testing principles",
    "category": "electromagnetic-induction",
    "tags": [
      "transformers",
      "ac-dc",
      "conceptual"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Faraday's Law of Induction states that an electromotive force is only induced when there is a change in magnetic flux linkage. Since DC provides a constant magnetic field, induction only occurs at the moment of switching on or off."
  },
  {
    "id": 4057,
    "question": "An oscilloscope displays a pure sine wave for a UK mains supply with a peak-to-peak voltage (Vp-p) of approximately 650V. What is the RMS voltage that would be used for standard circuit design calculations?",
    "options": [
      "230V",
      "325V",
      "460V",
      "400V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Introduction to test concepts",
    "category": "sine-wave",
    "tags": [
      "rms-peak",
      "calculation",
      "ac-dc"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Peak voltage is half of peak-to-peak (650V / 2 = 325V). RMS voltage is Peak x 0.707 (325V x 0.707 ≈ 230V)."
  },
  {
    "id": 4058,
    "question": "In a complex testing scenario, a circuit consists of two 40 Ω resistors connected in parallel, which are then connected in series with a single 10 Ω resistor. If the total supply voltage is 240V, what is the total current flowing from the source?",
    "options": [
      "8A",
      "12A",
      "2.66A",
      "4.8A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Practical test applications",
    "category": "mixed-circuit",
    "tags": [
      "parallel",
      "series",
      "ohms-law"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Parallel resistance (Rt1) = 40/2 = 20 Ω. Total resistance (Rt) = 20 Ω + 10 Ω = 30 Ω. Current (I) = V / Rt = 240V / 30 Ω = 8A."
  },
  {
    "id": 4059,
    "question": "A simple AC generator is being tested. If the speed of rotation of the armature is doubled, but the magnetic field strength of the permanent magnets is halved, what is the effect on the maximum induced EMF?",
    "options": [
      "The induced EMF remains the same",
      "The induced EMF is doubled",
      "The induced EMF is quadrupled",
      "The induced EMF is halved"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Core testing principles",
    "category": "electromagnetic-induction",
    "tags": [
      "generator-components",
      "conceptual",
      "magnetism"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Induced EMF (e) is proportional to flux density (B), length of conductor (l), and velocity (v). If v is x2 and B is x0.5, the result (e = B*l*v) remains unchanged."
  },
  {
    "id": 4060,
    "question": "During a component identification test, an electrician must distinguish between an AC alternator and a DC generator. Which specific component is found in the DC generator to ensure a unidirectional current output?",
    "options": [
      "A commutator",
      "Slip rings",
      "A transformer core",
      "A capacitor bank"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_GENERATOR_PARTS",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "OTHER"
    },
    "section": "Introduction to test concepts",
    "category": "generator-components",
    "tags": [
      "discrimination",
      "ac-dc",
      "terminology"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "A commutator is a rotary electrical switch that reverses the current direction between the rotor and the external circuit, rectifying AC to DC."
  },
  {
    "id": 4061,
    "question": "A 2.4 kW electric heater is used for a duration of 30 minutes during a thermal stability test. Calculate the total energy transferred in Megajoules (MJ).",
    "options": [
      "4.32 MJ",
      "72.0 MJ",
      "1.20 MJ",
      "4320 MJ"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Practical test applications",
    "category": "energy",
    "tags": [
      "power",
      "conversion",
      "calculation"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Energy (J) = Power (W) x Time (s). Energy = 2400W x (30 x 60s) = 4,320,000 J. Converting to MJ: 4,320,000 / 1,000,000 = 4.32 MJ."
  },
  {
    "id": 4062,
    "question": "When designing a magnetic relay for a control circuit, what is the primary purpose of using a 'soft' iron core rather than a 'hard' steel core?",
    "options": [
      "To ensure the core loses its magnetism quickly when the current is switched off",
      "To increase the permanent magnetic strength of the relay over time",
      "To reduce the electrical resistance of the coil windings",
      "To prevent the core from becoming hot due to eddy currents"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Core testing principles",
    "category": "magnetism",
    "tags": [
      "relays",
      "conceptual",
      "magnetic-poles"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Soft iron has high permeability but low retentivity, meaning it magnetizes and demagnetizes easily, which is essential for the rapid operation of a relay."
  },
  {
    "id": 4063,
    "question": "A 4-pole synchronous generator is being tested for use on a 50 Hz grid. At what speed in revolutions per minute (RPM) must the generator be driven to maintain this frequency?",
    "options": [
      "1500 RPM",
      "3000 RPM",
      "750 RPM",
      "1200 RPM"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Introduction to test concepts",
    "category": "generator-components",
    "tags": [
      "frequency",
      "calculation",
      "ac-dc"
    ],
    "learningOutcomeId": "203-TEST-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The formula is f = (P x N) / 120. Rearranging for N: N = (f x 120) / P. N = (50 x 120) / 4 = 1500 RPM."
  },
  {
    "id": 4064,
    "question": "An electrician is calculating the voltage drop for a 40-meter run of cable that has a resistance of 4 mΩ per meter. If the load current is 25A, what is the total voltage drop?",
    "options": [
      "4.0V",
      "0.1V",
      "0.4V",
      "1.6V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "WRONG_UNITS",
      "3": "DECIMAL_ERROR"
    },
    "section": "Practical test applications",
    "category": "ohms-law",
    "tags": [
      "calculation",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "203-TEST-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total resistance = 40m x 0.004 Ω/m = 0.16 Ω. Voltage drop = I x R = 25A x 0.16 Ω = 4.0V."
  },
  {
    "id": 4065,
    "question": "In a parallel circuit used for a load-sharing test, three resistors of 10 Ω, 20 Ω, and 50 Ω are connected to a constant voltage source. Which of the following statements is true regarding the current distribution?",
    "options": [
      "The 10 Ω resistor will carry the highest proportion of the total current",
      "The current is divided equally between all three resistors regardless of value",
      "The 50 Ω resistor will carry the highest proportion of the total current",
      "The total current is equal to the average of the currents in each branch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Core testing principles",
    "category": "parallel",
    "tags": [
      "current-rule",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-TEST-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a parallel circuit, the voltage is the same across all branches. According to Ohm's Law (I=V/R), the branch with the lowest resistance will draw the highest current."
  }
];
