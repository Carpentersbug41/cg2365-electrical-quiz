import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A6 learning outcomes
 * Generated: 2026-02-06
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which of the following best describes the physical layout of a radial circuit?",
    "options": [
      "The circuit originates at the distribution board and terminates at the last point of utilization",
      "The circuit originates at the distribution board and loops back to the same protective device",
      "The circuit is connected in a continuous loop between two different distribution boards",
      "The circuit uses a single conductor to feed multiple buildings in a series chain"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "radial"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit runs from the consumer unit/distribution board to the various outlets or points, ending at the final point without returning to the start."
  },
  {
    "id": 4017,
    "question": "A series circuit contains two resistors with values of 15 Ω and 25 Ω. What is the total resistance of the circuit?",
    "options": [
      "40 Ω",
      "9.38 Ω",
      "375 Ω",
      "10 Ω"
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
      "calculation",
      "series",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4018,
    "question": "What is the primary characteristic of a ring final circuit used in UK domestic installations?",
    "options": [
      "The circuit conductors start and finish at the same protective device",
      "The circuit is wired in series to ensure all sockets receive the same current",
      "The circuit is used exclusively for high-power industrial motors",
      "The circuit provides a direct path for data and communication signals only"
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
      "conceptual",
      "terminology",
      "ring-final"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit forms a loop where both ends of the phase, neutral, and CPC return to the same terminals in the distribution board."
  },
  {
    "id": 4019,
    "question": "In a parallel circuit with two branches, the first branch draws 4 A and the second branch draws 6 A. What is the total current supplied by the source?",
    "options": [
      "10 A",
      "4 A",
      "2 A",
      "24 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "SIGN_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "According to Kirchhoff's Current Law, the total current entering a junction in a parallel circuit is equal to the sum of the currents in the individual branches."
  },
  {
    "id": 4020,
    "question": "An electrician is installing a standard lighting circuit for a domestic bedroom. Which circuit topology is most commonly used for this application?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Data communication circuit"
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
      "radial",
      "units"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Domestic lighting circuits are almost exclusively wired as radial circuits, where the cable runs from the consumer unit to each light point in turn."
  },
  {
    "id": 4021,
    "question": "A series circuit is supplied with 230 V. If one component has a voltage drop of 50 V, what is the voltage across the remaining part of the circuit?",
    "options": [
      "180 V",
      "230 V",
      "280 V",
      "115 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "series",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the sum of the voltage drops must equal the supply voltage (Vt = V1 + V2). Therefore, 230V - 50V = 180V."
  },
  {
    "id": 4022,
    "question": "Which type of circuit is specifically designed to provide illumination in the event of a mains power failure?",
    "options": [
      "Emergency lighting circuit",
      "Control circuit",
      "Power circuit",
      "Data/comms circuit"
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
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Emergency lighting circuits are safety systems that activate when the normal power supply fails to ensure safe egress from a building."
  },
  {
    "id": 4023,
    "question": "A 230 V radial power circuit supplies a heater drawing a current of 13 A. What is the power consumed by the heater?",
    "options": [
      "2990 W",
      "17.7 W",
      "243 W",
      "2990 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power is calculated using the formula P = V x I. So, 230V x 13A = 2990 Watts."
  },
  {
    "id": 4024,
    "question": "When testing a ring final circuit, an electrician finds that the circuit is open (broken) at one point. What is the most likely effect on the connected sockets?",
    "options": [
      "The sockets will still work but the circuit now behaves like two radial circuits",
      "All sockets on the circuit will immediately stop working",
      "The voltage at all sockets will double to 460 V",
      "The circuit protective device will trip immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "ring-final",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If a ring is broken at one point, it effectively becomes two radial circuits fed from the same breaker. While sockets may still work, the cable may become overloaded."
  },
  {
    "id": 4025,
    "question": "Two identical 40 Ω resistors are connected in parallel. What is the total resistance of the combination?",
    "options": [
      "20 Ω",
      "80 Ω",
      "1600 Ω",
      "0.05 Ω"
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
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R/n)."
  },
  {
    "id": 4026,
    "question": "What is the defining characteristic of a ring final circuit used in UK domestic installations?",
    "options": [
      "The circuit conductors start and finish at the same terminals in the distribution board",
      "The circuit uses a single cable that ends at the furthest point of the installation",
      "The circuit is only permitted to supply lighting points and smoke alarms",
      "The circuit must always be wired using 1.0mm² twin and earth cable"
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
      "ring-final",
      "radial",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is a specific UK topology where the line, neutral, and earth conductors form a continuous loop, starting and ending at the same protective device."
  },
  {
    "id": 4027,
    "question": "An electrician is installing two 15 Ω resistors in series. What is the total resistance of this part of the circuit?",
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
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total resistance is the sum of the individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4028,
    "question": "Which type of circuit is most suitable for a high-load appliance such as a 9.5 kW electric shower?",
    "options": [
      "A dedicated radial circuit",
      "A 32A ring final circuit",
      "A 6A lighting sub-circuit",
      "A data communication circuit"
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
      "radial",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power fixed appliances like showers require their own dedicated radial circuit to handle the high current demand safely without overloading other circuits."
  },
  {
    "id": 4029,
    "question": "Calculate the total resistance of two 20 Ω heating elements when they are connected in parallel.",
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
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R/n)."
  },
  {
    "id": 4030,
    "question": "In a series circuit consisting of three lamps, how does the current behave at different points in the circuit?",
    "options": [
      "The current is the same at all points in the circuit",
      "The current is split equally between the three lamps",
      "The current decreases as it passes through each lamp",
      "The current is highest at the positive terminal and zero at the negative"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the electrons to flow, meaning the current (Amps) remains constant throughout the entire loop."
  },
  {
    "id": 4031,
    "question": "Which type of circuit is specifically designed to provide a path for signals that manage the operation of other equipment, such as a motor starter or a heating programmer?",
    "options": [
      "Control circuit",
      "Power circuit",
      "Data circuit",
      "Lighting circuit"
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
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are used to manage the operation of other equipment (like motors or heating systems) by carrying signals rather than the main power load."
  },
  {
    "id": 4032,
    "question": "A balanced 32A ring final circuit has a single load of 26A connected exactly at the midpoint. What is the current flowing through each leg of the ring from the consumer unit?",
    "options": [
      "13A",
      "26A",
      "52A",
      "6.5A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "current-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a balanced ring circuit, the current from a load divides equally between the two paths. 26A / 2 = 13A."
  },
  {
    "id": 4033,
    "question": "An electrician is installing emergency lighting in a commercial building. Which type of emergency luminaire only illuminates when the local mains power supply fails?",
    "options": [
      "Non-maintained",
      "Maintained",
      "Sustained",
      "Combined"
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
      "explanation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lights are only energised when the normal power supply fails. Maintained lights are on all the time."
  },
  {
    "id": 4034,
    "question": "Calculate the total resistance (R1 + Rn) of a radial circuit where the line conductor (R1) resistance is 0.45 ohms and the neutral conductor (Rn) resistance is 0.45 ohms.",
    "options": [
      "0.90 ohms",
      "0.225 ohms",
      "0.45 ohms",
      "1.80 ohms"
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
      "calculation",
      "resistance-rule",
      "series"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a radial circuit, the total resistance of the conductors is the sum of the individual resistances (R1 + Rn). 0.45 + 0.45 = 0.90 ohms."
  },
  {
    "id": 4035,
    "question": "Why is a ring final circuit typically used for socket outlets in UK domestic installations instead of a single 2.5mm² radial circuit?",
    "options": [
      "It allows for a higher current carrying capacity using smaller cables",
      "It reduces the total voltage drop to zero",
      "It is easier and faster to install than a radial circuit",
      "It eliminates the need for a circuit protective device"
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
      "application",
      "explanation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A ring circuit provides two paths for current, effectively doubling the current capacity of the cable used, allowing a 32A CPD on 2.5mm² cable."
  },
  {
    "id": 4036,
    "question": "A domestic immersion heater is rated at 3kW (3000W). Calculate the current drawn by this heater when connected to a 230V supply.",
    "options": [
      "13.04A",
      "7.66A",
      "0.07A",
      "690A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Using P = I x V, rearranged to I = P / V. 3000W / 230V = 13.04A."
  },
  {
    "id": 4037,
    "question": "When installing data and communication cables alongside power circuits, what is the primary reason for maintaining physical separation or using shielding?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables",
      "To prevent the data cables from overheating",
      "To ensure the data cables do not increase the voltage drop of the power circuit",
      "To allow for easier identification during maintenance"
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
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables create electromagnetic fields that can induce noise and errors in data signals; separation or shielding prevents this interference."
  },
  {
    "id": 4038,
    "question": "The end-to-end resistance of the line conductor loop (r1) in a ring final circuit is measured as 0.64 ohms. What is the expected resistance (R1) at the furthest point of the ring?",
    "options": [
      "0.16 ohms",
      "0.32 ohms",
      "0.64 ohms",
      "1.28 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For a ring circuit, the resistance at the furthest point (R1) is one-quarter of the end-to-end resistance (r1/4). 0.64 / 4 = 0.16 ohms."
  },
  {
    "id": 4039,
    "question": "A lighting circuit has 8 LED luminaires, each with a circuit wattage of 12W. Calculate the total current for the circuit at 230V, assuming a power factor of 1.",
    "options": [
      "0.42A",
      "1.91A",
      "96A",
      "22.08A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 8 x 12W = 96W. I = P / V = 96W / 230V = 0.417A (rounded to 0.42A)."
  },
  {
    "id": 4040,
    "question": "Which of the following describes a 'radial' circuit topology?",
    "options": [
      "Cables start at the consumer unit and terminate at the last point of use",
      "Cables start at the consumer unit and return to the same terminal",
      "Cables form a continuous loop between different consumer units",
      "Cables are connected in a mesh pattern throughout the building"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A radial circuit runs from the source (consumer unit) to the points of use and ends at the final point, unlike a ring which returns to the source."
  },
  {
    "id": 4041,
    "question": "An electrician is testing a newly installed 2.5mm² ring final circuit. The end-to-end resistance of the line conductor (r1) is measured at 0.60 Ω. What is the expected resistance (R1) at the furthest socket, assuming the circuit is correctly formed?",
    "options": [
      "0.15 Ω",
      "0.30 Ω",
      "0.60 Ω",
      "1.20 Ω"
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
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1) is 1/4 of the end-to-end resistance (r1), because the current has two paths in parallel, each being half the total length (0.6 / 4 = 0.15 Ω)."
  },
  {
    "id": 4042,
    "question": "Why is a ring final circuit often preferred over a radial circuit for power socket outlets in a large domestic ground floor area?",
    "options": [
      "It allows for a higher current carrying capacity using smaller cross-sectional area cables",
      "It ensures that if one socket is removed, the remaining sockets still have power",
      "It eliminates the risk of electromagnetic interference with data cables",
      "It reduces the total number of circuit breakers required in the consumer unit"
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
      "conceptual",
      "explanation",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit provides two paths for the current, effectively doubling the capacity of the cable used, allowing 2.5mm² cable to be protected by a 30A or 32A device."
  },
  {
    "id": 4043,
    "question": "A parallel lighting circuit contains four 70W lamps connected to a 230V supply. Calculate the total current drawn by the circuit when all lamps are switched on.",
    "options": [
      "1.22 A",
      "0.30 A",
      "3.28 A",
      "280 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Total power = 4 * 70W = 280W. Using I = P / V: 280W / 230V = 1.217A, rounded to 1.22A."
  },
  {
    "id": 4044,
    "question": "In a commercial installation, an 'emergency non-maintained' lighting circuit is installed. How does this circuit operate compared to a 'maintained' circuit?",
    "options": [
      "Non-maintained lamps only illuminate when the local mains supply fails",
      "Non-maintained lamps operate at a lower voltage than maintained lamps",
      "Non-maintained lamps are wired in series to ensure they all fail at once",
      "Non-maintained lamps do not require a battery backup system"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lighting only energizes when the normal power supply is lost. Maintained lighting stays on during normal operation and during power failure."
  },
  {
    "id": 4045,
    "question": "A 15-meter radial circuit for a heater uses cable with a resistance of 12 mΩ/m. If the heater draws 10 A, what is the total voltage drop across the line conductor only?",
    "options": [
      "1.80 V",
      "0.18 V",
      "180 V",
      "1.20 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "WRONG_UNITS",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total resistance = 15m * 0.012 Ω/m = 0.18 Ω. Voltage drop = I * R = 10A * 0.18 Ω = 1.8V."
  },
  {
    "id": 4046,
    "question": "Control circuits often use Extra-Low Voltage (ELV) via a transformer or relay. What is the primary reason for using a relay in a motor control circuit?",
    "options": [
      "To allow a low-current control switch to operate a high-current power circuit",
      "To convert the AC supply of the motor into DC for the control panel",
      "To increase the frequency of the supply to speed up the motor",
      "To provide a path for the fault current to return to the transformer"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "relays",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Relays allow small, safe currents (control) to switch much larger, potentially dangerous currents (power) by using an electromagnet to close contacts."
  },
  {
    "id": 4047,
    "question": "Two identical 46 Ω heating elements are connected in parallel within an industrial oven. What is the total resistance of this heating circuit?",
    "options": [
      "23 Ω",
      "92 Ω",
      "46 Ω",
      "2116 Ω"
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
      "parallel"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (46 / 2 = 23 Ω)."
  },
  {
    "id": 4048,
    "question": "When installing data and communication cabling alongside power circuits, why is 'segregation of services' required by BS 7671?",
    "options": [
      "To prevent electromagnetic interference (EMI) affecting signal quality",
      "To prevent the data cables from drawing too much current from the mains",
      "To ensure that data cables do not overheat the power cables",
      "To allow the data cables to operate at a higher frequency than the power"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "explanation",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Segregation (spacing or shielding) is necessary to prevent the magnetic fields around power cables from inducing noise/interference into sensitive data cables."
  },
  {
    "id": 4049,
    "question": "If the continuity of a ring final circuit is broken at one point (e.g., a loose connection in a socket), what is the most likely consequence?",
    "options": [
      "The circuit remains live but effectively becomes two radial circuits",
      "The circuit breaker will trip immediately due to a high resistance fault",
      "All sockets on the circuit will immediately lose power",
      "The voltage at the sockets will double because the path is restricted"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A break in a ring results in two radial circuits fed from the same breaker. While power remains, the cable may become overloaded as the current is no longer shared across two paths."
  },
  {
    "id": 4050,
    "question": "A radial circuit serves a 230V, 4.6 kW electric shower. Calculate the design current (Ib) for this circuit.",
    "options": [
      "20 A",
      "10.58 A",
      "1,058,000 A",
      "0.05 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using I = P / V: 4600W / 230V = 20A."
  },
  {
    "id": 4051,
    "question": "A ring final circuit is being installed in a domestic living room. What is the primary technical reason for connecting the socket outlets in a ring topology rather than a radial topology using the same cable size?",
    "options": [
      "To allow for a higher current carrying capacity by providing two paths for the current",
      "To ensure that if one conductor is damaged, the sockets will still have a backup path",
      "To eliminate the possibility of voltage drop occurring at the furthest socket",
      "To make it easier for the electrician to add additional sockets in the future"
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
      "ring-final",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit allows the current to split and flow through two paths to the load, effectively increasing the current carrying capacity beyond that of a single cable of the same size."
  },
  {
    "id": 4052,
    "question": "An electrician is testing a 2.5mm² ring final circuit. The end-to-end resistance (r1) of the phase conductor loop is measured as 0.80 Ω. What is the expected resistance (R1) from the consumer unit to the furthest point of the ring?",
    "options": [
      "0.20 Ω",
      "0.40 Ω",
      "1.60 Ω",
      "0.80 Ω"
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
      "ring-final",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring circuit, the resistance to the furthest point (R1) is one-quarter of the end-to-end loop resistance (r1/4). Therefore, 0.80 / 4 = 0.20 Ω."
  },
  {
    "id": 4053,
    "question": "An industrial heating control panel contains three identical 45 Ω heating elements connected in parallel. What is the total resistance of this heating circuit?",
    "options": [
      "15 Ω",
      "135 Ω",
      "45 Ω",
      "0.06 Ω"
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
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For identical resistors in parallel, total resistance (Rt) is the value of one resistor divided by the number of resistors (Rt = R / n). 45 / 3 = 15 Ω."
  },
  {
    "id": 4054,
    "question": "Which of the following best describes the function and typical operation of a control circuit within a motor starter assembly?",
    "options": [
      "It uses a low current to operate the coil of a contactor which switches the high-power circuit",
      "It provides the main path for the motor's starting current to ensure high torque",
      "It is always wired in a ring final configuration to prevent motor failure",
      "It converts AC power to DC power to allow for variable speed control"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are designed to manage the operation of power circuits, typically by using small currents to energize electromagnetic coils in relays or contactors."
  },
  {
    "id": 4055,
    "question": "A 230V radial circuit supplies a 4.6kW electric heater. If the total resistance of the circuit conductors is 0.25 Ω, calculate the voltage drop across the cables when the heater is in operation.",
    "options": [
      "5.00 V",
      "1.15 V",
      "57.50 V",
      "0.25 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "First find current (I = P / V): 4600W / 230V = 20A. Then find voltage drop (V = I * R): 20A * 0.25 Ω = 5V."
  },
  {
    "id": 4056,
    "question": "A ring final circuit is wired using 2.5mm² copper cable with an end-to-end resistance (r1) of 0.60 Ω. If a 13A load is connected to a socket located exactly at the midpoint of the ring, what is the effective resistance of the supply path to that load?",
    "options": [
      "0.15 Ω",
      "0.30 Ω",
      "0.60 Ω",
      "1.20 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the midpoint creates two parallel paths. Each path has half the end-to-end resistance (0.30 Ω). Using the parallel rule for two identical resistances: Rt = R/n = 0.30 / 2 = 0.15 Ω."
  },
  {
    "id": 4057,
    "question": "An electrician is installing a central heating control system. To ensure the boiler only operates when the programmer is 'ON' AND the room thermostat is 'CALLING', how must these two components be electrically configured relative to the boiler control terminal?",
    "options": [
      "In series with each other",
      "In parallel with each other",
      "In a ring topology",
      "Using a 1-way, 2-gang switching arrangement"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "series",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Control circuits requiring 'AND' logic (where both conditions must be met) require components to be wired in series so that the circuit is only complete when both switches are closed."
  },
  {
    "id": 4058,
    "question": "A 230V radial circuit supplies three 500W floodlights connected in parallel. If the cable resistance is negligible, what is the total current drawn when all lights are operational?",
    "options": [
      "6.52 A",
      "2.17 A",
      "0.46 A",
      "15.33 A"
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
      "calculation",
      "parallel",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power (P) = 500W * 3 = 1500W. Using I = P / V: I = 1500 / 230 = 6.52 A."
  },
  {
    "id": 4059,
    "question": "During testing of a 32A ring final circuit, the end-to-end resistance of the line conductor (r1) is 0.4 Ω. If the ring is intact, what is the maximum expected R1+Rn reading at any socket, assuming the neutral conductor (rn) is also 0.4 Ω?",
    "options": [
      "0.2 Ω",
      "0.4 Ω",
      "0.8 Ω",
      "0.1 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "discrimination",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The formula for the highest R1+Rn on a ring is (r1 + rn) / 4. Here, (0.4 + 0.4) / 4 = 0.2 Ω. This occurs at the midpoint."
  },
  {
    "id": 4060,
    "question": "A 230V radial circuit supplies a 3kW heater located 25m from the consumer unit. The cable has a total resistance (line and neutral combined) of 0.02 Ω per metre. Calculate the voltage drop at the heater.",
    "options": [
      "6.52 V",
      "3.26 V",
      "13.04 V",
      "0.50 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "First, find current: I = P/V = 3000/230 = 13.04A. Next, find total resistance: R = 25m * 0.02 Ω/m = 0.5 Ω. Finally, Vd = I * R = 13.04 * 0.5 = 6.52 V."
  },
  {
    "id": 4061,
    "question": "Which specific circuit type is designed to remain operational during a power failure to provide illumination for the safe evacuation of a building, and how is it typically powered?",
    "options": [
      "Maintained emergency lighting powered by a battery backup",
      "Non-maintained lighting powered by the primary ring final circuit",
      "Data/comms circuits powered by an Uninterruptible Power Supply (UPS)",
      "Control circuits using SELV (Safety Extra Low Voltage)"
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
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Maintained emergency lighting is designed to operate at all times (normal and emergency), switching to internal or central battery power if the mains supply fails."
  },
  {
    "id": 4062,
    "question": "A mixed circuit consists of two 20 Ω resistors in parallel, which are then connected in series with a 10 Ω resistor. If the total circuit is connected to a 100V DC supply, what is the voltage drop across the 10 Ω resistor?",
    "options": [
      "50 V",
      "33.3 V",
      "100 V",
      "25 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "USED_PARALLEL_RULE",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "mixed-circuit",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Parallel part: (20*20)/(20+20) = 10 Ω. Total resistance = 10 (parallel) + 10 (series) = 20 Ω. Total current = 100V / 20 Ω = 5A. Voltage drop across the 10 Ω resistor = 5A * 10 Ω = 50 V."
  },
  {
    "id": 4063,
    "question": "In a commercial installation, why are data and telecommunications cables required to be separated from LV (Low Voltage) power cables by a minimum distance or a grounded partition?",
    "options": [
      "To prevent electromagnetic interference (EMI) via mutual induction",
      "To prevent the heat from power cables melting the data insulation",
      "To ensure the data cables do not exceed their maximum current rating",
      "To allow for easier identification during periodic inspection"
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
      "electromagnetic-induction",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "AC power cables create magnetic fields that can induce unwanted currents (noise) in data cables via mutual induction, potentially corrupting data signals."
  },
  {
    "id": 4064,
    "question": "A workshop has four 2kW heaters connected to a 230V radial circuit. If one heater develops a fault and becomes an open circuit, what happens to the total current in the circuit?",
    "options": [
      "It decreases by 25%",
      "It stays the same",
      "It increases by 25%",
      "It drops to zero"
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
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In a parallel (radial) circuit, total current is the sum of individual branch currents. If one of four identical loads is removed (open circuit), the total current decreases by exactly 1/4 (25%)."
  },
  {
    "id": 4065,
    "question": "What is a primary technical advantage of using a ring final circuit topology in a domestic property compared to a standard 20A radial circuit?",
    "options": [
      "It allows for a higher current carrying capacity using smaller conductors",
      "It eliminates the possibility of a broken neutral fault",
      "It reduces the total length of cable required for the installation",
      "It ensures that voltage drop is zero at the furthest point"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "A ring final circuit allows a 32A overcurrent device to be used with 2.5mm² cable because the current splits into two paths, whereas a radial would require much larger cable for a 32A load."
  }
];
