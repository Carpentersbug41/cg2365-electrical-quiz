import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A20 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "In a ring final circuit, how are the socket outlets connected in relation to the consumer unit?",
    "options": [
      "Both ends of the circuit loop back to the same protective device",
      "The circuit ends at the furthest socket outlet from the source",
      "Each socket has its own individual fuse at the consumer unit",
      "All sockets are connected in series with one another"
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
      "topology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is characterized by both ends of the loop returning to the same protective device (MCB/RCBO) in the consumer unit."
  },
  {
    "id": 4017,
    "question": "A lighting circuit has two lamps connected in series, each with a resistance of 100 Ω. What is the total resistance of the circuit?",
    "options": [
      "200 Ω",
      "50 Ω",
      "100 Ω",
      "10,000 Ω"
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
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of individual resistances: Rt = R1 + R2 (100 + 100 = 200 Ω)."
  },
  {
    "id": 4018,
    "question": "Which of the following is the most likely protective device rating for a standard domestic lighting circuit in the UK?",
    "options": [
      "6 A",
      "32 A",
      "13 A",
      "40 A"
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
      "discrimination",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Standard domestic lighting circuits are typically protected by a 6 A circuit breaker due to the lower current demands of lighting loads."
  },
  {
    "id": 4019,
    "question": "A 230 V heating element has a resistance of 46 Ω. What is the current flowing through it?",
    "options": [
      "5 A",
      "10,580 A",
      "0.2 A",
      "184 A"
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
      "ohms-law",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), 230 V / 46 Ω = 5 A."
  },
  {
    "id": 4020,
    "question": "Which circuit type is specifically designed to provide illumination if the normal mains supply fails?",
    "options": [
      "Emergency lighting circuit",
      "Control circuit",
      "Data/comms circuit",
      "Radial power circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Emergency lighting circuits are dedicated systems that activate during a power failure to ensure safe egress from a building."
  },
  {
    "id": 4021,
    "question": "Two identical 10 Ω resistors are connected in parallel. What is the total resistance of this arrangement?",
    "options": [
      "5 Ω",
      "20 Ω",
      "100 Ω",
      "1 Ω"
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
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (10 / 2 = 5 Ω)."
  },
  {
    "id": 4022,
    "question": "A circuit that starts at the consumer unit and terminates at the last point of use without looping back is known as a:",
    "options": [
      "Radial circuit",
      "Ring final circuit",
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
    "category": "Circuit Types: What They Do",
    "tags": [
      "topology",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit runs from the consumer unit to the various points of use and ends at the final point."
  },
  {
    "id": 4023,
    "question": "An appliance connected to a 230 V supply draws a current of 10 A. What is the power consumed by the appliance?",
    "options": [
      "2300 W",
      "23 W",
      "240 W",
      "0.043 W"
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
      "units"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Power is calculated by multiplying voltage by current (P = V x I), so 230 V x 10 A = 2300 W."
  },
  {
    "id": 4024,
    "question": "Which type of circuit is typically used to manage the operation of another circuit, such as a thermostat controlling a boiler?",
    "options": [
      "Control circuit",
      "Ring final circuit",
      "Data circuit",
      "Radial power circuit"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits are used to regulate the behavior of other equipment, often using lower voltages or currents to switch larger loads."
  },
  {
    "id": 4025,
    "question": "A circuit has a total resistance of 20 Ω and a current of 2 A. What is the supply voltage?",
    "options": [
      "40 V",
      "10 V",
      "0.1 V",
      "22 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Voltage is calculated by multiplying current by resistance (V = I x R), so 2 A x 20 Ω = 40 V."
  },
  {
    "id": 4026,
    "question": "Which of the following describes the main characteristic of a domestic ring final circuit?",
    "options": [
      "The circuit conductors start and finish at the same point in the consumer unit",
      "The circuit conductors end at the furthest point of utilization",
      "All loads are connected in a single series string",
      "The circuit is only used for high-power industrial motors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
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
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is defined by the fact that the line, neutral, and CPC conductors form a continuous loop, starting and ending at the consumer unit."
  },
  {
    "id": 4027,
    "question": "An electrician connects two resistors, one of 15 Ω and one of 25 Ω, in a series circuit. What is the total resistance of this circuit?",
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances: 15 + 25 = 40 Ω."
  },
  {
    "id": 4028,
    "question": "A parallel circuit has two branches. Branch A draws 4 A and Branch B draws 6 A. What is the total current supplied to the circuit?",
    "options": [
      "10 A",
      "24 A",
      "2 A",
      "2.4 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "SIGN_ERROR",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "According to Kirchhoff's Current Law, the total current entering a parallel circuit is the sum of the currents in the individual branches."
  },
  {
    "id": 4029,
    "question": "What is the standard circuit topology used for a typical domestic lighting installation in the UK?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Data loop circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Domestic lighting is typically wired as a radial circuit, where the cable runs from the consumer unit to the first point and then sequentially to the others, ending at the last point."
  },
  {
    "id": 4030,
    "question": "In a parallel circuit containing three identical lamps, how does the voltage across each lamp compare to the supply voltage?",
    "options": [
      "The voltage across each lamp is the same as the supply voltage",
      "The supply voltage is divided equally between the three lamps",
      "The voltage across each lamp is triple the supply voltage",
      "The voltage decreases as more lamps are added"
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
      "conceptual"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across every branch is equal to the supply voltage."
  },
  {
    "id": 4031,
    "question": "An electrician is installing three heating elements in series, with resistances of 15 Ω, 25 Ω, and 40 Ω. What is the total resistance of the circuit?",
    "options": [
      "80 Ω",
      "6.9 Ω",
      "15,000 Ω",
      "0 Ω"
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
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3)."
  },
  {
    "id": 4032,
    "question": "In a standard UK ring final circuit, how is the current distributed from the consumer unit to the connected socket outlets?",
    "options": [
      "It flows through two parallel paths to reach the loads",
      "It flows through a single cable path that terminates at the last socket",
      "It flows in a series loop where each socket shares the total voltage",
      "It only flows in one direction and returns via a separate dedicated earth loop"
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
      "parallel",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "A ring final circuit starts and ends at the same point in the consumer unit, effectively creating two parallel paths for the current to reach the outlets."
  },
  {
    "id": 4033,
    "question": "A lighting circuit contains two identical lamps connected in parallel, each with a resistance of 460 Ω. What is the total resistance of this part of the circuit?",
    "options": [
      "230 Ω",
      "920 Ω",
      "211,600 Ω",
      "0.004 Ω"
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
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R/n)."
  },
  {
    "id": 4034,
    "question": "Which circuit type is most appropriate for the installation of a 9.5 kW electric shower in a domestic property?",
    "options": [
      "A dedicated radial circuit",
      "A ring final circuit",
      "A series control circuit",
      "A multi-phase power circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power fixed appliances like electric showers require a dedicated radial circuit to handle the high current demand safely."
  },
  {
    "id": 4035,
    "question": "A parallel circuit has two branches. Branch A draws 6 A and Branch B draws 9 A. What is the total current supplied by the source?",
    "options": [
      "15 A",
      "3 A",
      "54 A",
      "3.6 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (It = I1 + I2)."
  },
  {
    "id": 4036,
    "question": "Why is it standard practice to maintain physical separation between data/communication cables and power cables in an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) affecting data signals",
      "To prevent the data cables from overheating the power cables",
      "To ensure the data cables do not increase the total circuit resistance",
      "To allow for easier identification during periodic inspection"
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
      "explanation",
      "terminology"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Power cables create electromagnetic fields that can induce noise and interference (EMI) into sensitive data and communication cables if they are too close."
  },
  {
    "id": 4037,
    "question": "A 230 V radial circuit supplies a single 2.99 kW electric heater. What is the approximate current flowing in the circuit?",
    "options": [
      "13 A",
      "687 A",
      "0.07 A",
      "23 A"
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
      "ohms-law",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the formula I = P / V: 2990W / 230V = 13A."
  },
  {
    "id": 4038,
    "question": "What is the primary characteristic of a 'maintained' emergency lighting circuit?",
    "options": [
      "The lamps are energized at all times during normal and emergency use",
      "The lamps only illuminate when the main power supply fails",
      "The circuit uses a central battery system instead of individual batteries",
      "The circuit is only used for fire alarm signaling"
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
      "application",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Maintained emergency lighting is designed to operate continuously under normal conditions and continue to operate via battery backup if the mains fail."
  },
  {
    "id": 4039,
    "question": "In a series circuit containing four identical resistors connected to a 240 V supply, what is the voltage drop across a single resistor?",
    "options": [
      "60 V",
      "240 V",
      "960 V",
      "120 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit with identical components, the supply voltage is divided equally among them (Vt / n)."
  },
  {
    "id": 4040,
    "question": "What is a significant advantage of using a ring final circuit topology compared to a radial circuit for providing power to a large number of socket outlets?",
    "options": [
      "It allows for a smaller cable cross-sectional area for the same load",
      "It makes the detection of broken conductors much easier during testing",
      "It ensures that the voltage remains higher at the end of the circuit",
      "It eliminates the need for a circuit protective conductor (CPC)"
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
      "application"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Because the current has two paths to follow in a ring, the cable can be smaller (e.g., 2.5mm²) than would be required for a radial circuit of the same 32A rating."
  },
  {
    "id": 4041,
    "question": "A series lighting circuit is designed using three lamps, each with a resistance of 80 ohms. What is the total resistance of the circuit?",
    "options": [
      "240 ohms",
      "26.67 ohms",
      "80 ohms",
      "19200 ohms"
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3). Therefore, 80 + 80 + 80 = 240 ohms."
  },
  {
    "id": 4042,
    "question": "What is the primary technical reason for using a ring final circuit instead of a radial circuit for domestic power socket outlets?",
    "options": [
      "It allows for smaller conductor sizes by providing two paths for current",
      "It significantly reduces the total amount of cable required for the installation",
      "It simplifies the process of fault finding and isolation",
      "It ensures that the voltage at every socket is exactly 230V regardless of load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "power",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A ring final circuit splits the load current between two paths back to the consumer unit, allowing 2.5mm² cable to be protected by a 32A device, which wouldn't be possible in a standard radial configuration."
  },
  {
    "id": 4043,
    "question": "A 24V DC control circuit contains two identical relay coils connected in series. If the total circuit resistance is 120 ohms, what is the voltage drop across a single relay coil?",
    "options": [
      "12V",
      "24V",
      "60V",
      "0.2V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit with two identical components, the supply voltage is shared equally. 24V / 2 = 12V."
  },
  {
    "id": 4044,
    "question": "When installing data and communication cabling near power circuits, why is it necessary to maintain a minimum separation distance or use screening?",
    "options": [
      "To prevent electromagnetic interference from power cables affecting data signals",
      "To stop the data cables from overheating due to the power cables",
      "Because data cables operate at much higher frequencies and may melt power insulation",
      "To ensure the data circuit can use the power circuit as a backup earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Data cables carry low-voltage signals that are highly susceptible to electromagnetic interference (EMI) generated by the magnetic fields around current-carrying power conductors."
  },
  {
    "id": 4045,
    "question": "A heating circuit consists of two 12-ampere immersion heaters connected in parallel. What is the total current drawn from the supply when both are switched on?",
    "options": [
      "24A",
      "6A",
      "12A",
      "144A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (It = I1 + I2). Therefore, 12A + 12A = 24A."
  },
  {
    "id": 4046,
    "question": "Which statement best describes the operation of a 'non-maintained' emergency lighting circuit?",
    "options": [
      "The lamps only illuminate when the normal mains power supply fails",
      "The lamps are illuminated at all times, whether mains power is present or not",
      "The lamps are powered by a secondary radial circuit from a different consumer unit",
      "The lamps only operate when a manual switch is activated by the user"
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
      "health-safety"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lighting is designed to turn on only when the standard power supply to the local lighting circuit fails."
  },
  {
    "id": 4047,
    "question": "A radial circuit supplies two loads connected in parallel. Load A has a resistance of 60 ohms and Load B has a resistance of 60 ohms. What is the total resistance of the circuit?",
    "options": [
      "30 ohms",
      "120 ohms",
      "60 ohms",
      "0.033 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (Rt = R / n). 60 / 2 = 30 ohms."
  },
  {
    "id": 4048,
    "question": "An electrician is testing a ring final circuit. The end-to-end resistance of the line conductor (r1) is 0.8 ohms and the neutral conductor (rn) is 0.8 ohms. What is the expected (R1+Rn) resistance at each socket?",
    "options": [
      "0.4 ohms",
      "0.8 ohms",
      "1.6 ohms",
      "0.2 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "For a ring final circuit, the reading at the sockets when cross-connected is calculated as (r1 + rn) / 4. Here, (0.8 + 0.8) / 4 = 1.6 / 4 = 0.4 ohms."
  },
  {
    "id": 4049,
    "question": "Which of the following describes the circuit topology where multiple outlets are connected one after another, terminating at the final point of use?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Closed loop circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "power",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A radial circuit starts at the consumer unit and runs to the various points of use, ending at the last outlet. It does not return to the consumer unit."
  },
  {
    "id": 4050,
    "question": "A 12V DC alarm sounder has an internal resistance of 48 ohms. Calculate the power consumed by the sounder when activated.",
    "options": [
      "3W",
      "576W",
      "0.25W",
      "4W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_I_V_R",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "power",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Power can be calculated using P = V² / R. So, (12 * 12) / 48 = 144 / 48 = 3 Watts."
  },
  {
    "id": 4051,
    "question": "A radial power circuit supplies two identical 40 Ω space heaters connected in parallel. What is the total resistance of the load?",
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
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n). Therefore, 40 Ω / 2 = 20 Ω."
  },
  {
    "id": 4052,
    "question": "What is the primary technical advantage of installing a ring final circuit compared to a radial circuit for a domestic socket outlet arrangement?",
    "options": [
      "It allows for a reduction in cable conductor size by providing two paths for current",
      "It increases the supply frequency to ensure appliances run more efficiently",
      "It ensures that if one socket fails, the rest of the circuit is automatically disconnected",
      "It doubles the available supply voltage to 460 V for high-power appliances"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit starts and ends at the consumer unit, meaning current has two paths to reach any point. This allows the use of 2.5mm² cable for a 32A circuit, which would typically require a larger cable in a radial configuration."
  },
  {
    "id": 4053,
    "question": "An electrician is installing a series-connected decorative lighting string consisting of 20 identical lamps. If the total supply voltage is 230 V, what is the approximate voltage drop across each individual lamp?",
    "options": [
      "11.5 V",
      "230 V",
      "4600 V",
      "4.6 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit, the total voltage is shared across the components. For identical loads, V_lamp = V_total / number of lamps. 230 V / 20 = 11.5 V."
  },
  {
    "id": 4054,
    "question": "Which circuit type would be most appropriate for the installation of a 9.5 kW electric shower in a residential property?",
    "options": [
      "A dedicated high-current radial circuit",
      "A standard 32 A ring final circuit",
      "A 6 A series lighting circuit",
      "An extra-low voltage control circuit"
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
      "discrimination",
      "power"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A 9.5 kW shower draws approximately 41 A (9500W / 230V). This exceeds the capacity of a standard 32A ring and requires a dedicated radial circuit with appropriately sized cable (usually 6mm² or 10mm²)."
  },
  {
    "id": 4055,
    "question": "A ring final circuit is delivering a total load of 26 A to a group of appliances located exactly at the mid-point of the ring. Assuming the conductors are of equal length and resistance, what current is flowing through each leg of the ring?",
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
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "current-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a balanced ring final circuit, the total load current splits equally between the two legs of the ring. 26 A / 2 = 13 A per leg."
  },
  {
    "id": 4056,
    "question": "An electrician is testing a 32A ring final circuit. The end-to-end continuity resistance of the line conductor (r1) is measured at 0.64 Ω. What is the expected theoretical resistance (R1) of the line conductor measured at a socket outlet located at the furthest point from the consumer unit?",
    "options": [
      "0.16 Ω",
      "0.32 Ω",
      "0.64 Ω",
      "1.28 Ω"
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
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1) is calculated as r1 / 4 because the current has two parallel paths to the point, and the distance to the point and back is half the total loop length."
  },
  {
    "id": 4057,
    "question": "Why is a ring final circuit topology specifically preferred for general-purpose socket outlet circuits in UK domestic installations compared to a single 20A radial circuit using the same cable size?",
    "options": [
      "It allows for a higher current carrying capacity (32A) by providing two parallel paths for the load current.",
      "It ensures that if one part of the ring is damaged, the entire circuit continues to function as two radials.",
      "It eliminates the risk of electromagnetic interference in nearby data and communication cables.",
      "It reduces the total circuit resistance to zero at the point of utilization."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The primary advantage of a ring final circuit is that it effectively doubles the current carrying capacity of the conductors by providing two paths from the consumer unit to the load, allowing a 32A protective device on 2.5mm² cable."
  },
  {
    "id": 4058,
    "question": "A radial circuit serves three 3kW electric heaters connected in parallel. If the circuit is supplied at 230V and the total resistance of the supply cables (Line and Neutral) is 0.25 Ω, what is the voltage drop across the cable when all three heaters are operating?",
    "options": [
      "9.78 V",
      "3.26 V",
      "39.13 V",
      "2.30 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total Power = 9000W. Total Current (I) = 9000 / 230 = 39.13A. Voltage Drop = I × R = 39.13 × 0.25 = 9.78V."
  },
  {
    "id": 4059,
    "question": "In a commercial installation, a 'Maintained' emergency lighting system is installed. How do the luminaires behave during a total failure of the local lighting sub-circuit supply?",
    "options": [
      "The lamps remain illuminated, switching automatically from the mains supply to the internal battery supply.",
      "The lamps only illuminate once the supply is lost; they are switched off during normal operation.",
      "The lamps extinguish and must be manually reset once the mains power is restored to the circuit.",
      "The lamps dim to 10% brightness to conserve battery life but remain on the mains supply."
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
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Maintained emergency lighting operates at all times (like normal lighting) and stays on during a power failure by switching to its internal battery."
  },
  {
    "id": 4060,
    "question": "A control circuit for a motor starter uses a 24V DC relay. The relay coil has a resistance of 150 Ω. If a 50 Ω resistor is added in series with the coil to modify its operating characteristics, what is the new current flowing through the control circuit?",
    "options": [
      "0.12 A",
      "0.16 A",
      "0.48 A",
      "3.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "series",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Resistance = 150 + 50 = 200 Ω. Current (I) = V / R = 24 / 200 = 0.12 A."
  },
  {
    "id": 4061,
    "question": "When installing data and communication cabling (Category 6) alongside 230V power radials in a shared PVC trunking, what is the primary technical concern regarding circuit interaction?",
    "options": [
      "Electromagnetic interference (EMI) from the power cables inducing noise onto the data signals.",
      "The risk of the data cables overheating due to the thermal insulation of the power cables.",
      "Voltage drop in the data cables increasing due to the magnetic field of the AC power circuit.",
      "The data cables causing a short circuit in the power cables through capacitive coupling."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
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
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Data cables are sensitive to EMI. Separation of services is required to prevent the magnetic fields from power cables corrupting high-frequency data signals."
  },
  {
    "id": 4062,
    "question": "A heating circuit consists of two 1.5kW elements connected in parallel. If one element develops an open-circuit fault, how does the total circuit current and the performance of the remaining element change?",
    "options": [
      "Total current halves; the remaining element's performance remains unchanged.",
      "Total current doubles; the remaining element gets hotter due to increased voltage.",
      "Total current remains the same; the remaining element compensates by drawing more power.",
      "Total current drops to zero; parallel circuits require all loads to be functional."
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
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In a parallel circuit, the voltage across each branch remains the same. If one branch opens, its current stops, halving the total current, but the other branch continues to operate normally at its rated power."
  },
  {
    "id": 4063,
    "question": "A fire alarm circuit uses manual call points wired in parallel with an End-of-Line (EOL) resistor. What is the purpose of the EOL resistor in this specific circuit type?",
    "options": [
      "To allow the control panel to monitor the circuit for open-circuit faults by maintaining a small supervisory current.",
      "To limit the current during an alarm condition to prevent the sounders from burning out.",
      "To convert the AC supply of the building into a stable DC voltage for the sensors.",
      "To provide a discharge path for static electricity built up in the alarm cabling."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "USED_SERIES_RULE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "EOL resistors are used in security and fire circuits to ensure 'circuit integrity'. If the wire is cut (open circuit), the supervisory current stops, and the panel triggers a fault signal."
  },
  {
    "id": 4064,
    "question": "A lighting radial circuit has five luminaires, each drawing 0.2A. The circuit cable has a resistance of 0.8 Ω per 100 metres. If the total cable length to the furthest lamp is 40 metres, what is the voltage drop at that lamp (assuming all lamps are at the end for worst-case calculation)?",
    "options": [
      "0.32 V",
      "0.064 V",
      "0.80 V",
      "1.25 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total Current (I) = 5 × 0.2A = 1.0A. Total Cable Resistance (R) = (0.8 Ω / 100m) × 40m = 0.32 Ω. Voltage Drop = I × R = 1.0 × 0.32 = 0.32V."
  },
  {
    "id": 4065,
    "question": "An electrician measures the loop resistance of a ring final circuit. The line-to-line resistance (r1) is 0.5 Ω and the CPC-to-CPC resistance (r2) is 0.8 Ω. What is the expected R1+R2 value at the sockets when the cross-connections are made for testing?",
    "options": [
      "0.325 Ω",
      "1.30 Ω",
      "0.65 Ω",
      "0.125 Ω"
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
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A20-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "For a ring final circuit, the R1+R2 at the sockets is calculated using the formula (r1 + r2) / 4. Therefore, (0.5 + 0.8) / 4 = 1.3 / 4 = 0.325 Ω."
  }
];
