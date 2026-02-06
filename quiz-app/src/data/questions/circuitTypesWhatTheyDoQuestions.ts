import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A6 learning outcomes
 * Generated: 2026-02-06
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
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
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
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
    "id": 4017,
    "question": "Which of the following describes a key characteristic of a ring final circuit used for power sockets?",
    "options": [
      "The circuit cable starts and finishes at the same point in the consumer unit",
      "The circuit consists of a single run of cable ending at the last socket",
      "All sockets are connected in series with each other",
      "Current only flows in one direction around the loop"
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
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is a specific UK topology where the wiring forms a continuous loop back to the source (the consumer unit)."
  },
  {
    "id": 4018,
    "question": "If two identical lamps are connected in parallel across a 230 V supply, what is the voltage across each lamp?",
    "options": [
      "230 V",
      "115 V",
      "460 V",
      "0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is the same as the supply voltage."
  },
  {
    "id": 4019,
    "question": "A radial circuit serves three heaters. If the heaters draw 4 A, 6 A, and 10 A respectively, what is the total current drawn from the supply?",
    "options": [
      "20 A",
      "4 A",
      "10 A",
      "240 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Radial power circuits connect loads in parallel; therefore, the total current is the sum of the individual currents (It = I1 + I2 + I3)."
  },
  {
    "id": 4020,
    "question": "Which type of circuit is primarily used for domestic lighting installations in the UK?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Data circuit"
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
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Domestic lighting is almost exclusively wired using radial circuits, typically using 1.0mm² or 1.5mm² cable."
  },
  {
    "id": 4021,
    "question": "A series circuit has a total current of 2 A flowing through it. If a third resistor is added in series, what happens to the current (assuming voltage remains constant)?",
    "options": [
      "It decreases",
      "It increases",
      "It stays the same",
      "It doubles"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "ohms-law",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Adding a resistor in series increases the total resistance, which decreases the current according to Ohm's Law (I = V/R)."
  },
  {
    "id": 4022,
    "question": "What is the total resistance of two 100 Ω resistors connected in parallel?",
    "options": [
      "50 Ω",
      "200 Ω",
      "100 Ω",
      "10,000 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n)."
  },
  {
    "id": 4023,
    "question": "In a control circuit, what is the typical purpose of a relay or contactor?",
    "options": [
      "To use a low-power signal to switch a high-power load",
      "To convert AC voltage to DC voltage",
      "To increase the resistance of the main circuit",
      "To provide data storage for the system"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits use relays or contactors to safely allow a small control current (like a push button) to operate a much larger load current (like a motor)."
  },
  {
    "id": 4024,
    "question": "A heating circuit operates at 230 V and has a resistance of 23 Ω. Calculate the current flowing in the circuit.",
    "options": [
      "10 A",
      "5290 A",
      "0.1 A",
      "253 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using Ohm's Law: I = V / R. Therefore, I = 230 / 23 = 10 A."
  },
  {
    "id": 4025,
    "question": "Which type of wiring is most likely to be found in a modern data and communications installation?",
    "options": [
      "Cat 6 Unshielded Twisted Pair (UTP)",
      "Steel Wire Armoured (SWA) cable",
      "Twin and Earth (T&E) cable",
      "Single core PVC conduit wire"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Data and communication circuits require high-speed signal integrity, typically provided by twisted pair cables like Cat 6."
  },
  {
    "id": 4026,
    "question": "Which characteristic uniquely identifies a ring final circuit in a domestic power installation?",
    "options": [
      "The circuit conductors return to the same protective device they started from",
      "The circuit ends at the furthest point of the installation",
      "The circuit is used exclusively for high-power immersion heaters",
      "Current can only flow in one direction through the circuit"
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
      "topology",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is defined by its topology where the line, neutral, and earth conductors form a continuous loop starting and ending at the same point in the consumer unit."
  },
  {
    "id": 4027,
    "question": "A series-connected control circuit has two components with resistances of 40 Ω and 60 Ω. What is the total resistance of the circuit?",
    "options": [
      "100 Ω",
      "24 Ω",
      "2400 Ω",
      "20 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Resistance Calculation",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2). Therefore, 40 + 60 = 100 Ω."
  },
  {
    "id": 4028,
    "question": "In a parallel radial circuit supplying three heaters, if the supply voltage is 230 V, what is the voltage across each heater?",
    "options": [
      "230 V",
      "76.7 V",
      "690 V",
      "115 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Voltage Calculation",
    "tags": [
      "parallel",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4029,
    "question": "Which type of circuit is primarily used for transmitting signals between computers and networking equipment?",
    "options": [
      "Data and communications circuit",
      "Control circuit",
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
      "terminology",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Data and communications circuits are designed specifically for low-voltage signal transmission rather than power delivery."
  },
  {
    "id": 4030,
    "question": "A series lighting circuit has a total resistance of 80 Ω. If an additional lamp with a resistance of 40 Ω is added in series, what is the new total resistance?",
    "options": [
      "120 Ω",
      "26.6 Ω",
      "40 Ω",
      "3200 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Behavior",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Adding resistance in series always increases the total resistance of the circuit (80 + 40 = 120 Ω)."
  },
  {
    "id": 4031,
    "question": "A series lighting circuit contains three lamps with resistances of 120 Ω, 150 Ω, and 230 Ω. What is the total resistance of this circuit?",
    "options": [
      "500 Ω",
      "51.1 Ω",
      "4,140,000 Ω",
      "110 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances: 120 + 150 + 230 = 500 Ω."
  },
  {
    "id": 4032,
    "question": "In a domestic parallel power circuit, if one 2 kW heater is switched off while another 2 kW heater remains on, what happens to the voltage across the remaining heater?",
    "options": [
      "It remains the same",
      "It doubles",
      "It halves",
      "It drops to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch remains constant and equal to the supply voltage, regardless of other loads being switched on or off."
  },
  {
    "id": 4033,
    "question": "A radial circuit supplies two 46 Ω heating elements connected in parallel to a 230 V supply. Calculate the total current drawn from the supply.",
    "options": [
      "10 A",
      "2.5 A",
      "5 A",
      "20 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, find total resistance in parallel: 1/Rt = 1/46 + 1/46 = 2/46, so Rt = 23 Ω. Then use Ohm's law: I = V / R = 230 / 23 = 10 A."
  },
  {
    "id": 4034,
    "question": "Which of the following is a primary advantage of using a ring final circuit instead of a radial circuit for socket outlets in a large room?",
    "options": [
      "It allows for a smaller conductor cross-sectional area to carry the same total load",
      "It reduces the total voltage drop to zero at the furthest point",
      "It uses significantly less total cable length",
      "It eliminates the need for an Earth CPC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Because current can travel in two directions around the ring, the load is shared, allowing for 2.5mm² cables to be protected by a 30A or 32A device."
  },
  {
    "id": 4035,
    "question": "A control circuit for a heavy-duty contactor often operates at 24 V AC. Why is this preferred over using the 230 V mains supply directly for the control switch?",
    "options": [
      "To increase safety for the operator at the control interface",
      "To increase the speed of the contactor operation",
      "To reduce the total power consumption of the motor",
      "Because 24 V travels faster than 230 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Extra Low Voltage (ELV) like 24 V for control circuits significantly reduces the risk of electric shock for operators using the switches."
  },
  {
    "id": 4036,
    "question": "A series circuit is connected to a 240 V supply and consists of two resistors: R1 = 40 Ω and R2 = 80 Ω. What is the voltage drop across R2?",
    "options": [
      "160 V",
      "80 V",
      "120 V",
      "240 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "ROUNDING_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total R = 120 Ω. Total I = 240 / 120 = 2 A. Voltage across R2 = I * R2 = 2 * 80 = 160 V."
  },
  {
    "id": 4037,
    "question": "An electrician is installing a non-maintained emergency lighting circuit. What is the primary characteristic of this circuit type?",
    "options": [
      "The lamps only illuminate when the local mains supply fails",
      "The lamps are connected in series to the main lighting switch",
      "The lamps stay on at all times, 24 hours a day",
      "The circuit uses data cables to communicate with the fire alarm"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "USED_SERIES_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lights only operate when the normal power supply to the lighting circuit fails."
  },
  {
    "id": 4038,
    "question": "A 230 V parallel circuit feeds a 1.2 kW kettle and a 2.3 kW oven. What is the total current drawn when both are operating?",
    "options": [
      "15.2 A",
      "5.2 A",
      "10 A",
      "35 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 1.2kW + 2.3kW = 3.5kW (3500W). I = P / V = 3500 / 230 = 15.21 A."
  },
  {
    "id": 4039,
    "question": "When comparing a data/communication circuit to a power circuit, which of the following is true?",
    "options": [
      "Data circuits typically operate at much lower voltages and currents",
      "Data circuits must be wired in a ring final configuration",
      "Data circuits use thicker conductors to prevent signal loss",
      "Data circuits are always connected in series with the mains supply"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Data and communication circuits operate at very low voltages (ELV) and carry minimal current compared to power or heating circuits."
  },
  {
    "id": 4040,
    "question": "A parallel circuit has two branches. Branch A has a resistance of 10 Ω and Branch B has a resistance of 40 Ω. If the total current is 5 A, what is the current flowing through Branch A?",
    "options": [
      "4 A",
      "1 A",
      "2.5 A",
      "5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "RECIPROCAL_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First find Rt: (10*40)/(10+40) = 400/50 = 8 Ω. Total V = I * R = 5 * 8 = 40 V. Current in Branch A = V / Ra = 40 / 10 = 4 A."
  },
  {
    "id": 4041,
    "question": "A radial heating circuit contains three identical 46Ω heating elements connected in parallel. Calculate the total resistance of the load.",
    "options": [
      "15.33Ω",
      "138Ω",
      "46Ω",
      "0.065Ω"
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
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a parallel circuit, total resistance (Rt) is calculated using 1/Rt = 1/R1 + 1/R2 + 1/R3. For identical resistors, Rt = R/n. So, 46 / 3 = 15.33Ω."
  },
  {
    "id": 4042,
    "question": "Why is a ring final circuit topology specifically used for power socket outlets in UK domestic installations?",
    "options": [
      "It allows the current to split into two paths, permitting the use of smaller cables for a 32A load",
      "It ensures that if one socket fails, the rest of the sockets on the ring remain operational",
      "It reduces the total voltage drop to zero at the furthest point of the circuit",
      "It is the only circuit type that allows for the installation of RCD protection"
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
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The ring final circuit allows current to flow in two directions from the consumer unit. This sharing of the load allows 2.5mm² cables to safely carry a 32A total circuit load."
  },
  {
    "id": 4043,
    "question": "An electrician is wiring a 2-way lighting system using the 'three-plate' method. How many live conductors (excluding the CPC) must be run between the two 2-way switches to allow independent control?",
    "options": [
      "3",
      "2",
      "1",
      "4"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "UNITS_MISSING",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "lighting"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Standard 2-way switching requires three conductors between switches: typically two strappers (L1 and L2) and a common return (or a permanent live depending on the wiring method)."
  },
  {
    "id": 4044,
    "question": "Two 115V site lamps are accidentally connected in series across a 230V supply. Lamp A has a resistance of 80Ω and Lamp B has a resistance of 120Ω. Calculate the voltage drop across Lamp B.",
    "options": [
      "138V",
      "115V",
      "92V",
      "230V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total R = 80 + 120 = 200Ω. Total I = V/R = 230 / 200 = 1.15A. Voltage across Lamp B = I * Rb = 1.15 * 120 = 138V."
  },
  {
    "id": 4045,
    "question": "Which type of circuit is specifically designed to operate at Extra Low Voltage (ELV) to prevent interference with power cables and ensure user safety during data transmission?",
    "options": [
      "Data and communication circuits",
      "Immersion heater radial circuits",
      "Ring final power circuits",
      "Emergency lighting circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Data and communication circuits (like Ethernet or telephone lines) operate at ELV to ensure safety and minimize electromagnetic interference with high-voltage power systems."
  },
  {
    "id": 4046,
    "question": "A 230V radial circuit supplies three parallel-connected heaters: 1.5kW, 2kW, and 500W. Calculate the total current drawn from the supply when all heaters are switched on.",
    "options": [
      "17.39A",
      "4.00A",
      "92.00A",
      "8.69A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 1500 + 2000 + 500 = 4000W. Current I = P / V = 4000 / 230 = 17.39A."
  },
  {
    "id": 4047,
    "question": "In a motor control circuit, what is the function of a 'Normally Closed' (NC) contact on a stop button?",
    "options": [
      "To maintain a complete circuit until the button is pressed to break the flow of current",
      "To prevent the motor from starting until the button is pressed to complete the circuit",
      "To provide a path for the earth fault current during a short circuit",
      "To step down the voltage from 230V to a safer 24V control level"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
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
    "explanation": "A Normally Closed (NC) contact allows current to flow in its resting state. Pressing the stop button opens the contact, breaking the circuit and stopping the motor."
  },
  {
    "id": 4048,
    "question": "A 32A ring final circuit has a load of 18A connected at a point where the resistance of one leg of the ring is 0.2Ω and the other leg is 0.4Ω. How much current flows through the 0.2Ω leg?",
    "options": [
      "12A",
      "6A",
      "9A",
      "18A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "current-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Current divides inversely to resistance. The ratio of resistance is 1:2, so current divides 2:1. The 0.2Ω leg (half the resistance) takes two-thirds of the current: (2/3) * 18A = 12A."
  },
  {
    "id": 4049,
    "question": "Which of the following describes a 'non-maintained' emergency lighting circuit?",
    "options": [
      "The luminaires only illuminate when the local mains power supply fails",
      "The luminaires are on at all times, powered by the mains or battery",
      "The circuit is only used for external security lighting after dark",
      "The circuit requires manual activation by a fire warden during an evacuation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "APPLICATION_ERROR",
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lighting stays off while the mains supply is healthy. It only switches on using its internal battery when it detects a failure of the normal lighting supply."
  },
  {
    "id": 4050,
    "question": "A radial circuit is used to supply a 3kW immersion heater. If the supply voltage is 230V, what is the minimum current rating required for the protective device (MCB)?",
    "options": [
      "16A",
      "13A",
      "10A",
      "32A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "CONFUSED_I_V_R",
      "3": "APPLICATION_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "application",
      "power"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "I = P / V = 3000 / 230 = 13.04A. The next standard size protective device above the load current is 16A."
  },
  {
    "id": 4051,
    "question": "An electrician is testing a ring final circuit and measures the end-to-end resistance of the line conductor (r1) as 0.80 Ω. What should the expected R1 resistance be at the furthest point of the ring?",
    "options": [
      "0.20 Ω",
      "0.40 Ω",
      "1.60 Ω",
      "0.80 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1) is calculated as (r1 / 4) because the current has two paths in parallel, each being half the total length of the ring. 0.80 / 4 = 0.20 Ω."
  },
  {
    "id": 4052,
    "question": "Which statement best describes the primary reason for using a radial topology for domestic lighting circuits rather than a ring final topology?",
    "options": [
      "Lighting loads have relatively low current demands, making the high capacity of a ring unnecessary.",
      "Radial circuits ensure that if one lamp fails, the rest of the circuit remains operational.",
      "Ring circuits are strictly prohibited for use with any AC lighting systems due to induction.",
      "Radial circuits allow for a higher total voltage drop across the entire installation."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "VOLTAGE_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Radial circuits are used for lighting because the total load is low (typically 6A or 10A protection), and the complexity/cost of a ring circuit is not justified for these lower current demands."
  },
  {
    "id": 4053,
    "question": "A 230 V radial circuit supplies a fixed 2.3 kW electric heater. If the total resistance of the circuit conductors is 0.15 Ω, what is the voltage drop across the cable when the heater is in use?",
    "options": [
      "1.50 V",
      "34.50 V",
      "0.15 V",
      "2.30 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "UNITS_MISSING",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "First, find current: I = P / V = 2300W / 230V = 10A. Then, find voltage drop: V = I * R = 10A * 0.15 Ω = 1.50 V."
  },
  {
    "id": 4054,
    "question": "When installing data and telecommunications cabling alongside power circuits, why is it standard practice to maintain physical separation or use shielded trunking?",
    "options": [
      "To prevent electromagnetic interference from the AC power cables corrupting data signals.",
      "To ensure the data cables do not draw current from the power circuit via the neutral.",
      "To prevent the data cables from increasing the total resistance of the power circuit.",
      "To allow the data cables to operate at the same frequency as the mains voltage."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "AC power cables generate electromagnetic fields that can induce noise (interference) into data cables, leading to signal loss or corruption. Separation or shielding mitigates this."
  },
  {
    "id": 4055,
    "question": "A 230 V radial power circuit is used to supply a 1.5 kW kettle and a 750 W toaster simultaneously. Calculate the total current drawn from the supply.",
    "options": [
      "9.78 A",
      "3.26 A",
      "5.17 A",
      "2,250 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "power",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Total Power (P) = 1500 W + 750 W = 2250 W. Total Current (I) = P / V = 2250 / 230 = 9.78 A."
  },
  {
    "id": 4056,
    "question": "An electrician is testing a 32A ring final circuit. The end-to-end resistance of the line conductor (r1) is 0.6 ohms and the end-to-end resistance of the protective conductor (r2) is 1.0 ohms. Calculate the theoretical R1+R2 value at the furthest socket.",
    "options": [
      "0.40 ohms",
      "1.60 ohms",
      "0.80 ohms",
      "0.15 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ring-final",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "For a ring final circuit, the R1+R2 value at a socket is calculated as (r1 + r2) / 4. Here, (0.6 + 1.0) / 4 = 1.6 / 4 = 0.40 ohms."
  },
  {
    "id": 4057,
    "question": "In a large commercial installation, data cables (Category 6) are being installed alongside 230V power cables. Why must these cables be segregated by a physical barrier or a minimum distance according to BS 7671?",
    "options": [
      "To prevent electromagnetic interference (EMI) causing data corruption",
      "To ensure the data cables do not overheat due to the power cables",
      "To provide mechanical support for the lighter data cables",
      "To prevent the data cables from increasing the voltage drop of the power circuit"
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
      "data-comms",
      "legislation"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Segregation is primarily required to prevent electromagnetic interference (EMI) or 'crosstalk' from power cables affecting the low-voltage signals in data cables, as well as for safety (Voltage Band segregation)."
  },
  {
    "id": 4058,
    "question": "A specialized heating circuit contains two heating elements connected in parallel. Element A has a resistance of 20 ohms and Element B has a resistance of 30 ohms. If the circuit is supplied at 230V, what is the total current drawn?",
    "options": [
      "19.17 A",
      "4.60 A",
      "11.50 A",
      "25.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "MULTIPLIED_INSTEAD"
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
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First find total resistance (Rt) in parallel: 1/Rt = 1/20 + 1/30 = 0.05 + 0.0333 = 0.0833. Rt = 1 / 0.0833 = 12 ohms. Total current I = V / Rt = 230 / 12 = 19.17 A."
  },
  {
    "id": 4059,
    "question": "In a Direct-On-Line (DOL) motor control circuit, why is the 'Stop' button wired in series with the contactor coil and the 'Start' button?",
    "options": [
      "To ensure that pressing the button breaks the circuit immediately for safety (fail-safe)",
      "To allow the current to divide equally between the buttons",
      "To reduce the voltage drop across the control transformer",
      "To increase the resistance of the control loop to prevent short circuits"
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
      "control-circuits"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Control 'Stop' buttons are Normally Closed (NC) and wired in series so that any break in the wire or pressing the button immediately de-energizes the coil, stopping the motor safely."
  },
  {
    "id": 4060,
    "question": "A 40-metre radial lighting circuit is wired in 1.5mm² copper cable. The cable has a combined R1+R2 resistance of 29 milliohms per metre. If the total load on the circuit is 3A, calculate the voltage drop at the furthest point.",
    "options": [
      "3.48 V",
      "1.16 V",
      "139.20 V",
      "8.70 V"
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
      "units"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total resistance R = (29 mOhms * 40m) / 1000 = 1.16 ohms. Voltage drop V = I * R = 3A * 1.16 ohms = 3.48 V."
  },
  {
    "id": 4061,
    "question": "Which of the following statements correctly describes the behavior of current in a healthy, balanced ring final circuit serving a single 13A load located exactly at the midpoint of the ring?",
    "options": [
      "The current splits equally, with 6.5A flowing through each leg of the ring",
      "The full 13A flows through the shortest leg of the ring only",
      "The current is 13A at the start of the ring and 0A at the end",
      "The current fluctuates between the two legs based on the supply frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "ring-final",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a ring circuit, there are two paths to any load. If the load is at the midpoint and the cable resistance is uniform, the current will split equally between the two paths (Kirchhoff's First Law)."
  },
  {
    "id": 4062,
    "question": "An electrician is installing emergency lighting in a retail unit. The luminaires must remain off during normal operation but switch on automatically if the local lighting circuit fails. What specific type of system is being installed?",
    "options": [
      "Non-maintained emergency lighting",
      "Maintained emergency lighting",
      "Sustained emergency lighting",
      "Combined emergency lighting"
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
      "application",
      "terminology",
      "emergency"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "Non-maintained luminaires only light up when the normal mains power supply to the local lighting circuit fails."
  },
  {
    "id": 4063,
    "question": "A security alarm zone consists of four Normally Closed (N/C) sensors connected in series. Each sensor has a contact resistance of 0.5 ohms. If a fault causes one sensor's resistance to increase to 200 ohms, what will the control panel measure as the total loop resistance?",
    "options": [
      "201.5 ohms",
      "50.0 ohms",
      "0.125 ohms",
      "800.0 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
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
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances. Rt = 0.5 + 0.5 + 0.5 + 200 = 201.5 ohms."
  },
  {
    "id": 4064,
    "question": "When designing a circuit for a heavy industrial motor, why might a 'Radial' circuit be preferred over a 'Ring Final' circuit?",
    "options": [
      "Radials are simpler to isolate and better suited for high-power dedicated loads",
      "Radials allow for a smaller conductor cross-sectional area for the same load",
      "Radials automatically provide better earth loop impedance values",
      "Radials are immune to electromagnetic interference from other circuits"
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
      "radial"
    ],
    "learningOutcomeId": "203-3A6-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Radial circuits are the standard choice for dedicated high-power loads (like motors or cookers) because they are straightforward to design, protect, and isolate compared to rings."
  },
  {
    "id": 4065,
    "question": "A radial power circuit supplies a 3kW electric heater and a 500W extraction fan. Both operate at 230V. Calculate the total design current (Ib) for this circuit, ignoring diversity.",
    "options": [
      "15.22 A",
      "13.04 A",
      "2.17 A",
      "35.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
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
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power P = 3000W + 500W = 3500W. Total Current I = P / V = 3500 / 230 = 15.217 A, which rounds to 15.22 A."
  }
];
