import { TaggedQuestion } from './types';

/**
 * Dead-test language — what each test proves Question Bank
 * Aligned with lesson 204-10A learning outcomes
 * Generated: 2026-01-26
 */

export const deadTestLanguageWhatEachTestProvesQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "What is the primary purpose of a continuity test in an electrical installation?",
    "options": [
      "To prove that an unbroken path exists for current to flow",
      "To check if the insulation around a cable is damaged",
      "To ensure the circuit is connected to a 230V supply",
      "To verify that the line and neutral are not swapped"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "resistance-rule",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Continuity testing is used to confirm that a conductor is continuous (unbroken) from one end to the other, showing a low resistance path."
  },
  {
    "id": 4052,
    "question": "Which units are typically used when recording the results of an Insulation Resistance (IR) test?",
    "options": [
      "Megaohms (MΩ)",
      "Milliohms (mΩ)",
      "Ohms (Ω)",
      "Kilovolts (kV)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "UNITS_MISSING",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "units",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Insulation Resistance should be very high to prevent current leakage, so it is measured in Megaohms (millions of ohms)."
  },
  {
    "id": 4053,
    "question": "What core logic is being tested during an Insulation Resistance (IR) test?",
    "options": [
      "That conductors must not be connected to each other",
      "That conductors are correctly connected to each other",
      "That the circuit is connected to the Earth electrode",
      "That the switch is in the 'on' position"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "IR tests prove that there is no unwanted path (short circuit or leakage) between conductors; they 'must not' be connected."
  },
  {
    "id": 4054,
    "question": "An electrician performs a polarity test on a socket outlet. What is the main question this test answers?",
    "options": [
      "Is the Line conductor connected to the correct terminal?",
      "Is the total resistance of the circuit low enough?",
      "Is the insulation thick enough to prevent a shock?",
      "Is the frequency of the supply exactly 50 Hertz?"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Polarity testing is a 'correct placement' check to ensure conductors like Line and Neutral are connected to their designated terminals."
  },
  {
    "id": 4055,
    "question": "Which of the following describes a 'good' principle for a continuity reading on a short copper conductor?",
    "options": [
      "A very low resistance (low Ω)",
      "A very high resistance (high MΩ)",
      "A reading of exactly 230V",
      "A reading of 50 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "resistance-rule",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A good continuity reading means there is little resistance to current flow, resulting in a very low Ohm reading."
  },
  {
    "id": 4056,
    "question": "If an Insulation Resistance test shows a very low reading (e.g., 0.01 MΩ), what is the most likely conclusion?",
    "options": [
      "The result is suspicious and suggests a fault",
      "The result is good because the resistance is low",
      "The circuit is continuous and safe to energise",
      "The polarity of the circuit is correct"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For insulation, a 'bigger number is better'. A very low MΩ reading suggests that the insulation is failing or there is a short circuit."
  },
  {
    "id": 4057,
    "question": "When recording test results, what is the difference between a 'measurement' and a 'conclusion'?",
    "options": [
      "The measurement is the value from the tester; the conclusion is the pass/fail decision",
      "The measurement is the pass/fail decision; the conclusion is the value from the tester",
      "The measurement is done live; the conclusion is done while the circuit is dead",
      "There is no difference between a measurement and a conclusion"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The measurement is the raw data (e.g., 0.05 Ω), while the conclusion is the professional judgement (e.g., 'Pass')."
  },
  {
    "id": 4058,
    "question": "An electrician needs to check that a circuit's CPC (protective conductor) is not broken. Which test should they use?",
    "options": [
      "Continuity",
      "Insulation Resistance",
      "Polarity",
      "Frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Continuity tests are used to prove that a conductor (like the CPC) is unbroken and capable of carrying current."
  },
  {
    "id": 4059,
    "question": "Why is a polarity test considered a 'placement' check rather than a 'number' check?",
    "options": [
      "It verifies that conductors are in the right terminals, regardless of the resistance value",
      "It only measures the total number of sockets on a circuit",
      "It measures the voltage level to ensure it is not too high",
      "It is used to count the number of earthing points"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Polarity is about identity and location (e.g., is Line in the 'L' terminal?), not the specific ohmic value."
  },
  {
    "id": 4060,
    "question": "A student sees a reading of ' >999 MΩ ' on an insulation resistance tester. What does this suggest about the circuit?",
    "options": [
      "The insulation is in excellent condition",
      "There is a serious short-circuit fault",
      "The continuity of the conductor is broken",
      "The tester is set to the wrong units"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A very high Megaohm reading (often shown as 'greater than' the meter's limit) indicates that the insulation is effectively preventing any leakage."
  },
  {
    "id": 4061,
    "question": "What is the primary purpose of a continuity test in an electrical installation?",
    "options": [
      "To confirm that a conductor has an unbroken path from one end to the other",
      "To ensure that two separate conductors are not touching each other",
      "To check if the insulation material around the wire is high quality",
      "To measure the voltage level currently supplied to the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Continuity proves a continuous, unbroken path exists (low resistance). Insulation resistance proves conductors are separated (high resistance)."
  },
  {
    "id": 4062,
    "question": "While UK mains supply is AC, insulation resistance testers use a DC voltage to perform the test. What unit is the result recorded in?",
    "options": [
      "Megohms (MΩ)",
      "Ohms (Ω)",
      "Milliohms (mΩ)",
      "Hertz (Hz)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "units",
      "ac-dc",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Insulation resistance should be very high to prevent leakage, so it is measured in Megohms (millions of ohms)."
  },
  {
    "id": 4063,
    "question": "In a standard UK circuit, which test is specifically used to prove that the Line conductor is connected to the correct terminal?",
    "options": [
      "Polarity",
      "Continuity",
      "Insulation resistance",
      "Frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Polarity testing ensures that the Line, Neutral, and CPC are in their correct relative positions/terminals."
  },
  {
    "id": 4064,
    "question": "An electrician is checking a transformer winding to ensure the internal copper wire is not broken. Which test proves that the wire forms an unbroken path?",
    "options": [
      "Continuity",
      "Insulation resistance",
      "Polarity",
      "RMS voltage check"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "transformers",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A continuity test confirms the path is unbroken. If the transformer winding was broken, the resistance would be 'open circuit' (extremely high)."
  },
  {
    "id": 4065,
    "question": "What is the core logic behind an insulation resistance test performed on a dead circuit?",
    "options": [
      "Conductors that are supposed to be separate must not be connected",
      "Conductors that are part of the same circuit must have an unbroken path",
      "The Line conductor must be identified and placed in the right terminal",
      "The frequency of the circuit must be checked against the 50 Hz standard"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Insulation resistance proves that conductors 'must not be connected' to each other or earth, ensuring no current leaks through the insulation."
  },
  {
    "id": 4066,
    "question": "Which test is specifically designed to confirm that a circuit conductor provides an unbroken path from one end to the other?",
    "options": [
      "Continuity",
      "Insulation resistance",
      "Polarity",
      "Voltage drop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Continuity testing proves that a conductor is continuous (unbroken) and offers a low resistance path for current."
  },
  {
    "id": 4067,
    "question": "When performing an insulation resistance test on a healthy circuit, what type of reading would an electrician expect to see?",
    "options": [
      "A very high value measured in Megohms (MΩ)",
      "A very low value measured in Ohms (Ω)",
      "A very high value measured in Ohms (Ω)",
      "A very low value measured in Megohms (MΩ)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "UNITS_MISSING",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "units",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Insulation resistance measures the quality of the insulation between conductors; a 'good' result is a very high resistance, typically many millions of Ohms (Megohms)."
  },
  {
    "id": 4068,
    "question": "An electrician is concerned that a cable has been snapped inside a conduit during installation. Which dead test would best prove if the conductor is still in one piece?",
    "options": [
      "Continuity",
      "Insulation resistance",
      "Polarity",
      "Earth electrode testing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "calculation"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A continuity test proves the 'should be connected' logic; if the cable is snapped, the continuity test will show an open circuit (infinite resistance)."
  },
  {
    "id": 4069,
    "question": "What is the primary objective of performing a polarity test on a newly installed radial circuit?",
    "options": [
      "To ensure all switches and fuses are connected in the Line conductor",
      "To ensure the insulation is not damaged between Line and Neutral",
      "To ensure the circuit resistance is low enough to trip a breaker",
      "To ensure the CPC is connected to the Earth bar"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Polarity is about correct placement and identity, specifically ensuring that single-pole control devices are in the 'live' (Line) conductor."
  },
  {
    "id": 4070,
    "question": "Which of the following best describes the logic used when performing an insulation resistance (IR) test?",
    "options": [
      "Proving that conductors which should be separated are not connected",
      "Proving that conductors which should be joined have a low resistance",
      "Proving that the Line conductor is connected to the correct terminal",
      "Proving that the circuit can handle the connected load current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "IR testing follows the logic of 'must not be connected'. It checks that current cannot leak between conductors through damaged insulation."
  },
  {
    "id": 4071,
    "question": "During a dead test, an electrician records a reading of 0.02 MΩ between Line and Neutral. How should this result be initially interpreted?",
    "options": [
      "Suspicious, as it indicates a potential path between conductors",
      "Good, as it shows the conductors are well connected",
      "Good, as the resistance is low enough for current to flow",
      "Suspicious, as the reading should be measured in Ohms, not Megohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "units"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For IR tests, a low number (like 0.02 MΩ) is suspicious because it suggests the 'must not be connected' conductors are partially joined."
  },
  {
    "id": 4072,
    "question": "Why is the 'bigger number is always better' rule incorrect when applied to a continuity test?",
    "options": [
      "Because a high resistance indicates a poor or broken connection",
      "Because continuity is measured in Megohms, which are very large",
      "Because a high resistance indicates the insulation is working correctly",
      "Because continuity testers cannot measure numbers higher than 2.0 Ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In continuity, we want a low resistance (low Ω). A high number indicates a loose connection, a long run, or a partial break."
  },
  {
    "id": 4073,
    "question": "An electrician is testing a light switch to ensure it actually breaks the circuit when turned off. Which test and logic are they applying?",
    "options": [
      "Continuity - proving an unbroken path when closed and no path when open",
      "Insulation resistance - proving the switch plastic is safe to touch",
      "Polarity - proving the switch is the correct colour",
      "Voltage - proving there is 230V at the switch terminals"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Testing a switch involves checking continuity in the 'ON' position and a lack of continuity in the 'OFF' position."
  },
  {
    "id": 4074,
    "question": "Which of these is a 'conclusion' rather than a 'measurement' during dead testing?",
    "options": [
      "The circuit is safe to energise",
      "The resistance is 0.05 Ohms",
      "The insulation resistance is >999 Megohms",
      "The meter displays 'L-N OK'"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A measurement is the raw data (e.g., 0.05 Ohms). A conclusion is the professional judgment made based on that data (e.g., it is safe)."
  },
  {
    "id": 4075,
    "question": "If an electrician conducts an Insulation Resistance test between the Line conductor and the Earth conductor, what are they trying to prove?",
    "options": [
      "That the cable sheath/insulation has not been pierced by a screw into the CPC",
      "That the Line conductor is continuous from the consumer unit to the socket",
      "That the CPC is correctly connected to the Earth terminal of the socket",
      "That the switch is located in the Line conductor and not the Neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Testing IR between L and E proves that there is no 'unwanted path' (short circuit or leakage) caused by damage, such as a screw hitting the cable."
  },
  {
    "id": 4076,
    "question": "Which statement best describes the primary purpose of a continuity test on a circuit conductor?",
    "options": [
      "To prove there is a continuous, unbroken path of low resistance throughout the conductor",
      "To ensure the insulation around the conductor is not damaged or degraded",
      "To verify that the Line and Neutral conductors are connected to the correct terminals",
      "To measure the total power consumption of the circuit when it is energized"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "measurement",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Continuity tests prove that a conductor is 'continuous' (unbroken) and has a low resistance, ensuring current can flow as intended."
  },
  {
    "id": 4077,
    "question": "An electrician is testing between the Line and Neutral conductors of a disconnected circuit to ensure they are NOT accidentally touching. Which test is being performed?",
    "options": [
      "Insulation Resistance (IR)",
      "Continuity",
      "Polarity",
      "Voltage drop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "resistance-rule",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Insulation Resistance tests prove that conductors are isolated from each other (must not be connected)."
  },
  {
    "id": 4078,
    "question": "During an Insulation Resistance test on a newly installed radial circuit, the meter displays a reading of 0.02 MΩ. How should this result be interpreted conceptually?",
    "options": [
      "It is a suspicious reading indicating a potential short circuit or insulation failure",
      "It is a good reading because the resistance is very low",
      "It is a good reading because it shows the conductors are continuous",
      "It is a suspicious reading because the units should be in Ohms (Ω), not Megohms (MΩ)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "resistance-rule",
      "application",
      "units"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For IR tests, a very high resistance is required. 0.02 MΩ is extremely low for insulation, suggesting a path exists where it shouldn't."
  },
  {
    "id": 4079,
    "question": "What is the fundamental question an electrician is trying to answer when performing a polarity test?",
    "options": [
      "Is the Line conductor connected to the correct terminal at every point in the circuit?",
      "Is there a low-resistance path back to the consumer unit for fault current?",
      "Is the insulation thick enough to prevent leakage current between conductors?",
      "Does the circuit have a high enough frequency for the connected equipment?"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Polarity is about correct placement and identity—ensuring the 'Line' is in the 'Line' terminal, switches are in the Line conductor, etc."
  },
  {
    "id": 4080,
    "question": "An electrician measures the continuity of a protective conductor (CPC) and gets a reading of 0.45 Ω. Why is a low reading like this preferred over a high reading (e.g., 500 Ω)?",
    "options": [
      "Low resistance ensures fault current can flow easily to trigger protective devices",
      "Low resistance proves that the insulation is in good condition",
      "High resistance readings are safer because they limit the current flow during a fault",
      "Resistance for continuity must always be measured in Megohms (MΩ) to be valid"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "resistance-rule",
      "application",
      "calculation"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Continuity requires low resistance so that in the event of a fault, enough current flows to quickly trip the circuit breaker or blow the fuse."
  },
  {
    "id": 4081,
    "question": "Which of the following correctly pairs a dead test with its expected 'good' result and the units used for measurement?",
    "options": [
      "Insulation Resistance — Very high value — Megohms (MΩ)",
      "Continuity — Very high value — Ohms (Ω)",
      "Polarity — Very low value — Megohms (MΩ)",
      "Insulation Resistance — Very low value — Ohms (Ω)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "WRONG_UNITS",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "units",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "IR tests check for isolation, so we want a very high resistance measured in millions of Ohms (Megohms)."
  },
  {
    "id": 4082,
    "question": "After testing, an electrician records a 'Pass' for a continuity test. Which of the following describes the 'conclusion' drawn from this result?",
    "options": [
      "The conductor is unbroken and all connections are electrically sound",
      "The meter displayed a numerical reading of 0.22 Ω",
      "The insulation is preventing leakage to Earth",
      "The circuit is currently energized and safe for the user to operate"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A 'Pass' is the conclusion; it means the physical requirement (an unbroken path) has been met based on the measurement."
  },
  {
    "id": 4083,
    "question": "A circuit breaker trips every time a specific light switch is turned on. To investigate this while the circuit is isolated (dead), which test would most likely identify an internal short circuit?",
    "options": [
      "Insulation Resistance between Line and Neutral",
      "Continuity of the CPC conductor",
      "Polarity check of the switch terminals",
      "Frequency measurement of the incoming supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "discrimination",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A short circuit between L and N is an unwanted connection, which is detected by an Insulation Resistance test."
  },
  {
    "id": 4084,
    "question": "An electrician needs to prove that a screw has not pierced the cable and touched the copper cores. Which test is designed to prove this requirement?",
    "options": [
      "Insulation Resistance",
      "Continuity",
      "Polarity",
      "Phase rotation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Piercing the insulation creates an unwanted path; IR testing identifies if the insulation is still effectively isolating the cores."
  },
  {
    "id": 4085,
    "question": "Why is an Insulation Resistance test described as proving that conductors 'must not be connected'?",
    "options": [
      "It checks for unwanted paths where current might leak between conductors or to Earth",
      "It ensures the circuit loop is complete so current can flow to the load",
      "It verifies that the switch is in the 'OFF' position before work begins",
      "It calculates the total resistance of the appliances plugged into the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "conceptual",
      "terminology",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "IR testing is the 'must not be connected' test because we are looking for the absence of a path (high resistance)."
  },
  {
    "id": 4086,
    "question": "Which dead test is specifically designed to answer the question: 'Is there an unwanted path between the live conductors or to earth?'",
    "options": [
      "Insulation resistance",
      "Continuity of protective conductors",
      "Polarity",
      "Continuity of ring final conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Insulation resistance testing checks the quality of the insulation between conductors to ensure no 'unwanted paths' (short circuits or leakage) exist."
  },
  {
    "id": 4087,
    "question": "An electrician is performing a continuity test on a circuit and records a reading of 0.02 Ω. Based on the principles of dead testing, how should this result be interpreted?",
    "options": [
      "It is a good reading, suggesting a very low resistance and an unbroken path",
      "It is a suspicious reading, as continuity readings should be in MΩ",
      "It is a good reading, proving the insulation is of high quality",
      "It is a suspicious reading, suggesting there is a break in the conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "units",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Continuity tests look for a 'low Ω' reading. 0.02 Ω is a very low value, indicating a solid, unbroken electrical path."
  },
  {
    "id": 4088,
    "question": "What is the primary conceptual difference between a 'measurement' and a 'conclusion' when performing a polarity test?",
    "options": [
      "The measurement is the instrument reading; the conclusion is that the Line is in the right place",
      "The measurement is the insulation quality; the conclusion is that the circuit is safe to energise",
      "The measurement is the resistance in MΩ; the conclusion is that there are no short circuits",
      "The measurement is the voltage; the conclusion is the frequency of the AC supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In polarity testing, the measurement (often a low resistance reading) is used to reach the conclusion that the conductors are connected to the correct terminals (placement/identity)."
  },
  {
    "id": 4089,
    "question": "A technician is testing a newly installed transformer circuit while it is isolated. If the insulation resistance test returns a reading of >999 MΩ, what does this prove about the installation?",
    "options": [
      "The insulation is effectively preventing current leakage between conductors",
      "The transformer windings have an unbroken path for current to flow",
      "The AC frequency will be stable once the circuit is energised",
      "The primary and secondary coils are correctly connected in series"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "units",
      "transformers"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A very high MΩ reading (Megaohms) in an insulation resistance test proves that the conductors are well-isolated and there is no significant leakage path."
  },
  {
    "id": 4090,
    "question": "When preparing to energise a UK mains circuit, why must a polarity test be completed before the circuit is made live with AC voltage?",
    "options": [
      "To ensure single-pole switches are in the Line conductor, not the Neutral",
      "To calculate the peak-to-peak voltage of the sine wave",
      "To verify that the insulation can withstand 230V RMS",
      "To ensure the frequency of the circuit is exactly 50 Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_RMS_WITH_PEAK",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "discrimination",
      "conceptual",
      "ac-dc"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Polarity ensures that devices like switches and fuses are correctly located in the Line conductor, which is a critical safety requirement before the AC supply is connected."
  },
  {
    "id": 4091,
    "question": "When performing dead tests on a new radial circuit, an electrician records a resistance of 0.02 Ω for the circuit conductors. What is the fundamental conclusion regarding the 'Continuity' of this circuit?",
    "options": [
      "The circuit provides a continuous, unbroken path with low resistance",
      "The insulation material is of high quality and prevents leakage",
      "The conductors are connected to the correct terminals in the consumer unit",
      "The circuit is safe to be energized immediately without further testing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "explanation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Continuity tests prove that there is an intentional, unbroken path (low resistance) for current to flow. It does not verify insulation quality or correct terminal placement (polarity)."
  },
  {
    "id": 4092,
    "question": "An Insulation Resistance (IR) test is based on a specific logical principle regarding the relationship between conductors. Which statement best defines this principle?",
    "options": [
      "It proves that conductors that should be separate are not connected",
      "It proves that conductors that should be connected have a low-resistance path",
      "It verifies that the Line conductor is connected to the correct side of a switch",
      "It measures the total length of the cable by checking resistance per meter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Insulation Resistance (IR) tests the 'must not be connected' principle, ensuring that leakage current cannot jump between conductors (Line to Neutral, or Line to Earth)."
  },
  {
    "id": 4093,
    "question": "A trainee electrician is testing the continuity of a Circuit Protective Conductor (CPC). The instrument displays '>999 MΩ'. Why is this reading considered 'suspicious' or a failure for this specific test?",
    "options": [
      "A high resistance reading in a continuity test suggests a broken or open-circuit path",
      "Continuity tests must always result in a reading of exactly zero ohms",
      "The units are incorrect; continuity should only be measured in Megaohms",
      "A high reading indicates that the insulation has broken down and is leaking current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "For continuity, a 'good' reading is a low resistance (Ω). A high reading (MΩ) indicates that the intended path is broken or has a very poor connection."
  },
  {
    "id": 4094,
    "question": "Which of the following scenarios best describes a failure of 'Polarity' rather than a failure of Continuity or Insulation Resistance?",
    "options": [
      "The Line and Neutral conductors have been swapped at a socket outlet",
      "The resistance between Line and Earth is recorded as 0.05 Ω",
      "A conductor has snapped inside the conduit, creating an open circuit",
      "The insulation around the cable has melted, causing a short circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "discrimination",
      "safety"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Polarity is about the correct placement and identity of conductors. Swapping Line and Neutral is a polarity error, even if the circuit still has continuity and good insulation."
  },
  {
    "id": 4095,
    "question": "When verifying a single-pole light switch during dead testing, what is the primary safety conclusion we are trying to reach?",
    "options": [
      "That the switch is correctly placed in the Line conductor, not the Neutral",
      "That the switch has a resistance of less than 1.0 Ω when closed",
      "That the switch can withstand a high voltage without the insulation failing",
      "That the switch is connected in parallel with the light fitting"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Polarity testing ensures switches are in the Line conductor. If a switch were in the Neutral, the light fitting would remain live even when the switch is 'off'."
  },
  {
    "id": 4096,
    "question": "A measurement of 500 MΩ is obtained during a dead test. Which of the following correctly classifies this reading and the test it likely belongs to?",
    "options": [
      "A 'good' reading for an Insulation Resistance test",
      "A 'suspicious' reading for a Continuity test",
      "A 'good' reading for a Polarity placement check",
      "A 'suspicious' reading for an Insulation Resistance test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Insulation Resistance requires a very high resistance (MΩ) to prove that conductors are effectively isolated from each other. 500 MΩ is a very high, 'good' reading."
  },
  {
    "id": 4097,
    "question": "If an electrician is asked to prove that 'no unwanted paths exist between live conductors and earth', which test must they perform and what result are they looking for?",
    "options": [
      "Insulation Resistance test; looking for a very high MΩ reading",
      "Continuity test; looking for a very low Ω reading",
      "Polarity test; looking for the correct terminal identification",
      "Voltage drop test; looking for a result within 3% of the source"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "terminology",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Proving that 'no unwanted paths exist' is the definition of an Insulation Resistance test, which requires high resistance to prevent current flow between conductors."
  },
  {
    "id": 4098,
    "question": "What is the primary difference between a 'measurement' and a 'conclusion' in the context of dead testing?",
    "options": [
      "The measurement is the numerical value (e.g., 0.2 Ω); the conclusion is the interpretation (e.g., Pass)",
      "The measurement is done with the power on; the conclusion is reached with the power off",
      "The measurement is done by the apprentice; the conclusion is only made by the client",
      "The measurement is always in Ohms; the conclusion is always in Volts"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In testing, the 'measurement' is the raw data from the instrument, while the 'conclusion' is the professional judgment of whether that data indicates a safe or unsafe condition."
  },
  {
    "id": 4099,
    "question": "During the installation of a new socket outlet, why is it vital to perform a polarity test specifically, even if the continuity and IR tests have already passed?",
    "options": [
      "To ensure that the Line and Neutral have not been crossed, which would leave the device energized when switched off",
      "To ensure that the socket can deliver the full 13A of current without overheating",
      "To verify that the earth wire is thick enough to carry a fault current",
      "To check that the insulation around the terminals has not been damaged during installation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "application",
      "safety",
      "discrimination"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Even if conductors are continuous and well-insulated, if they are in the wrong place (e.g., Line connected to the Neutral terminal), the installation is dangerous."
  },
  {
    "id": 4100,
    "question": "A circuit is described as having 'integrity'. In the context of dead testing principles, what does this most likely mean?",
    "options": [
      "The circuit is continuous, correctly identified, and effectively isolated from other paths",
      "The circuit is able to operate at 50Hz without any fluctuations in frequency",
      "The circuit has been tested using a DC source rather than an AC source",
      "The circuit contains only high-quality copper conductors with no joints"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Dead-test language",
    "tags": [
      "terminology",
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "204-10A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Integrity implies that all three core principles are met: it is continuous (unbroken), polarized (correct placement), and insulated (isolated from unwanted paths)."
  }
];
