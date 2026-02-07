import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A1 learning outcomes
 * Generated: 2026-02-07
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "An electrician is installing two 50 Ω heating elements in series. What is the total resistance of this circuit configuration?",
    "options": [
      "100 Ω",
      "25 Ω",
      "50 Ω",
      "2500 Ω"
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
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total resistance is the sum of the individual resistances (Rt = R1 + R2). Therefore, 50 + 50 = 100 Ω."
  },
  {
    "id": 4017,
    "question": "Which of the following statements correctly describes the behavior of current in a series lighting circuit?",
    "options": [
      "The current is the same at all points in the circuit",
      "The current splits proportionally between the lamps",
      "The current increases as it passes through each lamp",
      "The current is highest at the end of the circuit"
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
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the electrons to flow, meaning the current remains identical at every point in the loop."
  },
  {
    "id": 4018,
    "question": "A parallel circuit contains two identical 10 Ω resistors. What is the total resistance of the circuit?",
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
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n), so 10 / 2 = 5 Ω."
  },
  {
    "id": 4019,
    "question": "Which type of circuit is typically used to supply a single high-power appliance, such as a 3kW immersion heater?",
    "options": [
      "A radial circuit",
      "A ring final circuit",
      "A series circuit",
      "A data circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit is used for dedicated high-power loads or specific groups of points where the cable runs from the consumer unit directly to the load."
  },
  {
    "id": 4020,
    "question": "What is the defining characteristic of a domestic ring final circuit?",
    "options": [
      "The circuit cable starts and ends at the same terminals in the distribution board",
      "The circuit only supplies one single socket outlet",
      "The voltage is shared equally between all outlets on the loop",
      "It is used specifically for emergency lighting and fire alarms"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit forms a continuous loop where both ends of the circuit cable are connected to the same protective device in the distribution board."
  },
  {
    "id": 4021,
    "question": "Two lamps are connected in parallel to a 230V mains supply. What is the voltage across each lamp?",
    "options": [
      "230V",
      "115V",
      "460V",
      "0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is the same as the supply voltage."
  },
  {
    "id": 4022,
    "question": "Which circuit type is specifically designed to provide power to smoke detectors and security sensors in a commercial building?",
    "options": [
      "Alarm and emergency circuit",
      "Ring final circuit",
      "Power and heating circuit",
      "Data and communications circuit"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Alarm and emergency circuits are dedicated systems for safety-critical components like fire alarms and security sensors."
  },
  {
    "id": 4023,
    "question": "A parallel circuit has two branches. Branch A draws 5A and Branch B draws 3A. What is the total current supplied by the source?",
    "options": [
      "8A",
      "2A",
      "15A",
      "4A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (It = I1 + I2), so 5 + 3 = 8A."
  },
  {
    "id": 4024,
    "question": "What happens to the total resistance of a circuit as more loads are added in parallel?",
    "options": [
      "The total resistance decreases",
      "The total resistance increases",
      "The total resistance stays the same",
      "The total resistance becomes the average of all loads"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Adding more paths for current to flow (parallel branches) reduces the overall opposition to current, thus decreasing the total resistance."
  },
  {
    "id": 4025,
    "question": "A 230V circuit supplies a current of 10A to an electric heater. What is the power consumed by the heater?",
    "options": [
      "2300W",
      "23W",
      "240W",
      "0.04W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "power",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Power is calculated using the formula P = V x I. Therefore, 230V x 10A = 2300W."
  },
  {
    "id": 4026,
    "question": "Which of the following describes the basic topology of a UK ring final circuit?",
    "options": [
      "The circuit conductors start and end at the same point in the distribution board",
      "The circuit conductors terminate at the last point of use only",
      "All loads are connected in series with each other",
      "The circuit is only used for high-power industrial machinery"
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
      "topology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because it forms a loop, starting and ending at the same protective device in the distribution board."
  },
  {
    "id": 4027,
    "question": "A series lighting circuit contains three lamps with resistances of 150Ω, 200Ω, and 250Ω. What is the total resistance of the circuit?",
    "options": [
      "600Ω",
      "61.5Ω",
      "250Ω",
      "7,500,000Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total resistance is the sum of the individual resistances (150 + 200 + 250 = 600)."
  },
  {
    "id": 4028,
    "question": "An electrician is installing a 230V radial circuit for two identical heaters connected in parallel. If each heater draws 5A, what is the total current supplied by the circuit?",
    "options": [
      "10A",
      "5A",
      "2.5A",
      "1150A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (5A + 5A = 10A)."
  },
  {
    "id": 4029,
    "question": "Which circuit type is most appropriate for supplying power to a single dedicated appliance, such as an electric shower or a cooker?",
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
      "discrimination",
      "topology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Radial circuits are typically used for dedicated high-power appliances where the circuit terminates at a single point of use."
  },
  {
    "id": 4030,
    "question": "What is the main disadvantage of connecting multiple lamps in a simple series circuit?",
    "options": [
      "If one lamp fails, all other lamps in the circuit will turn off",
      "The total resistance of the circuit decreases as more lamps are added",
      "The current increases every time a lamp is added",
      "Each lamp receives the full supply voltage regardless of how many are connected"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for current. If any component fails (open circuit), the current flow stops for the entire circuit."
  },
  {
    "id": 4031,
    "question": "An installation has two heating elements connected in parallel, each with a resistance of 40 Ω. What is the total resistance of this part of the circuit?",
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a parallel circuit with two identical resistors, the total resistance is half the value of one resistor (Rt = R / n). 40 / 2 = 20 Ω."
  },
  {
    "id": 4032,
    "question": "What is the primary technical advantage of using a ring final circuit for socket outlets in a domestic installation?",
    "options": [
      "It allows for a smaller cable cross-sectional area by providing two paths for the current",
      "It uses significantly less cable than a radial circuit for the same number of points",
      "It makes the process of fault-finding much simpler for the electrician",
      "It ensures that the voltage at every socket is exactly 230V regardless of load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONCEPTUAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit splits the load current between two paths, allowing a 2.5mm² cable to be protected by a 32A device, which wouldn't be possible on a standard radial circuit."
  },
  {
    "id": 4033,
    "question": "A radial power circuit supplies three 2kW space heaters. Calculate the total current drawn by the circuit when connected to a 230V supply.",
    "options": [
      "26.09 A",
      "8.70 A",
      "6000 A",
      "0.03 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CALCULATION_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 3 x 2000W = 6000W. Current (I) = P / V = 6000 / 230 = 26.09 A."
  },
  {
    "id": 4034,
    "question": "An electrician is tasked with installing a new 10.5kW electric shower. Which circuit arrangement is required for this type of high-power load?",
    "options": [
      "A dedicated radial circuit",
      "An extension from the nearest ring final circuit",
      "A series connection with the water heater",
      "A control circuit using 1.0mm² cable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power fixed appliances like showers require their own dedicated radial circuit to prevent overloading and ensure safe isolation."
  },
  {
    "id": 4035,
    "question": "Which of the following circuit types is primarily used to transmit signals for the operation of contactors, relays, and starters?",
    "options": [
      "Control circuit",
      "Data and communications circuit",
      "Ring final circuit",
      "Power circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONCEPTUAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits are specifically designed to manage the operation of other equipment, whereas data circuits carry information and power circuits carry the main load current."
  },
  {
    "id": 4036,
    "question": "A lighting circuit consists of ten 12W LED lamps connected in parallel to a 230V supply. What is the total current flowing in the circuit?",
    "options": [
      "0.52 A",
      "0.05 A",
      "120 A",
      "1.91 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CALCULATION_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "current-rule",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Total Power = 10 x 12W = 120W. Current = P / V = 120 / 230 = 0.52 A."
  },
  {
    "id": 4037,
    "question": "When installing a fire alarm system, which requirement distinguishes it from a standard domestic lighting circuit?",
    "options": [
      "The use of fire-resistant cables such as FP200",
      "The circuit must be wired as a ring final",
      "The circuit must be protected by a 32A MCB",
      "The system must operate on 400V three-phase power"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "health-safety",
      "legislation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Fire alarm circuits require specialized fire-resistant cabling to ensure the system remains operational during a fire event."
  },
  {
    "id": 4038,
    "question": "During testing of a ring final circuit, the end-to-end resistance of the line conductor (r1) is measured as 0.8 Ω. What is the expected resistance (R1) at the midpoint of the ring?",
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
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For a ring final circuit, the resistance at the midpoint (R1) is calculated as (r1 / 4). Therefore, 0.8 / 4 = 0.2 Ω."
  },
  {
    "id": 4039,
    "question": "Why is it important to separate data and communications cabling from power circuits in an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) from affecting signal quality",
      "Because data cables carry higher voltage than power cables",
      "To ensure the data circuit can be wired in a ring topology",
      "Because data cables are too thick to fit in the same trunking as power cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONCEPTUAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "explanation",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables generate magnetic fields that can induce noise and interference in data cables, so physical separation or shielding is required."
  },
  {
    "id": 4040,
    "question": "A 24V DC control circuit is used to switch a relay with a coil resistance of 150 Ω. Calculate the current required to energise the relay.",
    "options": [
      "0.16 A",
      "6.25 A",
      "3600 A",
      "24 A"
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
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Using Ohm's Law: I = V / R. Therefore, I = 24 / 150 = 0.16 A."
  },
  {
    "id": 4041,
    "question": "What is the primary advantage of a ring final circuit over a radial circuit when used for general-purpose socket outlets in a domestic installation?",
    "options": [
      "It allows for a smaller cable cross-sectional area by providing two paths for the current to flow",
      "It ensures that the current remains identical at every point throughout the circuit loop",
      "It eliminates the risk of voltage drop because the circuit returns to the source",
      "It makes fault-finding easier as there is only one path for the electricity to follow"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit splits the load current between two paths back to the consumer unit, allowing a 2.5mm² cable to be protected by a 30A or 32A CPD, which would otherwise require a much larger cable in a radial format."
  },
  {
    "id": 4042,
    "question": "A lighting circuit consists of four identical LED lamps connected in parallel. If each lamp has a resistance of 1,600 Ω, what is the total resistance of the circuit?",
    "options": [
      "400 Ω",
      "6,400 Ω",
      "0.0025 Ω",
      "1,600 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "TOPOLOGY_CONFUSION"
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
    "explanation": "In a parallel circuit with identical resistors, the total resistance is the value of one resistor divided by the number of resistors (1600 / 4 = 400 Ω)."
  },
  {
    "id": 4043,
    "question": "An electrician is installing a fire alarm system. Which type of circuit is specifically required to ensure the control panel can trigger sounders throughout a building even if a single open-circuit fault occurs on the wiring loop?",
    "options": [
      "An addressable ring circuit",
      "A standard radial circuit",
      "A series control circuit",
      "A data bus radial circuit"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Addressable fire alarm systems often use a ring topology so that if the cable is cut (open circuit), the panel can still communicate with all devices by sending signals from both ends of the loop."
  },
  {
    "id": 4044,
    "question": "A 24V DC control circuit contains a relay coil with a resistance of 120 Ω and a limit switch with a contact resistance of 0.5 Ω connected in series. What is the total current flowing when the switch is closed?",
    "options": [
      "0.199 A",
      "2,892 A",
      "48.0 A",
      "0.200 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "USED_PARALLEL_RULE",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Total resistance in series is 120 + 0.5 = 120.5 Ω. Using Ohm's Law (I = V / R), 24 / 120.5 = 0.19917... A."
  },
  {
    "id": 4045,
    "question": "In a radial power circuit supplying multiple electric heaters, what happens to the total circuit current as more heaters are switched on?",
    "options": [
      "The total current increases because the total circuit resistance decreases",
      "The total current decreases because the total circuit resistance increases",
      "The total current remains the same as it is a single-path radial circuit",
      "The total current increases because the supply voltage increases to meet demand"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Heaters in a radial circuit are connected in parallel. Adding more loads in parallel reduces the total resistance, which causes the total current drawn from the supply to increase."
  },
  {
    "id": 4046,
    "question": "A 230V ring final circuit in a commercial kitchen serves a 2.3kW dishwasher and a 3kW oven. If both are running at full power, what is the total current drawn from the consumer unit?",
    "options": [
      "23.04 A",
      "5.30 A",
      "13.04 A",
      "1,219 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_I_V_R",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "power",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 2300W + 3000W = 5300W. Total Current = P / V = 5300 / 230 = 23.04 A."
  },
  {
    "id": 4047,
    "question": "Why is it critical to maintain physical separation between data/communication cables and 230V power cables within a trunking system?",
    "options": [
      "To prevent electromagnetic induction from causing data corruption or noise",
      "To prevent the data cables from overheating the power cables",
      "To ensure the data circuit maintains a higher resistance than the power circuit",
      "To prevent DC current from the data cables leaking into the AC power supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables create magnetic fields that can induce unwanted voltages (noise) in nearby data cables, leading to data loss or errors."
  },
  {
    "id": 4048,
    "question": "A ring final circuit is being tested for continuity. If the end-to-end resistance of the phase conductor (r1) is 0.8 Ω, and the neutral conductor (rn) is also 0.8 Ω, what is the expected (R1+Rn) reading at a socket located at the furthest point of the ring?",
    "options": [
      "0.4 Ω",
      "1.6 Ω",
      "0.8 Ω",
      "0.2 Ω"
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
      "calculation",
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "For a ring final circuit, the (R1+Rn) value at the furthest point is calculated as (r1 + rn) / 4. Here, (0.8 + 0.8) / 4 = 1.6 / 4 = 0.4 Ω."
  },
  {
    "id": 4049,
    "question": "Which of the following circuit types is primarily used to carry instructions to switch equipment on or off, rather than delivering the main energy to the load?",
    "options": [
      "Control circuit",
      "Radial power circuit",
      "Ring final circuit",
      "Emergency lighting circuit"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits are designed to manage the operation of other circuits, such as using a low-voltage switch to operate a high-power contactor."
  },
  {
    "id": 4050,
    "question": "Two identical indicator lamps are connected in series across a 230V supply. If one lamp develops a fault that increases its resistance to exactly three times that of the other lamp, what will be the voltage across the faulty lamp?",
    "options": [
      "172.5 V",
      "115.0 V",
      "230.0 V",
      "57.5 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In series, voltage divides in proportion to resistance. If the ratio is 3:1, the faulty lamp takes 3/4 of the total voltage. 230 * 0.75 = 172.5 V."
  },
  {
    "id": 4051,
    "question": "A 32A ring final circuit is installed in a commercial office. If the load is perfectly balanced across both legs of the ring, what is the maximum current flowing through the conductors in a single leg when the circuit is running at its full rated capacity of 32A?",
    "options": [
      "16A",
      "32A",
      "64A",
      "8A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "In a ring final circuit, the current splits into two parallel paths. If the load is balanced and the total current is 32A, each leg carries half the total current (32A / 2 = 16A)."
  },
  {
    "id": 4052,
    "question": "Control circuits for industrial machinery are frequently operated at 24V DC or 110V AC via a step-down transformer. What is the primary reason for using these lower voltages rather than the 230V mains supply?",
    "options": [
      "To increase safety for operators and maintenance personnel",
      "To allow the control motors to run at a higher frequency",
      "To significantly reduce the cross-sectional area of the control cables",
      "Because DC voltage can be transmitted over much longer distances than AC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "health-safety",
      "transformers",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Lower voltages (ELV or Reduced Low Voltage) are used in control circuits to minimize the risk of electric shock to operators and during maintenance tasks."
  },
  {
    "id": 4053,
    "question": "An electrician is tasked with installing a circuit for a heavy-duty fixed workshop heater rated at 7kW. According to standard installation practice, which circuit topology and protection should be used?",
    "options": [
      "A dedicated radial circuit with a 32A circuit breaker",
      "A 32A ring final circuit shared with general-purpose socket outlets",
      "A 13A radial circuit protected by a fused connection unit",
      "A 6A lighting radial circuit using 1.5mm² cable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "power",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A 7kW load at 230V draws approximately 30.4A. A dedicated radial circuit with a 32A breaker is required. High-power fixed loads should not be placed on a shared ring final circuit."
  },
  {
    "id": 4054,
    "question": "An indicator panel uses three identical lamps connected in series to a 36V DC supply. If each lamp has a resistance of 60 ohms, what is the total current flowing through the circuit?",
    "options": [
      "0.2A",
      "0.6A",
      "1.8A",
      "5.0A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_PARALLEL_RULE",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a series circuit, total resistance is the sum of individual resistances (60 + 60 + 60 = 180 ohms). Using Ohm's Law (I = V / R), the current is 36V / 180 ohms = 0.2A."
  },
  {
    "id": 4055,
    "question": "When installing data and communication cables in the same containment as power circuits, BS 7671 requires specific segregation or screening. What is the main technical reason for this requirement?",
    "options": [
      "To prevent electromagnetic interference (EMI) from affecting data signals",
      "To prevent the data cables from causing the power cables to overheat",
      "To ensure the data signals maintain a constant 50Hz frequency",
      "To allow the data cables to utilize the power circuit's CPC as a functional earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables generate electromagnetic fields that can induce noise and interference (EMI) in data cables, leading to data loss or corruption. Segregation or screening prevents this."
  },
  {
    "id": 4056,
    "question": "A ring final circuit is installed using 2.5mm² cable. If the total end-to-end resistance of the phase conductor (r1) is measured at 0.6 Ω, what would be the expected resistance (R1) measured between the consumer unit and the midpoint of the ring?",
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance to the midpoint (R1) is 1/4 of the total end-to-end resistance (r1). This is because the two paths to the midpoint are each half the length (0.3 Ω) and are in parallel (0.3 / 2 = 0.15 Ω)."
  },
  {
    "id": 4057,
    "question": "In a commercial kitchen, a 32A ring final circuit is replaced with two 20A radial circuits for the heavy-duty countertop appliances. What is the primary technical advantage of this change regarding circuit behavior?",
    "options": [
      "It prevents a single point of failure from overloading one 'leg' of the conductor",
      "It reduces the total amount of cable required for the installation",
      "It allows for a higher total floor area to be covered by the circuits",
      "It eliminates the need for CPC (Circuit Protective Conductor) continuity testing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "radial"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Ring final circuits can be susceptible to 'unbalanced' loads where one leg of the ring carries significantly more current than the other if high-power loads are concentrated near one end. Radials eliminate this specific balancing risk."
  },
  {
    "id": 4058,
    "question": "A specialized heating circuit contains two 60 Ω elements connected in parallel. This parallel group is then connected in series with a 10 Ω control resistor. If the supply voltage is 230V, what is the total current flowing through the control resistor?",
    "options": [
      "5.75 A",
      "1.77 A",
      "7.67 A",
      "1.92 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "mixed-circuit",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First, find the parallel resistance: (60 * 60) / (60 + 60) = 30 Ω. Add the series resistor: 30 + 10 = 40 Ω total resistance. Total current I = V / R = 230 / 40 = 5.75 A."
  },
  {
    "id": 4059,
    "question": "An electrician is wiring a lighting circuit for a long corridor that requires control from four separate locations. Which combination of switches is required to achieve this functionality?",
    "options": [
      "Two 2-way switches and two intermediate switches",
      "Four 2-way switches",
      "One 2-way switch and three intermediate switches",
      "Two 1-way switches and two intermediate switches"
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
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "For multi-point switching, the 'ends' of the switching run must be 2-way switches, and any number of locations in between must be intermediate switches."
  },
  {
    "id": 4060,
    "question": "A 'non-maintained' emergency lighting circuit is installed in a retail unit. How does this circuit behave during normal operation when the mains power is healthy?",
    "options": [
      "The emergency lamps remain off while the internal batteries charge",
      "The emergency lamps remain on at a dimmed level to save energy",
      "The emergency lamps operate at full brightness alongside standard lighting",
      "The emergency lamps flash intermittently to indicate they are functional"
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
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Non-maintained emergency lights only illuminate when the local mains supply fails. During normal operation, they are off but their batteries are being charged by the mains."
  },
  {
    "id": 4061,
    "question": "A 9.2 kW electric shower is connected to a 230V supply via a radial circuit. If the total circuit resistance (R1 + Rn) is 0.15 Ω, calculate the voltage drop at the shower terminals when in use.",
    "options": [
      "6.0 V",
      "1.38 V",
      "40.0 V",
      "0.15 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Current I = P / V = 9200 / 230 = 40 A. Voltage Drop V = I * R = 40 * 0.15 = 6.0 V."
  },
  {
    "id": 4062,
    "question": "A control circuit uses a 24V PELV (Protective Extra-Low Voltage) system to operate a contactor for a 400V motor. What is the defining characteristic of a PELV circuit compared to an SELV circuit?",
    "options": [
      "The PELV circuit has a connection to Earth",
      "The PELV circuit is never used in damp environments",
      "The PELV circuit uses a standard transformer instead of a safety isolator",
      "The PELV circuit is only used for data transmission"
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
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Both SELV and PELV are extra-low voltage, but PELV (Protective Extra-Low Voltage) circuits are connected to Earth, whereas SELV (Separated Extra-Low Voltage) circuits are strictly electrically separated from Earth."
  },
  {
    "id": 4063,
    "question": "A parallel circuit contains three identical 1.5 kW heaters. If the supply is 230V and one heater develops an open-circuit fault, what happens to the total current drawn from the supply?",
    "options": [
      "It decreases by approximately 6.52 A",
      "It increases because the remaining two heaters work harder",
      "It stays the same as the voltage is constant",
      "It decreases by exactly 19.56 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CALCULATION_ERROR",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Each heater draws I = P / V = 1500 / 230 = 6.52 A. In a parallel circuit, removing one branch reduces the total current by the amount that branch was drawing."
  },
  {
    "id": 4064,
    "question": "When installing data and telecommunications cabling alongside 230V power circuits in the same containment, what is the primary reason for using a grounded metallic divider?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals",
      "To ensure the data cables are kept at a lower temperature",
      "To provide a path for the data cable's fault current",
      "To meet the requirements for circuit discrimination"
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
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Segregation of services is required to prevent electrical noise (EMI) from power cables interfering with sensitive data signals, and for safety to prevent insulation breakdown between systems."
  },
  {
    "id": 4065,
    "question": "A radial circuit supplies a 3 kW immersion heater. If the heater is left on for 4 hours a day, and the cost of energy is 34p per kWh, what is the total cost of operation for a 30-day month?",
    "options": [
      "£122.40",
      "£40.80",
      "£306.00",
      "£12.24"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "energy",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Energy = Power * Time. 3 kW * 4 hours * 30 days = 360 kWh. Cost = 360 * 0.34 = £122.40."
  }
];
