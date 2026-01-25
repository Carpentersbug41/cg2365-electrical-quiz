import { TaggedQuestion } from './types';

/**
 * Series Resistors Question Bank
 * Aligned with lesson 202-202.3AAA learning outcomes
 * Generated: 2026-01-25
 */

export const seriesResistorsQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "Which of the following statements correctly describes the current in a series circuit?",
    "options": [
      "The current is the same at all points in the circuit",
      "The current divides proportionally between the resistors",
      "The current increases as it passes through each resistor",
      "The current is the sum of the currents in each component"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for the electrons to flow, meaning the current (amperage) must be identical at every point."
  },
  {
    "id": 4052,
    "question": "An electrician connects a 15 Ω resistor and a 25 Ω resistor in series. What is the total resistance of the circuit?",
    "options": [
      "40 Ω",
      "9.38 Ω",
      "10 Ω",
      "375 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "SIGN_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To find the total resistance in a series circuit, you simply add the individual resistances together: 15 + 25 = 40 Ω."
  },
  {
    "id": 4053,
    "question": "What happens to the total resistance of a series circuit if an additional resistor is added into the loop?",
    "options": [
      "The total resistance increases",
      "The total resistance decreases",
      "The total resistance stays the same",
      "The total resistance becomes zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Adding components in series adds more 'restriction' to the flow of current, therefore the total resistance always increases."
  },
  {
    "id": 4054,
    "question": "A series circuit consists of two 10 Ω resistors connected to a 20 V DC supply. What is the total current flowing through the circuit?",
    "options": [
      "1.0 A",
      "2.0 A",
      "0.5 A",
      "200 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "First, find total resistance (10 + 10 = 20 Ω). Then use Ohm's Law (I = V / R): 20V / 20Ω = 1.0 A."
  },
  {
    "id": 4055,
    "question": "If one lamp in a series-wired string of decorative lights fails (open circuit), what will happen to the remaining lamps?",
    "options": [
      "All of the lamps will go out",
      "The remaining lamps will get brighter",
      "Only the failed lamp will go out",
      "The remaining lamps will get dimmer"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path. If that path is broken (open circuit), current stops flowing entirely, and all lamps will go out."
  },
  {
    "id": 4056,
    "question": "How should an ammeter be connected to measure the total current in a series circuit?",
    "options": [
      "In series with the components",
      "In parallel across the supply",
      "In parallel across the largest resistor",
      "Between the neutral and earth conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To measure the flow of electrons (current), the ammeter must be placed 'in-line' or in series so that the current passes through the meter."
  },
  {
    "id": 4057,
    "question": "A 100 V supply is connected to two resistors in series: R1 is 20 Ω and R2 is 80 Ω. Which resistor will have the largest voltage drop across it?",
    "options": [
      "R2 (80 Ω)",
      "R1 (20 Ω)",
      "Both will have the same voltage drop",
      "Neither, as voltage is constant in series"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, voltage is shared. According to Ohm's Law (V=IR), because current is the same, the resistor with the higher resistance will have the higher voltage drop."
  },
  {
    "id": 4058,
    "question": "Two identical 50 Ω resistors are connected in series to a 230 V supply. What is the voltage drop across each resistor?",
    "options": [
      "115 V",
      "230 V",
      "460 V",
      "50 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "When two identical resistors are in series, the supply voltage is shared equally between them. 230V / 2 = 115V."
  },
  {
    "id": 4059,
    "question": "What is the total resistance of a series circuit containing a 2 kΩ resistor and a 500 Ω resistor?",
    "options": [
      "2,500 Ω",
      "400 Ω",
      "2.5 Ω",
      "1,000,000 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "WRONG_UNITS",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "First convert units to be the same: 2 kΩ = 2,000 Ω. Then add them: 2,000 + 500 = 2,500 Ω."
  },
  {
    "id": 4060,
    "question": "In a series circuit, if the supply voltage is doubled and the resistance remains the same, what happens to the current?",
    "options": [
      "The current doubles",
      "The current is halved",
      "The current stays the same",
      "The current quadruples"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "ohms-law",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "According to Ohm's Law (I = V / R), current is directly proportional to voltage. If voltage doubles, the current also doubles."
  },
  {
    "id": 4061,
    "question": "In a series circuit, how many paths are available for the electric current to flow from the source and back again?",
    "options": [
      "One single path",
      "Two separate paths",
      "One path for every resistor in the circuit",
      "A different path for the live and neutral conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A series circuit is defined by having only one continuous path for the current to flow through all connected components."
  },
  {
    "id": 4062,
    "question": "Which of the following statements correctly describes the behavior of current in a series circuit?",
    "options": [
      "The current is the same at all points in the circuit",
      "The current is divided between the resistors",
      "The current is highest near the positive terminal",
      "The current decreases as it passes through each resistor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path, so the flow of electrons (current) must be the same at every point."
  },
  {
    "id": 4063,
    "question": "A circuit contains a 15 Ω resistor and a 25 Ω resistor connected in series. What is the total resistance (Rt) of the circuit?",
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
    "category": "Series Resistors",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To find the total resistance in a series circuit, you simply add the individual resistances together: 15 + 25 = 40 Ω."
  },
  {
    "id": 4064,
    "question": "If a third resistor is added in series to an existing series circuit, what happens to the total resistance and total current?",
    "options": [
      "Resistance increases and current decreases",
      "Resistance increases and current increases",
      "Resistance decreases and current increases",
      "Resistance decreases and current decreases"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "USED_PARALLEL_RULE",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "resistance-rule",
      "current-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Adding resistors in series increases the total resistance (Rt). According to Ohm's Law (I=V/R), if resistance increases while voltage stays the same, the current must decrease."
  },
  {
    "id": 4065,
    "question": "An electrician is testing a series control circuit. If one component in the middle of the series chain develops an open-circuit fault, what will the ammeter reading be for the whole circuit?",
    "options": [
      "0 A",
      "The same as before the fault",
      "Half of the original reading",
      "Higher than the original reading"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Because there is only one path for current in a series circuit, a break (open circuit) anywhere in that path stops current flowing through the entire circuit."
  },
  {
    "id": 4066,
    "question": "An electrician is testing a series circuit containing three resistors. How should the ammeter and voltmeter be connected to measure the total current and the voltage drop across the second resistor?",
    "options": [
      "Ammeter in series with the circuit; Voltmeter in parallel across the second resistor",
      "Ammeter in parallel with the circuit; Voltmeter in series with the second resistor",
      "Both meters connected in series with the circuit",
      "Both meters connected in parallel across the second resistor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, current is measured by placing an ammeter in the path of the current (series). Voltage is measured across a component (parallel)."
  },
  {
    "id": 4067,
    "question": "A string of decorative lights is wired in series. If one bulb's filament breaks, what will happen to the remaining bulbs in the string?",
    "options": [
      "All bulbs will go out because the circuit path is broken",
      "The remaining bulbs will stay lit and become brighter",
      "Only the broken bulb will go out; the others remain the same",
      "The total resistance of the circuit will decrease, causing a fuse to blow"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "conceptual",
      "series",
      "fault-behaviour"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for current. An 'open circuit' anywhere in the loop stops the flow of current to all components."
  },
  {
    "id": 4068,
    "question": "A series circuit is connected to a 230 V supply and consists of two resistors: R1 = 200 Ω and R2 = 0.8 kΩ. What is the total current flowing through the circuit?",
    "options": [
      "0.23 A",
      "1.14 A",
      "0.85 A",
      "230 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "DIVIDED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, convert 0.8 kΩ to 800 Ω. Total resistance RT = 200 + 800 = 1000 Ω. Using Ohm's Law: I = V / RT = 230 / 1000 = 0.23 A."
  },
  {
    "id": 4069,
    "question": "In a 230 V series circuit, three resistors are connected with values of 10 Ω, 15 Ω, and 25 Ω. Calculate the voltage drop across the 15 Ω resistor.",
    "options": [
      "69 V",
      "46 V",
      "115 V",
      "76.6 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "calculation",
      "voltage-rule",
      "series"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "RT = 10 + 15 + 25 = 50 Ω. Total current I = 230 / 50 = 4.6 A. Voltage drop V2 = I × R2 = 4.6 × 15 = 69 V."
  },
  {
    "id": 4070,
    "question": "If an additional resistor is added in series to an existing resistive circuit while the supply voltage remains constant, what happens to the total resistance and the circuit current?",
    "options": [
      "Total resistance increases and current decreases",
      "Total resistance increases and current increases",
      "Total resistance decreases and current increases",
      "Total resistance decreases and current decreases"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "USED_PARALLEL_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "conceptual",
      "resistance-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Adding resistors in series increases the total resistance. According to Ohm's Law (I=V/R), if resistance increases and voltage is constant, the current must decrease."
  },
  {
    "id": 4071,
    "question": "Three resistors are connected in series: R1 = 100 Ω, R2 = 500 Ω, and R3 = 1 kΩ. Which resistor will have the highest voltage drop across it?",
    "options": [
      "R3",
      "R1",
      "They will all have the same voltage drop",
      "R2"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "USED_PARALLEL_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "discrimination",
      "voltage-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, the current is the same through all components. Since V = I × R, the component with the highest resistance (R3 at 1000 Ω) will have the highest voltage drop."
  },
  {
    "id": 4072,
    "question": "A 100 V DC supply is connected to two 25 Ω resistors in series. What is the total power dissipated by the circuit?",
    "options": [
      "200 W",
      "400 W",
      "800 W",
      "50 W"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "calculation",
      "power",
      "series"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "RT = 25 + 25 = 50 Ω. Current I = V / RT = 100 / 50 = 2 A. Total Power P = V × I = 100 × 2 = 200 W."
  },
  {
    "id": 4073,
    "question": "A circuit contains three identical heating elements connected in series. If a technician accidentally places a short-circuit link across one of the elements, what is the effect on the remaining two elements?",
    "options": [
      "They will produce more heat because the circuit current increases",
      "They will produce less heat because the total resistance has increased",
      "They will stop working because the circuit is now shorted",
      "The voltage across the remaining elements will decrease"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "application",
      "fault-behaviour",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Shorting one resistor reduces the total circuit resistance. This causes the circuit current to increase, which increases the power (heat) in the remaining components (P = I²R)."
  },
  {
    "id": 4074,
    "question": "An ammeter is moved to different points within a simple series circuit containing a battery and three resistors. How will the readings compare?",
    "options": [
      "The readings will be identical at all points in the circuit",
      "The reading will be highest near the positive terminal",
      "The reading will decrease after each resistor",
      "The reading will be highest near the negative terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "conceptual",
      "current-rule",
      "discrimination"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a series circuit, there is only one path for electrons to flow, so the current (flow rate) is identical at every point in the loop."
  },
  {
    "id": 4075,
    "question": "A series circuit consists of two resistors, R1 = 40 Ω and R2 = 60 Ω. If a voltmeter connected across R1 reads 20 V, what is the total supply voltage?",
    "options": [
      "50 V",
      "30 V",
      "100 V",
      "40 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "RECIPROCAL_ERROR",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "application",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "First find current: I = V1 / R1 = 20 / 40 = 0.5 A. Since it is series, the same current flows through R2. Voltage drop across R2 = 0.5 × 60 = 30 V. Total supply voltage VT = V1 + V2 = 20 + 30 = 50 V."
  },
  {
    "id": 4076,
    "question": "In a series circuit containing three resistors of different values, which statement correctly describes the current flow?",
    "options": [
      "The current remains the same at all points in the circuit",
      "The current is highest near the positive terminal of the source",
      "The current divides proportionally based on the resistance values",
      "The current is lowest through the resistor with the highest value"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_PARALLEL_RULE",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path for the electrons to flow, meaning the current (I) must be identical at every point in the loop."
  },
  {
    "id": 4077,
    "question": "An electrician adds an additional 50 Ω resistor in series to an existing circuit. What effect will this have on the total resistance and the total current, assuming the supply voltage remains constant?",
    "options": [
      "Total resistance increases and total current decreases",
      "Total resistance decreases and total current increases",
      "Total resistance increases and total current remains the same",
      "Total resistance increases and total current increases"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Adding resistors in series increases the total resistance (RT = R1 + R2...). According to Ohm's Law (I = V/R), if resistance increases while voltage is fixed, the current must decrease."
  },
  {
    "id": 4078,
    "question": "A series circuit consists of two resistors: R1 = 470 Ω and R2 = 1.2 kΩ. What is the total resistance (RT) of the circuit?",
    "options": [
      "1,670 Ω",
      "1.67 Ω",
      "471.2 Ω",
      "337.3 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "UNITS_MISSING",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First convert 1.2 kΩ to 1200 Ω. Then add the values: 470 Ω + 1200 Ω = 1670 Ω."
  },
  {
    "id": 4079,
    "question": "A 230 V supply is connected to two resistors in series: Resistor A (100 Ω) and Resistor B (200 Ω). Which resistor will have the larger voltage drop across it?",
    "options": [
      "Resistor B (200 Ω)",
      "Resistor A (100 Ω)",
      "Both will have an equal voltage drop of 115 V",
      "Neither, as voltage is not shared in a series circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "USED_PARALLEL_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "voltage-rule",
      "discrimination"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "In a series circuit, voltage is shared proportionally to resistance (V = I x R). Since the current is the same for both, the larger resistor (200 Ω) will result in a larger voltage drop."
  },
  {
    "id": 4080,
    "question": "Two identical 12 Ω lamps are connected in series to a 24 V DC power supply. What is the total current flowing through the circuit?",
    "options": [
      "1.0 A",
      "2.0 A",
      "0.5 A",
      "288 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "ohms-law",
      "application"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total resistance RT = 12 Ω + 12 Ω = 24 Ω. Using Ohm's Law: I = V / RT = 24 V / 24 Ω = 1.0 A."
  },
  {
    "id": 4081,
    "question": "If one lamp in a three-lamp series circuit fails 'open circuit', what will happen to the remaining two lamps?",
    "options": [
      "They will both go out because the circuit path is broken",
      "They will get brighter as they share more voltage",
      "They will stay lit at the same brightness",
      "They will dim because the resistance has increased"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A series circuit provides only one path for current. An 'open circuit' fault acts like a broken wire or open switch, stopping all current flow to all components in that loop."
  },
  {
    "id": 4082,
    "question": "A circuit has a 10 V supply and two resistors in series: R1 = 2 Ω and R2 = 3 Ω. Calculate the voltage drop across R2.",
    "options": [
      "6 V",
      "4 V",
      "10 V",
      "2 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "USED_PARALLEL_RULE",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "RT = 2 + 3 = 5 Ω. Total current I = 10V / 5Ω = 2 A. Voltage drop across R2 = I x R2 = 2 A x 3 Ω = 6 V."
  },
  {
    "id": 4083,
    "question": "When measuring values in a series circuit, how should the ammeter and voltmeter be correctly connected?",
    "options": [
      "Ammeter in series with the load; Voltmeter across the load",
      "Ammeter across the load; Voltmeter in series with the load",
      "Both instruments must be connected in series",
      "Both instruments must be connected in parallel (across)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An ammeter must be part of the circuit loop (series) to measure the flow through it. A voltmeter must be connected to two different points (parallel/across) to measure the potential difference between them."
  },
  {
    "id": 4084,
    "question": "A 230 V lighting circuit has a total series resistance of 100 Ω. Calculate the total power dissipated by the circuit.",
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
    "category": "Series Resistors",
    "tags": [
      "series",
      "power",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First find current: I = V / R = 230 / 100 = 2.3 A. Then find power: P = V x I = 230 x 2.3 = 529 W. (Alternatively P = V²/R)."
  },
  {
    "id": 4085,
    "question": "A circuit contains three resistors in series. If a copper link is accidentally placed across one of the resistors (creating a short circuit across it), what will happen to the total circuit current?",
    "options": [
      "The current will increase",
      "The current will decrease",
      "The current will drop to zero",
      "The current will remain unchanged"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Shorting out a resistor removes its resistance from the total. Since RT decreases and voltage remains the same, Ohm's Law (I = V/R) dictates that the current must increase."
  },
  {
    "id": 4086,
    "question": "In a series circuit containing three resistors of different values, which statement regarding the electrical quantities is correct?",
    "options": [
      "The current is the same at all points in the circuit",
      "The voltage drop across each resistor is identical",
      "The total resistance is lower than the smallest resistor",
      "The current divides proportionally between the resistors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "USED_PARALLEL_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit, there is only one path for the current to flow, meaning the current (I) remains constant at every point in the circuit."
  },
  {
    "id": 4087,
    "question": "A series circuit consists of four 12 V indicator lamps connected to a 48 V DC supply. If the filament in the second lamp breaks (open circuit), what will be the reading on an ammeter connected at the start of the circuit?",
    "options": [
      "0 A",
      "4 A",
      "1 A",
      "0.25 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "current-rule",
      "application"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Because a series circuit has only one path, an 'open circuit' fault anywhere in the loop breaks the path for all components, resulting in zero current flow throughout."
  },
  {
    "id": 4088,
    "question": "An electrician is testing a circuit with two resistors connected in series: R1 = 150 Ω and R2 = 100 Ω. If the circuit is connected to a 50 V supply, what is the total current flowing through R2?",
    "options": [
      "0.2 A",
      "0.5 A",
      "0.33 A",
      "12.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "USED_PARALLEL_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, find total resistance: Rt = 150 + 100 = 250 Ω. Then use Ohm's Law: I = V / Rt = 50 / 250 = 0.2 A. Current is the same through all components in series."
  },
  {
    "id": 4089,
    "question": "Two resistors, 10 Ω and 20 Ω, are connected in series to a DC source. If a voltmeter is used to measure the voltage drop across each resistor, which of the following will be observed?",
    "options": [
      "The 20 Ω resistor has twice the voltage drop of the 10 Ω resistor",
      "The 10 Ω resistor has twice the voltage drop of the 20 Ω resistor",
      "Both resistors have the same voltage drop regardless of resistance",
      "The voltage drop is only present across the first resistor in the chain"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "USED_PARALLEL_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "voltage-rule",
      "discrimination"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "According to V = I x R, since the current (I) is the same for both resistors in series, the voltage drop is directly proportional to the resistance. Therefore, the higher resistance will have the higher voltage drop."
  },
  {
    "id": 4090,
    "question": "What is the effect on a series circuit's characteristics if an additional resistor is added into the existing chain while the supply voltage remains constant?",
    "options": [
      "Total resistance increases and total current decreases",
      "Total resistance decreases and total current increases",
      "Total resistance increases and total current remains the same",
      "Total resistance remains the same but voltage drops increase"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "series",
      "resistance-rule",
      "conceptual"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Adding resistors in series increases the total resistance (Rt = R1 + R2 + ...). Since I = V / Rt, if the resistance increases and voltage stays the same, the current must decrease."
  },
  {
    "id": 4091,
    "question": "A series circuit consists of three resistors: R1 = 1.2 kΩ, R2 = 470 Ω, and R3 = 830 Ω. If the circuit is connected to a 230 V DC supply, what is the voltage drop across R2?",
    "options": [
      "43.24 V",
      "110.40 V",
      "76.36 V",
      "0.092 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "WRONG_UNITS",
      "3": "UNITS_MISSING"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "calculation",
      "voltage-rule",
      "units"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First, find total resistance: 1200 + 470 + 830 = 2500 Ω. Then find total current: I = V / Rt = 230 / 2500 = 0.092 A. Finally, find voltage drop across R2: V2 = I * R2 = 0.092 * 470 = 43.24 V."
  },
  {
    "id": 4092,
    "question": "Three identical resistors are connected in series to a constant voltage source. If a low-resistance link is accidentally placed across one of the resistors (short-circuiting it), what happens to the power dissipated by the remaining two resistors?",
    "options": [
      "The power dissipated by each remaining resistor increases",
      "The power dissipated by each remaining resistor decreases",
      "The total circuit power decreases because there are fewer components",
      "The current remains the same, but the voltage drop across them increases"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "conceptual",
      "power",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Shorting one resistor reduces the total resistance of the circuit. Since I = V / Rt, the total current increases. Power is calculated as P = I²R; since current increased and the resistance of the individual remaining resistors stayed the same, the power dissipated by each increases."
  },
  {
    "id": 4093,
    "question": "An electrician is testing a series circuit containing four lamps. A 'continuity' test shows an open circuit between lamp 2 and lamp 3. If the circuit is energized with 230 V, what would a high-resistance voltmeter read when connected across the break?",
    "options": [
      "230 V",
      "0 V",
      "115 V",
      "57.5 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "discrimination",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In an open series circuit, no current flows. Because there is no current, there are no voltage drops across the functional components (V=I*R, where I=0). Therefore, the full supply voltage appears across the point of the break."
  },
  {
    "id": 4094,
    "question": "Two resistors, R1 (100 Ω) and R2 (200 Ω), are connected in series. Both resistors have a maximum power rating of 1 Watt. What is the maximum supply voltage that can be applied to this circuit without exceeding the power rating of either resistor?",
    "options": [
      "21.21 V",
      "17.32 V",
      "30.00 V",
      "14.14 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "application",
      "power",
      "calculation"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Find max current for each: I1=sqrt(P/R1)=0.1A; I2=sqrt(P/R2)=0.0707A. The circuit is limited by the lower current (0.0707A) to avoid burning out R2. Max Voltage = I * Rt = 0.0707 * (100 + 200) = 21.21 V."
  },
  {
    "id": 4095,
    "question": "In a voltage divider circuit consisting of two resistors in series, R1 is 15 kΩ and R2 is 5 kΩ. If the output voltage is taken across R2 and the input supply is 24 V, what is the output voltage?",
    "options": [
      "6 V",
      "18 V",
      "8 V",
      "4.8 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "RECIPROCAL_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "calculation",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Using the ratio method: Vout = Vin * (R2 / (R1 + R2)). Vout = 24 * (5 / (15 + 5)) = 24 * (5 / 20) = 24 * 0.25 = 6 V."
  },
  {
    "id": 4096,
    "question": "Calculate the total current flowing in a series circuit with a 110 V DC supply and three resistors with values of 0.05 MΩ, 25 kΩ, and 5000 Ω. Give your answer in milliamperes (mA).",
    "options": [
      "1.375 mA",
      "110 mA",
      "0.001375 mA",
      "80 mA"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "UNITS_MISSING",
      "3": "USED_PARALLEL_RULE"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "calculation",
      "units",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Convert all to Ohms: 0.05 MΩ = 50,000 Ω; 25 kΩ = 25,000 Ω; 5000 Ω = 5,000 Ω. Rt = 80,000 Ω. I = V / Rt = 110 / 80,000 = 0.001375 A. To get mA, multiply by 1000 = 1.375 mA."
  },
  {
    "id": 4097,
    "question": "Which of the following describes the effect on a series circuit if the supply frequency was increased, assuming the circuit contains only pure resistors?",
    "options": [
      "The current and resistance remain unchanged",
      "The total resistance increases due to frequency skin effect",
      "The current increases because the voltage peaks higher",
      "The total resistance decreases as electrons move faster"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "conceptual",
      "ac-dc",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Pure resistance is independent of frequency in basic circuit theory. Unlike inductive or capacitive reactance, the ohmic resistance value does not change with frequency changes."
  },
  {
    "id": 4098,
    "question": "A string of 20 identical decorative lamps is connected in series to a 230 V supply. If one lamp is replaced with a lamp that has double the resistance of the others, what is the effect on the remaining 19 lamps?",
    "options": [
      "They will all become slightly dimmer",
      "They will all become slightly brighter",
      "They will remain at the same brightness",
      "They will all fail due to over-voltage"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "application",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO1",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Adding a higher resistance lamp increases the total circuit resistance (Rt). This reduces the total current (I = V / Rt). Since brightness depends on power (P=I²R), and the current has dropped, the 19 original lamps will receive less current and become dimmer."
  },
  {
    "id": 4099,
    "question": "A series circuit is powered by a fixed 12 V battery. If a fourth resistor is added into the existing series chain of three resistors, what happens to the total power dissipated by the circuit?",
    "options": [
      "The total power dissipated decreases",
      "The total power dissipated increases",
      "The total power dissipated remains the same",
      "The power dissipated by the first resistor increases"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "conceptual",
      "power",
      "resistance-rule"
    ],
    "learningOutcomeId": "202-202.3AAA-LO3",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Adding a resistor in series increases the total resistance. In a fixed voltage system, P = V² / Rt. As Rt increases, the total power (P) must decrease."
  },
  {
    "id": 4100,
    "question": "A 24 V DC control circuit has two resistors in series. R1 has a resistance of 10 Ω. An ammeter in the circuit measures 0.4 A. What is the resistance of R2?",
    "options": [
      "50 Ω",
      "60 Ω",
      "40 Ω",
      "14 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "USED_PARALLEL_RULE",
      "3": "SIGN_ERROR"
    },
    "section": "Science 2365 Level 2",
    "category": "Series Resistors",
    "tags": [
      "calculation",
      "resistance-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "202-202.3AAA-LO2",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First, find the total resistance required for 0.4 A: Rt = V / I = 24 / 0.4 = 60 Ω. In a series circuit, Rt = R1 + R2. Therefore, 60 = 10 + R2. R2 = 60 - 10 = 50 Ω."
  }
];
