import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A3 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which of the following best describes a radial circuit topology?",
    "options": [
      "A circuit that starts at the source and ends at the final point of utilization",
      "A circuit that forms a continuous loop back to the distribution board",
      "A circuit where every component is connected in a single line with only one path for current",
      "A circuit used exclusively for data and communication signals"
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
      "radial",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit runs from the consumer unit or distribution board to the outlets or points of use, terminating at the last point."
  },
  {
    "id": 4017,
    "question": "What is the primary purpose of a standard domestic lighting circuit?",
    "options": [
      "To provide power to fixed luminaires and their associated switches",
      "To supply high-current appliances like electric cookers and showers",
      "To connect 13A socket outlets in a ring formation",
      "To carry low-voltage signals for fire alarm systems"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Lighting circuits are specifically designed to safely provide power to fixed light fittings (luminaires) and the switches that control them."
  },
  {
    "id": 4018,
    "question": "Two resistors with values of 10 ohms and 20 ohms are connected in series. What is the total resistance of the circuit?",
    "options": [
      "30 ohms",
      "6.67 ohms",
      "200 ohms",
      "10 ohms"
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
      "resistance-rule",
      "series",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total resistance is the sum of the individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4019,
    "question": "In a series circuit, how does the current behave at different points in the circuit?",
    "options": [
      "The current remains the same at all points in the circuit",
      "The current is divided between the different branches",
      "The current increases as it passes through each resistor",
      "The current decreases as it moves further from the source"
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
      "current-rule",
      "series",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the current to flow, so the current value is identical at every point."
  },
  {
    "id": 4020,
    "question": "Two identical 20 ohm heating elements are connected in parallel. What is the total resistance of this arrangement?",
    "options": [
      "10 ohms",
      "40 ohms",
      "400 ohms",
      "0.1 ohms"
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
      "resistance-rule",
      "parallel",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n)."
  },
  {
    "id": 4021,
    "question": "If a current of 2 amps flows through a 5 ohm resistor, what is the voltage drop across that resistor?",
    "options": [
      "10 V",
      "2.5 V",
      "0.4 V",
      "7 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using Ohm's Law (V = I x R), the voltage drop is 2A multiplied by 5 ohms, which equals 10V."
  },
  {
    "id": 4022,
    "question": "Which type of circuit is most commonly used for domestic socket outlets to allow for a higher current capacity using smaller cables?",
    "options": [
      "Ring final circuit",
      "Two-way lighting circuit",
      "Data communication circuit",
      "Control circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit starts and ends at the same point in the distribution board, effectively providing two paths for current and allowing the use of smaller cables for a 32A circuit."
  },
  {
    "id": 4023,
    "question": "What is the primary function of a control circuit in an electrical installation?",
    "options": [
      "To safely manage the operation of a high-power circuit",
      "To provide the main energy source for heating elements",
      "To act as the primary earth path for the installation",
      "To convert AC voltage to DC voltage for electronic devices"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Control circuits use lower currents or voltages to safely switch or manage higher-power equipment, such as motor starters or relay systems."
  },
  {
    "id": 4024,
    "question": "A parallel circuit has two branches. Branch A carries 3 amps and Branch B carries 2 amps. What is the total current supplied to the circuit?",
    "options": [
      "5 amps",
      "1 amp",
      "6 amps",
      "1.2 amps"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "current-rule",
      "parallel",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in the individual branches (It = I1 + I2)."
  },
  {
    "id": 4025,
    "question": "If a 230V supply is connected to a parallel circuit containing three different loads, what is the voltage across each load?",
    "options": [
      "230 V",
      "76.6 V",
      "690 V",
      "0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "voltage-rule",
      "parallel",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4026,
    "question": "In a standard UK domestic installation, which circuit arrangement starts and finishes at the same point in the consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Tree circuit"
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
      "topology-identification"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because the line, neutral, and CPC conductors form a continuous loop, starting and ending at the same terminals in the consumer unit."
  },
  {
    "id": 4027,
    "question": "A series circuit contains two resistors with values of 10 Ω and 15 Ω. What is the total resistance of the circuit?",
    "options": [
      "25 Ω",
      "6 Ω",
      "150 Ω",
      "5 Ω"
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances: Rt = R1 + R2."
  },
  {
    "id": 4028,
    "question": "A parallel circuit has two branches. Branch A draws 5 A and Branch B draws 3 A. What is the total current supplied by the source?",
    "options": [
      "8 A",
      "2 A",
      "15 A",
      "4 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch: It = I1 + I2."
  },
  {
    "id": 4029,
    "question": "In a parallel lighting circuit, how does the voltage across each individual lamp compare to the supply voltage?",
    "options": [
      "It is the same as the supply voltage",
      "It is divided between the lamps",
      "It increases with each lamp added",
      "It is always half the supply voltage"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4030,
    "question": "An electrician is installing a single 32 A cooker circuit. Which circuit topology is most commonly used for this specific application?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Parallel-loop circuit"
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
      "topology-identification",
      "units"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power appliances like cookers or showers are typically wired on a radial circuit, which runs directly from the consumer unit to the appliance or its control switch."
  },
  {
    "id": 4031,
    "question": "A ring final circuit is commonly used for socket outlets in UK domestic installations. What is the primary reason this topology is used instead of a single radial circuit for the same floor area?",
    "options": [
      "It allows for a smaller cable cross-sectional area by providing two paths for the current to flow.",
      "It reduces the total amount of cable required for the installation, lowering material costs.",
      "It ensures that if a cable is cut at one point, the entire circuit will immediately disconnect for safety.",
      "It prevents any voltage drop from occurring between the consumer unit and the furthest outlet."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ring-final",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit creates two parallel paths from the consumer unit. This allows the load current to split, meaning a smaller cable (typically 2.5mm²) can be used to supply a 30A or 32A protective device than would be required for a single radial path."
  },
  {
    "id": 4032,
    "question": "During testing of a 2.5mm² ring final circuit, the end-to-end resistance of the line conductor (r1) is measured as 0.60 Ω. What is the expected theoretical resistance (R1) at the midpoint of the ring?",
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
      "ring-final",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For a ring final circuit, the resistance at the furthest point (R1) is calculated as (r1 + r2) / 4. Since we are only looking at the line conductor (r1), the resistance at the midpoint is r1 / 4. 0.60 / 4 = 0.15 Ω."
  },
  {
    "id": 4033,
    "question": "An electrician is fault-finding on a series-connected decorative lighting string. If there are 20 identical lamps and the total circuit resistance is 120 Ω, what is the resistance of a single lamp?",
    "options": [
      "6 Ω",
      "2400 Ω",
      "0.16 Ω",
      "60 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances. For identical components, Rt = n × R. Therefore, R = Rt / n. 120 / 20 = 6 Ω."
  },
  {
    "id": 4034,
    "question": "Which type of circuit is specifically designed to carry signals for the management of building services, such as heating programmers or lighting sensors, usually operating at extra-low voltage?",
    "options": [
      "Control circuit",
      "Power circuit",
      "Radial circuit",
      "Data circuit"
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
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits are used to control the operation of other equipment. They often operate at lower currents or voltages (ELV) to safely interface with sensors, switches, and relays."
  },
  {
    "id": 4035,
    "question": "A radial circuit is installed to supply a 3 kW immersion heater. If the supply voltage is 230 V and the total resistance of the circuit conductors is 0.25 Ω, what is the voltage drop at the heater terminals?",
    "options": [
      "3.26 V",
      "13.04 V",
      "0.75 V",
      "5.22 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "radial",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "First, calculate current: I = P / V = 3000 / 230 = 13.043 A. Then calculate voltage drop: V = I × R = 13.043 × 0.25 = 3.26 V."
  },
  {
    "id": 4036,
    "question": "In a parallel circuit containing three branches with resistances of 10 Ω, 20 Ω, and 20 Ω respectively, what is the total equivalent resistance of the circuit?",
    "options": [
      "5 Ω",
      "50 Ω",
      "0.2 Ω",
      "10 Ω"
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
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the parallel formula: 1/Rt = 1/10 + 1/20 + 1/20 = 2/20 + 1/20 + 1/20 = 4/20. Rt = 20 / 4 = 5 Ω."
  },
  {
    "id": 4037,
    "question": "Why is it a standard requirement to separate data and telecommunications cabling from mains power cabling within the same containment system?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables distorting the data signals.",
      "To ensure that the data cables do not overheat due to the current in the power cables.",
      "Because data cables use DC current which is incompatible with the AC current in power cables.",
      "To prevent the power cables from drawing voltage away from the data system."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Mains power cables generate electromagnetic fields. If data cables are too close, these fields can induce 'noise' or interference, leading to data corruption or signal loss."
  },
  {
    "id": 4038,
    "question": "A radial lighting circuit supplies six LED lamps, each rated at 15 W. If the circuit is connected to a 230 V supply, what is the total current drawn by the lamps?",
    "options": [
      "0.39 A",
      "15.33 A",
      "2.30 A",
      "90.00 A"
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
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Total Power = 6 lamps × 15 W = 90 W. Total Current I = P / V = 90 / 230 = 0.391 A."
  },
  {
    "id": 4039,
    "question": "When comparing a ring final circuit and a radial circuit supplying the same number of socket outlets, which statement regarding fault conditions is correct?",
    "options": [
      "A break in one part of the ring conductor may go unnoticed as all sockets will still function.",
      "A radial circuit is more likely to cause an overload if a single cable break occurs.",
      "A ring final circuit is safer because it uses two protective devices for the same circuit.",
      "A break in a radial circuit conductor will always result in a short-circuit to earth."
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
      "radial",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a ring circuit, if the line or neutral conductor is broken at one point, the circuit becomes two radials. The sockets still work, but the cable may become overloaded, which is why end-to-end continuity testing is vital."
  },
  {
    "id": 4040,
    "question": "A workshop has a 230 V radial circuit feeding two machines. Machine A draws 8 A and Machine B has a resistance of 46 Ω. What is the total current drawn from the supply when both are running?",
    "options": [
      "13 A",
      "5 A",
      "18.4 A",
      "3 A"
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
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Machine A current = 8 A. Machine B current = V / R = 230 / 46 = 5 A. Since they are in parallel (standard for power circuits), Total Current = 8 + 5 = 13 A."
  },
  {
    "id": 4041,
    "question": "An electrician is installing two heating elements connected in parallel. If the resistance of the first element is 20 Ω and the second is 30 Ω, what is the total resistance of the circuit?",
    "options": [
      "12 Ω",
      "50 Ω",
      "600 Ω",
      "0.08 Ω"
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
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For parallel circuits, the total resistance is calculated using (R1 × R2) / (R1 + R2). Here, (20 × 30) / (20 + 30) = 600 / 50 = 12 Ω."
  },
  {
    "id": 4042,
    "question": "Which of the following is a defining characteristic of a UK ring final circuit used for power sockets?",
    "options": [
      "The circuit conductors start and finish at the same terminals in the consumer unit",
      "Current remains constant at every point throughout the entire loop",
      "The voltage is halved between the start and the end of the circuit",
      "It is only used for high-power industrial motors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "APPLICATION_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "power"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit is unique because the line, neutral, and earth conductors form a continuous loop, starting and ending at the same protective device in the consumer unit."
  },
  {
    "id": 4043,
    "question": "In a commercial motor installation, what is the primary purpose of the 'control circuit' compared to the 'load circuit'?",
    "options": [
      "To allow a low-power switch or sensor to safely operate a high-power motor",
      "To provide the main path for the high current required by the motor",
      "To convert the AC supply into a DC supply for the motor windings",
      "To act as the primary earthing point for the installation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TERMINOLOGY_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "conceptual",
      "conversion"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Control circuits use smaller conductors and lower currents to switch contactors or relays, which in turn manage the high-power load circuit."
  },
  {
    "id": 4044,
    "question": "Three identical 40 Ω resistors are connected in series across a 240 V supply. What is the voltage drop across a single resistor?",
    "options": [
      "80 V",
      "240 V",
      "120 V",
      "40 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total voltage is shared equally across identical resistances. 240 V / 3 = 80 V."
  },
  {
    "id": 4045,
    "question": "Data and communication circuits often use 'twisted pair' cabling. What is the main reason for this specific cable topology?",
    "options": [
      "To reduce the effects of electromagnetic interference (EMI)",
      "To increase the physical strength of the copper conductors",
      "To allow the cable to carry higher voltages safely",
      "To reduce the overall resistance of the circuit"
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
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Twisting the pairs causes interference from outside sources to cancel out across the loop, ensuring data integrity."
  },
  {
    "id": 4046,
    "question": "A radial lighting circuit has two branches. Branch A draws 2 A and Branch B draws 3 A. What is the total current measured at the consumer unit?",
    "options": [
      "5 A",
      "1.2 A",
      "6 A",
      "1 A"
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
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In parallel branches (which radial circuits are), the total current is the sum of the currents in each branch (Kirchhoff's Current Law)."
  },
  {
    "id": 4047,
    "question": "An electrician is testing a 'non-maintained' emergency lighting circuit. How should this circuit behave during normal operation?",
    "options": [
      "The emergency lamps remain off until the main power supply fails",
      "The emergency lamps remain on at all times alongside standard lighting",
      "The emergency lamps only activate when a fire alarm is triggered manually",
      "The emergency lamps provide 50% brightness until a failure occurs"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "APPLICATION_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Non-maintained emergency lighting is designed to only illuminate when the normal mains supply to the local lighting circuit fails."
  },
  {
    "id": 4048,
    "question": "The end-to-end resistance of the line conductor (r1) in a ring final circuit is 0.6 Ω. What is the theoretical resistance measured at the furthest point of the ring (R1)?",
    "options": [
      "0.15 Ω",
      "1.2 Ω",
      "0.3 Ω",
      "0.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "power"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance at the midpoint is (r1 / 4). Therefore, 0.6 / 4 = 0.15 Ω."
  },
  {
    "id": 4049,
    "question": "Why is a high-power appliance like an electric cooker usually connected to a radial circuit rather than a ring final circuit?",
    "options": [
      "Radial circuits are better suited for single high-current loads without sharing capacity",
      "Radial circuits use less copper than ring final circuits for the same load",
      "Ring final circuits cannot be protected by an RCD",
      "Voltage drop is significantly higher in radial circuits than in ring circuits"
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
      "conceptual",
      "application",
      "power"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power appliances require dedicated radial circuits to ensure the full capacity of the protective device is available to that specific load."
  },
  {
    "id": 4050,
    "question": "A series circuit consists of two resistors, 10 Ω and 15 Ω, connected to a 230 V supply. What is the total current flowing through the 15 Ω resistor?",
    "options": [
      "9.2 A",
      "23 A",
      "15.3 A",
      "38.3 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "series",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total resistance Rt = 10 + 15 = 25 Ω. Current I = V / Rt = 230 / 25 = 9.2 A. In series, current is the same at all points."
  },
  {
    "id": 4051,
    "question": "An electrician is testing a 2.5mm² ring final circuit. The end-to-end resistance of the phase conductor (r1) is measured at 0.60 Ω. What is the expected resistance of the phase conductor (R1) at the furthest point of the ring?",
    "options": [
      "0.15 Ω",
      "0.30 Ω",
      "0.60 Ω",
      "1.20 Ω"
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
      "calculation",
      "resistance-rule",
      "power"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance measured at a socket (R1) is 1/4 of the end-to-end resistance (r1) because the current has two paths to the socket, and the total length of the loop is effectively halved in parallel, resulting in (r1/2) / 2 = r1/4."
  },
  {
    "id": 4052,
    "question": "Which of the following best describes the primary advantage of using a ring final circuit instead of a radial circuit for domestic socket outlets?",
    "options": [
      "It allows for a higher current carrying capacity using smaller cross-sectional area cables",
      "It ensures that if one socket is damaged, the rest of the circuit remains energized",
      "It reduces the total length of cable required to cover a specific floor area",
      "It eliminates the need for a circuit breaker or fuse at the consumer unit"
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
      "power",
      "topology-confusion"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Ring final circuits allow a 32A load to be supported by 2.5mm² cable (which normally carries approx 20-27A) because the load current is split between two paths."
  },
  {
    "id": 4053,
    "question": "A commercial emergency lighting system is classified as 'maintained'. What does this indicate about the operation of the lamps?",
    "options": [
      "The lamps are energized at all times from the mains supply and switch to battery during failure",
      "The lamps only illuminate when the normal mains power supply fails",
      "The lamps are only activated when the fire alarm system is triggered",
      "The lamps do not require a battery backup as they are on a separate circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Maintained emergency lighting stays on at all times (using mains power normally), whereas non-maintained lighting only switches on when the local mains supply fails."
  },
  {
    "id": 4054,
    "question": "A 230V radial power circuit supplies a fixed 7kW load. If the total circuit resistance is 0.15 Ω, what is the voltage drop at the load when it is operating at full capacity?",
    "options": [
      "4.56 V",
      "1.05 V",
      "34.50 V",
      "0.03 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
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
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "First find current: I = P / V = 7000 / 230 ≈ 30.43A. Then find voltage drop: V = I × R = 30.43 × 0.15 = 4.56V."
  },
  {
    "id": 4055,
    "question": "An electrician is installing a control circuit for a motor contactor. The contactor coil operates on 24V DC and has a resistance of 480 Ω. What is the current flowing through the control circuit when the coil is energized?",
    "options": [
      "0.05 A",
      "20.0 A",
      "11.52 A",
      "0.50 A"
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
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Using Ohm's Law: I = V / R. Therefore, I = 24V / 480 Ω = 0.05A."
  },
  {
    "id": 4056,
    "question": "A ring final circuit is constructed using 2.5mm² copper conductors with a total end-to-end loop resistance (r1) of 0.8 Ω. What is the theoretical resistance measured between the line and neutral at the midpoint socket, assuming the loop is healthy?",
    "options": [
      "0.2 Ω",
      "0.4 Ω",
      "0.8 Ω",
      "1.6 Ω"
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
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance at the midpoint (R1+RN) is calculated as (r1 + rn) / 4. Since r1 is 0.8 Ω, the resistance of the two parallel paths to the midpoint is 0.4 Ω each; the parallel combination of two 0.4 Ω paths is 0.2 Ω."
  },
  {
    "id": 4057,
    "question": "An electrician is testing a ring final circuit and discovers a break in the line conductor continuity. What is the most significant operational risk if this circuit remains in service under heavy load?",
    "options": [
      "Thermal damage to the conductors due to current sharing being lost",
      "The circuit will immediately trip the RCD under normal load",
      "The voltage at the sockets will double due to the open loop",
      "The circuit will automatically convert to a series topology"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the 32A protection relies on the current being split between two paths. A break turns the ring into two radials; if the load is concentrated near the break, one leg may carry current far exceeding its 20A-27A capacity, leading to overheating."
  },
  {
    "id": 4058,
    "question": "A radial circuit supplies four 3kW heaters connected in parallel. If the supply voltage is 230V, what is the total current demand, and what happens to this demand if one heater develops an open-circuit fault?",
    "options": [
      "Initial current 52.17A; drops to 39.13A after fault",
      "Initial current 52.17A; increases to 69.56A after fault",
      "Initial current 13.04A; drops to 9.78A after fault",
      "Initial current 52.17A; remains the same as it is a radial circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "USED_SERIES_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power = 4 * 3000W = 12,000W. I = P/V = 12000/230 = 52.17A. If one heater fails (open circuit), total power becomes 9,000W. I = 9000/230 = 39.13A."
  },
  {
    "id": 4059,
    "question": "In a complex control circuit, a 24V DC relay is used to switch a 230V AC motor. If the relay coil has a resistance of 120 Ω, what is the power dissipated by the control coil during operation?",
    "options": [
      "4.8 W",
      "0.2 W",
      "5.5 kW",
      "2.8 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "conversion"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Power (P) = V² / R. Using the control voltage (24V): P = 24² / 120 = 576 / 120 = 4.8W."
  },
  {
    "id": 4060,
    "question": "Which of the following describes the fundamental difference between a 'Maintained' and 'Non-Maintained' emergency lighting circuit topology?",
    "options": [
      "Maintained lamps operate in both normal and emergency modes; Non-Maintained only operate on mains failure",
      "Maintained circuits use DC power at all times; Non-Maintained use AC power until a fault occurs",
      "Non-Maintained lamps are always on; Maintained lamps are only triggered by a fire alarm signal",
      "Maintained circuits do not require a permanent live feed; Non-Maintained circuits do"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Maintained emergency luminaires are designed to be lit continuously (acting as standard lighting) and stay lit during power failure. Non-maintained luminaires only ignite when the local mains supply fails."
  },
  {
    "id": 4061,
    "question": "A mixed circuit consists of a 10 Ω resistor in series with a parallel bank of two 20 Ω resistors. If the total circuit current is 5A, what is the total supply voltage?",
    "options": [
      "100 V",
      "250 V",
      "150 V",
      "50 V"
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
      "mixed-circuit",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Parallel part: (20 * 20) / (20 + 20) = 10 Ω. Total resistance = 10 Ω (series) + 10 Ω (parallel) = 20 Ω. V = I * R = 5A * 20 Ω = 100V."
  },
  {
    "id": 4062,
    "question": "When installing data and telecommunications cabling alongside power circuits, why is a minimum segregation distance required by BS 7671?",
    "options": [
      "To prevent electromagnetic interference from the power cables affecting data integrity",
      "To prevent the power cables from drawing current out of the data cables",
      "To ensure the data cables do not cause the power circuit breakers to trip",
      "To prevent DC voltage from the data cables leaking into the AC mains system"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Current flowing in power cables creates magnetic fields. If data cables are too close, these fields can induce 'noise' (EMI) in the data lines, causing errors or signal loss."
  },
  {
    "id": 4063,
    "question": "A 230V radial heating circuit has two 115V elements. If these elements are accidentally wired in parallel instead of series, what is the likely outcome?",
    "options": [
      "The elements will draw four times the intended power and likely burn out",
      "The elements will draw half the intended power and run cold",
      "The total resistance will double, causing the fuse to blow",
      "The current will remain the same but the voltage will halve"
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
      "conceptual",
      "application",
      "power"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "If 115V elements are put in parallel across 230V, each receives 230V (double its rating). Since P = V²/R, doubling the voltage quadruples the power (2²=4), leading to rapid failure."
  },
  {
    "id": 4064,
    "question": "A technician measures the voltage at the end of a long radial lighting circuit. With all lamps off, it reads 230V. With all lamps on, it reads 218V. If the total current is 4A, what is the resistance of the circuit cabling?",
    "options": [
      "3.0 Ω",
      "54.5 Ω",
      "57.5 Ω",
      "12.0 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Voltage drop (Vd) = 230V - 218V = 12V. Using Ohm's Law for the cable: R = Vd / I = 12V / 4A = 3.0 Ω."
  },
  {
    "id": 4065,
    "question": "In a 3-phase industrial control panel, a 'Safety Interlock' circuit typically uses which topology to ensure that multiple guards must be closed before a machine starts?",
    "options": [
      "Series connection of all guard switches",
      "Parallel connection of all guard switches",
      "Ring final connection of guard switches",
      "Star-delta connection of guard switches"
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
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A3-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "For safety interlocks, switches are wired in series so that if any single guard is opened, the circuit is broken and the machine stops (Fail-safe)."
  }
];
