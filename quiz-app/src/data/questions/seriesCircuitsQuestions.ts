import { TaggedQuestion } from './types';

/**
 * Series Circuits Question Bank
 * Aligned with lesson 202-202.3AAA learning outcomes
 * Generated: 2026-01-25
 */

export const seriesCircuitsQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "Which of the following describes the connection of components in a series circuit?",
    "options": [
      "Components are connected end-to-end to form a single path for current",
      "Components are connected side-by-side across the same two points",
      "Current has multiple paths to return to the source",
      "Each component is connected directly to the supply independently"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the current to flow, meaning all components are connected one after another in a single loop."
  },
  {
    "id": 4052,
    "question": "If a circuit consists of three resistors in series, what happens to the total resistance if a fourth resistor is added in series?",
    "options": [
      "The total resistance increases",
      "The total resistance decreases",
      "The total resistance stays the same",
      "The total resistance becomes zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total resistance is the sum of all individual resistances (RT = R1 + R2 + ...). Adding more resistors increases the total resistance."
  },
  {
    "id": 4053,
    "question": "A series circuit has two resistors: R1 = 15 Ω and R2 = 25 Ω. What is the total resistance (RT)?",
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
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "For resistors in series, simply add the values together: 15 Ω + 25 Ω = 40 Ω."
  },
  {
    "id": 4054,
    "question": "In a series circuit with a 12 V supply and a total resistance of 6 Ω, what is the current flowing through the circuit?",
    "options": [
      "2 A",
      "0.5 A",
      "72 A",
      "18 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "Using Ohm's Law (I = V / R), the current is 12 V / 6 Ω = 2 A."
  },
  {
    "id": 4055,
    "question": "Which statement correctly describes the current in a series circuit?",
    "options": [
      "The current is the same at all points in the circuit",
      "The current is shared between the components",
      "The current is highest near the positive terminal",
      "The current decreases after passing through each resistor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for electrons to follow, so the current flow (Amperes) must be identical at every point."
  },
  {
    "id": 4056,
    "question": "A 24 V battery is connected to two identical 12 Ω resistors in series. What is the voltage drop across each resistor?",
    "options": [
      "12 V",
      "24 V",
      "2 V",
      "6 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Since the resistors are identical, the 24 V supply is shared equally between them. 24 V / 2 = 12 V each."
  },
  {
    "id": 4057,
    "question": "An electrician is testing a series lighting circuit. If one lamp fails 'open circuit', what will happen to the remaining lamps?",
    "options": [
      "All lamps will go out",
      "The other lamps will get brighter",
      "The other lamps will stay on as normal",
      "Only the lamps before the fault will stay on"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
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
    "learningOutcomeId": "202-202.3AAA-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Because there is only one path for current, an open circuit anywhere (like a blown bulb) breaks the entire loop and stops current flow to all components."
  },
  {
    "id": 4058,
    "question": "What is the total resistance of a series circuit containing a 1.2 kΩ resistor and a 300 Ω resistor?",
    "options": [
      "1500 Ω",
      "1.5 Ω",
      "301.2 Ω",
      "240 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "UNITS_MISSING",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "First convert 1.2 kΩ to 1200 Ω. Then add: 1200 Ω + 300 Ω = 1500 Ω."
  },
  {
    "id": 4059,
    "question": "How should an ammeter be connected to measure the total current in a series circuit?",
    "options": [
      "In series with the components",
      "In parallel across the supply",
      "In parallel across the largest resistor",
      "Between the neutral and earth terminals"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Ammeters have very low resistance and must be connected in series so that the circuit current flows through them."
  },
  {
    "id": 4060,
    "question": "A series circuit has a total resistance of 100 Ω and a current of 0.5 A. What is the total power dissipated by the circuit?",
    "options": [
      "25 W",
      "50 W",
      "200 W",
      "0.005 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "power",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using the formula P = I²R: (0.5 * 0.5) * 100 = 0.25 * 100 = 25 W. Alternatively, find V first (V=I*R=50V) then P=V*I (50*0.5=25W)."
  },
  {
    "id": 4061,
    "question": "In a series circuit containing three resistors, how many paths are available for the current to flow through?",
    "options": [
      "One path",
      "Two paths",
      "Three paths",
      "A different path for each resistor"
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
      "discrimination"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "A series circuit is defined by having only one continuous path for current to flow from the source, through all components, and back to the source."
  },
  {
    "id": 4062,
    "question": "Three resistors with values of 15 Ω, 25 Ω, and 60 Ω are connected in series. What is the total resistance of the circuit?",
    "options": [
      "100 Ω",
      "7.32 Ω",
      "22,500 Ω",
      "60 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the total resistance (Rt) is found by adding the individual resistances together: 15 + 25 + 60 = 100 Ω."
  },
  {
    "id": 4063,
    "question": "If a 230 V supply is connected to two 50 Ω resistors connected in series, what is the total current flowing through the circuit?",
    "options": [
      "2.3 A",
      "4.6 A",
      "23,000 A",
      "0.43 A"
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
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "First, find total resistance: 50 + 50 = 100 Ω. Then use Ohm's Law (I = V / R): 230 / 100 = 2.3 A."
  },
  {
    "id": 4064,
    "question": "Which statement correctly describes the behavior of current in a series circuit?",
    "options": [
      "The current remains the same at all points in the circuit",
      "The current divides proportionally between the resistors",
      "The current decreases as it passes through each resistor",
      "The current is highest at the positive terminal and lowest at the negative"
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
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for electrons to flow, meaning the current (the rate of flow) must be identical at every point in the loop."
  },
  {
    "id": 4065,
    "question": "An electrician is fault-finding on a set of decorative lights wired in series. If one lamp fails and creates an open circuit, what will happen to the remaining lamps?",
    "options": [
      "All of the lamps will stop working",
      "The remaining lamps will become brighter",
      "Only the failed lamp will go out",
      "The circuit fuse will immediately blow"
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
      "discrimination"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Because there is only one path for current in a series circuit, a break anywhere (an open circuit) stops the flow of electricity to all components in that circuit."
  },
  {
    "id": 4066,
    "question": "A series circuit consists of three 100 Ω resistors. If one resistor develops an open-circuit fault, what will be the current flow through the remaining two resistors?",
    "options": [
      "0 A",
      "The same current as before",
      "An increased current",
      "Half of the original current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "USED_SERIES_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "current-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path for current. If any part of the path is broken (open-circuit), current cannot flow anywhere in the circuit."
  },
  {
    "id": 4067,
    "question": "An electrician connects a 1.2 kΩ resistor and an 800 Ω resistor in series. What is the total resistance (Rt) of this combination?",
    "options": [
      "2000 Ω",
      "480 Ω",
      "1.2008 kΩ",
      "400 Ω"
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
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In series, total resistance is the sum of individual resistances. 1.2 kΩ is 1200 Ω. 1200 + 800 = 2000 Ω."
  },
  {
    "id": 4068,
    "question": "A 230 V supply is connected to three resistors in series: 10 Ω, 15 Ω, and 25 Ω. What is the total current flowing through the 15 Ω resistor?",
    "options": [
      "4.6 A",
      "15.33 A",
      "23 A",
      "1.53 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "ohms-law",
      "current-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find Rt: 10 + 15 + 25 = 50 Ω. Then find total current: I = V / Rt = 230 / 50 = 4.6 A. In series, current is the same everywhere."
  },
  {
    "id": 4069,
    "question": "In a series circuit containing resistors of 50 Ω, 100 Ω, and 150 Ω, which resistor will have the largest voltage drop across it?",
    "options": [
      "The 150 Ω resistor",
      "The 50 Ω resistor",
      "The 100 Ω resistor",
      "All resistors will have the same voltage drop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "VOLTAGE_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, voltage drop is proportional to resistance (V = I x R). Since current is the same for all, the highest resistance has the highest voltage drop."
  },
  {
    "id": 4070,
    "question": "Two resistors, 40 Ω and 60 Ω, are connected in series to a 12 V DC source. Calculate the voltage drop across the 60 Ω resistor.",
    "options": [
      "7.2 V",
      "4.8 V",
      "12 V",
      "0.2 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "voltage-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Rt = 40 + 60 = 100 Ω. I = V / Rt = 12 / 100 = 0.12 A. V(60Ω) = I * R = 0.12 * 60 = 7.2 V."
  },
  {
    "id": 4071,
    "question": "A string of 20 identical decorative lamps is connected in series to a 230 V mains supply. What is the voltage drop across each individual lamp?",
    "options": [
      "11.5 V",
      "230 V",
      "4600 V",
      "0.08 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit with identical components, the supply voltage is shared equally. 230 V / 20 lamps = 11.5 V per lamp."
  },
  {
    "id": 4072,
    "question": "A series circuit has a total resistance of 100 Ω and is connected to a 230 V supply. What is the total power dissipated by the circuit?",
    "options": [
      "529 W",
      "23,000 W",
      "2.3 W",
      "43.4 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find current: I = V / R = 230 / 100 = 2.3 A. Then find power: P = V * I = 230 * 2.3 = 529 W (or use P = V² / R)."
  },
  {
    "id": 4073,
    "question": "What is the effect on the total circuit current if an additional resistor is added in series to an existing circuit, assuming the supply voltage remains constant?",
    "options": [
      "The current decreases because total resistance has increased",
      "The current increases because there are more components",
      "The current remains the same because voltage is constant",
      "The current decreases because total resistance has decreased"
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
      "conceptual",
      "resistance-rule",
      "current-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Adding resistors in series increases the total resistance (Rt). According to Ohm's Law (I = V/R), if resistance increases while voltage is fixed, the current must decrease."
  },
  {
    "id": 4074,
    "question": "A circuit contains three 20 Ω resistors in series. If a technician accidentally places a low-resistance link (short circuit) across one of the resistors, what will happen to the circuit current?",
    "options": [
      "The current will increase",
      "The current will decrease",
      "The current will remain exactly the same",
      "The current will drop to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "SIGN_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Shorting out a resistor removes its resistance from the circuit. The total resistance decreases from 60 Ω to 40 Ω. Since R decreased, the current (I = V/R) will increase."
  },
  {
    "id": 4075,
    "question": "A 110 V series circuit has a total current flow of 2 A. The circuit consists of two resistors. If one resistor is known to be 15 Ω, what is the value of the second resistor?",
    "options": [
      "40 Ω",
      "55 Ω",
      "70 Ω",
      "220 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "resistance-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find total resistance: Rt = V / I = 110 / 2 = 55 Ω. In series, Rt = R1 + R2. Therefore, R2 = Rt - R1 = 55 - 15 = 40 Ω."
  },
  {
    "id": 4076,
    "question": "A series circuit consists of two resistors: R1 = 1.2 kΩ and R2 = 470 Ω. What is the total resistance (RT) of the circuit?",
    "options": [
      "1.67 kΩ",
      "730 Ω",
      "338 Ω",
      "1.247 kΩ"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "USED_PARALLEL_RULE",
      "3": "WRONG_UNITS"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, total resistance is the sum of all individual resistances. 1.2 kΩ = 1200 Ω. 1200 + 470 = 1670 Ω, which is 1.67 kΩ."
  },
  {
    "id": 4077,
    "question": "Three resistors are connected in series to a 230 V supply. If the resistance of one resistor is increased, what effect does this have on the total circuit current?",
    "options": [
      "The current decreases throughout the entire circuit",
      "The current only decreases at the point of that specific resistor",
      "The current increases because the resistance is higher",
      "The current remains the same as it is a series circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "According to Ohm's Law (I = V/R), if the total resistance of a circuit increases while the voltage remains constant, the total current must decrease. In series, current is the same at all points."
  },
  {
    "id": 4078,
    "question": "A series circuit has a 230 V supply and two resistors of 20 Ω and 30 Ω. Calculate the total current flowing through the 30 Ω resistor.",
    "options": [
      "4.6 A",
      "7.66 A",
      "11.5 A",
      "11,500 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "ohms-law",
      "current-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find total resistance: RT = 20 + 30 = 50 Ω. Then use Ohm's Law: I = V / RT = 230 / 50 = 4.6 A. In series, current is the same everywhere."
  },
  {
    "id": 4079,
    "question": "An electrician is testing a string of 20 decorative lamps connected in series. If the 5th lamp in the string burns out (creating an open circuit), what will happen to the remaining lamps?",
    "options": [
      "All lamps will go out because the path for current is broken",
      "Only the 5th lamp will go out; the others stay lit",
      "The remaining 19 lamps will get slightly brighter",
      "All lamps after the 5th one will go out, but the first 4 stay lit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A series circuit provides only one path for current. If any component fails and creates an open circuit, the path is broken and current stops flowing entirely."
  },
  {
    "id": 4080,
    "question": "Calculate the voltage drop across a 200 Ω resistor that is connected in series with a 100 Ω resistor across a 12 V DC supply.",
    "options": [
      "8 V",
      "4 V",
      "6 V",
      "12 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "ROUNDING_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "RT = 100 + 200 = 300 Ω. I = V / RT = 12 / 300 = 0.04 A. Voltage drop across 200 Ω is V = I * R = 0.04 * 200 = 8 V."
  },
  {
    "id": 4081,
    "question": "When using test instruments on a series circuit, how must an ammeter and a voltmeter be connected to measure the current through and voltage across a specific load?",
    "options": [
      "Ammeter in series with the load; Voltmeter in parallel across the load",
      "Ammeter in parallel across the load; Voltmeter in series with the load",
      "Both instruments must be connected in series with the load",
      "Both instruments must be connected in parallel across the load"
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
      "terminology"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Ammeters have low resistance and must be in series to measure flow. Voltmeters have high resistance and must be in parallel to measure potential difference."
  },
  {
    "id": 4082,
    "question": "A series circuit draws 2 A from a supply. It contains two resistors: R1 = 10 Ω and R2 = 15 Ω. Calculate the total power dissipated by the circuit.",
    "options": [
      "100 W",
      "50 W",
      "40 W",
      "60 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "power"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "RT = 10 + 15 = 25 Ω. Power P = I² * R. P = 2² * 25 = 4 * 25 = 100 W."
  },
  {
    "id": 4083,
    "question": "A circuit contains two identical resistors in series. If a copper link is accidentally placed across one of the resistors (creating a short circuit), what happens to the total circuit current?",
    "options": [
      "The current increases because the total resistance has halved",
      "The current stops flowing because it takes the path of least resistance",
      "The current decreases because the circuit is now unbalanced",
      "The current remains the same because the supply voltage is constant"
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
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Shorting a resistor removes its resistance from the circuit. Total resistance (RT) drops, and since I = V/R, the total current increases."
  },
  {
    "id": 4084,
    "question": "Three resistors with values of 10 Ω, 20 Ω, and 70 Ω are connected in series across a 100 V supply. Which resistor will have the largest voltage drop across it?",
    "options": [
      "The 70 Ω resistor",
      "The 10 Ω resistor",
      "The 20 Ω resistor",
      "All resistors will have the same voltage drop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, current is constant. Since V = I * R, the component with the highest resistance will always have the highest voltage drop."
  },
  {
    "id": 4085,
    "question": "A series circuit is connected to a 24 V DC supply. An ammeter shows the total current is 0.5 A. If one resistor in the circuit is 10 Ω, what is the value of the second resistor?",
    "options": [
      "38 Ω",
      "48 Ω",
      "12 Ω",
      "20 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "calculation",
      "resistance-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find RT using Ohm's Law: RT = V / I = 24 / 0.5 = 48 Ω. Since RT = R1 + R2, then R2 = RT - R1 = 48 - 10 = 38 Ω."
  },
  {
    "id": 4086,
    "question": "A series circuit consists of three resistors with values of 10 Ω, 25 Ω, and 15 Ω connected to a 230 V DC supply. What is the total current flowing through the circuit?",
    "options": [
      "4.6 A",
      "46 A",
      "11,500 A",
      "4.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "MULTIPLIED_INSTEAD",
      "3": "WRONG_UNITS"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, calculate total resistance: Rt = R1 + R2 + R3 = 10 + 25 + 15 = 50 Ω. Then use Ohm's Law (I = V / R): I = 230 / 50 = 4.6 A."
  },
  {
    "id": 4087,
    "question": "An electrician is troubleshooting a set of series-connected decorative lights. If one bulb fails by creating an 'open circuit', what will happen to the rest of the bulbs in the string?",
    "options": [
      "All bulbs will go out because the path for current is broken",
      "All other bulbs will stay lit because current takes an alternative path",
      "The remaining bulbs will get brighter as they receive more voltage",
      "The fuse will blow immediately due to a short circuit"
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
      "application"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path for current. If any component creates an open circuit, current flow stops entirely for the whole circuit."
  },
  {
    "id": 4088,
    "question": "A 24 V DC supply is connected to two resistors in series: R1 is 40 Ω and R2 is 60 Ω. Calculate the voltage drop across the 60 Ω resistor.",
    "options": [
      "14.4 V",
      "9.6 V",
      "24.0 V",
      "0.24 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "USED_PARALLEL_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total resistance Rt = 40 + 60 = 100 Ω. Circuit current I = V / Rt = 24 / 100 = 0.24 A. Voltage drop across R2 = I × R2 = 0.24 × 60 = 14.4 V."
  },
  {
    "id": 4089,
    "question": "A heating element with a resistance of 100 Ω is connected in series with a 150 Ω current-limiting resistor. If the total supply voltage is 250 V, what is the total power consumed by the circuit?",
    "options": [
      "250 W",
      "625 W",
      "62,500 W",
      "1 W"
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
      "power",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Total resistance Rt = 100 + 150 = 250 Ω. Circuit current I = 250 V / 250 Ω = 1 A. Total power P = V × I = 250 V × 1 A = 250 W."
  },
  {
    "id": 4090,
    "question": "If an additional resistor is added in series to a functioning circuit while the supply voltage remains constant, how will the total resistance and circuit current be affected?",
    "options": [
      "Total resistance increases and current decreases",
      "Total resistance decreases and current increases",
      "Total resistance increases and current increases",
      "Total resistance increases and current stays the same"
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
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Adding resistors in series increases the total resistance (Rt = R1 + R2...). According to Ohm's Law (I = V / R), if resistance increases and voltage is fixed, the current must decrease."
  },
  {
    "id": 4091,
    "question": "A series circuit consists of three resistors: 220 Ω, 1.2 kΩ, and 470 Ω. If the circuit is connected to a 230 V supply, what is the total current flowing through the 1.2 kΩ resistor?",
    "options": [
      "121.7 mA",
      "514.3 mA",
      "189.0 mA",
      "121.7 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "WRONG_UNITS"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "calculation",
      "resistance-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "First, convert all to ohms: 220 + 1200 + 470 = 1890 Ω. Using Ohm's Law (I = V / R), 230 / 1890 = 0.12169 A, which is 121.7 mA. In a series circuit, current is the same at all points."
  },
  {
    "id": 4092,
    "question": "A 110 V DC supply feeds two resistors in series: R1 = 50 Ω and R2 = 150 Ω. If a voltmeter is connected specifically across R2, what will be the recorded voltage drop?",
    "options": [
      "82.5 V",
      "27.5 V",
      "110.0 V",
      "55.0 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "voltage-rule",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Total resistance RT = 50 + 150 = 200 Ω. Total current I = V / RT = 110 / 200 = 0.55 A. Voltage drop across R2 = I * R2 = 0.55 * 150 = 82.5 V."
  },
  {
    "id": 4093,
    "question": "In a series circuit containing three identical decorative lamps, a technician accidentally places a low-resistance 'short' across the terminals of the second lamp. What is the immediate effect on the remaining two lamps?",
    "options": [
      "They will become brighter",
      "They will become dimmer",
      "They will both go out",
      "They will remain at the same brightness"
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
      "conceptual",
      "resistance-rule",
      "current-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Shorting one lamp removes its resistance from the circuit. The total resistance (RT) decreases, which increases the total current (I = V / RT). Since current increases, the remaining lamps dissipate more power and appear brighter."
  },
  {
    "id": 4094,
    "question": "A 24 V power supply is connected to two 10 Ω resistors in series. What is the total power dissipated by the entire circuit?",
    "options": [
      "28.8 W",
      "57.6 W",
      "96.0 W",
      "14.4 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "USED_PARALLEL_RULE",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "calculation",
      "power",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total resistance RT = 10 + 10 = 20 Ω. Total Power P = V² / RT = 24² / 20 = 576 / 20 = 28.8 W."
  },
  {
    "id": 4095,
    "question": "A light-dependent resistor (LDR) and a fixed resistor are connected in series across a constant DC voltage source. If the light level decreases, causing the LDR resistance to increase, what happens to the voltage measured across the fixed resistor?",
    "options": [
      "The voltage decreases",
      "The voltage increases",
      "The voltage remains constant",
      "The voltage drops to zero immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "SIGN_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "conceptual",
      "application",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "As LDR resistance increases, total circuit resistance increases. This reduces the total current. Since V_fixed = I * R_fixed, a lower current results in a lower voltage drop across the fixed resistor."
  },
  {
    "id": 4096,
    "question": "A series circuit with a 230 V supply has a total current of 2 A. It contains three resistors. R1 is 40 Ω and R2 is 25 Ω. What is the value of the third resistor (R3)?",
    "options": [
      "50 Ω",
      "65 Ω",
      "115 Ω",
      "3.5 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_I_V_R",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "calculation",
      "resistance-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Total resistance RT = V / I = 230 / 2 = 115 Ω. In series, RT = R1 + R2 + R3. Therefore, 115 = 40 + 25 + R3. R3 = 115 - 65 = 50 Ω."
  },
  {
    "id": 4097,
    "question": "Which of the following describes the correct procedure for measuring the voltage drop across the second resistor in a series string of four resistors?",
    "options": [
      "Connect a voltmeter in parallel across only the second resistor while the circuit is energized",
      "Connect an ammeter in series with the second resistor while the circuit is energized",
      "Connect a voltmeter in series between the first and second resistor",
      "Connect a voltmeter across the supply terminals while the circuit is de-energized"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "application",
      "terminology",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Voltmeters must always be connected in parallel (across) the component being measured while the circuit is powered to measure potential difference."
  },
  {
    "id": 4098,
    "question": "If the number of resistors in a series circuit is increased while the supply voltage remains constant, which statement regarding the total circuit parameters is true?",
    "options": [
      "Total resistance increases and total current decreases",
      "Total resistance increases and total current increases",
      "Total resistance decreases and total current increases",
      "Total resistance remains the same but voltage drops increase"
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
      "conceptual",
      "resistance-rule",
      "current-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a series circuit, RT = R1 + R2 + ... Rn. Adding more resistors increases RT. According to Ohm's Law (I = V / R), if R increases and V is constant, I must decrease."
  },
  {
    "id": 4099,
    "question": "Two heating elements with resistances of 15 Ω and 25 Ω are connected in series to a 240 V mains supply. Calculate the voltage drop across the 25 Ω element.",
    "options": [
      "150 V",
      "90 V",
      "240 V",
      "40 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_I_V_R",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "calculation",
      "voltage-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "RT = 15 + 25 = 40 Ω. Total current I = 240 / 40 = 6 A. Voltage across 25 Ω element = I * R = 6 * 25 = 150 V."
  },
  {
    "id": 4100,
    "question": "An electrician is troubleshooting a string of 50 series-connected architectural lights. If the 25th bulb in the chain develops an 'open circuit' fault, what will the ammeter read when connected at the start of the circuit?",
    "options": [
      "0 A",
      "The normal operating current",
      "Double the normal operating current",
      "A very small leakage current in mA"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_PARALLEL_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Circuits",
    "tags": [
      "application",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a series circuit, there is only one path for current. If any component creates an open circuit (break), the resistance becomes effectively infinite and current stops flowing entirely (0 A) throughout the whole circuit."
  }
];
