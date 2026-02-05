import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A2 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the standard circuit arrangement used for domestic lighting installations in the UK?",
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
      "lighting",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Domestic lighting is standardly wired as a radial circuit, where the cable runs from the consumer unit to the first point, then the second, and terminates at the last point."
  },
  {
    "id": 4017,
    "question": "A simple series circuit contains two heating elements with resistances of 20 Ω and 30 Ω. What is the total resistance of the circuit?",
    "options": [
      "50 Ω",
      "12 Ω",
      "600 Ω",
      "10 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Resistance",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2). Therefore, 20 + 30 = 50 Ω."
  },
  {
    "id": 4018,
    "question": "In a ring final circuit, where are the two ends of the circuit cable connected?",
    "options": [
      "Both to the same protective device in the consumer unit",
      "One to a circuit breaker and one to the neutral bar",
      "To two separate circuit breakers for redundancy",
      "To a junction box located in the middle of the circuit"
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
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A ring final circuit starts and ends at the same protective device (circuit breaker or fuse) in the consumer unit, forming a continuous loop."
  },
  {
    "id": 4019,
    "question": "An alarm circuit has four sensors connected in series. If the current flowing through the first sensor is 0.2 A, what is the current flowing through the fourth sensor?",
    "options": [
      "0.2 A",
      "0.8 A",
      "0.05 A",
      "0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Current",
    "tags": [
      "series",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the current remains the same at all points in the circuit."
  },
  {
    "id": 4020,
    "question": "Which type of cable is specifically designed for use in data and communication circuits, such as computer networking?",
    "options": [
      "Twisted pair (e.g., Cat 6)",
      "Steel Wire Armoured (SWA)",
      "Twin and Earth (T&E)",
      "Single core PVC"
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
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Twisted pair cables like Cat 5e or Cat 6 are the standard for data and communication circuits to reduce electromagnetic interference."
  },
  {
    "id": 4021,
    "question": "A parallel socket circuit is supplied with 230 V. If one appliance is plugged in, the voltage is 230 V. What is the voltage across a second appliance plugged into the same circuit?",
    "options": [
      "230 V",
      "115 V",
      "460 V",
      "0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Voltage",
    "tags": [
      "parallel",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4022,
    "question": "What is the primary function of a control circuit in an industrial installation?",
    "options": [
      "To safely switch or regulate a high-power load",
      "To provide the main power for heating elements",
      "To act as the primary earthing path for the building",
      "To increase the resistance of the main supply"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits allow operators to manage high-power equipment using lower voltages or currents for safety and automation."
  },
  {
    "id": 4023,
    "question": "Two identical 100 Ω resistors are connected in parallel. What is the total resistance of this combination?",
    "options": [
      "50 Ω",
      "200 Ω",
      "100 Ω",
      "10,000 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Resistance",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n)."
  },
  {
    "id": 4024,
    "question": "An electrician is installing a new socket circuit in a large room. Why might they choose a ring final circuit over a radial circuit?",
    "options": [
      "To cover a larger floor area using smaller diameter cables",
      "To ensure that if one socket fails, the others stop working",
      "To reduce the total number of socket outlets allowed",
      "Because ring circuits do not require a circuit breaker"
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
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Ring final circuits allow for a larger floor area (up to 100m²) to be served by a 32A breaker using 2.5mm² cable, as the current has two paths to flow."
  },
  {
    "id": 4025,
    "question": "A 230 V radial circuit supplies a heater that draws 10 A of current. What is the power consumed by the heater?",
    "options": [
      "2300 W",
      "23 W",
      "240 W",
      "0.043 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Power",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Power is calculated using the formula P = V x I. Therefore, 230 V x 10 A = 2300 W."
  },
  {
    "id": 4026,
    "question": "In a standard UK domestic installation, which circuit type starts at the consumer unit, loops through several socket outlets, and returns to the same consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Parallel spur",
      "Series lighting circuit"
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
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because both ends of the circuit loop are connected back to the same protective device in the consumer unit."
  },
  {
    "id": 4027,
    "question": "Two resistors, one of 10 Ω and one of 20 Ω, are connected in series. What is the total resistance of the circuit?",
    "options": [
      "30 Ω",
      "6.67 Ω",
      "200 Ω",
      "10 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances: Rt = R1 + R2."
  },
  {
    "id": 4028,
    "question": "An electrician is installing a system to allow a thermostat to switch a boiler on and off. What category of circuit is this?",
    "options": [
      "Control circuit",
      "Power and heating circuit",
      "Data and communications circuit",
      "Radial socket circuit"
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
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits are used to manage the operation of other equipment, such as heating systems, motor starters, or relays."
  },
  {
    "id": 4029,
    "question": "Two identical 10 Ω heaters are connected in parallel to a supply. What is the total resistance of this parallel combination?",
    "options": [
      "5 Ω",
      "20 Ω",
      "100 Ω",
      "0.5 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For identical resistors in parallel, the total resistance is the value of one resistor divided by the number of resistors (Rt = R / n)."
  },
  {
    "id": 4030,
    "question": "In a series circuit containing three lamps, the current measured at the first lamp is 2 A. What is the current flowing through the third lamp?",
    "options": [
      "2 A",
      "0.66 A",
      "6 A",
      "0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the current remains constant at every point in the circuit; it does not get 'used up' or divided."
  },
  {
    "id": 4031,
    "question": "A series lighting circuit used for decorative purposes contains three lamps, each with a resistance of 460 Ω. Calculate the total resistance of the circuit.",
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
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3). Therefore, 460 + 460 + 460 = 1380 Ω."
  },
  {
    "id": 4032,
    "question": "Which of the following describes a primary advantage of using a Ring Final Circuit for power socket outlets in a domestic installation?",
    "options": [
      "It provides two paths for current, allowing for a reduction in cable CSA",
      "It ensures the current is the same at every socket outlet",
      "It eliminates the need for an earth continuity conductor",
      "It is only used for high-power heating appliances"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "APPLICATION_ERROR"
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
    "estimatedTime": 75,
    "explanation": "A ring final circuit starts and ends at the consumer unit, providing two paths for the current to reach any point on the ring. This allows for the use of smaller cables (typically 2.5mm²) than would be required for a radial circuit of the same rating."
  },
  {
    "id": 4033,
    "question": "A 230V radial circuit supplies two heaters connected in parallel. Heater A is rated at 2 kW and Heater B is rated at 1 kW. Calculate the total current drawn from the supply.",
    "options": [
      "13.04 A",
      "4.35 A",
      "3.00 A",
      "39.13 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "UNITS_MISSING",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 2000W + 1000W = 3000W. Using I = P / V: 3000 / 230 = 13.04 A."
  },
  {
    "id": 4034,
    "question": "An electrician is installing a system where a room thermostat switches a motorized valve to control central heating. What functional circuit type is this switch-wire part of?",
    "options": [
      "Control circuit",
      "Power circuit",
      "Data circuit",
      "Ring final circuit"
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
      "terminology",
      "application",
      "explanation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Circuits that manage the operation of other equipment (like thermostats or relays) are classified as control circuits, distinct from the primary power circuits that supply the load."
  },
  {
    "id": 4035,
    "question": "A 230V radial power circuit has a total circuit resistance of 0.8 Ω. If a load is connected that draws a current of 16 A, calculate the voltage drop across the cable.",
    "options": [
      "12.8 V",
      "20.0 V",
      "0.05 V",
      "15.2 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Voltage drop (V) = Current (I) x Resistance (R). 16 A x 0.8 Ω = 12.8 V."
  },
  {
    "id": 4036,
    "question": "In the context of emergency lighting circuits, what is the defining characteristic of a 'non-maintained' fitting?",
    "options": [
      "It only illuminates when the normal mains supply fails",
      "It is permanently illuminated from the mains supply",
      "It does not require an internal battery",
      "It can only be used in commercial data centers"
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
      "terminology",
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A non-maintained emergency fitting is designed to be off during normal conditions and only switch on using its battery backup when the local mains supply to the lighting circuit fails."
  },
  {
    "id": 4037,
    "question": "A ring final circuit has a measured end-to-end resistance (r1) of 0.6 Ω. If the circuit is correctly formed, what is the theoretical resistance (R1) measured between the line and neutral at the furthest point of the ring?",
    "options": [
      "0.15 Ω",
      "0.30 Ω",
      "1.20 Ω",
      "0.60 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "For a ring final circuit, the resistance at the furthest point (R1) is calculated as (r1 + r1) / 4 if measuring loop, or simply r1 / 4 for the parallel path calculation. 0.6 / 4 = 0.15 Ω."
  },
  {
    "id": 4038,
    "question": "Why is it standard practice to separate data and communication cables from power cables in an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables",
      "Because data cables carry significantly higher voltages",
      "To prevent the data from flowing back into the mains supply",
      "To ensure the data cables do not overheat the power cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables generate electromagnetic fields that can induce noise and interference (EMI) in data cables, which can corrupt signals or slow down communication speeds."
  },
  {
    "id": 4039,
    "question": "In a parallel radial circuit supplying several socket outlets, how does the supply voltage behave across each outlet?",
    "options": [
      "It remains the same across all outlets (ignoring minor volt drop)",
      "It is divided equally between the number of outlets",
      "It increases as the distance from the consumer unit increases",
      "It is only present at the first outlet in the run"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "SIGN_ERROR",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the voltage across each branch (or outlet) is the same as the supply voltage, minus any small losses due to cable resistance."
  },
  {
    "id": 4040,
    "question": "A 230V radial circuit supplies a 3 kW immersion heater. Calculate the resistance of the heating element.",
    "options": [
      "17.63 Ω",
      "0.076 Ω",
      "690 Ω",
      "13.04 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using R = V² / P: (230 x 230) / 3000 = 52900 / 3000 = 17.63 Ω."
  },
  {
    "id": 4041,
    "question": "In a 32 A ring final circuit, how is the current distributed when a single heavy load is connected exactly halfway around the ring?",
    "options": [
      "The current splits equally between the two paths back to the consumer unit",
      "The full load current travels through the shortest path only",
      "The current is the same at every point throughout the entire ring",
      "The current only flows through the neutral conductor in one direction"
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
      "current-rule",
      "topology-confusion"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a ring final circuit, the current has two paths to the load. If the load is at the midpoint, the resistance of both paths is equal, so the current splits equally."
  },
  {
    "id": 4042,
    "question": "A radial circuit supplies three heating elements connected in series with resistances of 12 Ω, 18 Ω, and 30 Ω. What is the total resistance of the circuit?",
    "options": [
      "60 Ω",
      "6 Ω",
      "0.16 Ω",
      "6480 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "series",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of individual resistances: 12 + 18 + 30 = 60 Ω."
  },
  {
    "id": 4043,
    "question": "Why are high-power appliances, such as electric cookers, typically installed on their own dedicated radial circuit rather than a ring final circuit?",
    "options": [
      "To prevent the high current demand from overloading other parts of a shared circuit",
      "Because radial circuits always use less cable than ring circuits",
      "Because cookers require DC current which can only be supplied by radial circuits",
      "To ensure that the voltage remains at 400 V for the appliance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Dedicated radials ensure that the high current drawn by a cooker does not interfere with or overload circuits serving other outlets or appliances."
  },
  {
    "id": 4044,
    "question": "Two identical 230 V lamps are connected in parallel. If each lamp has a resistance of 460 Ω, what is the total resistance of the lighting circuit?",
    "options": [
      "230 Ω",
      "920 Ω",
      "0.004 Ω",
      "460 Ω"
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
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one: 460 / 2 = 230 Ω. Alternatively, 1/Rt = 1/460 + 1/460."
  },
  {
    "id": 4045,
    "question": "In a control circuit using a relay, what is the primary purpose of the low-current coil circuit?",
    "options": [
      "To safely switch a separate high-current power circuit using electromagnetism",
      "To increase the voltage of the mains supply for the motor",
      "To act as a fuse and blow if the current gets too high",
      "To convert AC power into DC power for the control panel"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "relays",
      "electromagnetic-induction"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Relays allow a low-power control signal to safely operate high-power equipment through magnetic switching."
  },
  {
    "id": 4046,
    "question": "A 230 V radial circuit feeds a 2.3 kW electric heater. Calculate the current flowing in the circuit.",
    "options": [
      "10 A",
      "0.1 A",
      "529 A",
      "23 A"
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
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using I = P / V: 2300 W / 230 V = 10 A."
  },
  {
    "id": 4047,
    "question": "When installing data and communication cables alongside power cables, why is a minimum separation distance required?",
    "options": [
      "To prevent electromagnetic interference (EMI) from affecting data signals",
      "To prevent the data cables from drawing too much current from the mains",
      "To stop the data cables from overheating the power cables",
      "To ensure the data cables operate at the same frequency as the mains"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3A2-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables generate magnetic fields that can induce noise (EMI) into data cables, corrupting the signal."
  },
  {
    "id": 4048,
    "question": "A series circuit contains a 230 V source and two resistors: R1 = 40 Ω and R2 = 60 Ω. Calculate the voltage drop across R2.",
    "options": [
      "138 V",
      "92 V",
      "230 V",
      "115 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "USED_PARALLEL_RULE",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "series"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total R = 100 Ω. Total I = 230/100 = 2.3 A. Voltage across R2 = I * R2 = 2.3 * 60 = 138 V."
  },
  {
    "id": 4049,
    "question": "Which type of emergency lighting system only illuminates when the normal mains power supply fails?",
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
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Non-maintained emergency lighting stays off while the mains is healthy and only activates during a power failure."
  },
  {
    "id": 4050,
    "question": "A parallel circuit has four identical branches, each drawing 2.5 A. What is the total current supplied by the source?",
    "options": [
      "10 A",
      "0.625 A",
      "2.5 A",
      "5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in all branches: 2.5 + 2.5 + 2.5 + 2.5 = 10 A."
  },
  {
    "id": 4051,
    "question": "A radial power circuit is used to supply three identical 60 Ω heating elements connected in parallel. What is the total resistance of this load?",
    "options": [
      "20 Ω",
      "180 Ω",
      "0.05 Ω",
      "60 Ω"
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
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a parallel circuit, the total resistance (Rt) is calculated as 1/Rt = 1/R1 + 1/R2 + 1/R3. For identical resistors, Rt = R / n. Therefore, 60 Ω / 3 = 20 Ω."
  },
  {
    "id": 4052,
    "question": "What is the primary design benefit of using a ring final circuit for socket outlets in a domestic installation compared to a radial circuit?",
    "options": [
      "It allows for a smaller cable cross-sectional area by providing two paths for the current",
      "It doubles the supply voltage available at each socket outlet",
      "It ensures that if the neutral conductor breaks at any point, the circuit remains safe",
      "It prevents the circuit breaker from tripping during a short circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
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
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit starts and ends at the same point in the consumer unit, effectively creating two paths for current to flow to any point on the ring, which allows for the use of smaller (usually 2.5mm²) cable for a 32A circuit."
  },
  {
    "id": 4053,
    "question": "An electrician is installing a control circuit for a large industrial ventilation fan. Which of the following best describes the purpose of this specific circuit type?",
    "options": [
      "To switch a high-power load safely using a lower current or voltage signal",
      "To provide high-speed internet connectivity to the fan's monitoring system",
      "To provide backup power to the fan in the event of a mains failure",
      "To increase the resistance of the motor windings to reduce heat"
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
      "application",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are designed to operate switching devices like contactors or relays, allowing a small signal to control the heavy current required by the motor."
  },
  {
    "id": 4054,
    "question": "A 230 V radial circuit supplies two 2 kW electric heaters connected in parallel. Calculate the total current drawn from the supply when both heaters are operating.",
    "options": [
      "17.39 A",
      "8.70 A",
      "0.11 A",
      "460 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "parallel"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 2 kW + 2 kW = 4000 W. Using I = P / V: 4000 W / 230 V = 17.39 A."
  },
  {
    "id": 4055,
    "question": "A 32 A ring final circuit has a total load of 24 A connected exactly at the midpoint of the ring. Assuming the resistance of both 'legs' of the ring is equal, what is the current flowing through each leg back to the consumer unit?",
    "options": [
      "12 A",
      "24 A",
      "32 A",
      "48 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "current-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a ring circuit, the current splits between the two paths. If the load is at the midpoint and the resistance of both legs is equal, the current divides equally: 24 A / 2 = 12 A per leg."
  },
  {
    "id": 4056,
    "question": "A healthy 32A ring final circuit is tested for continuity. If the end-to-end resistance of the line conductor (r1) is 0.80 Ω and the neutral conductor (rn) is 0.80 Ω, what is the theoretical resistance (R1 + Rn) measured at the furthest point of the ring?",
    "options": [
      "0.40 Ω",
      "1.60 Ω",
      "0.80 Ω",
      "0.20 Ω"
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
      "ring-final",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1 + Rn) is calculated as (r1 + rn) / 4. Therefore, (0.80 + 0.80) / 4 = 0.40 Ω."
  },
  {
    "id": 4057,
    "question": "Which of the following best describes the functional advantage of a ring final circuit over a radial circuit when utilizing the same size 2.5mm² cable for general power outlets?",
    "options": [
      "It allows for a higher current rating (32A) by providing two paths for the current to flow.",
      "It eliminates the risk of voltage drop over long distances by creating a continuous loop.",
      "It ensures that if one conductor is damaged, the circuit protection will always trip faster.",
      "It reduces the total harmonic distortion produced by modern electronic switch-mode power supplies."
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
      "ring-final",
      "conceptual",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A ring final circuit allows a 32A protective device to be used on 2.5mm² cable because the load is shared across two paths, effectively doubling the current-carrying capacity compared to a single radial leg."
  },
  {
    "id": 4058,
    "question": "A radial circuit supplies three 2.3kW electric heaters connected in parallel. Calculate the total current drawn from a 230V supply when all heaters are operational.",
    "options": [
      "30 A",
      "10 A",
      "6.9 A",
      "90 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power = 2.3kW * 3 = 6.9kW (6900W). Total Current I = P / V = 6900 / 230 = 30A."
  },
  {
    "id": 4059,
    "question": "In a commercial control circuit, a 24V DC relay is used to switch a 400V AC motor. What is the primary purpose of using this 'control circuit' topology?",
    "options": [
      "To provide electrical isolation between the operator interface and the high-power load.",
      "To increase the torque of the motor by using a rectified DC starting signal.",
      "To reduce the overall energy consumption of the motor during the running phase.",
      "To prevent the occurrence of eddy currents within the motor's main stator windings."
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
      "application",
      "relays",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A2-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Control circuits allow low-voltage, low-current signals to safely manage high-voltage, high-current loads, providing safety for operators and reducing the need for heavy-duty switching at the control point."
  },
  {
    "id": 4060,
    "question": "A 25-meter radial circuit supplies a load of 15A using a cable with a voltage drop factor of 11 mV/A/m. Calculate the total voltage drop for this circuit.",
    "options": [
      "4.13 V",
      "4125 V",
      "0.16 V",
      "2.75 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Voltage drop = (mV/A/m * I * L) / 1000. So, (11 * 15 * 25) / 1000 = 4125 / 1000 = 4.125V (rounded to 4.13V)."
  },
  {
    "id": 4061,
    "question": "A 'Maintained' emergency lighting luminaire differs from a 'Non-Maintained' luminaire because it:",
    "options": [
      "Operates at all times from the mains supply and switches to battery during a failure.",
      "Only illuminates when the local circuit suffers a complete loss of power.",
      "Requires a manual reset after every power failure to recharge the internal batteries.",
      "Is connected directly to the fire alarm control panel via a data bus cable."
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
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Maintained emergency lights are designed to be lit continuously (like standard lighting) and remain lit using battery power if the mains supply fails."
  },
  {
    "id": 4062,
    "question": "An electrician is installing a mixed circuit. Two 120 Ω resistors are connected in parallel, and this group is then connected in series with a single 40 Ω resistor. What is the total resistance of the circuit?",
    "options": [
      "100 Ω",
      "280 Ω",
      "60 Ω",
      "200 Ω"
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
      "calculation",
      "mixed-circuit",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The parallel section resistance is (120 * 120) / (120 + 120) = 60 Ω. Adding the series resistor: 60 Ω + 40 Ω = 100 Ω."
  },
  {
    "id": 4063,
    "question": "Why is it a regulatory requirement to maintain physical separation or provide additional shielding between power cables and data/communication cables in the same containment?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals.",
      "To prevent the data cables from overheating due to the current in the power cables.",
      "To ensure the data cables do not increase the earth fault loop impedance of the power circuit.",
      "To allow for easier identification during future maintenance and inspection."
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
      "application",
      "legislation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "High-voltage/current power cables create magnetic fields that can induce unwanted voltages (noise) in data cables, leading to signal corruption."
  },
  {
    "id": 4064,
    "question": "If the length of a radial circuit supplying a fixed load is doubled, but the cable cross-sectional area remains the same, which of the following statements is true?",
    "options": [
      "The voltage drop across the cable will double.",
      "The total current drawn by the load will double.",
      "The circuit resistance will be halved.",
      "The power dissipated by the load will increase."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "voltage-rule",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Resistance is directly proportional to length (R = ρL/A). If length doubles, resistance doubles. Since Vd = I * R, if I is constant and R doubles, the voltage drop (Vd) also doubles."
  },
  {
    "id": 4065,
    "question": "A 9.2kW electric shower is used for an average of 20 minutes per day. If the unit cost of electricity is 30p per kWh, calculate the approximate cost of running the shower for one week (7 days).",
    "options": [
      "£6.44",
      "£19.32",
      "£1.38",
      "£38.64"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "energy",
      "conversion"
    ],
    "learningOutcomeId": "203-3A2-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Total time per week = 20 mins * 7 = 140 mins = 2.333 hours. Energy used = 9.2kW * 2.333h = 21.466 kWh. Cost = 21.466 * 30p = 644p = £6.44."
  }
];
