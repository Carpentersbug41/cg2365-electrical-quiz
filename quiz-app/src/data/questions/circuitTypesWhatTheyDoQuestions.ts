import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A1 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the defining characteristic of a radial circuit in a domestic installation?",
    "options": [
      "The circuit cable starts at the distribution board and terminates at the last point of use",
      "The circuit cable forms a continuous loop back to the distribution board",
      "The circuit is only used for high-power heating appliances",
      "The circuit must always be connected in series to save cable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "radial",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit runs from the consumer unit/distribution board to the various points of use and ends at the final point, unlike a ring circuit which returns to the start."
  },
  {
    "id": 4017,
    "question": "Which circuit type is most commonly used for standard 13A socket outlets in a large UK living room?",
    "options": [
      "Ring final circuit",
      "Series lighting circuit",
      "Three-phase motor circuit",
      "Data and communication circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Ring final circuits are a standard UK method for wiring socket outlets, allowing for two paths for the current to flow."
  },
  {
    "id": 4018,
    "question": "A simple series lighting circuit has two lamps with resistances of 100Ω and 150Ω. What is the total resistance of the circuit?",
    "options": [
      "250Ω",
      "60Ω",
      "15,000Ω",
      "50Ω"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is found by adding the individual resistances together (Rt = R1 + R2)."
  },
  {
    "id": 4019,
    "question": "Two identical 200Ω heating elements are connected in parallel. What is the total resistance of this combination?",
    "options": [
      "100Ω",
      "400Ω",
      "200Ω",
      "0.01Ω"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n)."
  },
  {
    "id": 4020,
    "question": "In a parallel circuit used for power sockets, what happens to the voltage across each socket when more appliances are turned on?",
    "options": [
      "The voltage remains the same",
      "The voltage decreases significantly",
      "The voltage increases to compensate",
      "The voltage drops to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch remains constant, regardless of how many branches are added."
  },
  {
    "id": 4021,
    "question": "Which type of circuit is designed to operate specifically during a mains power failure to ensure safe evacuation?",
    "options": [
      "Emergency lighting circuit",
      "Ring final circuit",
      "Control circuit",
      "Data and communications circuit"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Emergency lighting circuits provide illumination when the normal supply fails, often using battery backups."
  },
  {
    "id": 4022,
    "question": "A 230V radial circuit supplies a single heater with a resistance of 46Ω. Calculate the current flowing in the circuit.",
    "options": [
      "5A",
      "10,580A",
      "0.2A",
      "276A"
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
      "ohms-law",
      "calculation",
      "radial"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), 230V / 46Ω = 5A."
  },
  {
    "id": 4023,
    "question": "What is the primary purpose of a 'control circuit' in an industrial installation?",
    "options": [
      "To switch larger power loads using smaller currents",
      "To provide high-speed internet to the building",
      "To supply power to the main heating system",
      "To return current from the sockets to the board"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits (like those used with relays or contactors) allow a low-power signal to control a high-power circuit safely."
  },
  {
    "id": 4024,
    "question": "A heating element is rated at 230V and draws a current of 10A. What is the power consumed by the element?",
    "options": [
      "2,300W",
      "23W",
      "240W",
      "220W"
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
      "power",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Power is calculated using the formula P = V x I. Therefore, 230V x 10A = 2,300W."
  },
  {
    "id": 4025,
    "question": "Three resistors of 5Ω, 10Ω, and 15Ω are connected in series in a control circuit. What is the total resistance?",
    "options": [
      "30Ω",
      "2.7Ω",
      "750Ω",
      "15Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In series, total resistance is the sum of all individual resistances: 5 + 10 + 15 = 30Ω."
  },
  {
    "id": 4026,
    "question": "Which circuit type forms a continuous loop starting from the consumer unit, connecting to various socket outlets, and returning back to the same consumer unit terminals?",
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
      "topology-confusion",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is characterized by a continuous loop where both ends of the circuit cable are connected to the same protective device in the consumer unit."
  },
  {
    "id": 4027,
    "question": "A series lighting circuit contains two lamps with resistances of 400 Ω and 600 Ω. What is the total resistance of the circuit?",
    "options": [
      "1000 Ω",
      "240 Ω",
      "200 Ω",
      "240,000 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances: Rt = R1 + R2. Therefore, 400 + 600 = 1000 Ω."
  },
  {
    "id": 4028,
    "question": "Which type of circuit is specifically intended to manage the operation of other equipment, such as a thermostat regulating a central heating boiler?",
    "options": [
      "Control circuit",
      "Power circuit",
      "Ring final circuit",
      "Data and communications circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits are used to switch or regulate the operation of other circuits or equipment, rather than providing the main power for the load."
  },
  {
    "id": 4029,
    "question": "Two identical 40 Ω heating elements are connected in parallel. What is the total resistance of the heating circuit?",
    "options": [
      "20 Ω",
      "80 Ω",
      "1600 Ω",
      "40 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n). 40 / 2 = 20 Ω."
  },
  {
    "id": 4030,
    "question": "An electrician is installing a dedicated circuit for a single high-power immersion heater. Which circuit topology is most appropriate for this installation?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
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
      "application",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A radial circuit is used for dedicated loads or single items of equipment where the cable runs from the consumer unit directly to the point of use without returning."
  },
  {
    "id": 4031,
    "question": "What is a primary advantage of a ring final circuit compared to a radial circuit when used for domestic socket-outlets?",
    "options": [
      "It allows for a smaller cable cross-sectional area by providing two paths for the current",
      "It requires significantly less total cable length to install",
      "It eliminates the need for RCD protection on the circuit",
      "It ensures the voltage is higher at the midpoint of the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ring-final",
      "radial",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit starts and ends at the same point in the consumer unit, allowing current to flow in two directions. This effectively doubles the current-carrying capacity of the cable, allowing for smaller conductors (typically 2.5mm²) than a radial circuit of the same rating would require."
  },
  {
    "id": 4032,
    "question": "An electrician is testing a control circuit containing three 20 Ω relay coils connected in series. Calculate the total resistance of this part of the circuit.",
    "options": [
      "60 Ω",
      "6.67 Ω",
      "20 Ω",
      "400 Ω"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3). Therefore, 20 + 20 + 20 = 60 Ω."
  },
  {
    "id": 4033,
    "question": "A heating circuit consists of two 100 Ω elements connected in parallel across a 230V supply. What is the total resistance of the circuit?",
    "options": [
      "50 Ω",
      "200 Ω",
      "100 Ω",
      "0.02 Ω"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n). Alternatively, using the product-over-sum rule: (100 * 100) / (100 + 100) = 50 Ω."
  },
  {
    "id": 4034,
    "question": "Which circuit arrangement is most appropriate for a high-power fixed appliance, such as a 9.5 kW electric shower?",
    "options": [
      "A dedicated radial circuit",
      "A 32A ring final circuit",
      "A 20A radial circuit shared with the kitchen sockets",
      "A control and data circuit"
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
      "radial",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power appliances require a dedicated radial circuit to ensure the load does not exceed the cable capacity or cause interference with other parts of the installation."
  },
  {
    "id": 4035,
    "question": "A 230V parallel circuit has two branches. Branch A has a resistance of 46 Ω and Branch B has a resistance of 23 Ω. Calculate the total current drawn from the supply.",
    "options": [
      "15 A",
      "5 A",
      "3.33 A",
      "7.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find current in each branch: Ia = 230/46 = 5A. Ib = 230/23 = 10A. Total current in parallel is the sum of the branches: 5A + 10A = 15A."
  },
  {
    "id": 4036,
    "question": "In a series circuit containing three identical lamps, how does the voltage across each lamp relate to the supply voltage?",
    "options": [
      "Each lamp receives one-third of the total supply voltage",
      "Each lamp receives the full supply voltage",
      "The first lamp receives the full voltage and the others receive none",
      "The voltage increases as it passes through each lamp"
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
      "series",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the supply voltage is divided between the components. If the components (lamps) are identical, the voltage is shared equally."
  },
  {
    "id": 4037,
    "question": "During an inspection of a 32A ring final circuit, a break is found in the line conductor at a socket-outlet. What is the most likely risk associated with this fault?",
    "options": [
      "The cable may become overloaded as the circuit is now operating as two radials",
      "All sockets on the circuit will immediately stop working",
      "The circuit breaker will trip as soon as any load is connected",
      "The voltage at the sockets will double to 460V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ring-final",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A break in a ring final circuit turns it into two radial circuits. While appliances may still work, the 2.5mm² cable is no longer protected properly by the 32A breaker, as one 'leg' may carry more current than it is rated for."
  },
  {
    "id": 4038,
    "question": "A radial circuit cable has a total resistance of 0.5 Ω. If the connected load draws a current of 20 A, what is the voltage drop across the cable?",
    "options": [
      "10 V",
      "40 V",
      "0.025 V",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Voltage drop (V) = Current (I) x Resistance (R). V = 20A x 0.5 Ω = 10V."
  },
  {
    "id": 4039,
    "question": "Which type of circuit is typically used for building management systems (BMS) to signal temperature changes and control boiler operation?",
    "options": [
      "Control and data circuits",
      "Ring final power circuits",
      "Radial heating circuits",
      "Emergency lighting circuits"
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
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control and data circuits are designed to transmit information and low-power signals to manage equipment, whereas power circuits (like radial or ring) are designed to deliver energy to loads."
  },
  {
    "id": 4040,
    "question": "A parallel circuit contains three resistors with values of 10 Ω, 20 Ω, and 30 Ω. Calculate the total circuit resistance.",
    "options": [
      "5.45 Ω",
      "60 Ω",
      "20 Ω",
      "0.18 Ω"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Using the reciprocal formula: 1/Rt = 1/10 + 1/20 + 1/30 = 0.1 + 0.05 + 0.0333 = 0.1833. Rt = 1 / 0.1833 = 5.45 Ω."
  },
  {
    "id": 4041,
    "question": "A radial power circuit supplies two resistive heaters connected in series for a specific industrial process. If the heaters have resistances of 12 Ω and 18 Ω, what is the total resistance of the circuit (ignoring cable resistance)?",
    "options": [
      "30 Ω",
      "7.2 Ω",
      "216 Ω",
      "6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "radial",
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2). Therefore, 12 Ω + 18 Ω = 30 Ω."
  },
  {
    "id": 4042,
    "question": "What is the primary technical advantage of using a ring final circuit for socket outlets in a domestic installation compared to a radial circuit?",
    "options": [
      "It allows for a smaller cable cross-sectional area by providing two paths for current",
      "It ensures the voltage remains higher at the furthest point of the circuit",
      "It eliminates the need for a circuit protective conductor (CPC)",
      "It prevents the circuit from tripping if one part of the ring is damaged"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ring-final",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit starts and ends at the consumer unit, meaning current has two paths to reach any point. This allows the use of 2.5mm² cable to supply a 30A or 32A protective device."
  },
  {
    "id": 4043,
    "question": "A domestic lighting circuit has four LED lamps connected in parallel. If each lamp draws a current of 0.05 A, what is the total current flowing through the circuit protective device?",
    "options": [
      "0.20 A",
      "0.0125 A",
      "0.05 A",
      "0.80 A"
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
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (It = I1 + I2 + ...). 4 lamps x 0.05 A = 0.20 A."
  },
  {
    "id": 4044,
    "question": "An electrician is installing a control circuit for a heavy-duty extractor fan. Why is a separate control circuit using a contactor typically used for this application?",
    "options": [
      "To allow a low-current switch to safely operate a high-current load",
      "To convert the AC supply into a DC supply for the motor",
      "To increase the resistance of the motor windings during start-up",
      "To ensure the motor always runs at its maximum rated frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Control circuits allow for the safe switching of large loads (high current) using smaller, safer control devices (low current) like push buttons or thermostats via a contactor or relay."
  },
  {
    "id": 4045,
    "question": "Calculate the voltage drop across a 50-metre radial circuit if the cable resistance is 0.01 Ω per metre and the load current is 16 A.",
    "options": [
      "8.0 V",
      "0.16 V",
      "0.50 V",
      "32.0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "radial",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find total resistance: 50m x 0.01 Ω/m = 0.5 Ω. Then use Ohm's Law (V = I x R): 16 A x 0.5 Ω = 8.0 V."
  },
  {
    "id": 4046,
    "question": "In the context of emergency lighting systems, what does the term 'non-maintained' signify?",
    "options": [
      "The emergency lamps only operate when the normal mains supply fails",
      "The system does not require regular testing or maintenance",
      "The lamps are powered by a central battery rather than individual packs",
      "The emergency lamps remain on at all times, including during normal operation"
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
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lighting is designed to activate only when the standard lighting circuit's power supply fails."
  },
  {
    "id": 4047,
    "question": "A ring final circuit is tested, and the end-to-end resistance of the line conductor (r1) is found to be 0.8 Ω. What is the theoretical resistance (R1) measured between the line and neutral at the furthest point of the ring?",
    "options": [
      "0.2 Ω",
      "0.4 Ω",
      "0.8 Ω",
      "1.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ring-final",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For a ring final circuit, the resistance at a socket (R1) is calculated as (r1 + rn) / 4. Since r1 is 0.8 Ω, R1 = 0.8 / 4 = 0.2 Ω (assuming r1 = rn)."
  },
  {
    "id": 4048,
    "question": "Why is it critical to maintain physical separation between data/communication cables and power cables within an installation's containment system?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals",
      "To ensure the data cables do not overheat the power cables",
      "To allow the data cables to operate at a higher frequency than the power cables",
      "To prevent the power cables from drawing current from the data circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables create electromagnetic fields that can induce 'noise' or interference into data cables, leading to data loss or signal corruption."
  },
  {
    "id": 4049,
    "question": "A 230V radial circuit supplies a 4.6 kW electric shower. Calculate the design current (Ib) for this circuit.",
    "options": [
      "20 A",
      "10.58 A",
      "1,058 A",
      "19.1 A"
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
      "radial",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Design current Ib = P / V. 4600 W / 230 V = 20 A."
  },
  {
    "id": 4050,
    "question": "Which circuit topology is most appropriate for a dedicated circuit supplying a single 32A electric cooker in a domestic kitchen?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Parallel-series hybrid circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "radial",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "High-power fixed appliances like cookers are typically supplied by a dedicated radial circuit to ensure the full load is managed by a single cable and protective device."
  },
  {
    "id": 4051,
    "question": "A ring final circuit has a total line conductor loop length of 70 meters. If the resistance of the 2.5mm² copper cable is 0.0074 $\\Omega$ per meter, what is the end-to-end resistance ($r_1$) of the line conductor loop measured at the consumer unit?",
    "options": [
      "0.518 Ω",
      "0.130 Ω",
      "1.036 Ω",
      "70.00 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The end-to-end resistance ($r_1$) is the resistance of the entire length of the conductor loop. Resistance = Length × Resistance per meter. So, 70m × 0.0074 Ω/m = 0.518 Ω."
  },
  {
    "id": 4052,
    "question": "In a domestic installation, what is the primary technical advantage of using a ring final circuit for socket outlets rather than a single radial circuit using cable of the same cross-sectional area?",
    "options": [
      "It allows the load current to be split between two paths, increasing current carrying capacity",
      "It makes the circuit easier to test and fault-find for the electrician",
      "It ensures that the voltage drop is completely eliminated at the furthest point",
      "It allows for the use of smaller overcurrent protection devices"
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
      "parallel",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit starts and ends at the same point in the consumer unit, allowing current to flow in two directions to any load, effectively doubling the current-carrying capacity of the cable compared to a radial circuit of the same size."
  },
  {
    "id": 4053,
    "question": "A 9.2 kW electric shower is connected to a 230V supply via a radial circuit. Calculate the total current demand for this specific circuit.",
    "options": [
      "40.0 A",
      "21.1 A",
      "32.0 A",
      "2116.0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Using the power formula P = V × I, rearranged to I = P / V. Current = 9200W / 230V = 40A."
  },
  {
    "id": 4054,
    "question": "When comparing a 'control circuit' (such as a central heating thermostat system) to a 'power circuit' (such as a cooker circuit), which statement best describes the function of the control circuit?",
    "options": [
      "It carries signals or small currents to operate switching devices like relays or contactors",
      "It is designed to handle the main energy consumption of the building's appliances",
      "It must always be wired in a ring configuration to ensure signal redundancy",
      "It operates at high frequency to reduce the size of the required earthing conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_FREQUENCY_WITH_CURRENT"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are used to manage the operation of other circuits, often using lower currents or voltages to trigger the switching of larger loads via relays, contactors, or electronic controllers."
  },
  {
    "id": 4055,
    "question": "A lighting radial circuit contains six LED luminaires, each rated at 15W, and one outdoor floodlight rated at 150W. Calculate the total current drawn by the circuit when all lights are switched on at 230V.",
    "options": [
      "1.04 A",
      "0.65 A",
      "0.06 A",
      "240.0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Total Power = (6 × 15W) + 150W = 90W + 150W = 240W. Total Current = Total Power / Voltage = 240W / 230V ≈ 1.043A."
  },
  {
    "id": 4056,
    "question": "A domestic ring final circuit is protected by a 32A MCB and wired in 2.5mm² copper cable. If a continuity fault occurs resulting in a break in the line conductor exactly halfway around the ring, what is the immediate risk when a 26A load is applied to a socket near the break?",
    "options": [
      "One leg of the ring will carry the full 26A, potentially exceeding the current-carrying capacity of the 2.5mm² cable.",
      "The 32A MCB will trip immediately because the circuit has automatically converted to a radial topology.",
      "The voltage at the socket will double because the resistance of the circuit has been halved.",
      "The current will divide equally (13A per leg) despite the break, maintaining circuit safety."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "application",
      "ring-final"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "In a ring final circuit, the load is normally shared between two paths. If one path is broken, the circuit becomes a radial. A 2.5mm² cable clipped direct typically handles about 27A; if the load is 26A and the ring is broken, one leg carries the entire load, which is very close to or exceeds its thermal limit depending on installation method."
  },
  {
    "id": 4057,
    "question": "In a motor control circuit designed for 'Forward/Reverse' operation, an electrical interlock is wired using normally closed (NC) auxiliary contacts. What is the primary purpose of this specific circuit configuration?",
    "options": [
      "To prevent both contactors from being energized simultaneously, which would cause a phase-to-phase short circuit.",
      "To ensure the motor can only be started in the forward direction before reversing.",
      "To allow the motor to run at half speed by connecting the windings in series.",
      "To provide a path for back-EMF to dissipate safely when the motor stops."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "control"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Electrical interlocking uses the auxiliary NC contacts of one contactor in the coil circuit of the other. This ensures that if Contactor A is closed, the circuit for Contactor B is open, preventing a catastrophic short circuit across phases."
  },
  {
    "id": 4058,
    "question": "A radial power circuit supplies three electric heaters connected in parallel to a 230V supply. The heaters are rated at 1.2kW, 2.4kW, and 900W. Calculate the total current drawn from the supply.",
    "options": [
      "19.57 A",
      "4.50 A",
      "2.30 A",
      "10.43 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "UNITS_MISSING",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power (P) = 1200 + 2400 + 900 = 4500W. Using I = P / V: 4500 / 230 = 19.565A, rounded to 19.57A."
  },
  {
    "id": 4059,
    "question": "An electrician is installing a fire alarm system. According to standard practice for 'fail-safe' control circuits, how should a smoke detector be connected to a control panel to ensure a break in the wire is detected?",
    "options": [
      "Using an End-of-Line (EOL) resistor to allow a small supervisory current to flow constantly.",
      "Connecting all detectors in series so that any break shuts down the entire building power.",
      "Wiring the detectors in parallel with no resistor to ensure maximum voltage reaches the panel.",
      "Using high-resistance cable to limit the current and prevent accidental triggering."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Fire alarm circuits use an EOL resistor. The panel monitors a constant 'supervisory' current. If the wire breaks, the current drops to zero, triggering a 'Fault' signal. If a detector activates, it shorts the resistor (or adds a lower resistance), increasing current and triggering an 'Alarm'."
  },
  {
    "id": 4060,
    "question": "A lighting circuit consists of 8 LED luminaires, each with a resistance of 1.2 kΩ. If these are wired in parallel on a 230V radial circuit, what is the total circuit resistance?",
    "options": [
      "150 Ω",
      "9.6 kΩ",
      "1.2 kΩ",
      "15.0 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "For identical resistors in parallel, R_total = R / n. Here, 1200 Ω / 8 = 150 Ω."
  },
  {
    "id": 4061,
    "question": "What is the primary technical reason why high-power appliances, such as a 9.5kW electric shower, must be wired on an individual radial circuit rather than being added to a ring final circuit?",
    "options": [
      "The current demand (approx. 41A) exceeds the 32A rating of a standard ring final MCB and the capacity of 2.5mm² cable.",
      "Radial circuits provide a higher frequency supply which is required for the heating elements in a shower.",
      "Ring final circuits are only permitted to carry alternating current (AC), whereas showers require direct current (DC).",
      "A radial circuit ensures that if the shower develops a fault, the lighting circuits in the house will also trip for safety."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A 9.5kW shower draws about 41.3A (P/V). A ring final is protected at 32A and uses 2.5mm² cable. The shower requires a dedicated radial with typically 6mm² or 10mm² cable and a 40A or 45A MCB."
  },
  {
    "id": 4062,
    "question": "Two identical 230V, 3kW immersion heaters are mistakenly wired in series across a 230V supply. Calculate the total power dissipated by the circuit in this incorrect configuration.",
    "options": [
      "1500 W",
      "6000 W",
      "3000 W",
      "750 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "series",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Resistance of one heater: R = V²/P = 230²/3000 = 17.63 Ω. In series, Total R = 17.63 + 17.63 = 35.26 Ω. Total Power = V²/R_total = 230²/35.26 = 1500W. (Alternatively, in series, each heater gets half voltage, so 1/4 power each; 750W + 750W = 1500W)."
  },
  {
    "id": 4063,
    "question": "When installing data and telecommunications cabling alongside LV (230V) power cables, why does BS 7671 require specific segregation or the use of screened cables?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables inducing noise and errors in the data signals.",
      "To prevent the data cables from drawing current away from the power circuit and causing a voltage drop.",
      "Because data cables operate at a higher frequency and would cause the power cables to overheat.",
      "To ensure that the data circuit can act as a secondary CPC for the power circuit in the event of a fault."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Data cables carry low-voltage, high-frequency signals. The magnetic field around power cables can induce 'noise' into data lines (EMI), corrupting data. Segregation or screening is required to maintain signal integrity."
  },
  {
    "id": 4064,
    "question": "A complex parallel circuit has a total equivalent resistance of 12 Ω. If the circuit is composed of two branches, and Branch A has a resistance of 20 Ω, what is the resistance of Branch B?",
    "options": [
      "30 Ω",
      "8 Ω",
      "32 Ω",
      "15 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "USED_SERIES_RULE",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Using 1/Rt = 1/Ra + 1/Rb. So, 1/12 = 1/20 + 1/Rb. 1/Rb = 1/12 - 1/20. Common denominator is 60: 1/Rb = 5/60 - 3/60 = 2/60. Rb = 60/2 = 30 Ω."
  },
  {
    "id": 4065,
    "question": "In a 'Maintained' emergency lighting system used in a cinema, how does the circuit operate during a total loss of mains power?",
    "options": [
      "The internal battery takes over immediately to keep the same lamp illuminated.",
      "The lamp, which is normally off, is energized by the battery for the first time.",
      "The circuit switches from AC to DC, but still draws power from the grid.",
      "The lamp brightness increases significantly to help with evacuation."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "lighting"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Maintained luminaires are lit at all times (using mains). When mains fails, they switch to battery. 'Non-maintained' lamps only light up when the mains fails."
  }
];
