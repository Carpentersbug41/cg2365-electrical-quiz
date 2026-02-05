import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A2 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Two resistors, one of 15 Ω and one of 25 Ω, are connected in series. What is the total resistance of the circuit?",
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
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is found by adding the individual resistances together (Rt = R1 + R2)."
  },
  {
    "id": 4017,
    "question": "Which type of circuit starts at the consumer unit, loops through a number of socket outlets, and returns to the same terminals in the consumer unit?",
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
    "category": "Circuit Types: What They Do",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit forms a continuous loop back to the source, effectively providing two paths for current to flow to the sockets."
  },
  {
    "id": 4018,
    "question": "If two identical 20 Ω heating elements are connected in parallel, what is the total resistance of the circuit?",
    "options": [
      "10 Ω",
      "40 Ω",
      "400 Ω",
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (Rt = R / n)."
  },
  {
    "id": 4019,
    "question": "In a standard domestic radial circuit used for lighting, how is the voltage affected across each lamp connected in parallel?",
    "options": [
      "Each lamp receives the full supply voltage",
      "The voltage is shared equally between the lamps",
      "The voltage increases as more lamps are turned on",
      "The voltage drops to zero at the last lamp"
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
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, the voltage across each branch is the same as the supply voltage."
  },
  {
    "id": 4020,
    "question": "An electrician is installing a circuit specifically designed to carry signals for a computer network. What category of circuit is this?",
    "options": [
      "Data and communications",
      "Power and heating",
      "Control circuit",
      "Emergency lighting"
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
      "terminology",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Circuits used for IT equipment and networking are classified as data and communications circuits."
  },
  {
    "id": 4021,
    "question": "A series circuit has a total resistance of 50 Ω and is connected to a 230 V supply. What is the total current flowing in the circuit?",
    "options": [
      "4.6 A",
      "11,500 A",
      "0.21 A",
      "180 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), the current is 230V / 50Ω = 4.6A."
  },
  {
    "id": 4022,
    "question": "What happens to the total current in a parallel circuit if an additional load (branch) is switched on?",
    "options": [
      "The total current increases",
      "The total current decreases",
      "The total current stays the same",
      "The total current drops to zero"
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
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a parallel circuit, adding more branches reduces the total resistance, which causes the total current drawn from the source to increase."
  },
  {
    "id": 4023,
    "question": "A parallel circuit has two branches. Branch A draws 3 A and Branch B draws 5 A. What is the total current supplied to the circuit?",
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
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "According to Kirchhoff's Current Law, the total current entering a junction in a parallel circuit is equal to the sum of the currents in the individual branches (It = I1 + I2)."
  },
  {
    "id": 4024,
    "question": "In which type of circuit would the failure of one lamp cause all other lamps in that circuit to stop working?",
    "options": [
      "Series circuit",
      "Parallel circuit",
      "Ring final circuit",
      "Radial circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "In a series circuit, there is only one path for current. If any component fails and breaks the circuit, current stops flowing to all components."
  },
  {
    "id": 4025,
    "question": "Calculate the voltage drop across a 10 Ω resistor in a series circuit if the current flowing through it is 2 A.",
    "options": [
      "20 V",
      "5 V",
      "0.2 V",
      "12 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Using Ohm's Law (V = I x R), the voltage drop is 2A x 10Ω = 20V."
  },
  {
    "id": 4026,
    "question": "In a ring final circuit, how are the circuit conductors connected to the protective device in the consumer unit?",
    "options": [
      "Both ends of the circuit loop return to the same protective device",
      "Only one end of the circuit is connected to the protective device",
      "Each end of the loop is connected to a different protective device",
      "The circuit is connected in a straight line with no return to the unit"
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
      "ring-final",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is characterized by the circuit conductors forming a loop, with both ends of the loop connected back to the same single protective device (MCB or RCBO) in the consumer unit."
  },
  {
    "id": 4027,
    "question": "An electrician is testing a series lighting circuit containing two lamps with resistances of 120 Ω and 180 Ω. What is the total resistance of the circuit?",
    "options": [
      "300 Ω",
      "72 Ω",
      "60 Ω",
      "21600 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is the sum of individual resistances (Rt = R1 + R2). Therefore, 120 Ω + 180 Ω = 300 Ω."
  },
  {
    "id": 4028,
    "question": "Which type of circuit is primarily used to transmit signals for internet access and telephone systems in a modern installation?",
    "options": [
      "Data and communications circuit",
      "Control circuit",
      "Radial power circuit",
      "Emergency lighting circuit"
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
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Data and communications circuits are designed for low-voltage signal transmission for IT and telephony, distinguishing them from power or control circuits."
  },
  {
    "id": 4029,
    "question": "A 230 V supply is connected to two identical heaters wired in series. What is the expected voltage across each individual heater?",
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
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the supply voltage is shared between components. If the components are identical, the voltage drops equally across them (230 V / 2 = 115 V)."
  },
  {
    "id": 4030,
    "question": "Which circuit topology is most commonly used for a single high-power appliance, such as an electric oven or a shower?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Series circuit",
      "Parallel loop circuit"
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
      "radial",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power appliances are typically served by dedicated radial circuits, where a single cable runs from the consumer unit directly to the appliance or its local isolator."
  },
  {
    "id": 4031,
    "question": "Two heating elements are connected in series within an industrial process heater. If the resistances of the elements are 25 Ω and 35 Ω, what is the total resistance of the circuit?",
    "options": [
      "60 Ω",
      "14.58 Ω",
      "875 Ω",
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
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total resistance is the sum of all individual resistances (Rt = R1 + R2). Therefore, 25 Ω + 35 Ω = 60 Ω."
  },
  {
    "id": 4032,
    "question": "What is a primary functional advantage of using a ring final circuit for domestic socket outlets compared to a radial circuit?",
    "options": [
      "Current can flow in two directions, allowing for a smaller conductor cross-sectional area",
      "The voltage at the furthest point is doubled due to the return path",
      "The total resistance is increased, which reduces the risk of short circuits",
      "Fault finding is significantly easier as the circuit is a continuous loop"
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
      "topology-identification",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "A ring final circuit allows current to split and flow in two paths to the load, which means the conductors can be smaller (typically 2.5mm²) than would be required for a radial circuit of the same total current rating (32A)."
  },
  {
    "id": 4033,
    "question": "A radial circuit feeds two power tools connected in parallel. If Tool A has a resistance of 12 Ω and Tool B has a resistance of 24 Ω, what is the total resistance of the load?",
    "options": [
      "8 Ω",
      "36 Ω",
      "0.125 Ω",
      "288 Ω"
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
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For parallel circuits, 1/Rt = 1/R1 + 1/R2. So, 1/12 + 1/24 = 2/24 + 1/24 = 3/24. Taking the reciprocal gives Rt = 24/3 = 8 Ω."
  },
  {
    "id": 4034,
    "question": "In a commercial HVAC system, why is the control circuit often operated at 24V AC rather than the 230V mains supply?",
    "options": [
      "To increase safety for personnel interacting with thermostats and switches",
      "To ensure the control signals travel faster through the cables",
      "To allow the use of much larger cables to reduce voltage drop",
      "Because 24V AC provides more torque for large motor starters"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "UNITS_MISSING",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits often use Extra Low Voltage (ELV) such as 24V to reduce the risk of electric shock to users and maintenance staff interacting with control interfaces."
  },
  {
    "id": 4035,
    "question": "An electrician is adding a new LED downlight to an existing domestic lighting circuit. How should this new light be connected in relation to the other lights on the circuit to ensure they all operate at full brightness?",
    "options": [
      "In parallel with the existing lights",
      "In series with the nearest light fitting",
      "In a ring configuration back to the consumer unit",
      "Using a separate DC power supply only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Standard lighting circuits are connected in parallel so that every lamp receives the full supply voltage (230V) and can be controlled independently."
  },
  {
    "id": 4036,
    "question": "A series circuit consists of two resistors, R1 (4 Ω) and R2 (6 Ω), connected to a 230V supply. What is the voltage drop specifically across R2?",
    "options": [
      "138V",
      "92V",
      "230V",
      "38.3V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "USED_PARALLEL_RULE",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find total resistance: 4 + 6 = 10 Ω. Then find total current: 230V / 10 Ω = 23A. Finally, find voltage across R2: 23A * 6 Ω = 138V."
  },
  {
    "id": 4037,
    "question": "What is the defining characteristic of a 'maintained' emergency lighting circuit?",
    "options": [
      "The lamps are energized at all material times from the normal or emergency supply",
      "The lamps only illuminate when the main power supply fails",
      "The circuit is only used to provide lighting for maintenance staff",
      "The lamps are kept at a low voltage until a fire alarm is triggered"
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
      "legislation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Maintained emergency lighting is designed to be on at all times, functioning as normal lighting when the power is on and switching to battery power when it fails."
  },
  {
    "id": 4038,
    "question": "A radial circuit supplies two industrial fans connected in parallel. If Fan 1 draws 10A and Fan 2 draws 5A, what is the total current measured at the circuit breaker?",
    "options": [
      "15A",
      "3.33A",
      "10A",
      "5A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "USED_SERIES_RULE",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the currents in each branch (It = I1 + I2). 10A + 5A = 15A."
  },
  {
    "id": 4039,
    "question": "When installing data and communication cabling, why must they be segregated from power cables using a specified distance or a grounded barrier?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals",
      "To prevent the data cables from overheating the power cables",
      "To ensure the data signals travel at the speed of light",
      "To prevent the power cables from drawing current from the data system"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Data cables carry low-voltage high-frequency signals which are susceptible to electromagnetic interference (EMI) produced by the magnetic fields around power cables."
  },
  {
    "id": 4040,
    "question": "The end-to-end resistance of the line conductor (r1) in a ring final circuit is measured at 0.8 Ω. What is the expected resistance (R1) measured from the consumer unit to the furthest point on the ring?",
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
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring final circuit, the resistance to the furthest point (R1) is approximately 1/4 of the end-to-end resistance (r1). 0.8 Ω / 4 = 0.2 Ω."
  },
  {
    "id": 4041,
    "question": "A radial lighting circuit has three identical lamps connected in parallel. If each lamp has a resistance of 920 Ω when lit, what is the total resistance of the lighting load?",
    "options": [
      "306.67 Ω",
      "2760 Ω",
      "920 Ω",
      "0.003 Ω"
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
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a parallel circuit, total resistance (Rt) is calculated using 1/Rt = 1/R1 + 1/R2 + 1/R3. For identical resistors, Rt = R/n. So, 920 / 3 = 306.67 Ω."
  },
  {
    "id": 4042,
    "question": "Which of the following describes the primary electrical advantage of using a Ring Final Circuit (RFC) for socket outlets compared to a standard radial circuit?",
    "options": [
      "It allows the use of smaller cross-sectional area conductors for the same load by providing two paths for current.",
      "It eliminates the risk of voltage drop at the furthest point of the circuit.",
      "It ensures that if there is a break in the ring, the overcurrent protective device will immediately trip.",
      "It allows for an unlimited number of socket outlets to be installed regardless of floor area."
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
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit starts and ends at the distribution board, providing two paths for current to reach any point, effectively allowing a 2.5mm cable to serve a 30A or 32A circuit."
  },
  {
    "id": 4043,
    "question": "An electrician is installing a radial circuit for a 3kW immersion heater on a 230V supply. Calculate the design current (Ib) for this circuit.",
    "options": [
      "13.04 A",
      "690 A",
      "0.076 A",
      "15.00 A"
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
      "calculation",
      "ohms-law",
      "power"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using the power formula I = P / V: 3000W / 230V = 13.04A."
  },
  {
    "id": 4044,
    "question": "In a 'Non-Maintained' emergency lighting system, when do the emergency lamps illuminate?",
    "options": [
      "Only when the local normal lighting circuit power supply fails.",
      "Continuously at all times while the building is occupied.",
      "Only when the fire alarm system is manually activated.",
      "During hours of darkness controlled by a photocell."
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
      "explanation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Non-maintained emergency lights only operate when the standard power supply to the lighting circuit fails. Maintained lights are on all the time."
  },
  {
    "id": 4045,
    "question": "A control circuit for a motor starter uses a Normally Open (N/O) 'Start' button and a Normally Closed (N/C) 'Stop' button. How should the 'Stop' button be connected in relation to the contactor coil?",
    "options": [
      "In series with the coil and the start button.",
      "In parallel with the coil and the start button.",
      "In series with the start button but in parallel with the coil.",
      "Across the L and N supply rails to create a short circuit."
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
      "conceptual",
      "application",
      "series"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For safety, a 'Stop' button must be Normally Closed and wired in series so that pressing it (opening the circuit) or a cable break will both de-energize the coil."
  },
  {
    "id": 4046,
    "question": "A 230V radial power circuit supplies two 2kW electric heaters connected in parallel. What is the total current drawn by the circuit when both heaters are operating?",
    "options": [
      "17.39 A",
      "8.70 A",
      "4.35 A",
      "34.78 A"
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
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 2kW + 2kW = 4000W. Total Current I = P / V = 4000 / 230 = 17.39A."
  },
  {
    "id": 4047,
    "question": "Why is it critical to maintain physical separation or use screened cabling for data and communication circuits when they are installed near power circuits?",
    "options": [
      "To prevent electromagnetic interference (EMI) from the power cables affecting signal quality.",
      "Because data cables operate at much higher frequencies and would overheat the power cables.",
      "To prevent the 230V AC supply from converting the data signals into DC.",
      "To ensure the data cables do not draw current from the power circuit."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Power cables create electromagnetic fields that can induce 'noise' or interference into data cables, corrupting the digital signals."
  },
  {
    "id": 4048,
    "question": "A 32A Ring Final Circuit has a total load of 26A connected at a single point exactly halfway around the ring. What current would be expected to flow through each of the two legs of the ring at the consumer unit?",
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
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a ring circuit, the current splits between the two paths. If the load is exactly in the center and the resistance of both legs is equal, the current divides equally: 26A / 2 = 13A per leg."
  },
  {
    "id": 4049,
    "question": "Which circuit type is most commonly used for a domestic central heating system's control wiring, such as connecting a room thermostat to a motorized valve?",
    "options": [
      "Control circuit",
      "Ring final circuit",
      "Data/Comms circuit",
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
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Wiring that handles the logic and switching of a system (like a thermostat controlling a valve) is classified as a control circuit."
  },
  {
    "id": 4050,
    "question": "Calculate the total power consumed by a radial lighting circuit that has ten 12W LED lamps and two 50W floodlights, all operating on a 230V supply.",
    "options": [
      "220 W",
      "62 W",
      "120 W",
      "1440 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "power",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Total Power = (10 lamps x 12W) + (2 floodlights x 50W) = 120W + 100W = 220W."
  },
  {
    "id": 4051,
    "question": "An electrician is testing a domestic ring final circuit. The end-to-end resistance of the line conductor (r1) is 0.8 Ω and the end-to-end resistance of the CPC (r2) is also 0.8 Ω. What is the expected (R1+R2) test result at each socket on the ring?",
    "options": [
      "0.4 Ω",
      "1.6 Ω",
      "0.8 Ω",
      "0.2 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For a ring final circuit, the expected R1+R2 reading at each socket is calculated as (r1 + r2) / 4. In this case, (0.8 + 0.8) / 4 = 0.4 Ω."
  },
  {
    "id": 4052,
    "question": "Which circuit topology provides two distinct paths for current to flow from the consumer unit to every point of utilization, allowing for a higher protective device rating relative to the cable's current-carrying capacity?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Tree topology",
      "Series lighting circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit starts and ends at the same point in the consumer unit, providing two paths for current. This allows a 32A OCPD to be used with 2.5mm² cable, which normally has a lower current-carrying capacity."
  },
  {
    "id": 4053,
    "question": "A 20A radial power circuit is 25 metres long. If the cable used has a voltage drop value of 18 mV/A/m, what is the total voltage drop at the furthest point when the circuit is operating at its full rated current?",
    "options": [
      "9.0 V",
      "0.45 V",
      "4.5 V",
      "18.0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "voltage-rule",
      "units"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Voltage drop is calculated as (mV/A/m × Current × Length) / 1000. So, (18 × 20 × 25) / 1000 = 9.0 V."
  },
  {
    "id": 4054,
    "question": "In a commercial HVAC installation, a 'control circuit' is used alongside a 'power circuit' for a large fan motor. What is the primary purpose of the control circuit?",
    "options": [
      "To switch high-power loads safely using low-current devices like thermostats",
      "To carry the high starting current required by the motor",
      "To provide a redundant path for current in case the power circuit fails",
      "To increase the voltage supplied to the motor during peak demand"
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
      "explanation",
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Control circuits use lower currents (and often lower voltages) to operate the coils of contactors or relays, which then switch the high-power 'power circuit' for the motor."
  },
  {
    "id": 4055,
    "question": "A dedicated radial circuit supplies a 6.9 kW electric shower. Given a supply voltage of 230 V, which of the following is the most appropriate standard rating for the circuit's overcurrent protective device (OCPD)?",
    "options": [
      "32 A",
      "30 A",
      "25 A",
      "40 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "ROUNDING_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, calculate the current: P / V = 6900 / 230 = 30 A. The OCPD must be equal to or greater than the design current. 32 A is the next standard BS EN 60898 MCB size."
  },
  {
    "id": 4056,
    "question": "A ring final circuit has a measured end-to-end resistance (r1) of 0.8 ohms for the line conductor. What is the theoretical resistance (R1) measured at the furthest point of the ring, assuming no spurs are present?",
    "options": [
      "0.20 ohms",
      "0.80 ohms",
      "0.40 ohms",
      "1.60 ohms"
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
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance at the furthest point (R1) is 1/4 of the end-to-end resistance (r1) because the two paths act as parallel conductors each half the length of the total loop."
  },
  {
    "id": 4057,
    "question": "An industrial control circuit uses a 24V DC relay to switch a 400V AC three-phase motor. What is the primary functional reason for using this specific circuit arrangement?",
    "options": [
      "To provide electrical isolation between the operator interface and the high-power load",
      "To increase the total current available to the motor windings",
      "To convert the DC supply into a three-phase AC supply",
      "To reduce the resistance of the motor's internal coils"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "relays"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Control circuits often use Extra Low Voltage (ELV) to safely interface with users, using relays or contactors to provide galvanic isolation from high-voltage power circuits."
  },
  {
    "id": 4058,
    "question": "A radial power circuit supplies three loads connected in parallel: a 2kW heater, a 1kW heater, and a 500W motor. If the supply voltage is 230V, what is the total current drawn by the circuit?",
    "options": [
      "15.22 A",
      "8.70 A",
      "6.52 A",
      "3.50 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "power",
      "current-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total Power = 2000 + 1000 + 500 = 3500W. Current I = P/V = 3500 / 230 = 15.217A."
  },
  {
    "id": 4059,
    "question": "When installing data cabling (Cat 6) alongside 230V power radials, why is a minimum segregation distance or earthed metal containment required?",
    "options": [
      "To prevent Electromagnetic Interference (EMI) from corrupting data signals",
      "To ensure the data cable can assist in the earthing of the power circuit",
      "To prevent the data cable from drawing current from the power cable",
      "To increase the frequency of the data transmission signal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Data cables operate at high frequencies and low voltages, making them susceptible to EMI from power cables. Segregation is required by BS 7671 and BS EN 50174."
  },
  {
    "id": 4060,
    "question": "A lighting circuit consists of four lamps connected in parallel. If one lamp fails 'open-circuit', what happens to the voltage across the remaining three lamps?",
    "options": [
      "The voltage remains the same",
      "The voltage increases slightly",
      "The voltage decreases as resistance increases",
      "The voltage drops to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "voltage-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the voltage across each branch remains equal to the supply voltage regardless of other branches, provided the supply is stable."
  },
  {
    "id": 4061,
    "question": "Calculate the total resistance of a circuit where two 15 ohm resistors are connected in parallel, and this combination is then connected in series with a 10 ohm resistor.",
    "options": [
      "17.5 ohms",
      "40.0 ohms",
      "7.5 ohms",
      "12.5 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "mixed-circuit",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Parallel part: (15 * 15) / (15 + 15) = 7.5 ohms. Total: 7.5 + 10 (series) = 17.5 ohms."
  },
  {
    "id": 4062,
    "question": "Which type of emergency lighting system only illuminates when the local normal mains supply fails?",
    "options": [
      "Non-maintained",
      "Maintained",
      "Sustained",
      "Combined"
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
      "application"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "Non-maintained luminaires are designed to ignite only upon failure of the normal mains supply. Maintained luminaires are on at all times."
  },
  {
    "id": 4063,
    "question": "In a ring final circuit, what is the effect of a single break in the line conductor continuity?",
    "options": [
      "The circuit becomes two radial circuits and may overload the cable",
      "The entire circuit loses power immediately",
      "The protective device will trip instantly due to short circuit",
      "The voltage at the sockets will double"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "A break in a ring circuit creates two radials. While loads still work, the current is no longer shared across two paths, potentially exceeding the cable's current-carrying capacity."
  },
  {
    "id": 4064,
    "question": "A 230V radial circuit has a total resistance of 0.5 ohms. If a fault occurs with negligible impedance at the end of the circuit, what is the prospective fault current?",
    "options": [
      "460 A",
      "115 A",
      "0.002 A",
      "230 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Using Ohm's Law: I = V / R. I = 230 / 0.5 = 460A."
  },
  {
    "id": 4065,
    "question": "What is the primary advantage of using a radial circuit instead of a ring final circuit for a high-power kitchen appliance like an electric cooker?",
    "options": [
      "It allows for a higher-rated protective device dedicated to a single heavy load",
      "It reduces the total amount of copper used in the installation",
      "It ensures that a fault in the cooker won't affect the lighting",
      "It automatically balances the current between two conductors"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3A2-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "High-power fixed appliances are typically placed on dedicated radial circuits so they can be protected by a single breaker sized specifically for that load's requirements."
  }
];
