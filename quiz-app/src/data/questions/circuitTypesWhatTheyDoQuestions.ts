import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A learning outcomes
 * Generated: 2026-02-11
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary function of a lighting circuit in a domestic installation?",
    "options": [
      "To provide electricity to fixed luminaires and lamps",
      "To provide high-current power for kitchen appliances",
      "To carry high-speed data signals for internet use",
      "To monitor the temperature of the central heating"
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
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Lighting circuits are specifically designed to supply fixed luminaires, usually at a lower current rating (e.g., 6A) than power circuits."
  },
  {
    "id": 4017,
    "question": "Which circuit topology starts at the consumer unit, connects to several socket outlets, and then returns to the same consumer unit?",
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
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit forms a continuous loop by returning to the original protective device in the consumer unit."
  },
  {
    "id": 4018,
    "question": "Two 50Ω resistors are connected in series in a control circuit. What is the total resistance of the circuit?",
    "options": [
      "100Ω",
      "25Ω",
      "50Ω",
      "5Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (50 + 50 = 100)."
  },
  {
    "id": 4019,
    "question": "Which statement best describes a radial circuit?",
    "options": [
      "A circuit that runs from the consumer unit to the last point and ends there",
      "A circuit that must return to the consumer unit to form a loop",
      "A circuit used only for low-voltage data communication",
      "A circuit that connects the neutral bar to the earth bar"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit 'radiates' from the source to the outlets and does not return to the source to form a loop."
  },
  {
    "id": 4020,
    "question": "If a series circuit has a total current of 5A, what is the current flowing through each individual component in that circuit?",
    "options": [
      "5A",
      "2.5A",
      "10A",
      "0A"
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
      "current-rule",
      "series",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the current remains the same at all points in the circuit."
  },
  {
    "id": 4021,
    "question": "Three identical heaters are connected in parallel to a 230V supply. What is the voltage across each heater?",
    "options": [
      "230V",
      "76.7V",
      "690V",
      "115V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "voltage-rule",
      "parallel",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4022,
    "question": "Which type of circuit would typically use Cat5e or Cat6 cabling to support office networking?",
    "options": [
      "Data and communications circuit",
      "Power and heating circuit",
      "Emergency lighting circuit",
      "Radial socket circuit"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cat5e and Cat6 are standard cables used for data and communication circuits to transmit digital signals."
  },
  {
    "id": 4023,
    "question": "What is the main purpose of a control circuit in an automated industrial system?",
    "options": [
      "To switch power circuits on or off based on inputs",
      "To provide the main energy for heavy motors",
      "To act as a backup power supply during outages",
      "To increase the total resistance of the supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits use low-power signals to manage the operation of high-power components."
  },
  {
    "id": 4024,
    "question": "Two 12Ω resistors are connected in parallel. What is the total resistance?",
    "options": [
      "6Ω",
      "24Ω",
      "12Ω",
      "144Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (12 / 2 = 6)."
  },
  {
    "id": 4025,
    "question": "A heating element in a water heater draws 13A from a 230V supply. What is the approximate power rating of the heater?",
    "options": [
      "2990W",
      "17.7W",
      "217W",
      "29900W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "power",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Power (P) = Voltage (V) x Current (I). Therefore, 230V x 13A = 2990W."
  },
  {
    "id": 4026,
    "question": "Which of the following is a defining characteristic of a 'ring final' circuit used in UK domestic installations?",
    "options": [
      "The circuit cable starts and finishes at the same terminals in the consumer unit",
      "The circuit cable ends at the last socket outlet on the run",
      "The circuit is only used for high-power immersion heaters",
      "The circuit uses a single 1.5mm² cable for all power sockets"
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
      "ring-final"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit forms a continuous loop, starting at the consumer unit, visiting every socket, and returning to the same point in the consumer unit."
  },
  {
    "id": 4027,
    "question": "A control circuit has two resistors connected in series with resistances of 15 Ω and 25 Ω. What is the total resistance of the circuit?",
    "options": [
      "40 Ω",
      "9.38 Ω",
      "375 Ω",
      "15 Ω"
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
      "calculation",
      "series",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is found by simply adding the individual resistances together (15 + 25 = 40)."
  },
  {
    "id": 4028,
    "question": "An electrician is installing a dedicated circuit for a 7kW electric shower. Which circuit topology is most appropriate for this high-power appliance?",
    "options": [
      "A radial circuit",
      "A ring final circuit",
      "A data/comms circuit",
      "A series lighting circuit"
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
      "radial",
      "power"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power appliances like electric showers are typically wired on their own dedicated radial circuit to handle the high current demand safely."
  },
  {
    "id": 4029,
    "question": "A parallel radial circuit feeds two heaters. Heater A draws 6 A and Heater B draws 8 A. What is the total current supplied by the source?",
    "options": [
      "14 A",
      "6 A",
      "3.43 A",
      "48 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each individual branch (6 + 8 = 14)."
  },
  {
    "id": 4030,
    "question": "In a standard domestic radial circuit connected to a 230 V supply, what is the voltage across each socket outlet when several appliances are running in parallel?",
    "options": [
      "Approximately 230 V",
      "The voltage is divided equally between the sockets",
      "0 V",
      "The voltage increases as more appliances are plugged in"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "parallel",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch (or socket) remains the same as the supply voltage."
  },
  {
    "id": 4031,
    "question": "A lighting circuit consists of three lamps connected in series, each with a resistance of 80 ohms. What is the total resistance of this circuit?",
    "options": [
      "240 ohms",
      "26.67 ohms",
      "80 ohms",
      "6400 ohms"
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances (R1 + R2 + R3). Therefore, 80 + 80 + 80 = 240 ohms."
  },
  {
    "id": 4032,
    "question": "What is a primary technical advantage of using a ring final circuit for socket outlets in a domestic installation?",
    "options": [
      "It allows for a smaller cable cross-sectional area by providing two paths for current",
      "It eliminates the need for a circuit protective conductor (CPC)",
      "It ensures that the voltage at every socket is exactly 230V regardless of load",
      "It prevents the circuit from tripping if one socket develops a fault"
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
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit starts and ends at the consumer unit, providing two paths for the current to flow. This allows the use of 2.5mm² cable even though the circuit is protected by a 30A or 32A device."
  },
  {
    "id": 4033,
    "question": "A radial circuit serves a 9.2 kW electric shower. Calculate the design current (Ib) for this circuit if the nominal voltage is 230V.",
    "options": [
      "40 A",
      "21.1 A",
      "2116 A",
      "4 A"
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
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using the formula I = P / V: 9200W / 230V = 40A."
  },
  {
    "id": 4034,
    "question": "In a parallel circuit containing three different heating elements, which of the following statements regarding current is true?",
    "options": [
      "The total current is the sum of the currents in each branch",
      "The current is the same at every point in the circuit",
      "The total current is equal to the current in the highest resistance branch",
      "The total current decreases as more heating elements are switched on"
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
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current (It) is the sum of the currents (I1 + I2 + I3) flowing through each individual parallel branch."
  },
  {
    "id": 4035,
    "question": "Two 60 ohm resistors are connected in parallel. What is the total resistance of this arrangement?",
    "options": [
      "30 ohms",
      "120 ohms",
      "60 ohms",
      "3600 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For two resistors in parallel, Rt = (R1 * R2) / (R1 + R2) or 1/Rt = 1/R1 + 1/R2. Since they are identical, it is simply R/2: 60 / 2 = 30 ohms."
  },
  {
    "id": 4036,
    "question": "When installing data and communication cables alongside power cables, why is it necessary to maintain a specific separation distance?",
    "options": [
      "To prevent electromagnetic interference (EMI) from affecting data signals",
      "To prevent the power cables from drawing current from the data cables",
      "To ensure the data cables do not overheat the power cables",
      "To allow for easier identification of the different cable types"
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
      "data-comms",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables create electromagnetic fields which can induce 'noise' or interference in data cables, leading to signal corruption or data loss."
  },
  {
    "id": 4037,
    "question": "A series circuit has a 230V supply and two resistors: 15 ohms and 10 ohms. Calculate the voltage drop across the 10 ohm resistor.",
    "options": [
      "92 V",
      "138 V",
      "230 V",
      "23 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total R = 25 ohms. Total I = 230 / 25 = 9.2A. Voltage across 10 ohm resistor = I * R = 9.2 * 10 = 92V."
  },
  {
    "id": 4038,
    "question": "What is the specific function of a 'control circuit' in a central heating system?",
    "options": [
      "To use low-power signals to switch high-power components like pumps and boilers",
      "To provide the main power supply to the heating elements",
      "To increase the resistance of the water to generate heat",
      "To convert the AC supply into DC for the thermostat only"
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
      "control",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits allow for automated or manual switching of larger loads (like a 230V pump) using safer, low-current signals from thermostats or programmers."
  },
  {
    "id": 4039,
    "question": "Why are domestic lighting circuits wired in parallel rather than series?",
    "options": [
      "To ensure that if one lamp fails, the rest of the circuit remains functional",
      "To ensure the total resistance of the circuit is as high as possible",
      "To allow the current to be the same through every lamp in the house",
      "To reduce the voltage at each lamp to a safer level"
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
      "lighting",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, each lamp has its own path to the supply. If one path is broken (bulb blows), the other paths remain complete."
  },
  {
    "id": 4040,
    "question": "A ring final circuit is protected by a 32A MCB. If a 20A load is connected exactly at the midpoint of the ring, what is the theoretical current flowing in each 'leg' of the ring back to the consumer unit?",
    "options": [
      "10 A",
      "20 A",
      "32 A",
      "5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ring-final",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final, the current splits between the two paths. If the load is at the midpoint and the cable resistance is equal in both directions, the current splits equally (20A / 2 = 10A per leg)."
  },
  {
    "id": 4041,
    "question": "An electrician is testing a series-connected decorative lighting string containing three identical lamps. If the total resistance of the string is 1500 Ω, what is the resistance of each individual lamp?",
    "options": [
      "500 Ω",
      "4500 Ω",
      "1500 Ω",
      "166.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a series circuit, total resistance is the sum of individual resistances (Rt = R1 + R2 + R3). Since the lamps are identical, 1500 Ω / 3 = 500 Ω."
  },
  {
    "id": 4042,
    "question": "What is the primary technical advantage of using a ring final circuit topology for socket outlets in a domestic installation?",
    "options": [
      "Current can flow in two directions, allowing for a higher load using smaller cable cross-sections",
      "The voltage is doubled because there are two paths from the consumer unit",
      "Fault current is eliminated because the circuit forms a complete loop",
      "It is easier and faster to install than a standard radial circuit"
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
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit allows current to split and reach the load via two paths, effectively increasing the current-carrying capacity of the circuit without needing excessively thick cables."
  },
  {
    "id": 4043,
    "question": "A radial power circuit supplies two heaters connected in parallel. Heater A draws 10 A and Heater B draws 5 A. What is the total current measured at the circuit breaker?",
    "options": [
      "15 A",
      "5 A",
      "50 A",
      "7.5 A"
    ],
    "active": true,
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in the individual branches (It = I1 + I2). Therefore, 10 A + 5 A = 15 A."
  },
  {
    "id": 4044,
    "question": "Which type of circuit is most appropriate for the installation of a 9.5 kW electric shower in a domestic property?",
    "options": [
      "A dedicated radial circuit",
      "A 32 A ring final circuit",
      "A 6 A lighting circuit",
      "A control and signaling circuit"
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
      "units",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "High-load appliances like electric showers require a dedicated radial circuit to handle the high current (approx 41A) safely without overloading other outlets."
  },
  {
    "id": 4045,
    "question": "In a series circuit consisting of a 230 V supply and two resistors of 20 Ω and 80 Ω, what is the voltage drop across the 80 Ω resistor?",
    "options": [
      "184 V",
      "46 V",
      "115 V",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total R = 100 Ω. Current I = V/R = 230/100 = 2.3 A. Voltage across 80 Ω = I * R = 2.3 * 80 = 184 V."
  },
  {
    "id": 4046,
    "question": "If a ring final circuit suffers a break in the line conductor at a single point, what is the immediate effect on the connected socket outlets?",
    "options": [
      "The outlets continue to work but the circuit now behaves as two radial circuits",
      "All outlets on the circuit will immediately lose power",
      "The circuit breaker will trip instantly due to a short circuit",
      "The voltage at the outlets will drop to half of the supply voltage"
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
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Because a ring is fed from both ends, a single break results in the circuit becoming two radial paths. This is dangerous as the cable may become overloaded."
  },
  {
    "id": 4047,
    "question": "Calculate the total resistance of a parallel circuit containing two 40 Ω heating elements.",
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
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (Rt = R/n). 40 / 2 = 20 Ω."
  },
  {
    "id": 4048,
    "question": "What is the primary function of a control circuit in a commercial heating and ventilation system?",
    "options": [
      "To safely switch higher power loads using lower voltage or current signals",
      "To provide the main energy source for the heating elements",
      "To increase the frequency of the supply for better motor efficiency",
      "To act as the primary earthing path for the installation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits allow for the safe management of large loads (like industrial heaters) using low-power devices like thermostats or PLCs."
  },
  {
    "id": 4049,
    "question": "A radial circuit is protected by a 13 A fuse and operates at 230 V. What is the maximum power that can be drawn from this circuit before the fuse is likely to blow?",
    "options": [
      "2990 W",
      "17.69 W",
      "0.056 W",
      "243 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power (P) = Voltage (V) x Current (I). 230 V * 13 A = 2990 W."
  },
  {
    "id": 4050,
    "question": "Why are data and communication circuits usually kept physically separated from power circuits in an installation?",
    "options": [
      "To prevent electromagnetic interference from affecting signal integrity",
      "Because data circuits operate at much higher frequencies than 50 Hz",
      "To ensure the data cables do not overheat the power cables",
      "Because data circuits require a separate connection to the earth electrode"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Separation (segregation) is required to prevent electrical noise and interference from power cables from distorting the low-voltage signals in data cables."
  },
  {
    "id": 4051,
    "question": "A 230V radial circuit is used to supply two resistive heating elements connected in series for a specific industrial process. If the resistances are 12Ω and 18Ω respectively, what is the total current flowing through the circuit?",
    "options": [
      "7.67 A",
      "19.17 A",
      "32.00 A",
      "30.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "series"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of individual resistances: 12Ω + 18Ω = 30Ω. Using Ohm's Law (I = V / R), the current is 230V / 30Ω = 7.67A."
  },
  {
    "id": 4052,
    "question": "Which of the following is a specific characteristic of a Ring Final Circuit that distinguishes it from a Radial Power Circuit?",
    "options": [
      "The circuit conductors start and finish at the same point in the distribution board.",
      "The circuit is only permitted to supply fixed lighting loads and not socket outlets.",
      "It requires a larger cable cross-sectional area to carry the same load as a radial.",
      "If there is a break in the conductor at any point, all connected loads will lose power."
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
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit forms a loop where the line, neutral, and CPC conductors start at the consumer unit, visit every point on the circuit, and return to the same terminals in the consumer unit."
  },
  {
    "id": 4053,
    "question": "Two 230V heaters are connected in parallel within a radial power circuit. Heater A draws 6A and Heater B draws 10A. Calculate the total resistance of this circuit arrangement.",
    "options": [
      "14.38 Ω",
      "61.33 Ω",
      "16.00 Ω",
      "38.33 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "In parallel, total current is the sum of branch currents: 6A + 10A = 16A. Using Ohm's Law (R = V / I), the total resistance is 230V / 16A = 14.375Ω (rounded to 14.38Ω)."
  },
  {
    "id": 4054,
    "question": "An electrician is installing a system designed to manage the switching of high-power heating loads via a low-voltage thermostat. What type of circuit is typically used for the thermostat wiring?",
    "options": [
      "Control circuit",
      "Ring final circuit",
      "Data/Communications circuit",
      "Radial power circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are used to operate or regulate the behavior of other circuits, such as using a low-current thermostat to switch a high-current heating load via a contactor or relay."
  },
  {
    "id": 4055,
    "question": "A 230V radial circuit supplies a single motor. The circuit cable has a resistance of 0.4Ω. If the motor draws 15A during normal operation, what is the actual voltage measured at the motor terminals?",
    "options": [
      "224 V",
      "6 V",
      "236 V",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "SIGN_ERROR",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, calculate the voltage drop across the cable: V = I * R = 15A * 0.4Ω = 6V. The voltage at the load is the source voltage minus the drop: 230V - 6V = 224V."
  },
  {
    "id": 4056,
    "question": "A ring final circuit is being tested. The end-to-end resistance of the line conductor (r1) is 0.8 Ω and the end-to-end resistance of the neutral conductor (rn) is 0.8 Ω. What is the expected theoretical (R1+Rn) reading at each socket on the ring?",
    "options": [
      "0.40 Ω",
      "1.60 Ω",
      "0.80 Ω",
      "0.20 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the measured resistance at sockets (R1+Rn) is calculated as (r1 + rn) / 4. Here, (0.8 + 0.8) / 4 = 1.6 / 4 = 0.4 Ω."
  },
  {
    "id": 4057,
    "question": "In a lighting circuit utilizing three-way switching, what specific electrical function does the intermediate switch perform to allow control from three locations?",
    "options": [
      "It cross-connects the two strapper wires to reverse their polarity",
      "It provides a secondary neutral return path to the consumer unit",
      "It acts as a master override to disconnect the permanent live",
      "It reduces the line voltage to allow for multi-point dimming"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "lighting",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "An intermediate switch has four terminals and works by swapping the connection of the two strapper wires coming from the two-way switches, effectively reversing the circuit state."
  },
  {
    "id": 4058,
    "question": "A lighting circuit supplies eight 50W LED luminaires. If the supply voltage is 230V and the circuit has a power factor of 0.9, what is the total design current (Ib) for this circuit?",
    "options": [
      "1.93 A",
      "1.74 A",
      "1.56 A",
      "4.44 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "lighting",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total power = 8 * 50W = 400W. Current I = P / (V * PF). I = 400 / (230 * 0.9) = 400 / 207 = 1.93 A."
  },
  {
    "id": 4059,
    "question": "When installing data and telecommunications cabling in a commercial environment, why is it critical to maintain physical segregation from 230V power circuits?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals",
      "To ensure that the data cables do not exceed their maximum thermal rating",
      "To prevent the data cabinet from drawing excessive current from the mains",
      "To allow for the higher voltage requirements of high-speed fiber optics"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Segregation is required primarily to prevent EMI (noise) from power cables being induced into data cables, which can cause signal degradation or data loss."
  },
  {
    "id": 4060,
    "question": "Two 115V heating elements, each rated at 500W, are incorrectly connected in series to a 230V supply. What is the total resistance of this series combination?",
    "options": [
      "52.90 Ω",
      "13.23 Ω",
      "26.45 Ω",
      "105.80 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Resistance of one element R = V^2 / P = 115^2 / 500 = 26.45 Ω. In series, total resistance = 26.45 + 26.45 = 52.9 Ω."
  },
  {
    "id": 4061,
    "question": "A ring final circuit line conductor suffers a single break (open circuit) at a point halfway along the ring. What is the most likely immediate effect on the operation of appliances connected to the sockets?",
    "options": [
      "Appliances continue to function normally, but the cable may become overloaded",
      "All appliances on the circuit will immediately lose power",
      "Only appliances located after the break will stop working",
      "The circuit protective device will trip due to the change in impedance"
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
      "ring-final",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, a single break turns the circuit into two radials. Appliances still have a path to the supply, so they work, but the current-carrying capacity of the ring is compromised."
  },
  {
    "id": 4062,
    "question": "A 30m radial circuit using 4.0mm² copper cable (voltage drop factor 11mV/A/m) supplies a 7kW electric cooker at 230V. Calculate the total voltage drop for this circuit.",
    "options": [
      "10.04 V",
      "0.33 V",
      "3.35 V",
      "20.08 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "UNITS_MISSING",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "radial",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Current I = 7000 / 230 = 30.43 A. Voltage Drop = (mV/A/m * I * L) / 1000 = (11 * 30.43 * 30) / 1000 = 10.04 V."
  },
  {
    "id": 4063,
    "question": "Why is a radial topology with an end-of-line (EOL) resistor typically used for conventional fire alarm sounder circuits?",
    "options": [
      "To allow the control panel to monitor circuit continuity and detect faults",
      "To ensure the sounders operate at a higher voltage than the detection loop",
      "To prevent electromagnetic interference from triggering false alarms",
      "To allow sounders to be connected in series to save on cabling costs"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "radial",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The EOL resistor allows a small supervisory current to flow, which the panel monitors. If the circuit is broken, the current stops, and the panel identifies a fault."
  },
  {
    "id": 4064,
    "question": "A 24V DC relay coil in a control circuit has a resistance of 120 Ω. This relay is used to switch a 3kW heater. What is the current flowing through the control circuit (the coil) when energized?",
    "options": [
      "0.20 A",
      "13.04 A",
      "5.00 A",
      "2880 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The current in the control circuit depends on the coil's voltage and resistance. I = V / R = 24 / 120 = 0.2 A. The 3kW load is on the power circuit, not the control circuit."
  },
  {
    "id": 4065,
    "question": "What is the primary safety advantage of using a low-voltage control circuit and a relay to operate a high-power industrial motor?",
    "options": [
      "It isolates the operator's switch from the high-voltage/high-current power circuit",
      "It reduces the total energy consumption of the motor during operation",
      "It eliminates the need for a circuit protective conductor (CPC) on the motor",
      "It automatically converts the AC supply into the DC required by the motor"
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
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Using a relay allows the operator to use a safe, low-voltage switch to control a potentially dangerous high-voltage circuit, providing electrical isolation and safety."
  }
];
