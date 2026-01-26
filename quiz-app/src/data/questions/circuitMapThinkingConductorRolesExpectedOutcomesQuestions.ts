import { TaggedQuestion } from './types';

/**
 * Circuit map thinking — conductor roles → expected outcomes Question Bank
 * Aligned with lesson 204-10B learning outcomes
 * Generated: 2026-01-26
 */

export const circuitMapThinkingConductorRolesExpectedOutcomesQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "Which conductor is specifically designed to provide a path for fault current to earth?",
    "options": [
      "Circuit Protective Conductor (CPC)",
      "Neutral conductor",
      "Switched Live conductor",
      "Permanent Live conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The CPC (Circuit Protective Conductor) is the dedicated conductor for fault current, whereas the Neutral is the return path for normal load current."
  },
  {
    "id": 4052,
    "question": "In a standard lighting circuit, which conductor is typically interrupted by the light switch to control the lamp?",
    "options": [
      "Line",
      "Neutral",
      "CPC",
      "Earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Standard UK practice is to switch the Line conductor. Switching the Neutral would leave the appliance live even when turned off."
  },
  {
    "id": 4053,
    "question": "A circuit has two conductors connected in series with resistances of 0.25 Ω and 0.15 Ω. What is the total resistance?",
    "options": [
      "0.40 Ω",
      "0.09 Ω",
      "0.10 Ω",
      "0.03 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "SIGN_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "series",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of individual resistances: 0.25 + 0.15 = 0.40 Ω."
  },
  {
    "id": 4054,
    "question": "What is the correct sequence for the standard dead-testing workflow?",
    "options": [
      "Inspect -> CPC continuity -> IR -> Polarity",
      "Polarity -> IR -> CPC continuity -> Inspect",
      "IR -> Polarity -> Inspect -> CPC continuity",
      "CPC continuity -> IR -> Inspect -> Polarity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The sequence starts with visual inspection, followed by confirming the safety path (CPC), then insulation integrity (IR), and finally that the conductors are in the right place (Polarity)."
  },
  {
    "id": 4055,
    "question": "If a circuit is correctly isolated, what should an Insulation Resistance (IR) test between Line and Neutral ideally show?",
    "options": [
      "A very high resistance (MΩ)",
      "A very low resistance (Ω)",
      "Zero resistance",
      "A resistance of exactly 1.0 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Insulation resistance tests for 'isolation' between conductors. A high Megohm (MΩ) reading indicates the conductors are properly isolated from each other."
  },
  {
    "id": 4056,
    "question": "Calculate the voltage drop across a conductor with a resistance of 0.5 Ω when a current of 10 A is flowing.",
    "options": [
      "5 V",
      "20 V",
      "10.5 V",
      "9.5 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using Ohm's Law (V = I x R): 10 A x 0.5 Ω = 5 V."
  },
  {
    "id": 4057,
    "question": "When mapping a circuit, which conductor acts as the return path for current under normal operating conditions?",
    "options": [
      "Neutral",
      "Line",
      "CPC",
      "Switched Live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Neutral conductor completes the circuit by providing the return path for current to the source under normal conditions."
  },
  {
    "id": 4058,
    "question": "A lighting circuit has a total resistance of 1.2 Ω. If the supply voltage is 230 V, what is the current that would flow if a short circuit occurred (ignoring other impedances)?",
    "options": [
      "191.67 A",
      "276 A",
      "228.8 A",
      "0.005 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "SIGN_ERROR",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R): 230 V / 1.2 Ω = 191.67 A."
  },
  {
    "id": 4059,
    "question": "An electrician finds a blue wire used as a switch live in a lighting circuit. According to circuit mapping principles, what must be done?",
    "options": [
      "Apply brown sleeving to identify its role as a Line conductor",
      "Replace the entire cable with one that has a brown core",
      "Connect it to the Neutral bar in the consumer unit",
      "Leave it as it is because the colour doesn't matter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Conductor roles must be clearly identified. If a core is used for a purpose other than its base colour (e.g., blue used as a live), it must be sleeved at terminations."
  },
  {
    "id": 4060,
    "question": "In a circuit map, which two conductors must show continuity (low resistance) between the consumer unit and a socket outlet?",
    "options": [
      "The Line conductor at the board and the Line at the socket",
      "The Line conductor and the CPC conductor",
      "The Neutral conductor and the CPC conductor",
      "The Line conductor and the Neutral conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Continuity testing confirms that the intended path (e.g., Line to Line) is unbroken and has low resistance."
  },
  {
    "id": 4061,
    "question": "In a domestic lighting circuit map, what is the specific role of the conductor that links the switch to the light fitting?",
    "options": [
      "Switched Live",
      "Neutral",
      "Permanent Live",
      "Circuit Protective Conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "terminology",
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Switched Live (SL) is the conductor that becomes live only when the switch is closed, carrying power from the switch to the load (lamp)."
  },
  {
    "id": 4062,
    "question": "Which of the following represents the correct standard sequence for performing dead tests on a new installation?",
    "options": [
      "Continuity of CPC -> Insulation Resistance -> Polarity",
      "Insulation Resistance -> Continuity of CPC -> Polarity",
      "Polarity -> Insulation Resistance -> Continuity of CPC",
      "Continuity of CPC -> Polarity -> Insulation Resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Standard dead testing starts with verifying the safety path (CPC continuity), followed by checking the integrity of the insulation (IR), and finally ensuring the conductors are connected correctly (Polarity)."
  },
  {
    "id": 4063,
    "question": "An electrician is checking the continuity of a 20-meter CPC. If the conductor has a resistance of 0.02Ω per meter, what is the expected total resistance (R2)?",
    "options": [
      "0.40Ω",
      "4.00Ω",
      "0.04Ω",
      "20.02Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Total resistance is calculated by multiplying the length by the resistance per meter: 20m * 0.02Ω/m = 0.40Ω."
  },
  {
    "id": 4064,
    "question": "During a circuit test, the Line conductor resistance (R1) is measured at 0.35Ω and the CPC resistance (R2) is 0.55Ω. What is the total R1+R2 value for this circuit?",
    "options": [
      "0.90Ω",
      "0.20Ω",
      "1.92Ω",
      "0.19Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The total resistance of the combined Line and CPC path (R1+R2) is the sum of the individual resistances: 0.35Ω + 0.55Ω = 0.90Ω."
  },
  {
    "id": 4065,
    "question": "If a circuit map shows a total R1+R2 value of 1.20Ω and the Line conductor (R1) is known to be 0.50Ω, what is the resistance of the CPC (R2)?",
    "options": [
      "0.70Ω",
      "1.70Ω",
      "0.60Ω",
      "2.40Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To find R2 when R1+R2 and R1 are known, subtract R1 from the total: 1.20Ω - 0.50Ω = 0.70Ω."
  },
  {
    "id": 4066,
    "question": "An electrician identifies a blue conductor sleeved with brown tape connected to the 'L1' terminal of a one-way switch. What is the functional role of this conductor?",
    "options": [
      "Switched Live",
      "Neutral",
      "Permanent Live",
      "Circuit Protective Conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In UK wiring, a blue conductor used as a live must be sleeved brown. In a switch, if it returns power to the load, its role is Switched Live."
  },
  {
    "id": 4067,
    "question": "When mapping a lighting circuit for continuity testing, which path is expected to show a low resistance (near 0 Ω) when the light switch is in the 'ON' position?",
    "options": [
      "Between the Permanent Live and Switched Live terminals",
      "Between the Line and Neutral conductors",
      "Between the Neutral and CPC conductors",
      "Between the Line and CPC conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "continuity",
      "application",
      "voltage-rule"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "When a switch is closed (ON), it creates a continuous path between the Permanent Live and Switched Live, resulting in low resistance."
  },
  {
    "id": 4068,
    "question": "A radial power circuit has a measured Line conductor resistance (R1) of 0.52 Ω and a CPC resistance (R2) of 0.86 Ω. What is the total R1+R2 resistance for this circuit?",
    "options": [
      "1.38 Ω",
      "0.34 Ω",
      "0.32 Ω",
      "0.45 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "USED_PARALLEL_RULE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "resistance-rule",
      "series"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "R1+R2 is a series calculation where the resistances of the Line and CPC are added together (0.52 + 0.86 = 1.38)."
  },
  {
    "id": 4069,
    "question": "During an Insulation Resistance (IR) test on a new circuit, a reading of 0.02 MΩ is obtained between Line and Neutral. What does this 'circuit map' outcome indicate?",
    "options": [
      "A likely short circuit or insulation failure",
      "A healthy circuit with high insulation quality",
      "An open circuit in the Neutral conductor",
      "The CPC is not correctly terminated"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "conceptual",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Insulation resistance should be very high (typically >200 MΩ). A reading of 0.02 MΩ (20,000 Ω) indicates a path exists where there should be isolation."
  },
  {
    "id": 4070,
    "question": "Two identical 20 Ω resistors are connected in parallel within a control panel. What is the total resistance of this parallel combination?",
    "options": [
      "10 Ω",
      "40 Ω",
      "20 Ω",
      "0.1 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (20 / 2 = 10)."
  },
  {
    "id": 4071,
    "question": "Which of the following describes the correct order for the standard dead-testing workflow on a completed installation?",
    "options": [
      "Inspection, CPC continuity, Insulation Resistance, Polarity",
      "Polarity, CPC continuity, Inspection, Insulation Resistance",
      "Insulation Resistance, Polarity, CPC continuity, Inspection",
      "CPC continuity, Inspection, Polarity, Insulation Resistance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "application",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "204-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Testing always begins with visual inspection, followed by ensuring the safety earth path (CPC) is intact before performing high-voltage IR tests and checking polarity."
  },
  {
    "id": 4072,
    "question": "A 230V circuit has a total resistance (Line + Neutral) of 0.25 Ω and carries a load current of 16 A. Calculate the voltage drop across the conductors.",
    "options": [
      "4 V",
      "64 V",
      "0.015 V",
      "57.5 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Voltage drop (V) = Current (I) x Resistance (R). Therefore, 16 A x 0.25 Ω = 4 V."
  },
  {
    "id": 4073,
    "question": "In a basic lighting circuit, what is the specific role of the 'Permanent Live' conductor at the light switch?",
    "options": [
      "To provide a constant supply of power to the switch",
      "To carry current back from the lamp to the consumer unit",
      "To provide a path for fault current to earth",
      "To connect the switch directly to the Neutral bar"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Permanent Live (PL) provides the continuous supply to the switch. The switch then determines if that power proceeds to the lamp via the Switched Live."
  },
  {
    "id": 4074,
    "question": "A 230V electric shower is rated at 9.2 kW. Calculate the current flowing through the Line conductor when in use.",
    "options": [
      "40 A",
      "21.1 A",
      "0.025 A",
      "2,116 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "WRONG_UNITS",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Current (I) = Power (P) / Voltage (V). 9200 W / 230 V = 40 A."
  },
  {
    "id": 4075,
    "question": "A circuit map shows a Line conductor with 0.3 Ω resistance and a CPC with 0.5 Ω resistance. If a fault occurs at the end of the circuit, what is the total resistance the fault current must travel through within these conductors?",
    "options": [
      "0.8 Ω",
      "0.2 Ω",
      "0.18 Ω",
      "1.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "USED_PARALLEL_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Fault current travels down the Line (R1) and returns via the CPC (R2). This is a series path, so R1 + R2 = 0.3 + 0.5 = 0.8 Ω."
  },
  {
    "id": 4076,
    "question": "Which of the following represents the correct standard dead-testing workflow for a new radial circuit installation?",
    "options": [
      "Inspect → CPC continuity → Insulation Resistance → Polarity",
      "Inspect → Polarity → Insulation Resistance → CPC continuity",
      "CPC continuity → Polarity → Inspect → Insulation Resistance",
      "Insulation Resistance → CPC continuity → Polarity → Inspect"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "terminology",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The standard sequence ensures that the safety path (CPC) is verified before high-voltage insulation tests are performed, and physical inspection always comes first."
  },
  {
    "id": 4077,
    "question": "In a lighting circuit map, what is the specific role of the 'Switched Live' conductor?",
    "options": [
      "To carry current from the switch to the load only when the switch is closed",
      "To provide a constant unswitched feed to the light fitting",
      "To provide a return path for current to the consumer unit",
      "To ensure the metal casing of the switch is connected to Earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Switched Live (SL) is the conductor that becomes live only when the switch is in the 'ON' position, linking the switch to the lamp."
  },
  {
    "id": 4078,
    "question": "An electrician measures the resistance of the Line conductor (R1) as 0.35 Ω and the CPC (R2) as 0.65 Ω. What is the total R1+R2 continuity value for this circuit?",
    "options": [
      "1.00 Ω",
      "0.30 Ω",
      "0.22 Ω",
      "2.28 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "USED_PARALLEL_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "For continuity (R1+R2), the resistances of the individual conductors are added together in series."
  },
  {
    "id": 4079,
    "question": "When performing an Insulation Resistance test between the Line and Neutral conductors of a healthy circuit with all lamps removed, what result is expected?",
    "options": [
      "A very high resistance, typically hundreds of MΩ",
      "A very low resistance, typically less than 1 Ω",
      "A resistance value equal to the sum of R1 and Rn",
      "A resistance of exactly 0 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Insulation resistance tests check for isolation. A healthy circuit should show very high resistance (MΩ) between live conductors, indicating no leakage paths."
  },
  {
    "id": 4080,
    "question": "An electrician is identifying conductors at a ceiling rose. One conductor remains live even when the wall switch is turned off. What is the role of this conductor?",
    "options": [
      "Permanent Live",
      "Switched Live",
      "Neutral",
      "CPC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Permanent Live (PL) provides a constant feed to the switch and does not change state when the local switch is operated."
  },
  {
    "id": 4081,
    "question": "A circuit contains two heaters connected in series. Each heater has a resistance of 45 Ω. What is the total resistance of the circuit map?",
    "options": [
      "90 Ω",
      "22.5 Ω",
      "45 Ω",
      "2025 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "series"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of the individual resistances (45 + 45 = 90 Ω)."
  },
  {
    "id": 4082,
    "question": "Why does a circuit map for a lighting system show the switch connected to the Line conductor rather than the Neutral conductor?",
    "options": [
      "To ensure the load is isolated from the live supply when the switch is open",
      "To reduce the total resistance of the circuit",
      "Because current only flows through the Line conductor",
      "To prevent the Neutral conductor from becoming overloaded"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Switching the Line conductor ensures that when the switch is off, no part of the load remains at a high potential relative to Earth."
  },
  {
    "id": 4083,
    "question": "A radial circuit has a total resistance (R1+Rn) of 0.5 Ω. If a current of 20 A flows through the circuit, what is the calculated voltage drop across the conductors?",
    "options": [
      "10 V",
      "40 V",
      "0.025 V",
      "100 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Using Ohm's Law (V = I x R), the voltage drop is 20 A x 0.5 Ω = 10 V."
  },
  {
    "id": 4084,
    "question": "During a dead test for polarity, an electrician finds continuity between the Neutral terminal of the consumer unit and the center-pin of an Edison Screw (ES) lamp holder. What does this indicate on the circuit map?",
    "options": [
      "A polarity error (Neutral and Line are swapped)",
      "A healthy circuit with correct connections",
      "A missing CPC connection",
      "A short circuit to Earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "The center-pin of an ES lamp holder should be connected to the Switched Live, not the Neutral. This indicates a polarity reversal."
  },
  {
    "id": 4085,
    "question": "Two identical 200 Ω resistors are connected in parallel within a control circuit. What is the total resistance of this part of the circuit map?",
    "options": [
      "100 Ω",
      "400 Ω",
      "200 Ω",
      "0.01 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "parallel"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (200 / 2 = 100 Ω)."
  },
  {
    "id": 4086,
    "question": "In a standard domestic lighting circuit map, which conductor role is specifically responsible for carrying current from the switch to the load only when the circuit is closed?",
    "options": [
      "Switched Live",
      "Permanent Live",
      "Neutral",
      "Circuit Protective Conductor (CPC)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Switched Live (SL) is the conductor that becomes live only when the switch is in the 'ON' position, completing the path to the lamp."
  },
  {
    "id": 4087,
    "question": "When following the standard dead-testing workflow, which test must be performed immediately after the visual inspection and before any insulation resistance testing?",
    "options": [
      "Continuity of the Circuit Protective Conductor (CPC)",
      "Insulation Resistance (IR) between Line and Neutral",
      "Polarity test at the furthest point",
      "Continuity of Ring Final Conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "CPC continuity is the first electrical test performed to ensure the safety path is intact before applying higher voltages or checking other parameters."
  },
  {
    "id": 4088,
    "question": "A circuit map shows a heater with a resistance of 57.5 Ω connected to a 230V supply. What is the expected current flow through the Line conductor when the circuit is operational?",
    "options": [
      "4 A",
      "13,225 A",
      "0.25 A",
      "287.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "ohms-law",
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using Ohm's Law: I = V / R. Therefore, 230V / 57.5 Ω = 4 A."
  },
  {
    "id": 4089,
    "question": "During an Insulation Resistance (IR) test between Line and Neutral on a dead circuit, a reading of 0.02 MΩ is recorded. Based on circuit map logic, what does this outcome indicate?",
    "options": [
      "The conductors are not sufficiently isolated from each other",
      "The circuit has excellent continuity",
      "The switch is currently in the 'OFF' position",
      "The CPC is correctly connected to the MET"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A very low MΩ reading (0.02 MΩ) indicates a failure in isolation, meaning the conductors are effectively connected when they should be separate."
  },
  {
    "id": 4090,
    "question": "An electrician maps a radial circuit where the Line conductor has a resistance of 0.4 Ω, the load is 40 Ω, and the Neutral return conductor is 0.4 Ω. What is the total resistance (R) of the complete circuit path?",
    "options": [
      "40.8 Ω",
      "40.4 Ω",
      "40.0 Ω",
      "0.2 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit map thinking",
    "tags": [
      "calculation",
      "resistance-rule",
      "series"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit path, total resistance is the sum of all parts: R(total) = R(line) + R(load) + R(neutral). 0.4 + 40 + 0.4 = 40.8 Ω."
  },
  {
    "id": 4091,
    "question": "A ring final circuit has an end-to-end resistance of the line loop (r1) of 0.80 Ω and an end-to-end resistance of the neutral loop (rn) of 0.80 Ω. What is the expected resistance between Line and Neutral (R1 + RN) at any socket on the ring, assuming no spurs or contact resistance?",
    "options": [
      "0.40 Ω",
      "1.60 Ω",
      "0.80 Ω",
      "0.20 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance at a socket (R1+RN) is calculated as (r1 + rn) / 4. Therefore, (0.8 + 0.8) / 4 = 0.40 Ω."
  },
  {
    "id": 4092,
    "question": "During a dead-testing sequence on a new lighting installation, which specific reason justifies performing the 'Continuity of Protective Conductors' test before the 'Insulation Resistance' test?",
    "options": [
      "To ensure the earth path is verified so that the IR test against the CPC is reliable",
      "To ensure the switching logic is correct before applying high voltage",
      "To verify the polarity of the switched live conductors",
      "Because the IR test will damage the CPC if it is not continuous"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Conceptual",
    "tags": [
      "health-safety",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-10B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Verifying CPC continuity first ensures that when you test insulation resistance between Live/Neutral and Earth, you are actually testing the entire length of the circuit's earthing system."
  },
  {
    "id": 4093,
    "question": "An electrician is mapping a 2-way lighting circuit. A 3-core and earth cable is run between two switches. If the conductors are used as Permanent Live, Strapper 1, and Strapper 2, which conductor role is intentionally omitted from this specific cable run?",
    "options": [
      "Neutral",
      "CPC",
      "Switched Live",
      "Line"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Application",
    "tags": [
      "application",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In traditional 2-way switching using 3-core and earth between switches, the Neutral is usually kept at the light fitting or the first switch and is not required in the strapper run."
  },
  {
    "id": 4094,
    "question": "An insulation resistance test is performed on a distribution board where two circuits are connected in parallel. Circuit A has an IR of 200 MΩ and Circuit B has an IR of 50 MΩ. What is the total IR reading for the board?",
    "options": [
      "40 MΩ",
      "250 MΩ",
      "125 MΩ",
      "150 MΩ"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Insulation resistance behaves like resistors in parallel. Total IR = 1 / (1/200 + 1/50) = 1 / (0.005 + 0.02) = 1 / 0.025 = 40 MΩ."
  },
  {
    "id": 4095,
    "question": "In a 'loop-in' ceiling rose lighting circuit, which conductor role is terminated into a connector block that does not connect directly to the lamp flex but provides a feed to the switch?",
    "options": [
      "Permanent Live",
      "Switched Live",
      "Neutral",
      "CPC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Conceptual",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-10B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The Permanent Live (or Loop) terminal in a ceiling rose links the incoming feed to the outgoing feed and the switch drop, but is isolated from the lamp itself."
  },
  {
    "id": 4096,
    "question": "A circuit uses 25 metres of 2.5mm² copper line conductor (7.41 mΩ/m) and 2.5mm² copper CPC (7.41 mΩ/m). Calculate the total R1 + R2 resistance for this circuit.",
    "options": [
      "0.37 Ω",
      "0.185 Ω",
      "18.52 Ω",
      "0.74 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "UNITS_MISSING",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total R1 + R2 = (Resistance per metre of L + Resistance per metre of CPC) * Length. (7.41 + 7.41) * 25 / 1000 = 0.3705 Ω."
  },
  {
    "id": 4097,
    "question": "When performing a polarity test on a radial socket circuit, the electrician finds that the continuity reading is high (infinity) when testing between the Line at the Consumer Unit and the Neutral terminal at the socket, even with a temporary link at the CU. What does this indicate in the circuit map?",
    "options": [
      "The circuit path is open (broken) or the switch/link is not closed",
      "The circuit is correctly wired in parallel",
      "There is a short circuit between Line and Neutral",
      "The CPC is not connected to the socket"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Conceptual",
    "tags": [
      "conceptual",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A reading of infinity during a continuity test where a path is expected indicates an open circuit (a break in the conductor or a disconnected terminal)."
  },
  {
    "id": 4098,
    "question": "A 1.5mm² conductor has a resistance of 12.1 mΩ/m. If a circuit is 40 metres long, what is the resistance of the conductor, and what would it be if the length was doubled to 80 metres?",
    "options": [
      "0.484 Ω and 0.968 Ω",
      "0.484 Ω and 0.242 Ω",
      "484 Ω and 968 Ω",
      "1.21 Ω and 2.42 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "WRONG_UNITS",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "R = (mΩ/m * L) / 1000. (12.1 * 40) / 1000 = 0.484 Ω. Doubling the length doubles the resistance to 0.968 Ω."
  },
  {
    "id": 4099,
    "question": "During dead testing of a lighting circuit, you are verifying the 'Switched Live' role. With the light switch in the OFF position, what should the resistance reading be between the Permanent Live at the switch and the Switched Live at the ceiling rose?",
    "options": [
      "Infinity (Open circuit)",
      "0.05 Ω",
      "2.00 MΩ",
      "The resistance of the lamp filament"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Application",
    "tags": [
      "application",
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The purpose of the switch is to break the circuit. In the OFF position, there is no continuity between the Permanent Live and Switched Live, resulting in an 'Infinity' reading."
  },
  {
    "id": 4100,
    "question": "An electrician needs to calculate the voltage drop for a circuit. The cable has a millivolt drop of 11 mV/A/m. The circuit is 30m long and carries a load of 20A. Calculate the voltage drop.",
    "options": [
      "6.6 V",
      "6600 V",
      "0.33 V",
      "2.2 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "calculation",
      "voltage-rule",
      "units"
    ],
    "learningOutcomeId": "204-10B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Voltage Drop = (mV/A/m * Current * Length) / 1000. (11 * 20 * 30) / 1000 = 6600 / 1000 = 6.6 V."
  }
];
