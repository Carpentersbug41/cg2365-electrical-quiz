import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A30 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which of the following best describes the topology of a radial circuit?",
    "options": [
      "The circuit originates at the consumer unit and terminates at the last point of use",
      "The circuit originates at the consumer unit and returns back to the same consumer unit",
      "The circuit is connected in a continuous loop with no termination point",
      "The circuit is connected directly to the earthing arrangement only"
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
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit runs from the source (consumer unit) to the final point, unlike a ring final circuit which returns to the source."
  },
  {
    "id": 4017,
    "question": "An electrician installs two resistors in series with values of 15 Ω and 25 Ω. What is the total resistance of the circuit?",
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
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances: 15 + 25 = 40 Ω."
  },
  {
    "id": 4018,
    "question": "What is the primary reason for using a ring final circuit for socket outlets in a domestic installation?",
    "options": [
      "To allow for a higher current demand using smaller cable sizes",
      "To ensure that if one part of the cable breaks, the whole circuit fails safely",
      "To reduce the voltage drop to zero at every socket",
      "To allow the circuit to operate without an earth connection"
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
      "units"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit splits the load current between two paths, allowing the use of smaller cables (typically 2.5mm²) for a 32A protective device."
  },
  {
    "id": 4019,
    "question": "Two identical heating elements, each with a resistance of 40 Ω, are connected in parallel. What is the total resistance?",
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
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor: 40 / 2 = 20 Ω."
  },
  {
    "id": 4020,
    "question": "Which circuit type is specifically designed for fire detection and emergency lighting systems?",
    "options": [
      "Alarm and emergency circuits",
      "Ring final circuits",
      "Data and communications circuits",
      "Power and heating circuits"
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
      "discrimination",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Alarm and emergency circuits are a specific category used for life-safety systems like fire alarms."
  },
  {
    "id": 4021,
    "question": "A series lighting circuit has a current of 2 A flowing through a lamp with a resistance of 30 Ω. Calculate the voltage drop across the lamp.",
    "options": [
      "60 V",
      "15 V",
      "32 V",
      "0.06 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "SIGN_ERROR",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using Ohm's Law (V = I x R): 2 A x 30 Ω = 60 V."
  },
  {
    "id": 4022,
    "question": "What is the typical function of a 'control circuit' in an electrical installation?",
    "options": [
      "To switch larger loads on or off using a smaller current",
      "To provide high-speed internet access to the building",
      "To provide the main power supply to a kitchen cooker",
      "To act as the primary earthing path for the installation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits (like relay or contactor circuits) use low currents to safely manage high-power equipment."
  },
  {
    "id": 4023,
    "question": "In a parallel circuit with two branches, Branch A carries 4 A and Branch B carries 6 A. What is the total current supplied by the source?",
    "options": [
      "10 A",
      "4 A",
      "24 A",
      "2 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "According to Kirchhoff's Current Law, the total current in a parallel circuit is the sum of the currents in each branch: 4 + 6 = 10 A."
  },
  {
    "id": 4024,
    "question": "Which of these is a typical application for a 32 A ring final circuit?",
    "options": [
      "Domestic kitchen socket outlets",
      "A single 6 W LED downlight",
      "A telephone landline connection",
      "A battery-powered smoke alarm"
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
      "application",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Ring final circuits are standard for domestic socket outlets, whereas lighting and data use different circuit types and ratings."
  },
  {
    "id": 4025,
    "question": "A 230 V electric heater draws a current of 10 A. What is the power rating of the heater?",
    "options": [
      "2300 W",
      "23 W",
      "240 W",
      "220 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "SIGN_ERROR",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "power",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Power is calculated using P = V x I: 230 V x 10 A = 2300 W (or 2.3 kW)."
  },
  {
    "id": 4026,
    "question": "Which characteristic is unique to a ring final circuit compared to a radial circuit?",
    "options": [
      "The circuit cable returns to the same point it started at the consumer unit",
      "Current has only one path to follow to the last point",
      "It is used exclusively for fixed high-power heating appliances",
      "The voltage is divided equally between every socket outlet"
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
      "topology-identification",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit starts and ends at the consumer unit, forming a continuous loop, whereas a radial circuit ends at the last point of use."
  },
  {
    "id": 4027,
    "question": "A series circuit consists of two resistors with values of 15 Ω and 25 Ω. What is the total resistance of the circuit?",
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
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Resistance Rule",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of the individual resistances (Rt = R1 + R2). 15 + 25 = 40 Ω."
  },
  {
    "id": 4028,
    "question": "In a parallel circuit containing three lamps, if the supply voltage is 230 V, what is the voltage across each lamp?",
    "options": [
      "230 V",
      "76.6 V",
      "0 V",
      "115 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Voltage Rule",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4029,
    "question": "A parallel circuit has two branches. Branch A draws 4 A and Branch B draws 6 A. What is the total current supplied to the circuit?",
    "options": [
      "10 A",
      "2 A",
      "24 A",
      "2.4 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Current Rule",
    "tags": [
      "parallel",
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (It = I1 + I2). 4 + 6 = 10 A."
  },
  {
    "id": 4030,
    "question": "Which type of circuit is primarily used to transmit signals for computer networking and internet access in a building?",
    "options": [
      "Data and communications circuit",
      "Control circuit",
      "Ring final circuit",
      "Emergency lighting circuit"
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
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Data and communications circuits are designed for low-voltage signal transmission such as Ethernet or telephone lines."
  },
  {
    "id": 4031,
    "question": "A series circuit consists of three resistors with values of 15 Ω, 25 Ω, and 40 Ω connected to a 230V supply. What is the total resistance of the circuit?",
    "options": [
      "80 Ω",
      "7.4 Ω",
      "40 Ω",
      "15,000 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3). Therefore, 15 + 25 + 40 = 80 Ω."
  },
  {
    "id": 4032,
    "question": "Which of the following best describes the topology of a standard domestic ring final circuit?",
    "options": [
      "The circuit cable starts at the consumer unit and returns to the same terminals after serving all points",
      "The circuit cable starts at the consumer unit and terminates at the furthest point of use",
      "Multiple cables are connected in parallel at the consumer unit to serve a single room",
      "A single cable that splits into several branches to serve different floors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ring Final Circuits",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit is unique because the conductor forms a continuous loop, starting and ending at the same protective device in the consumer unit."
  },
  {
    "id": 4033,
    "question": "A 230V parallel circuit has two branches. Branch A draws 5A and Branch B has a resistance of 46 Ω. What is the total current drawn from the supply?",
    "options": [
      "10 A",
      "5 A",
      "51 A",
      "2.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Parallel Circuits",
    "tags": [
      "parallel",
      "calculation",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First calculate current in Branch B: I = V/R = 230 / 46 = 5A. In a parallel circuit, total current is the sum of the branch currents: 5A + 5A = 10A."
  },
  {
    "id": 4034,
    "question": "An electrician is installing a lighting circuit where the live feed enters the switch box first before continuing to the luminaire. This specific method of wiring is commonly referred to as:",
    "options": [
      "Two-plate wiring",
      "Three-plate wiring",
      "Ring final wiring",
      "Series switching"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Radial Circuits",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Two-plate wiring involves taking the feed to the switch. Three-plate (or loop-in) wiring involves taking the feed to the ceiling rose/luminaire."
  },
  {
    "id": 4035,
    "question": "What is the primary reason for using a control circuit (such as a 24V DC relay system) to operate a 400V AC industrial motor?",
    "options": [
      "To improve operator safety by isolating them from high voltages",
      "To increase the speed and torque of the motor",
      "Because AC motors cannot be started using AC control voltages",
      "To prevent electromagnetic interference with local data cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Control Circuits",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits allow high-power equipment to be operated safely from a distance or via low-voltage interfaces, reducing the risk of electric shock to the operator."
  },
  {
    "id": 4036,
    "question": "Two heating elements with resistances of 20 Ω and 30 Ω are connected in series to a 230V supply. Calculate the voltage drop across the 30 Ω resistor.",
    "options": [
      "138 V",
      "92 V",
      "115 V",
      "230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Series Circuits",
    "tags": [
      "calculation",
      "voltage-rule",
      "series"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Total R = 50 Ω. Circuit current I = V/R = 230/50 = 4.6A. Voltage across 30 Ω = I * R = 4.6 * 30 = 138V."
  },
  {
    "id": 4037,
    "question": "In a commercial installation, a 'maintained' emergency luminaire is one that:",
    "options": [
      "Is illuminated at all times when the normal lighting is on and when power fails",
      "Only illuminates when the local supply to the normal lighting fails",
      "Is connected to a DC circuit that only functions during daylight hours",
      "Requires manual activation by a fire warden during an evacuation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Emergency Circuits",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Maintained emergency lights operate like standard lights but stay on (using battery power) if the mains fails. Non-maintained lights only turn on when the power fails."
  },
  {
    "id": 4038,
    "question": "The end-to-end resistance of the line conductor in a ring final circuit is measured at 0.6 Ω. What would be the expected resistance measured from the consumer unit to the midpoint of the ring?",
    "options": [
      "0.15 Ω",
      "0.30 Ω",
      "1.20 Ω",
      "0.60 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ring Final Circuits",
    "tags": [
      "calculation",
      "ring-final",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "At the midpoint of a ring, you are measuring two equal halves of the ring in parallel. Resistance = (R_end-to-end / 2) / 2, which is R_end-to-end / 4. 0.6 / 4 = 0.15 Ω."
  },
  {
    "id": 4039,
    "question": "When installing data cabling alongside power cables in a shared containment system, what is the main reason for maintaining physical separation or using screened cables?",
    "options": [
      "To prevent electromagnetic interference (EMI) from distorting data signals",
      "To prevent the power cables from overheating due to data traffic",
      "To ensure the data cables do not accidentally provide an earth path",
      "To comply with regulations regarding the color-coding of data vs power"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Data/Comms",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables generate magnetic fields that can induce currents in nearby data cables, causing signal noise and data loss (EMI)."
  },
  {
    "id": 4040,
    "question": "A 230V radial power circuit supplies four separate 1.15 kW heaters connected in parallel. What is the total current drawn by the circuit when all heaters are switched on?",
    "options": [
      "20 A",
      "5 A",
      "4.6 A",
      "80 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Radial Circuits",
    "tags": [
      "calculation",
      "parallel",
      "power"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 4 * 1150W = 4600W. Total Current I = P / V = 4600 / 230 = 20A."
  },
  {
    "id": 4041,
    "question": "A series lighting circuit contains three lamps with resistances of 120Ω, 150Ω, and 230Ω. What is the total resistance of the circuit?",
    "options": [
      "500Ω",
      "48.4Ω",
      "166.7Ω",
      "110Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "ROUNDING_ERROR",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3). 120 + 150 + 230 = 500Ω."
  },
  {
    "id": 4042,
    "question": "An electrician is testing a 32A ring final circuit. If the end-to-end resistance (r1) of the line conductor is measured as 0.8Ω, what should the resistance be at the furthest point (R1) when the ends are cross-connected?",
    "options": [
      "0.2Ω",
      "0.4Ω",
      "1.6Ω",
      "3.2Ω"
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
      "ring-final",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance at a socket (R1) is calculated as r1 / 4 because the current has two paths in parallel, each half the length of the total ring. 0.8 / 4 = 0.2Ω."
  },
  {
    "id": 4043,
    "question": "Which of the following best describes the primary operational difference between a radial circuit and a ring final circuit?",
    "options": [
      "A radial circuit terminates at the last point of use, while a ring circuit returns to the origin.",
      "A radial circuit allows for higher current carrying capacity using thinner cables.",
      "A ring circuit is only used for lighting, while radial circuits are used for power.",
      "A radial circuit must always be connected in series, while a ring is in parallel."
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
      "radial",
      "ring-final",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The defining characteristic of a radial circuit is that it runs from the consumer unit to the points of use and ends there. A ring circuit returns to the consumer unit to form a continuous loop."
  },
  {
    "id": 4044,
    "question": "A parallel circuit supplies two heating elements. Element A draws 6A and Element B draws 9A. If the supply voltage is 230V, what is the total current drawn from the source?",
    "options": [
      "15A",
      "3A",
      "7.5A",
      "54A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "ROUNDING_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (It = I1 + I2). 6A + 9A = 15A."
  },
  {
    "id": 4045,
    "question": "An industrial control circuit uses a relay to operate a large 400V motor. What is the main safety advantage of using this control circuit topology?",
    "options": [
      "It allows a low-voltage switch to control a high-voltage load, reducing risk to the operator.",
      "It increases the efficiency of the motor by reducing voltage drop.",
      "It ensures the motor runs at a constant frequency regardless of load.",
      "It converts the AC supply into DC for smoother motor starting."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "relays",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Control circuits allow for the separation of the power circuit (high voltage/current) and the control interface (low voltage/current), significantly improving operator safety."
  },
  {
    "id": 4046,
    "question": "A 230V radial circuit supplies two identical 115V rated heaters connected in series. What is the voltage drop across each heater?",
    "options": [
      "115V",
      "230V",
      "0V",
      "57.5V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "RECIPROCAL_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit with identical loads, the total voltage is shared equally. 230V / 2 = 115V."
  },
  {
    "id": 4047,
    "question": "Why is it standard practice to install data and communication cables in separate compartments or conduits from 230V power cables?",
    "options": [
      "To prevent electromagnetic induction from the power cables causing data corruption.",
      "Because data cables require a vacuum to operate at high frequencies.",
      "To prevent the data cables from drawing current from the power circuit.",
      "Because communication cables operate on DC, which is incompatible with AC."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables create magnetic fields that can induce unwanted voltages (noise) in nearby data cables, leading to signal errors or corruption."
  },
  {
    "id": 4048,
    "question": "Calculate the total resistance of a parallel circuit branch containing a 20Ω resistor and a 60Ω resistor.",
    "options": [
      "15Ω",
      "80Ω",
      "40Ω",
      "0.06Ω"
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
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the product-over-sum rule: (20 * 60) / (20 + 60) = 1200 / 80 = 15Ω."
  },
  {
    "id": 4049,
    "question": "In an emergency lighting installation, what characterizes a 'non-maintained' circuit?",
    "options": [
      "The lamps only illuminate when the normal mains power supply fails.",
      "The lamps are permanently lit and stay lit during a power failure.",
      "The circuit does not require a battery backup system.",
      "The lamps are wired in series so that if one fails, they all turn off."
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lighting only operates when the standard lighting circuit power fails. Maintained lighting stays on at all times."
  },
  {
    "id": 4050,
    "question": "An electrician needs to install a circuit for a 10kW electric boiler. Which circuit type and protective device would be most appropriate?",
    "options": [
      "A dedicated radial circuit with a 45A or 50A MCB.",
      "A 32A ring final circuit sharing sockets for convenience.",
      "A series circuit connected to the lighting loop.",
      "A low-voltage control circuit without a protective device."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "radial",
      "calculation"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A 10kW load draws approx 43.5A (10000/230). High-power fixed appliances require dedicated radial circuits to prevent overloading and ensure reliable operation."
  },
  {
    "id": 4051,
    "question": "In a standard UK ring final circuit, what is the primary functional reason for connecting the line and neutral conductors in a continuous loop back to the source?",
    "options": [
      "To allow current to flow in two directions, effectively increasing the current-carrying capacity of the cable",
      "To ensure that if one socket outlet develops a fault, all other sockets in the loop are automatically disconnected",
      "To reduce the total circuit resistance to zero by creating a parallel path for every individual load",
      "To allow the circuit to operate at a higher frequency than a standard radial circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "RECIPROCAL_ERROR",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit splits the load current between two paths, allowing the use of smaller cables (typically 2.5mm²) to supply a 32A protective device."
  },
  {
    "id": 4052,
    "question": "An electrician is installing a heating circuit consisting of three identical 60 Ω heating elements connected in parallel. What is the total resistance of this specific part of the circuit?",
    "options": [
      "20 Ω",
      "180 Ω",
      "60 Ω",
      "0.05 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For identical resistors in parallel, the total resistance is the value of one resistor divided by the number of resistors (60 / 3 = 20 Ω)."
  },
  {
    "id": 4053,
    "question": "A radial lighting circuit supplies four floodlights, each rated at 500W. If the nominal supply voltage is 230V, what is the total current drawn by the circuit?",
    "options": [
      "8.70 A",
      "2.17 A",
      "115.0 A",
      "0.11 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 4 * 500W = 2000W. Using I = P/V, 2000 / 230 = 8.695A, rounded to 8.70A."
  },
  {
    "id": 4054,
    "question": "When installing an emergency lighting system, why must the maintained luminaires be connected to the same local lighting sub-circuit they are intended to protect?",
    "options": [
      "To ensure the emergency lights activate automatically if the local lighting circuit power fails",
      "To allow the emergency lights to be dimmed using the same switch as the main lighting",
      "To reduce the voltage drop by sharing the neutral conductor with the standard lighting",
      "To convert the AC supply of the main circuit into DC for the emergency battery"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "explanation",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Emergency lighting must monitor the local supply; if the local circuit fails (even if the building main supply is healthy), the emergency lights must trigger."
  },
  {
    "id": 4055,
    "question": "A 230V radial power circuit has a total conductor resistance of 0.8 Ω. If a load connected at the furthest point draws 15A, what is the actual voltage available at the load terminals?",
    "options": [
      "218 V",
      "12 V",
      "242 V",
      "18.75 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "SIGN_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "voltage-rule",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First calculate voltage drop: V = I * R = 15 * 0.8 = 12V. Then subtract from supply: 230V - 12V = 218V."
  },
  {
    "id": 4056,
    "question": "An electrician is testing a ring final circuit. The end-to-end resistance (r1) of the phase conductor is measured as 0.64 Ω. What is the expected resistance reading (R1) between the phase conductor at the consumer unit and the phase conductor at the furthest point of the ring?",
    "options": [
      "0.16 Ω",
      "0.32 Ω",
      "0.64 Ω",
      "1.28 Ω"
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
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a healthy ring final circuit, the resistance at the midpoint (furthest point) is (r1 + r2) / 4. For just the phase conductor (R1), it is the end-to-end resistance (r1) divided by 4 because the two halves of the ring act as two resistors in parallel. 0.64 / 4 = 0.16 Ω."
  },
  {
    "id": 4057,
    "question": "When designing an installation where high-speed data cables and 230 V power cables must share the same containment, what is the primary technical reason for maintaining physical separation or using screened cables?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power circuit affecting data integrity",
      "To ensure the data cables do not overheat the power cables due to mutual induction",
      "To allow for the higher voltage drop typically found in data/communication circuits",
      "To prevent the data circuit from drawing excess current from the power circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Power cables generate electromagnetic fields that can induce noise in data cables (EMI). Separation or screening is required to protect the low-voltage signals in data circuits from corruption."
  },
  {
    "id": 4058,
    "question": "A 230 V radial circuit supplies three electric heaters with ratings of 2.5 kW, 1.2 kW, and 800 W. If all heaters are operating simultaneously, what is the total current drawn from the supply?",
    "options": [
      "19.57 A",
      "10.87 A",
      "4.50 A",
      "23.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "UNITS_MISSING",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power (P) = 2500 + 1200 + 800 = 4500 W. Current (I) = P / V. I = 4500 / 230 = 19.565... A, rounded to 19.57 A."
  },
  {
    "id": 4059,
    "question": "A large commercial kitchen requires a circuit to feed a series of heavy-duty 32 A industrial socket-outlets. Which circuit topology is most appropriate for this specific application according to standard UK practice?",
    "options": [
      "A series of radial circuits, each protected by its own circuit breaker",
      "A single 32 A ring final circuit serving all outlets",
      "A single radial circuit with all outlets connected in series",
      "A high-frequency AC control circuit with a shared neutral"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Standard ring final circuits are rated at 32 A but are intended for domestic/light commercial use with 13 A sockets. For 32 A industrial sockets, individual radial circuits are required to ensure the circuit protective device can adequately protect the cable and load of each heavy-duty outlet."
  },
  {
    "id": 4060,
    "question": "Three identical heating elements, each with a resistance of 120 Ω, are connected in parallel within a single industrial heater unit. What is the total resistance of the heating circuit?",
    "options": [
      "40 Ω",
      "360 Ω",
      "120 Ω",
      "0.025 Ω"
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
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "For parallel resistors of equal value: Rt = R / n. Rt = 120 / 3 = 40 Ω. Alternatively, 1/Rt = 1/120 + 1/120 + 1/120 = 3/120. Rt = 120 / 3 = 40 Ω."
  },
  {
    "id": 4061,
    "question": "In an emergency lighting installation, a 'maintained' luminaire differs from a 'non-maintained' luminaire because it:",
    "options": [
      "Operates at all times from the normal supply and switches to battery backup during a failure",
      "Only illuminates when the local lighting circuit power supply fails",
      "Is connected in series with the fire alarm control panel to trigger upon smoke detection",
      "Requires a manual reset after every power outage to recharge the internal battery"
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
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Maintained luminaires are designed to be lit at all times (using the mains supply normally) and continue to be lit (using battery power) if the mains fail. Non-maintained only light up when the power fails."
  },
  {
    "id": 4062,
    "question": "A 25-metre radial circuit is wired in cable with a voltage drop constant of 11 mV/A/m. If the circuit carries a design current of 20 A, what is the total voltage drop at the furthest point?",
    "options": [
      "5.50 V",
      "2.75 V",
      "11.00 V",
      "0.22 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Voltage drop = (mV/A/m x Ib x L) / 1000. Vd = (11 x 20 x 25) / 1000 = 5500 / 1000 = 5.5 V."
  },
  {
    "id": 4063,
    "question": "Why are control circuits for industrial machinery often designed to operate at Extra Low Voltage (ELV), such as 24 V DC, rather than 230 V AC?",
    "options": [
      "To increase safety for operators and simplify the integration of electronic sensors",
      "Because DC current travels faster than AC current in control applications",
      "To eliminate the need for overcurrent protection in the control wiring",
      "Because ELV circuits do not require a neutral conductor for a complete path"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
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
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "ELV (24V) is used in control circuits primarily for safety (reduced shock risk) and because most modern control components (PLCs, sensors) operate on low voltage DC."
  },
  {
    "id": 4064,
    "question": "If a ring final circuit is correctly installed, how does the current behave when a single 13 A load is plugged into a socket-outlet located exactly halfway around the ring?",
    "options": [
      "The current splits equally, with 6.5 A flowing through each leg of the ring",
      "The full 13 A flows through the shortest leg to reach the load",
      "The current alternates between legs to prevent the conductors from overheating",
      "The current increases to 26 A due to the parallel paths available"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "current-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, there are two parallel paths to every socket. If the load is at the midpoint and the conductors are of equal length and cross-section, the current will split equally between the two paths."
  },
  {
    "id": 4065,
    "question": "A ring final circuit has an end-to-end phase conductor resistance (r1) of 0.8 Ω. If a break occurs in the phase conductor at the exact midpoint of the ring, what will be the resistance measured between the phase conductor at the consumer unit and a socket-outlet located at that midpoint?",
    "options": [
      "0.4 Ω",
      "0.2 Ω",
      "0.8 Ω",
      "1.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "USED_SERIES_RULE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "mixed-circuit"
    ],
    "learningOutcomeId": "203-3A30-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Normally, the resistance at the midpoint would be r1 / 4 (0.8 / 4 = 0.2 Ω). However, with a break at the midpoint, the parallel path is lost. The socket is now at the end of a radial leg that is half the total length of the original ring. Therefore, the resistance is half of the end-to-end resistance: 0.8 / 2 = 0.4 Ω."
  }
];
