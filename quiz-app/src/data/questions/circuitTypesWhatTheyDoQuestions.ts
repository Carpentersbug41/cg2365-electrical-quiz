import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A12 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "In a series circuit containing three resistors, which electrical property remains the same at every point in the circuit?",
    "options": [
      "Current",
      "Voltage",
      "Resistance",
      "Power"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the electrons to flow, meaning the current (I) is identical at all points."
  },
  {
    "id": 4017,
    "question": "An electrician connects two resistors with values of 10 Ω and 15 Ω in series. What is the total resistance of the circuit?",
    "options": [
      "25 Ω",
      "6 Ω",
      "150 Ω",
      "5 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For resistors in series, the total resistance is the sum of the individual resistances: Rt = R1 + R2 (10 + 15 = 25 Ω)."
  },
  {
    "id": 4018,
    "question": "What is the primary characteristic that distinguishes a ring final circuit from a radial circuit?",
    "options": [
      "The circuit cable returns to the same origin point at the consumer unit",
      "It is only used for high-power immersion heaters",
      "It uses a single cable that ends at the final socket",
      "It contains only one protective device for the whole house"
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
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit forms a continuous loop where both ends of the circuit cable are connected to the same overcurrent protective device."
  },
  {
    "id": 4019,
    "question": "Calculate the total resistance of two 20 Ω resistors when they are connected in parallel.",
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "When two identical resistors are in parallel, the total resistance is half of one resistor (20 / 2 = 10 Ω)."
  },
  {
    "id": 4020,
    "question": "Which type of circuit is standard for providing power to domestic socket outlets over a large area using 2.5mm² cable?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Control circuit",
      "Data circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A12-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The ring final circuit is a common UK installation method for socket outlets, allowing for efficient current distribution."
  },
  {
    "id": 4021,
    "question": "A 12V DC power source is connected to two identical lamps in series. What is the voltage drop across each lamp?",
    "options": [
      "6 V",
      "12 V",
      "24 V",
      "0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total voltage is shared between components. For two identical components, the voltage is halved (12 / 2 = 6 V)."
  },
  {
    "id": 4022,
    "question": "Why is it important to separate data and communication cables from power cables in a building installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) affecting signals",
      "Because data cables carry much higher voltages",
      "To prevent the data cables from overheating the power cables",
      "Because data cables must always be installed in steel conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Data cables are sensitive to electromagnetic fields produced by power cables, which can cause data corruption or signal loss."
  },
  {
    "id": 4023,
    "question": "A parallel circuit has two branches. Branch 1 draws 2 A and Branch 2 draws 3 A. What is the total current supplied to the circuit?",
    "options": [
      "5 A",
      "1 A",
      "6 A",
      "1.2 A"
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
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (2 + 3 = 5 A)."
  },
  {
    "id": 4024,
    "question": "Which type of circuit is specifically used to switch a large load, such as a motor, using a smaller, safer operating current?",
    "options": [
      "Control circuit",
      "Heating circuit",
      "Radial circuit",
      "Emergency circuit"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A12-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits use low currents/voltages to operate relays or contactors that switch high-power equipment."
  },
  {
    "id": 4025,
    "question": "A circuit has a total resistance of 50 Ω and a current of 2 A. What is the supply voltage?",
    "options": [
      "100 V",
      "25 V",
      "0.04 V",
      "52 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using Ohm's Law (V = I x R), the voltage is 2 A multiplied by 50 Ω, which equals 100 V."
  },
  {
    "id": 4026,
    "question": "In a domestic ring final circuit, how are the ends of the circuit cable connected at the consumer unit?",
    "options": [
      "Both ends of the loop are connected into the same protective device",
      "One end is connected to the breaker and the other to the neutral bar",
      "The circuit ends at the furthest socket outlet without returning",
      "Each end of the loop is connected to a separate circuit breaker"
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
      "topology",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is characterized by a loop where both ends of the phase, neutral, and CPC conductors return to the same point of origin in the consumer unit."
  },
  {
    "id": 4027,
    "question": "A series lighting circuit contains two lamps with resistances of 120 Ω and 180 Ω. What is the total resistance of the circuit?",
    "options": [
      "300 Ω",
      "72 Ω",
      "21,600 Ω",
      "60 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (120 + 180 = 300)."
  },
  {
    "id": 4028,
    "question": "An electrician is installing a dedicated supply for a 9.5 kW electric shower. Which circuit topology must be used for this installation?",
    "options": [
      "A radial circuit",
      "A ring final circuit",
      "A series circuit",
      "A parallel-loop circuit"
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
      "topology",
      "units"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power fixed appliances like showers are supplied by a radial circuit, which runs directly from the consumer unit to the appliance or its isolator."
  },
  {
    "id": 4029,
    "question": "Two identical 40 Ω heating elements are connected in parallel. What is the total resistance of the combination?",
    "options": [
      "20 Ω",
      "80 Ω",
      "1,600 Ω",
      "40 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "When two identical resistors are in parallel, the total resistance is half the value of one resistor (40 / 2 = 20)."
  },
  {
    "id": 4030,
    "question": "Which statement correctly describes the behavior of electrical current in a series circuit?",
    "options": [
      "The current is the same at all points in the circuit",
      "The current divides proportionally between the components",
      "The current decreases as it passes through each resistor",
      "The current is only present at the load furthest from the source"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the current to flow, meaning the current value remains constant throughout the loop."
  },
  {
    "id": 4031,
    "question": "A series lighting circuit contains three lamps, each with a resistance of 460 Ω. What is the total resistance of the circuit?",
    "options": [
      "1380 Ω",
      "153.3 Ω",
      "460 Ω",
      "920 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances (R1 + R2 + R3). Therefore, 460 + 460 + 460 = 1380 Ω."
  },
  {
    "id": 4032,
    "question": "What is the primary technical advantage of using a ring final circuit for domestic socket outlets compared to a single radial circuit of the same cable size?",
    "options": [
      "It provides two paths for current, effectively increasing the current-carrying capacity of the circuit",
      "It ensures the voltage at the furthest point is exactly double the supply voltage",
      "It allows the circuit to continue functioning as a ring even if there is a break in the conductor",
      "It reduces the total resistance to zero by creating a continuous loop"
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
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A ring final circuit starts and ends at the same point in the consumer unit, providing two paths for current to flow to the sockets. This allows for a higher total current load than a single radial circuit using the same size cable."
  },
  {
    "id": 4033,
    "question": "Two 3 kW immersion heaters are connected in parallel to a 230 V supply. Calculate the total current drawn from the supply.",
    "options": [
      "26.09 A",
      "13.04 A",
      "6.52 A",
      "39.13 A"
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
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A12-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power (P) = 3 kW + 3 kW = 6 kW (6000 W). Using I = P / V: 6000 / 230 = 26.086 A, rounded to 26.09 A."
  },
  {
    "id": 4034,
    "question": "In an industrial environment, a 'control circuit' is often used in conjunction with a motor starter. What is the purpose of this control circuit?",
    "options": [
      "To switch a high-power load using a lower, safer voltage or current",
      "To provide the main energy source required to turn the motor",
      "To convert the 3-phase AC supply into a single-phase DC supply",
      "To act as the primary earthing path for the motor housing"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits allow operators to manage high-power equipment safely from a distance or using low-power components like push buttons and relays."
  },
  {
    "id": 4035,
    "question": "An electrician connects a 20 Ω heating element and a 30 Ω heating element in parallel. What is the total resistance of this combination?",
    "options": [
      "12 Ω",
      "50 Ω",
      "10 Ω",
      "25 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A12-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Using the product-over-sum rule for parallel resistors: (20 * 30) / (20 + 30) = 600 / 50 = 12 Ω."
  },
  {
    "id": 4036,
    "question": "If a break occurs in the line conductor of a domestic ring final circuit, what is the most likely immediate result?",
    "options": [
      "The circuit continues to work as two radial circuits, but conductors may become overloaded",
      "All sockets on the circuit will immediately lose power",
      "The circuit breaker will trip instantly due to a short circuit",
      "The voltage at all sockets will drop to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A break in a ring final circuit effectively turns it into two radial circuits fed from the same breaker. While sockets still have power, the cable is no longer protected as intended and could overheat if heavily loaded."
  },
  {
    "id": 4037,
    "question": "A 230 V radial circuit supplies two loads connected in series. Load A has a resistance of 20 Ω and Load B has a resistance of 30 Ω. Calculate the voltage drop across Load A.",
    "options": [
      "92 V",
      "115 V",
      "230 V",
      "138 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "USED_PARALLEL_RULE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A12-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total resistance = 20 + 30 = 50 Ω. Total current (I) = 230V / 50Ω = 4.6 A. Voltage across Load A = I * Ra = 4.6 * 20 = 92 V."
  },
  {
    "id": 4038,
    "question": "Why is it standard practice to keep data and communication cables separated from mains power cables in an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables affecting data signals",
      "To ensure the data cables do not draw current from the power circuit",
      "Because data cables must always be installed in steel conduit for earthing",
      "To prevent the power cables from overheating the data cables"
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
      "health-safety"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Mains cables produce electromagnetic fields that can induce noise and interference in data cables, leading to signal corruption or loss of data."
  },
  {
    "id": 4039,
    "question": "A parallel circuit contains four identical lamps. If the total current measured at the supply is 8 A, what is the current flowing through each lamp?",
    "options": [
      "2 A",
      "8 A",
      "32 A",
      "0.5 A"
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
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A12-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit with identical loads, the total current is divided equally among the branches. 8 A / 4 lamps = 2 A per lamp."
  },
  {
    "id": 4040,
    "question": "An electrician is wiring a set of emergency exit signs. Which circuit arrangement should be used to ensure that if one lamp fails, the others remain lit?",
    "options": [
      "Parallel",
      "Series",
      "Daisy-chain series",
      "Control loop"
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
      "application",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, each load has its own independent path to the supply. If one component fails (open circuit), the other branches remain complete and functional."
  },
  {
    "id": 4041,
    "question": "A series circuit consists of three resistors with values of 15 Ω, 25 Ω, and 60 Ω. What is the total resistance of the circuit?",
    "options": [
      "100 Ω",
      "7.5 Ω",
      "60 Ω",
      "22,500 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances: 15 + 25 + 60 = 100 Ω."
  },
  {
    "id": 4042,
    "question": "In a ring final circuit, what is the primary advantage of having two paths for the current to reach each socket outlet?",
    "options": [
      "It allows the use of smaller conductor cross-sectional areas for the same load",
      "It ensures the voltage is doubled at each outlet",
      "It prevents the circuit from ever tripping under overload",
      "It eliminates the need for a circuit protective conductor (CPC)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "topology-identification",
      "application"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Because current splits between two paths in a ring, the conductors can be smaller (typically 2.5mm²) than those required for a radial circuit of the same total rating (32A)."
  },
  {
    "id": 4043,
    "question": "A 230V radial power circuit supplies two heaters connected in parallel. Heater A draws 6A and Heater B draws 9A. Calculate the total current supplied by the circuit.",
    "options": [
      "15A",
      "3A",
      "54A",
      "7.5A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch: 6A + 9A = 15A."
  },
  {
    "id": 4044,
    "question": "An electrician is installing a dedicated circuit for a 7.5 kW electric shower. Which circuit topology and type is most appropriate for this installation?",
    "options": [
      "A radial circuit using a high-current cable",
      "A ring final circuit using 2.5mm² cable",
      "A series circuit connecting the shower and bathroom lights",
      "A data/control circuit using Cat5e cabling"
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
      "application",
      "radial",
      "power"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "High-load appliances like showers require a dedicated radial circuit with a cable sized to handle the full current demand (approx 32.6A)."
  },
  {
    "id": 4045,
    "question": "Why must data and communication cables be physically separated from 230V power cables within a trunking system?",
    "options": [
      "To prevent electromagnetic interference (EMI) affecting signal quality",
      "To stop the data cables from overheating the power cables",
      "Because data cables carry higher voltage than power cables",
      "To allow the data cables to use the power cable's earth"
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
      "terminology",
      "data-comms"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Separation is required to prevent electromagnetic induction from power cables causing noise or interference on data lines."
  },
  {
    "id": 4046,
    "question": "A radial lighting circuit has a total resistance of 1.2 Ω. If the total current flowing through the circuit is 4A, what is the total voltage drop across the conductors?",
    "options": [
      "4.8V",
      "3.33V",
      "0.3V",
      "5.2V"
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
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Voltage drop (V) = I × R. Therefore, 4A × 1.2 Ω = 4.8V."
  },
  {
    "id": 4047,
    "question": "Which type of circuit is specifically designed to remain functional during a mains power failure to provide safe egress from a building?",
    "options": [
      "Non-maintained emergency lighting circuit",
      "Ring final power circuit",
      "Three-phase motor control circuit",
      "Standard radial lighting circuit"
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
      "emergency-lighting",
      "application"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Emergency lighting circuits (maintained or non-maintained) use battery backups to provide illumination when the mains supply fails."
  },
  {
    "id": 4048,
    "question": "A heating circuit has a total resistance of 20 Ω and is connected to a 230V supply. Calculate the power dissipated by the circuit.",
    "options": [
      "2,645 W",
      "4,600 W",
      "11.5 W",
      "210 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Power (P) = V² / R. So, (230 × 230) / 20 = 52900 / 20 = 2645 W."
  },
  {
    "id": 4049,
    "question": "In a motor control circuit, what is the function of a 'normally open' (NO) contact on a start button?",
    "options": [
      "It completes the circuit only when the button is pressed",
      "It breaks the circuit when the button is pressed",
      "It provides a permanent path for current to flow",
      "It acts as a fuse to protect the motor from overcurrent"
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
      "control",
      "application"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "A normally open contact is open (off) in its default state and only closes (completes the circuit) when actuated."
  },
  {
    "id": 4050,
    "question": "A ring final circuit has an end-to-end loop resistance (r1) of 0.6 Ω. What is the theoretical resistance measured between line and neutral at the furthest socket (the midpoint)?",
    "options": [
      "0.15 Ω",
      "0.30 Ω",
      "0.60 Ω",
      "1.20 Ω"
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
      "calculation",
      "ring-final",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "At the midpoint of a ring, the two paths act as two resistors in parallel, each being half the total length (r1/2). Rt = (r1/2) / 2 = r1 / 4. Thus, 0.6 / 4 = 0.15 Ω."
  },
  {
    "id": 4051,
    "question": "An electrician is installing a socket circuit in a large domestic kitchen. Why is a ring final circuit often preferred over a radial circuit for this specific application?",
    "options": [
      "It allows for a higher current-carrying capacity by providing two paths for the current to flow to the sockets",
      "It simplifies the initial verification and dead testing process for the electrician",
      "It ensures that if there is a break in the conductor at any point, the entire circuit will immediately disconnect",
      "It reduces the total resistance of the circuit to exactly half of a single radial circuit of the same length"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "parallel",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A ring final circuit starts and ends at the same point in the consumer unit, effectively providing two paths for current. This allows the use of smaller cables (typically 2.5mm²) to serve a higher load (32A) than a single radial circuit of the same cable size could safely handle."
  },
  {
    "id": 4052,
    "question": "A series lighting circuit is being tested. It contains three lamps with measured resistances of 80 Ω, 120 Ω, and 150 Ω. What is the total resistance (Rt) of this circuit?",
    "options": [
      "350 Ω",
      "36.9 Ω",
      "1.44 MΩ",
      "150 Ω"
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
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances: Rt = R1 + R2 + R3. Therefore, 80 + 120 + 150 = 350 Ω."
  },
  {
    "id": 4053,
    "question": "Two heating elements are connected in parallel within an industrial oven. Element A has a resistance of 30 Ω and Element B has a resistance of 60 Ω. What is the total resistance of the heating circuit?",
    "options": [
      "20 Ω",
      "90 Ω",
      "1800 Ω",
      "0.05 Ω"
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For two resistors in parallel, the formula is (R1 × R2) / (R1 + R2). Thus, (30 × 60) / (30 + 60) = 1800 / 90 = 20 Ω."
  },
  {
    "id": 4054,
    "question": "In a commercial building, which circuit type is specifically used to switch high-power machinery on and off using a low-voltage signal for operator safety?",
    "options": [
      "Control circuit",
      "Data circuit",
      "Ring final circuit",
      "Emergency circuit"
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
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are used to manage the operation of other circuits. By using a relay or contactor, a low-voltage control circuit can safely switch a high-power load, keeping the operator away from high currents."
  },
  {
    "id": 4055,
    "question": "A radial power circuit supplies three appliances connected in parallel to a 230V mains supply. Appliance 1 draws 4A, Appliance 2 draws 6A, and Appliance 3 draws 2A. What is the voltage across Appliance 2?",
    "options": [
      "230V",
      "76.6V",
      "38.3V",
      "12V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a parallel circuit, the voltage across each branch is the same as the supply voltage. Regardless of the current drawn by the individual appliances, they all receive the full 230V supply."
  },
  {
    "id": 4056,
    "question": "A ring final circuit has a measured end-to-end resistance of the line conductor (r1) of 0.60 Ω. Calculate the resistance of the line conductor from the consumer unit to a socket outlet connected exactly at the midpoint of the ring.",
    "options": [
      "0.15 Ω",
      "0.30 Ω",
      "0.60 Ω",
      "1.20 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
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
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance to the midpoint is calculated as (r1 / 4) because the two paths to the midpoint act as two resistors in parallel, each being half the total length (r1 / 2). Using the parallel formula: (0.3 × 0.3) / (0.3 + 0.3) = 0.09 / 0.6 = 0.15 Ω."
  },
  {
    "id": 4057,
    "question": "An industrial control panel uses a 24V DC relay to switch a 400V AC three-phase motor. What is the primary functional reason for using this specific circuit arrangement?",
    "options": [
      "To provide electrical isolation between the low-voltage control signals and the high-power load",
      "To increase the starting torque of the motor using DC injection",
      "To reduce the total power consumption of the motor during operation",
      "To ensure the motor runs at a constant frequency regardless of load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "control",
      "ac-dc"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Control circuits often use lower voltages (like 24V DC) for safety and to isolate the operator's interface from the higher voltages and currents required by power circuits (like 400V motors)."
  },
  {
    "id": 4058,
    "question": "A lighting circuit in a commercial building requires the emergency luminaires to operate normally with the standard lighting but remain illuminated via an internal battery if the local mains supply fails. Which circuit type must be installed?",
    "options": [
      "Maintained emergency lighting circuit",
      "Non-maintained emergency lighting circuit",
      "Sustained emergency lighting circuit",
      "Slave emergency lighting circuit"
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
      "discrimination",
      "explanation",
      "application"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Maintained emergency lighting luminaires are designed to be operated at all times (using mains) and remain lit (using battery) during a power failure. Non-maintained only light up during a failure."
  },
  {
    "id": 4059,
    "question": "A 230V radial circuit supplies four 1.5kW electric panel heaters. If these heaters are operated simultaneously, what is the total current drawn from the supply?",
    "options": [
      "26.09 A",
      "6.52 A",
      "13.04 A",
      "31.25 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "CALCULATION_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total power = 4 × 1.5kW = 6kW (6000W). Using I = P / V: 6000 / 230 = 26.086 A, which rounds to 26.09 A."
  },
  {
    "id": 4060,
    "question": "In a ring final circuit, what is the most significant risk if the continuity of one side of the ring is broken, but the circuit protective device (MCB) does not trip?",
    "options": [
      "The remaining conductor path may become overloaded and overheat",
      "The voltage at the sockets will drop to zero immediately",
      "The circuit will automatically convert to a safe radial circuit with half the capacity",
      "The resistance of the circuit will decrease, causing the MCB to trip eventually"
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
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "If a ring is broken, it becomes two radials fed from the same 32A MCB. Since 2.5mm cables are typically rated around 20-27A, one side of the broken ring could be forced to carry up to 32A, leading to overheating without the MCB tripping."
  },
  {
    "id": 4061,
    "question": "A mixed circuit consists of two 60 Ω resistors in parallel, connected in series with a 20 Ω resistor. Calculate the total resistance of this arrangement.",
    "options": [
      "50 Ω",
      "140 Ω",
      "40 Ω",
      "15 Ω"
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
      "mixed-circuit",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Parallel part: (60 × 60) / (60 + 60) = 3600 / 120 = 30 Ω. Total resistance = 30 Ω (parallel) + 20 Ω (series) = 50 Ω."
  },
  {
    "id": 4062,
    "question": "Which of the following describes the correct wiring topology for a standard Category 6 data communication circuit in a modern office?",
    "options": [
      "A star topology where each outlet has a dedicated cable back to a central hub",
      "A ring topology where cables loop from one computer to the next",
      "A radial topology where multiple outlets are branched off a single main backbone",
      "A series topology where data passes through every device on the floor"
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
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Modern data cabling (Ethernet) uses a star topology. Each RJ45 outlet has its own 'home run' cable back to the patch panel in the communications cabinet."
  },
  {
    "id": 4063,
    "question": "An electrician is designing a circuit for a 9.5kW electric shower. Why is a radial circuit used instead of a ring final circuit for this high-power fixed appliance?",
    "options": [
      "To ensure the high load current is not split across two paths of potentially unequal resistance",
      "Because ring final circuits are only permitted to supply 13A socket outlets",
      "Because a shower requires a 110V supply which cannot be provided by a ring",
      "Because radial circuits automatically provide better earthing for wet-room equipment"
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
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "High-power fixed appliances (over 3kW or 2kW depending on design) are usually fed by dedicated radial circuits to ensure the cable is correctly rated for the full load and to prevent issues with current sharing found in rings."
  },
  {
    "id": 4064,
    "question": "A ring final circuit is wired with 2.5mm² line and neutral conductors. If the total loop length is 60 metres and the resistance of the cable is 7.41 mΩ/m, calculate the end-to-end resistance (r1) of the line conductor.",
    "options": [
      "0.44 Ω",
      "0.22 Ω",
      "0.11 Ω",
      "7.41 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "UNITS_MISSING",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "units",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "r1 = (Resistance per metre × Length) / 1000. r1 = (7.41 × 60) / 1000 = 444.6 / 1000 = 0.4446 Ω, which is 0.44 Ω."
  },
  {
    "id": 4065,
    "question": "A workshop has a 230V radial circuit supplying six 400W discharge lamps. If the lamps are left on for 10 hours a day, what is the total energy consumed per day in kilowatt-hours (kWh)?",
    "options": [
      "24 kWh",
      "2.4 kWh",
      "4 kWh",
      "240 kWh"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "energy",
      "units"
    ],
    "learningOutcomeId": "203-3A12-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total power = 6 × 400W = 2400W (2.4kW). Energy = Power (kW) × Time (h). Energy = 2.4kW × 10h = 24 kWh."
  }
];
