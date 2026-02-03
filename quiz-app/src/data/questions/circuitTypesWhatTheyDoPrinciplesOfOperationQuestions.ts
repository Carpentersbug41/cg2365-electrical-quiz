import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do (Principles of Operation) Question Bank
 * Aligned with lesson 203-3A learning outcomes
 * Generated: 2026-02-03
 */

export const circuitTypesWhatTheyDoPrinciplesOfOperationQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which statement best describes the basic principle of a ring final circuit arrangement?",
    "options": [
      "The circuit leaves the protective device, supplies the outlets, and returns to the same device",
      "The circuit leaves the protective device and ends at the last outlet point",
      "The circuit supplies only one high-power fixed appliance",
      "The circuit is used exclusively for transmitting data signals between computers"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is characterized by forming a complete loop, starting and ending at the same protective device in the consumer unit."
  },
  {
    "id": 4017,
    "question": "Which circuit type is specifically intended to supply systems that ensure life safety, such as emergency lighting and fire alarms?",
    "options": [
      "Alarm and emergency systems circuits",
      "Data communications circuits",
      "Control circuits",
      "General lighting circuits"
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
      "conceptual"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Alarm and emergency systems are kept separate from general circuits to ensure high reliability for safety-critical equipment."
  },
  {
    "id": 4018,
    "question": "A radial lighting circuit supplies four lamps, each rated at 60W. What is the total power used when all lamps are switched on?",
    "options": [
      "240W",
      "60W",
      "15W",
      "14400W"
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
      "power",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel arrangement (standard for lighting), the total power is the sum of the individual loads: 4 x 60W = 240W."
  },
  {
    "id": 4019,
    "question": "A control circuit has two relays connected in series, each with a resistance of 50 ohms. What is the total resistance of the circuit?",
    "options": [
      "100 ohms",
      "25 ohms",
      "50 ohms",
      "2500 ohms"
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
      "resistance-rule",
      "calculation",
      "series"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For components in series, the total resistance is found by adding the individual resistances together: 50 + 50 = 100 ohms."
  },
  {
    "id": 4020,
    "question": "A heating circuit contains two identical 40 ohm heating elements connected in parallel. What is the total resistance of the circuit?",
    "options": [
      "20 ohms",
      "80 ohms",
      "40 ohms",
      "1600 ohms"
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
      "resistance-rule",
      "calculation",
      "parallel"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "When two identical resistors are in parallel, the total resistance is half of one resistor: 40 / 2 = 20 ohms."
  },
  {
    "id": 4021,
    "question": "A radial circuit supplies a 2300W (2.3kW) appliance. If the supply voltage is 230V, what is the current flowing in the circuit?",
    "options": [
      "10A",
      "0.1A",
      "529A",
      "23A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using the power formula I = P / V, the current is 2300W / 230V = 10A."
  },
  {
    "id": 4022,
    "question": "In a balanced ring final circuit, a total current of 26A is drawn by various loads. What is the current flowing through each leg of the ring at the consumer unit?",
    "options": [
      "13A",
      "26A",
      "52A",
      "6.5A"
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
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a ring final circuit, the current splits into two paths. In a balanced ring, half the total current flows through each leg: 26A / 2 = 13A."
  },
  {
    "id": 4023,
    "question": "Which of the following is the primary purpose of a data communications circuit?",
    "options": [
      "To transmit digital or analogue signals for information exchange",
      "To provide the main power supply for high-current heating loads",
      "To switch 230V lighting circuits on and off",
      "To act as a return path for fault currents to earth"
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
      "conceptual"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Data circuits carry signals (like internet or telephone data) rather than supplying mains power to operate electrical loads."
  },
  {
    "id": 4024,
    "question": "An electrician is installing a dedicated circuit for a 9kW electric shower. Which circuit category does this fall into?",
    "options": [
      "Heating circuit",
      "Control circuit",
      "Data communications circuit",
      "Ring final circuit"
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
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Electric showers are high-power fixed loads that use electrical energy to heat water, placing them in the heating circuit category."
  },
  {
    "id": 4025,
    "question": "A circuit used to carry a signal from a thermostat to trigger a contactor that switches a large motor is known as a:",
    "options": [
      "Control circuit",
      "Power circuit",
      "Final circuit",
      "Ring final circuit"
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
      "application",
      "relays"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits are used to command the operation of equipment rather than providing the main power to the load itself."
  },
  {
    "id": 4026,
    "question": "What is the defining principle of a ring final circuit arrangement?",
    "options": [
      "The circuit leaves the protective device, supplies outlets, and returns to the same device",
      "The circuit leaves the protective device and ends at the final outlet in a line",
      "The circuit is used only for high-voltage data transmission signals",
      "The circuit supplies power only to emergency lighting and fire alarms"
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
      "terminology",
      "conceptual",
      "radial",
      "series"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit forms a continuous loop where the cable starts and ends at the same protective device in the consumer unit."
  },
  {
    "id": 4027,
    "question": "Which circuit type is primarily designed to transmit signals to control equipment rather than providing the main power supply to a load?",
    "options": [
      "Control circuit",
      "Ring final circuit",
      "Heating circuit",
      "Radial power circuit"
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
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits carry signals (like those from a thermostat or motor starter) to command the operation of equipment."
  },
  {
    "id": 4028,
    "question": "A radial circuit supplies a load that draws 15 A from a 230 V supply. What is the total power consumed by this circuit?",
    "options": [
      "3450 W",
      "15.33 W",
      "215 W",
      "6900 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Power is calculated using P = V x I. Therefore, 230 V x 15 A = 3450 W."
  },
  {
    "id": 4029,
    "question": "In a radial power circuit, two identical heaters each with a resistance of 46 Ω are connected in parallel. What is the total resistance of these two loads?",
    "options": [
      "23 Ω",
      "92 Ω",
      "46 Ω",
      "2116 Ω"
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
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (Rt = R / n). 46 / 2 = 23 Ω."
  },
  {
    "id": 4030,
    "question": "An electrician is checking a dedicated radial circuit for a 2.3 kW (2300 W) immersion heater. At a supply voltage of 230 V, how much current will this heater draw?",
    "options": [
      "10 A",
      "0.1 A",
      "529 A",
      "2070 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Current is calculated by rearranging P = V x I to I = P / V. So, 2300 W / 230 V = 10 A."
  },
  {
    "id": 4031,
    "question": "A ring final circuit is a common arrangement for socket outlets in the UK. What is the defining principle of its operation compared to a radial circuit?",
    "options": [
      "The circuit returns to the same protective device it started from",
      "The circuit ends at the furthest socket outlet without returning",
      "The circuit must only supply a maximum of ten socket outlets",
      "The circuit is designed to carry only low-voltage data signals"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "radial",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit forms a loop, meaning the cable starts at the protective device (MCB/RCBO), visits every outlet, and returns to the same device. A radial circuit ends at the last point."
  },
  {
    "id": 4032,
    "question": "An electrician measures the end-to-end resistance of the line conductor (r1) in a ring final circuit and finds it is 0.8 Ω. What is the theoretical resistance (R1) at the furthest point of the ring?",
    "options": [
      "0.2 Ω",
      "0.8 Ω",
      "1.6 Ω",
      "0.4 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance at the midpoint (furthest point) is calculated as (r1 + rn) / 4. For just the line conductor, it is r1 / 4. 0.8 / 4 = 0.2 Ω."
  },
  {
    "id": 4033,
    "question": "In a commercial installation, a 'control circuit' is often used to operate a motor starter. What is the primary principle of operation for this circuit type?",
    "options": [
      "It carries low-power signals to switch the main power to the load",
      "It provides the high-current path directly to the motor windings",
      "It acts as the main earthing conductor for the installation",
      "It is used to convert AC power into DC power for the motor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
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
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are designed to send commands or signals (like start/stop) to switching devices like contactors or relays, which then handle the high-power load circuit."
  },
  {
    "id": 4034,
    "question": "A 230V radial circuit supplies four 460W fixed heaters. What is the total current drawn by the circuit when all heaters are operational?",
    "options": [
      "8 A",
      "2 A",
      "32 A",
      "0.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Total Power = 4 * 460W = 1840W. Current (I) = Power (P) / Voltage (V). 1840 / 230 = 8 A."
  },
  {
    "id": 4035,
    "question": "An electrician is planning the circuits for a small office. They need to install a system for Ethernet connectivity and a system for emergency exit signs. How should these be categorised?",
    "options": [
      "Data communications and alarm/emergency systems",
      "Power circuits and lighting circuits",
      "Control circuits and radial final circuits",
      "Ring final circuits and heating circuits"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Ethernet is a data communication circuit (signals), while emergency exit signs fall under alarm and emergency systems (safety)."
  },
  {
    "id": 4036,
    "question": "A dedicated heating circuit supplies an immersion heater rated at 4.6 kW at 230V. What is the resistance of the heating element?",
    "options": [
      "11.5 Ω",
      "20 Ω",
      "0.05 Ω",
      "50 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Resistance (R) = V² / P. 230² / 4600 = 52900 / 4600 = 11.5 Ω."
  },
  {
    "id": 4037,
    "question": "Why is it important to differentiate data communication circuits from general power circuits during an installation?",
    "options": [
      "Data circuits carry signals and are susceptible to electrical interference",
      "Data circuits carry much higher voltages than power circuits",
      "Data circuits are always wired in a ring to increase speed",
      "Data circuits use the same protective devices as heating circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Data circuits transmit information via low-voltage signals. They are kept separate from power cables to prevent electromagnetic interference (EMI) from disrupting the signals."
  },
  {
    "id": 4038,
    "question": "A radial circuit feeding a workshop has a total cable resistance of 0.25 Ω. If the equipment draws 20 A, what is the voltage drop at the end of the circuit?",
    "options": [
      "5 V",
      "80 V",
      "0.0125 V",
      "20.25 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Voltage Drop (V) = Current (I) × Resistance (R). 20 A × 0.25 Ω = 5 V."
  },
  {
    "id": 4039,
    "question": "Which statement best describes the principle of operation for an alarm and emergency systems circuit?",
    "options": [
      "It is kept separate to ensure reliability and safety during a fault",
      "It is connected to the same ring final as sockets to save cable",
      "It only operates when the main supply is completely disconnected",
      "It uses high-power heating elements to trigger smoke detectors"
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
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Safety systems are usually installed on dedicated circuits so that a fault on a general lighting or power circuit doesn't disable the life-safety equipment."
  },
  {
    "id": 4040,
    "question": "A control circuit has two identical relay coils connected in parallel. If each coil has a resistance of 400 Ω, what is the total resistance of the control circuit load?",
    "options": [
      "200 Ω",
      "800 Ω",
      "400 Ω",
      "0.005 Ω"
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
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor. 400 / 2 = 200 Ω."
  },
  {
    "id": 4041,
    "question": "What is the defining principle of a ring final circuit arrangement in a domestic installation?",
    "options": [
      "The circuit conductors return to the same protective device from which they started",
      "The circuit ends at the last socket outlet in the run",
      "The circuit provides power only to high-load heating appliances",
      "The circuit uses a single cable to supply multiple lighting points in a line"
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
      "parallel",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit is characterized by the conductors forming a loop, starting and finishing at the same protective device (MCB/RCBO)."
  },
  {
    "id": 4042,
    "question": "A radial circuit supplies four 500W fixed heaters at 230V. Calculate the total design current (Ib) for this circuit.",
    "options": [
      "8.70 A",
      "2.17 A",
      "2000 A",
      "115 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "UNITS_MISSING",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 4 * 500W = 2000W. Current (I) = P / V = 2000 / 230 = 8.695, rounded to 8.70 A."
  },
  {
    "id": 4043,
    "question": "What is the primary principle of operation for a control circuit used in a motor starter?",
    "options": [
      "It carries signals to operate a switching device rather than supplying the main load power",
      "It provides the high-current path directly from the supply to the motor",
      "It acts as a return path for the main power circuit to the consumer unit",
      "It converts AC power to DC power for the motor's operation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are designed to manage the operation of equipment by sending signals to devices like contactors or relays, which then switch the main power circuit."
  },
  {
    "id": 4044,
    "question": "An electrician is installing a 230V radial circuit for two identical 2.3kW space heaters. What is the total resistance of the loads when both are switched on?",
    "options": [
      "11.50 Ω",
      "23.00 Ω",
      "46.00 Ω",
      "0.08 Ω"
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
      "calculation",
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Resistance of one heater = V²/P = 230²/2300 = 23 Ω. Since they are in parallel on a radial circuit, total resistance = 23 / 2 = 11.5 Ω."
  },
  {
    "id": 4045,
    "question": "Which circuit type is specifically intended to transmit information signals and is typically kept separate from mains power to avoid interference?",
    "options": [
      "Data communications circuit",
      "Alarm and emergency circuit",
      "Ring final power circuit",
      "Radial heating circuit"
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
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Data communications circuits (like Ethernet) carry signals rather than power and require separation from mains voltage to prevent electromagnetic interference."
  },
  {
    "id": 4046,
    "question": "A ring final circuit has an end-to-end resistance (r1) of 0.6 Ω. According to the principle of a ring, what would be the theoretical resistance measured between the supply and the midpoint of the circuit?",
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
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring, the resistance at the midpoint is (r1 + r2) / 4. For a single conductor end-to-end (r1) of 0.6 Ω, the midpoint resistance to the consumer unit is 0.6 / 4 = 0.15 Ω."
  },
  {
    "id": 4047,
    "question": "An electrician is wiring a new electric shower. Which circuit type and arrangement is standard practice for this high-power fixed load?",
    "options": [
      "A dedicated radial heating circuit",
      "A ring final power circuit",
      "A shared lighting radial circuit",
      "A control circuit with data cabling"
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
      "application",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power loads like showers require their own dedicated radial circuit to handle the high current and ensure they don't affect other circuits."
  },
  {
    "id": 4048,
    "question": "A lighting circuit supplies 12 lamps, each rated at 40W, on a 230V supply. Calculate the total current for the circuit, assuming no diversity.",
    "options": [
      "2.09 A",
      "0.17 A",
      "480 A",
      "4.40 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "power",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Total Power = 12 * 40 = 480W. Current = 480 / 230 = 2.086A, rounded to 2.09A."
  },
  {
    "id": 4049,
    "question": "Why is it a principle of operation to keep emergency lighting and fire alarm circuits separate from general power circuits?",
    "options": [
      "To ensure safety systems remain operational if a general power circuit fails",
      "To allow the safety systems to run at a higher frequency",
      "Because safety systems must always use larger 10mm² cables",
      "To prevent the safety systems from using any electrical energy during the day"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "legislation",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Separation ensures that a fault on a general socket or lighting circuit (like a blown fuse) does not disable critical safety and life-protection systems."
  },
  {
    "id": 4050,
    "question": "In a perfectly balanced ring final circuit with a total load of 26A, what is the current flowing in each of the two legs of the ring at the consumer unit?",
    "options": [
      "13 A",
      "26 A",
      "52 A",
      "6.5 A"
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
      "parallel"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a ring circuit, the current splits into two paths. If balanced, each leg carries exactly half of the total load current (26 / 2 = 13A)."
  },
  {
    "id": 4051,
    "question": "A socket-outlet circuit is installed in a commercial unit where the cable originates at the distribution board, connects to each outlet in a single line, and terminates at the final socket-outlet. How is this circuit classified?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Control circuit",
      "Data communications circuit"
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
      "radial",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A radial circuit runs from the protective device to the various outlets and ends at the last point, unlike a ring final circuit which returns to the source."
  },
  {
    "id": 4052,
    "question": "An electrician is installing a 2.3 kW immersion heater. Based on the principles of operation for high-power fixed loads, which circuit arrangement is most appropriate?",
    "options": [
      "A dedicated radial circuit",
      "A shared ring final circuit",
      "A lighting circuit with a 5 A fuse",
      "A control circuit via a relay only"
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
      "heating",
      "radial",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Fixed heating loads draw significant current for long periods and are typically installed on dedicated radial circuits to prevent overloading general-purpose circuits."
  },
  {
    "id": 4053,
    "question": "A ring final circuit is wired using a single loop of cable. If the total end-to-end resistance of the line conductor (r1) is measured as 0.60 Ω, what is the theoretical resistance (R1) measured from the consumer unit to the midpoint of the ring?",
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
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring circuit, the resistance at the midpoint is (r1 / 4). This is because the two paths to the midpoint act as two resistors in parallel, each being half the total length (0.30 Ω / 2 = 0.15 Ω)."
  },
  {
    "id": 4054,
    "question": "A radial circuit supplies a 230 V fixed heater with a power rating of 4.6 kW. If the circuit conductors have a total resistance of 0.2 Ω, what is the voltage drop across the cable when the heater is operating at full load?",
    "options": [
      "4.0 V",
      "20.0 V",
      "0.92 V",
      "46.0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find current: I = P / V = 4600 / 230 = 20 A. Then find voltage drop: V = I x R = 20 x 0.2 = 4 V."
  },
  {
    "id": 4055,
    "question": "In a commercial HVAC installation, a low-voltage circuit is used to signal a contactor to energize a large fan motor. What is the correct classification for this signaling circuit?",
    "options": [
      "Control circuit",
      "Power circuit",
      "Ring final circuit",
      "Data communications circuit"
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
      "control-circuit",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are designed to carry commands or signals to operate equipment, rather than providing the primary power to the load itself."
  },
  {
    "id": 4056,
    "question": "A ring final circuit has a measured end-to-end resistance of the line conductor (r1) of 0.64 Ω. What is the expected resistance of the line conductor (R1) when measured from the consumer unit to a socket located at the furthest point of the ring?",
    "options": [
      "0.16 Ω",
      "0.32 Ω",
      "0.64 Ω",
      "1.28 Ω"
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
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance to the midpoint (R1) is calculated as r1 / 4. This is because the two paths to the midpoint are in parallel, and each path is half the total length of the conductor (0.32 Ω || 0.32 Ω = 0.16 Ω)."
  },
  {
    "id": 4057,
    "question": "In a motor control system, a 24 V AC control circuit is used to operate a contactor that switches a 400 V AC three-phase motor. Which statement best describes the 'principle of operation' for this control circuit?",
    "options": [
      "It carries low-power signals to command the switching device rather than supplying the main power to the load",
      "It provides a secondary current path to the motor to assist with high starting torque requirements",
      "It acts as a step-down transformer to convert the 400 V supply into a usable voltage for the motor windings",
      "It serves as a dedicated earthing path to monitor the insulation resistance of the motor housing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Control circuits are designed to transmit signals or commands to switching equipment (like contactors or relays). They do not supply the main power to the load itself, allowing for safer and more efficient remote operation."
  },
  {
    "id": 4058,
    "question": "A radial circuit supplies a 3 kW immersion heater at 230 V. If the circuit cable has a voltage drop factor of 18 mV/A/m and the total length of the run is 15 metres, what is the total voltage drop for this circuit?",
    "options": [
      "3.52 V",
      "3521 V",
      "0.27 V",
      "5.40 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First find current: I = P / V = 3000 / 230 = 13.04 A. Then calculate voltage drop: (mV/A/m * I * L) / 1000 = (18 * 13.04 * 15) / 1000 = 3.52 V."
  },
  {
    "id": 4059,
    "question": "When comparing a ring final circuit to a radial circuit of the same conductor size, what is the primary benefit of the ring's principle of operation regarding current distribution?",
    "options": [
      "Current splits into two paths, effectively increasing the current-carrying capacity of the circuit",
      "The ring arrangement eliminates the possibility of voltage drop at the furthest point",
      "The loop ensures that current only flows in one direction, reducing electromagnetic interference",
      "It allows the protective device to monitor the load from both the line and neutral ends simultaneously"
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
      "current-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, current has two paths to reach any load. This distribution allows the circuit to support a larger total load (typically 32A) than the individual cable's rating would allow in a radial configuration."
  },
  {
    "id": 4060,
    "question": "Data communications circuits (e.g., Cat6 Ethernet) are often installed in separate containment from power circuits. What is the fundamental principle behind this requirement?",
    "options": [
      "To prevent electromagnetic induction from power cables from corrupting digital signals",
      "Because data circuits operate at much higher voltages than standard UK mains supplies",
      "To ensure data circuits can provide a backup power source via Power over Ethernet (PoE)",
      "Because data cables use DC current which would cause AC power circuits to overheat"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "explanation",
      "application"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Data circuits carry low-voltage high-frequency signals that are susceptible to interference (noise) caused by the magnetic fields surrounding power cables. Separation maintains signal integrity."
  },
  {
    "id": 4061,
    "question": "A 32 A ring final circuit has a total load of 24 A connected at a point exactly one-third of the way around the ring from the consumer unit. According to the principles of parallel circuits, how much current flows through the shorter leg of the ring?",
    "options": [
      "16 A",
      "8 A",
      "12 A",
      "24 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "current-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Current in parallel paths is inversely proportional to resistance (length). If the load is 1/3 of the way, the paths are 1/3 and 2/3 of the total length. The shorter path (1/3 length) has half the resistance of the longer path, so it carries twice the current. 24A splits into 16A and 8A."
  },
  {
    "id": 4062,
    "question": "Why is it a standard principle to supply emergency lighting systems from a dedicated circuit or specifically fused local points?",
    "options": [
      "To ensure that the failure of a general lighting circuit does not disable the emergency safety system",
      "Because emergency lights require a higher frequency supply to operate their internal batteries",
      "To prevent the emergency lighting from drawing too much current from the main ring final circuit",
      "Because emergency lighting uses 'clean' data signals rather than standard mains power"
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
      "application",
      "explanation",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Safety systems must remain operational during faults on general-purpose circuits. Dedicated circuits or specific arrangements ensure that a simple lighting fault doesn't leave an area in total darkness."
  },
  {
    "id": 4063,
    "question": "A lighting radial circuit contains four identical lamps connected in parallel. If the total resistance of the lighting load is measured at 132.25 Ω, what is the operating resistance of a single lamp?",
    "options": [
      "529 Ω",
      "33.06 Ω",
      "132.25 Ω",
      "264.5 Ω"
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
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "For identical resistors in parallel, Total Resistance (Rt) = R / n. Therefore, R = Rt * n. R = 132.25 * 4 = 529 Ω."
  },
  {
    "id": 4064,
    "question": "An electrician is inspecting a socket circuit and notices the cable leaves the consumer unit, loops through ten sockets, and returns to the same 32 A MCB. Which circuit type does this describe, and what is its defining principle?",
    "options": [
      "Ring final circuit; it provides two paths for current to reduce conductor stress",
      "Radial circuit; it supplies loads in a continuous line to simplify installation",
      "Control circuit; it uses a loop to signal the protective device to trip",
      "Data circuit; it uses a ring topology to prevent signal loss over long distances"
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
      "discrimination",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "A circuit that returns to its point of origin (the same protective device) is a ring final circuit. Its principle is to share the load across two paths, allowing for higher current capacity."
  },
  {
    "id": 4065,
    "question": "A heating circuit supplies a 2.3 kW electric heater. If the heater is left on for 8 hours, and the electricity cost is £0.28 per kWh, how much does it cost to run the heater for this period?",
    "options": [
      "£5.15",
      "£0.64",
      "£18.40",
      "£515.20"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "energy",
      "power"
    ],
    "learningOutcomeId": "203-3A-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Energy (kWh) = Power (kW) * Time (h). Energy = 2.3 kW * 8 h = 18.4 kWh. Cost = 18.4 * 0.28 = £5.15."
  }
];
