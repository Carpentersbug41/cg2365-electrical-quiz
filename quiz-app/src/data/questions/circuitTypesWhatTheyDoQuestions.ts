import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3AA learning outcomes
 * Generated: 2026-02-06
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which circuit topology is most commonly used for domestic lighting installations in the UK?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Grid circuit"
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
      "terminology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Domestic lighting is almost exclusively wired as a radial circuit, where the cable runs from the consumer unit to the first point, then the second, and so on, ending at the last point."
  },
  {
    "id": 4017,
    "question": "Two resistors with values of 15 Ω and 30 Ω are connected in series. What is the total resistance of the circuit?",
    "options": [
      "45 Ω",
      "10 Ω",
      "450 Ω",
      "15 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of individual resistances (Rt = R1 + R2). Therefore, 15 + 30 = 45 Ω."
  },
  {
    "id": 4018,
    "question": "What is the defining characteristic of a ring final circuit used for power sockets?",
    "options": [
      "The circuit conductors form a continuous loop back to the distribution board",
      "It uses only one single core cable for both live and neutral",
      "It is only used for high-power heating appliances",
      "It must be connected in series with the lighting circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit starts at the distribution board, loops through all the socket outlets, and returns to the same terminals in the distribution board."
  },
  {
    "id": 4019,
    "question": "Two identical 100 Ω heating elements are connected in parallel. What is the total resistance?",
    "options": [
      "50 Ω",
      "200 Ω",
      "100 Ω",
      "1 Ω"
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
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n). So, 100 / 2 = 50 Ω."
  },
  {
    "id": 4020,
    "question": "Which type of circuit is typically installed to supply a fixed 9kW electric shower?",
    "options": [
      "A dedicated radial circuit",
      "A 32A ring final circuit",
      "A 6A lighting radial circuit",
      "A data and comms circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "High-power fixed appliances like showers require their own dedicated radial circuit to handle the high current demand safely."
  },
  {
    "id": 4021,
    "question": "If a current of 4A flows through the first resistor in a simple series circuit, how much current flows through the second resistor?",
    "options": [
      "4A",
      "2A",
      "8A",
      "0A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "In a series circuit, the current is the same at all points in the circuit."
  },
  {
    "id": 4022,
    "question": "What is the primary purpose of a control circuit in an electrical installation?",
    "options": [
      "To switch a high-power load using a lower voltage or current signal",
      "To increase the total power consumption of the system",
      "To provide a backup path for current if a fuse blows",
      "To convert DC power into AC power for the mains"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits allow for the safe and efficient switching of large loads (like motors) using smaller, safer control signals."
  },
  {
    "id": 4023,
    "question": "In a parallel circuit supplied by 230V, what is the voltage across each individual branch?",
    "options": [
      "230V",
      "115V",
      "0V",
      "460V"
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
      "parallel",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4024,
    "question": "Why is it important to separate data cables from power cables in an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) affecting data signals",
      "Because data cables are much heavier than power cables",
      "To ensure the data cables can carry more current",
      "Because data cables only work in series circuits"
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
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Separation prevents 'noise' or EMI from power cables from distorting the low-voltage signals in data cables."
  },
  {
    "id": 4025,
    "question": "If the end-to-end resistance (r1) of a ring final loop is 0.8 Ω, what is the theoretical resistance measured at the furthest point (midpoint) of the ring?",
    "options": [
      "0.2 Ω",
      "0.8 Ω",
      "1.6 Ω",
      "0.4 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For a ring final circuit, the resistance at the midpoint is calculated as (r1 / 4). Therefore, 0.8 / 4 = 0.2 Ω."
  },
  {
    "id": 4026,
    "question": "In a standard UK domestic installation, which circuit topology involves the cable starting at the consumer unit, visiting each socket-outlet, and returning to the same consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Parallel tree circuit"
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
      "topology-confusion",
      "conceptual"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because the line, neutral, and CPC conductors form a continuous loop starting and ending at the consumer unit."
  },
  {
    "id": 4027,
    "question": "Two resistors with values of 15 Ω and 25 Ω are connected in series. What is the total resistance of the circuit?",
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
    "category": "Resistance",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances (Rt = R1 + R2)."
  },
  {
    "id": 4028,
    "question": "Which type of circuit is most commonly used to supply a single high-power appliance, such as an electric oven or a 9.5 kW shower?",
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
      "radial",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power appliances are usually connected to their own dedicated radial circuit to handle the high current demand safely."
  },
  {
    "id": 4029,
    "question": "A parallel circuit contains two branches. Branch 1 draws 4 A and Branch 2 draws 6 A. What is the total current supplied by the source?",
    "options": [
      "10 A",
      "2 A",
      "24 A",
      "5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Current",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each individual branch (It = I1 + I2)."
  },
  {
    "id": 4030,
    "question": "In a series circuit connected to a 230 V supply, there are two identical lamps. What is the voltage drop across each lamp?",
    "options": [
      "115 V",
      "230 V",
      "460 V",
      "0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Voltage",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the supply voltage is shared between the components. If the components are identical, the voltage is split equally (230 V / 2 = 115 V)."
  },
  {
    "id": 4031,
    "question": "A series circuit used for decorative lighting contains four identical lamps. If the total resistance of the circuit is 800Ω, what is the resistance of each individual lamp?",
    "options": [
      "200Ω",
      "3200Ω",
      "800Ω",
      "400Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "USED_PARALLEL_RULE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of individual resistances. For identical components, R = Rt / number of components. 800 / 4 = 200Ω."
  },
  {
    "id": 4032,
    "question": "In a standard UK 32A ring final circuit, how is the current distributed from the consumer unit to the connected loads?",
    "options": [
      "It travels in two directions around the loop to reach the load",
      "It travels in one direction only through each socket in series",
      "It is restricted to the first half of the ring only",
      "It alternates between the left and right legs every cycle"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit forms a loop; current leaves the protective device and travels through both legs of the ring to reach the sockets, effectively acting as two cables in parallel."
  },
  {
    "id": 4033,
    "question": "A 230V circuit supplies two heating elements connected in series. Element A has a resistance of 30Ω and Element B has a resistance of 70Ω. Calculate the voltage drop across Element B.",
    "options": [
      "161V",
      "69V",
      "115V",
      "230V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "ROUNDING_ERROR",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total R = 30 + 70 = 100Ω. Total I = V / R = 230 / 100 = 2.3A. Voltage drop across B = I * Rb = 2.3 * 70 = 161V."
  },
  {
    "id": 4034,
    "question": "An electrician is installing a system where a low-voltage thermostat switches a 230V contactor to manage a large heating load. What type of circuit is the thermostat part of?",
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
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are used to regulate the operation of other circuits, often using lower voltages or currents to switch larger power loads via relays or contactors."
  },
  {
    "id": 4035,
    "question": "Two 1150W heaters are connected in parallel to a 230V supply. What is the total current drawn by the circuit?",
    "options": [
      "10A",
      "5A",
      "2.5A",
      "20A"
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
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Current for one heater: I = P / V = 1150 / 230 = 5A. In parallel, total current is the sum of branch currents: 5A + 5A = 10A."
  },
  {
    "id": 4036,
    "question": "What is a primary functional difference between a radial circuit and a ring final circuit in a domestic installation?",
    "options": [
      "A radial circuit ends at the last point of utilization, while a ring returns to the source",
      "A radial circuit can only supply one socket, while a ring can supply unlimited sockets",
      "A radial circuit uses less cable than a ring circuit for the same floor area",
      "A radial circuit is only used for high-power appliances like cookers"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A radial circuit runs from the consumer unit to the various points and stops at the final one. A ring final circuit returns to the consumer unit to form a continuous loop."
  },
  {
    "id": 4037,
    "question": "When installing data and communication cabling alongside power circuits, why is physical segregation required?",
    "options": [
      "To prevent electromagnetic interference (EMI) affecting signal quality",
      "To ensure the data cables do not overheat the power cables",
      "To allow the data cables to carry higher voltage if needed",
      "To prevent the power cables from drawing current from the data lines"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Data cables carry low-voltage signals that are susceptible to electromagnetic interference from the magnetic fields generated by high-current power cables."
  },
  {
    "id": 4038,
    "question": "A parallel circuit has two branches. Branch 1 has a resistance of 46Ω and Branch 2 has a resistance of 46Ω. If the supply voltage is 230V, what is the total circuit current?",
    "options": [
      "10A",
      "5A",
      "2.5A",
      "460A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Branch 1 current: 230/46 = 5A. Branch 2 current: 230/46 = 5A. Total current = 5 + 5 = 10A. Alternatively, total R = 23Ω, 230/23 = 10A."
  },
  {
    "id": 4039,
    "question": "Which of the following circuit types is specifically designed to provide power to life-safety systems during a mains failure?",
    "options": [
      "Emergency lighting circuit",
      "Ring final circuit",
      "Control circuit",
      "Data/Comms circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Emergency lighting circuits include battery backups or secondary power sources to ensure illumination during a power cut for safe evacuation."
  },
  {
    "id": 4040,
    "question": "The end-to-end resistance (r1) of the line conductor in a ring final circuit is measured at 0.6Ω. What would be the expected resistance (R1) measured at the furthest point of the ring?",
    "options": [
      "0.15Ω",
      "0.30Ω",
      "0.60Ω",
      "1.20Ω"
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
      "application"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1) is 1/4 of the end-to-end resistance (r1). 0.6 / 4 = 0.15Ω."
  },
  {
    "id": 4041,
    "question": "A series lighting circuit in a display case contains three lamps, each with a resistance of 150 Ω. What is the total resistance of the circuit?",
    "options": [
      "450 Ω",
      "50 Ω",
      "150 Ω",
      "0.02 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total resistance is the sum of all individual resistances (Rt = R1 + R2 + R3). Therefore, 150 + 150 + 150 = 450 Ω."
  },
  {
    "id": 4042,
    "question": "In a standard UK 32A ring final circuit, what is the primary technical reason for returning the line conductor to the same terminal in the consumer unit?",
    "options": [
      "To provide two paths for current, effectively increasing the current-carrying capacity",
      "To ensure the circuit operates as a series circuit to maintain constant current",
      "To create a deliberate short circuit to ensure the protective device trips faster",
      "To increase the total resistance of the circuit and reduce voltage drop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A ring final circuit is essentially two parallel paths. This allows the use of smaller cables (typically 2.5mm²) to supply a 32A load, as the current splits between the two legs of the ring."
  },
  {
    "id": 4043,
    "question": "A radial power circuit supplies two heaters connected in parallel. Heater A draws 5 A and Heater B draws 8 A. What is the total current drawn from the supply?",
    "options": [
      "13 A",
      "3 A",
      "3.07 A",
      "40 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "USED_PARALLEL_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "According to Kirchhoff's Current Law, in a parallel circuit, the total current is the sum of the currents in the individual branches (It = I1 + I2). 5A + 8A = 13A."
  },
  {
    "id": 4044,
    "question": "An electrician is installing a system that uses low-voltage signalling to activate a heavy-duty contactor for a motor. Which circuit category does this signalling part of the system belong to?",
    "options": [
      "Control circuit",
      "Power circuit",
      "Data and communications circuit",
      "Emergency lighting circuit"
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
      "terminology",
      "application",
      "explanation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Control circuits are used to control the operation of other equipment, often operating at lower voltages or currents than the power circuit they manage."
  },
  {
    "id": 4045,
    "question": "A 230V radial circuit feeds two identical 46 Ω heating elements connected in parallel. Calculate the total current flowing from the consumer unit.",
    "options": [
      "10 A",
      "5 A",
      "23 A",
      "46 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "parallel",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First, find total resistance (Rt): For two identical resistors in parallel, Rt = R/2 = 46/2 = 23 Ω. Then use Ohm's Law: I = V / R = 230 / 23 = 10 A."
  },
  {
    "id": 4046,
    "question": "What is the main advantage of wiring domestic lighting circuits in parallel rather than in series?",
    "options": [
      "Each lamp receives the full supply voltage and can be controlled independently",
      "The total circuit resistance increases, which reduces the heat in the cables",
      "If one lamp fails, the total current increases to keep the other lamps bright",
      "It requires significantly less cable than a series circuit arrangement"
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
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In parallel circuits, the voltage across each branch is the same as the supply voltage, allowing devices to operate at their rated voltage independently of others."
  },
  {
    "id": 4047,
    "question": "A series circuit consists of a 10 Ω resistor and a 15 Ω resistor connected to a 50V DC supply. Calculate the voltage drop across the 15 Ω resistor.",
    "options": [
      "30 V",
      "20 V",
      "50 V",
      "2 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Total resistance Rt = 10 + 15 = 25 Ω. Circuit current I = V / Rt = 50 / 25 = 2 A. Voltage drop across the 15 Ω resistor = I × R = 2 × 15 = 30 V."
  },
  {
    "id": 4048,
    "question": "Which circuit type is designed with specific cable requirements (such as fire resistance) to ensure it continues to function during a building fire?",
    "options": [
      "Emergency and fire alarm circuits",
      "Ring final power circuits",
      "Radial lighting circuits",
      "Data and Comms circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "APPLICATION_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Emergency and alarm circuits require high integrity and fire-resistant cables (like FP200) to ensure they operate during an emergency to protect life."
  },
  {
    "id": 4049,
    "question": "Calculate the total resistance of three 60 Ω resistors when they are connected in a parallel configuration.",
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
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "For identical resistors in parallel, Rt = R / n. Here, 60 / 3 = 20 Ω. Alternatively, 1/Rt = 1/60 + 1/60 + 1/60 = 3/60, so Rt = 60/3 = 20 Ω."
  },
  {
    "id": 4050,
    "question": "What is the defining characteristic of a radial circuit layout in a domestic installation?",
    "options": [
      "The circuit cable runs from the consumer unit and ends at the final outlet",
      "The circuit forms a complete loop starting and ending at the consumer unit",
      "The circuit must only be used for high-power appliances like cookers",
      "The current is the same at every point along the entire circuit length"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "APPLICATION_ERROR",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A radial circuit is like a branch of a tree; it starts at the source (consumer unit) and finishes at the last point of use, unlike a ring circuit which returns to the start."
  },
  {
    "id": 4051,
    "question": "In a standard UK Ring Final Circuit, how is the current distributed when a single 20 A load is connected exactly halfway around the ring loop?",
    "options": [
      "The current splits equally, with 10 A flowing through each leg of the ring",
      "The full 20 A flows through the shortest leg to the consumer unit",
      "The current is restricted to 13 A by the socket outlet regardless of the path",
      "The current doubles to 40 A because there are two paths available"
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
      "parallel",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit acts as two parallel paths. If a load is at the midpoint, the resistance of each path is equal, meaning the current divides equally between both legs."
  },
  {
    "id": 4052,
    "question": "An electrician measures the end-to-end resistance (r1) of the line conductor loop for a Ring Final Circuit as 0.8 Ω. What is the expected resistance (R1) measured at a socket located at the furthest point of the ring?",
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
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "resistance-rule",
      "calculation",
      "parallel"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring circuit, the resistance at the midpoint (R1) is calculated as (r1 / 4). This is because the two legs of the ring act as parallel resistors, each being half the total length (r1/2). Using the parallel rule: (0.4 × 0.4) / (0.4 + 0.4) = 0.16 / 0.8 = 0.2 Ω."
  },
  {
    "id": 4053,
    "question": "A large commercial hallway requires a lighting circuit where the lamps can be controlled from three separate entrances. Which combination of switches must be used?",
    "options": [
      "Two 2-way switches and one intermediate switch",
      "Three 2-way switches connected in parallel",
      "Three intermediate switches connected in series",
      "Two 1-way switches and one intermediate switch"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For three-point control, the circuit starts and ends with a 2-way switch, with any number of intermediate switches placed between them to facilitate the multi-point switching logic."
  },
  {
    "id": 4054,
    "question": "A radial circuit supplies a 230 V, 4.6 kW electric heater. If the total circuit resistance (R1 + Rn) is 0.4 Ω, calculate the voltage drop across the cable when the heater is in operation.",
    "options": [
      "8 V",
      "11.5 V",
      "18.4 V",
      "4.6 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "First, find current (I): I = P / V = 4600 / 230 = 20 A. Then, find voltage drop (Vd): Vd = I × R = 20 × 0.4 = 8 V."
  },
  {
    "id": 4055,
    "question": "Why is it a specific requirement to separate Category 1 (mains voltage) circuits from Category 2 (data and signal) circuits within an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) and ensure safety in the event of a fault",
      "To prevent the data cables from drawing too much current from the mains",
      "Because data cables operate at a higher frequency which causes the mains cable to overheat",
      "To ensure the resistance of the data cables does not affect the ring final continuity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Separation is required to prevent electrical noise (EMI) from disrupting data signals and to ensure that a high-voltage fault in Category 1 cannot energize the low-voltage Category 2 systems."
  },
  {
    "id": 4056,
    "question": "An electrician is testing a 32A ring final circuit that is 60 metres in total length. A single point load of 20A is connected at a socket exactly 15 metres from the consumer unit along the ring. Neglecting conductor resistance variations, how much current will flow through the shortest leg of the ring?",
    "options": [
      "15A",
      "5A",
      "10A",
      "20A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "application"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "In a ring final circuit, the current divides inversely proportional to the resistance (length) of the paths. The total length is 60m. Path A is 15m, Path B is 45m. Current in Path A = Total Current * (Length B / Total Length) = 20A * (45/60) = 15A."
  },
  {
    "id": 4057,
    "question": "A control circuit for a heavy-duty industrial motor utilizes a 24V DC secondary circuit to switch a 400V AC contactor. What is the primary functional reason for separating the control circuit from the power circuit in this manner?",
    "options": [
      "To improve operator safety and allow for smaller, low-voltage control components",
      "To increase the torque of the motor during the start-up phase",
      "To ensure the control circuit can handle the high inrush current of the motor",
      "To eliminate the need for overcurrent protection on the main power cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Control circuits are often Extra-Low Voltage (ELV) to enhance safety for operators interacting with switches and to allow for smaller, more cost-effective control components that do not need to withstand high power loads."
  },
  {
    "id": 4058,
    "question": "A radial circuit using 2.5mm² twin and earth cable is 25 metres long. The combined resistance (R1+R2) for this cable is 14.82 mΩ/m. Calculate the total circuit resistance (R1+R2) at the furthest point, assuming no other factors apply.",
    "options": [
      "0.37 Ω",
      "370.5 Ω",
      "0.18 Ω",
      "14.82 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "units",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Resistance = (mΩ/m * length) / 1000. So, (14.82 * 25) / 1000 = 0.3705 Ω."
  },
  {
    "id": 4059,
    "question": "In a large commercial building, a 'Maintained' emergency lighting system is installed. Which of the following best describes the operation of this circuit type?",
    "options": [
      "The lamps operate at all times from the mains and switch to battery power upon mains failure",
      "The lamps only illuminate when the local lighting circuit loses power",
      "The lamps are only powered by a central battery system and never use the mains supply",
      "The lamps are connected to a PIR sensor and only activate when movement is detected"
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
      "health-safety",
      "explanation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Maintained emergency lighting is designed so the lamps are on at all times (using mains) and continue to stay on (using battery) if the mains fails. Non-maintained only turns on when mains fails."
  },
  {
    "id": 4060,
    "question": "A heating control panel contains two identical 240 Ω solenoid valves connected in parallel. This parallel pair is then connected in series with a 20 Ω thermostat. What is the total resistance of this control arrangement?",
    "options": [
      "140 Ω",
      "500 Ω",
      "130 Ω",
      "10 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "mixed-circuit",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "First, calculate the parallel solenoid valves: (240 / 2) = 120 Ω. Then add the series thermostat: 120 Ω + 20 Ω = 140 Ω."
  },
  {
    "id": 4061,
    "question": "A ring final circuit has been inadvertently broken at one point, effectively creating two radial circuits. If a high-load appliance is used near the break, what is the most likely risk to the installation?",
    "options": [
      "One leg of the circuit may become overloaded beyond its current carrying capacity",
      "The circuit will immediately cease to function as the loop is broken",
      "The voltage at the sockets will double because the resistance is halved",
      "The RCD will trip instantly due to the imbalance of current in the ring"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "A ring final circuit is protected by a 32A device, but the individual cable (usually 2.5mm²) is not rated for 32A. If the ring is broken, the full load may travel down one leg, potentially exceeding that cable's rating and causing a fire risk."
  },
  {
    "id": 4062,
    "question": "An electrician is installing Cat6 data cabling in the same compartment of a plastic trunking as 230V power cables. According to best practice for data/comms circuits, what action should be taken to prevent Electromagnetic Interference (EMI)?",
    "options": [
      "Maintain physical segregation using a grounded metallic divider or specific spacing",
      "Connect the data cable screens in series with the power circuit earth",
      "Increase the fuse rating of the power circuit to stabilize the magnetic field",
      "Ensure the data cables are longer than the power cables to dissipate noise"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "legislation",
      "terminology"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Data and power cables must be segregated to prevent EMI from the power cables corrupting data signals. This is typically achieved by physical distance or a grounded conductive barrier."
  },
  {
    "id": 4063,
    "question": "A 230V radial circuit supplies a 9.2kW electric shower. If the circuit has a total resistance of 0.15 Ω, what is the voltage drop across the cable when the shower is in use?",
    "options": [
      "6V",
      "1.38V",
      "13.8V",
      "40V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First find current: I = P / V = 9200 / 230 = 40A. Then find voltage drop: V = I * R = 40 * 0.15 = 6V."
  },
  {
    "id": 4064,
    "question": "Why are fire alarm 'addressable' circuits often wired in a loop configuration rather than a radial configuration?",
    "options": [
      "To provide system integrity so the panel can communicate with devices from both ends if the cable is cut",
      "To reduce the total amount of cable required for the installation",
      "To increase the voltage available to the furthest sounder on the circuit",
      "To allow the system to operate on DC power instead of AC power"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "health-safety",
      "explanation"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Addressable fire loops allow for redundant communication paths. If the loop is broken at one point, the control panel can still 'see' every device by communicating from both directions."
  },
  {
    "id": 4065,
    "question": "A workshop radial circuit supplies five 100W light fittings and one 2kW heater. If the lights are on for 8 hours and the heater is on for 2 hours, what is the total energy consumed in kilowatt-hours (kWh)?",
    "options": [
      "8 kWh",
      "21 kWh",
      "2.5 kWh",
      "16.4 kWh"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "WRONG_UNITS",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "energy",
      "power"
    ],
    "learningOutcomeId": "203-3AA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Lights: (5 * 100W) = 500W = 0.5kW. Energy = 0.5kW * 8h = 4kWh. Heater: 2kW * 2h = 4kWh. Total = 4 + 4 = 8kWh."
  }
];
