import { TaggedQuestion } from './types';

/**
 * Cooker Circuits (Noob): What It Is, Basic Path, and Protection Question Bank
 * Aligned with lesson 203-3L1C learning outcomes
 * Generated: 2026-02-25
 */

export const cookerCircuitsNoobWhatItIsBasicPathAndProtectionQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which circuit type best describes a standard domestic cooker installation?",
    "options": [
      "Power and heating radial",
      "Lighting radial",
      "Power ring final",
      "Signal radial"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A cooker circuit is classified under the range as a power and heating circuit, typically wired as a radial (a single run from the consumer unit)."
  },
  {
    "id": 4017,
    "question": "In a radial circuit supplying a cooker, how many distinct cable paths run from the consumer unit to the cooker point?",
    "options": [
      "One",
      "Two",
      "Three",
      "Four"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "A radial circuit consists of a single 'branch' or run from the source to the load, unlike a ring circuit which returns to the source."
  },
  {
    "id": 4018,
    "question": "A cooker is rated at 4600W. If the supply voltage is 230V, what is the current drawn by the appliance?",
    "options": [
      "20A",
      "1,058,000A",
      "0.05A",
      "230A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using the power formula I = P / V; 4600W / 230V = 20A."
  },
  {
    "id": 4019,
    "question": "A 230V cooker heating element has a resistance of 23Ω. Calculate the current flowing through the element.",
    "options": [
      "10A",
      "5290A",
      "0.1A",
      "23A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law I = V / R; 230V / 23Ω = 10A."
  },
  {
    "id": 4020,
    "question": "A cooker has two rings turned on. One draws 10A and the other draws 5A. What is the total current drawn from the supply?",
    "options": [
      "15A",
      "5A",
      "50A",
      "2A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel arrangement (as components inside a cooker are), the total current is the sum of the individual currents: 10A + 5A = 15A."
  },
  {
    "id": 4021,
    "question": "If a cooker draws 30A from a 230V supply, what is its power rating in kilowatts (kW)?",
    "options": [
      "6.9kW",
      "6900kW",
      "7.6kW",
      "0.13kW"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "ROUNDING_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "power",
      "units"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "P = I x V. 30A x 230V = 6900W. To convert to kW, divide by 1000, giving 6.9kW."
  },
  {
    "id": 4022,
    "question": "A fault occurs in a 230V cooker, and the circuit resistance drops to 5Ω. What is the resulting fault current?",
    "options": [
      "46A",
      "1150A",
      "32A",
      "0.02A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "I = V / R. 230V / 5Ω = 46A. This current would likely cause the protective device to trip."
  },
  {
    "id": 4023,
    "question": "Which protective device is specifically designed to trip when it detects current leaking to earth?",
    "options": [
      "RCD",
      "MCB",
      "BS 88 Fuse",
      "BS 3036 Fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An RCD (Residual Current Device) monitors the balance between Line and Neutral and trips if current leaks to earth."
  },
  {
    "id": 4024,
    "question": "If a fault makes the metal casing of a cooker live, which conductor is designed to carry the fault current safely back to the consumer unit?",
    "options": [
      "CPC",
      "Line",
      "Neutral",
      "Isolator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The CPC (Circuit Protective Conductor) connects the metalwork to earth, providing a path for fault current to trigger protective devices."
  },
  {
    "id": 4025,
    "question": "What is the primary role of the Neutral (N) conductor in a healthy cooker circuit?",
    "options": [
      "To provide a return path for the current",
      "To provide safety during an earth fault",
      "To carry the initial energy to the load",
      "To disconnect the circuit during an overload"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "The Neutral conductor completes the circuit by providing the return path for the current to the source."
  },
  {
    "id": 4026,
    "question": "A cooker circuit that runs directly from the consumer unit to the cooker control switch without returning to the consumer unit is known as which type of circuit?",
    "options": [
      "A radial circuit",
      "A ring final circuit",
      "A series circuit",
      "A parallel loop circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "radial",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit is a 'one-way' run from the consumer unit to the load or point of use, unlike a ring final circuit which returns to the start point."
  },
  {
    "id": 4027,
    "question": "In a standard UK cooker circuit, which conductor is specifically designed to provide a path for fault current to ensure the protective device operates safely?",
    "options": [
      "CPC (Circuit Protective Conductor)",
      "Line conductor",
      "Neutral conductor",
      "Switch wire"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The CPC (Circuit Protective Conductor), often called the earth wire, is the safety conductor that carries fault current to trigger the circuit protection."
  },
  {
    "id": 4028,
    "question": "Which protective device is designed to provide protection against both overcurrent (overload/short-circuit) and earth leakage in a single unit?",
    "options": [
      "RCBO",
      "MCB",
      "RCD",
      "BS 3036 semi-enclosed fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "discrimination",
      "calculation",
      "protective-devices"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent) combines the functions of an MCB (overcurrent protection) and an RCD (earth leakage protection)."
  },
  {
    "id": 4029,
    "question": "An electrician is checking a circuit for a large electric oven. According to the C&G 203 syllabus, this circuit is categorized as which type?",
    "options": [
      "Power and heating",
      "Lighting and signal",
      "Data and communication",
      "Extra-low voltage control"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cooker circuits are high-load circuits used for cooking appliances, placing them in the 'power and heating' category."
  },
  {
    "id": 4030,
    "question": "If a cooker circuit is protected by an RCD (Residual Current Device) and it trips, what is the most likely cause of the fault?",
    "options": [
      "Current leaking to earth",
      "Too much current being drawn by the oven",
      "A short circuit between Line and Neutral",
      "The oven being switched off at the isolator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "health-safety",
      "protective-devices"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An RCD specifically monitors the balance between Line and Neutral; if current leaks to earth, the imbalance causes the RCD to trip."
  },
  {
    "id": 4031,
    "question": "Which of the following best describes the classification of a standard domestic cooker circuit according to its operation and layout?",
    "options": [
      "A power and heating radial circuit",
      "A power ring final circuit",
      "A lighting radial circuit",
      "A signal and data series circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "radial",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A cooker circuit is classified as a power and heating circuit because of the nature of the load, and it is a radial circuit because it runs directly from the consumer unit to the load without returning."
  },
  {
    "id": 4032,
    "question": "In a cooker circuit, what is the primary role of the Circuit Protective Conductor (CPC) during a fault to the metal casing?",
    "options": [
      "To provide a low-resistance path for fault current to trip the protective device",
      "To carry the return current back to the neutral bar during normal use",
      "To provide the energy required for the heating elements to function",
      "To increase the resistance of the circuit to limit the current flow"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "safety",
      "units"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The CPC (earth) is a safety conductor. It provides a path for fault current so that the fuse or MCB can detect the high current and disconnect the supply."
  },
  {
    "id": 4033,
    "question": "A domestic cooker is rated at 9.2 kW (9200 W). If the supply voltage is 230 V, what is the full load current of the cooker?",
    "options": [
      "40 A",
      "2,116,000 A",
      "0.025 A",
      "239.2 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the formula I = P / V: 9200W / 230V = 40A."
  },
  {
    "id": 4034,
    "question": "An electrician measures the resistance of the Line conductor as 0.15 Ω and the CPC as 0.25 Ω for a radial cooker circuit. What is the total combined resistance (R1 + R2)?",
    "options": [
      "0.40 Ω",
      "0.09 Ω",
      "0.03 Ω",
      "1.66 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "resistance-rule",
      "series"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "In a radial circuit, the total resistance of the conductors is the sum of the individual resistances (R1 + R2): 0.15 + 0.25 = 0.40 Ω."
  },
  {
    "id": 4035,
    "question": "Which protective device should be selected to provide both overcurrent protection and earth leakage protection for a single cooker circuit in a modern consumer unit?",
    "options": [
      "RCBO",
      "MCB Type B",
      "RCD",
      "BS 3036 Re-wirable fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "units",
      "safety"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent) combines the functions of an MCB (overcurrent) and an RCD (earth leakage) in one device."
  },
  {
    "id": 4036,
    "question": "A cooker circuit has a measured voltage of 232 V at the Consumer Unit. Due to cable resistance, there is a voltage drop of 5.5 V. What is the voltage available at the cooker isolator switch?",
    "options": [
      "226.5 V",
      "237.5 V",
      "1276.0 V",
      "42.1 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Voltage at load = Source Voltage - Voltage Drop. 232V - 5.5V = 226.5V."
  },
  {
    "id": 4037,
    "question": "What is the correct physical path of the 'Line' conductor in a basic cooker circuit installation?",
    "options": [
      "Consumer Unit -> Protective Device -> Isolator -> Cooker",
      "Consumer Unit -> Cooker -> Isolator -> Protective Device",
      "Isolator -> Consumer Unit -> Protective Device -> Cooker",
      "Protective Device -> Consumer Unit -> Cooker -> Isolator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "radial",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power starts at the Consumer Unit, passes through the protective device, goes to the local isolator for safety, and finally reaches the cooker."
  },
  {
    "id": 4038,
    "question": "If a cooker heating element has a resistance of 18.4 Ω and is connected to a 230 V supply, what current will flow through the element?",
    "options": [
      "12.5 A",
      "4232 A",
      "0.08 A",
      "211.6 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "current-rule"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using Ohm's Law (I = V / R): 230V / 18.4Ω = 12.5A."
  },
  {
    "id": 4039,
    "question": "Why is an RCD specifically required for many modern cooker circuits containing a socket outlet?",
    "options": [
      "To provide protection against earth leakage and electric shock",
      "To prevent the circuit from drawing too much power",
      "To ensure the voltage remains constant at 230V",
      "To allow the cooker to heat up faster"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "safety",
      "application"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "RCDs are designed to detect small leakages of current to earth, which reduces the risk of fatal electric shock."
  },
  {
    "id": 4040,
    "question": "A cooker circuit is protected by a 32 A MCB. If the cooker is replaced with a larger unit that draws 45 A, what is the likely outcome?",
    "options": [
      "The MCB will trip due to an overload condition",
      "The RCD will trip due to an earth fault",
      "The voltage in the circuit will increase to 400V",
      "The CPC will begin to carry the extra 13A of current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "When the current drawn (45A) exceeds the rating of the protective device (32A), it creates an overload condition, causing the MCB to trip to protect the cable."
  },
  {
    "id": 4041,
    "question": "Which statement best describes a radial circuit used for a domestic cooker installation?",
    "options": [
      "A single cable run starting at the consumer unit and ending at the cooker point",
      "A loop of cable that starts and finishes at the same circuit breaker",
      "A circuit that supplies multiple socket outlets in a ring formation",
      "A connection that joins the cooker directly to the incoming mains service head"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "radial",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A radial circuit is characterized by a single cable run from the source (consumer unit) to the load or final point, unlike a ring final circuit which returns to the source."
  },
  {
    "id": 4042,
    "question": "An electrician is tracing the path of a cooker circuit. What is the correct sequence of components from the source of supply to the appliance?",
    "options": [
      "Consumer unit -> Protective device -> Isolator -> Cooker",
      "Consumer unit -> Isolator -> Protective device -> Cooker",
      "Isolator -> Consumer unit -> Protective device -> Cooker",
      "Protective device -> Cooker -> Isolator -> Consumer unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The circuit starts at the consumer unit busbar, passes through the protective device (MCB/Fuse), travels to the local isolator switch, and finally connects to the cooker."
  },
  {
    "id": 4043,
    "question": "A cooker circuit is classified under which circuit category within a domestic installation according to the 203 syllabus?",
    "options": [
      "Power and heating",
      "Lighting and signaling",
      "Data and communication",
      "Solar and renewable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Cookers are high-power appliances primarily used for heat production, placing them in the 'power and heating' category."
  },
  {
    "id": 4044,
    "question": "A cooker circuit is protected by a BS EN 61009 device. What two specific types of protection does this single device provide?",
    "options": [
      "Overcurrent and earth leakage",
      "Overvoltage and short-circuit",
      "Earth leakage and lightning protection",
      "Overcurrent and phase rotation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A BS EN 61009 device is an RCBO, which combines the overcurrent protection of an MCB with the earth leakage protection of an RCD."
  },
  {
    "id": 4045,
    "question": "A homeowner reports that the cooker functions correctly, but the metal casing feels 'tingly' when touched. Which conductor is likely failing to perform its safety role?",
    "options": [
      "Circuit Protective Conductor (CPC)",
      "Line conductor (L)",
      "Neutral conductor (N)",
      "Main switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 80,
    "explanation": "The CPC (earth) is designed to carry fault current and keep exposed metalwork at 0V. If it is disconnected, the casing can become live due to leakage or faults."
  },
  {
    "id": 4046,
    "question": "If a cooker circuit requires additional protection against earth leakage only to be used in conjunction with a BS 88-3 fuse, which device should be selected?",
    "options": [
      "BS EN 61008 (RCD)",
      "BS EN 60898 (MCB)",
      "BS 3036 (Semi-enclosed fuse)",
      "BS EN 61009 (RCBO)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A BS EN 61008 is a Residual Current Device (RCD) which provides earth leakage protection only. It does not provide overcurrent protection, so it must be used with a fuse or MCB."
  },
  {
    "id": 4047,
    "question": "What is the primary purpose of the Neutral (N) conductor in a standard 230V cooker radial circuit?",
    "options": [
      "To provide a return path for the current under normal operating conditions",
      "To carry fault current to earth when a short circuit occurs",
      "To bring the energy from the consumer unit to the heating elements",
      "To act as a backup safety wire if the CPC fails"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Neutral conductor completes the circuit by providing the return path for current back to the source after it has passed through the load."
  },
  {
    "id": 4048,
    "question": "An electrician needs to install a protective device for a cooker that offers both overload and short-circuit protection using a resettable switching mechanism. Which device is most appropriate?",
    "options": [
      "BS EN 60898 Circuit Breaker (MCB)",
      "BS 3036 Re-wireable fuse",
      "BS EN 61008 RCD",
      "BS 88-3 Cartridge fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 70,
    "explanation": "A BS EN 60898 MCB provides overcurrent protection (overload and short-circuit) and can be reset with a switch, unlike fuses which must be replaced."
  },
  {
    "id": 4049,
    "question": "Why is a local isolator switch required within the path of a cooker circuit installation?",
    "options": [
      "To allow the cooker to be safely disconnected from the supply for maintenance",
      "To increase the voltage reaching the oven elements during peak times",
      "To provide additional earth leakage protection for the user",
      "To convert the AC supply into DC for the digital clock and timer"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Isolators are safety devices used to physically disconnect a circuit from the power source, ensuring it is 'dead' before maintenance or repair work begins."
  },
  {
    "id": 4050,
    "question": "In a healthy cooker circuit, if the Line conductor carries 32A to the appliance and the Neutral conductor returns 32A, what is the expected current flow in the CPC?",
    "options": [
      "0A",
      "32A",
      "64A",
      "16A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a healthy circuit with no earth faults, the CPC should carry no current. Current only flows through the CPC during a fault to earth."
  },
  {
    "id": 4051,
    "question": "An electrician is installing a new cooker circuit. Which statement best describes the 'radial' topology used for this type of power and heating circuit?",
    "options": [
      "The circuit originates at the consumer unit and terminates at the cooker point without returning.",
      "The circuit forms a complete loop starting and ending at the same protective device.",
      "The circuit connects multiple cookers in a series chain to share the total voltage.",
      "The circuit uses the CPC as a return path for current during normal operation."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "power",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A radial circuit is defined as a wiring path that runs from the source (consumer unit) to the load (cooker) and ends there, unlike a ring circuit which returns to the start."
  },
  {
    "id": 4052,
    "question": "A homeowner wants a single protective device that will protect the cooker circuit against both overcurrent (overload) and earth leakage. Which device should the electrician install?",
    "options": [
      "RCBO (BS EN 61009)",
      "MCB (BS EN 60898)",
      "RCD (BS EN 61008)",
      "Semi-enclosed Fuse (BS 3036)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent protection) combines the functions of an MCB (overload/short circuit) and an RCD (earth leakage) into one unit."
  },
  {
    "id": 4053,
    "question": "When tracing the basic path of a cooker circuit, which conductor is responsible for providing the return path for current under normal operating conditions?",
    "options": [
      "Neutral (N)",
      "Line (L)",
      "Circuit Protective Conductor (CPC)",
      "Main Earthing Terminal (MET)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a standard AC circuit, the Line conductor brings the energy to the load, and the Neutral conductor provides the return path to complete the circuit."
  },
  {
    "id": 4054,
    "question": "An electrician identifies a BS EN 60898 Type B device protecting a cooker radial. What is the specific application of this device in this circuit?",
    "options": [
      "To disconnect the supply if current exceeds safe levels due to overload or short-circuit.",
      "To detect small imbalances between line and neutral current caused by earth leakage.",
      "To provide a local point of isolation for maintenance of the cooker elements.",
      "To reduce the 230V mains supply to a lower voltage suitable for the cooker clock."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A BS EN 60898 MCB is designed specifically for overcurrent protection (overload and short-circuits), not earth leakage detection."
  },
  {
    "id": 4055,
    "question": "In a cooker circuit, why is the Circuit Protective Conductor (CPC) considered a 'dead' conductor during normal, fault-free operation?",
    "options": [
      "It is only intended to carry current during a fault to earth to trigger a protective device.",
      "It is disconnected by the cooker isolator switch whenever the oven is turned off.",
      "It is made of high-resistance material that prevents any current from flowing through it.",
      "It only carries the return current that the Neutral conductor cannot handle."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 80,
    "explanation": "The CPC is a safety conductor. Under normal conditions, no current flows through it. It only carries current if a fault occurs, allowing the protective device to trip."
  },
  {
    "id": 4056,
    "question": "A cooker circuit is installed using a single cable run from the consumer unit to the cooker control unit. If the Line conductor has a resistance of 0.12 Ω and the Neutral conductor also has a resistance of 0.12 Ω, what is the total resistance of the live conductors for this radial circuit?",
    "options": [
      "0.24 Ω",
      "0.12 Ω",
      "0.06 Ω",
      "0.36 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_PARALLEL_RULE",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "radial",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In a radial circuit, the Line and Neutral conductors are in series with the load. Therefore, their resistances are added together (0.12 + 0.12 = 0.24 Ω)."
  },
  {
    "id": 4057,
    "question": "An electrician is classifying a new installation for a 12kW electric range. According to the principles of operation, how is this circuit correctly categorized within the scope of a standard domestic installation?",
    "options": [
      "A power and heating radial circuit",
      "A power and heating ring final circuit",
      "A lighting radial circuit",
      "A three-phase distribution circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Cooker circuits are categorized as power and heating circuits and are typically wired as radial circuits (one run from the source to the load)."
  },
  {
    "id": 4058,
    "question": "A cooker has a total rated power of 11.5kW at 230V. Calculate the design current (Ib) for this circuit before any diversity factors are considered.",
    "options": [
      "50A",
      "26.45A",
      "2,645A",
      "0.02A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Using the formula I = P / V: 11,500W / 230V = 50A."
  },
  {
    "id": 4059,
    "question": "A homeowner requires a single protective device that will disconnect the cooker circuit in the event of an overload, a short-circuit, or a small current leakage to earth. Which device meets all these requirements in a single module?",
    "options": [
      "BS EN 61009 RCBO",
      "BS EN 61008 RCD",
      "BS EN 60898 MCB",
      "BS 3036 Re-wireable fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "application",
      "discrimination",
      "legislation"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent) combines the functions of an MCB (overload/short-circuit) and an RCD (earth leakage) in one device."
  },
  {
    "id": 4060,
    "question": "A cooker circuit draws a current of 35A. If the combined resistance of the Line and Neutral conductors is measured at 0.15 Ω, what is the total voltage drop across these conductors?",
    "options": [
      "5.25V",
      "233V",
      "0.004V",
      "2.33V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Voltage drop is calculated using V = I x R. Therefore, 35A x 0.15 Ω = 5.25V."
  },
  {
    "id": 4061,
    "question": "During the inspection of a healthy, functioning cooker circuit, what is the role of the Circuit Protective Conductor (CPC)?",
    "options": [
      "To provide a path for fault current to ensure the protective device operates",
      "To carry the normal return current back to the consumer unit",
      "To provide the main energy path to the heating elements",
      "To increase the total resistance of the circuit to limit current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "explanation",
      "health-safety"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The CPC is a safety conductor designed to carry fault current to earth, allowing the protective device to trip if a fault occurs."
  },
  {
    "id": 4062,
    "question": "A kitchen contains a 5.5kW oven and a 2.5kW induction hob connected to the same radial circuit. What is the total power consumption when both are at full load, and which conductor brings this energy from the consumer unit?",
    "options": [
      "8kW, Line conductor",
      "3kW, Neutral conductor",
      "13.75kW, CPC",
      "8kW, Neutral conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total power is the sum of the loads (5.5kW + 2.5kW = 8kW). The Line conductor is responsible for bringing the energy to the load."
  },
  {
    "id": 4063,
    "question": "A fault occurs where current is 'leaking' to the metal casing of the cooker. Which protective device is specifically designed to detect this imbalance and disconnect the circuit?",
    "options": [
      "BS EN 61008 RCD",
      "BS EN 60898 Type B MCB",
      "BS 88-2 Fuse",
      "BS 3036 Semi-enclosed fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "discrimination",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "An RCD (Residual Current Device) monitors the balance between Line and Neutral; if current leaks to earth, it detects the imbalance and trips."
  },
  {
    "id": 4064,
    "question": "A 10mm² copper Line conductor has a resistance of 1.83 mΩ per meter. If the radial cooker circuit is 15 meters long, what is the resistance of the Line conductor alone?",
    "options": [
      "0.02745 Ω",
      "27.45 Ω",
      "0.0549 Ω",
      "0.000122 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "calculation",
      "units",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Resistance = (1.83 mΩ/m * 15m) / 1000 = 0.02745 Ω. Dividing by 1000 converts milliohms to ohms."
  },
  {
    "id": 4065,
    "question": "In the basic path of a cooker circuit, what is the correct sequence of components starting from the supply source?",
    "options": [
      "Consumer Unit -> Protective Device -> Isolator -> Cooker",
      "Consumer Unit -> Cooker -> Isolator -> Protective Device",
      "Isolator -> Consumer Unit -> Protective Device -> Cooker",
      "Protective Device -> Cooker -> Consumer Unit -> Isolator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Cooker Circuits",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1C-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The standard radial path starts at the Consumer Unit, goes through the Protective Device, then to the local Isolator (cooker switch), and finally to the Cooker."
  }
];
