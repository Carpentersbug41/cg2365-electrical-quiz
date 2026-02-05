import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A4 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which circuit arrangement starts at the consumer unit, loops through several points, and returns to the same protective device in the consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Control circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual",
      "ring-final"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because both ends of the circuit loop are connected to the same overcurrent protective device in the consumer unit."
  },
  {
    "id": 4017,
    "question": "A series circuit consists of two heating elements with resistances of 15 Ω and 25 Ω. What is the total resistance of the circuit?",
    "options": [
      "40 Ω",
      "10 Ω",
      "375 Ω",
      "9.38 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is found by adding the individual resistances together (Rt = R1 + R2)."
  },
  {
    "id": 4018,
    "question": "In a parallel circuit containing three lamps, what happens to the other two lamps if one lamp fails and becomes an open circuit?",
    "options": [
      "The other lamps stay lit at the same brightness",
      "All lamps in the circuit go out",
      "The other lamps get significantly brighter",
      "The circuit fuse will blow immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, each branch is independent. If one branch opens, the others still have a complete path to the supply."
  },
  {
    "id": 4019,
    "question": "What is the total resistance of two 20 Ω resistors connected in parallel?",
    "options": [
      "10 Ω",
      "40 Ω",
      "400 Ω",
      "0.1 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor's value (Rt = R / n)."
  },
  {
    "id": 4020,
    "question": "An electrician is installing a standard 6A circuit for domestic lighting. Which circuit type is most commonly used for this application?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Data circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "radial",
      "units"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Domestic lighting circuits are almost exclusively wired as radial circuits, where the cable runs from the consumer unit to the first point and ends at the last point."
  },
  {
    "id": 4021,
    "question": "A 230V circuit supplies a 2.3kW (2300W) electric heater. What is the current flowing in the circuit?",
    "options": [
      "10 A",
      "529 A",
      "0.1 A",
      "23 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using the power formula I = P / V: 2300W / 230V = 10A."
  },
  {
    "id": 4022,
    "question": "What is the primary function of a 'control circuit' in an industrial installation?",
    "options": [
      "To operate a larger power circuit safely",
      "To provide high-speed internet access",
      "To supply power to heavy motors directly",
      "To act as a backup during a power cut"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits are used to switch or regulate power circuits, often using lower voltages or currents for safety and automation."
  },
  {
    "id": 4023,
    "question": "Three identical 5A loads are connected in parallel to a single-phase supply. What is the total current drawn from the supply?",
    "options": [
      "15 A",
      "5 A",
      "1.67 A",
      "125 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (It = I1 + I2 + I3)."
  },
  {
    "id": 4024,
    "question": "Why must data and communication cables be kept separate from mains power cables in an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI)",
      "To prevent the data cables from overheating",
      "Because data cables have higher resistance",
      "To allow the data to travel at a higher frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Mains power cables create electromagnetic fields that can corrupt signals in data and communication cables if they are too close."
  },
  {
    "id": 4025,
    "question": "A radial circuit has a total resistance of 46 Ω and is connected to a 230V supply. What is the current flowing through the circuit?",
    "options": [
      "5 A",
      "10580 A",
      "0.2 A",
      "184 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using Ohm's Law (I = V / R): 230V / 46Ω = 5A."
  },
  {
    "id": 4026,
    "question": "In a ring final circuit, how is the current path structured from the consumer unit?",
    "options": [
      "It forms a continuous loop returning back to the consumer unit",
      "It ends at the furthest point of use without returning",
      "It splits into two separate circuits that never meet",
      "It only connects to a single outlet before stopping"
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
      "topology",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is characterized by starting at the consumer unit, visiting each point on the circuit, and then returning to the same consumer unit to form a loop."
  },
  {
    "id": 4027,
    "question": "A simple lighting circuit has two lamps connected in series. If each lamp has a resistance of 100 Ω, what is the total resistance of the circuit?",
    "options": [
      "200 Ω",
      "50 Ω",
      "100 Ω",
      "10,000 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2). Therefore, 100 Ω + 100 Ω = 200 Ω."
  },
  {
    "id": 4028,
    "question": "Which type of circuit is specifically designed to provide illumination when the main power supply fails?",
    "options": [
      "Emergency lighting",
      "Ring final circuit",
      "Data and communications",
      "Control circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "discrimination",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Emergency lighting circuits are dedicated systems that activate during a power outage to ensure safe egress from a building."
  },
  {
    "id": 4029,
    "question": "A radial power circuit has two heaters connected in parallel. If each heater has a resistance of 40 Ω, what is the total resistance of the circuit?",
    "options": [
      "20 Ω",
      "80 Ω",
      "40 Ω",
      "1600 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (Rt = R / n). 40 Ω / 2 = 20 Ω."
  },
  {
    "id": 4030,
    "question": "In a series control circuit, if the current measured at the start of the circuit is 2 A, what is the current flowing through a component at the end of the circuit?",
    "options": [
      "2 A",
      "1 A",
      "4 A",
      "0.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the current remains the same at all points throughout the circuit."
  },
  {
    "id": 4031,
    "question": "A radial circuit supplies three electric heaters with power ratings of 2 kW, 1.5 kW, and 500 W. If the supply voltage is 230 V, what is the total design current (Ib) for this circuit?",
    "options": [
      "17.39 A",
      "18.18 A",
      "4.00 A",
      "9.20 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total power = 2000W + 1500W + 500W = 4000W. Using the formula I = P / V: 4000 / 230 = 17.39 A."
  },
  {
    "id": 4032,
    "question": "What is the primary technical reason for choosing a Ring Final Circuit over a Radial circuit when installing domestic socket outlets over a large floor area?",
    "options": [
      "It allows for a smaller cable cross-sectional area to be used for a 32 A circuit",
      "It reduces the total amount of cable required for the installation",
      "It makes it easier for the electrician to identify the location of a fault",
      "It ensures that the voltage at the furthest socket is exactly 230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "ring-final",
      "application"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit provides two paths for the current, effectively doubling the current-carrying capacity of the cable, allowing 2.5mm² cable to be protected by a 32A device."
  },
  {
    "id": 4033,
    "question": "An electrician is installing a fire alarm system in a commercial building. According to standard practice, how should the power supply for the fire alarm control panel be configured?",
    "options": [
      "On a dedicated radial circuit via an unswitched fused connection unit",
      "Connected to the nearest 32 A ring final circuit for convenience",
      "Fed from the local lighting radial circuit to ensure it stays on",
      "Connected via a standard 13 A plug and switched socket-outlet"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "legislation",
      "terminology"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Safety systems like fire alarms must be on a dedicated circuit and protected against accidental isolation, which is why an unswitched fused connection unit (FCU) is used."
  },
  {
    "id": 4034,
    "question": "A control panel uses two identical 120 Ω heating resistors connected in parallel to prevent condensation. What is the total resistance of this heating arrangement?",
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
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (120 / 2 = 60 Ω)."
  },
  {
    "id": 4035,
    "question": "Why is it critical to maintain separation between data/communication cables and power cables within the same containment system?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals",
      "Because data cables operate at a higher frequency than the mains voltage",
      "To prevent the data cables from overheating the power cables",
      "Because data cables are required to be earthed at both ends"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables generate electromagnetic fields that can induce noise and interference in data cables, leading to signal loss or corruption."
  },
  {
    "id": 4036,
    "question": "A 32 A ring final circuit has an end-to-end resistance (r1) of 0.6 Ω. If the circuit is perfectly balanced, what would be the resistance measured between the line and neutral at the furthest point of the ring (R1+Rn)?",
    "options": [
      "0.3 Ω",
      "1.2 Ω",
      "0.6 Ω",
      "0.15 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ring-final",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "In a ring final, the resistance at the midpoint (R1+Rn) is (r1 + rn) / 4. Since r1 = 0.6 and assuming rn is the same, (0.6 + 0.6) / 4 = 0.3 Ω."
  },
  {
    "id": 4037,
    "question": "A control circuit for an industrial motor uses a 24 V AC supply for the start/stop buttons and contactor coil. What is the main benefit of this 'Extra Low Voltage' (ELV) control circuit?",
    "options": [
      "Increased safety for the operator at the control interface",
      "It allows the motor to produce more torque during startup",
      "It eliminates the need for any overcurrent protection",
      "It reduces the electricity bill for the factory significantly"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using ELV (Extra Low Voltage) for control circuits minimizes the risk of electric shock to operators using the control buttons."
  },
  {
    "id": 4038,
    "question": "A lighting radial circuit consists of twelve LED luminaires, each rated at 15 W. If a 1.2 diversity factor is NOT applied, what is the total power load in Watts?",
    "options": [
      "180 W",
      "120 W",
      "150 W",
      "27 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "units"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Total power = Number of items x Power per item. 12 x 15 W = 180 W."
  },
  {
    "id": 4039,
    "question": "Which of the following circuit types is typically used to supply a 3 kW domestic immersion heater to comply with standard UK installation practices?",
    "options": [
      "A dedicated 15 A or 20 A radial circuit",
      "A 32 A ring final circuit via a fused spur",
      "The upstairs 6 A lighting radial circuit",
      "A 45 A cooker radial circuit via a splitter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Appliances over 2 kW (like a 3 kW immersion heater) should generally be on their own dedicated radial circuit to prevent overloading general-purpose circuits."
  },
  {
    "id": 4040,
    "question": "An electrician calculates the load for a 230 V shower circuit and finds the shower is rated at 8.5 kW. What is the closest standard protective device rating required for this circuit?",
    "options": [
      "40 A",
      "32 A",
      "20 A",
      "50 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "application",
      "power"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "I = P / V. 8500 / 230 = 36.95 A. The next standard size up for a protective device is 40 A."
  },
  {
    "id": 4041,
    "question": "A series-connected control circuit contains three relay coils, each with a resistance of 120 Ω. What is the total resistance of this circuit?",
    "options": [
      "360 Ω",
      "40 Ω",
      "120 Ω",
      "0.025 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3). Therefore, 120 + 120 + 120 = 360 Ω."
  },
  {
    "id": 4042,
    "question": "An electrician is testing a 32A ring final circuit. If the line conductor is disconnected at one of the socket outlets, what does the circuit effectively become?",
    "options": [
      "Two separate radial circuits",
      "A single series circuit",
      "A parallel circuit with increased current capacity",
      "A short circuit to Earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_PARALLEL_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A ring final circuit starts and ends at the consumer unit. If the loop is broken at a socket, the circuit continues to function as two separate radial legs fed from the same circuit breaker."
  },
  {
    "id": 4043,
    "question": "A radial circuit supplies a 3 kW immersion heater at 230 V. What is the design current (Ib) for this circuit?",
    "options": [
      "13.04 A",
      "690.00 A",
      "0.07 A",
      "7.66 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Using the power formula P = V x I, rearranged to I = P / V. Therefore, 3000W / 230V = 13.04 A."
  },
  {
    "id": 4044,
    "question": "When designing a data and communications room, why is it common practice to use dedicated radial circuits rather than sharing a ring final circuit with general power?",
    "options": [
      "To prevent electromagnetic interference and handle high protective conductor currents",
      "To ensure the devices are connected in series for data synchronization",
      "Because radial circuits always provide a higher voltage than ring circuits",
      "To reduce the amount of copper cabling required in the installation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "IT equipment often produces high protective conductor currents (leakage) and is sensitive to electrical noise. Dedicated radials help manage these currents and minimize interference from other appliances."
  },
  {
    "id": 4045,
    "question": "A parallel heating circuit consists of two identical 46 Ω heating elements. What is the total resistance (Rt) of the circuit?",
    "options": [
      "23 Ω",
      "92 Ω",
      "2116 Ω",
      "0.04 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one (Rt = R / n). 46 / 2 = 23 Ω."
  },
  {
    "id": 4046,
    "question": "Which of the following best describes the primary purpose of a 'control circuit' in an electrical installation?",
    "options": [
      "To switch or regulate the operation of a separate power circuit",
      "To provide the main energy path for high-current heating loads",
      "To increase the voltage for long-distance transmission",
      "To connect the installation to the supplier's earthing terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits (like those for central heating or motor starters) are used to manage the operation of other circuits, often using lower currents or voltages to trigger switching devices like contactors."
  },
  {
    "id": 4047,
    "question": "An electrician is installing a fire alarm system. Which circuit topology is typically required to ensure all detectors can communicate with the main panel while maintaining circuit integrity?",
    "options": [
      "Radial circuit using fire-resistant cable",
      "Ring final circuit using standard PVC cable",
      "Series circuit using flexible cord",
      "Parallel circuit using data-only CAT5 cable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "legislation",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Fire alarm circuits are usually radials (or loops in addressable systems) that must be wired in fire-resistant cable (like FP200) to ensure operation during a fire."
  },
  {
    "id": 4048,
    "question": "A radial circuit has a total circuit resistance of 0.8 Ω. If the load draws a current of 20 A, what is the voltage drop across the circuit conductors?",
    "options": [
      "16 V",
      "25 V",
      "0.04 V",
      "19.2 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Voltage drop (V) = I x R. Therefore, 20 A x 0.8 Ω = 16 V."
  },
  {
    "id": 4049,
    "question": "What is a characteristic of current flow in a standard UK ring final circuit under normal operating conditions?",
    "options": [
      "The current divides and flows through both directions of the ring to the load",
      "The current flows only in one direction around the loop to the load",
      "The current is the same at every point in the ring, regardless of load position",
      "The current only flows through the protective conductor (CPC)"
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
      "current-rule",
      "explanation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a ring final circuit, the current from the consumer unit splits and travels along both 'legs' of the ring to reach the connected loads, effectively acting as two parallel paths."
  },
  {
    "id": 4050,
    "question": "A lighting circuit has four lamps connected in parallel. If each lamp has a resistance of 800 Ω, what is the total resistance of the lighting load?",
    "options": [
      "200 Ω",
      "3200 Ω",
      "800 Ω",
      "0.005 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For parallel circuits with identical resistances, Rt = R / n. Here, 800 Ω / 4 lamps = 200 Ω."
  },
  {
    "id": 4051,
    "question": "A series circuit consists of two identical heating elements, each with a resistance of 25 Ω, connected to a 230V supply. Calculate the total current flowing in the circuit.",
    "options": [
      "4.6 A",
      "18.4 A",
      "9.2 A",
      "11500 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of individual resistances (25 + 25 = 50 Ω). Using Ohm's Law (I = V / R), the current is 230V / 50 Ω = 4.6 A."
  },
  {
    "id": 4052,
    "question": "In a standard UK domestic ring final circuit, what is the primary functional reason for connecting both ends of the phase conductor to the same terminal in the consumer unit?",
    "options": [
      "To allow current to flow in two directions, effectively increasing the current carrying capacity of the cable",
      "To ensure that if one socket fails, the others continue to work in a series configuration",
      "To increase the total resistance of the circuit to limit the potential fault current",
      "To allow the circuit to operate at a higher voltage than a standard radial circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit is a form of parallel circuit where the current has two paths to reach any point, which allows the use of smaller cables (typically 2.5mm²) to serve a larger load (32A)."
  },
  {
    "id": 4053,
    "question": "Three identical 1.2 kΩ resistors are connected in parallel within a control circuit. What is the total resistance of this parallel bank?",
    "options": [
      "400 Ω",
      "3600 Ω",
      "0.0025 Ω",
      "1200 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For identical resistors in parallel, total resistance is the value of one resistor divided by the number of resistors (1200 / 3 = 400 Ω)."
  },
  {
    "id": 4054,
    "question": "An electrician is testing a 230V series lighting circuit containing two lamps. Lamp A has a resistance of 150 Ω and Lamp B has a resistance of 350 Ω. Calculate the voltage drop specifically across Lamp B.",
    "options": [
      "161 V",
      "230 V",
      "69 V",
      "115 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total R = 150 + 350 = 500 Ω. Circuit current I = V / R = 230 / 500 = 0.46 A. Voltage across Lamp B = I * Rb = 0.46 * 350 = 161 V."
  },
  {
    "id": 4055,
    "question": "Which circuit topology is most appropriate for a high-power fixed appliance, such as an 8.5kW electric shower, to ensure simple isolation and dedicated protection?",
    "options": [
      "A radial circuit",
      "A ring final circuit",
      "A series control circuit",
      "A data and communications circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "High-power appliances like showers or cookers are wired on dedicated radial circuits to ensure they have their own protective device and do not overload other parts of the installation."
  },
  {
    "id": 4056,
    "question": "A ring final circuit is installed using 2.5mm² copper conductors with a resistance of 7.41 mΩ/m. If the total length of the cable forming the ring is 80m, what is the measured end-to-end resistance (r1) of the line conductor before the ring is closed?",
    "options": [
      "0.59 Ω",
      "0.15 Ω",
      "0.30 Ω",
      "592.8 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "To find the end-to-end resistance (r1), multiply the total length by the resistance per meter: 80m * 0.00741 Ω/m = 0.5928 Ω. Rounding to two decimal places gives 0.59 Ω."
  },
  {
    "id": 4057,
    "question": "In a ring final circuit, if the line conductor is accidentally severed at the exact midpoint, what is the most significant risk to the installation during periods of high demand?",
    "options": [
      "The conductors may overheat as the circuit has effectively become two radials sharing the total load",
      "The circuit will immediately trip the RCD due to an imbalance in current",
      "All sockets located after the break will lose power completely",
      "The voltage at the sockets will double because the resistance has halved"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "A break in a ring circuit turns it into two radial circuits. While power is maintained, the load distribution is no longer balanced across the ring, which can lead to conductor overheating if the load exceeds the capacity of the individual radial legs."
  },
  {
    "id": 4058,
    "question": "A 9.2 kW electric shower is connected to a 230V supply via a radial circuit. Using the formula P = V x I, calculate the design current (Ib) for this circuit.",
    "options": [
      "40 A",
      "21.16 A",
      "2.11 A",
      "32 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DECIMAL_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Design current (Ib) = Power (P) / Voltage (V). 9200W / 230V = 40A."
  },
  {
    "id": 4059,
    "question": "When installing data and communication cables alongside 230V power circuits in a shared trunking system, why is a physical barrier or specific segregation distance required?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables affecting data integrity",
      "To prevent the data cables from drawing excess current from the power cables",
      "To ensure that the heat from the data cables does not melt the power cable insulation",
      "Because data cables carry DC current which is incompatible with AC power cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "High voltage power cables create electromagnetic fields that can induce noise (interference) in sensitive data cables, leading to data loss or corruption."
  },
  {
    "id": 4060,
    "question": "An electrician is wiring a motor control circuit. The 'Stop' button is a Normally Closed (NC) contact and the 'Start' button is a Normally Open (NO) contact. If these are wired in series with the contactor coil, what happens if the 'Stop' button wire breaks?",
    "options": [
      "The motor cannot be started, ensuring a fail-safe condition",
      "The motor will start automatically and cannot be stopped",
      "The motor will run normally but the Stop button will not work",
      "The circuit will short-circuit and trip the protective device"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "series"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a series control circuit, any break (like a loose wire or a pressed NC Stop button) opens the circuit, preventing current from reaching the coil. This is a critical safety feature."
  },
  {
    "id": 4061,
    "question": "A lighting radial circuit has five 10W LED lamps connected in parallel. If the circuit is supplied at 230V, what is the total current drawn by the lamps?",
    "options": [
      "0.217 A",
      "0.043 A",
      "1.085 A",
      "11.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "power"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power = 5 * 10W = 50W. Total Current = Total Power / Voltage = 50W / 230V = 0.217 A."
  },
  {
    "id": 4062,
    "question": "A kitchen contains an oven (3kW), a hob (6kW), and a dishwasher (2kW). Although the total load is 11kW (approx 48A), it is often permitted to be installed on a 32A or 40A circuit. What principle allows this?",
    "options": [
      "Diversity, because it is unlikely all appliances will use maximum power simultaneously",
      "Resistance, because the long cable runs reduce the actual power consumed",
      "Voltage Drop, which naturally limits the current the appliances can draw",
      "Parallelism, which splits the current into smaller, safer paths"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Diversity factors are applied during design because appliances like hobs and ovens cycle on and off via thermostats and are rarely all used at full capacity at the same time."
  },
  {
    "id": 4063,
    "question": "Calculate the total resistance of a heating bank consisting of three 45 Ω elements connected in parallel.",
    "options": [
      "15 Ω",
      "135 Ω",
      "0.06 Ω",
      "5 Ω"
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
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "For equal resistors in parallel: Rt = R / n. Here, 45 Ω / 3 = 15 Ω."
  },
  {
    "id": 4064,
    "question": "In the context of emergency lighting, what is the primary difference between a 'Maintained' and a 'Non-Maintained' circuit?",
    "options": [
      "Maintained lamps are lit at all times; Non-Maintained only lit during power failure",
      "Maintained circuits use AC; Non-Maintained circuits use DC from batteries only",
      "Maintained circuits are for exit signs; Non-Maintained are for stairwells only",
      "Maintained circuits do not require testing; Non-Maintained must be tested monthly"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Maintained emergency lighting operates like a standard light but stays on during power failure. Non-maintained only activates when the normal supply fails."
  },
  {
    "id": 4065,
    "question": "An electrician is testing a ring final circuit. The end-to-end resistance of the line conductor (r1) is 0.8 Ω and the end-to-end resistance of the CPC (rn) is 1.2 Ω. What is the expected (R1+R2) value at each socket?",
    "options": [
      "0.5 Ω",
      "2.0 Ω",
      "1.0 Ω",
      "0.25 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A4-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "For a ring final circuit, the R1+R2 at sockets is calculated as (r1 + rn) / 4. So, (0.8 + 1.2) / 4 = 2.0 / 4 = 0.5 Ω."
  }
];
