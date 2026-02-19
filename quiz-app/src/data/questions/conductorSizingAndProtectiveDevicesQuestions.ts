import { TaggedQuestion } from './types';

/**
 * Conductor Sizing and Protective Devices Question Bank
 * Aligned with lesson 203-3B learning outcomes
 * Generated: 2026-02-19
 */

export const conductorSizingAndProtectiveDevicesQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary purpose of a circuit breaker within an electrical installation?",
    "options": [
      "To protect the circuit conductors from damage caused by overcurrent",
      "To measure the amount of energy consumed by the property",
      "To increase the supply voltage to the connected appliances",
      "To convert Alternating Current (AC) into Direct Current (DC)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "terminology",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The primary role of a protective device like a circuit breaker is to protect the cables (conductors) from overheating and damage due to overcurrent (overloads or short circuits)."
  },
  {
    "id": 4017,
    "question": "Which type of protective device provides both overcurrent protection and earth fault leakage protection in a single unit?",
    "options": [
      "RCBO",
      "MCB",
      "RCD",
      "BS 3036 Fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent protection) combines the functions of an MCB and an RCD into one device."
  },
  {
    "id": 4018,
    "question": "According to the coordination rule, if a circuit has a design current (Ib) of 14A, what is the minimum standard rating (In) for the protective device?",
    "options": [
      "16A",
      "10A",
      "13A",
      "32A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The rating of the protective device (In) must be greater than or equal to the design current (Ib). The next standard size above 14A is 16A."
  },
  {
    "id": 4019,
    "question": "In conductor sizing calculations, what does the symbol 'Iz' represent?",
    "options": [
      "The current-carrying capacity of the cable under specific installation conditions",
      "The total power consumed by the load in Watts",
      "The resistance of the conductor per metre",
      "The rating of the protective device selected"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "UNITS_MISSING",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Iz represents the effective current-carrying capacity of the conductor after correction factors (like temperature or grouping) have been applied."
  },
  {
    "id": 4020,
    "question": "Which British Standard refers to a semi-enclosed (rewireable) fuse?",
    "options": [
      "BS 3036",
      "BS 1362",
      "BS 88-2",
      "BS EN 60898"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "BS 3036 is the specific standard for semi-enclosed rewireable fuses, commonly found in older installations."
  },
  {
    "id": 4021,
    "question": "What is the effect on a cable's current-carrying capacity if it is completely surrounded by thermal insulation for a distance of 500mm or more?",
    "options": [
      "The capacity is significantly reduced",
      "The capacity is significantly increased",
      "The capacity remains exactly the same",
      "The capacity doubles due to heat retention"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Thermal insulation prevents heat from escaping the cable. To prevent the cable from melting, its maximum current-carrying capacity must be reduced (derated)."
  },
  {
    "id": 4022,
    "question": "An electrician is selecting an MCB for a domestic lighting circuit with a design current (Ib) of 4.5A. Which rating is standard for this application?",
    "options": [
      "6A",
      "3A",
      "13A",
      "32A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The standard MCB rating for domestic lighting is 6A, which satisfies the requirement that In (6A) is greater than Ib (4.5A)."
  },
  {
    "id": 4023,
    "question": "Which type of MCB is specifically designed to prevent nuisance tripping in circuits with moderate inductive loads, such as small electric motors?",
    "options": [
      "Type C",
      "Type B",
      "Type A",
      "Type Z"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Type C breakers are designed to trip between 5 and 10 times their rated current, making them suitable for the starting surges of motors."
  },
  {
    "id": 4024,
    "question": "When calculating cable size, which correction factor must be applied if multiple circuits are installed together in the same conduit?",
    "options": [
      "Cg (Grouping factor)",
      "Ca (Ambient temperature factor)",
      "Ci (Thermal insulation factor)",
      "Cc (Rewireable fuse factor)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cg is the grouping factor used when cables are bunched or grouped together, as they will heat each other up."
  },
  {
    "id": 4025,
    "question": "What is the main reason for ensuring that the design current (Ib) does not exceed the protective device rating (In)?",
    "options": [
      "To ensure the protective device does not trip during normal operation",
      "To make sure the cable stays warm during winter",
      "To reduce the resistance of the circuit conductors",
      "To allow the user to plug in more appliances than the circuit can handle"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "If the design current (Ib) was higher than the device rating (In), the fuse or breaker would trip or blow as soon as the equipment was turned on."
  },
  {
    "id": 4026,
    "question": "In a standard circuit design, what is the required relationship between the nominal rating of the protective device (In) and the current-carrying capacity of the conductor (Iz)?",
    "options": [
      "Iz must be greater than or equal to In",
      "In must be significantly greater than Iz",
      "Iz must be exactly half of In",
      "In must be equal to the design current (Ib) only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Conductor Sizing and Protective Devices",
    "category": "Current-carrying capacity",
    "tags": [
      "calculation",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "According to BS 7671, the current-carrying capacity of the conductor (Iz) must be greater than or equal to the nominal rating of the protective device (In) to ensure the cable is protected from overheating."
  },
  {
    "id": 4027,
    "question": "Which type of circuit breaker is specifically designed to provide protection against both overload and short-circuit currents in a domestic installation?",
    "options": [
      "MCB (Miniature Circuit Breaker)",
      "RCD (Residual Current Device)",
      "Isolator",
      "Main Switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Conductor Sizing and Protective Devices",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An MCB provides two types of protection: thermal protection against overload and magnetic protection against short-circuits. An RCD primarily provides earth fault protection."
  },
  {
    "id": 4028,
    "question": "Which of the following environmental factors would most likely require a conductor's cross-sectional area to be increased to maintain its safety?",
    "options": [
      "The cable is surrounded by thermal insulation",
      "The ambient temperature surrounding the cable decreases",
      "The cable length is significantly shortened",
      "The cable is installed in a cooler underground duct"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Conductor Sizing and Protective Devices",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Thermal insulation restricts the dissipation of heat from the conductor. To prevent the insulation from melting, the conductor size must be increased to reduce the heat generated per meter."
  },
  {
    "id": 4029,
    "question": "In the standard circuit design procedure, what does the symbol 'Ib' represent?",
    "options": [
      "The design current of the circuit",
      "The nominal rating of the protective device",
      "The current-carrying capacity of the cable",
      "The voltage drop across the load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Conductor Sizing and Protective Devices",
    "category": "Terminology",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Ib is the symbol for the design current, which is the actual current intended to be carried by the circuit in normal service."
  },
  {
    "id": 4030,
    "question": "An electrician is installing a domestic cooker circuit with a design current (Ib) of 28A. Which of the following standard protective device ratings (In) would be the most appropriate choice?",
    "options": [
      "32A",
      "20A",
      "13A",
      "6A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Conductor Sizing and Protective Devices",
    "category": "Protective Devices",
    "tags": [
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The protective device rating (In) must be greater than or equal to the design current (Ib). Since the design current is 28A, a 32A MCB is the next standard size up."
  },
  {
    "id": 4031,
    "question": "An electrician is sizing a circuit with a design current (Ib) of 17 A. The protective device (In) selected is 20 A. If the cable is grouped with other circuits resulting in a correction factor (Cg) of 0.7, what is the minimum required current-carrying capacity (It) for the conductor?",
    "options": [
      "28.57 A",
      "14.00 A",
      "24.28 A",
      "11.90 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "USED_SERIES_RULE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To find the minimum current-carrying capacity (It), the formula is It = In / Cg. Therefore, 20 / 0.7 = 28.57 A."
  },
  {
    "id": 4032,
    "question": "Which of the following circuit arrangements correctly follows the fundamental rule for coordination between conductors and protective devices as per BS 7671?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib ≤ Iz ≤ In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The design current (Ib) must be less than or equal to the nominal rating of the protective device (In), which must be less than or equal to the current-carrying capacity of the conductor (Iz)."
  },
  {
    "id": 4033,
    "question": "A 32 A circuit is protected by a BS 3036 semi-enclosed (rewireable) fuse. When calculating the required conductor size, what specific correction factor (Cf) must be applied to the calculation?",
    "options": [
      "0.725",
      "0.87",
      "0.95",
      "1.45"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "BS 3036 fuses have a higher fusing factor than circuit breakers. To compensate for this, a correction factor of 0.725 is applied to the conductor's current-carrying capacity."
  },
  {
    "id": 4034,
    "question": "A circuit is being installed in an area where the ambient temperature is expected to reach 40°C. If the correction factor (Ca) for this temperature is 0.87 and the protective device is 32 A, what is the minimum 'It' value needed?",
    "options": [
      "36.78 A",
      "27.84 A",
      "32.00 A",
      "40.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The minimum current carrying capacity It = In / Ca. Therefore, 32 / 0.87 = 36.78 A."
  },
  {
    "id": 4035,
    "question": "Why would a Type C circuit breaker be selected over a Type B circuit breaker for a workshop power circuit?",
    "options": [
      "To allow for higher inrush currents from motor starting",
      "To provide faster disconnection under small overloads",
      "Because it is cheaper to install in commercial settings",
      "To ensure the circuit can handle higher steady-state voltages"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type C breakers are designed to handle moderate inrush currents (5-10 times In), making them suitable for motors and highly inductive loads."
  },
  {
    "id": 4036,
    "question": "What is the primary purpose of applying a 'grouping factor' (Cg) when sizing conductors?",
    "options": [
      "To account for the reduced heat dissipation when cables are close together",
      "To reduce the total voltage drop across the installation",
      "To allow for the increase in magnetic interference between phases",
      "To increase the mechanical strength of the cable run"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "When cables are grouped, they cannot dissipate heat as effectively, which increases their operating temperature and necessitates a reduction in their rated current-carrying capacity."
  },
  {
    "id": 4037,
    "question": "Selectivity (discrimination) between two protective devices is achieved when:",
    "options": [
      "The device closest to the fault operates while the upstream device stays closed",
      "Both the upstream and downstream devices operate simultaneously",
      "The largest rated device in the circuit always trips first",
      "The RCD trips before the MCB under a short-circuit condition"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Selectivity ensures that only the protective device immediately upstream of a fault disconnects the supply, leaving the rest of the installation energized."
  },
  {
    "id": 4038,
    "question": "A conductor is to be installed totally surrounded by thermal insulation for a length of 2 metres. According to BS 7671, what correction factor (Ci) should typically be applied?",
    "options": [
      "0.5",
      "0.75",
      "1.0",
      "0.8"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "discrimination",
      "units",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "When a cable is totally surrounded by thermal insulation for more than 0.5m, a factor of 0.5 is usually applied (Reference Method 103)."
  },
  {
    "id": 4039,
    "question": "An electrician is installing a 10 kW shower (Ib ≈ 43.5 A). The circuit is protected by a 45 A MCB. If the cable is run through a ceiling space with an ambient temperature of 35°C (Ca = 0.94), calculate the minimum It.",
    "options": [
      "47.87 A",
      "40.89 A",
      "42.30 A",
      "45.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "It = In / Ca. Therefore, 45 / 0.94 = 47.87 A."
  },
  {
    "id": 4040,
    "question": "Which BS EN standard refers to the circuit breakers typically used in domestic consumer units for overcurrent protection?",
    "options": [
      "BS EN 60898",
      "BS EN 61008",
      "BS EN 61009",
      "BS 3036"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "BS EN 60898 is the standard for circuit breakers (MCBs) for overcurrent protection in household and similar installations."
  },
  {
    "id": 4041,
    "question": "Which of the following mathematical expressions correctly describes the relationship between design current (Ib), the rating of the protective device (In), and the current-carrying capacity of the conductor (Iz)?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "In ≤ Ib ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "Ib ≤ Iz ≤ In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "terminology",
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "According to BS 7671, the design current (Ib) must not exceed the nominal rating of the protective device (In), which in turn must not exceed the current-carrying capacity of the conductor (Iz) after correction factors are applied."
  },
  {
    "id": 4042,
    "question": "A Type B Circuit Breaker (BS EN 60898) is specifically designed to trip instantaneously within which range of its rated current (In)?",
    "options": [
      "3 to 5 times In",
      "5 to 10 times In",
      "10 to 20 times In",
      "1 to 3 times In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type B MCBs are designed to trip between 3 and 5 times their rated current, making them suitable for domestic resistive loads where high inrush currents are unlikely."
  },
  {
    "id": 4043,
    "question": "An electrician is sizing a circuit where the protective device is a 32 A MCB. If the cables are grouped with three other circuits (Cg = 0.65), what is the minimum tabulated current-carrying capacity (It) required for the conductor?",
    "options": [
      "49.23 A",
      "20.80 A",
      "32.65 A",
      "41.60 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the formula It ≥ In / Cg, we calculate 32 / 0.65 = 49.23 A. Many students mistakenly multiply by the factor instead of dividing."
  },
  {
    "id": 4044,
    "question": "When using a BS 3036 semi-enclosed (rewirable) fuse for circuit protection, what specific correction factor (Cf) must be applied to the current-carrying capacity calculation?",
    "options": [
      "0.725",
      "0.87",
      "1.00",
      "0.925"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "BS 3036 fuses have a higher fusing factor than modern circuit breakers. To compensate for their slow operation under overload, a factor of 0.725 is applied to the conductor rating."
  },
  {
    "id": 4045,
    "question": "Which protective device type would be most appropriate for a circuit supplying a large commercial air conditioning unit with a high inductive starting current?",
    "options": [
      "Type D MCB",
      "Type B MCB",
      "Type A MCB",
      "Type C MCB"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "application",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type D MCBs are designed for high inductive loads (tripping at 10-20 times In) to prevent nuisance tripping during the high inrush currents typical of large motors and transformers."
  },
  {
    "id": 4046,
    "question": "A 9.2 kW electric shower is connected to a 230 V supply. What is the design current (Ib) for this circuit?",
    "options": [
      "40.0 A",
      "32.0 A",
      "21.1 A",
      "45.0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "DIVIDED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using P = V x I, therefore I = P / V. 9200 W / 230 V = 40 A."
  },
  {
    "id": 4047,
    "question": "If a cable is completely surrounded by thermal insulation for a distance of 500 mm, what is the standard correction factor (Ci) that should be applied to its current-carrying capacity?",
    "options": [
      "0.50",
      "0.78",
      "0.63",
      "0.89"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "According to BS 7671, where a cable is totally surrounded by thermal insulation for more than 400 mm, a factor of 0.5 must be applied."
  },
  {
    "id": 4048,
    "question": "Why is it necessary to apply a 'grouping' correction factor (Cg) when several circuits are run together in the same conduit or trunking?",
    "options": [
      "Mutual heating between cables reduces their ability to dissipate heat",
      "Magnetic fields from adjacent cables increase the resistance",
      "Voltage drop increases when cables are close together",
      "To account for the increased physical weight on the containment"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "explanation",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "When cables are grouped, they cannot dissipate heat as effectively because they are surrounded by other heat-producing cables, leading to a higher operating temperature."
  },
  {
    "id": 4049,
    "question": "An electrician determines that a circuit has a design current (Ib) of 26 A. The cable is to be protected by a BS EN 60898 MCB. Which nominal rating (In) should be selected as the standard device?",
    "options": [
      "32 A",
      "25 A",
      "30 A",
      "40 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "application",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The protective device rating (In) must be greater than or equal to the design current (Ib). The next standard MCB rating above 26 A is 32 A."
  },
  {
    "id": 4050,
    "question": "A circuit protected by a 20 A MCB passes through an area with an ambient temperature of 40°C (Ca = 0.87). If no other factors apply, what is the minimum required It?",
    "options": [
      "22.99 A",
      "17.40 A",
      "20.87 A",
      "25.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "It ≥ In / Ca. Therefore, It = 20 / 0.87 = 22.99 A. This ensures that even in a hot environment, the cable will not exceed its maximum operating temperature."
  },
  {
    "id": 4051,
    "question": "Which type of circuit breaker is specifically designed to handle moderate inductive loads and high inrush currents, such as those found in a small commercial workshop with fluorescent lighting?",
    "options": [
      "Type C",
      "Type B",
      "Type D",
      "Type A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type C circuit breakers are designed for inductive loads with higher inrush currents, tripping at 5 to 10 times their rated current. Type B is for domestic/resistive loads, and Type D is for very high inrush loads like large motors."
  },
  {
    "id": 4052,
    "question": "According to BS 7671, what is the correct relationship between the design current (Ib), the nominal rating of the protective device (In), and the current-carrying capacity of the conductor (Iz)?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib ≥ In ≥ Iz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "To ensure protection, the design current must be less than or equal to the device rating, and the device rating must be less than or equal to the cable's capacity (Ib ≤ In ≤ Iz)."
  },
  {
    "id": 4053,
    "question": "A 32A ring final circuit is protected by a BS 3036 semi-enclosed (rewirable) fuse. When calculating the required current-carrying capacity (It) for the cable, which correction factor (Cf) must be applied to the protective device rating?",
    "options": [
      "0.725",
      "0.80",
      "1.00",
      "0.63"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "UNITS_MISSING",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "discrimination",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "BS 3036 semi-enclosed fuses have a higher fusing factor, requiring the nominal rating of the device to be divided by 0.725 to ensure the cable is adequately protected under overload conditions."
  },
  {
    "id": 4054,
    "question": "An electrician is installing a 20A radial circuit where the cable will be completely surrounded by thermal insulation for a length of 600mm. If the correction factor (Ci) for this condition is 0.5, what is the minimum required current-carrying capacity (It) of the cable?",
    "options": [
      "40A",
      "10A",
      "20.5A",
      "30A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "SIGN_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "application",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The formula is It ≥ In / Ci. Therefore, 20A / 0.5 = 40A. The cable must be able to carry 40A under standard conditions to safely carry 20A when surrounded by insulation."
  },
  {
    "id": 4055,
    "question": "Which of the following describes the primary function of a Type AC Residual Current Device (RCD)?",
    "options": [
      "To detect and interrupt sinusoidal alternating earth leakage currents",
      "To provide protection against both overload and short-circuit faults",
      "To detect pulsating DC earth leakage currents in electronic loads",
      "To increase the total current capacity of a final circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type AC RCDs are designed to trip on sinusoidal alternating earth leakage currents. They do not provide overload protection (that is an MCB/RCBO function) and cannot reliably detect DC leakage (that requires Type A or B)."
  },
  {
    "id": 4056,
    "question": "An electrician is sizing a circuit for a 9.2 kW load at 230 V. The circuit is protected by a BS EN 60898 Type B MCB and is grouped with two other circuits in an ambient temperature of 35°C. Using typical correction factors (Cg = 0.70, Ca = 0.94), what is the minimum required current-carrying capacity (Iz) for the conductor?",
    "options": [
      "60.79 A",
      "40.00 A",
      "26.32 A",
      "42.55 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First, find Ib: 9200W / 230V = 40A. In must be at least 40A. Iz = In / (Cg x Ca). Therefore, Iz = 40 / (0.70 x 0.94) = 40 / 0.658 = 60.79 A."
  },
  {
    "id": 4057,
    "question": "Which specific condition requires the application of a 0.72 correction factor to the current-carrying capacity of a cable, and what is the underlying conceptual reason?",
    "options": [
      "When the circuit is protected by a BS 3036 semi-enclosed fuse, because it has a higher fusing factor than other devices.",
      "When the cable is completely surrounded by thermal insulation for a length exceeding 500mm to prevent overheating.",
      "When the cable is installed in a high ambient temperature environment to account for reduced heat dissipation.",
      "When multiple circuits are grouped together in a single conduit to prevent mutual heating effects."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "explanation",
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "BS 3036 semi-enclosed fuses have a fusing factor of approximately 1.45 or higher. The 0.72 factor is applied to ensure the cable is not damaged by the sustained overload current required to blow the fuse."
  },
  {
    "id": 4058,
    "question": "A workshop requires a new radial circuit for a large industrial transformer that exhibits very high inrush currents upon startup. Which BS EN 60898 MCB type would be most appropriate to prevent nuisance tripping while maintaining protection?",
    "options": [
      "Type D",
      "Type B",
      "Type C",
      "Type A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "DISCRIMINATION_ERROR",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "application",
      "transformers"
    ],
    "learningOutcomeId": "203-3B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Type D MCBs are designed for very high inductive loads and inrush currents, tripping at 10 to 20 times the rated current. Type B is for domestic (3-5x) and Type C is for moderate inductive loads (5-10x)."
  },
  {
    "id": 4059,
    "question": "A 2.5mm² twin and earth cable is installed such that it is completely surrounded by thermal insulation for a distance of 450mm. If the standard current-carrying capacity (It) is 27A, what is the modified current-carrying capacity (Iz) considering ONLY the insulation factor (Ci)?",
    "options": [
      "13.50 A",
      "21.06 A",
      "18.90 A",
      "54.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "RECIPROCAL_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "According to BS 7671, when a cable is surrounded by thermal insulation for more than 400mm, a factor (Ci) of 0.5 is applied. Iz = It x Ci = 27A x 0.5 = 13.5A."
  },
  {
    "id": 4060,
    "question": "In the context of circuit design, which of the following statements correctly describes the relationship between Design Current (Ib), Nominal Rating of the device (In), and the Current-carrying capacity of the conductor (Iz)?",
    "options": [
      "Ib must be less than or equal to In, and In must be less than or equal to Iz.",
      "Iz must be less than or equal to In, and In must be less than or equal to Ib.",
      "In must be less than or equal to Ib, and Ib must be less than or equal to Iz.",
      "Ib must be exactly equal to In, and In must be exactly equal to Iz."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "This is the fundamental rule for coordination: Ib <= In <= Iz. The load current shouldn't trip the breaker, and the breaker must trip before the cable exceeds its thermal capacity."
  },
  {
    "id": 4061,
    "question": "An electrician is comparing protective devices for a circuit with a high prospective fault current. Which device typically offers the highest breaking capacity (Icn) for industrial applications?",
    "options": [
      "BS 88-2 Bolted Fuse",
      "BS EN 60898 Type B MCB",
      "BS 3036 Semi-enclosed Fuse",
      "BS 1361 Household Cartridge Fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "DISCRIMINATION_ERROR",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "BS 88-2 industrial fuses have very high breaking capacities (often up to 80kA), which is significantly higher than standard domestic MCBs (typically 6kA) or rewirable fuses."
  },
  {
    "id": 4062,
    "question": "A circuit is wired in 4.0mm² thermoplastic (PVC) cable and protected by a 32A MCB. If the ambient temperature is 45°C (Ca = 0.79) and it is grouped with one other circuit (Cg = 0.80), what is the effective current-carrying capacity (Iz) of the cable? (Assume It = 36A for the installation method).",
    "options": [
      "22.75 A",
      "36.00 A",
      "56.96 A",
      "28.44 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Iz = It x Ca x Cg. Therefore, Iz = 36 x 0.79 x 0.80 = 22.752A. This shows the cable is undersized for the 32A protective device under these conditions."
  },
  {
    "id": 4063,
    "question": "Why does grouping multiple circuits together in the same enclosure require the use of a correction factor (Cg)?",
    "options": [
      "The mutual heating from adjacent cables reduces the ability of each cable to dissipate heat into the surroundings.",
      "The magnetic fields of adjacent cables interfere with each other, increasing the resistance of the conductors.",
      "Grouping increases the total voltage drop across the circuit due to increased inductive reactance.",
      "The cumulative earth leakage current from multiple circuits may cause nuisance tripping of the protective device."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "explanation",
      "calculation"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Cables generate heat when carrying current. When grouped, the heat from one cable affects the others, and the limited airflow/space prevents efficient cooling, necessitating a derating factor."
  },
  {
    "id": 4064,
    "question": "When selecting a protective device to ensure 'discrimination' (selectivity) between a main fuse and a downstream MCB, what is the primary objective?",
    "options": [
      "To ensure only the protective device closest to the fault operates, leaving the rest of the installation energized.",
      "To ensure that the total current-carrying capacity of the circuit exceeds the prospective fault current.",
      "To ensure that the MCB trips faster than the RCD in the event of an earth fault to prevent a total blackout.",
      "To ensure that the cable size is increased to compensate for the higher rating of the main incoming fuse."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "DISCRIMINATION_ERROR",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Discrimination ensures that the device nearest to the fault clears it first. This localizes the power loss and prevents the main protective device from disconnecting the entire building for a minor circuit fault."
  },
  {
    "id": 4065,
    "question": "A 230V circuit supplies a constant resistive load of 25A. It is protected by a 32A BS 3036 fuse. What is the minimum current-carrying capacity (It) required for the cable before any other correction factors are applied, specifically accounting for the fuse type?",
    "options": [
      "44.44 A",
      "23.04 A",
      "32.00 A",
      "25.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "When using a BS 3036 fuse, the rating of the device (In) must be divided by 0.72 to find the required cable capacity. It = In / 0.72 = 32 / 0.72 = 44.44 A."
  }
];
