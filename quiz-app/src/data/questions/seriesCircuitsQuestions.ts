import { TaggedQuestion } from './types';

/**
 * Series Circuits Question Bank
 * Aligned with lesson 202-3AAAA learning outcomes
 * Generated: 2026-01-26
 */

export const seriesCircuitsQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "How many paths for current flow are there in a standard series circuit?",
    "options": [
      "One single path",
      "Two parallel paths",
      "Multiple branching paths",
      "No continuous path"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "A series circuit is defined by having only one continuous path for the current to flow from the source, through all components, and back to the source."
  },
  {
    "id": 4052,
    "question": "In a series circuit containing three resistors, what is the relationship of the current at different points in the circuit?",
    "options": [
      "It is the same at every point",
      "It splits equally between the resistors",
      "It increases as it passes through each resistor",
      "It decreases as it passes through each resistor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "One of the fundamental rules of a series circuit is that the current (I) remains the same at all points in the loop."
  },
  {
    "id": 4053,
    "question": "What is the total resistance of a series circuit containing a 10 Ω resistor and a 20 Ω resistor?",
    "options": [
      "30 Ω",
      "6.67 Ω",
      "200 Ω",
      "10 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance (Rt) is calculated by adding the individual resistances together: Rt = R1 + R2."
  },
  {
    "id": 4054,
    "question": "Which of the following is a common practical application of a series connection in an electrical installation?",
    "options": [
      "An ON/OFF switch controlling a light",
      "Domestic socket outlets in a kitchen",
      "Multiple light fittings in a living room",
      "A consumer unit feeding multiple circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A switch is connected in series with the load it controls so that opening the switch breaks the single path for current flow."
  },
  {
    "id": 4055,
    "question": "A 12V battery is connected to two identical lamps in series. What is the voltage across each lamp?",
    "options": [
      "6V",
      "12V",
      "24V",
      "0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total supply voltage is shared between components. If the components are identical, the voltage is split equally (12V / 2 = 6V)."
  },
  {
    "id": 4056,
    "question": "What happens to a series circuit if one of the components develops an open-circuit fault?",
    "options": [
      "Current stops flowing through the whole circuit",
      "The remaining components will operate at a higher voltage",
      "The current will increase in the rest of the circuit",
      "Only the faulty component will stop working"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Because there is only one path for current, a break (open-circuit) anywhere in that path stops current flow to all components in the circuit."
  },
  {
    "id": 4057,
    "question": "Three resistors in a series circuit have measured voltage drops of 5V, 10V, and 15V. What is the total supply voltage?",
    "options": [
      "30V",
      "15V",
      "5V",
      "10V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "According to Kirchhoff's Voltage Law, the sum of the voltage drops in a series circuit equals the total supply voltage (5 + 10 + 15 = 30V)."
  },
  {
    "id": 4058,
    "question": "A series circuit has a total resistance of 100 Ω and a supply voltage of 230V. What is the total current flowing in the circuit?",
    "options": [
      "2.3A",
      "23,000A",
      "0.43A",
      "130A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "SIGN_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), the current is 230V / 100Ω = 2.3A."
  },
  {
    "id": 4059,
    "question": "When identifying a series circuit on a schematic diagram, how are the components connected?",
    "options": [
      "End-to-end in a continuous loop",
      "Across the positive and negative rails independently",
      "In parallel branches with the supply",
      "Between the line and earth conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "In a series circuit, components are connected one after another (end-to-end) so that the same current must pass through each one."
  },
  {
    "id": 4060,
    "question": "The total resistance of a series circuit is 50 Ω. If one resistor is 35 Ω, what is the value of the second resistor?",
    "options": [
      "15 Ω",
      "85 Ω",
      "1.4 Ω",
      "1750 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Since Rt = R1 + R2, then R2 = Rt - R1. Therefore, 50Ω - 35Ω = 15Ω."
  },
  {
    "id": 4061,
    "question": "In a series circuit, how many paths are available for the electric current to flow through the components?",
    "options": [
      "One single path",
      "Two separate paths",
      "A path for every component",
      "The current does not follow a path"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "A series circuit is defined by having only one continuous loop or path for the current to flow through all components."
  },
  {
    "id": 4062,
    "question": "If an ammeter reads 2 A at the beginning of a series circuit, what will the reading be after the current has passed through three resistors in that same circuit?",
    "options": [
      "2 A",
      "0.66 A",
      "6 A",
      "0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the current remains the same at all points because there are no junctions for the current to split."
  },
  {
    "id": 4063,
    "question": "A series circuit consists of two resistors with values of 15 Ω and 25 Ω. What is the total resistance of the circuit?",
    "options": [
      "40 Ω",
      "9.37 Ω",
      "375 Ω",
      "10 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To find the total resistance in a series circuit, you simply add the individual resistance values together (Rt = R1 + R2)."
  },
  {
    "id": 4064,
    "question": "What is the total current flowing in a series circuit that has a total resistance of 50 Ω and is connected to a 230 V supply?",
    "options": [
      "4.6 A",
      "11,500 A",
      "0.21 A",
      "180 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "SIGN_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), the calculation is 230 V / 50 Ω = 4.6 A."
  },
  {
    "id": 4065,
    "question": "In which of the following practical applications would you most likely find components connected in series?",
    "options": [
      "A safety stop button on a control circuit",
      "Standard 13 A socket outlets in a kitchen",
      "The main lighting circuit in a lounge",
      "The heating elements in a multi-bar electric fire"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits often use series connections for safety devices so that if any one switch opens, the entire circuit is broken and the machine stops."
  },
  {
    "id": 4066,
    "question": "In a series circuit containing three resistors of different values, how does the current flow through each component?",
    "options": [
      "The same amount of current flows through every component",
      "The current is divided proportionally to the resistance values",
      "The current decreases as it passes through each successive resistor",
      "The current is highest at the resistor with the lowest value"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path for the current to follow, meaning the current (I) is identical at all points in the circuit."
  },
  {
    "id": 4067,
    "question": "A series circuit consists of three resistors with values of 15 Ω, 22 Ω, and 33 Ω. What is the total resistance (Rt) of the circuit?",
    "options": [
      "70 Ω",
      "6.7 Ω",
      "10.9 Ω",
      "10890 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To find the total resistance in a series circuit, you simply add the individual resistances together: 15 + 22 + 33 = 70 Ω."
  },
  {
    "id": 4068,
    "question": "If one lamp in a series-connected set of three indicator lamps fails due to a broken filament (open circuit), what will happen to the remaining lamps?",
    "options": [
      "All lamps will stop working immediately",
      "The other two lamps will get brighter as they share more voltage",
      "Only the failed lamp will go out; the others remain lit",
      "The current will increase in the rest of the circuit to compensate"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Because a series circuit only has one path, an open circuit at any point breaks the entire loop, causing current to stop flowing everywhere."
  },
  {
    "id": 4069,
    "question": "A series circuit has a total resistance of 120 Ω and a measured current of 0.5 A. What is the supply voltage required for this circuit?",
    "options": [
      "60 V",
      "240 V",
      "0.004 V",
      "119.5 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "SIGN_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using Ohm's Law (V = I x R), the voltage is calculated as 0.5 A multiplied by 120 Ω, which equals 60 V."
  },
  {
    "id": 4070,
    "question": "An electrician is wiring a control circuit where a 'Stop' button and an 'Emergency Stop' button must both be able to shut down a motor. How should these buttons be connected?",
    "options": [
      "In series with the motor control coil",
      "In parallel with each other across the supply",
      "In series-parallel with the main motor leads",
      "To separate phases to ensure redundancy"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Safety 'Stop' buttons are connected in series so that if any one of them is pressed (opening the contact), the entire circuit is broken and the motor stops."
  },
  {
    "id": 4071,
    "question": "A 230 V series circuit contains two resistors, R1 = 40 Ω and R2 = 60 Ω. What is the voltage drop across R1?",
    "options": [
      "92 V",
      "138 V",
      "115 V",
      "5.75 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "ROUNDING_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First find Rt (40+60=100Ω). Then find current (230/100=2.3A). Finally, find V1 (2.3A x 40Ω = 92V)."
  },
  {
    "id": 4072,
    "question": "Which statement best describes the physical topology of a series circuit?",
    "options": [
      "All components are connected end-to-end in a single continuous loop",
      "Components are connected across the same two common points",
      "The circuit contains multiple junctions where current can diverge",
      "Each component is connected directly to the neutral and line conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A series circuit is defined by its single-path topology, where components follow one after another in a loop."
  },
  {
    "id": 4073,
    "question": "A circuit is connected to a 12 V battery and contains three resistors in series: 10 Ω, 20 Ω, and 30 Ω. Calculate the current flowing through the 20 Ω resistor.",
    "options": [
      "0.2 A",
      "0.6 A",
      "0.4 A",
      "5.0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Rt = 10+20+30 = 60 Ω. I = V / Rt = 12 / 60 = 0.2 A. In series, the current is the same everywhere."
  },
  {
    "id": 4074,
    "question": "A set of decorative lights consists of 20 identical lamps connected in series to a 240 V mains supply. What is the operating voltage across each individual lamp?",
    "options": [
      "12 V",
      "240 V",
      "4800 V",
      "0.08 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a series circuit, the total voltage is divided among identical components. 240 V / 20 lamps = 12 V per lamp."
  },
  {
    "id": 4075,
    "question": "A series circuit has a total resistance of 500 Ω. It contains two resistors; the first (R1) has a value of 150 Ω. What is the value of the second resistor (R2)?",
    "options": [
      "350 Ω",
      "650 Ω",
      "107.1 Ω",
      "75000 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "USED_PARALLEL_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In series, Rt = R1 + R2. Therefore, R2 = Rt - R1. 500 Ω - 150 Ω = 350 Ω."
  },
  {
    "id": 4076,
    "question": "In a series circuit containing three resistors, how many distinct paths are available for the current to flow from the positive terminal to the negative terminal of the supply?",
    "options": [
      "One single path",
      "Three separate paths",
      "Two paths",
      "A path for each component"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_PARALLEL_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A series circuit is defined by having only one continuous path for current to flow through all components sequentially."
  },
  {
    "id": 4077,
    "question": "An electrician connects three resistors in series with values of 15 Ω, 25 Ω, and 60 Ω. What is the total resistance (Rt) of the circuit?",
    "options": [
      "100 Ω",
      "7.89 Ω",
      "60 Ω",
      "37.5 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the total resistance is the sum of the individual resistances: 15 + 25 + 60 = 100 Ω."
  },
  {
    "id": 4078,
    "question": "If a series circuit has a total current flow of 2 A leaving the battery, what will the current reading be after it has passed through two 10 Ω resistors?",
    "options": [
      "2 A",
      "1 A",
      "0.5 A",
      "4 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "In a series circuit, the current remains the same at all points in the loop."
  },
  {
    "id": 4079,
    "question": "A 230 V series circuit consists of two identical lamps. If the total resistance of the circuit is 460 Ω, what is the voltage drop across each lamp?",
    "options": [
      "115 V",
      "230 V",
      "460 V",
      "0.5 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Since the lamps are identical and in series, the total supply voltage (230 V) is shared equally between them: 230 / 2 = 115 V."
  },
  {
    "id": 4080,
    "question": "Why are emergency stop buttons usually wired in series with the contactor coil in a motor control circuit?",
    "options": [
      "To ensure any single button press breaks the whole circuit",
      "To allow each button to operate independently",
      "To increase the voltage reaching the coil",
      "To reduce the current flow to the motor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In series, if any component (like a switch or stop button) opens, the entire circuit path is broken, stopping the current flow."
  },
  {
    "id": 4081,
    "question": "A 12 V DC power supply is connected to three resistors in series: 4 Ω, 6 Ω, and 10 Ω. Calculate the current flowing through the 6 Ω resistor.",
    "options": [
      "0.6 A",
      "2 A",
      "1.2 A",
      "240 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total Resistance Rt = 4 + 6 + 10 = 20 Ω. Current I = V / Rt = 12 / 20 = 0.6 A. Current is the same everywhere in series."
  },
  {
    "id": 4082,
    "question": "A string of older decorative lights is wired in series. If the third bulb in the chain of twenty blows (creating an open circuit), what will happen to the remaining bulbs?",
    "options": [
      "All bulbs will go out",
      "Only the third bulb will go out",
      "The remaining bulbs will get brighter",
      "The fuse will immediately blow"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path. If one component fails open, the circuit is broken and current stops flowing to all components."
  },
  {
    "id": 4083,
    "question": "An electrician measures the voltage drops across three components in a series circuit as 12 V, 45 V, and 73 V. What is the total supply voltage of this circuit?",
    "options": [
      "130 V",
      "73 V",
      "43.3 V",
      "1560 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "ROUNDING_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "According to Kirchhoff's Voltage Law for series circuits, the sum of the voltage drops equals the supply voltage: 12 + 45 + 73 = 130 V."
  },
  {
    "id": 4084,
    "question": "In a series circuit, if an additional resistor is added to the loop, what effect does this have on the total resistance and the total current?",
    "options": [
      "Resistance increases and current decreases",
      "Resistance decreases and current increases",
      "Resistance increases and current increases",
      "Resistance decreases and current decreases"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Adding a resistor in series increases the total resistance. Since I = V/R, as resistance increases (with a constant voltage), the current must decrease."
  },
  {
    "id": 4085,
    "question": "A series circuit has a 24 V supply and a total current of 2 A. It contains two resistors; one is 8 Ω. What is the value of the second resistor?",
    "options": [
      "4 Ω",
      "12 Ω",
      "16 Ω",
      "2 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First, find total resistance: Rt = V / I = 24 / 2 = 12 Ω. Since Rt = R1 + R2, then R2 = 12 - 8 = 4 Ω."
  },
  {
    "id": 4086,
    "question": "In a series circuit containing three resistors of different values, how does the current behave as it moves through each component?",
    "options": [
      "It remains exactly the same at every point in the circuit",
      "It splits proportionally according to the resistance of each component",
      "It decreases after passing through each resistor due to energy loss",
      "It increases as it returns to the source to maintain the circuit loop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "SIGN_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one continuous path for current to flow; therefore, the current (Amperes) must be identical at all points in the circuit regardless of the resistance values."
  },
  {
    "id": 4087,
    "question": "A series circuit consists of two resistors, 15 Ω and 25 Ω, connected to a 240V supply. Calculate the total current flowing through the 15 Ω resistor.",
    "options": [
      "6.0 A",
      "25.6 A",
      "16.0 A",
      "9600 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, find total resistance: 15 Ω + 25 Ω = 40 Ω. Then use Ohm's Law (I = V / R): 240V / 40 Ω = 6 A. In a series circuit, this current flows through all components."
  },
  {
    "id": 4088,
    "question": "An electrician is wiring a control circuit where three emergency stop buttons must be able to shut down a motor. How should these buttons be connected to ensure any single button can break the circuit?",
    "options": [
      "In series with each other and the control coil",
      "In parallel with each other across the supply",
      "In series-parallel to ensure redundancy",
      "In parallel with the start button only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Emergency stop buttons use 'normally closed' contacts. By connecting them in series, opening any one button breaks the single path for current, de-energising the control coil."
  },
  {
    "id": 4089,
    "question": "A series circuit contains three identical indicator lamps connected to a 12V DC source. If the total resistance of the circuit is 60 Ω, what is the voltage drop across a single lamp?",
    "options": [
      "4 V",
      "12 V",
      "36 V",
      "0.2 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a series circuit with identical components, the supply voltage is shared equally. 12V / 3 lamps = 4V per lamp. Alternatively, I = 12/60 = 0.2A; V = 0.2A * (60/3)Ω = 4V."
  },
  {
    "id": 4090,
    "question": "A series circuit is used to power four lamps in a decorative display. If the filament in the second lamp breaks, what will be the effect on the remaining lamps?",
    "options": [
      "All lamps will go out because the single path for current is broken",
      "The other three lamps will stay lit but become dimmer",
      "The other three lamps will stay lit and become brighter",
      "Only the lamps positioned after the break will go out"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A series circuit provides only one path for current. If any component fails (open circuit), the path is broken and current ceases to flow through the entire circuit."
  },
  {
    "id": 4091,
    "question": "A control circuit contains a 220 Ω relay coil, a 470 Ω resistor, and a 1.2 kΩ indicator lamp connected in series to a 230 V supply. What is the total current flowing through the circuit?",
    "options": [
      "121.7 mA",
      "523.4 mA",
      "434.8 mA",
      "189.0 mA"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "WRONG_UNITS",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Total resistance Rt = 220 + 470 + 1200 = 1890 Ω. Using Ohm's Law (I = V / R), I = 230 / 1890 = 0.12169 A, which is approximately 121.7 mA."
  },
  {
    "id": 4092,
    "question": "In a series circuit consisting of three resistors, the resistance of one component is doubled while the supply voltage remains constant. What is the resulting effect on the voltage drop across the unchanged resistors?",
    "options": [
      "The voltage drop across them decreases",
      "The voltage drop across them increases",
      "The voltage drop across them remains the same",
      "The voltage drop across them doubles"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Increasing one resistance increases the total circuit resistance, which reduces the total current. Since V = I x R, and R for the unchanged resistors is constant, the reduction in current leads to a lower voltage drop across them."
  },
  {
    "id": 4093,
    "question": "An electrician measures a total current of 0.5 A in a series circuit connected to a 110 V DC supply. The circuit contains a 100 Ω heater and a secondary control resistor. Calculate the value of the control resistor.",
    "options": [
      "120 Ω",
      "220 Ω",
      "55 Ω",
      "100 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Total resistance Rt = V / I = 110 / 0.5 = 220 Ω. Since Rt = R1 + R2, the control resistor R2 = 220 - 100 = 120 Ω."
  },
  {
    "id": 4094,
    "question": "A series circuit is used to power three identical lamps. If a voltmeter is placed across a blown fuse in this circuit while the supply is switched on, what reading would be expected?",
    "options": [
      "The full supply voltage",
      "Zero volts",
      "One-third of the supply voltage",
      "A fluctuating voltage near peak"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_RMS_WITH_PEAK"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a series circuit, an open point (like a blown fuse) has infinite resistance. The voltmeter completes the circuit but has such high resistance that almost all the supply voltage is dropped across it."
  },
  {
    "id": 4095,
    "question": "Three ammeters are placed in a series circuit: A1 at the start, A2 between two loads, and A3 at the end of the loop. If A1 reads 4.2 A, what will be the readings of A2 and A3?",
    "options": [
      "Both will read 4.2 A",
      "A2 will be 2.1 A and A3 will be 0 A",
      "Both will read slightly less than 4.2 A due to resistance",
      "The readings will depend on the power rating of the loads"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "current-rule"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a series circuit, there is only one path for current flow; therefore, the current is identical at every point in the circuit."
  },
  {
    "id": 4096,
    "question": "Two 50 Ω resistors are connected in series across a 100 V supply. What is the total power dissipated by the entire circuit?",
    "options": [
      "100 W",
      "200 W",
      "50 W",
      "400 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Rt = 50 + 50 = 100 Ω. Current I = V / Rt = 100 / 100 = 1 A. Total Power P = V x I = 100 x 1 = 100 W. Alternatively, P = V^2 / Rt = 10000 / 100 = 100 W."
  },
  {
    "id": 4097,
    "question": "An electrician needs to create an indicator string for a 230 V panel using 24 V lamps. To ensure the lamps do not exceed their rated voltage, what is the minimum number of lamps that must be connected in series?",
    "options": [
      "10 lamps",
      "9 lamps",
      "1 lamp",
      "5 lamps"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "230 V / 24 V = 9.58. If 9 lamps are used, each would receive 25.5 V (over voltage). Therefore, a minimum of 10 lamps is required to keep each lamp under 24 V."
  },
  {
    "id": 4098,
    "question": "A DC sensor circuit consists of a 10 kΩ fixed resistor and a 5 kΩ variable resistor in series with a 12 V source. If the output signal is taken across the 5 kΩ resistor, what is the output voltage?",
    "options": [
      "4 V",
      "8 V",
      "12 V",
      "6 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total resistance = 15 kΩ. Current I = 12 / 15000 = 0.0008 A. Voltage across 5 kΩ = 0.0008 x 5000 = 4 V."
  },
  {
    "id": 4099,
    "question": "In a string of five series-connected decorative lamps, a wire is placed across the terminals of one lamp, effectively short-circuiting it. What happens to the remaining four lamps?",
    "options": [
      "They become brighter",
      "They all go out",
      "They become dimmer",
      "Their brightness remains unchanged"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Short-circuiting one lamp reduces the total resistance of the series circuit. Since Rt decreases and V remains constant, the total current increases, making the remaining lamps brighter."
  },
  {
    "id": 4100,
    "question": "Three loads with resistances of 15 Ω, 25 Ω, and 10 Ω are connected in series. If the voltage drop across the 25 Ω load is measured at 50 V, what is the total supply voltage?",
    "options": [
      "100 V",
      "50 V",
      "250 V",
      "20 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-3AAAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "First find current: I = V2 / R2 = 50 / 25 = 2 A. Because it is a series circuit, current is the same everywhere. Total Resistance Rt = 15 + 25 + 10 = 50 Ω. Total Voltage Vt = I x Rt = 2 x 50 = 100 V."
  }
];
