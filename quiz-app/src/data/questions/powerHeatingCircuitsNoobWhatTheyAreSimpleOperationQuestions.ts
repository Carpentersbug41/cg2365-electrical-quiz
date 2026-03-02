import { TaggedQuestion } from './types';

/**
 * Power & Heating Circuits (Noob): What They Are + Simple Operation  Question Bank
 * Aligned with lesson 203-3L1P learning outcomes
 * Generated: 2026-03-02
 */

export const powerHeatingCircuitsNoobWhatTheyAreSimpleOperationQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which of the following best describes a 'power and heating' circuit in a domestic installation?",
    "options": [
      "A circuit supplying high-demand equipment like cookers or immersion heaters",
      "A circuit used exclusively for low-power LED lighting",
      "A circuit that only provides data for internet connections",
      "A circuit that only operates during daylight hours"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Power and heating circuits are designed for loads with higher current demands, such as electric showers, cookers, and water heaters."
  },
  {
    "id": 4017,
    "question": "In the context of power and heating circuits, what does the term 'radial' mean?",
    "options": [
      "The cable runs from the consumer unit directly to the load without looping back",
      "The circuit forms a complete loop back to the consumer unit",
      "The circuit is only used for round appliances like circular saws",
      "The power is transmitted via radio waves to the heater"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "radial",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit is a 'one-way' run from the source (CU) to the equipment or points of use."
  },
  {
    "id": 4018,
    "question": "Which conductor in a radial power circuit provides the return path for current under normal operating conditions?",
    "options": [
      "Neutral (N)",
      "Line (L)",
      "Circuit Protective Conductor (CPC)",
      "The local isolator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Neutral conductor (N) is the return path for the current to complete the circuit back to the source."
  },
  {
    "id": 4019,
    "question": "An immersion heater is rated at 2,300 Watts. If it is connected to a 230V supply, what is the current flow?",
    "options": [
      "10 A",
      "0.1 A",
      "529,000 A",
      "23 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Using the formula I = P / V, 2300W / 230V = 10A."
  },
  {
    "id": 4020,
    "question": "An electric shower is rated at 9,200 Watts (9.2kW). At a voltage of 230V, how much current does it draw?",
    "options": [
      "40 A",
      "2.5 A",
      "2,116,000 A",
      "92 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Current (I) = Power (P) / Voltage (V). 9200 / 230 = 40 Amps."
  },
  {
    "id": 4021,
    "question": "A heating element has a resistance of 20 ohms and draws a current of 11.5A. What is the supply voltage?",
    "options": [
      "230 V",
      "1.73 V",
      "0.57 V",
      "31.5 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "USED_SERIES_RULE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (V = I x R), 11.5A x 20 ohms = 230V."
  },
  {
    "id": 4022,
    "question": "What is the primary purpose of a local isolator near a high-power appliance like an electric cooker?",
    "options": [
      "To allow the appliance to be safely disconnected for maintenance",
      "To increase the voltage reaching the appliance",
      "To change the AC supply into a DC supply",
      "To measure the amount of energy the appliance uses"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A local isolator provides a means of switching off the power to a specific appliance for safety and repair."
  },
  {
    "id": 4023,
    "question": "A 230V immersion heater is found to draw 13A of current. What is the power rating of this heater?",
    "options": [
      "2,990 W",
      "17.7 W",
      "0.05 W",
      "243 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "USED_SERIES_RULE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Power (P) = Voltage (V) x Current (I). 230V x 13A = 2990W (approx 3kW)."
  },
  {
    "id": 4024,
    "question": "An electrician is installing a single cable run from a consumer unit to a new electric towel rail. This installation is an example of a:",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Two-way lighting circuit",
      "Parallel battery bank"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "application",
      "radial"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A single run from the source to the load is a radial circuit."
  },
  {
    "id": 4025,
    "question": "A radial heating circuit supplies two separate 500W panel heaters in a small hallway. What is the total power load on the circuit?",
    "options": [
      "1,000 W",
      "250,000 W",
      "1 W",
      "500 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "power",
      "application"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "In a simple circuit, the total power is the sum of the individual loads. 500W + 500W = 1000W."
  },
  {
    "id": 4026,
    "question": "In the context of power and heating circuits, what is meant by the term 'radial'?",
    "options": [
      "A single cable run from the consumer unit to the load",
      "A circuit that loops back from the load to the consumer unit",
      "A circuit used specifically for low-power LED lighting",
      "A circuit that only uses the CPC to carry normal current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "terminology",
      "conceptual",
      "radial"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit is a wiring topology where the cable runs from the consumer unit directly to the load (or a series of loads) without returning to the start point."
  },
  {
    "id": 4027,
    "question": "An electric immersion heater is rated at 2300W. If the supply voltage is 230V, what is the current flow through the heater?",
    "options": [
      "10 A",
      "529,000 A",
      "0.1 A",
      "2300 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Using the power formula I = P / V, the calculation is 2300W / 230V = 10A."
  },
  {
    "id": 4028,
    "question": "A small panel heater draws a current of 2A from a 230V supply. What is the resistance of the heating element?",
    "options": [
      "115 Ω",
      "460 Ω",
      "0.5 Ω",
      "105,800 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (R = V / I), the resistance is calculated as 230V / 2A = 115Ω."
  },
  {
    "id": 4029,
    "question": "Which component is typically installed near a high-power appliance, such as an electric shower, to allow it to be safely disconnected for maintenance?",
    "options": [
      "A local isolator",
      "A two-way lighting switch",
      "A consumer unit main switch",
      "A junction box"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "application",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power heating loads often require a local isolator nearby so the equipment can be safely isolated without turning off the entire building's power."
  },
  {
    "id": 4030,
    "question": "If an electric towel rail has a current of 1A flowing through it on a 230V supply, what is the power rating of the appliance?",
    "options": [
      "230 W",
      "23 W",
      "0.004 W",
      "230 kW"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "power",
      "units"
    ],
    "learningOutcomeId": "203-3L1P-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using the power formula P = V x I, the power is 230V x 1A = 230W."
  },
  {
    "id": 4031,
    "question": "An electrician is identifying circuit types in a domestic property. Which of the following best describes a 'radial' circuit used for a high-power heating load?",
    "options": [
      "A single cable run that starts at the consumer unit and terminates at the load or its local isolator",
      "A cable loop that starts and finishes at the same protective device in the consumer unit",
      "A circuit that uses multiple cables to create a ring for sharing the current load",
      "A circuit where the line and neutral conductors are connected in a continuous loop back to the source"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_PARALLEL_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "radial",
      "topology-identification",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A radial circuit is characterized by a single run of cable from the source (consumer unit) to the point of use (load), unlike a ring final circuit which loops back."
  },
  {
    "id": 4032,
    "question": "A homeowner has an electric shower rated at 9.2 kW connected to a 230 V supply. Calculate the current drawn by this heating load.",
    "options": [
      "40.0 A",
      "25.0 A",
      "0.025 A",
      "2116 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the power formula I = P / V: 9200W / 230V = 40A."
  },
  {
    "id": 4033,
    "question": "When tracing the path of a radial circuit for an immersion heater, what is the correct sequence of components from the source to the return?",
    "options": [
      "Consumer Unit -> Local Isolator -> Heating Element -> Neutral Bar",
      "Consumer Unit -> Heating Element -> Local Isolator -> CPC",
      "Local Isolator -> Consumer Unit -> Heating Element -> Line Terminal",
      "Neutral Bar -> Heating Element -> Local Isolator -> Consumer Unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "radial",
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "The standard path for a radial circuit starts at the CU, goes through a means of local isolation for safety, powers the load (element), and returns via the neutral."
  },
  {
    "id": 4034,
    "question": "An immersion heater has a power rating of 3 kW. If the supply voltage is 230 V, what is the approximate resistance of the heating element?",
    "options": [
      "17.63 Ω",
      "13.04 Ω",
      "0.076 Ω",
      "690 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "resistance-rule",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First find current (I = P/V = 3000/230 = 13.04A). Then find resistance (R = V/I = 230/13.04 = 17.63Ω). Alternatively, R = V² / P."
  },
  {
    "id": 4035,
    "question": "Which of the following loads would most likely be supplied by its own dedicated radial circuit in a standard domestic installation?",
    "options": [
      "An electric cooker",
      "A bedside lamp",
      "A hallway ceiling rose",
      "A door bell transformer"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "application",
      "discrimination",
      "radial"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power appliances like cookers, showers, and immersion heaters require dedicated radial circuits due to their high current demand."
  },
  {
    "id": 4036,
    "question": "A fixed space heater is rated at 2000 W. Calculate the current it draws from a 230 V supply, rounded to two decimal places.",
    "options": [
      "8.70 A",
      "0.11 A",
      "4.60 A",
      "26.45 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using I = P / V: 2000 / 230 = 8.695..., which rounds to 8.70 A."
  },
  {
    "id": 4037,
    "question": "In a radial heating circuit, what is the primary purpose of the Circuit Protective Conductor (CPC)?",
    "options": [
      "To provide a safe path for fault current to earth",
      "To act as the return path for current during normal operation",
      "To supply the line voltage to the heating element",
      "To regulate the temperature of the heating load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "conceptual",
      "safety",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The CPC (earth) is a safety conductor designed to carry fault current safely to earth, preventing metalwork from becoming live."
  },
  {
    "id": 4038,
    "question": "An electrician is installing a 500 W electric towel rail. If the supply voltage is 230 V, what is the current drawn by this load?",
    "options": [
      "2.17 A",
      "0.46 A",
      "115.0 A",
      "2.30 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "application"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "I = P / V. 500 / 230 = 2.1739... A, rounded to 2.17 A."
  },
  {
    "id": 4039,
    "question": "What is the specific function of a local isolator installed next to a storage heater?",
    "options": [
      "To allow the circuit to be safely disconnected for maintenance without turning off the whole house",
      "To automatically switch the heater on during off-peak hours",
      "To reduce the voltage supplied to the heater to save energy",
      "To protect the cable from overcurrent and short circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "application",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "A local isolator provides a means of switching off the power specifically to that appliance for safety and maintenance."
  },
  {
    "id": 4040,
    "question": "A heating circuit has a total resistance of 46 Ω. If it is connected to a 230 V supply, calculate the power output of the heater.",
    "options": [
      "1150 W",
      "5.00 W",
      "10580 W",
      "0.20 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "power",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using P = V² / R: (230 * 230) / 46 = 52900 / 46 = 1150 W."
  },
  {
    "id": 4041,
    "question": "Which of the following best describes the topology of a radial circuit used for a high-power heating appliance?",
    "options": [
      "A single cable run that starts at the consumer unit and terminates at the load or its isolator",
      "A continuous loop of cable that starts and ends at the same terminals in the consumer unit",
      "A circuit where the current must pass through every other appliance in the building before reaching the load",
      "A circuit that uses the CPC as the primary return path for current to the source"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "USED_SERIES_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "topology-identification",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A radial circuit is a 'one-way' run from the consumer unit to the load. It does not loop back like a ring final circuit."
  },
  {
    "id": 4042,
    "question": "A 3 kW immersion heater is connected to a 230 V supply. Calculate the approximate current flowing through the circuit.",
    "options": [
      "13.04 A",
      "0.07 A",
      "690.00 A",
      "3.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Using the power formula I = P / V, where P is 3000 W and V is 230 V, the current is 3000 / 230 = 13.04 A."
  },
  {
    "id": 4043,
    "question": "An electrician is identifying circuits in a domestic property. Which of these loads is most likely to be supplied by a dedicated radial power circuit?",
    "options": [
      "An 8.5 kW electric shower",
      "A 60 W hallway pendant light",
      "A 100 W television connected to a socket",
      "A 5 W battery-operated smoke alarm"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "application",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "High-power appliances like electric showers require their own dedicated radial circuit because their current demand is too high to share with other devices."
  },
  {
    "id": 4044,
    "question": "If two 1.5 kW storage heaters are connected in parallel on the same radial circuit, what is the total power demand of the circuit?",
    "options": [
      "3.0 kW",
      "0.75 kW",
      "1.5 kW",
      "2.25 kW"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "parallel",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total power is the sum of the individual power ratings: 1.5 kW + 1.5 kW = 3.0 kW."
  },
  {
    "id": 4045,
    "question": "What is the specific role of the Neutral (N) conductor in a typical radial heating circuit?",
    "options": [
      "To provide the return path for current to the source under normal conditions",
      "To carry the fault current to earth if a metal part becomes live",
      "To serve as the primary supply path from the consumer unit to the heater",
      "To disconnect the power automatically when the room reaches temperature"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "conceptual",
      "terminology",
      "current-rule"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The Neutral conductor completes the circuit by providing a path for the current to return to the source during normal operation."
  },
  {
    "id": 4046,
    "question": "A heating element has a measured resistance of 23 Ω. Calculate the power produced when it is connected to a 230 V supply.",
    "options": [
      "2300 W",
      "10 W",
      "5290 W",
      "0.1 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using P = V² / R: 230 * 230 = 52900. Then 52900 / 23 = 2300 W (or 2.3 kW)."
  },
  {
    "id": 4047,
    "question": "An electrician installs a double-pole switch near an electric cooker. What is the primary purpose of this local isolator?",
    "options": [
      "To safely disconnect the appliance from the supply for maintenance",
      "To increase the resistance of the circuit and save energy",
      "To convert the AC supply into a DC supply for the cooker clock",
      "To step down the voltage from 230 V to a safer 110 V level"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "application",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A local isolator allows the appliance to be switched off locally so that maintenance or repairs can be carried out safely without turning off the whole house."
  },
  {
    "id": 4048,
    "question": "Calculate the current drawn by a 9.2 kW electric shower when connected to a standard UK 230 V supply.",
    "options": [
      "40 A",
      "2116 A",
      "0.025 A",
      "9.2 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "units",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Current (I) = Power (P) / Voltage (V). 9200 W / 230 V = 40 A."
  },
  {
    "id": 4049,
    "question": "Which component in a heating circuit is responsible for ensuring the metal casing of a heater does not remain live during a fault?",
    "options": [
      "Circuit Protective Conductor (CPC)",
      "Line (L) conductor",
      "Neutral (N) conductor",
      "Thermostat controller"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "conceptual",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The CPC (earth) provides a path for fault current to flow to earth, triggering the protective device and making the circuit safe."
  },
  {
    "id": 4050,
    "question": "A 2 kW convector heater is operated for exactly 4 hours. Calculate the total energy consumed in kilowatt-hours (kWh).",
    "options": [
      "8 kWh",
      "0.5 kWh",
      "2 kWh",
      "6 kWh"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "energy",
      "conversion"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Energy (kWh) = Power (kW) x Time (h). Therefore, 2 kW x 4 hours = 8 kWh."
  },
  {
    "id": 4051,
    "question": "Which of the following best describes the layout of a radial circuit used for a domestic electric cooker?",
    "options": [
      "A single cable run from the consumer unit to the cooker via a local isolator",
      "A cable that forms a continuous loop starting and ending at the consumer unit",
      "A circuit where multiple cookers are connected in a series chain to one fuse",
      "A circuit that uses the CPC as the primary return path for current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "radial",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A radial circuit for high-power loads like cookers consists of a single cable run from the Consumer Unit (CU) directly to the load (often via an isolator), unlike a ring final circuit which loops back."
  },
  {
    "id": 4052,
    "question": "An electrician is checking the path of a radial immersion heater circuit. What is the correct sequence of components from the supply source to the heater?",
    "options": [
      "Consumer Unit -> Local Isolator -> Heater Load",
      "Consumer Unit -> Heater Load -> Local Isolator",
      "Local Isolator -> Consumer Unit -> Heater Load",
      "Heater Load -> Local Isolator -> Consumer Unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "application",
      "radial",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a standard radial installation, the power originates at the Consumer Unit, passes through a local means of isolation (for maintenance safety), and then reaches the load."
  },
  {
    "id": 4053,
    "question": "A fixed electric space heater is rated at 2.3 kW (2300 W). If it is connected to a 230 V supply, what is the current flowing through the Line and Neutral conductors?",
    "options": [
      "10 A",
      "0.1 A",
      "529 A",
      "230 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the formula I = P / V, the current is 2300W / 230V = 10A."
  },
  {
    "id": 4054,
    "question": "In a radial heating circuit, which conductor is specifically intended to provide a safe path for fault current to return to the source in the event of a failure?",
    "options": [
      "Circuit Protective Conductor (CPC)",
      "Neutral conductor",
      "Line conductor",
      "Isolator switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The CPC (Circuit Protective Conductor) is the earth path used for safety during a fault. The Line and Neutral are the functional conductors for normal operation."
  },
  {
    "id": 4055,
    "question": "A small electric towel rail has a resistance of 460 Ω. When connected to a 230 V radial circuit, what is the current demand of this heating load?",
    "options": [
      "0.5 A",
      "2 A",
      "105.8 A",
      "230 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using Ohm's Law (I = V / R), the current is 230V / 460Ω = 0.5A."
  },
  {
    "id": 4056,
    "question": "A 3 kW immersion heater is connected to a 230 V supply via a radial circuit. What is the approximate resistance of the heating element during normal operation?",
    "options": [
      "17.6 Ω",
      "0.07 Ω",
      "13.0 Ω",
      "76.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Using the formula P = V² / R, rearranged to R = V² / P. Therefore, 230² / 3000 = 52900 / 3000 = 17.63 Ω."
  },
  {
    "id": 4057,
    "question": "An electrician is inspecting a consumer unit and identifies a single 32 A circuit breaker supplying a dedicated cable that terminates at a double-pole switch, which then connects directly to a 7.5 kW electric shower. Which circuit topology is being described?",
    "options": [
      "A radial power circuit",
      "A ring final circuit",
      "A series heating circuit",
      "A parallel lighting circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A circuit that runs from the consumer unit to a load (or group of loads) without returning to the consumer unit to form a loop is a radial circuit. High-power loads like showers are almost always on dedicated radials."
  },
  {
    "id": 4058,
    "question": "A radial circuit supplies three 2 kW fixed space heaters connected in parallel. If the supply voltage is 230 V, what is the total current demand of this circuit?",
    "options": [
      "26.1 A",
      "8.7 A",
      "115.0 A",
      "0.03 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "current-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Total Power (P) = 3 × 2000 W = 6000 W. Current (I) = P / V. So, 6000 / 230 = 26.086 A."
  },
  {
    "id": 4059,
    "question": "Which of the following describes the correct sequence of components in a standard radial heating circuit path, starting from the source of supply?",
    "options": [
      "Consumer Unit → Local Isolator → Controller → Load",
      "Consumer Unit → Load → Local Isolator → Controller",
      "Local Isolator → Consumer Unit → Controller → Load",
      "Controller → Consumer Unit → Local Isolator → Load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The standard path starts at the Consumer Unit, goes through the cable to a local means of isolation, then to any functional controller (like a thermostat), and finally to the load."
  },
  {
    "id": 4060,
    "question": "In a dead-safe environment, an apprentice is asked to identify the role of the CPC in a 3 kW towel rail circuit. Which statement correctly identifies its function during normal operation?",
    "options": [
      "It carries no current and serves as a safety path for fault currents",
      "It acts as the return path for the current to the consumer unit",
      "It provides the 230 V potential required to power the heater",
      "It regulates the temperature of the heating element"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "conceptual",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The Circuit Protective Conductor (CPC) is for safety only; it does not carry current under normal operating conditions. The Neutral is the return path."
  },
  {
    "id": 4061,
    "question": "A 4.6 kW radial heating circuit is supplied at 230 V. If the circuit cable has a total resistance of 0.5 Ω, what is the voltage drop across the cable when the heater is running?",
    "options": [
      "10 V",
      "20 V",
      "2.3 V",
      "115 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "voltage-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First find current: I = P / V = 4600 / 230 = 20 A. Then find voltage drop: V = I × R = 20 × 0.5 = 10 V."
  },
  {
    "id": 4062,
    "question": "Which of the following groups contains only examples of loads typically found on dedicated radial power and heating circuits?",
    "options": [
      "Electric shower, immersion heater, storage heater",
      "Cooker, ceiling rose, bathroom extractor fan",
      "Towel rail, 13 A socket ring, LED downlight",
      "Underfloor heating mat, doorbell transformer, desk lamp"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "application",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Showers, immersion heaters, and storage heaters are high-power or heating loads that require dedicated radial circuits. Ceiling roses and LED downlights are lighting; sockets are often rings."
  },
  {
    "id": 4063,
    "question": "A 3 kW immersion heater is controlled by a timer and runs for exactly 4 hours per day. How much energy in kilowatt-hours (kWh) does it consume in one day?",
    "options": [
      "12 kWh",
      "0.75 kWh",
      "7 kWh",
      "1.33 kWh"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "energy",
      "power"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "Energy (kWh) = Power (kW) × Time (hours). So, 3 kW × 4 hours = 12 kWh."
  },
  {
    "id": 4064,
    "question": "Why is a high-power appliance, such as a 10 kW electric cooker, typically installed on a radial circuit rather than a lighting circuit?",
    "options": [
      "The current demand exceeds the capacity of standard lighting circuits",
      "Lighting circuits do not use a Neutral return path",
      "Radial circuits are the only ones permitted to use CPCs",
      "Heating loads require AC while lighting loads require DC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "conceptual",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "High-power appliances draw significant current (e.g., 43.5 A for 10 kW). Lighting circuits are usually rated for 6 A or 10 A, making them unsuitable."
  },
  {
    "id": 4065,
    "question": "A heating element in a storage heater has a measured resistance of 23 Ω. Calculate the power output of this element when connected to a 230 V supply.",
    "options": [
      "2.3 kW",
      "5.29 kW",
      "10.0 kW",
      "0.1 kW"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_I_V_R",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Power & Heating Circuits",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3L1P-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Using P = V² / R. P = 230² / 23 = 52900 / 23 = 2300 W. Converting to kW gives 2.3 kW."
  }
];
