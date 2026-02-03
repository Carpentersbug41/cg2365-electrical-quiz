import { TaggedQuestion } from './types';

/**
 * Cable Sizing Basics: Ib / In / Iz + Factors Question Bank
 * Aligned with lesson 203-3C learning outcomes
 * Generated: 2026-02-03
 */

export const cableSizingBasicsIbInIzFactorsQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "In cable sizing, what does the symbol 'Ib' represent?",
    "options": [
      "The design current of the circuit (expected load)",
      "The nominal rating of the protective device",
      "The tabulated current-carrying capacity from a table",
      "The current-carrying capacity under actual conditions"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "calculation"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Ib is the design current, which is the amount of current the circuit is expected to carry during normal operation."
  },
  {
    "id": 4017,
    "question": "Which symbol represents the nominal rating of the circuit's protective device (e.g., the MCB or fuse)?",
    "options": [
      "In",
      "Ib",
      "Iz",
      "It"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In represents the nominal current rating of the protective device chosen for the circuit."
  },
  {
    "id": 4018,
    "question": "Which of the following represents the 'golden rule' inequality for safe cable sizing?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib ≤ Iz ≤ In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "To ensure safety, the design current (Ib) must be less than or equal to the protective device rating (In), which in turn must be less than or equal to the cable's actual capacity (Iz)."
  },
  {
    "id": 4019,
    "question": "What does the symbol 'Iz' represent in the context of cable selection?",
    "options": [
      "The current-carrying capacity of the cable under actual installation conditions",
      "The tabulated current capacity found in BS 7671 tables",
      "The current that causes the protective device to trip instantly",
      "The voltage drop across the length of the cable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Iz is the 'derated' capacity, meaning the safe amount of current the cable can carry after correction factors (like heat or grouping) have been applied."
  },
  {
    "id": 4020,
    "question": "Why are correction factors such as 'Ca' and 'Cg' applied to a cable's tabulated current-carrying capacity?",
    "options": [
      "To account for environmental conditions that restrict heat dissipation",
      "To increase the speed at which the circuit breaker operates",
      "To allow for future expansion of the electrical installation",
      "To compensate for the resistance of the copper conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Correction factors are 'heat penalties'. If a cable is in a hot room or grouped with others, it cannot shed heat as easily, so its safe current capacity is reduced."
  },
  {
    "id": 4021,
    "question": "If a cable run is subject to an ambient temperature factor (Ca) of 0.87 and a grouping factor (Cg) of 0.70, what is the combined correction factor (Ctotal)?",
    "options": [
      "0.609",
      "1.570",
      "0.170",
      "1.240"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Correction factors are multiplied together: 0.87 x 0.70 = 0.609."
  },
  {
    "id": 4022,
    "question": "An electrician calculates that a circuit needs a cable with a minimum tabulated capacity (It) of 27 A. Which of these cables is the best choice?",
    "options": [
      "A cable with an It of 32 A",
      "A cable with an It of 20 A",
      "A cable with an It of 25 A",
      "A cable with an It of 15 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The cable selected must have a tabulated capacity (It) equal to or greater than the calculated requirement."
  },
  {
    "id": 4023,
    "question": "Which correction factor is specifically used when a cable is surrounded by thermal insulation (e.g., glass fibre in a loft)?",
    "options": [
      "Ci",
      "Ca",
      "Cg",
      "Cf"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Ci is the correction factor for thermal insulation."
  },
  {
    "id": 4024,
    "question": "What is the primary danger if the protective device rating (In) is larger than the cable's actual capacity (Iz)?",
    "options": [
      "The cable could overheat and fire could occur before the device trips",
      "The circuit will experience high voltage surges",
      "The electricity meter will run faster than it should",
      "The load equipment will not receive enough current to start"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If In > Iz, the cable can carry more current than it is safely rated for without the fuse or MCB cutting the power, leading to dangerous overheating."
  },
  {
    "id": 4025,
    "question": "If a protective device rating (In) is 20 A and the total correction factor is 0.5, what is the minimum tabulated current-carrying capacity (It) required?",
    "options": [
      "40 A",
      "10 A",
      "20.5 A",
      "15 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To find the required It, you divide the protective device rating by the correction factors: 20 / 0.5 = 40 A."
  },
  {
    "id": 4026,
    "question": "In the standard cable sizing procedure, what does the symbol 'Ib' represent?",
    "options": [
      "The design current (the expected load of the circuit)",
      "The nominal rating of the protective device",
      "The tabulated current-carrying capacity from a table",
      "The actual current-carrying capacity after factors are applied"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Ib is the design current, which is the amount of current the circuit is expected to carry during normal operation based on the connected load."
  },
  {
    "id": 4027,
    "question": "Which of the following inequalities must be met to ensure a cable is properly protected from overload?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib + In = Iz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "TOPOLOGY_CONFUSION",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The rule Ib ≤ In ≤ Iz ensures the load doesn't trip the breaker (Ib ≤ In) and the breaker protects the cable (In ≤ Iz)."
  },
  {
    "id": 4028,
    "question": "Which correction factor is specifically used to account for cables being installed together in a group, such as in a conduit or trunking?",
    "options": [
      "Cg",
      "Ca",
      "Ci",
      "Cf"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Cg is the grouping factor. Ca is for ambient temperature, Ci is for thermal insulation, and Cf is for certain protective devices."
  },
  {
    "id": 4029,
    "question": "Why is it usually necessary to apply correction factors when selecting a cable size?",
    "options": [
      "To account for environmental conditions that restrict the cable's ability to dissipate heat",
      "To increase the voltage drop allowed across the circuit",
      "To reduce the overall cost of the installation materials",
      "To ensure the cable length is kept as short as possible"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Correction factors account for heat-trapping conditions like high temperature or insulation. If heat cannot escape, the cable's current-carrying capacity must be reduced."
  },
  {
    "id": 4030,
    "question": "An electrician calculates that a circuit has an ambient temperature factor (Ca) of 0.90 and a grouping factor (Cg) of 0.70. What is the total correction factor (Ctotal)?",
    "options": [
      "0.63",
      "1.60",
      "0.20",
      "0.80"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Correction factors are multiplied together to find the total effect. 0.90 × 0.70 = 0.63."
  },
  {
    "id": 4031,
    "question": "In the cable sizing procedure, what does the symbol 'Ib' represent?",
    "options": [
      "The design current of the circuit based on the intended load",
      "The nominal rating of the protective device (fuse or MCB)",
      "The tabulated current-carrying capacity from a reference table",
      "The final current-carrying capacity after correction factors are applied"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Ib is the design current, which is the current the circuit is expected to carry in normal use based on the connected load."
  },
  {
    "id": 4032,
    "question": "Which of the following inequalities must be satisfied to ensure a cable is correctly protected against overload?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib ≤ Iz ≤ In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "The safety rule is that the design current (Ib) must be less than or equal to the protective device rating (In), which in turn must be less than or equal to the cable's actual capacity (Iz)."
  },
  {
    "id": 4033,
    "question": "An electrician calculates a total correction factor (Ctotal) for a circuit where the ambient temperature factor (Ca) is 0.87 and the grouping factor (Cg) is 0.70. What is the combined factor?",
    "options": [
      "0.609",
      "1.570",
      "0.170",
      "0.785"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "SIGN_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Correction factors are multipliers. 0.87 × 0.70 = 0.609. Students often mistakenly add them together (1.57)."
  },
  {
    "id": 4034,
    "question": "Why must the protective device rating (In) be less than or equal to the cable’s actual current-carrying capacity (Iz)?",
    "options": [
      "To ensure the device trips before the cable insulation is damaged by heat",
      "To prevent the circuit breaker from tripping under normal load conditions",
      "To reduce the total voltage drop across the length of the circuit",
      "To allow for future expansion of the electrical installation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONCEPTUAL_CONFUSION",
      "3": "CONCEPTUAL_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "If In is greater than Iz, the cable could reach a temperature that damages its insulation before the protective device operates to cut the power."
  },
  {
    "id": 4035,
    "question": "A circuit has a design current (Ib) of 27 A. Which of the following standard protective device ratings (In) would be the most appropriate first choice?",
    "options": [
      "32 A",
      "25 A",
      "20 A",
      "40 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONCEPTUAL_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In must be greater than or equal to Ib. 25 A and 20 A are too small and would cause nuisance tripping. 32 A is the next standard size up from 27 A."
  },
  {
    "id": 4036,
    "question": "A circuit is protected by a 20 A MCB (In). The total correction factor (Ctotal) for the installation conditions is 0.80. What is the minimum tabulated current-carrying capacity (It) required?",
    "options": [
      "25.0 A",
      "16.0 A",
      "20.8 A",
      "19.2 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To find the minimum It, you divide the protective device rating by the correction factors: 20 / 0.80 = 25 A."
  },
  {
    "id": 4037,
    "question": "Which correction factor is specifically used to account for cables being installed in thermal insulation?",
    "options": [
      "Ci",
      "Cg",
      "Ca",
      "Cf"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 30,
    "explanation": "Ci is the correction factor for thermal insulation. Cg is for grouping, Ca is for ambient temperature, and Cf is for specific protective devices."
  },
  {
    "id": 4038,
    "question": "If a cable is installed in an environment with an ambient temperature higher than the standard 30°C, how does this affect the cable's current-carrying capacity (Iz)?",
    "options": [
      "Iz decreases because the cable cannot dissipate heat as effectively",
      "Iz increases because the electrons move faster in the heat",
      "Iz stays the same as the tabulated value (It)",
      "Iz becomes equal to the design current (Ib)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONCEPTUAL_CONFUSION",
      "2": "CONCEPTUAL_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Higher ambient temperatures reduce the cable's ability to shed heat, meaning it can safely carry less current without the insulation melting."
  },
  {
    "id": 4039,
    "question": "A circuit has a design current (Ib) of 14 A and is protected by a 16 A fuse (In). If the correction factors result in a Ctotal of 0.5, what is the minimum required tabulated capacity (It)?",
    "options": [
      "32 A",
      "28 A",
      "8 A",
      "7 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The required It is calculated using In: 16 / 0.5 = 32 A. Using Ib (14 / 0.5 = 28 A) is a common student error."
  },
  {
    "id": 4040,
    "question": "What is the primary difference between 'It' and 'Iz' in electrical design?",
    "options": [
      "It is the capacity under standard lab conditions; Iz is the capacity in real installation conditions",
      "It is the design current of the load; Iz is the rating of the fuse",
      "It is the total current in a parallel circuit; Iz is the total current in a series circuit",
      "It is the capacity of a copper cable; Iz is the capacity of an aluminium cable"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "It (Tabulated) is the 'base' rating from the regs books. Iz is the 'derated' value that reflects the actual environment the cable is in."
  },
  {
    "id": 4041,
    "question": "In the cable sizing procedure, what does the symbol 'Ib' represent?",
    "options": [
      "The design current of the circuit based on the intended load",
      "The rated current of the circuit protective device",
      "The tabulated current-carrying capacity from BS 7671",
      "The actual current-carrying capacity after correction factors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Ib is the Design Current, which is the current intended to be carried by the circuit in normal service."
  },
  {
    "id": 4042,
    "question": "According to the fundamental safety rule Ib ≤ In ≤ Iz, what is the specific danger of having a protective device rating (In) that is higher than the cable's actual capacity (Iz)?",
    "options": [
      "The cable could overheat and damage insulation before the device trips",
      "The circuit will suffer from nuisance tripping during normal use",
      "The load will not receive enough voltage to operate correctly",
      "The electricity meter will record higher energy consumption"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The protective device must trip before the cable reaches a temperature that damages its insulation. If In > Iz, the cable can exceed its safe thermal limit without the device operating."
  },
  {
    "id": 4043,
    "question": "An electrician is calculating the total correction factor (Ctotal) for a circuit where the ambient temperature factor (Ca) is 0.87 and the grouping factor (Cg) is 0.70. What is the combined factor?",
    "options": [
      "0.609",
      "1.570",
      "0.170",
      "1.242"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Correction factors are multipliers. Total factor = 0.87 × 0.70 = 0.609."
  },
  {
    "id": 4044,
    "question": "Which specific correction factor must be applied when a cable is installed in an area where it is surrounded by thermal insulation?",
    "options": [
      "Ci",
      "Ca",
      "Cg",
      "Cf"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Ci is the correction factor for thermal insulation. Ca is ambient temperature, Cg is grouping, and Cf is for semi-enclosed fuses (BS 3036)."
  },
  {
    "id": 4045,
    "question": "A shower circuit has a calculated design current (Ib) of 37 A. Which of the following standard protective device ratings (In) would be the most appropriate starting point for selection?",
    "options": [
      "40 A",
      "32 A",
      "30 A",
      "50 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "SIGN_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "The rule is Ib ≤ In. Since Ib is 37 A, the protective device must be at least 37 A. 40 A is the next standard size up."
  },
  {
    "id": 4046,
    "question": "If the protective device rating (In) is 32 A and the combined correction factor (Ctotal) is 0.8, what is the minimum tabulated current-carrying capacity (It) required for the cable?",
    "options": [
      "40.0 A",
      "25.6 A",
      "32.8 A",
      "32.0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "To find the required It, you divide In by the correction factors: 32 / 0.8 = 40 A."
  },
  {
    "id": 4047,
    "question": "Why do correction factors like Ca and Cg usually result in a numerical value less than 1.0?",
    "options": [
      "Because environmental conditions reduce the cable's ability to dissipate heat",
      "Because they are designed to increase the voltage drop across the cable",
      "Because they represent the percentage of current that is lost to the earth",
      "Because they account for the physical length of the cable run"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3C-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Factors less than 1.0 'derate' the cable, meaning it can safely carry less current because it cannot shed heat as effectively in those conditions."
  },
  {
    "id": 4048,
    "question": "An installation calculation determines that a minimum tabulated current (It) of 26.4 A is required. Which of the following cables, identified by their tabulated capacities, would be suitable?",
    "options": [
      "27 A",
      "25 A",
      "20 A",
      "26 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "SIGN_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The selected cable must have a tabulated capacity (It) equal to or greater than the calculated requirement."
  },
  {
    "id": 4049,
    "question": "A circuit is protected by a 20 A MCB. It is installed in an area with an ambient temperature factor (Ca) of 0.91 and a grouping factor (Cg) of 0.80. Calculate the minimum required tabulated capacity (It).",
    "options": [
      "27.47 A",
      "14.56 A",
      "21.98 A",
      "25.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First, find Ctotal: 0.91 × 0.80 = 0.728. Then, Required It = In / Ctotal: 20 / 0.728 = 27.47 A."
  },
  {
    "id": 4050,
    "question": "Which of the following correctly describes the difference between 'It' and 'Iz'?",
    "options": [
      "It is the table value; Iz is the safe capacity after factors are applied",
      "It is the design current; Iz is the protective device rating",
      "It is the current at the source; Iz is the current at the load",
      "It is the maximum fault current; Iz is the normal load current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "It (Tabulated) is the 'on-paper' rating under standard conditions. Iz is the 'Effective' current-carrying capacity for the actual installation conditions."
  },
  {
    "id": 4051,
    "question": "Which term describes the current-carrying capacity of a cable under its actual installation conditions, after all relevant correction factors have been applied?",
    "options": [
      "Iz",
      "It",
      "In",
      "Ib"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Iz represents the effective current-carrying capacity of the cable after derating factors (Ca, Cg, etc.) are applied to the tabulated value (It)."
  },
  {
    "id": 4052,
    "question": "In the standard cable sizing inequality Ib ≤ In ≤ Iz, what is the primary safety risk if the protective device rating (In) is greater than the cable's current-carrying capacity (Iz)?",
    "options": [
      "The cable could overheat and cause a fire before the protective device trips",
      "The protective device will trip frequently under normal load conditions",
      "The voltage drop at the end of the circuit will exceed permitted limits",
      "The design current (Ib) will increase to match the rating of the fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The protective device (In) must be rated less than or equal to the cable's capacity (Iz) to ensure it disconnects the supply before the cable reaches a dangerous temperature."
  },
  {
    "id": 4053,
    "question": "An electrician is installing a circuit where the cables are grouped with others (Cg = 0.70) and pass through an area with high ambient temperature (Ca = 0.87). What is the total combined correction factor (Ctotal)?",
    "options": [
      "0.609",
      "1.570",
      "0.700",
      "0.170"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Correction factors are multipliers. To find the combined effect, you multiply them together: 0.70 x 0.87 = 0.609."
  },
  {
    "id": 4054,
    "question": "A circuit is protected by a 32 A MCB (In). After considering grouping and thermal insulation, the combined correction factor is calculated as 0.61. What is the minimum tabulated current-carrying capacity (It) required when selecting the cable?",
    "options": [
      "52.46 A",
      "19.52 A",
      "32.61 A",
      "38.10 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "To find the required It, you divide the protective device rating by the correction factors: 32 / 0.61 = 52.459 A. We round up to ensure the cable meets the minimum requirement."
  },
  {
    "id": 4055,
    "question": "A new radial circuit for a workshop has a calculated design current (Ib) of 26 A. Following the sizing chain Ib ≤ In ≤ Iz, which of the following is the most appropriate rating for the protective device (In)?",
    "options": [
      "32 A",
      "20 A",
      "25 A",
      "40 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "SIGN_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "discrimination",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3C-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The protective device (In) must be greater than or equal to the design current (Ib). Since 26 A is the load, a 32 A device is the next standard size that satisfies Ib ≤ In."
  },
  {
    "id": 4056,
    "question": "In the fundamental sizing inequality Ib ≤ In ≤ Iz, what is the specific safety risk if the relationship In ≤ Iz is not maintained?",
    "options": [
      "The cable can reach temperatures that damage insulation before the protective device operates",
      "The protective device will suffer from nuisance tripping during normal load conditions",
      "The circuit will experience excessive voltage drop under full load",
      "The design current will exceed the rated capacity of the connected load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "legislation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The protective device (In) must be rated less than or equal to the actual current-carrying capacity (Iz). If In > Iz, the cable could carry a current higher than its safe limit for a sustained period without the fuse or MCB ever tripping, leading to a fire risk."
  },
  {
    "id": 4057,
    "question": "An electrician is looking up the 'Tabulated Current-carrying Capacity' for a 70°C thermoplastic Twin and Earth cable from a reference table. Which symbol represents this specific value before any environmental factors are applied?",
    "options": [
      "It",
      "Iz",
      "In",
      "Ib"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "It represents the tabulated current-carrying capacity found in standard tables. Iz is the actual capacity after factors are applied, In is the device rating, and Ib is the design current."
  },
  {
    "id": 4058,
    "question": "A circuit has a design current (Ib) of 23 A and is protected by a 25 A MCB (In). The cable is grouped with other circuits (Cg = 0.70) and is in an ambient temperature of 40°C (Ca = 0.87). Calculate the minimum required tabulated current (It) for the cable.",
    "options": [
      "41.05 A",
      "15.23 A",
      "37.77 A",
      "25.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "To find the required It, you divide the protective device rating (In) by the combined correction factors: 25 / (0.70 × 0.87) = 25 / 0.609 = 41.05 A."
  },
  {
    "id": 4059,
    "question": "Why are correction factors such as Ca (ambient temperature) and Cg (grouping) almost always expressed as values less than 1.0?",
    "options": [
      "They represent a 'heat penalty' that reduces the cable's ability to dissipate thermal energy",
      "They are used to account for the resistance of the protective device itself",
      "They adjust the voltage rating of the cable to match the supply frequency",
      "They represent the efficiency of the insulation material at 0°C"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Environmental factors like high temperature or grouping hinder the cable's ability to shed heat. Multiplying the tabulated capacity by a factor less than 1.0 correctly reduces the safe current limit (Iz)."
  },
  {
    "id": 4060,
    "question": "Which specific correction factor must be applied when a cable is installed such that it is completely surrounded by thermal insulation for a length of 0.5 metres or more?",
    "options": [
      "Ci",
      "Ca",
      "Cg",
      "Cf"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "Ci is the correction factor for thermal insulation. Ca is for ambient temperature, Cg is for grouping, and Cf is typically for semi-enclosed fuses (BS 3036)."
  },
  {
    "id": 4061,
    "question": "A 32 A ring final circuit (In = 32 A) uses a cable with a tabulated capacity (It) of 38 A. If the cable is grouped with three other circuits (Cg = 0.65), what is its actual current-carrying capacity (Iz)?",
    "options": [
      "24.7 A",
      "58.5 A",
      "32.0 A",
      "20.8 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Iz is calculated by multiplying the tabulated capacity (It) by the correction factors: 38 A × 0.65 = 24.7 A. Note that in this case, the cable is undersized because Iz (24.7 A) is less than In (32 A)."
  },
  {
    "id": 4062,
    "question": "If an installation check reveals that the actual current-carrying capacity (Iz) of a cable is 21 A, but the circuit is protected by a 25 A MCB (In), why is this considered a failure of BS 7671 requirements?",
    "options": [
      "The cable is not protected against overload because the MCB will allow 25 A to flow through a 21 A rated cable",
      "The MCB will trip prematurely before the load reaches its design current of 21 A",
      "The voltage drop across the cable will be 4% higher than the maximum allowed limit",
      "The cable will suffer from dielectric breakdown due to the 4 A difference"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The protective device rating (In) must be less than or equal to the cable's actual capacity (Iz). If In is 25 A and Iz is 21 A, the cable can overheat while the MCB 'thinks' the current is within safe limits."
  },
  {
    "id": 4063,
    "question": "When establishing the design current (Ib) for a circuit serving a fixed 9.5 kW electric shower on a 230 V supply, which value is being determined?",
    "options": [
      "The actual current the load is expected to draw during normal operation",
      "The minimum current required to trip the RCD within 40ms",
      "The maximum current the cable can carry when clipped direct to a wall",
      "The rating of the isolation switch required for the shower"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Ib (Design Current) is specifically the current the circuit is intended to carry in normal use, calculated from the load power and voltage (I = P/V)."
  },
  {
    "id": 4064,
    "question": "An electrician calculates a combined correction factor (Ctotal) of 0.50 due to severe grouping and high temperatures. If the required protective device (In) is 20 A, what is the minimum tabulated current (It) the cable must have?",
    "options": [
      "40 A",
      "10 A",
      "20 A",
      "30 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "ROUNDING_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3C-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Required It = In / Ctotal. Therefore, 20 A / 0.50 = 40 A. This shows how derating factors 'upgrade' the required size of the cable."
  },
  {
    "id": 4065,
    "question": "How does the application of correction factors change the relationship between the tabulated capacity (It) and the actual capacity (Iz)?",
    "options": [
      "Iz will be smaller than It because the factors account for reduced heat dissipation",
      "Iz will be larger than It because the factors account for improved insulation cooling",
      "Iz and It remain identical, but Ib is increased to compensate for heat",
      "The factors only apply to In, so Iz and It are unaffected by the environment"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Cable Sizing Basics",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3C-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Tabulated capacity (It) is the 'ideal' laboratory rating. Since real-world factors (grouping, heat, insulation) usually make it harder for the cable to stay cool, Iz (the real rating) is almost always smaller than It."
  }
];
