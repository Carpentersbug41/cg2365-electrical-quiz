import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A2 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which type of circuit starts at the consumer unit and finishes at the last connected point without returning to the source?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Parallel loop circuit",
      "Series-parallel circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit is a branch that runs from the consumer unit to the points of utilization and ends there, unlike a ring final circuit which returns to the source."
  },
  {
    "id": 4017,
    "question": "What is the total resistance of two 15 Ω resistors connected in a series configuration?",
    "options": [
      "30 Ω",
      "7.5 Ω",
      "225 Ω",
      "15 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of the individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4018,
    "question": "If two 100 Ω resistors are connected in parallel, what is the total resistance of the circuit?",
    "options": [
      "50 Ω",
      "200 Ω",
      "10,000 Ω",
      "0.02 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "When two identical resistors are in parallel, the total resistance is half of one resistor's value (Rt = R / n)."
  },
  {
    "id": 4019,
    "question": "Which circuit type is most commonly used for a single high-power appliance like an electric shower?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Shared lighting circuit",
      "Data circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power appliances are typically served by dedicated radial circuits to ensure they have adequate current-carrying capacity and do not affect other circuits."
  },
  {
    "id": 4020,
    "question": "In a ring final circuit, what happens to the cable that supplies the socket outlets?",
    "options": [
      "It returns to the consumer unit to form a loop",
      "It ends at the last socket in the room",
      "It connects directly to the lighting circuit",
      "It must be wired in a series configuration"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is characterized by the supply cable forming a continuous loop back to the same point in the consumer unit."
  },
  {
    "id": 4021,
    "question": "Two identical 115 V lamps are connected in series across a 230 V supply. What is the voltage drop across each lamp?",
    "options": [
      "115 V",
      "230 V",
      "460 V",
      "0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the supply voltage is divided across the loads. If the loads are identical, the voltage is shared equally (230V / 2 = 115V)."
  },
  {
    "id": 4022,
    "question": "What is the primary reason for dividing an electrical installation into several separate circuits?",
    "options": [
      "To prevent a fault on one circuit from causing a total loss of power",
      "To increase the total resistance of the building",
      "To allow the use of smaller transformers",
      "To reduce the voltage available at the sockets"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "explanation",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Dividing an installation into circuits (e.g., lighting, power) ensures that a fault on one circuit does not plunge the entire building into darkness or lose all power."
  },
  {
    "id": 4023,
    "question": "Calculate the current flowing in a series circuit with a 230 V supply and a total resistance of 46 Ω.",
    "options": [
      "5 A",
      "10,580 A",
      "0.2 A",
      "184 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "ohms-law",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), 230V / 46Ω = 5A."
  },
  {
    "id": 4024,
    "question": "Which of the following would typically be connected to an alarm or emergency circuit?",
    "options": [
      "Smoke and fire detectors",
      "An electric oven",
      "A dishwasher",
      "Standard bedroom sockets"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Alarm and emergency circuits are dedicated to safety systems such as fire detection or emergency lighting."
  },
  {
    "id": 4025,
    "question": "A heating element draws 10 A of current from a 230 V supply. What is the power rating of the heater?",
    "options": [
      "2300 W",
      "23 W",
      "240 W",
      "2.3 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "power",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power is calculated using the formula P = V x I. Therefore, 230V x 10A = 2300W."
  },
  {
    "id": 4026,
    "question": "In a standard UK domestic installation, how is a ring final circuit physically connected to the consumer unit?",
    "options": [
      "Both ends of the circuit loop are connected to the same circuit breaker",
      "One end is connected to the breaker and the other to the neutral bar",
      "The circuit ends at the furthest socket outlet and does not return",
      "Each socket outlet is connected to its own individual circuit breaker"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because both ends of the phase, neutral, and CPC conductors return to the same point of origin in the consumer unit, forming a continuous loop."
  },
  {
    "id": 4027,
    "question": "A series lighting circuit contains two lamps with resistances of 150 Ω and 250 Ω. What is the total resistance of the circuit?",
    "options": [
      "400 Ω",
      "93.75 Ω",
      "37500 Ω",
      "100 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total resistance is found by simply adding the individual resistances together (Rt = R1 + R2)."
  },
  {
    "id": 4028,
    "question": "A radial power circuit has two identical 60 Ω heaters connected in parallel. What is the total resistance of this load?",
    "options": [
      "30 Ω",
      "120 Ω",
      "60 Ω",
      "3600 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "When two identical resistors are connected in parallel, the total resistance is half of one individual resistor (Rt = R / n)."
  },
  {
    "id": 4029,
    "question": "Which type of circuit is specifically used to transmit signals for internet access and telephone services within a building?",
    "options": [
      "Data and communications circuit",
      "Control circuit",
      "Alarm and emergency circuit",
      "Ring final circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TERMINOLOGY",
      "2": "TERMINOLOGY",
      "3": "TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Data and communications circuits are designed for low-voltage signal transmission such as Cat5e/Cat6 cabling for IT networks and phones."
  },
  {
    "id": 4030,
    "question": "An electrician measures a 230 V supply to a fixed heating element with a resistance of 23 Ω. What is the current flow?",
    "options": [
      "10 A",
      "5290 A",
      "0.1 A",
      "253 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using Ohm's Law (I = V / R), the current is calculated as 230 V divided by 23 Ω, which equals 10 A."
  },
  {
    "id": 4031,
    "question": "Which of the following is a primary reason for using a ring final circuit topology rather than a radial circuit for domestic socket outlets in the UK?",
    "options": [
      "It allows for a higher current carrying capacity using smaller cross-sectional area conductors",
      "It eliminates the need for RCD protection on the circuit",
      "It simplifies the testing and inspection process for the electrician",
      "It ensures that the voltage at the furthest point is exactly 230V regardless of load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONCEPTUAL_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit allows current to flow in two directions to the load, effectively doubling the current capacity of the cable (under ideal conditions), allowing for 32A protection on 2.5mm² cable."
  },
  {
    "id": 4032,
    "question": "An electrician installs two identical 40 Ω heating elements in parallel within a drying cabinet. What is the total resistance of the heating circuit?",
    "options": [
      "20 Ω",
      "80 Ω",
      "40 Ω",
      "0.05 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (R/n). 40 / 2 = 20 Ω."
  },
  {
    "id": 4033,
    "question": "A series of three resistors with values of 10 Ω, 20 Ω, and 30 Ω are connected to a 240V supply. What is the voltage drop across the 20 Ω resistor?",
    "options": [
      "80V",
      "240V",
      "4V",
      "40V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "UNITS_MISSING",
      "3": "CALCULATION_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total R = 10+20+30 = 60 Ω. Total I = V/R = 240/60 = 4A. Voltage across 20 Ω = I x R = 4 x 20 = 80V."
  },
  {
    "id": 4034,
    "question": "Why are domestic lighting circuits typically wired in parallel rather than in series?",
    "options": [
      "To ensure that if one lamp fails, the others remain operational",
      "To increase the total resistance of the circuit to save energy",
      "To ensure the current remains the same through every lamp",
      "Because series circuits require thicker cables for lighting"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONCEPTUAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, there are multiple paths for current. If one component (lamp) fails, the circuit for the other components remains closed."
  },
  {
    "id": 4035,
    "question": "A 32A ring final circuit is loaded with a single 16A appliance exactly at the midpoint of the ring. Assuming the conductors are of equal length and resistance, what current flows through each leg of the ring back to the consumer unit?",
    "options": [
      "8A",
      "16A",
      "32A",
      "4A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a ring circuit, the load current splits between the two paths. If the load is at the midpoint, the resistance of each path is equal, so the current splits equally: 16A / 2 = 8A."
  },
  {
    "id": 4036,
    "question": "Which circuit type is specifically designed to operate at Extra-Low Voltage (ELV) to provide safety for the user at the point of control?",
    "options": [
      "Control circuits for industrial machinery",
      "Radial power circuits for kitchen appliances",
      "Ring final circuits for bedroom sockets",
      "Mains-linked smoke alarm circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits often use ELV (e.g., 24V) to minimize the risk of electric shock to operators using push buttons or switches to control high-voltage machinery."
  },
  {
    "id": 4037,
    "question": "Calculate the total resistance of a circuit containing two 100 Ω resistors in parallel, which are then connected in series with a single 50 Ω resistor.",
    "options": [
      "100 Ω",
      "250 Ω",
      "33.3 Ω",
      "150 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "mixed-circuit",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First calculate the parallel section: (100 x 100) / (100 + 100) = 50 Ω. Then add the series resistor: 50 Ω + 50 Ω = 100 Ω."
  },
  {
    "id": 4038,
    "question": "When installing data and communication cabling near power circuits, why is it important to maintain physical separation or use shielded cables?",
    "options": [
      "To prevent electromagnetic interference (EMI) from affecting data signals",
      "To prevent the data cables from overheating the power cables",
      "To ensure the data cables do not increase the voltage drop of the power circuit",
      "To allow for easier identification during future maintenance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONCEPTUAL_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "explanation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables create electromagnetic fields that can induce noise (interference) into data cables, potentially corrupting data or slowing down communication speeds."
  },
  {
    "id": 4039,
    "question": "A 230V radial circuit supplies two heaters connected in parallel. Heater A is rated at 2.3 kW and Heater B is rated at 1.15 kW. What is the total current drawn from the supply?",
    "options": [
      "15A",
      "10A",
      "5A",
      "3.45A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CALCULATION_ERROR",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "power",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Current for Heater A: 2300W / 230V = 10A. Current for Heater B: 1150W / 230V = 5A. Total current in parallel = 10A + 5A = 15A."
  },
  {
    "id": 4040,
    "question": "Which of the following describes a characteristic of a series circuit?",
    "options": [
      "The current remains the same at all points in the circuit",
      "The total resistance is always less than the smallest individual resistor",
      "The voltage across each component is always equal to the supply voltage",
      "If one component fails, the rest of the circuit continues to function"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONCEPTUAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the electrons to follow, meaning the current (flow) must be identical at every point in the loop."
  },
  {
    "id": 4041,
    "question": "A series-connected control circuit contains three relay coils with resistances of 45Ω, 60Ω, and 120Ω. What is the total resistance of this circuit?",
    "options": [
      "225Ω",
      "20.9Ω",
      "120Ω",
      "180Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances: 45 + 60 + 120 = 225Ω."
  },
  {
    "id": 4042,
    "question": "In a standard 32A ring final circuit, what is the primary reason for returning the circuit conductors back to the same protective device in the consumer unit?",
    "options": [
      "To allow current to flow in two paths, effectively increasing the current-carrying capacity of the cable",
      "To provide a backup path so that if one cable is cut, all sockets remain energized",
      "To increase the voltage delivered to the furthest point on the circuit",
      "To ensure that the circuit resistance is higher than a radial circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "ring-final",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A ring final circuit allows current to divide and flow in two directions around the loop, which allows a smaller cable (typically 2.5mm²) to be protected by a larger 32A OCPD."
  },
  {
    "id": 4043,
    "question": "A radial power circuit supplies two workshop heaters connected in parallel. If Heater A draws 8A and Heater B draws 12A, what is the total current supplied by the circuit?",
    "options": [
      "20A",
      "4.8A",
      "4A",
      "96A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch: 8A + 12A = 20A."
  },
  {
    "id": 4044,
    "question": "An electrician is installing a 9.5kW electric shower in a domestic property. Which circuit topology is most appropriate for this high-load appliance?",
    "options": [
      "A dedicated radial circuit",
      "A 32A ring final circuit",
      "A series lighting circuit",
      "A shared control circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "radial",
      "power"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "High-load appliances like electric showers require a dedicated radial circuit to ensure they do not overload shared circuits and to allow for appropriate cable sizing and protection."
  },
  {
    "id": 4045,
    "question": "Three identical indicator lamps are connected in series across a 230V control supply. What is the voltage drop across each lamp?",
    "options": [
      "76.7V",
      "230V",
      "690V",
      "115V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit with identical loads, the supply voltage is divided equally across them: 230V / 3 = 76.66V."
  },
  {
    "id": 4046,
    "question": "Why are data and communication cables typically required to be physically separated from power cables within an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) from power cables affecting signal integrity",
      "To prevent the data cables from overheating due to the resistance of power cables",
      "Because data cables operate at a significantly higher frequency and voltage",
      "To ensure that the data circuit maintains a higher resistance than the power circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Power cables create magnetic fields that can induce unwanted noise (EMI) in data cables, leading to data corruption or signal loss."
  },
  {
    "id": 4047,
    "question": "A dimming rack uses two 1200Ω resistors connected in parallel for a specific control function. What is the total resistance of this combination?",
    "options": [
      "600Ω",
      "2400Ω",
      "1200Ω",
      "1Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one: 1200 / 2 = 600Ω."
  },
  {
    "id": 4048,
    "question": "A thermostat in a domestic central heating system is used to switch a motorized valve. What type of circuit does the thermostat wiring represent?",
    "options": [
      "A control circuit",
      "A ring final circuit",
      "A data communication circuit",
      "A high-power radial circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Control circuits are used to manage the operation of other equipment, such as using a low-power thermostat to trigger a heating system component."
  },
  {
    "id": 4049,
    "question": "Two 500W floodlights are connected in parallel to a 230V radial circuit. What is the total power consumed by these lights?",
    "options": [
      "1000W",
      "250W",
      "500W",
      "115,000W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In parallel (and series), total power is the sum of the individual power ratings: 500W + 500W = 1000W."
  },
  {
    "id": 4050,
    "question": "What is the primary characteristic of a 'non-maintained' emergency lighting circuit?",
    "options": [
      "The emergency lamps only operate when the normal mains supply fails",
      "The emergency lamps are permanently illuminated during normal and emergency conditions",
      "The circuit does not require any form of battery backup",
      "The lamps can only be switched on manually by a dedicated key switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Non-maintained emergency lighting is designed to stay off during normal operation and only illuminate if the local mains supply to the lighting circuit fails."
  },
  {
    "id": 4051,
    "question": "A ring final circuit is a common method for wiring socket outlets in UK domestic installations. Which of the following best describes the physical topology of this circuit type?",
    "options": [
      "The circuit conductors start at the protective device, loop through every socket, and return to the same protective device.",
      "The circuit conductors start at the protective device and terminate at the final socket in the run.",
      "Each socket outlet is wired back to the consumer unit with its own individual cable and protective device.",
      "The circuit uses a single phase conductor that branches off into multiple parallel sub-circuits at each junction box."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit is characterized by the conductors forming a continuous loop, starting and ending at the same point in the consumer unit, which allows current to flow in two directions to any point on the ring."
  },
  {
    "id": 4052,
    "question": "An electrician is installing a radial circuit to supply two 230V electric heaters. Heater A has a resistance of 46 Ω and Heater B has a resistance of 23 Ω. If both heaters are connected in parallel and switched on, what is the total resistance (Rt) of the load?",
    "options": [
      "15.33 Ω",
      "69.00 Ω",
      "23.00 Ω",
      "0.065 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For parallel loads, 1/Rt = 1/R1 + 1/R2. Here, 1/Rt = 1/46 + 1/23 = 1/46 + 2/46 = 3/46. Rt = 46 / 3 = 15.33 Ω."
  },
  {
    "id": 4053,
    "question": "A 230V radial circuit supplies a remote motor. The total resistance of the circuit conductors is 0.5 Ω and the motor draws a constant current of 16 A. Calculate the actual voltage available at the motor terminals while it is running.",
    "options": [
      "222 V",
      "8 V",
      "238 V",
      "115 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "SIGN_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "voltage-rule",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The voltage drop (Vd) is calculated using V = I x R (16A x 0.5Ω = 8V). The voltage at the load is the source voltage minus the drop: 230V - 8V = 222V."
  },
  {
    "id": 4054,
    "question": "In a large industrial installation, a 'control circuit' is separated from the 'power circuit'. What is the primary function of this control circuit?",
    "options": [
      "To use a low-current signal to safely switch or regulate a high-current load.",
      "To provide the main energy path for heavy machinery and motors.",
      "To act as a high-speed data link for internet and telecommunications.",
      "To provide a backup 230V supply in the event of a primary power failure."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are designed to manage the operation of power circuits, often using relays or contactors so that high-power equipment can be operated by low-power switches or sensors."
  },
  {
    "id": 4055,
    "question": "A 230V radial lighting circuit contains four 60W lamps connected in parallel. What is the total current drawn from the supply when all four lamps are operational?",
    "options": [
      "1.04 A",
      "0.26 A",
      "3.83 A",
      "55.20 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "current-rule",
      "power",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power (P) = 4 x 60W = 240W. Using I = P / V, the total current is 240W / 230V = 1.043 A."
  },
  {
    "id": 4056,
    "question": "An electrician is testing a specialized industrial lighting circuit. Two identical luminaires, each with a resistance of 120 Ω, are connected in parallel. This parallel bank is then connected in series with a current-limiting resistor of 15 Ω. Calculate the total resistance of the entire circuit.",
    "options": [
      "75 Ω",
      "255 Ω",
      "60 Ω",
      "135 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "mixed-circuit",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First, calculate the parallel bank: (120 * 120) / (120 + 120) = 60 Ω. Then, add the series resistor: 60 Ω + 15 Ω = 75 Ω."
  },
  {
    "id": 4057,
    "question": "In a standard 32A ring final circuit, a heavy load is connected at a point exactly one-quarter of the way around the ring from the consumer unit. If the total resistance of the phase conductor loop is 0.8 Ω, what is the resistance of the shorter path to the load?",
    "options": [
      "0.2 Ω",
      "0.6 Ω",
      "0.4 Ω",
      "0.8 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "application",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring circuit, the load sees two paths in parallel. If the total loop resistance is 0.8 Ω, and the load is at the 1/4 point, the shorter path is 1/4 of the total resistance: 0.8 / 4 = 0.2 Ω."
  },
  {
    "id": 4058,
    "question": "A heating system uses three 3 kW elements connected in parallel to a 230 V supply. If one element develops an open-circuit fault, what will be the total power output of the remaining operational elements?",
    "options": [
      "6 kW",
      "9 kW",
      "2 kW",
      "4.5 kW"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "USED_SERIES_RULE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "power",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a parallel circuit, each component operates independently. If one 3 kW element fails, the other two continue to provide 3 kW each, totaling 6 kW."
  },
  {
    "id": 4059,
    "question": "When designing a control circuit for a motor starter, a 'normally closed' (NC) stop button is wired in series with the contactor coil. What is the primary conceptual reason for using a series NC contact for the stop function?",
    "options": [
      "To ensure the circuit fails safe if a wire is broken",
      "To reduce the total resistance of the control loop",
      "To allow multiple stop buttons to be wired in parallel",
      "To increase the voltage drop across the coil"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "USED_PARALLEL_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Safety circuits use NC contacts in series so that any break in the wiring (a fault) mimics a 'stop' command, immediately de-energizing the load."
  },
  {
    "id": 4060,
    "question": "A series circuit consists of three lamps with resistances of 10 Ω, 20 Ω, and 50 Ω. If the supply voltage is 240 V, calculate the voltage drop specifically across the 50 Ω lamp.",
    "options": [
      "150 V",
      "80 V",
      "240 V",
      "30 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total R = 10+20+50 = 80 Ω. Total I = 240V / 80Ω = 3A. Voltage across 50Ω lamp = 3A * 50Ω = 150V."
  },
  {
    "id": 4061,
    "question": "Which of the following describes the behavior of current in a ring final circuit compared to a radial circuit of the same cable size and length, assuming the same load is applied at the center point?",
    "options": [
      "The current splits into two paths, effectively doubling the current-carrying capacity",
      "The current remains the same as a radial because it must travel the full loop",
      "The voltage drop is doubled because the path length is effectively doubled",
      "The resistance is quadrupled because there are twice as many conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A ring circuit provides two parallel paths for the current. This allows the use of smaller cables (e.g., 2.5mm²) to supply a higher total load (32A) than a single radial path would safely allow."
  },
  {
    "id": 4062,
    "question": "An emergency lighting system uses a 'non-maintained' configuration. What is the primary characteristic of this circuit type?",
    "options": [
      "The lamps only illuminate when the normal mains supply fails",
      "The lamps are permanently illuminated at all times",
      "The circuit uses a central battery instead of individual batteries",
      "The circuit is only used for external escape routes"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "terminology",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Non-maintained emergency lighting luminaires are designed to energize only when the standard power supply to the local lighting circuit fails."
  },
  {
    "id": 4063,
    "question": "A data and communications circuit is being installed alongside a power circuit. Why must these circuit types be segregated or use screened cabling?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power circuit affecting data signals",
      "To ensure the data circuit can draw current from the power circuit during peaks",
      "To prevent the data circuit from increasing the voltage of the power circuit",
      "To allow the data cables to act as a supplementary earth for the power circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Power cables generate electromagnetic fields that can induce noise (EMI) into data cables, leading to data loss or corruption. Segregation is required by BS 7671."
  },
  {
    "id": 4064,
    "question": "Calculate the total current drawn from a 230 V supply by a mixed circuit consisting of a 40 Ω resistor in series with a parallel pair of 20 Ω resistors.",
    "options": [
      "4.6 A",
      "2.875 A",
      "5.75 A",
      "2.3 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "mixed-circuit",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Parallel pair: (20 * 20) / (20 + 20) = 10 Ω. Total R = 40 Ω (series) + 10 Ω (parallel) = 50 Ω. Total I = 230 V / 50 Ω = 4.6 A."
  },
  {
    "id": 4065,
    "question": "In a radial power circuit supplying multiple socket outlets, how does the voltage at the furthest socket compare to the voltage at the socket closest to the consumer unit when the circuit is under heavy load?",
    "options": [
      "It is lower due to the cumulative resistance of the conductors",
      "It is higher due to the increased current at the end of the run",
      "It is exactly the same because all sockets are in parallel",
      "It is higher because the magnetic field is stronger at the end"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "While the sockets are in parallel, the supply conductors have resistance. The further the current travels, the more voltage is 'dropped' across the cable resistance (V=IR), leaving less voltage available at the furthest point."
  }
];
