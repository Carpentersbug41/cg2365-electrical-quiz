import { TaggedQuestion } from './types';

/**
 * Alarm & Emergency Systems (Noob): Open/Closed Circuits, Fire, Intruder, Emergency Lighting Question Bank
 * Aligned with lesson 203-3L1A learning outcomes
 * Generated: 2026-02-26
 */

export const alarmEmergencySystemsNoobOpenClosedCircuitsFireIntruderEmergencyLightingQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "In an open-circuit fire alarm system, how are the manual call points normally connected to the control panel?",
    "options": [
      "In parallel",
      "In series",
      "In a ring loop",
      "In a star topology"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "parallel",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In an open-circuit system, detectors and call points are connected in parallel so that any single device closing the circuit will trigger the alarm."
  },
  {
    "id": 4017,
    "question": "An intruder alarm uses a closed-circuit loop with three magnetic contacts. If each contact has a resistance of 0.6 Ω and the cable resistance is 1.2 Ω, what is the total circuit resistance when all doors are closed?",
    "options": [
      "3.0 Ω",
      "1.8 Ω",
      "0.6 Ω",
      "1.2 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "UNITS_MISSING"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "In a closed-circuit system, components are in series. Total resistance = (3 x 0.6 Ω) + 1.2 Ω = 1.8 Ω + 1.2 Ω = 3.0 Ω."
  },
  {
    "id": 4018,
    "question": "Which type of emergency lighting is designed to be switched on only when the normal mains power supply fails?",
    "options": [
      "Non-maintained",
      "Maintained",
      "Sustained",
      "Combined"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Non-maintained emergency lighting is normally 'off' and only energises from its battery backup when the local mains supply fails."
  },
  {
    "id": 4019,
    "question": "An emergency lighting battery is rated at 6 Ah. If the emergency lamp draws a constant current of 2 A, how many hours will the light operate for during a power failure?",
    "options": [
      "3 hours",
      "12 hours",
      "4 hours",
      "8 hours"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Time (hours) = Capacity (Ah) / Current (A). 6 Ah / 2 A = 3 hours."
  },
  {
    "id": 4020,
    "question": "What happens in a closed-circuit intruder alarm system if a burglar cuts the wire leading to a door contact?",
    "options": [
      "The circuit opens and the alarm triggers",
      "The circuit closes and the alarm triggers",
      "The system ignores the cut wire",
      "The control panel short-circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "application",
      "series"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Closed-circuit systems are fail-safe; cutting the wire breaks the continuous loop (opens the circuit), which the panel detects as an alarm condition."
  },
  {
    "id": 4021,
    "question": "A fire alarm zone uses an End of Line (EOL) resistor of 6000 Ω for monitoring. If an electrician accidentally installs a second 6000 Ω resistor in parallel at the end of the line, what resistance will the panel detect?",
    "options": [
      "3000 Ω",
      "12000 Ω",
      "6000 Ω",
      "0 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "When two identical resistors are in parallel, the total resistance is half of one resistor. 6000 / 2 = 3000 Ω."
  },
  {
    "id": 4022,
    "question": "What is the primary reason for using an End of Line (EOL) resistor in an open-circuit fire alarm system?",
    "options": [
      "To allow the panel to detect a break in the wiring",
      "To prevent the batteries from overcharging",
      "To increase the voltage to the smoke detectors",
      "To reset the system automatically after a fire"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The EOL resistor allows a small monitoring current to flow. If the wire breaks, the current stops, and the panel shows a 'Fault' rather than doing nothing."
  },
  {
    "id": 4023,
    "question": "A fire alarm sounder circuit has 5 electronic sirens connected in parallel. If each siren draws 20 mA, what is the total current demand on the control panel?",
    "options": [
      "100 mA",
      "20 mA",
      "4 mA",
      "500 mA"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "current-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch. 5 sirens x 20 mA = 100 mA."
  },
  {
    "id": 4024,
    "question": "A 12V DC intruder alarm panel is connected to a remote keypad. If the cable resistance is 5 Ω and the keypad draws 0.2 A, calculate the voltage drop in the cable.",
    "options": [
      "1.0 V",
      "2.4 V",
      "25 V",
      "0.04 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Voltage drop = Current x Resistance (V = I x R). 0.2 A x 5 Ω = 1.0 V."
  },
  {
    "id": 4025,
    "question": "Which component is used to trigger an alarm if the cover of an intruder alarm control panel is removed by an unauthorised person?",
    "options": [
      "Tamper switch",
      "End of Line resistor",
      "Magnetic contact",
      "PIR sensor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A tamper switch is a spring-loaded switch that opens the circuit if the equipment casing is opened or interfered with."
  },
  {
    "id": 4026,
    "question": "Which type of emergency lighting is designed to remain illuminated during normal mains operation and also when the power supply fails?",
    "options": [
      "Maintained",
      "Non-maintained",
      "Sustained",
      "Standby"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Emergency Lighting",
    "tags": [
      "emergency-lighting",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Maintained emergency lighting is designed to operate at all times (during normal use and power failure), commonly used for exit signs in public buildings."
  },
  {
    "id": 4027,
    "question": "In a basic open-circuit alarm system, how are the detectors connected so that any single device can trigger the alarm control panel?",
    "options": [
      "In parallel",
      "In series",
      "In a ring",
      "In a star"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Open/Closed Circuits",
    "tags": [
      "parallel",
      "fire",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In an open-circuit system, detectors are connected in parallel. When any one detector closes, it completes the circuit and triggers the alarm."
  },
  {
    "id": 4028,
    "question": "A standard emergency lighting system for a commercial building is typically required to provide illumination for a minimum duration of how many hours after a mains failure?",
    "options": [
      "3 hours",
      "1 hour",
      "12 hours",
      "24 hours"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "WRONG_UNITS",
      "3": "WRONG_UNITS"
    },
    "section": "Installation 2365 Level 2",
    "category": "Emergency Lighting",
    "tags": [
      "emergency-lighting",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Most commercial emergency lighting systems are designed for a 3-hour duration to allow for safe evacuation and for emergency services to enter."
  },
  {
    "id": 4029,
    "question": "An electrician is checking a closed-circuit intruder alarm. If the circuit is broken by a burglar cutting the wire, what is the immediate result?",
    "options": [
      "The alarm triggers because the current flow is interrupted",
      "The alarm fails to trigger because the power is lost",
      "The panel ignores the break until the door is opened",
      "The system short-circuits and blows the main fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Intruder Alarms",
    "tags": [
      "intruder",
      "application",
      "series"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Closed-circuit systems are fail-safe; since the circuit must be complete for the 'normal' state, any break in the wiring (cutting the cable) triggers the alarm."
  },
  {
    "id": 4030,
    "question": "A fire alarm zone uses an open-circuit configuration with a 10 kΩ End-of-Line (EOL) resistor for monitoring. If a second 10 kΩ resistor is accidentally connected in parallel at the end of the line, what is the total resistance the panel will detect?",
    "options": [
      "5 kΩ",
      "20 kΩ",
      "10 kΩ",
      "0 kΩ"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Fire Alarms",
    "tags": [
      "calculation",
      "parallel",
      "fire"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using the parallel resistance rule (Rt = R / n), two 10 kΩ resistors in parallel result in a total resistance of 5 kΩ."
  },
  {
    "id": 4031,
    "question": "An intruder alarm circuit uses a closed-circuit configuration with four magnetic reed switches connected in series. Each switch has a contact resistance of 0.4 Ω and the total cable resistance is 1.2 Ω. What is the total resistance of the circuit when all doors are closed?",
    "options": [
      "2.8 Ω",
      "1.6 Ω",
      "0.1 Ω",
      "4.8 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "USED_PARALLEL_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Intruder Alarm Systems",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series (closed-circuit) intruder loop, total resistance is the sum of all individual resistances: (4 x 0.4 Ω) + 1.2 Ω = 1.6 + 1.2 = 2.8 Ω."
  },
  {
    "id": 4032,
    "question": "A 24V DC conventional fire alarm zone uses an open-circuit configuration. To monitor the circuit for faults, a 4.7 kΩ end-of-line (EOL) resistor is installed. Calculate the standing monitoring current flowing through the circuit in normal conditions.",
    "options": [
      "5.1 mA",
      "112.8 mA",
      "195.8 mA",
      "0.19 mA"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Fire Alarm Systems",
    "tags": [
      "ohms-law",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Using Ohm's Law (I = V / R): 24V / 4700 Ω = 0.005106 A, which is approximately 5.1 mA."
  },
  {
    "id": 4033,
    "question": "An electrician is installing emergency lighting in a corridor. Which type of luminaire is designed to remain 'OFF' during normal conditions and only illuminate when the local mains supply fails?",
    "options": [
      "Non-maintained",
      "Maintained",
      "Sustained",
      "Combined"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Emergency Lighting",
    "tags": [
      "terminology",
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained luminaires only operate when the normal power supply fails. Maintained luminaires operate at all times."
  },
  {
    "id": 4034,
    "question": "In a conventional fire alarm system, detectors are connected in parallel across the zone wires. What is the primary reason for using an End-of-Line (EOL) resistor in this 'open-circuit' configuration?",
    "options": [
      "To allow the panel to detect a break in the wiring as a fault condition",
      "To limit the current flow when a smoke detector is triggered",
      "To ensure the alarm sounders have enough voltage to operate",
      "To prevent the batteries from overcharging in the control panel"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Fire Alarm Systems",
    "tags": [
      "conceptual",
      "explanation",
      "application"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Because fire detectors are in parallel (open-circuit), a cable break wouldn't be noticed without a small monitoring current provided by the EOL resistor."
  },
  {
    "id": 4035,
    "question": "A 12V DC intruder alarm panel powers five PIR detectors. Each detector draws 20 mA, and the internal keypad draws 60 mA. What is the total current demand on the panel's power supply?",
    "options": [
      "160 mA",
      "80 mA",
      "100 mA",
      "1200 mA"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "WRONG_UNITS"
    },
    "section": "Installation 2365 Level 2",
    "category": "Intruder Alarm Systems",
    "tags": [
      "calculation",
      "current-rule",
      "units"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Total current is the sum of individual parallel loads: (5 x 20 mA) + 60 mA = 100 mA + 60 mA = 160 mA."
  },
  {
    "id": 4036,
    "question": "Which alarm circuit configuration is considered 'fail-safe' because any break in the wiring will automatically trigger the alarm or a fault signal without needing extra monitoring components?",
    "options": [
      "Closed circuit",
      "Open circuit",
      "Parallel circuit",
      "Diverted circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "conceptual",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a closed circuit, current flows constantly. If the wire is cut (open circuit), the flow stops, which the panel interprets as an alarm or fault."
  },
  {
    "id": 4037,
    "question": "An emergency lighting battery is rated at 2.5 Ah. If the emergency luminaire draws a constant current of 0.5 A during a power failure, how long will the light remain operational?",
    "options": [
      "5 hours",
      "1.25 hours",
      "0.2 hours",
      "3 hours"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Emergency Lighting",
    "tags": [
      "calculation",
      "conversion",
      "units"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Time (hours) = Capacity (Ah) / Current (A). 2.5 Ah / 0.5 A = 5 hours."
  },
  {
    "id": 4038,
    "question": "When installing a fire alarm system in a dusty environment like a woodworking workshop, which type of detector is most likely to reduce the risk of false alarms while still providing property protection?",
    "options": [
      "Heat detector",
      "Optical smoke detector",
      "Ionisation smoke detector",
      "Combined smoke and carbon monoxide detector"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Fire Alarm Systems",
    "tags": [
      "application",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Smoke detectors (optical or ionisation) are easily triggered by dust. Heat detectors are preferred in dusty or smoky environments to prevent false activations."
  },
  {
    "id": 4039,
    "question": "A 12V intruder alarm sounder is located at the end of a long cable run with a total loop resistance of 8 Ω. If the sounder draws 0.5 A when activated, what will be the actual voltage delivered to the sounder terminals?",
    "options": [
      "8.0 V",
      "4.0 V",
      "11.5 V",
      "10.0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Intruder Alarm Systems",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Voltage drop = I x R = 0.5 A x 8 Ω = 4V. Voltage at sounder = Supply Voltage - Voltage Drop = 12V - 4V = 8V."
  },
  {
    "id": 4040,
    "question": "An intruder alarm system uses a separate 'tamper' circuit. If a technician opens the cover of a PIR sensor while the system is unset, what is the expected result?",
    "options": [
      "The control panel will trigger a tamper alarm immediately",
      "Nothing will happen because the system is unset",
      "The PIR will stop detecting movement until the cover is replaced",
      "The main fuse in the control panel will blow"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Intruder Alarm Systems",
    "tags": [
      "application",
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Tamper circuits are 24-hour circuits; they are active regardless of whether the main alarm system is set or unset to protect against interference."
  },
  {
    "id": 4041,
    "question": "In an open-circuit fire alarm system, how are the detectors typically connected and what occurs electrically to trigger an alarm condition?",
    "options": [
      "Detectors are in parallel; the circuit closes when a detector activates.",
      "Detectors are in series; the circuit opens when a detector activates.",
      "Detectors are in parallel; the circuit opens when a detector activates.",
      "Detectors are in series; the circuit closes when a detector activates."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "parallel",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In an open-circuit system, detectors are wired in parallel across the two supply wires. When a detector senses fire, it acts as a switch that 'closes', completing the circuit and allowing current to flow to the panel to signal an alarm."
  },
  {
    "id": 4042,
    "question": "A fire alarm panel monitors an open-circuit zone using a 4.7kΩ End of Line (EOL) resistor. If a cable break occurs halfway along the circuit, what resistance value will the panel detect?",
    "options": [
      "Infinite resistance (Open circuit)",
      "0 ohms (Short circuit)",
      "4,700 ohms",
      "2,350 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "USED_SERIES_RULE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "units",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The EOL resistor is placed at the very end of the circuit. If a cable breaks anywhere before the resistor, the path for the monitoring current is broken, resulting in infinite resistance (an open circuit), which the panel identifies as a fault."
  },
  {
    "id": 4043,
    "question": "Why are intruder alarm sensors, such as magnetic door contacts, usually wired in a closed-circuit (series) configuration?",
    "options": [
      "To ensure the alarm triggers if the intruder cuts the cable (fail-safe).",
      "To allow the system to operate with a lower battery voltage.",
      "To make it easier to add more sensors to the loop in parallel.",
      "To prevent the need for a separate tamper circuit."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "series",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Closed-circuit systems are fail-safe because any break in the loop (either by a sensor opening or a wire being cut) interrupts the current flow, which the panel interprets as an alarm condition."
  },
  {
    "id": 4044,
    "question": "An emergency lighting luminaire is rated for 3 hours. If the internal LED lamp draws 150mA from a 4.8V battery, what is the minimum battery capacity required to meet the rated duration?",
    "options": [
      "0.45 Ah",
      "450 Ah",
      "1.44 Ah",
      "32 Ah"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "units",
      "conversion"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Capacity (Ah) = Current (A) x Time (h). 150mA is 0.15A. 0.15A x 3 hours = 0.45 Ah."
  },
  {
    "id": 4045,
    "question": "An electrician is installing emergency lighting in a public staircase that must remain lit at all times when the building is occupied. Which type of luminaire must be selected?",
    "options": [
      "Maintained",
      "Non-maintained",
      "Open-circuit dependent",
      "Manual-start"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Maintained luminaires are designed to operate from the normal mains supply at all times and switch to battery backup during a power failure. Non-maintained only light up when the mains fails."
  },
  {
    "id": 4046,
    "question": "An intruder alarm loop consists of four PIR sensors connected in series. Each sensor has a contact resistance of 0.4Ω when closed. If the total wiring resistance is 1.8Ω, what is the total loop resistance in the normal (set) state?",
    "options": [
      "3.4Ω",
      "1.6Ω",
      "2.2Ω",
      "0.4Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances. (4 sensors x 0.4Ω) + 1.8Ω wiring = 1.6Ω + 1.8Ω = 3.4Ω."
  },
  {
    "id": 4047,
    "question": "What is the primary function of a 'Tamper' circuit in an intruder alarm system installation?",
    "options": [
      "To trigger the alarm if a device cover is removed or a cable is cut.",
      "To prevent the alarm from sounding during the daytime.",
      "To monitor the state of the fire alarm system EOL resistor.",
      "To provide a backup power source for the PIR detectors."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A tamper circuit is a 24-hour monitored loop that triggers the alarm if any part of the system (detector covers, control panel, or cabling) is interfered with, even if the system is unset."
  },
  {
    "id": 4048,
    "question": "A 12V DC alarm sounder has a current demand of 0.5A. The supply cable has a total resistance of 3Ω. Calculate the voltage drop across the cable and the resulting voltage at the sounder.",
    "options": [
      "1.5V drop; 10.5V at sounder",
      "1.5V drop; 13.5V at sounder",
      "6.0V drop; 6.0V at sounder",
      "0.5V drop; 11.5V at sounder"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Voltage drop (V) = I x R. V = 0.5A x 3Ω = 1.5V. The voltage at the sounder is the supply voltage minus the drop: 12V - 1.5V = 10.5V."
  },
  {
    "id": 4049,
    "question": "A fire alarm system is divided into 'Zones'. What is the purpose of this arrangement in a large building?",
    "options": [
      "To help the fire service quickly identify the location of the fire.",
      "To allow the alarm to be silenced in one room while it rings in another.",
      "To reduce the total voltage required to power the smoke detectors.",
      "To ensure that an open-circuit fault only affects one single detector."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Zones divide a building into manageable areas. When an alarm triggers, the panel indicates which zone is active, allowing emergency services to head straight to the correct part of the building."
  },
  {
    "id": 4050,
    "question": "In a monitored open-circuit fire alarm zone, the panel uses a small 'supervisory' current to check for faults. If the EOL resistor is missing (circuit left open), what will the panel display?",
    "options": [
      "Fault condition",
      "Normal condition",
      "Fire alarm condition",
      "Tamper condition"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Without the EOL resistor, the circuit is physically open. The panel cannot pass its small supervisory current through the loop, so it identifies this as a 'Fault' (broken wire/missing component)."
  },
  {
    "id": 4051,
    "question": "In a standard intruder alarm system, why are the detection contacts typically wired in a 'closed-circuit' configuration?",
    "options": [
      "To ensure the alarm triggers if the cable is cut (fail-safe)",
      "To allow multiple sensors to be wired in parallel for easier installation",
      "To reduce the total resistance of the circuit and save battery power",
      "To prevent the control panel from detecting a tamper fault"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "intruder",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Closed-circuit loops are wired in series. If a burglar cuts the wire, the circuit opens, which the panel interprets as an alarm trigger, making it a 'fail-safe' design."
  },
  {
    "id": 4052,
    "question": "A fire alarm zone uses an open-circuit configuration with an End of Line (EOL) resistor of 6kΩ. If an electrician measures the resistance across the zone terminals at the panel and finds it is 0Ω, what does this indicate?",
    "options": [
      "A short circuit has occurred on the zone wiring",
      "The circuit is healthy and the EOL resistor is being detected",
      "There is a break in the cable (open circuit)",
      "The detectors are connected in series instead of parallel"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "USED_SERIES_RULE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "fire",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In an open-circuit system with an EOL resistor, the panel expects to see the resistance of that resistor (6kΩ). A reading of 0Ω indicates a short circuit, bypassing the resistor."
  },
  {
    "id": 4053,
    "question": "A retail shop requires emergency lighting over the escape route that only illuminates when the local 230V mains supply fails. What specific type of emergency lighting system is this?",
    "options": [
      "Non-maintained emergency lighting",
      "Maintained emergency lighting",
      "Standby lighting",
      "Combined maintained lighting"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "emergency-lighting",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained lights are normally OFF and only energise from their battery backup when the permanent mains supply fails."
  },
  {
    "id": 4054,
    "question": "An intruder alarm 'closed-circuit' loop consists of three magnetic door contacts connected in series. Each contact has a resistance of 0.6Ω and the circuit wiring has a resistance of 1.4Ω. What is the total resistance measured by the control panel when all doors are closed?",
    "options": [
      "3.2Ω",
      "2.0Ω",
      "0.2Ω",
      "1.8Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "USED_PARALLEL_RULE",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "intruder",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a series (closed) circuit, total resistance is the sum of all parts: (3 x 0.6Ω) + 1.4Ω = 1.8Ω + 1.4Ω = 3.2Ω."
  },
  {
    "id": 4055,
    "question": "How does a fire alarm control panel monitor the integrity of an 'open-circuit' zone to ensure a broken wire will be detected?",
    "options": [
      "By passing a small monitoring current through an End of Line (EOL) resistor",
      "By measuring the capacitance between the two zone conductors",
      "By using a separate tamper circuit wired to every smoke detector",
      "By sending a high-voltage pulse through the circuit every ten seconds"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "fire",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The EOL resistor allows a small current to flow constantly. If the wire breaks, the current stops, and the panel triggers a 'Fault' condition."
  },
  {
    "id": 4056,
    "question": "A fire alarm zone is wired as an open-circuit with a 4.7kΩ End of Line (EOL) resistor for monitoring. During a maintenance check, a technician measures a resistance of 0Ω across the zone terminals at the control panel. What does this reading specifically indicate?",
    "options": [
      "A short circuit fault has occurred on the zone cabling",
      "The circuit is in a normal, healthy standing state",
      "An open circuit fault has occurred, likely a broken wire",
      "A smoke detector has been removed from its base"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "fire",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In an open-circuit system with EOL monitoring, a healthy circuit should show the resistance of the EOL resistor (4.7kΩ). A reading of 0Ω indicates a short circuit, which bypasses the resistor entirely."
  },
  {
    "id": 4057,
    "question": "An intruder alarm system utilizes a closed-circuit configuration for its detection loop. If the loop consists of five PIR sensors, each with a contact resistance of 0.8Ω, and 40 meters of cable with a resistance of 4Ω per 100m, what is the total loop resistance when the system is set and all sensors are clear?",
    "options": [
      "5.6Ω",
      "4.0Ω",
      "7.2Ω",
      "1.6Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "USED_PARALLEL_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "intruder",
      "series"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "In a closed-circuit (series) loop: Total R = (Number of sensors * Contact R) + (Cable length * Resistance per meter). Total R = (5 * 0.8) + (40 * 0.04) = 4 + 1.6 = 5.6Ω."
  },
  {
    "id": 4058,
    "question": "A non-maintained emergency lighting luminaire is fitted with a 4W LED lamp and a 4.8V battery pack. To meet the standard 3-hour emergency duration requirement, what is the minimum required Ampere-hour (Ah) rating for the battery, assuming 100% efficiency?",
    "options": [
      "2.5 Ah",
      "1.2 Ah",
      "0.83 Ah",
      "12.0 Ah"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "emergency-lighting",
      "power"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "First find current: I = P / V = 4W / 4.8V = 0.833A. Then find capacity: Ah = Amps * Hours = 0.833A * 3h = 2.5Ah."
  },
  {
    "id": 4059,
    "question": "Why is a 'Tamper' circuit in an intruder alarm system typically wired as a continuous series loop that remains active 24 hours a day, regardless of whether the alarm is 'set' or 'unset'?",
    "options": [
      "To detect unauthorized interference with equipment at any time",
      "To provide a backup power path if the main zone fails",
      "To ensure the EOL resistor value remains constant",
      "To allow the user to test the sirens without notifying the police"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "conceptual",
      "intruder",
      "application"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Tamper circuits are designed to detect if a sensor cover is removed or a cable is cut. This must be monitored constantly to prevent the system from being disabled while unset."
  },
  {
    "id": 4060,
    "question": "A 24V DC fire alarm sounder circuit has four bells connected in parallel. Each bell has an operating current of 25mA. If the circuit is wired with cable having a total resistance of 8Ω, calculate the voltage drop across the cabling when the alarm is activated.",
    "options": [
      "0.8V",
      "0.2V",
      "2.0V",
      "1.0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "USED_SERIES_RULE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "fire",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total current I = 4 * 25mA = 100mA (0.1A). Voltage drop V = I * R = 0.1A * 8Ω = 0.8V."
  },
  {
    "id": 4061,
    "question": "In the context of emergency lighting, which of the following scenarios specifically requires the installation of 'Maintained' luminaires rather than 'Non-maintained' units?",
    "options": [
      "An exit sign in a cinema which must be visible while the audience is present",
      "A storage cupboard that is only accessed by trained staff",
      "A small office where the normal lighting provides sufficient illumination",
      "A residential hallway where the lights are controlled by a PIR sensor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "conceptual",
      "emergency-lighting",
      "application"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Maintained luminaires are used in areas where the public are present and normal lighting may be dimmed or turned off (like a cinema), ensuring exit routes are always clearly marked."
  },
  {
    "id": 4062,
    "question": "A fire alarm panel monitors a zone for 'Open Circuit' faults using a standing current. If the monitoring voltage is 24V and the EOL resistor is 6kΩ, what is the quiescent current flowing through the circuit when no detectors are triggered?",
    "options": [
      "4mA",
      "144mA",
      "0.25mA",
      "2.4mA"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "WRONG_UNITS"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "fire",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Using Ohm's Law: I = V / R. I = 24V / 6000Ω = 0.004A, which is 4mA."
  },
  {
    "id": 4063,
    "question": "An electrician is fault-finding on an intruder alarm. The panel indicates a 'Zone Fault' on a closed-circuit loop. A multimeter shows 'OL' (Infinite Resistance) across the loop terminals. What is the most likely cause of this reading?",
    "options": [
      "A broken conductor or a door being left open",
      "A short circuit between the two core wires",
      "The EOL resistor has been installed in parallel",
      "The PIR sensor has triggered and stayed active"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "application",
      "intruder",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a closed-circuit series loop, the normal state is low resistance. An 'Infinite' (OL) reading indicates the circuit has been broken (open circuit), which is the alarm condition or a fault."
  },
  {
    "id": 4064,
    "question": "A large warehouse is divided into 8 fire zones. If each zone circuit is an open-circuit type with a 10kΩ EOL resistor, what is the total current the panel must supply just to monitor all zones simultaneously at 24V?",
    "options": [
      "19.2mA",
      "2.4mA",
      "240mA",
      "1.2mA"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "calculation",
      "fire",
      "parallel"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Current per zone = 24V / 10,000Ω = 2.4mA. Total current for 8 zones = 2.4mA * 8 = 19.2mA."
  },
  {
    "id": 4065,
    "question": "Which of the following describes the 'Fail-Safe' characteristic of a closed-circuit intruder alarm system compared to an unmonitored open-circuit system?",
    "options": [
      "If a burglar cuts the wire, the circuit opens and triggers the alarm",
      "If a burglar cuts the wire, the circuit closes and prevents the alarm",
      "The system requires less battery backup during a power cut",
      "The sensors are less likely to produce false alarms from dust"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Alarm & Emergency Systems",
    "tags": [
      "conceptual",
      "intruder",
      "discrimination"
    ],
    "learningOutcomeId": "203-3L1A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a closed-circuit system, current must flow for the system to be 'Healthy'. Cutting the wire stops the current, which the panel interprets as an alarm trigger, making it inherently fail-safe."
  }
];
