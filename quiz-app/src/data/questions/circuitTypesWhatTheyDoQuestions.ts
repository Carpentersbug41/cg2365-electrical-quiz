import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A1 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "In a series circuit containing three resistors, how does the current behave at different points in the circuit?",
    "options": [
      "The current is the same at all points",
      "The current divides between the resistors",
      "The current increases after each resistor",
      "The current is only present at the positive terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the electrons to flow, meaning the current remains constant at every point in the loop."
  },
  {
    "id": 4017,
    "question": "Calculate the total resistance of a series circuit that contains two resistors with values of 10 Ω and 15 Ω.",
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
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To find the total resistance in a series circuit, you simply add the individual resistances together (Rt = R1 + R2)."
  },
  {
    "id": 4018,
    "question": "Which circuit arrangement starts and finishes at the consumer unit, forming a continuous loop to provide power to socket outlets?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Control circuit"
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
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is a specific UK wiring topology where the circuit cable forms a loop, starting and ending at the same protective device in the consumer unit."
  },
  {
    "id": 4019,
    "question": "In a parallel circuit connected to a 230V supply, what is the voltage across each individual branch?",
    "options": [
      "230V",
      "It is divided by the number of branches",
      "0V",
      "115V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is equal to the supply voltage."
  },
  {
    "id": 4020,
    "question": "Most domestic lighting circuits are wired in which configuration to ensure that if one lamp fails, the others remain operational?",
    "options": [
      "Parallel",
      "Series",
      "Ring",
      "Cascade"
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
      "parallel",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Lighting circuits are wired in parallel so that each lamp receives full mains voltage and operates independently of the others."
  },
  {
    "id": 4021,
    "question": "Two identical 20 Ω resistors are connected in parallel. What is the total resistance of the circuit?",
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
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n)."
  },
  {
    "id": 4022,
    "question": "A dedicated circuit supplying a single high-power appliance, such as an electric shower or cooker, is typically installed as a:",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Data circuit"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit runs from the consumer unit directly to the load or a series of loads without returning to the consumer unit, making it ideal for dedicated high-power appliances."
  },
  {
    "id": 4023,
    "question": "A series circuit has a 12V DC source and two identical resistors. What is the voltage drop across just one of these resistors?",
    "options": [
      "6V",
      "12V",
      "24V",
      "0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total voltage is shared between the components. If the resistors are identical, the voltage is shared equally (12V / 2 = 6V)."
  },
  {
    "id": 4024,
    "question": "What is the primary purpose of an emergency lighting circuit in a commercial building?",
    "options": [
      "To provide illumination when the normal power supply fails",
      "To provide extra light during peak working hours",
      "To reduce energy consumption in unoccupied areas",
      "To provide power to the fire alarm control panel"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Emergency lighting is designed to operate automatically when the main power supply fails, ensuring occupants can safely exit the building."
  },
  {
    "id": 4025,
    "question": "A parallel circuit has two branches. Branch A draws 2A and Branch B draws 3A. What is the total current supplied by the source?",
    "options": [
      "5A",
      "1A",
      "6A",
      "1.2A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each individual branch (It = I1 + I2)."
  },
  {
    "id": 4026,
    "question": "Which circuit arrangement starts at the consumer unit, loops through a series of socket outlets, and returns to the same terminals in the consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Data circuit"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because it forms a continuous loop that starts and ends at the same protective device in the consumer unit."
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
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total resistance is found by simply adding the individual resistances together (Rt = R1 + R2)."
  },
  {
    "id": 4028,
    "question": "In a series circuit containing three identical lamps, how does the current flow through each lamp?",
    "options": [
      "The current is the same through all lamps",
      "The current is divided equally between the lamps",
      "The current decreases as it passes through each lamp",
      "The current is higher in the first lamp than the last"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the current to flow, meaning the current remains the same at any point in the circuit."
  },
  {
    "id": 4029,
    "question": "Two heaters are connected in parallel to a 230V mains supply. What is the voltage across each heater?",
    "options": [
      "230V",
      "115V",
      "460V",
      "0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each parallel branch is equal to the supply voltage."
  },
  {
    "id": 4030,
    "question": "An electrician is installing a single 7kW electric shower. Which circuit type is most appropriate for this high-power fixed appliance?",
    "options": [
      "A dedicated radial circuit",
      "A ring final circuit",
      "A series lighting circuit",
      "A data and comms circuit"
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
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power fixed appliances like showers require their own dedicated radial circuit to handle the high current demand safely."
  },
  {
    "id": 4031,
    "question": "An electrician performs a continuity test on a ring final circuit. The end-to-end resistance of the line conductor (r1) is measured as 0.6 ohms. What is the expected resistance reading (R1) at each socket when the ring is cross-connected correctly?",
    "options": [
      "0.15 ohms",
      "0.30 ohms",
      "0.60 ohms",
      "1.20 ohms"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For a ring final circuit, the resistance at the sockets (R1) is calculated as r1 / 4 because the current has two paths to the socket and the cross-connection effectively creates a parallel loop. 0.6 / 4 = 0.15 ohms."
  },
  {
    "id": 4032,
    "question": "Why is a radial circuit typically used for high-power appliances such as an 8.5kW electric shower rather than a ring final circuit?",
    "options": [
      "The load exceeds the 32A capacity of a standard ring final circuit",
      "Radial circuits are safer because they use less cable",
      "Ring final circuits are only permitted for lighting loads",
      "A radial circuit prevents the 'shared neutral' effect"
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
      "application",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An 8.5kW shower draws approximately 37A (8500/230). A standard ring final circuit is protected by a 32A OCPD, meaning the shower's load would exceed the circuit's capacity."
  },
  {
    "id": 4033,
    "question": "A lighting circuit contains four LED panels connected in parallel. If each panel draws 0.15A from a 230V supply, what is the total current drawn by the circuit?",
    "options": [
      "0.60A",
      "0.15A",
      "0.037A",
      "1.50A"
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
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch. 0.15A x 4 = 0.60A."
  },
  {
    "id": 4034,
    "question": "What is the primary function of a control circuit in a motor starter installation?",
    "options": [
      "To allow low-voltage switching of a high-power load",
      "To increase the voltage supplied to the motor during start-up",
      "To convert AC power into DC power for the motor coils",
      "To act as a backup power source if the main supply fails"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Control circuits allow operators to safely switch high-power machinery using lower voltages and smaller currents, reducing the risk of electric shock and allowing for smaller switchgear components."
  },
  {
    "id": 4035,
    "question": "A 230V radial circuit supplies a 2.3kW heater. If the total circuit resistance is 0.5 ohms, calculate the voltage drop across the cable.",
    "options": [
      "5.0V",
      "1.15V",
      "10.0V",
      "0.5V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find current: I = P/V = 2300/230 = 10A. Then find voltage drop: V = I x R = 10 x 0.5 = 5.0V."
  },
  {
    "id": 4036,
    "question": "In a commercial building, why are emergency lighting circuits often wired as 'maintained' circuits?",
    "options": [
      "To ensure the lamps are illuminated at all times, including during normal operation",
      "To reduce the energy consumption of the building",
      "To ensure the lights only come on when the fire alarm is triggered",
      "To allow the batteries to charge only when the main power is off"
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
      "explanation",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Maintained emergency lighting operates like a normal light but stays on during a power failure using a battery. Non-maintained only turns on when the power fails."
  },
  {
    "id": 4037,
    "question": "A data circuit uses Cat5e cabling. Why must these cables be kept separate from 230V power circuits?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals",
      "Because data cables have higher resistance than power cables",
      "To prevent the data cables from overheating",
      "Because data circuits operate at a higher frequency than 50Hz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "explanation",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Separation (segregation) is required to prevent electromagnetic interference from power cables inducing noise onto data cables, which can cause data loss or corruption."
  },
  {
    "id": 4038,
    "question": "Calculate the total power in kW consumed by a 230V radial circuit that has two 1.5kW heaters and five 100W lamps all switched on at the same time.",
    "options": [
      "3.5 kW",
      "3500 kW",
      "3.0 kW",
      "1.6 kW"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "UNITS_MISSING",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total power = (2 x 1.5kW) + (5 x 0.1kW) = 3.0kW + 0.5kW = 3.5kW."
  },
  {
    "id": 4039,
    "question": "An electrician is installing a series-connected fire alarm bell circuit. If one bell develops an open-circuit fault, what happens to the rest of the bells?",
    "options": [
      "All bells will stop working",
      "All other bells will continue to work normally",
      "The remaining bells will get louder",
      "The fuse will immediately blow"
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
      "series",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path for current. An open-circuit fault (a break) at any point stops the flow of current to the entire circuit."
  },
  {
    "id": 4040,
    "question": "A 230V circuit has two identical resistors connected in parallel. The total resistance is measured at 25 ohms. What is the resistance of each individual resistor?",
    "options": [
      "50 ohms",
      "12.5 ohms",
      "25 ohms",
      "100 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (Rt = R / 2). Therefore, R = Rt x 2 = 25 x 2 = 50 ohms."
  },
  {
    "id": 4041,
    "question": "An electrician is installing two 40 Ω heating elements in parallel within a commercial towel rail. What is the total resistance of this circuit arrangement?",
    "options": [
      "20 Ω",
      "80 Ω",
      "40 Ω",
      "1600 Ω"
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
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (Rt = R/n). 40 / 2 = 20 Ω."
  },
  {
    "id": 4042,
    "question": "In a series-connected control circuit containing three safety limit switches, which of the following statements correctly describes the current flow?",
    "options": [
      "The current remains the same at all points in the circuit",
      "The current divides equally between the three switches",
      "The current decreases significantly after passing through each switch",
      "The current is highest at the first switch and lowest at the last"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path for current to flow, meaning the current value is identical at any point in the loop."
  },
  {
    "id": 4043,
    "question": "A domestic kitchen is wired with a 32A ring final circuit. What is the primary advantage of using a ring topology rather than a radial topology for this high-load area?",
    "options": [
      "It allows the use of smaller cable (2.5mm²) to deliver a higher total load",
      "It uses significantly less cable overall than a radial circuit",
      "It is easier to identify and locate faults within the circuit",
      "It prevents the entire circuit from failing if one socket is damaged"
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
      "terminology",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A ring final circuit provides two paths for current, effectively doubling the current-carrying capacity of the cable, allowing 2.5mm² cable to be protected by a 32A device."
  },
  {
    "id": 4044,
    "question": "Three identical 15 Ω indicator lamps are connected in series across a 230V supply in a control panel. What is the approximate voltage drop across each individual lamp?",
    "options": [
      "76.7 V",
      "230 V",
      "45 V",
      "15.3 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a series circuit with identical loads, the supply voltage is divided equally across them. 230V / 3 lamps = 76.67V."
  },
  {
    "id": 4045,
    "question": "When installing a radial circuit for domestic lighting, how are the individual light fittings typically connected relative to each other?",
    "options": [
      "In parallel",
      "In series",
      "In a ring",
      "In a series-parallel hybrid"
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
      "parallel",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Standard lighting circuits are radial in their layout from the consumer unit, but the lamps themselves must be in parallel so they all receive the full supply voltage and operate independently."
  },
  {
    "id": 4046,
    "question": "A parallel lighting circuit contains five 40W LED panels. If the total power consumed is 200W at 230V, what is the total current flowing from the source?",
    "options": [
      "0.87 A",
      "0.17 A",
      "4.35 A",
      "1.15 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total current I = P / V. 200W / 230V = 0.869A."
  },
  {
    "id": 4047,
    "question": "Why is it critical to maintain physical separation between data/communication cables and power cables in a trunking system?",
    "options": [
      "To prevent electromagnetic interference (EMI) affecting data signals",
      "To prevent the data cables from overheating due to power cable resistance",
      "Because data cables operate at much higher frequencies than 50Hz",
      "To ensure the voltage drop in data cables is kept to a minimum"
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
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables generate electromagnetic fields that can induce noise and errors (interference) into sensitive data and communication signals."
  },
  {
    "id": 4048,
    "question": "A 230V electric heater is rated at 2.3 kW. What is the internal resistance of the heating element?",
    "options": [
      "23 Ω",
      "10 Ω",
      "529 Ω",
      "0.1 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_I_V_R",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find current: I = P/V = 2300/230 = 10A. Then R = V/I = 230/10 = 23 Ω. Alternatively, R = V²/P."
  },
  {
    "id": 4049,
    "question": "In a commercial building, an 'emergency maintained' lighting fitting is one that:",
    "options": [
      "Operates at all times during normal use and emergency power failure",
      "Only illuminates when the main power supply fails",
      "Is used only to illuminate fire exit signage during the day",
      "Requires manual switching to activate during an emergency"
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
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Maintained emergency fittings are designed to be on under normal conditions and remain on (via battery) if the mains power fails."
  },
  {
    "id": 4050,
    "question": "An electrician measures the end-to-end resistance of the line conductor (r1) in a ring final circuit as 0.8 Ω. If the neutral conductor (rn) is also 0.8 Ω, what is the expected (R1 + Rn) reading at the mid-point of the ring?",
    "options": [
      "0.4 Ω",
      "1.6 Ω",
      "0.8 Ω",
      "3.2 Ω"
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
      "parallel",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "In a ring final circuit, the (R1+Rn) reading at the furthest point is (r1 + rn) / 4. Here: (0.8 + 0.8) / 4 = 1.6 / 4 = 0.4 Ω."
  },
  {
    "id": 4051,
    "question": "A ring final circuit protected by a 32A circuit breaker has a continuity fault where the line conductor is broken at one socket. What is the primary risk when high-current appliances are used on this circuit?",
    "options": [
      "The remaining conductor path may become overloaded and overheat",
      "The circuit breaker will trip immediately upon switching on a load",
      "The voltage at the sockets will double due to the loss of a path",
      "The circuit will automatically convert into a parallel-star topology"
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
      "application",
      "current-rule",
      "legislation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the current splits between two paths. If the ring is broken, it becomes a long radial circuit. While it may still function, the conductors are no longer sharing the load, which can lead to the remaining leg carrying more than its rated current, causing overheating without tripping the 32A breaker."
  },
  {
    "id": 4052,
    "question": "A radial lighting circuit contains four identical LED lamps connected in parallel. If each lamp has an equivalent resistance of 1,200 Ω when operating, what is the total resistance (Rt) of the load?",
    "options": [
      "300 Ω",
      "4,800 Ω",
      "1,200 Ω",
      "0.0033 Ω"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For identical resistors in parallel, Rt = R / n. Therefore, 1,200 Ω / 4 = 300 Ω. Using the series rule (adding them) is a common error in parallel circuit calculations."
  },
  {
    "id": 4053,
    "question": "Which type of circuit is specifically designed to operate at Extra Low Voltage (ELV) to ensure minimal electromagnetic interference and high signal integrity for building management?",
    "options": [
      "Data and communications circuits",
      "Immersion heater radial circuits",
      "Emergency lighting central battery circuits",
      "Ring final power circuits"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Data and communications circuits (such as Cat6 or KNX) operate at Extra Low Voltage to prevent interference and safely handle signal transmission throughout a building."
  },
  {
    "id": 4054,
    "question": "A 230V radial circuit supplies a 3kW heater. If the circuit conductors have a total resistance of 0.4 Ω, what is the voltage drop across the cables when the heater is running at its rated current of 13A?",
    "options": [
      "5.2 V",
      "32.5 V",
      "224.8 V",
      "0.03 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
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
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Voltage drop (V) = I × R. Using the values provided: 13A × 0.4 Ω = 5.2 V. Distractor 224.8V represents the voltage remaining at the load, not the drop itself."
  },
  {
    "id": 4055,
    "question": "In a standard, healthy 32A ring final circuit, a 24A load is connected at a point exactly 25% of the way along the ring's length from the consumer unit. How much current will flow through the shorter leg of the ring?",
    "options": [
      "18 A",
      "12 A",
      "6 A",
      "24 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "In a parallel circuit (which a ring is), current is inversely proportional to resistance. The shorter leg (25% length) has 1/3 the resistance of the longer leg (75% length). Therefore, the shorter leg carries 3/4 of the total current: 24A × 0.75 = 18A."
  },
  {
    "id": 4056,
    "question": "A radial power circuit supplies two industrial heaters connected in parallel. Heater A has a resistance of 20Ω and Heater B has a resistance of 30Ω. The circuit is supplied via a cable with a total resistance of 0.5Ω. Calculate the total resistance of the entire circuit.",
    "options": [
      "12.5Ω",
      "50.5Ω",
      "0.52Ω",
      "12.0Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "mixed-circuit"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "First, calculate the parallel resistance of the heaters: (20 * 30) / (20 + 30) = 12Ω. Then add the series resistance of the cable: 12 + 0.5 = 12.5Ω."
  },
  {
    "id": 4057,
    "question": "In a standard ring final circuit, what is the theoretical effect on the total resistance measured at the distribution board if the ring is accidentally broken at the exact midpoint of the circuit?",
    "options": [
      "The resistance quadruples compared to the healthy ring value",
      "The resistance remains exactly the same as current still reaches all points",
      "The resistance is halved because there is only one path for current",
      "The resistance becomes zero because the loop is no longer complete"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "parallel",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "A ring final circuit is two parallel paths. If broken at the midpoint, it becomes two radial legs. The resistance of a healthy ring is (r1/4). A single radial leg of the same length is (r1/2). However, if the ring is broken, the total circuit resistance seen from the board effectively increases by a factor of 4 compared to the parallel ring configuration."
  },
  {
    "id": 4058,
    "question": "A 230V radial lighting circuit supplies four 115W lamps. If the total circuit cable resistance is 1.2Ω, calculate the total voltage drop at the end of the circuit when all lamps are operating simultaneously.",
    "options": [
      "2.40V",
      "0.60V",
      "9.60V",
      "1.20V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_I_V_R"
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
    "difficulty": 4,
    "estimatedTime": 150,
    "explanation": "Total Power = 4 * 115W = 460W. Total Current (I) = P / V = 460 / 230 = 2A. Voltage Drop = I * R = 2A * 1.2Ω = 2.4V."
  },
  {
    "id": 4059,
    "question": "An electrician is designing a control circuit for a conveyor system. To ensure safety, three 'Emergency Stop' buttons must be installed so that pressing any one of them will immediately disconnect the motor. How should these buttons be wired?",
    "options": [
      "Normally closed (NC) contacts wired in series",
      "Normally open (NO) contacts wired in parallel",
      "Normally closed (NC) contacts wired in parallel",
      "Normally open (NO) contacts wired in series"
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
      "series",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "For safety, Emergency Stops use Normally Closed contacts in series. If any button is pressed (or a wire breaks), the circuit opens and the motor stops (fail-safe)."
  },
  {
    "id": 4060,
    "question": "A heating bank consists of three 2.3kW elements connected in parallel to a 230V supply. Calculate the total current drawn by the circuit and the resistance of a single element.",
    "options": [
      "30A and 23Ω",
      "10A and 23Ω",
      "30A and 7.6Ω",
      "10A and 69Ω"
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
      "power",
      "parallel"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Current per element = 2300W / 230V = 10A. Total current (parallel) = 10A * 3 = 30A. Resistance per element = 230V / 10A = 23Ω."
  },
  {
    "id": 4061,
    "question": "When installing data and communication circuits alongside power circuits, which phenomenon is the primary reason for maintaining physical separation or using shielded cabling?",
    "options": [
      "Electromagnetic Induction",
      "Thermal radiation from power cables",
      "Voltage drop in the data signal",
      "Current leakage through the insulation"
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
      "electromagnetic-induction",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "AC power cables create fluctuating magnetic fields that can induce unwanted noise (EMI) into nearby data cables through electromagnetic induction, corrupting signals."
  },
  {
    "id": 4062,
    "question": "A ring final circuit has an end-to-end line conductor resistance (r1) of 0.8Ω. After cross-connecting the ends at the distribution board (forming the figure-of-eight), what is the expected resistance (R1) measured between Line and Neutral at the furthest socket?",
    "options": [
      "0.2Ω",
      "0.4Ω",
      "0.8Ω",
      "1.6Ω"
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
      "calculation",
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "In a correctly cross-connected ring final circuit, the resistance at any point (R1) is equal to the end-to-end resistance (r1) divided by 4. So, 0.8Ω / 4 = 0.2Ω."
  },
  {
    "id": 4063,
    "question": "A commercial building requires an emergency lighting system where the lamps are energized at all times from the mains supply and switch to a battery backup during a power failure. This is classified as:",
    "options": [
      "Maintained emergency lighting",
      "Non-maintained emergency lighting",
      "Sustained emergency lighting",
      "Combined emergency lighting"
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
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Maintained lighting operates at all times (normal and emergency). Non-maintained only operates when the mains power fails."
  },
  {
    "id": 4064,
    "question": "A 24V DC control circuit contains a relay coil with a resistance of 100Ω. This coil is connected in series with two parallel-connected indicator lamps, each having a resistance of 200Ω. Calculate the total current flowing from the supply.",
    "options": [
      "0.12A",
      "0.048A",
      "0.24A",
      "0.08A"
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
    "explanation": "Parallel lamps: (200 * 200) / (200 + 200) = 100Ω. Total circuit resistance = 100Ω (relay) + 100Ω (lamps) = 200Ω. Current = V / R = 24 / 200 = 0.12A."
  },
  {
    "id": 4065,
    "question": "What is the primary technical advantage of utilizing a ring final circuit topology for socket outlets in a domestic installation compared to a radial circuit using the same cable size?",
    "options": [
      "It allows a higher total current demand by providing two paths for the load",
      "It reduces the total amount of cable required for the installation",
      "It makes the identification of faults easier during periodic inspection",
      "It eliminates the need for a separate circuit protective conductor (CPC)"
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
      "parallel",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A ring final circuit allows the load current to split and travel along two paths, effectively increasing the current-carrying capacity beyond what a single radial cable of the same size could safely handle."
  }
];
