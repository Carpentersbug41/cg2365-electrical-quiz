import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A1 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the defining characteristic of a ring final circuit in a domestic installation?",
    "options": [
      "The circuit conductors start and finish at the same point in the distribution board",
      "The circuit conductors terminate at the last socket outlet in a single line",
      "The circuit is only used for high-power heating appliances",
      "The circuit uses a single path for both live and neutral currents"
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
      "ring-final",
      "topology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because the circuit conductors form a continuous loop, starting and ending at the same terminals in the consumer unit."
  },
  {
    "id": 4017,
    "question": "Two resistors with values of 15 Ω and 25 Ω are connected in a series circuit. What is the total resistance?",
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
    "category": "Circuit Rules",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances: 15 + 25 = 40 Ω."
  },
  {
    "id": 4018,
    "question": "In a parallel circuit containing two identical 20 Ω heating elements, what is the total resistance of the circuit?",
    "options": [
      "10 Ω",
      "40 Ω",
      "400 Ω",
      "0.1 Ω"
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (R/n), so 20 / 2 = 10 Ω."
  },
  {
    "id": 4019,
    "question": "Which of the following statements is true regarding current in a series circuit?",
    "options": [
      "The current remains the same at all points in the circuit",
      "The current is divided between the different branches",
      "The current increases as it passes through each resistor",
      "The current decreases as it moves further from the source"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the current to flow, meaning the current value is identical at every point."
  },
  {
    "id": 4020,
    "question": "An electrician is installing a standard radial circuit for domestic lighting. What is the most common rating for the circuit breaker (MCB) used for this circuit?",
    "options": [
      "6 A",
      "32 A",
      "13 A",
      "100 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "radial",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Standard domestic lighting circuits in the UK typically use a 6 Amp circuit breaker to protect the cables and accessories."
  },
  {
    "id": 4021,
    "question": "A series circuit has two components. If the voltage drop across the first component is 110 V and the voltage drop across the second is 120 V, what is the total supply voltage?",
    "options": [
      "230 V",
      "10 V",
      "115 V",
      "13200 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "ROUNDING_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the sum of the individual voltage drops equals the total supply voltage: 110 + 120 = 230 V."
  },
  {
    "id": 4022,
    "question": "What happens to the voltage across individual loads when they are connected in a parallel circuit?",
    "options": [
      "The voltage across each load is the same as the supply voltage",
      "The voltage is shared proportionally between the loads",
      "The voltage increases with the number of loads added",
      "The voltage drops to zero at the end of the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, every branch is connected directly across the supply, so each load receives the full supply voltage."
  },
  {
    "id": 4023,
    "question": "A parallel circuit has two branches. Branch 1 draws 4 A and Branch 2 draws 6 A. What is the total current taken from the supply?",
    "options": [
      "10 A",
      "2 A",
      "24 A",
      "2.4 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each individual branch: 4 + 6 = 10 A."
  },
  {
    "id": 4024,
    "question": "Which type of circuit is typically used for specialized data and communication systems in an office environment?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Three-phase motor circuit"
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
      "radial",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Data and communication systems usually use radial topologies where each outlet has a dedicated cable back to a central hub or switch."
  },
  {
    "id": 4025,
    "question": "A simple 230 V circuit has a total resistance of 10 Ω. Using Ohm's Law, calculate the current flowing in the circuit.",
    "options": [
      "23 A",
      "2300 A",
      "0.043 A",
      "220 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Rules",
    "tags": [
      "ohms-law",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using Ohm's Law (I = V / R), the current is 230 V / 10 Ω = 23 A."
  },
  {
    "id": 4026,
    "question": "What is the defining characteristic of a ring final circuit topology as used in UK domestic installations?",
    "options": [
      "The circuit conductors form a loop, returning to the same protective device in the consumer unit",
      "The circuit is a single run of cable that ends at the last point of utilization",
      "The circuit is connected in series so that if one socket fails, all others lose power",
      "The circuit is only used for lighting and is restricted to a maximum of 6 amps"
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
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is characterized by the phase and neutral conductors forming a continuous loop that starts and finishes at the same point in the distribution board."
  },
  {
    "id": 4027,
    "question": "A series control circuit contains two relay coils with resistances of 120 Ω and 80 Ω. What is the total resistance of this circuit?",
    "options": [
      "200 Ω",
      "48 Ω",
      "9600 Ω",
      "40 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is found by simply adding the individual resistances (120 + 80 = 200)."
  },
  {
    "id": 4028,
    "question": "Which type of circuit is specifically installed to ensure safe egress from a building during a total loss of the local mains supply?",
    "options": [
      "Emergency lighting circuit",
      "Ring final power circuit",
      "Data and communications circuit",
      "Radial heating circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Emergency lighting circuits are designed to provide illumination when the normal power supply fails, allowing occupants to exit a building safely."
  },
  {
    "id": 4029,
    "question": "An electrician measures a current of 4 A flowing through a radial circuit with a total circuit resistance of 3 Ω. Calculate the voltage drop across the circuit.",
    "options": [
      "12 V",
      "1.33 V",
      "0.75 V",
      "7 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (V = I x R), the voltage drop is 4 A multiplied by 3 Ω, which equals 12 V."
  },
  {
    "id": 4030,
    "question": "Two identical 50 Ω heating elements are connected in parallel within a water heater. What is the total resistance of the combined elements?",
    "options": [
      "25 Ω",
      "100 Ω",
      "2500 Ω",
      "50 Ω"
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
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (50 / 2 = 25)."
  },
  {
    "id": 4031,
    "question": "A domestic ring final circuit is wired using 2.5mm² cable and protected by a 32A circuit breaker. What is the primary reason this topology allows for a higher current rating than a standard radial circuit of the same cable size?",
    "options": [
      "The current has two paths to flow, effectively doubling the current carrying capacity of the conductors",
      "The loop back to the consumer unit reduces the total resistance to zero",
      "Ring circuits use a higher voltage to push more current through the cables",
      "The circuit breaker is connected in parallel with the load to increase safety"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a ring final circuit, the current splits and travels in two directions around the ring, which means the load is shared between two sets of conductors, allowing for a higher total current (usually 32A) than the cable's individual rating."
  },
  {
    "id": 4032,
    "question": "An electrician is installing three heating elements in series for a specialized industrial process. The resistances are 12Ω, 18Ω, and 30Ω. Calculate the total resistance of the circuit.",
    "options": [
      "60Ω",
      "5.45Ω",
      "30Ω",
      "6480Ω"
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
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances: 12 + 18 + 30 = 60Ω."
  },
  {
    "id": 4033,
    "question": "Two identical 110V site transformers are connected in parallel to a 230V supply. If one transformer has an internal resistance of 0.4Ω and the other 0.6Ω, what is the total equivalent resistance of the pair?",
    "options": [
      "0.24Ω",
      "1.0Ω",
      "0.5Ω",
      "0.1Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "ROUNDING_ERROR",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For two resistors in parallel, Rt = (R1 * R2) / (R1 + R2). Therefore, (0.4 * 0.6) / (0.4 + 0.6) = 0.24 / 1.0 = 0.24Ω."
  },
  {
    "id": 4034,
    "question": "A 230V radial circuit supplies a 2.3kW fixed heater and a 4.6kW electric shower simultaneously. What is the total current drawn from the consumer unit?",
    "options": [
      "30A",
      "10A",
      "20A",
      "6.9A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "TOPOLOGY_CONFUSION",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A1-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "First find individual currents: I1 = 2300W/230V = 10A; I2 = 4600W/230V = 20A. In a parallel (radial) circuit, total current is the sum of branch currents: 10A + 20A = 30A."
  },
  {
    "id": 4035,
    "question": "In a series-connected decorative lighting string, one bulb blows and the entire string stops working. Why does this occur?",
    "options": [
      "The broken filament creates an open circuit, stopping the flow of current through the single path",
      "The resistance of the circuit becomes so low that the fuse blows",
      "The voltage increases at the other bulbs, causing them all to blow instantly",
      "The short circuit created by the blown bulb trips the RCD"
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
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path for current. If any component fails and creates an open circuit, current cannot flow to any other part of the circuit."
  },
  {
    "id": 4036,
    "question": "Which type of circuit is specifically designed to provide power to data and communication equipment while minimizing electromagnetic interference (EMI) from power cables?",
    "options": [
      "Screened or shielded data cabling circuits",
      "High-current ring final circuits",
      "Unprotected radial power circuits",
      "Three-phase motor control circuits"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Data and communication circuits use specialized screened or shielded cables (like Cat6 FTP) to protect sensitive signals from electromagnetic interference caused by adjacent power circuits."
  },
  {
    "id": 4037,
    "question": "A control circuit for a conveyor belt uses a 24V DC supply. If the control relay has a resistance of 120Ω, what current flows through the control switch when activated?",
    "options": [
      "0.2A",
      "5A",
      "2880mA",
      "2.4A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R): I = 24V / 120Ω = 0.2A."
  },
  {
    "id": 4038,
    "question": "What is the main functional difference between a 'Maintained' and 'Non-Maintained' emergency lighting circuit?",
    "options": [
      "Maintained lights stay on all the time; Non-maintained only light up during a power failure",
      "Maintained circuits are ring finals; Non-maintained are always radial",
      "Maintained lights use batteries; Non-maintained are connected directly to a generator",
      "Maintained circuits are for exit signs only; Non-maintained are for general walkways"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Maintained emergency luminaires operate at all times from the normal supply and switch to battery during failure. Non-maintained luminaires only illuminate when the local normal lighting supply fails."
  },
  {
    "id": 4039,
    "question": "An electrician measures a voltage of 230V at the consumer unit, but only 218V at the end of a long radial power circuit drawing 16A. What is the total resistance of the circuit cabling?",
    "options": [
      "0.75Ω",
      "1.33Ω",
      "12Ω",
      "14.3Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Voltage drop (Vd) = 230V - 218V = 12V. Using Ohm's Law (R = V / I): R = 12V / 16A = 0.75Ω."
  },
  {
    "id": 4040,
    "question": "Why is a radial circuit usually preferred over a ring final circuit for a dedicated high-power appliance like an electric cooker?",
    "options": [
      "It simplifies the circuit protection and ensures the full capacity of the cable is dedicated to one appliance",
      "Radial circuits are more efficient at carrying AC current than ring circuits",
      "A ring circuit would cause the cooker to run at half power",
      "Regulations forbid the use of ring circuits for any appliance over 2kW"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power fixed appliances are typically on dedicated radial circuits to ensure they have an uninterrupted supply and to prevent the nuisance tripping or overloading that might occur if they were part of a shared ring circuit."
  },
  {
    "id": 4041,
    "question": "A ring final circuit has an end-to-end resistance (r1) of 0.8 Ω for the line conductor. What is the expected resistance (R1) measured at each socket outlet when the ends are cross-connected?",
    "options": [
      "0.2 Ω",
      "0.4 Ω",
      "0.8 Ω",
      "1.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a ring final circuit, the R1 resistance at each socket is r1/4. Therefore, 0.8 Ω / 4 = 0.2 Ω."
  },
  {
    "id": 4042,
    "question": "Which of the following describes the key structural difference between a radial circuit and a ring final circuit?",
    "options": [
      "A radial circuit terminates at the last point of use, whereas a ring returns to the source.",
      "A radial circuit always uses smaller cables than a ring final circuit.",
      "A radial circuit is only used for lighting, while ring circuits are only for power.",
      "A radial circuit allows current to flow in two directions to each outlet."
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
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Radial circuits run from the consumer unit to the last point (like a branch), whereas ring final circuits form a complete loop back to the consumer unit."
  },
  {
    "id": 4043,
    "question": "A 230V radial power circuit supplies two 3kW electric heaters connected in parallel. What is the total current drawn by this circuit?",
    "options": [
      "26.09 A",
      "13.04 A",
      "52.17 A",
      "6.52 A"
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
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 6000W. I = P / V. 6000W / 230V = 26.086 A, rounded to 26.09 A."
  },
  {
    "id": 4044,
    "question": "In a commercial building, why is it standard practice to separate data and communication cables from 230V power cables in trunking?",
    "options": [
      "To prevent electromagnetic interference (EMI) from affecting data signals.",
      "To prevent the data cables from overheating the power cables.",
      "Because data cables carry higher current than power cables.",
      "To ensure the data cables do not increase the resistance of the power circuit."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Separation is required to prevent EMI (noise) from power cables interfering with the low-voltage signals in data cables."
  },
  {
    "id": 4045,
    "question": "Three identical 115V lamps are connected in series across a 230V supply. If one lamp fails (open circuit), what will happen to the remaining two lamps?",
    "options": [
      "They will both turn off.",
      "They will both get brighter.",
      "They will stay on at the same brightness.",
      "They will dim significantly but stay on."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "series",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path for current. An open circuit at any point stops the flow of current to all components."
  },
  {
    "id": 4046,
    "question": "Calculate the total resistance of a circuit containing two 100 Ω resistors in parallel, which are then connected in series with a 50 Ω resistor.",
    "options": [
      "100 Ω",
      "250 Ω",
      "25 Ω",
      "150 Ω"
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
      "calculation",
      "mixed-circuit",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Parallel part: (100 * 100) / (100 + 100) = 50 Ω. Total resistance = 50 Ω (parallel) + 50 Ω (series) = 100 Ω."
  },
  {
    "id": 4047,
    "question": "A maintained emergency lighting system is different from a non-maintained system because the maintained system:",
    "options": [
      "Operates its lamps during both normal and emergency conditions.",
      "Only operates its lamps when the mains power supply fails.",
      "Does not require a battery backup for operation.",
      "Is wired in series to ensure all lamps fail at once."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Maintained emergency lights are on all the time (using mains), and switch to battery power during a failure. Non-maintained only turn on when power fails."
  },
  {
    "id": 4048,
    "question": "An electrician is installing a control circuit for a motor. What is the primary purpose of using a separate control circuit rather than switching the motor directly?",
    "options": [
      "To allow the use of smaller, safer switches to control high-power loads.",
      "To increase the voltage delivered to the motor terminals.",
      "To convert the AC supply to DC for better motor speed control.",
      "To ensure the motor always runs in a clockwise direction."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Control circuits use low current/voltage signals to operate contactors, allowing high-power equipment to be switched safely and remotely."
  },
  {
    "id": 4049,
    "question": "A 230V lighting circuit has four 100W lamps connected in parallel. If the circuit is protected by a 6A MCB, what is the spare capacity of the circuit in Amps?",
    "options": [
      "4.26 A",
      "1.74 A",
      "5.57 A",
      "2.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "current-rule",
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Total Power = 400W. Current = 400 / 230 = 1.74A. Spare capacity = 6A - 1.74A = 4.26A."
  },
  {
    "id": 4050,
    "question": "Which circuit type is most commonly used for fire alarm detection loops to ensure the system can identify the exact location of a fire?",
    "options": [
      "Addressable radial or loop circuit",
      "Standard 32A ring final circuit",
      "Series-connected bell circuit",
      "High-voltage DC transmission circuit"
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
      "application",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Addressable circuits allow each device to have a unique ID, enabling the control panel to pinpoint exactly which detector has been triggered."
  },
  {
    "id": 4051,
    "question": "A ring final circuit is being tested for continuity. If the end-to-end resistance of the phase conductor (r1) is 0.8 Ω and the end-to-end resistance of the neutral conductor (rn) is 0.8 Ω, what is the theoretical resistance (R1 + Rn) measured at the furthest point of the ring?",
    "options": [
      "0.4 Ω",
      "1.6 Ω",
      "0.8 Ω",
      "0.2 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
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
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1+Rn) is calculated as (r1 + rn) / 4 because the current has two parallel paths to reach the point, effectively halving the resistance of each leg."
  },
  {
    "id": 4052,
    "question": "Which of the following best describes the primary advantage of using a ring final circuit for domestic socket outlets compared to a radial circuit?",
    "options": [
      "It allows for a smaller cable cross-sectional area to serve a larger floor area",
      "It makes fault finding significantly easier for the electrician",
      "It eliminates the risk of harmonic distortion in the neutral conductor",
      "It ensures that voltage drop is always zero at the furthest point"
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
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Ring final circuits share the load across two paths, allowing 2.5mm² cable to be protected by a 32A device, which wouldn't be possible in a standard radial configuration for the same floor area."
  },
  {
    "id": 4053,
    "question": "A lighting circuit contains four 100W lamps connected in parallel to a 230V supply. What is the total current drawn by the circuit?",
    "options": [
      "1.74 A",
      "0.43 A",
      "2.30 A",
      "4.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "calculation",
      "parallel"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Total power = 4 x 100W = 400W. Current (I) = P / V. Therefore, 400 / 230 = 1.739A, rounded to 1.74A."
  },
  {
    "id": 4054,
    "question": "When installing a fire alarm system, which circuit arrangement is typically used to allow the control panel to monitor the integrity of the wiring for open-circuit faults?",
    "options": [
      "A radial circuit with an end-of-line (EOL) resistor",
      "A ring final circuit with bridge links at every detector",
      "A series circuit where every device is connected in a single loop",
      "A parallel circuit using only high-frequency AC signals"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "Fire alarm zones use radial circuits with an end-of-line resistor. The panel monitors a small 'supervisory' current; if the wire breaks, the current stops, triggering a fault signal."
  },
  {
    "id": 4055,
    "question": "A 20A radial power circuit is 25 metres long. The cable used has a voltage drop value of 18 mV/A/m. If the circuit is carrying a load of 15A, what is the calculated voltage drop?",
    "options": [
      "6.75 V",
      "9.00 V",
      "0.67 V",
      "6750 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "ROUNDING_ERROR",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "units"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Voltage drop = (mV/A/m x Ib x L) / 1000. Calculation: (18 x 15 x 25) / 1000 = 6750 / 1000 = 6.75V. Note that the actual load (15A) is used, not the circuit rating (20A)."
  },
  {
    "id": 4056,
    "question": "An electrician is testing a 2.5mm²/1.5mm² ring final circuit. The end-to-end resistance of the line conductor (r1) is measured at 0.60 Ω. What is the expected resistance (R1) measured between the consumer unit and the furthest point of the ring?",
    "options": [
      "0.15 Ω",
      "0.30 Ω",
      "0.60 Ω",
      "1.20 Ω"
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
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance to the furthest point (R1) is calculated as r1 / 4. This is because the furthest point is effectively the midpoint of two parallel paths, each being half the total length (r1/2). Using the parallel rule: (r1/2 * r1/2) / (r1/2 + r1/2) = (r1²/4) / r1 = r1/4."
  },
  {
    "id": 4057,
    "question": "Which of the following best describes the operational advantage of a ring final circuit over a radial circuit when serving a high density of socket outlets in a domestic setting?",
    "options": [
      "It allows for a higher current carrying capacity using smaller cross-sectional area conductors by providing two paths for current.",
      "It eliminates the risk of electromagnetic interference between power and data cables in the same room.",
      "It ensures that if one socket fails, the rest of the circuit remains energized through the alternative path.",
      "It reduces the total length of cable required to wire a specific floor area compared to multiple radials."
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
      "explanation",
      "application"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The primary design benefit of the UK ring final circuit is that current splits into two paths, allowing a 30A or 32A protective device to be used with 2.5mm² cable, which would normally only handle approximately 20-27A in a radial configuration."
  },
  {
    "id": 4058,
    "question": "A 24V DC control circuit contains two relay coils connected in series. Relay A has a resistance of 100 Ω and Relay B has a resistance of 200 Ω. Calculate the voltage drop across Relay B.",
    "options": [
      "16V",
      "12V",
      "8V",
      "24V"
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
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a series circuit, voltage divides in proportion to resistance. Total Resistance = 100 + 200 = 300 Ω. Current (I) = 24V / 300 Ω = 0.08A. Voltage across Relay B = 0.08A * 200 Ω = 16V."
  },
  {
    "id": 4059,
    "question": "A maintained emergency lighting luminaire is installed in a commercial corridor. During a total loss of local mains power, how does the internal circuit respond?",
    "options": [
      "The internal relay/switch disconnects the mains supply and connects the battery to the lamp driver.",
      "The lamp switches from a series configuration to a parallel configuration to save energy.",
      "The circuit increases the frequency of the AC supply to maintain lamp brightness at lower voltages.",
      "The battery begins charging from the residual magnetic field in the circuit's transformer."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
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
    "explanation": "In emergency lighting, a changeover device (usually a relay or electronic switch) detects the loss of mains and automatically switches the lamp's power source to the internal battery."
  },
  {
    "id": 4060,
    "question": "Three resistive heating elements with values of 20 Ω, 30 Ω, and 60 Ω are connected in parallel to a 230V supply. What is the total power dissipated by this circuit?",
    "options": [
      "5290W",
      "480W",
      "2300W",
      "529W"
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
      "power"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First, find total resistance (Rt): 1/Rt = 1/20 + 1/30 + 1/60 = (3+2+1)/60 = 6/60 = 1/10. So, Rt = 10 Ω. Total Power (P) = V² / Rt = 230² / 10 = 52,900 / 10 = 5290W."
  },
  {
    "id": 4061,
    "question": "When installing data and communication cabling alongside power circuits, why does BS 7671 require specific segregation or the use of screened cables?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables affecting signal integrity.",
      "To ensure that the data cables do not overheat due to the current in the power cables.",
      "To prevent the data cables from acting as an unintended return path for the ring final circuit.",
      "To limit the voltage drop on the communication circuit caused by the resistance of the power cables."
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
      "legislation"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Data cables operate at high frequencies and low voltages. Power cables generate electromagnetic fields that can induce 'noise' into data cables, leading to data loss or errors if they are not properly segregated."
  },
  {
    "id": 4062,
    "question": "A 230V radial lighting circuit has a total line-neutral loop resistance of 1.2 Ω. If the circuit is fully loaded and drawing 6A, what is the voltage measured at the furthest point of the circuit?",
    "options": [
      "222.8V",
      "237.2V",
      "224.0V",
      "230.0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
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
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Voltage drop (Vd) = I * R = 6A * 1.2 Ω = 7.2V. The voltage at the end is the source voltage minus the drop: 230V - 7.2V = 222.8V."
  },
  {
    "id": 4063,
    "question": "In a motor control circuit, an 'Emergency Stop' button (normally closed) is mistakenly wired in parallel with the 'Start' button's latching contact. What is the dangerous consequence of this error?",
    "options": [
      "The Emergency Stop will not be able to stop the motor once it has been started and latched.",
      "The motor will only run as long as the Emergency Stop button is held down.",
      "The circuit breaker will trip as soon as the Start button is pressed due to a short circuit.",
      "The motor will run in the reverse direction when the Emergency Stop is pressed."
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
      "application",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Emergency Stop buttons must be wired in series. If wired in parallel with a latching contact, the current will continue to flow through the latch even if the E-stop is pressed (opened), meaning the motor cannot be stopped."
  },
  {
    "id": 4064,
    "question": "Calculate the total resistance of a circuit where a 15 Ω resistor is connected in series with a parallel combination of two 10 Ω resistors.",
    "options": [
      "20 Ω",
      "35 Ω",
      "5 Ω",
      "25 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "USED_PARALLEL_RULE",
      "3": "CALCULATION_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "mixed-circuit",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "First calculate the parallel part: (10 * 10) / (10 + 10) = 100 / 20 = 5 Ω. Then add the series component: 15 Ω + 5 Ω = 20 Ω."
  },
  {
    "id": 4065,
    "question": "Why is an 'End of Line' (EOL) resistor used in a radial fire alarm detection circuit?",
    "options": [
      "To allow the control panel to monitor the circuit for open-circuit faults by maintaining a small supervisory current.",
      "To increase the total resistance so that the alarm sounders do not draw too much current.",
      "To convert the AC signal from the panel into a DC signal for the smoke detectors.",
      "To act as a fuse that blows when a detector is triggered, protecting the main panel."
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
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A1-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The EOL resistor completes the circuit loop. The panel monitors the current; if the wire is cut (open circuit), the current stops, and the panel triggers a 'Fault' condition. If a detector is triggered, it usually shorts the resistor, increasing current and triggering an 'Alarm'."
  }
];
