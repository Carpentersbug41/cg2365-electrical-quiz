import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A3 learning outcomes
 * Generated: 2026-02-07
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which of the following describes the basic topology of a ring final circuit?",
    "options": [
      "The circuit conductors leave the consumer unit and return to the same protective device",
      "The circuit conductors terminate at the furthest point from the consumer unit",
      "The circuit uses a single conductor that loops between loads without returning",
      "The circuit is connected in series so that one fault stops the whole ring"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is characterized by the conductors forming a loop, starting and ending at the same protective device in the consumer unit."
  },
  {
    "id": 4017,
    "question": "Two 20 Ω resistors are connected in a series circuit. What is the total resistance of the circuit?",
    "options": [
      "40 Ω",
      "10 Ω",
      "400 Ω",
      "20 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of the individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4018,
    "question": "What is the primary purpose of a control circuit in an electrical installation?",
    "options": [
      "To safely manage the operation of high-power equipment using lower current signals",
      "To provide the main power supply to heating and lighting loads",
      "To increase the voltage of the supply for industrial machinery",
      "To act as the primary earthing path for the entire installation"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits are used to operate switching devices like contactors or relays, allowing high-power loads to be controlled by lower-power signals."
  },
  {
    "id": 4019,
    "question": "A series circuit contains three loads with voltage drops of 10 V, 15 V, and 5 V. What is the total supply voltage required?",
    "options": [
      "30 V",
      "3.33 V",
      "750 V",
      "15 V"
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
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total supply voltage is equal to the sum of the individual voltage drops across the loads."
  },
  {
    "id": 4020,
    "question": "Which type of circuit is specifically intended for the transmission of internet, telephone, and television signals?",
    "options": [
      "Data and communications circuit",
      "Ring final circuit",
      "Radial power circuit",
      "Emergency lighting circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Data and communications circuits are designed for low-voltage signal transmission rather than power delivery."
  },
  {
    "id": 4021,
    "question": "Two identical 10 Ω heating elements are connected in parallel. What is the total resistance of the circuit?",
    "options": [
      "5 Ω",
      "20 Ω",
      "100 Ω",
      "0.2 Ω"
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
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (Rt = R / n)."
  },
  {
    "id": 4022,
    "question": "In a parallel radial circuit, how does the voltage across each individual branch compare to the supply voltage?",
    "options": [
      "It is the same as the supply voltage",
      "It is divided equally between the branches",
      "It increases as more branches are added",
      "It is always zero until the circuit is completed"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is the same as the supply voltage."
  },
  {
    "id": 4023,
    "question": "A 230 V radial circuit supplies a single heater with a resistance of 46 Ω. What is the current flowing in the circuit?",
    "options": [
      "5 A",
      "10580 A",
      "0.2 A",
      "184 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), the current is 230 V / 46 Ω = 5 A."
  },
  {
    "id": 4024,
    "question": "Which type of circuit arrangement is typically used for a high-power appliance such as a 9 kW electric shower?",
    "options": [
      "A dedicated radial circuit",
      "A ring final circuit",
      "A series lighting circuit",
      "A data and control loop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power fixed appliances like showers require a dedicated radial circuit to handle the high current demand safely."
  },
  {
    "id": 4025,
    "question": "A 230 V circuit draws a current of 13 A. What is the total power consumed by the load?",
    "options": [
      "2990 W",
      "17.69 W",
      "217 W",
      "243 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Power is calculated using the formula P = V x I. Therefore, 230 V x 13 A = 2990 W."
  },
  {
    "id": 4026,
    "question": "Which circuit topology is characterized by the circuit conductors starting and ending at the same point within the consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Parallel lighting circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "terminology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit forms a complete loop, starting and finishing at the same terminals in the consumer unit, allowing current to flow in two directions."
  },
  {
    "id": 4027,
    "question": "A heating circuit contains two heating elements connected in series, each with a resistance of 15 Ω. What is the total resistance of the circuit?",
    "options": [
      "30 Ω",
      "7.5 Ω",
      "15 Ω",
      "225 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is found by adding the individual resistances together (15 + 15 = 30 Ω)."
  },
  {
    "id": 4028,
    "question": "Which type of circuit is specifically designed to ensure safety by providing light for escape routes during a total loss of the main power supply?",
    "options": [
      "Emergency lighting circuit",
      "Control circuit",
      "Data and communication circuit",
      "Radial power circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Emergency lighting circuits are dedicated systems that operate when the normal lighting supply fails, often using battery backups."
  },
  {
    "id": 4029,
    "question": "An electrician is installing a single 32A supply to a domestic electric cooker. Which circuit arrangement is standard for this application?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Loop-in lighting circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power fixed appliances like cookers and showers are typically wired on their own dedicated radial circuit."
  },
  {
    "id": 4030,
    "question": "In a 230 V parallel lighting circuit, two identical lamps are switched on. If the voltage across the first lamp is 230 V, what is the voltage across the second lamp?",
    "options": [
      "230 V",
      "115 V",
      "460 V",
      "0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the voltage remains the same across all branches. Therefore, both lamps receive the full supply voltage of 230 V."
  },
  {
    "id": 4031,
    "question": "An electrician is installing a Ring Final Circuit for a large living room. What is the primary functional advantage of using a 'ring' topology rather than a single 'radial' circuit for this application?",
    "options": [
      "It allows for a smaller cable cross-sectional area by providing two paths for the current",
      "It ensures that if one socket fails, the rest of the circuit will continue to operate",
      "It doubles the supply voltage available to each socket on the circuit",
      "It eliminates the need for a protective device at the consumer unit"
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
      "calculation",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit splits the load current between two paths, allowing a 2.5mm² cable to safely serve a 30A or 32A protective device, which would otherwise require a much larger cable in a radial configuration."
  },
  {
    "id": 4032,
    "question": "A technician measures the end-to-end resistance of the line conductor (r1) on a ring final circuit as 0.8 Ω. What is the theoretical resistance (R1) from the consumer unit to the furthest point of the ring?",
    "options": [
      "0.2 Ω",
      "0.4 Ω",
      "1.6 Ω",
      "0.8 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring circuit, the resistance to the furthest point is calculated as (r1 / 4). Therefore, 0.8 Ω / 4 = 0.2 Ω."
  },
  {
    "id": 4033,
    "question": "Which type of circuit is specifically designed to transmit signals that operate high-power equipment via a relay or contactor?",
    "options": [
      "Control circuit",
      "Power circuit",
      "Data circuit",
      "Radial final circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "relays",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are used to manage the operation of other circuits, often using lower voltages or currents to switch larger loads through relays or contactors."
  },
  {
    "id": 4034,
    "question": "A 230V radial power circuit supplies two electric heaters connected in parallel. Heater A is rated at 2.3 kW and Heater B is rated at 1.15 kW. Calculate the total current drawn by the circuit.",
    "options": [
      "15 A",
      "10 A",
      "5 A",
      "30 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
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
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 2300W + 1150W = 3450W. Total Current (I) = P / V = 3450 / 230 = 15A."
  },
  {
    "id": 4035,
    "question": "When installing data and communication cabling alongside 230V power circuits, why is physical separation or shielding required?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables affecting data signals",
      "To prevent the data cables from overheating the power cables",
      "To ensure the voltage drop in the power circuit is minimized",
      "To allow the data cables to carry higher current during peak usage"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "UNITS_MISSING",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables generate magnetic fields that can induce 'noise' or interference in data cables, leading to data loss or corruption. Separation or shielding mitigates this EMI."
  },
  {
    "id": 4036,
    "question": "A lighting circuit has four 50W lamps connected in parallel. If the supply voltage is 230V, what is the total resistance of the lamps while they are operational?",
    "options": [
      "264.5 Ω",
      "1058 Ω",
      "200 Ω",
      "57.5 Ω"
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
      "calculation",
      "resistance-rule",
      "power"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Total Power = 4 * 50W = 200W. Using R = V² / P: R = 230² / 200 = 52900 / 200 = 264.5 Ω."
  },
  {
    "id": 4037,
    "question": "In a domestic installation, what is the typical reason for installing a 'non-maintained' emergency lighting circuit?",
    "options": [
      "The lights only illuminate when the main power supply fails",
      "The lights remain on at all times to indicate exit routes",
      "The lights are controlled by a dimmer switch for energy saving",
      "The lights are only used for outdoor security purposes"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lighting only operates when the normal healthy supply to the local lighting circuit fails."
  },
  {
    "id": 4038,
    "question": "A radial circuit serves three loads with resistances of 20 Ω, 30 Ω, and 60 Ω connected in parallel. Calculate the total resistance of the circuit.",
    "options": [
      "10 Ω",
      "110 Ω",
      "36.6 Ω",
      "20 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "ROUNDING_ERROR",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "1/Rt = 1/20 + 1/30 + 1/60 = 3/60 + 2/60 + 1/60 = 6/60. Rt = 60/6 = 10 Ω."
  },
  {
    "id": 4039,
    "question": "Which of the following describes a 'Master-Slave' control circuit arrangement often used in commercial lighting?",
    "options": [
      "A single sensor or switch controls multiple light fittings simultaneously",
      "Each light fitting operates independently with its own switch",
      "A circuit where the voltage is stepped down for safety in wet areas",
      "A ring circuit that has been broken to form two radial circuits"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a master-slave arrangement, one controlling device (like a PIR sensor) sends a signal to multiple other 'slave' units to perform the same action."
  },
  {
    "id": 4040,
    "question": "A heating circuit uses a series-parallel combination. Two 40 Ω elements are in parallel, and this pair is in series with a single 20 Ω element. What is the total circuit resistance?",
    "options": [
      "40 Ω",
      "100 Ω",
      "60 Ω",
      "33.3 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "USED_PARALLEL_RULE",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "mixed-circuit",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "The two 40 Ω elements in parallel equal 20 Ω (40/2). This 20 Ω is in series with another 20 Ω element, so 20 + 20 = 40 Ω."
  },
  {
    "id": 4041,
    "question": "A series lighting circuit contains three identical lamps, each with a resistance of 460 Ω. What is the total resistance of the circuit?",
    "options": [
      "1380 Ω",
      "153.3 Ω",
      "460 Ω",
      "211600 Ω"
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3). Therefore, 460 + 460 + 460 = 1380 Ω."
  },
  {
    "id": 4042,
    "question": "Why is a dedicated radial circuit typically used for high-power appliances like electric showers or cookers rather than a ring final circuit?",
    "options": [
      "To prevent a single heavy load from overloading a circuit shared with other outlets",
      "Because radial circuits always use less cable than ring circuits",
      "Because current is naturally higher in a radial circuit than a ring circuit",
      "To allow for more sockets to be added to the circuit in the future"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "High-power appliances require significant current; a dedicated radial circuit ensures that this load does not trip protective devices or overheat cables shared with other low-power equipment."
  },
  {
    "id": 4043,
    "question": "A parallel heating circuit consists of two 2.3 kW heaters connected to a 230 V supply. What is the total current drawn by the circuit?",
    "options": [
      "20 A",
      "10 A",
      "5 A",
      "40 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First, find the current for one heater: I = P / V = 2300W / 230V = 10A. In a parallel circuit, total current is the sum of branch currents: 10A + 10A = 20A."
  },
  {
    "id": 4044,
    "question": "When installing data and communication cabling, why is it critical to maintain physical separation from 230 V power circuits?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals",
      "To prevent the data cables from overheating due to the proximity of power cables",
      "Because data cables carry higher voltages that could damage power insulation",
      "To ensure that data cables are easier for the end-user to identify"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Power cables generate magnetic fields that can induce noise (EMI) in data cables, leading to data loss or signal degradation."
  },
  {
    "id": 4045,
    "question": "An electrician measures the end-to-end resistance of the phase conductor (r1) of a ring final circuit as 0.8 Ω. What is the theoretical resistance (R1) at the furthest point of the ring?",
    "options": [
      "0.2 Ω",
      "0.4 Ω",
      "0.8 Ω",
      "1.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "In a ring final circuit, the resistance at the furthest point is r1 / 4 because the current has two paths, each being half the length (r1/2), and these paths are in parallel ( (r1/2) / 2 = r1/4 ). 0.8 / 4 = 0.2 Ω."
  },
  {
    "id": 4046,
    "question": "What is the primary operational advantage of using an Extra Low Voltage (ELV) control circuit to switch a high-power industrial motor?",
    "options": [
      "It improves operator safety by keeping high voltages away from the control interface",
      "It increases the torque and efficiency of the motor during startup",
      "It eliminates the need for overcurrent protection in the main power circuit",
      "It reduces the total resistance of the motor windings"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Control circuits often use ELV (e.g., 24V) so that the switches handled by operators do not pose a high risk of electric shock, even if a fault occurs at the switch."
  },
  {
    "id": 4047,
    "question": "A radial circuit supplies a load of 15 A. If the total resistance of the supply cables is 0.2 Ω, calculate the voltage drop across the cable run.",
    "options": [
      "3.0 V",
      "0.013 V",
      "75 V",
      "1.5 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Voltage drop (V) = I x R. Using the values provided: 15 A x 0.2 Ω = 3.0 V."
  },
  {
    "id": 4048,
    "question": "Which of the following describes the difference between maintained and non-maintained emergency lighting circuits?",
    "options": [
      "Maintained lamps operate at all times; non-maintained only operate on power failure",
      "Non-maintained lamps operate at all times; maintained only operate on power failure",
      "Maintained circuits do not require batteries; non-maintained circuits do",
      "Non-maintained circuits are used for exits; maintained are used for toilets only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Maintained emergency lighting is designed to be lit under normal conditions and remain lit (via battery) if the mains fails. Non-maintained only illuminates when the mains supply fails."
  },
  {
    "id": 4049,
    "question": "A ring final circuit is protected by a 32 A circuit breaker. What is the primary reason the phase and neutral conductors are connected in a loop back to the consumer unit?",
    "options": [
      "To allow the load current to split between two paths, reducing the required cable size",
      "To ensure that if one socket fails, the rest of the circuit continues to work",
      "To increase the total resistance of the circuit to limit fault current",
      "To allow the circuit to operate at a higher voltage than a radial circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The loop configuration allows current to flow in two directions to any point on the ring, meaning the conductors only need to carry a portion of the total load, allowing for smaller cables (typically 2.5mm²) than a 32A radial would require."
  },
  {
    "id": 4050,
    "question": "Four 400 W heaters are connected in parallel to a 230 V supply. What is the total power consumed by the circuit?",
    "options": [
      "1600 W",
      "100 W",
      "400 W",
      "6400 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "power",
      "parallel",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total power is the sum of the power ratings of each individual load: 400 + 400 + 400 + 400 = 1600 W."
  },
  {
    "id": 4051,
    "question": "An electrician is installing a circuit that originates at a 32A circuit breaker, loops through several socket outlets, and returns to the same breaker. What is a primary characteristic of this 'ring final' circuit topology?",
    "options": [
      "It provides two paths for current to flow, effectively increasing the current-carrying capacity of the conductors",
      "It is a radial circuit used specifically for high-load immersion heaters",
      "Current only flows in one direction from the source to the final point without returning to the breaker",
      "It is a dedicated control circuit designed for data and communication systems only"
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
      "parallel",
      "topology",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit is characterized by having both ends of the circuit loop connected to the same protective device, providing two paths for current and allowing for a higher current rating using smaller cables."
  },
  {
    "id": 4052,
    "question": "During the testing of a ring final circuit, the end-to-end resistance of the line conductor (r1) is measured as 0.8 Ω. If the circuit is correctly cross-connected, what should the expected resistance (R1) be at any socket outlet?",
    "options": [
      "0.2 Ω",
      "0.4 Ω",
      "1.6 Ω",
      "3.2 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance at a socket (R1) is calculated as r1 / 4. Therefore, 0.8 Ω / 4 = 0.2 Ω."
  },
  {
    "id": 4053,
    "question": "Why are emergency lighting systems often wired as 'non-maintained' circuits rather than being integrated into the standard radial lighting circuit?",
    "options": [
      "To ensure the lamps only illuminate automatically when the local mains power supply fails",
      "To reduce the total power consumption of the building during normal operation",
      "Because emergency lights require a 24V DC supply which cannot be mixed with AC lighting",
      "To allow the emergency lights to be switched off manually by the user during a fire"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lighting is designed to trigger only when the normal power supply fails, ensuring they are ready for emergency use while being separate from standard functional lighting."
  },
  {
    "id": 4054,
    "question": "A radial circuit supplies a 2.3 kW electric heater at 230 V. If the total resistance of the circuit conductors is 0.3 Ω, what is the voltage drop across the cables when the heater is in use?",
    "options": [
      "3.0 V",
      "0.69 V",
      "6.9 V",
      "23.0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find current: I = P/V = 2300/230 = 10 A. Then find voltage drop: V = I x R = 10 A x 0.3 Ω = 3.0 V."
  },
  {
    "id": 4055,
    "question": "In an industrial control circuit, a 24 V DC relay is used to switch a large motor. If the relay coil has a resistance of 80 Ω, what current is drawn from the control supply when the relay is energized?",
    "options": [
      "0.3 A",
      "3.33 A",
      "1.92 A",
      "1920 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "ROUNDING_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law: I = V / R. Therefore, 24 V / 80 Ω = 0.3 A."
  },
  {
    "id": 4056,
    "question": "A $32\\text{A}$ ring final circuit has a measured end-to-end loop resistance ($r_1$) of $0.6\\ \\Omega$. If a single load is connected exactly at the midpoint of the ring, what is the theoretical resistance ($R_1$) from the distribution board to that specific point?",
    "options": [
      "0.15 Ω",
      "0.30 Ω",
      "0.60 Ω",
      "1.20 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance to the midpoint is the resistance of the two paths in parallel. Each path is half the loop resistance (0.3 Ω). Using the parallel rule: (0.3 × 0.3) / (0.3 + 0.3) = 0.09 / 0.6 = 0.15 Ω. This is equivalent to r1 / 4."
  },
  {
    "id": 4057,
    "question": "In a standard UK ring final circuit, why is it mandatory to ensure the continuity of the ring throughout the installation, even if the load requirements are low?",
    "options": [
      "To prevent individual sections of the cable from being overloaded by splitting the current between two paths",
      "To ensure that the circuit continues to function safely even if a break occurs in one of the conductors",
      "To reduce the total circuit resistance to zero to prevent any voltage drop at the furthest point",
      "To allow the circuit to be tested using only a standard insulation resistance tester at the consumer unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The primary purpose of the ring topology is to allow current to flow in two directions from the source, effectively doubling the current-carrying capacity of the cable. If the ring is broken, the circuit becomes two radials, and one side could easily be overloaded beyond the cable's rating while the MCB remains closed."
  },
  {
    "id": 4058,
    "question": "A $230\\text{V}$ radial power circuit supplies three $2\\text{kW}$ electric heaters. If one heater is switched off, by what percentage does the total current drawn from the supply decrease?",
    "options": [
      "33.3%",
      "50.0%",
      "66.7%",
      "25.0%"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "ROUNDING_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "radial",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a parallel radial circuit, each heater draws an equal amount of current (approx 8.7A). Removing one of the three heaters removes 1/3 of the total load, which is a 33.3% decrease."
  },
  {
    "id": 4059,
    "question": "An industrial control circuit for a conveyor motor requires a 'Stop/Start' station. To ensure the motor stops immediately if any wire in the stop circuit is severed, how should the buttons be configured?",
    "options": [
      "Stop button (Normally Closed) in series with the Start button (Normally Open)",
      "Stop button (Normally Open) in parallel with the Start button (Normally Closed)",
      "Both buttons (Normally Open) connected in a parallel configuration",
      "Stop button (Normally Closed) in parallel with the Start button (Normally Open)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "control"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "For safety (fail-safe), a Stop button must be Normally Closed (N/C) and wired in series. If the wire breaks, the circuit opens and the motor stops. The Start button is Normally Open (N/O) and wired in series to initiate the circuit."
  },
  {
    "id": 4060,
    "question": "A $230\\text{V}$ lighting radial circuit is protected by a $6\\text{A}$ MCB. The current load consists of five $60\\text{W}$ lamps and four $100\\text{W}$ lamps. Calculate the remaining current capacity available on this circuit for future additions.",
    "options": [
      "2.96 A",
      "3.04 A",
      "4.22 A",
      "1.50 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "lighting",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power = (5 × 60W) + (4 × 100W) = 300W + 400W = 700W. Total Current = P / V = 700 / 230 = 3.04A. Remaining capacity = 6A - 3.04A = 2.96A."
  },
  {
    "id": 4061,
    "question": "When installing data and communications cabling (Category 2) alongside mains power cabling (Category 1) in the same compartmented trunking, what is the primary technical reason for maintaining separation?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables corrupting data signals",
      "To prevent the heat generated by data cables from affecting the current-carrying capacity of power cables",
      "To ensure that the DC current in data cables does not cause harmonic distortion in the AC mains",
      "To allow for the use of different termination tools required for data vs power connections"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Mains power cables generate electromagnetic fields that can induce noise and interference (EMI) into sensitive data cables, leading to signal degradation or data loss. Separation or screening is required to mitigate this."
  },
  {
    "id": 4062,
    "question": "A $230\\text{V}$ radial circuit serves a $3\\text{kW}$ immersion heater. The cable used has a combined resistance (Line + Neutral) of $18\\text{m}\\Omega$ per meter. If the cable run is $20$ meters, what is the voltage measured at the heater terminals when it is operational?",
    "options": [
      "225.31 V",
      "4.69 V",
      "234.69 V",
      "212.50 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "SIGN_ERROR",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "radial",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Current I = P/V = 3000/230 = 13.043A. Total cable resistance R = 20m × 0.018 Ω/m = 0.36 Ω. Voltage drop Vd = I × R = 13.043 × 0.36 = 4.695V. Voltage at load = 230V - 4.695V = 225.305V."
  },
  {
    "id": 4063,
    "question": "A designer needs to provide power to 25 computer workstations in an open-plan office. To comply with BS 7671 regarding high protective conductor currents (earth leakage), which circuit arrangement is most suitable?",
    "options": [
      "Radial circuits with high-integrity earthing and separate CPCs",
      "A single $32\\text{A}$ ring final circuit using standard $2.5\\text{mm}^2$ cable",
      "A series circuit to ensure that all computers receive the same current",
      "A single $40\\text{A}$ radial circuit protected by a single $30\\text{mA}$ Type AC RCD"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "health-safety",
      "radial"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "IT equipment often has high earth leakage. Standard circuits may trip RCDs or have unsafe CPC currents. BS 7671 requires high-integrity earthing (e.g., dual CPCs or 10mm² CPC) for circuits likely to exceed 10mA leakage."
  },
  {
    "id": 4064,
    "question": "What is the primary operational difference between a 'Maintained' and a 'Non-Maintained' emergency lighting circuit?",
    "options": [
      "Maintained luminaires are energized at all times; Non-Maintained only light up when the mains supply fails",
      "Maintained circuits use a central battery bank; Non-Maintained use individual internal batteries",
      "Maintained circuits are for fire alarms; Non-Maintained are for power outages only",
      "Maintained luminaires use AC current; Non-Maintained luminaires use DC current at all times"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "lighting",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a maintained system, the emergency lamps are on continuously (used as normal lighting) and stay on during power failure. In a non-maintained system, the lamps only illuminate when the normal power supply fails."
  },
  {
    "id": 4065,
    "question": "A $24\\text{V}$ DC fire alarm circuit has four sounders connected in parallel. If each sounder has an internal resistance of $120\\ \\Omega$, what is the total current drawn from the alarm panel when the system is activated?",
    "options": [
      "0.80 A",
      "0.05 A",
      "0.20 A",
      "4.80 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total resistance Rt for 4 identical resistors in parallel is R / n = 120 / 4 = 30 Ω. Total current I = V / Rt = 24 / 30 = 0.8A."
  }
];
