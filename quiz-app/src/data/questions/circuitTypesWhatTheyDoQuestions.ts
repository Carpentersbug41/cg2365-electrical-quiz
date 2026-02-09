import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A112 learning outcomes
 * Generated: 2026-02-09
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "A series circuit contains two resistors with values of 15Ω and 25Ω. What is the total resistance of the circuit?",
    "options": [
      "40Ω",
      "9.38Ω",
      "375Ω",
      "10Ω"
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
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is found by adding the individual resistances together (Rt = R1 + R2)."
  },
  {
    "id": 4017,
    "question": "Which of the following statements correctly describes the current in a series circuit?",
    "options": [
      "The current is the same at all points in the circuit",
      "The current splits between the different components",
      "The current increases as it passes through each resistor",
      "The current is higher at the positive terminal than the negative"
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
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the current to flow, meaning the current remains constant throughout the entire loop."
  },
  {
    "id": 4018,
    "question": "Two identical 20Ω resistors are connected in parallel. What is the total resistance of this arrangement?",
    "options": [
      "10Ω",
      "40Ω",
      "400Ω",
      "0.1Ω"
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
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For identical resistors in parallel, the total resistance is the value of one resistor divided by the number of resistors (20 / 2 = 10Ω)."
  },
  {
    "id": 4019,
    "question": "In a parallel circuit, how does the voltage across each branch compare to the supply voltage?",
    "options": [
      "The voltage across each branch is equal to the supply voltage",
      "The voltage is divided equally between the branches",
      "The voltage decreases with each additional branch",
      "The voltage is only present in the first branch"
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
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, every branch is connected directly across the supply, so the voltage across each branch is the same as the supply voltage."
  },
  {
    "id": 4020,
    "question": "An electrician is installing a circuit that starts at the consumer unit, connects to several socket outlets, and then returns to the same terminals in the consumer unit. What is this circuit called?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Control circuit"
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
      "parallel",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is a specific UK wiring arrangement where the circuit forms a continuous loop back to the source."
  },
  {
    "id": 4021,
    "question": "A 230V radial circuit supplies a single 3kW electric heater. What is the approximate current flowing in the circuit?",
    "options": [
      "13.04A",
      "690A",
      "0.07A",
      "230A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "power",
      "calculation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Current (I) = Power (P) / Voltage (V). Therefore, 3000W / 230V = 13.04A."
  },
  {
    "id": 4022,
    "question": "Which circuit type is typically used for a standard domestic lighting installation where cables run from the consumer unit to each light point in sequence without returning to the source?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Data circuit"
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
      "application",
      "parallel"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Lighting circuits are almost always wired as radial circuits, where the cable ends at the final point of use."
  },
  {
    "id": 4023,
    "question": "Three 60Ω resistors are connected in parallel. What is the total resistance of the combination?",
    "options": [
      "20Ω",
      "180Ω",
      "0.05Ω",
      "60Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "For parallel resistors: 1/Rt = 1/R1 + 1/R2 + 1/R3. Since they are identical: 60 / 3 = 20Ω."
  },
  {
    "id": 4024,
    "question": "What is the primary purpose of a 'control circuit' in an electrical installation?",
    "options": [
      "To operate larger power circuits using a smaller signal",
      "To provide high-speed internet data to the building",
      "To provide a backup return path for fault currents",
      "To increase the voltage for heavy machinery"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits are used to manage the operation of other circuits, often using relays or contactors to switch higher loads with low-power signals."
  },
  {
    "id": 4025,
    "question": "A series circuit has a 12V battery and two identical lamps. If the total resistance is 6Ω, what is the current flowing through the first lamp?",
    "options": [
      "2A",
      "72A",
      "0.5A",
      "1A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), 12V / 6Ω = 2A. In a series circuit, the current is the same at all points."
  },
  {
    "id": 4026,
    "question": "Which circuit arrangement starts at the consumer unit, connects to several socket outlets in turn, and then returns to the same protective device in the consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Parallel-tree circuit"
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
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because both ends of the circuit loop are connected to the same overcurrent protective device."
  },
  {
    "id": 4027,
    "question": "A series lighting circuit used for decorative purposes has three lamps with resistances of 80 Ω, 120 Ω, and 150 Ω. What is the total resistance of the circuit?",
    "options": [
      "350 Ω",
      "36.9 Ω",
      "150 Ω",
      "1,440,000 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances: 80 + 120 + 150 = 350 Ω."
  },
  {
    "id": 4028,
    "question": "A parallel power circuit supplies two industrial heaters. If the first heater draws 12 A and the second heater draws 15 A, what is the total current supplied to the circuit?",
    "options": [
      "27 A",
      "3 A",
      "180 A",
      "13.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in the individual branches: 12 A + 15 A = 27 A."
  },
  {
    "id": 4029,
    "question": "An electrician is installing a dedicated circuit for a 9.5 kW electric shower. Which circuit topology is standard for this type of high-power fixed load?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Control circuit"
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
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power individual loads like showers or cookers are typically wired on their own radial circuit to ensure they have an independent supply and protection."
  },
  {
    "id": 4030,
    "question": "A 230 V supply is connected to a parallel circuit containing four identical lighting points. What is the voltage across each individual lighting point?",
    "options": [
      "230 V",
      "57.5 V",
      "920 V",
      "0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage remains the same across all branches. Therefore, each point receives the full 230 V supply."
  },
  {
    "id": 4031,
    "question": "Which of the following best describes the primary advantage of using a ring final circuit over a radial circuit for domestic socket outlets?",
    "options": [
      "It allows for a smaller conductor size to be used for a higher total current demand by providing two paths for current.",
      "It is significantly easier to test and fault-find than a radial circuit.",
      "It eliminates the risk of voltage drop across the entire length of the circuit.",
      "It requires less total cable than a radial circuit covering the same floor area."
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
      "ring-final",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit splits the load current between two paths back to the consumer unit, allowing 2.5mm² cable (rated around 20A-27A) to safely serve a 30A or 32A protective device."
  },
  {
    "id": 4032,
    "question": "An electrician is installing three electric heaters in series for a specific industrial application. If the heaters have resistances of 15Ω, 20Ω, and 25Ω, what is the total resistance of the circuit?",
    "options": [
      "60Ω",
      "6.38Ω",
      "15Ω",
      "7500Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances: 15 + 20 + 25 = 60Ω."
  },
  {
    "id": 4033,
    "question": "Two identical 230V lamps, each with a resistance of 460Ω, are connected in parallel. What is the total resistance of the lighting circuit?",
    "options": [
      "230Ω",
      "920Ω",
      "460Ω",
      "0.004Ω"
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
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (R/n). 460 / 2 = 230Ω."
  },
  {
    "id": 4034,
    "question": "When installing a 9.5kW electric shower, which circuit topology must be used to ensure the high current demand is safely managed?",
    "options": [
      "A dedicated radial circuit",
      "A connection to the nearest ring final circuit",
      "A series connection from the cooker circuit",
      "A shared lighting radial circuit"
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
      "application",
      "radial",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "High-power appliances like electric showers require a dedicated radial circuit to handle the high current (approx 41A) without overloading other circuits."
  },
  {
    "id": 4035,
    "question": "In a parallel circuit containing three different loads, which of the following statements regarding voltage is correct?",
    "options": [
      "The voltage across each load is equal to the supply voltage.",
      "The supply voltage is divided proportionally between the three loads.",
      "The voltage across each load decreases as more loads are added.",
      "The sum of the voltages across each load equals the supply voltage."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the voltage remains constant across all branches and is equal to the source voltage."
  },
  {
    "id": 4036,
    "question": "A 230V parallel circuit has two branches. Branch A has a resistance of 46Ω and Branch B has a resistance of 23Ω. What is the total current drawn from the supply?",
    "options": [
      "15A",
      "5A",
      "10A",
      "3.33A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Current in Branch A = 230/46 = 5A. Current in Branch B = 230/23 = 10A. Total Current = 5A + 10A = 15A."
  },
  {
    "id": 4037,
    "question": "What is the primary purpose of a 'control circuit' in a motor starter installation?",
    "options": [
      "To use a low current/voltage to safely switch a high power circuit.",
      "To provide the main energy path for the motor to rotate.",
      "To act as a secondary earthing path for the motor casing.",
      "To convert the AC supply into DC for the motor coils."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits allow operators to interface with high-power machinery using safer, lower energy levels via relays or contactors."
  },
  {
    "id": 4038,
    "question": "During testing of a ring final circuit, the end-to-end resistance of the phase conductor (r1) is measured as 0.6Ω. What should the resistance be at any socket outlet (R1) when the ends are cross-connected at the consumer unit?",
    "options": [
      "0.15Ω",
      "0.6Ω",
      "0.3Ω",
      "1.2Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ring-final",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a perfectly balanced ring, the resistance at a socket (R1) is (r1 / 4). 0.6 / 4 = 0.15Ω."
  },
  {
    "id": 4039,
    "question": "Why is it critical to maintain physical separation between Band I (data/comms) and Band II (mains power) circuits within an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) from affecting data signals.",
      "To prevent the data cables from overheating due to mains current.",
      "Because data cables carry higher voltages than mains power.",
      "To ensure the data cables do not increase the total circuit resistance."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Mains cables create electromagnetic fields that can induce 'noise' or interference in data cables, potentially corrupting signals."
  },
  {
    "id": 4040,
    "question": "A radial circuit for a heater is supplied at 230V. The total resistance of the circuit conductors is 0.4Ω and the heater draws 20A. Calculate the actual voltage available at the heater terminals.",
    "options": [
      "222V",
      "8V",
      "238V",
      "230.4V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "SIGN_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Voltage Drop = I x R = 20A x 0.4Ω = 8V. Voltage at load = Supply - Drop = 230V - 8V = 222V."
  },
  {
    "id": 4041,
    "question": "A series circuit consists of three resistors with values of 15Ω, 25Ω, and 40Ω. Calculate the total resistance of the circuit.",
    "options": [
      "80Ω",
      "6.45Ω",
      "40Ω",
      "15,000Ω"
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
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances: Rt = R1 + R2 + R3. Therefore, 15 + 25 + 40 = 80Ω."
  },
  {
    "id": 4042,
    "question": "What is the primary advantage of using a ring final circuit for socket outlets in a domestic installation compared to a radial circuit of the same cable size?",
    "options": [
      "It provides two paths for current, effectively doubling the current-carrying capacity of the cable",
      "It requires significantly less cable to install than a radial circuit",
      "It makes fault finding easier because the circuit is a complete loop",
      "It ensures that the voltage at the furthest point is higher than the supply voltage"
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
      "conceptual",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A112-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit starts and ends at the same point in the consumer unit, meaning current has two paths to reach any point on the ring, which allows for a higher load than the cable's individual rating would suggest."
  },
  {
    "id": 4043,
    "question": "A parallel lighting circuit has two branches with resistances of 20Ω and 30Ω. Calculate the total resistance of this circuit.",
    "options": [
      "12Ω",
      "50Ω",
      "10Ω",
      "600Ω"
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
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For two resistors in parallel, Rt = (R1 x R2) / (R1 + R2). Here, (20 x 30) / (20 + 30) = 600 / 50 = 12Ω."
  },
  {
    "id": 4044,
    "question": "An electrician is installing a 3kW immersion heater in a residential property. According to standard practice, how should this load be connected?",
    "options": [
      "On its own dedicated radial circuit",
      "As part of a ring final circuit serving the bedrooms",
      "In series with the central heating pump",
      "On a 6A lighting radial circuit"
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
      "units",
      "legislation"
    ],
    "learningOutcomeId": "203-3A112-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power fixed appliances like immersion heaters (typically 3kW) should be supplied by their own dedicated radial circuit to prevent overloading and ensure safe isolation."
  },
  {
    "id": 4045,
    "question": "In a series circuit connected to a 230V supply containing two identical lamps, what would be the voltage drop across each lamp?",
    "options": [
      "115V",
      "230V",
      "460V",
      "0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total supply voltage is shared across the components. If the components are identical, the voltage is shared equally: 230V / 2 = 115V."
  },
  {
    "id": 4046,
    "question": "In a parallel circuit used for domestic lighting, what happens to the remaining lamps if one lamp fails (open circuit)?",
    "options": [
      "The other lamps remain lit with no change in brightness",
      "The other lamps all go out because the circuit is broken",
      "The other lamps get brighter due to increased current",
      "The other lamps get dimmer as the resistance increases"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A112-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, each branch is independent. If one branch opens, the voltage across the other branches remains the same, so the remaining lamps stay lit at the same brightness."
  },
  {
    "id": 4047,
    "question": "A ring final circuit line conductor has an end-to-end resistance (r1) of 0.6Ω. What is the expected resistance (R1) measured from the consumer unit to the midpoint of the ring?",
    "options": [
      "0.15Ω",
      "0.3Ω",
      "0.6Ω",
      "1.2Ω"
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
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A112-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The resistance to the midpoint of a ring is (r1 / 4) because the two paths to the midpoint are in parallel, each path being half the length (r1/2). (0.6 / 4) = 0.15Ω."
  },
  {
    "id": 4048,
    "question": "Why is it essential to maintain physical separation between power cables and data/communication cables in an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables affecting the data signals",
      "To prevent the data cables from drawing too much current from the power circuit",
      "To ensure the data cables do not overheat the power cables",
      "To keep the resistance of the data cables as low as possible"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A112-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables generate magnetic fields that can induce unwanted voltages (noise) in nearby data cables, leading to signal corruption or data loss."
  },
  {
    "id": 4049,
    "question": "Which of the following describes the function of a 'control circuit' in an industrial motor installation?",
    "options": [
      "A lower-current circuit used to safely operate the high-power switching device (contactor)",
      "A circuit that increases the voltage supplied to the motor during startup",
      "A circuit that connects multiple motors in series to share the load",
      "A circuit used only to measure the resistance of the motor windings"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A112-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Control circuits allow operators to switch heavy loads indirectly using low-power switches or automated sensors, improving safety and enabling complex logic."
  },
  {
    "id": 4050,
    "question": "A 230V radial circuit supplies a load with a resistance of 46Ω. Calculate the current flowing in the circuit.",
    "options": [
      "5A",
      "10,580A",
      "0.2A",
      "276A"
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
      "calculation",
      "ohms-law",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law: I = V / R. Therefore, I = 230V / 46Ω = 5A."
  },
  {
    "id": 4051,
    "question": "A ring final circuit is commonly used for socket outlets in UK domestic installations. What is the primary functional advantage of this topology over a radial circuit using the same size cable?",
    "options": [
      "It increases the current-carrying capacity by providing two paths for the current to flow",
      "It simplifies fault finding as there are no intermediate junctions in the circuit",
      "It ensures that all sockets remain safely powered even if there is a single break in the ring",
      "It significantly reduces the total length of cable required to cover a specific floor area"
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
      "topology-identification",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit starts and ends at the consumer unit, effectively doubling the paths for current. This allows the circuit to be protected by a 30A or 32A device even if the cable's individual current-carrying capacity is lower (typically 2.5mm²)."
  },
  {
    "id": 4052,
    "question": "Three indicator lamps on a control panel are connected in series. Their resistances are 120 Ω, 150 Ω, and 180 Ω respectively. What is the total resistance of this control circuit?",
    "options": [
      "450 Ω",
      "46.15 Ω",
      "150 Ω",
      "3,240,000 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A112-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total resistance (Rt) is the sum of all individual resistances: 120 + 150 + 180 = 450 Ω."
  },
  {
    "id": 4053,
    "question": "A parallel circuit supplies two heaters. Heater A draws a constant current of 10 A. Heater B has a resistance of 46 Ω. If the supply voltage is 230 V, what is the total current drawn from the supply?",
    "options": [
      "15 A",
      "5 A",
      "3.33 A",
      "10 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "USED_SERIES_RULE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A112-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, find current for Heater B: I = V/R = 230 / 46 = 5 A. In a parallel circuit, total current is the sum of branch currents: 10 A + 5 A = 15 A."
  },
  {
    "id": 4054,
    "question": "In an industrial installation, a 'control circuit' is often separated from the 'power circuit'. Which statement best describes the purpose of a control circuit?",
    "options": [
      "It uses low current signals to operate switching devices like contactors for high-power loads",
      "It provides a secondary backup power source in case the main supply fails",
      "It is used exclusively for data transmission and telecommunications between computers",
      "It is a circuit that only contains resistive loads to keep the power factor at unity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "discrimination",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A112-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are designed to safely and efficiently manage the operation of power circuits, often using smaller cables and lower currents to trigger contactors or relays."
  },
  {
    "id": 4055,
    "question": "An electrician is installing a radial circuit for a 2.3 kW heater. The heater operates at 230 V. The total resistance of the circuit conductors is 0.4 Ω. Calculate the voltage drop across the conductors when the heater is running.",
    "options": [
      "4 V",
      "0.4 V",
      "92 V",
      "10 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "application",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A112-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Step 1: Find the current (I = P/V) -> 2300W / 230V = 10 A. Step 2: Calculate voltage drop (V = I x R) -> 10 A x 0.4 Ω = 4 V."
  },
  {
    "id": 4056,
    "question": "A ring final circuit has an end-to-end resistance of the line conductor (r1) measured at 0.60 Ω and the protective conductor (r2) at 1.00 Ω. What is the expected (R1 + R2) value at each socket outlet if the circuit is correctly cross-connected?",
    "options": [
      "0.40 Ω",
      "1.60 Ω",
      "0.15 Ω",
      "0.25 Ω"
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
      "ring-final",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the (R1 + R2) value at each socket is calculated as (r1 + r2) / 4. Here, (0.60 + 1.00) / 4 = 1.60 / 4 = 0.40 Ω."
  },
  {
    "id": 4057,
    "question": "A control circuit uses a 24V DC relay to switch a 230V AC heating element. If the relay coil has a resistance of 480 Ω, what is the control circuit current when the relay is energized?",
    "options": [
      "0.05 A",
      "20 A",
      "11.5 A",
      "9.58 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "relays"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Using Ohm's Law (I = V / R) for the control side: 24V / 480 Ω = 0.05 A. The 230V AC is on the load side and does not affect the control circuit current calculation."
  },
  {
    "id": 4058,
    "question": "In a large commercial installation, why are data and communication cables typically required to be segregated from Band II (230V) power circuits?",
    "options": [
      "To prevent electromagnetic interference (EMI) and ensure safety in case of insulation failure",
      "To ensure the data cables do not overheat from the resistance of the power cables",
      "Because data cables require a higher voltage to operate than power circuits",
      "To prevent the data signal from increasing the frequency of the AC power supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3A112-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Segregation is vital to prevent EMI from corrupting data signals and to ensure that a fault in the 230V system cannot energize the Extra Low Voltage (ELV) data system."
  },
  {
    "id": 4059,
    "question": "A radial circuit serves three 2kW heaters connected in parallel. If the supply voltage drops to 210V due to a network fault, what will be the total current drawn by the circuit (assuming heater resistance remains constant)?",
    "options": [
      "27.39 A",
      "26.08 A",
      "8.69 A",
      "31.20 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "power"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Resistance of one heater (at 230V) = V²/P = 230²/2000 = 26.45 Ω. Total resistance for 3 in parallel = 26.45 / 3 = 8.816 Ω. New current at 210V = V/R = 210 / 8.816 = 27.39 A."
  },
  {
    "id": 4060,
    "question": "An electrician discovers a break in the ring continuity of the Line conductor on a 32A ring final circuit. What is the most significant risk of leaving this fault uncorrected?",
    "options": [
      "The cable may become overloaded as it now operates as two radials with potentially unbalanced loads",
      "The voltage at the furthest socket will double, damaging connected appliances",
      "The circuit will immediately cease to function and trip the RCD",
      "The frequency of the supply will fluctuate, causing motors to run at incorrect speeds"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "ring-final",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A112-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "A break in a ring final circuit turns it into two radial circuits. Since the overcurrent protective device is still 32A, but the cable is now effectively a radial, parts of the cable may carry more current than they are rated for (e.g., 2.5mm²), leading to overheating."
  },
  {
    "id": 4061,
    "question": "A 'Maintained' emergency lighting luminaire differs from a 'Non-maintained' luminaire primarily because:",
    "options": [
      "It operates at all times from the normal supply and switches to battery during a power failure",
      "It only illuminates when the main power supply fails",
      "It is connected in series with the standard lighting circuit to monitor voltage",
      "It does not require a permanent live feed for charging the internal battery"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "USED_SERIES_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A112-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Maintained luminaires are designed to be lit at all times (using the mains supply) and switch to battery power during a failure. Non-maintained luminaires only light up when the power fails."
  },
  {
    "id": 4062,
    "question": "A radial circuit has a total resistance of 1.2 Ω. It supplies a load of 15 A. What is the voltage drop at the end of the circuit?",
    "options": [
      "18 V",
      "12.5 V",
      "0.08 V",
      "16.2 V"
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
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Voltage drop (V) = Current (I) x Resistance (R). V = 15 A x 1.2 Ω = 18 V."
  },
  {
    "id": 4063,
    "question": "Which circuit type is most suitable for a large open-plan office where multiple desktop computers are expected to be plugged in and moved frequently?",
    "options": [
      "Ring final circuit",
      "A single 6A radial circuit",
      "A series lighting circuit",
      "A 400V three-phase control circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "ring-final",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A112-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Ring final circuits are ideal for socket outlets in areas with high density, diverse loads, and where flexibility is needed, as they provide a 32A capacity using smaller cables."
  },
  {
    "id": 4064,
    "question": "In a series-connected fire alarm bell circuit, if one bell develops an open-circuit fault, what happens to the rest of the bells on that specific circuit loop?",
    "options": [
      "All bells will stop ringing because the current path is broken",
      "The remaining bells will ring louder due to increased voltage",
      "The remaining bells will continue to ring normally",
      "Only the bells located after the fault will stop ringing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_PARALLEL_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "series",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a series circuit, there is only one path for current. If any component creates an open circuit, the current flow stops for the entire circuit."
  },
  {
    "id": 4065,
    "question": "Calculate the total power consumed by a 230V radial circuit that has two 500W floodlights and one 1.2kW heater connected in parallel.",
    "options": [
      "2200 W",
      "1000 W",
      "1700 W",
      "230 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "UNITS_MISSING",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "parallel"
    ],
    "learningOutcomeId": "203-3A112-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In a parallel circuit, total power is the sum of the individual power ratings: 500W + 500W + 1200W (1.2kW) = 2200W."
  }
];
