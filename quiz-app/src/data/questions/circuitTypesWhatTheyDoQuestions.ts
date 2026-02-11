import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A123 learning outcomes
 * Generated: 2026-02-11
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "In a simple series circuit containing three resistors, what is the rule for the total current flow?",
    "options": [
      "The current is the same at all points in the circuit",
      "The current is shared between the resistors",
      "The current increases as it passes through each resistor",
      "The current decreases as it returns to the source"
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
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the electrons to flow, meaning the current (measured in Amps) remains identical at any point in the loop."
  },
  {
    "id": 4017,
    "question": "An electrician installs two 15 ohm resistors in series. What is the total resistance of this circuit?",
    "options": [
      "30 ohms",
      "7.5 ohms",
      "225 ohms",
      "15 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To find the total resistance in a series circuit, you simply add the individual resistances together (Rt = R1 + R2)."
  },
  {
    "id": 4018,
    "question": "What is the primary purpose of a 'Ring Final Circuit' in a domestic installation?",
    "options": [
      "To supply power to multiple 13A socket outlets",
      "To provide a dedicated supply to an electric shower",
      "To connect smoke detectors in a series loop",
      "To distribute high-speed internet data around a building"
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
      "ring-final",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is a unique UK topology where the cable forms a loop to supply 13A socket outlets, allowing current to flow in two directions to the load."
  },
  {
    "id": 4019,
    "question": "In a parallel circuit connected to a 230V supply, what is the voltage across each individual branch?",
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
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across every branch is equal to the supply voltage."
  },
  {
    "id": 4020,
    "question": "Which type of circuit is typically used for a single high-power appliance, such as an 8kW electric cooker?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Data and comms circuit",
      "Control circuit"
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
      "power"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power appliances like cookers and showers are usually served by dedicated radial circuits to ensure the load is managed by a single protective device and cable."
  },
  {
    "id": 4021,
    "question": "Calculate the total resistance of two 10 ohm resistors connected in parallel.",
    "options": [
      "5 ohms",
      "20 ohms",
      "100 ohms",
      "2 ohms"
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (10 / 2 = 5 ohms), or using the product-over-sum rule: (10*10)/(10+10) = 5."
  },
  {
    "id": 4022,
    "question": "What happens to the total resistance of a parallel circuit as more branches (loads) are added?",
    "options": [
      "The total resistance decreases",
      "The total resistance increases",
      "The total resistance stays the same",
      "The total resistance doubles"
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
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Adding more branches to a parallel circuit provides more paths for current to flow, which reduces the overall resistance of the circuit."
  },
  {
    "id": 4023,
    "question": "A parallel circuit has two branches. Branch A draws 3A and Branch B draws 4A. What is the total current supplied to the circuit?",
    "options": [
      "7A",
      "1A",
      "12A",
      "1.71A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (It = I1 + I2)."
  },
  {
    "id": 4024,
    "question": "Three 12V batteries are connected in series to power a portable light. What is the total output voltage?",
    "options": [
      "36V",
      "12V",
      "4V",
      "24V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "When voltage sources like batteries are connected in series, their voltages add together (12V + 12V + 12V = 36V)."
  },
  {
    "id": 4025,
    "question": "Which of the following circuit types is primarily used to transmit signals for internet and telephone services?",
    "options": [
      "Data and communications",
      "Power and heating",
      "Control circuits",
      "Emergency lighting"
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
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A123-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Data and communications circuits are designed for low-voltage signal transmission rather than delivering significant electrical power."
  },
  {
    "id": 4026,
    "question": "Which type of circuit starts and finishes at the same point in the consumer unit, effectively forming a continuous loop of cable?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Control circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is a unique UK wiring topology where the circuit conductors form a loop, starting and ending at the same protective device in the consumer unit."
  },
  {
    "id": 4027,
    "question": "Two resistors with values of 15 ohms and 25 ohms are connected in series. What is the total resistance of the circuit?",
    "options": [
      "40 ohms",
      "9.38 ohms",
      "375 ohms",
      "10 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total resistance is the sum of the individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4028,
    "question": "In a series circuit containing three lamps, how does the current behave as it passes through each lamp?",
    "options": [
      "It remains the same at all points",
      "It divides equally between the lamps",
      "It decreases after each lamp",
      "It increases as it returns to the source"
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
      "conceptual",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the current to flow, meaning the current is identical at any point in the circuit."
  },
  {
    "id": 4029,
    "question": "Four identical heaters are connected in parallel to a 230V supply. What is the voltage across each individual heater?",
    "options": [
      "230V",
      "57.5V",
      "920V",
      "0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4030,
    "question": "A radial circuit supplies a 2.3kW electric heater at a supply voltage of 230V. Calculate the current flow in the circuit.",
    "options": [
      "10A",
      "529A",
      "0.1A",
      "227.7A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "ohms-law",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3A123-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using the power formula I = P / V. 2300W / 230V = 10A."
  },
  {
    "id": 4031,
    "question": "A series circuit consists of three resistors with values of 15 Ω, 25 Ω, and 40 Ω. What is the total resistance of the circuit?",
    "options": [
      "80 Ω",
      "6.45 Ω",
      "40 Ω",
      "15,000 Ω"
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
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total resistance is the sum of all individual resistances: 15 + 25 + 40 = 80 Ω."
  },
  {
    "id": 4032,
    "question": "Which of the following is a primary characteristic of a ring final circuit compared to a radial circuit?",
    "options": [
      "The circuit returns to the same origin point in the consumer unit",
      "The circuit uses less copper because the cable is thinner throughout",
      "Each socket is connected in series to increase the total resistance",
      "It is only used for high-power industrial motors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "APPLICATION_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "conceptual",
      "topology-identification"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit starts at the consumer unit, loops through all the points (sockets), and returns to the same protective device in the consumer unit."
  },
  {
    "id": 4033,
    "question": "An electrician is installing a 230 V radial lighting circuit. If the maximum permitted voltage drop is 3%, what is the lowest acceptable voltage measured at the furthest point of the circuit?",
    "options": [
      "223.1 V",
      "227.0 V",
      "6.9 V",
      "236.9 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "UNITS_MISSING",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "voltage-rule",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "3% of 230 V is 6.9 V. 230 V - 6.9 V = 223.1 V."
  },
  {
    "id": 4034,
    "question": "Two 20 Ω heaters are connected in parallel to a 230 V supply. What is the total resistance of the circuit?",
    "options": [
      "10 Ω",
      "40 Ω",
      "400 Ω",
      "20 Ω"
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
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For identical resistors in parallel, the total resistance is the value of one resistor divided by the number of resistors (20 / 2 = 10 Ω)."
  },
  {
    "id": 4035,
    "question": "Why are control circuits for industrial machinery often designed to operate at Extra Low Voltage (ELV), such as 24 V DC?",
    "options": [
      "To reduce the risk of electric shock for operators and maintenance staff",
      "To ensure the machinery runs at a much higher speed",
      "Because ELV cables do not require any mechanical protection",
      "To eliminate the need for overcurrent protection"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "HEALTH_SAFETY_MISCONCEPTION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3A123-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "ELV is used in control circuits primarily for safety, as it significantly reduces the risk of a fatal electric shock in the event of a fault or accidental contact."
  },
  {
    "id": 4036,
    "question": "A balanced ring final circuit has a total load current of 26 A flowing through it. What is the current flowing in each of the two 'legs' of the ring at the consumer unit?",
    "options": [
      "13 A",
      "26 A",
      "52 A",
      "8.6 A"
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
      "ring-final",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a perfectly balanced ring final circuit, the load current divides equally between the two paths (legs) back to the consumer unit (26 / 2 = 13 A)."
  },
  {
    "id": 4037,
    "question": "A circuit contains two 12 Ω resistors in parallel, which are then connected in series with a 4 Ω resistor. What is the total resistance?",
    "options": [
      "10 Ω",
      "28 Ω",
      "8 Ω",
      "16 Ω"
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
      "mixed-circuit",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First, calculate the parallel section: (12 * 12) / (12 + 12) = 6 Ω. Then add the series resistor: 6 + 4 = 10 Ω."
  },
  {
    "id": 4038,
    "question": "When installing data and communication cables alongside power cables, why is 'segregation of services' required?",
    "options": [
      "To prevent electromagnetic interference (EMI) affecting data signals",
      "To ensure the data cables don't overheat the power cables",
      "To increase the speed of the data transmission",
      "To allow the data cables to use the power cable's earthing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "APPLICATION_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A123-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Segregation is necessary to prevent electromagnetic interference from power cables distorting the low-voltage signals in data and communication cables."
  },
  {
    "id": 4039,
    "question": "A 230 V series circuit contains a 30 Ω resistor and a 70 Ω resistor. What is the voltage drop across the 70 Ω resistor?",
    "options": [
      "161 V",
      "69 V",
      "115 V",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "TOPOLOGY_CONFUSION",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total R = 100 Ω. Current I = 230 / 100 = 2.3 A. Voltage across 70 Ω = 2.3 A * 70 Ω = 161 V."
  },
  {
    "id": 4040,
    "question": "An electrician is installing a dedicated circuit for a 7.2 kW electric cooker. Which circuit arrangement is most appropriate?",
    "options": [
      "A radial circuit using a single high-current cable",
      "A ring final circuit shared with the kitchen sockets",
      "A series circuit connecting the cooker and the water heater",
      "An ELV control circuit connected to a relay"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "APPLICATION_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "radial",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "High-power appliances like cookers require a dedicated radial circuit to handle the high current demand safely and independently of other loads."
  },
  {
    "id": 4041,
    "question": "Why is a ring final circuit commonly used for socket outlets in UK domestic installations instead of a single radial circuit of the same cable size?",
    "options": [
      "It allows for a higher current carrying capacity using smaller cables",
      "It makes it easier to identify the location of a cable fault",
      "It reduces the total resistance by half compared to a radial",
      "It eliminates the need for a circuit protective conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "DIVIDED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "radial",
      "topology-identification"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit allows the current to split and flow in two directions, effectively doubling the current carrying capacity of the cable used (typically 2.5mm squared) to support a 32A protective device."
  },
  {
    "id": 4042,
    "question": "A lighting circuit has three lamps connected in series for a specific testing configuration. If each lamp has a resistance of 1,200 ohms, what is the total resistance of the circuit?",
    "options": [
      "3,600 ohms",
      "400 ohms",
      "1,200 ohms",
      "2,400 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3). Therefore, 1200 + 1200 + 1200 = 3600 ohms."
  },
  {
    "id": 4043,
    "question": "In a standard parallel-connected domestic lighting circuit supplied at 230V, what is the voltage across the fourth lamp in the circuit?",
    "options": [
      "230V",
      "57.5V",
      "0V",
      "920V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the voltage remains the same across every branch. Therefore, every lamp receives the full supply voltage of 230V."
  },
  {
    "id": 4044,
    "question": "An electrician is installing a dedicated radial circuit for a high-power electric shower rated at 10kW. Why is a dedicated radial circuit used instead of connecting it to an existing ring final?",
    "options": [
      "The load exceeds the capacity of a standard 32A ring final circuit",
      "The shower requires a DC supply which cannot be provided by a ring",
      "Radial circuits are safer for use near water than ring circuits",
      "Radial circuits prevent the shower from causing voltage spikes in sockets"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "radial",
      "application",
      "power"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A 10kW shower draws approximately 43.5A (10,000 / 230). This exceeds the 32A limit of a standard ring final circuit, requiring a dedicated radial circuit with appropriately sized cable and protection."
  },
  {
    "id": 4045,
    "question": "What is the primary function of a control circuit used within an industrial motor starter system?",
    "options": [
      "To allow low-current components to switch a high-current load",
      "To step down the voltage for the motor's main windings",
      "To provide an alternative path for current in case of a fault",
      "To convert the AC supply into a pulse-width modulated DC signal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "control",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A123-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Control circuits use smaller currents and voltages (e.g., 24V or 110V) to safely operate contactors or relays that switch the high-power supply to the motor."
  },
  {
    "id": 4046,
    "question": "A 32A ring final circuit has a total load of 24A applied at the point furthest from the consumer unit. Assuming the cable resistance is balanced, what is the current flowing in each leg of the ring?",
    "options": [
      "12A",
      "24A",
      "6A",
      "48A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a balanced ring circuit, the load splits equally between the two paths (legs) back to the consumer unit. 24A / 2 = 12A per leg."
  },
  {
    "id": 4047,
    "question": "Why must data and communications cables be kept separate from power cables in a trunking installation?",
    "options": [
      "To prevent electromagnetic induction from causing data errors",
      "To stop the power cables from drawing current from data lines",
      "To ensure that the data cables do not overheat the power cables",
      "To prevent the voltage in data cables from dropping too low"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "data-comms",
      "application",
      "explanation"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Alternating current in power cables creates a magnetic field that can induce unwanted voltages (noise/interference) in nearby data cables, leading to signal corruption."
  },
  {
    "id": 4048,
    "question": "Two identical 230V, 46 ohm heating elements are mistakenly connected in series across a 230V supply. What is the total current flowing through the circuit?",
    "options": [
      "2.5A",
      "5A",
      "10A",
      "20A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total resistance Rt = 46 + 46 = 92 ohms. Using Ohm's Law (I = V/R): 230V / 92 ohms = 2.5A."
  },
  {
    "id": 4049,
    "question": "Which type of emergency lighting circuit is designed to only illuminate when the local mains supply to the normal lighting fails?",
    "options": [
      "Non-maintained",
      "Maintained",
      "Sustained",
      "Radial emergency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "emergency",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lights remain off while the mains power is healthy and only switch on using their internal battery when the mains power fails."
  },
  {
    "id": 4050,
    "question": "A control panel uses four identical 200-ohm relay coils connected in parallel. What is the total resistance of this parallel bank?",
    "options": [
      "50 ohms",
      "800 ohms",
      "200 ohms",
      "100 ohms"
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
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For identical resistors in parallel, Rt = R / n. Here, 200 ohms / 4 = 50 ohms."
  },
  {
    "id": 4051,
    "question": "In a standard 32A ring final circuit, how is the current distributed when a single 10A load is connected exactly at the midpoint of the ring?",
    "options": [
      "5A flows through each of the two paths from the consumer unit",
      "10A flows through the shorter leg of the ring only",
      "20A flows because the current is doubled in a loop",
      "10A flows in a continuous circle around the entire loop"
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
      "current-rule",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a ring final circuit, the current splits between the two paths. If the load is at the midpoint, the resistance of each path is equal, so the current splits equally (5A each)."
  },
  {
    "id": 4052,
    "question": "A 230V radial power circuit supplies two heaters connected in parallel. Heater A has a resistance of 46 Ω and Heater B has a resistance of 23 Ω. What is the total current drawn by the circuit?",
    "options": [
      "15 A",
      "3.33 A",
      "69 A",
      "5 A"
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
      "ohms-law",
      "parallel",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Current in Heater A = 230/46 = 5A. Current in Heater B = 230/23 = 10A. Total current = 5 + 10 = 15A."
  },
  {
    "id": 4053,
    "question": "An electrician is wiring a system where a low-voltage 24V thermostat operates a relay to switch a 230V immersion heater. The 24V portion of this system is classified as which type of circuit?",
    "options": [
      "Control",
      "Power",
      "Data",
      "Signal"
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
      "terminology",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Circuits used to manage the operation of other equipment, such as thermostats switching relays, are classified as control circuits."
  },
  {
    "id": 4054,
    "question": "A radial lighting circuit has a total line-neutral loop resistance of 1.2 Ω. If the total current drawn by the lamps is 4 A, calculate the voltage drop at the furthest point of the circuit.",
    "options": [
      "4.8 V",
      "3.33 V",
      "0.3 V",
      "5.2 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "voltage-rule",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Voltage drop (V) = Current (I) x Resistance (R). Therefore, 4 A x 1.2 Ω = 4.8 V."
  },
  {
    "id": 4055,
    "question": "Which of the following is a specific characteristic of a ring final circuit compared to a radial circuit of the same cable size?",
    "options": [
      "It provides two paths for current, effectively increasing the current carrying capacity",
      "It ensures that the circuit remains safe even if one conductor becomes disconnected",
      "It reduces the total circuit resistance to zero at the midpoint of the ring",
      "It allows for the use of a smaller CPC than the live conductors"
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
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The primary design advantage of a ring final circuit is that current can reach any point via two paths, allowing the use of a smaller cable than would be required for a radial circuit of the same total current rating."
  },
  {
    "id": 4056,
    "question": "A domestic ring final circuit is being tested. The end-to-end resistance of the line conductor (r1) is 0.6 Ω and the neutral conductor (rn) is 0.6 Ω. What is the expected theoretical resistance (R1+RN) measured at the furthest socket?",
    "options": [
      "0.30 Ω",
      "1.20 Ω",
      "0.60 Ω",
      "0.15 Ω"
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
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1+RN) is calculated as (r1 + rn) / 4. Here, (0.6 + 0.6) / 4 = 1.2 / 4 = 0.3 Ω."
  },
  {
    "id": 4057,
    "question": "Which of the following describes the primary electrical advantage of using a ring final circuit topology rather than a radial circuit for a high-density socket outlet area?",
    "options": [
      "The current is shared between two paths, allowing a higher load for a smaller cable cross-sectional area",
      "The voltage drop is automatically eliminated because the circuit returns to the source",
      "It prevents the need for an Earth Fault Loop Impedance (Zs) test at every socket",
      "The circuit can continue to operate safely even if one conductor becomes open-circuit"
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
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The ring final circuit allows a 32A protective device to be used with 2.5mm cables because the load current splits into two directions, effectively doubling the current-carrying capacity relative to a single radial leg."
  },
  {
    "id": 4058,
    "question": "A radial circuit supplies three industrial heaters connected in parallel. Heater 1 is 3kW, Heater 2 is 2kW, and Heater 3 is 1.5kW. If the supply voltage is 230V, what is the total design current (Ib) for the circuit?",
    "options": [
      "28.26 A",
      "13.04 A",
      "6500 A",
      "0.035 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "UNITS_MISSING",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "parallel",
      "power"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Total Power (P) = 3000 + 2000 + 1500 = 6500W. Current (I) = P / V = 6500 / 230 = 28.26A."
  },
  {
    "id": 4059,
    "question": "In a commercial building, a 'Maintained' emergency lighting system is installed. How does this differ from a 'Non-Maintained' system during normal operation?",
    "options": [
      "The lamps are illuminated at all times from the mains supply and switch to battery during failure",
      "The lamps only illuminate when the local lighting circuit loses power",
      "The system uses DC current during normal operation and AC during emergencies",
      "The system does not require a charging circuit as it is always on"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Maintained emergency lighting luminaires are designed to be lit at all times, whereas non-maintained luminaires only light up when the normal power supply fails."
  },
  {
    "id": 4060,
    "question": "Two identical 230V, 500W heating elements are mistakenly connected in series across a 230V supply. What is the total power output of this combination?",
    "options": [
      "250 W",
      "1000 W",
      "500 W",
      "125 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "series",
      "power"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Resistance of one element = V²/P = 230²/500 = 105.8 Ω. Total resistance in series = 211.6 Ω. Total power = V²/R_total = 230²/211.6 = 250W. (Alternatively, voltage across each is halved, so power for each is 1/4, total is 1/2)."
  },
  {
    "id": 4061,
    "question": "A control circuit for an industrial motor uses a 24V AC transformer to supply the start/stop buttons and contactor coil. What is the primary reason for using this 'separated' circuit rather than 230V mains?",
    "options": [
      "To increase safety for the operator by using Extra Low Voltage (ELV) at the control interface",
      "To ensure the motor runs at a constant speed regardless of load changes",
      "To eliminate the need for an overload relay in the motor starter",
      "To allow the control cables to be run without any insulation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A123-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Using ELV (Extra Low Voltage) for control circuits reduces the risk of fatal electric shock at the push-buttons or control switches, which are frequently handled by operators."
  },
  {
    "id": 4062,
    "question": "A 50-meter radial circuit is wired in 2.5mm² cable with a voltage drop factor of 18 mV/A/m. If the circuit carries a fixed load of 16A, what is the total voltage drop at the load?",
    "options": [
      "14.4 V",
      "1.44 V",
      "28.8 V",
      "0.90 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "voltage-rule",
      "units"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Voltage Drop = (mV/A/m * Ib * L) / 1000. So, (18 * 16 * 50) / 1000 = 14400 / 1000 = 14.4 V."
  },
  {
    "id": 4063,
    "question": "An electrician is installing Cat6 data cabling in the same trunking as 230V power cables. According to best practice and BS 7671, what must be done to prevent data corruption?",
    "options": [
      "Provide physical separation or use screened cables to prevent electromagnetic interference",
      "Connect the data cable's outer sheath to the power circuit's neutral conductor",
      "Ensure the data cables are twisted around the power cables to cancel noise",
      "Use only DC power circuits in the proximity of data cabling"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203-3A123-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Separation of services is required to prevent electromagnetic interference (EMI) from power cables affecting the low-voltage signals in data cables."
  },
  {
    "id": 4064,
    "question": "A lighting circuit has 12 LED luminaires. Each luminaire is rated at 20W with a power factor of 0.85. Calculate the total design current (Ib) at a supply voltage of 230V.",
    "options": [
      "1.23 A",
      "1.04 A",
      "0.88 A",
      "2.40 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "current-rule",
      "power"
    ],
    "learningOutcomeId": "203-3A123-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total Power = 12 * 20 = 240W. For AC circuits with power factor: I = P / (V * PF). I = 240 / (230 * 0.85) = 240 / 195.5 = 1.227A."
  },
  {
    "id": 4065,
    "question": "During the inspection of a ring final circuit, it is discovered that the ring has been 'broken' (open circuit) on the line conductor only. What is the most likely immediate effect on the circuit's operation?",
    "options": [
      "The sockets will still work, but the cable may become overloaded as it now acts as two radials",
      "The entire circuit will lose power immediately because the loop is broken",
      "The protective device (MCB) will trip instantly due to a short circuit",
      "The voltage at the sockets will double because the resistance has decreased"
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
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A123-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a broken ring, the sockets continue to have power because they are fed from either side of the break, but the circuit now functions as two radials. This is dangerous as the 32A MCB may allow more current than a single 2.5mm leg can safely carry."
  }
];
