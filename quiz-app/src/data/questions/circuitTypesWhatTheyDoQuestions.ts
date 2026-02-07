import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A1 learning outcomes
 * Generated: 2026-02-07
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the total resistance of a circuit containing two 15 Ω resistors connected in series?",
    "options": [
      "30 Ω",
      "7.5 Ω",
      "225 Ω",
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
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is found by adding the individual resistances together (R1 + R2)."
  },
  {
    "id": 4017,
    "question": "Which of the following statements is true regarding the current in a series circuit?",
    "options": [
      "The current is the same at all points in the circuit",
      "The current splits between the different components",
      "The current increases as it passes through each resistor",
      "The current is higher at the end of the circuit than the start"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
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
    "explanation": "In a series circuit, there is only one path for current to flow, so the current remains the same at any point."
  },
  {
    "id": 4018,
    "question": "Which circuit arrangement is characterized by the conductors forming a complete loop, starting and ending at the consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Parallel branch circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is a specific UK wiring arrangement where the circuit returns to its point of origin, forming a loop."
  },
  {
    "id": 4019,
    "question": "What is the total resistance of two 10 Ω resistors connected in parallel?",
    "options": [
      "5 Ω",
      "20 Ω",
      "100 Ω",
      "10 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
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
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (R/n)."
  },
  {
    "id": 4020,
    "question": "Domestic lighting circuits are most commonly wired using which type of circuit arrangement?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Closed loop circuit"
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
      "discrimination",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Lighting circuits in the UK are almost exclusively wired as radial circuits, where the cable runs from the consumer unit to the last point without returning."
  },
  {
    "id": 4021,
    "question": "If two identical resistors are connected in series across a 230 V supply, what will be the voltage drop across each resistor?",
    "options": [
      "115 V",
      "230 V",
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
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit with identical loads, the supply voltage is shared equally between them (230V / 2 = 115V)."
  },
  {
    "id": 4022,
    "question": "Which circuit type is typically used for a single high-power appliance, such as an electric oven or shower?",
    "options": [
      "Dedicated radial circuit",
      "Ring final circuit",
      "Data circuit",
      "Control circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
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
    "explanation": "High-power appliances require their own dedicated radial circuit to handle the large current demand independently of other loads."
  },
  {
    "id": 4023,
    "question": "A parallel circuit has two branches. Branch A draws 4 A and Branch B draws 6 A. What is the total current supplied to the circuit?",
    "options": [
      "10 A",
      "2 A",
      "24 A",
      "5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
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
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each individual branch (4A + 6A = 10A)."
  },
  {
    "id": 4024,
    "question": "In a parallel circuit, the voltage across each branch is:",
    "options": [
      "The same as the supply voltage",
      "Divided by the number of branches",
      "Always 0 V at the end of the branch",
      "Double the supply voltage"
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
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, every branch is connected directly across the supply, so they all receive full supply voltage."
  },
  {
    "id": 4025,
    "question": "A series circuit consists of two lamps. The voltage across Lamp 1 is 100 V and the voltage across Lamp 2 is 130 V. What is the total supply voltage?",
    "options": [
      "230 V",
      "30 V",
      "13000 V",
      "115 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
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
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total supply voltage is the sum of the individual voltage drops across the loads (100V + 130V = 230V)."
  },
  {
    "id": 4026,
    "question": "In a domestic electrical installation, which circuit type forms a loop that begins and ends at the same terminals in the consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Parallel circuit",
      "Series circuit"
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
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because the line, neutral, and CPC conductors form a continuous loop that starts and returns to the same point in the distribution board."
  },
  {
    "id": 4027,
    "question": "A series circuit consists of two heating elements with resistance values of 20 Ω and 30 Ω. What is the total resistance of the circuit?",
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
    "category": "Circuit Rules",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is found by adding the individual resistances together (Rt = R1 + R2)."
  },
  {
    "id": 4028,
    "question": "If three identical lamps are connected in a parallel circuit to a 230V supply, what is the voltage across each individual lamp?",
    "options": [
      "230V",
      "76.7V",
      "0V",
      "690V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch remains the same as the supply voltage."
  },
  {
    "id": 4029,
    "question": "A series circuit with a total resistance of 50 Ω is connected to a 230V supply. What is the total current flowing through the circuit?",
    "options": [
      "4.6 A",
      "11500 A",
      "0.21 A",
      "180 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), the current is calculated as 230V / 50 Ω = 4.6 A."
  },
  {
    "id": 4030,
    "question": "Which type of circuit is most commonly used to supply a single high-power appliance, such as an electric shower?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Loop-in circuit"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Radial circuits are used for dedicated supplies to single items of equipment like cookers, showers, or water heaters."
  },
  {
    "id": 4031,
    "question": "A ring final circuit is protected by a 32A circuit breaker. If a single 20A load is connected exactly at the midpoint of the ring, what is the theoretical current flowing through each of the two legs of the ring back to the consumer unit?",
    "options": [
      "10 A",
      "20 A",
      "40 A",
      "5 A"
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
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a ring final circuit, the current has two paths to follow. If the load is at the midpoint, the resistance of each path is equal, so the 20A load splits equally into 10A per leg."
  },
  {
    "id": 4032,
    "question": "Which of the following is a primary reason for using a ring final circuit topology rather than a radial circuit for socket outlets in a domestic installation?",
    "options": [
      "It allows for a higher total load using smaller cross-sectional area conductors",
      "It makes the initial verification and continuity testing much simpler",
      "It ensures that the voltage at the furthest point is always 230V exactly",
      "It prevents the circuit from functioning if there is a single loose connection"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONCEPTUAL_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "By providing two paths for the current, a ring circuit allows for a 32A load using 2.5mm² cables, which would typically only handle approximately 20-27A in a radial configuration depending on installation method."
  },
  {
    "id": 4033,
    "question": "An electrician is wiring a lighting circuit for a long hallway that requires switching from three separate locations. Which combination of switches must be used?",
    "options": [
      "Two 2-way switches and one intermediate switch",
      "Three 2-way switches",
      "Three 1-way switches",
      "One 2-way switch and two intermediate switches"
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
      "application",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "To control a light from more than two points, intermediate switches are placed between two 2-way switches. For three points: 2-way + intermediate + 2-way."
  },
  {
    "id": 4034,
    "question": "A heating system uses two resistive elements connected in series. If each element has a resistance of 25 Ω, what is the total resistance of the circuit?",
    "options": [
      "50 Ω",
      "12.5 Ω",
      "625 Ω",
      "25 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances: Rt = R1 + R2. Therefore, 25 + 25 = 50 Ω."
  },
  {
    "id": 4035,
    "question": "What is the defining characteristic of a 'non-maintained' emergency lighting circuit?",
    "options": [
      "The lamps only illuminate when the normal mains power supply fails",
      "The lamps are illuminated at all times, whether the mains is on or off",
      "The circuit does not require a battery backup system",
      "The circuit is only used for external security lighting"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONCEPTUAL_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lights are designed to turn on only when the local mains power supply fails. Maintained lights are on all the time."
  },
  {
    "id": 4036,
    "question": "A radial lighting circuit has three LED panels connected in parallel. If the currents drawn by the panels are 0.2A, 0.3A, and 0.5A respectively, what is the total current drawn from the supply?",
    "options": [
      "1.0 A",
      "0.2 A",
      "0.5 A",
      "0.03 A"
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
      "current-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the individual branch currents: It = I1 + I2 + I3. 0.2 + 0.3 + 0.5 = 1.0 A."
  },
  {
    "id": 4037,
    "question": "When installing data and communication cables alongside power circuits, why is physical separation or screening required?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables affecting data signals",
      "To prevent the data cables from overheating the power cables",
      "Because data cables operate at a much higher frequency than 50Hz",
      "To ensure the data cables do not increase the earth fault loop impedance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONCEPTUAL_ERROR",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Power cables create electromagnetic fields that can induce noise (interference) into data cables if they are too close, potentially corrupting data signals."
  },
  {
    "id": 4038,
    "question": "A radial circuit for a small heater has a total circuit resistance (line and neutral) of 0.4 Ω. If the heater draws 15 A, calculate the voltage drop across the circuit conductors.",
    "options": [
      "6.0 V",
      "37.5 V",
      "0.026 V",
      "15.4 V"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Voltage drop is calculated using Ohm's Law (V = I x R). 15 A x 0.4 Ω = 6.0 V."
  },
  {
    "id": 4039,
    "question": "In a control circuit for a large motor starter, why is a lower voltage (e.g., 24V or 110V) often used for the control wiring instead of the full 400V supply?",
    "options": [
      "To improve safety for operators and technicians during maintenance",
      "Because low voltage cables have higher mechanical strength",
      "To increase the speed at which the motor starts",
      "Because 24V components are more expensive and durable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONCEPTUAL_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Extra Low Voltage (ELV) or reduced voltage for control circuits reduces the risk of electric shock for operators and maintenance staff."
  },
  {
    "id": 4040,
    "question": "Two 2kW electric heaters are connected in parallel to a 230V supply. What is the total power consumed by the circuit?",
    "options": [
      "4 kW",
      "1 kW",
      "2 kW",
      "8 kW"
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
      "calculation",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, total power is the sum of the power of each individual load. 2kW + 2kW = 4kW."
  },
  {
    "id": 4041,
    "question": "A radial circuit supplies two 1150 W heaters connected in parallel. If the supply voltage is 230 V, what is the total current drawn by the circuit?",
    "options": [
      "10 A",
      "5 A",
      "20 A",
      "2.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "parallel"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Total power (P) = 1150 W + 1150 W = 2300 W. Using I = P / V, 2300 W / 230 V = 10 A."
  },
  {
    "id": 4042,
    "question": "Why is a ring final circuit topology typically used for domestic socket outlet circuits in the UK?",
    "options": [
      "It allows for a smaller conductor cross-sectional area by providing two paths for current",
      "It ensures that voltage increases at the furthest point from the consumer unit",
      "It prevents the entire circuit from losing power if there is a break in the ring",
      "It allows the circuit to be protected by a 6 A circuit breaker while serving sockets"
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
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit splits the current between two paths, allowing the use of 2.5mm² conductors for a 32A circuit where a radial would require larger cables."
  },
  {
    "id": 4043,
    "question": "An electrician measures the end-to-end resistance (r1) of the line conductor in a ring final circuit as 0.60 Ω. Assuming the neutral conductor is the same size, what is the expected resistance (R1+Rn) at a socket at the furthest point?",
    "options": [
      "0.30 Ω",
      "1.20 Ω",
      "0.60 Ω",
      "0.15 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "DIVIDED_INSTEAD"
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
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For a ring final with equal sized conductors, the resistance at the furthest point is (r1 + rn) / 4. Here, (0.60 + 0.60) / 4 = 0.30 Ω."
  },
  {
    "id": 4044,
    "question": "A commercial kitchen requires a dedicated circuit for a 6 kW electric oven. Which circuit type and protective device rating is most appropriate for a 230 V supply?",
    "options": [
      "A 32 A radial circuit",
      "A 13 A ring final circuit",
      "A 20 A radial circuit",
      "A 6 A lighting circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Current I = P / V. 6000 W / 230 V ≈ 26.1 A. A 32 A radial circuit is the standard choice for this load."
  },
  {
    "id": 4045,
    "question": "What is the primary reason for keeping data communication cables (Cat6) physically separated from 230 V power cables in an installation?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals",
      "To prevent data cables from drawing excess current from the power circuit",
      "Because data cables carry high-frequency AC which would overheat power cables",
      "To ensure the data cables do not exceed their maximum voltage drop limit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_WITH_DC",
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
    "explanation": "Power cables generate electromagnetic fields that can induce noise (EMI) into data cables, leading to data loss or corruption."
  },
  {
    "id": 4046,
    "question": "A lighting radial circuit contains twelve 10 W LED downlights. Calculate the total current for this circuit at a nominal voltage of 230 V.",
    "options": [
      "0.52 A",
      "1.91 A",
      "120 A",
      "0.04 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "UNITS_MISSING",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Total Power = 12 * 10 W = 120 W. Current I = P / V = 120 / 230 = 0.5217 A."
  },
  {
    "id": 4047,
    "question": "Which statement correctly describes a 'maintained' emergency lighting system?",
    "options": [
      "The emergency lamps are lit at all times, including during normal supply",
      "The lamps only switch on when the local mains supply fails",
      "The circuit must be manually reset every time the power is turned off",
      "The circuit uses high-voltage DC to ensure the batteries charge faster"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
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
    "explanation": "Maintained emergency lighting operates like a normal light but stays on (via battery) if the power fails. Non-maintained only turns on when power fails."
  },
  {
    "id": 4048,
    "question": "A 230 V radial circuit supplies a single load with a resistance of 46 Ω. If the cable resistance adds another 4 Ω to the circuit, what is the total current flowing?",
    "options": [
      "4.6 A",
      "5.0 A",
      "57.5 A",
      "0.2 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "series"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Total Resistance Rt = 46 Ω + 4 Ω = 50 Ω. Current I = V / Rt = 230 / 50 = 4.6 A."
  },
  {
    "id": 4049,
    "question": "A control circuit for a motor starter typically uses a lower voltage than the motor itself. What is a primary benefit of this arrangement?",
    "options": [
      "It reduces the risk of electric shock for operators using the start/stop buttons",
      "It allows the motor to run at a higher RPM than the supply frequency",
      "It converts the AC supply into DC to increase the motor's torque",
      "It eliminates the need for an over-current protective device"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "health-safety",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Using Extra Low Voltage (ELV) for control circuits (like push buttons) improves safety for the user compared to switching full mains voltage."
  },
  {
    "id": 4050,
    "question": "A workshop has three machines connected in parallel to a 230 V radial circuit. Their resistances are 100 Ω, 50 Ω, and 50 Ω. Calculate the total resistance of the load.",
    "options": [
      "20 Ω",
      "200 Ω",
      "0.05 Ω",
      "33.3 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "ROUNDING_ERROR"
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
    "explanation": "1/Rt = 1/100 + 1/50 + 1/50 = 0.01 + 0.02 + 0.02 = 0.05. Rt = 1 / 0.05 = 20 Ω."
  },
  {
    "id": 4051,
    "question": "An electrician is installing a ring final circuit for socket outlets in a domestic property. What is the primary functional reason for returning the end of the circuit conductors back to the same terminals in the consumer unit?",
    "options": [
      "To provide two paths for current, effectively increasing the current-carrying capacity of the cable",
      "To make the circuit easier to test and identify faults compared to a radial circuit",
      "To ensure that if one socket fails, the rest of the circuit remains energized",
      "To reduce the total amount of cable required for the installation"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A ring final circuit creates a parallel path for the current. By connecting both ends to the same protective device, the load is shared across two directions, allowing a higher total current (e.g., 32A) than the cable's individual rating (e.g., 20A) would typically allow in a radial format."
  },
  {
    "id": 4052,
    "question": "A series-connected decorative lighting string contains 20 lamps. If the total resistance of the string is 400 Ω and the supply voltage is 230 V, what is the voltage drop across each individual lamp, assuming they are of identical resistance?",
    "options": [
      "11.5 V",
      "20.0 V",
      "230 V",
      "4.6 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit, the total voltage is shared across the components. For identical components, V_lamp = V_total / number of lamps. 230V / 20 = 11.5V."
  },
  {
    "id": 4053,
    "question": "A radial power circuit supplies two separate heaters connected in parallel. Heater A has a resistance of 46 Ω and Heater B has a resistance of 23 Ω. When connected to a 230 V supply, what is the total current drawn by the circuit?",
    "options": [
      "15 A",
      "5 A",
      "10 A",
      "69 A"
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
      "parallel",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, calculate individual currents: I_A = 230/46 = 5A. I_B = 230/23 = 10A. In a parallel circuit, total current is the sum of branch currents: 5A + 10A = 15A."
  },
  {
    "id": 4054,
    "question": "Which of the following best describes the purpose of a 'control circuit' within an industrial motor starter installation?",
    "options": [
      "To use a low-current signal to safely switch a high-current power circuit via a contactor",
      "To provide the main energy path required to turn the motor's rotor",
      "To protect the motor from short-circuits using high-speed fuses",
      "To step up the voltage from the mains to the motor operating level"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are designed to manage the operation of power circuits. Using a low-current control circuit (often at a lower, safer voltage) to operate a contactor coil allows for the safe switching of large electrical loads."
  },
  {
    "id": 4055,
    "question": "A 230 V radial circuit for a remote workshop has a total cable resistance of 0.4 Ω. If a load is connected that draws 25 A, what will be the actual voltage available at the load terminals?",
    "options": [
      "220 V",
      "10 V",
      "230 V",
      "240 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "TOPOLOGY_CONFUSION",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, calculate voltage drop (V_d) using V = I x R: 25A x 0.4Ω = 10V. The voltage at the load is the supply voltage minus the drop: 230V - 10V = 220V."
  },
  {
    "id": 4056,
    "question": "A mixed circuit consists of a 10 Ω resistor in series with a parallel combination of a 20 Ω and a 30 Ω resistor. If the circuit is supplied by 110 V DC, what is the total current flowing from the source?",
    "options": [
      "5.0 A",
      "1.83 A",
      "11.0 A",
      "2.75 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "USED_PARALLEL_RULE",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "mixed-circuit",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First, calculate the parallel branch: (20 * 30) / (20 + 30) = 600 / 50 = 12 Ω. Then add the series resistor: 12 + 10 = 22 Ω total resistance. Finally, I = V / R = 110 / 22 = 5 A."
  },
  {
    "id": 4057,
    "question": "In a standard UK 32 A ring final circuit, a single 3 kW load is connected exactly at the mid-point of the ring. If the line conductor has an end-to-end resistance (r1) of 0.6 Ω, what is the voltage drop at the socket under this load?",
    "options": [
      "1.95 V",
      "7.82 V",
      "3.91 V",
      "15.65 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "The resistance to the mid-point of a ring is (r1 / 4). R = 0.6 / 4 = 0.15 Ω. Current I = P / V = 3000 / 230 ≈ 13.04 A. Voltage drop V = I * R = 13.04 * 0.15 = 1.956 V."
  },
  {
    "id": 4058,
    "question": "Which of the following describes the primary functional reason for utilizing a 'control circuit' using an ELV (Extra Low Voltage) relay to switch a 400 V industrial motor?",
    "options": [
      "To allow safe operator interface and reduce the size of switching components at the control station",
      "To increase the starting torque of the motor by reducing initial voltage",
      "To ensure the motor runs in a clockwise direction by default",
      "To convert the AC supply into DC for smoother motor operation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "relays",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Control circuits use lower voltages/currents to safely switch larger loads, protecting the operator from high voltages and allowing for smaller, cheaper control switches."
  },
  {
    "id": 4059,
    "question": "A radial circuit supplies three 2 kW heaters connected in parallel. If the circuit voltage is 230 V and the heaters are left on for 4 hours, what is the total energy consumed in kWh?",
    "options": [
      "24 kWh",
      "8 kWh",
      "6 kWh",
      "1.5 kWh"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "power",
      "energy",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total power P = 2 kW + 2 kW + 2 kW = 6 kW. Energy = Power * Time = 6 kW * 4 hours = 24 kWh."
  },
  {
    "id": 4060,
    "question": "When designing a data and communications circuit installation near power cables, why is physical separation or the use of screened cables required according to BS 7671?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables affecting signal integrity",
      "To prevent the data cables from overheating due to the power cables' magnetic field",
      "To ensure the data cables do not increase the resistance of the power circuit",
      "To allow the data cables to use the power cable's CPC as a functional earth"
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
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Power cables generate electromagnetic fields that can induce noise (EMI) into sensitive data cables, causing data loss or corruption."
  },
  {
    "id": 4061,
    "question": "An electrician is installing an emergency stop circuit for a conveyor belt. How should the multiple N/C (Normally Closed) emergency stop buttons be connected relative to each other?",
    "options": [
      "In series with the contactor coil",
      "In parallel with the contactor coil",
      "In series with the motor supply phases",
      "In parallel with the start button"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "relays",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Emergency stop buttons must be N/C and wired in series so that if any button is pressed (or a wire breaks), the circuit opens and the contactor drops out, stopping the machine."
  },
  {
    "id": 4062,
    "question": "A lighting circuit is wired as a radial. If there are 8 LED luminaires each rated at 15 W on a 230 V supply, what is the total current drawn by the circuit (ignoring power factor)?",
    "options": [
      "0.52 A",
      "0.065 A",
      "120 A",
      "1.84 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power = 8 * 15 W = 120 W. Current I = P / V = 120 / 230 ≈ 0.5217 A."
  },
  {
    "id": 4063,
    "question": "A large warehouse uses a 400 V three-phase radial circuit for space heating. If one 6 kW heater is connected across L1 and L2, what is the current flowing through that specific branch?",
    "options": [
      "15.0 A",
      "26.1 A",
      "8.7 A",
      "10.4 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "For a single-phase load connected line-to-line on a three-phase system, I = P / V_line. I = 6000 / 400 = 15 A."
  },
  {
    "id": 4064,
    "question": "Which specific advantage does a 'Ring Final' circuit offer over a 'Radial' circuit when using the same cross-sectional area of cable for socket outlets?",
    "options": [
      "It allows for a higher total load current by providing two paths for current to flow",
      "It eliminates the risk of an open-circuit fault affecting the whole circuit",
      "It reduces the total length of cable required for the installation",
      "It automatically balances the load across all phases of the supply"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A ring circuit effectively doubles the current-carrying capacity of the cable (under ideal conditions) because the current has two paths to reach the load."
  },
  {
    "id": 4065,
    "question": "Calculate the total resistance of a circuit where a 5 Ω resistor is in series with a parallel group of three 15 Ω resistors.",
    "options": [
      "10 Ω",
      "50 Ω",
      "1.67 Ω",
      "20 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "USED_PARALLEL_RULE",
      "3": "RECIPROCAL_ERROR"
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
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Parallel part: 1 / (1/15 + 1/15 + 1/15) = 15 / 3 = 5 Ω. Total Resistance = Series + Parallel = 5 + 5 = 10 Ω."
  }
];
