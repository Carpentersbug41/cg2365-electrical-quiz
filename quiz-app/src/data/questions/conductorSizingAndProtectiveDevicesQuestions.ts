import { TaggedQuestion } from './types';

/**
 * Conductor Sizing and Protective Devices Question Bank
 * Aligned with lesson 203-3B learning outcomes
 * Generated: 2026-02-19
 */

export const conductorSizingAndProtectiveDevicesQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary purpose of a circuit protective device such as an MCB?",
    "options": [
      "To protect the circuit conductors from the effects of overcurrent",
      "To protect the electrical appliance from internal component failure",
      "To reduce the electricity consumption of the connected load",
      "To ensure the supply voltage remains constant during peak use"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "terminology",
      "discrimination",
      "legislation"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The fundamental role of a protective device (like an MCB) is to protect the installation's wiring from damage caused by overloads or short circuits."
  },
  {
    "id": 4017,
    "question": "Which type of circuit breaker (MCB) to BS EN 60898 is most commonly used for standard domestic lighting circuits?",
    "options": [
      "Type B",
      "Type C",
      "Type D",
      "Type S"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
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
    "explanation": "Type B MCBs are designed to trip between 3 to 5 times the full load current and are standard for domestic resistive or low inductive loads like lighting."
  },
  {
    "id": 4018,
    "question": "In the context of conductor sizing, what does the symbol 'In' represent?",
    "options": [
      "The nominal rating of the protective device",
      "The design current of the circuit",
      "The current-carrying capacity of the cable",
      "The actual current flowing to the load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "'In' refers to the nominal current rating of the fuse or circuit breaker selected for the circuit."
  },
  {
    "id": 4019,
    "question": "How does surrounding a cable with thermal insulation affect its current-carrying capacity?",
    "options": [
      "It decreases the current-carrying capacity",
      "It increases the current-carrying capacity",
      "It has no effect on the current-carrying capacity",
      "It only affects the voltage drop, not the current capacity"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Thermal insulation restricts the dissipation of heat from the cable. To prevent the cable from overheating, its current-carrying capacity must be reduced (derated)."
  },
  {
    "id": 4020,
    "question": "Which of the following is a standard requirement for an RCD providing additional protection in a domestic bathroom?",
    "options": [
      "A rated residual operating current (IΔn) not exceeding 30mA",
      "A rated residual operating current (IΔn) of exactly 100mA",
      "A time-delay setting of at least 2 seconds",
      "A manual reset that must be operated every 24 hours"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "health-safety",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "BS 7671 requires that RCDs used for additional protection must have a rated residual operating current not exceeding 30mA and operate within 40ms at 5 x IΔn."
  },
  {
    "id": 4021,
    "question": "Which British Standard covers the requirements for general purpose circuit breakers (MCBs) used in household installations?",
    "options": [
      "BS EN 60898",
      "BS 3036",
      "BS 1361",
      "BS 7671"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "legislation",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "BS EN 60898 is the specific standard for circuit breakers. BS 3036 is for semi-enclosed (rewirable) fuses, and BS 1361 (now BS EN 60269-3) was for cartridge fuses."
  },
  {
    "id": 4022,
    "question": "When designing a circuit, the 'Design Current' (Ib) is defined as the:",
    "options": [
      "Current intended to be carried by the circuit in normal service",
      "Maximum current the cable can carry without melting",
      "Current at which the protective device will definitely trip",
      "Total current available at the origin of the installation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Design current (Ib) is the amount of current the load is expected to draw under normal operating conditions."
  },
  {
    "id": 4023,
    "question": "An electrician is installing a standard 6A lighting circuit using Twin and Earth cable. What is the minimum cross-sectional area (CSA) typically used for this circuit?",
    "options": [
      "1.0 mm²",
      "2.5 mm²",
      "4.0 mm²",
      "6.0 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "application",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "1.0 mm² is the most common minimum size for domestic lighting circuits protected by a 6A device, provided voltage drop and earth fault loop impedance limits are met."
  },
  {
    "id": 4024,
    "question": "What is the main function of a Residual Current Device (RCD)?",
    "options": [
      "To detect and interrupt leakage currents to earth",
      "To protect the circuit against high-voltage surges from lightning",
      "To provide protection against short circuits between live and neutral",
      "To prevent the motor from running in the wrong direction"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An RCD monitors the balance of current between live conductors; if an imbalance (leakage to earth) occurs, it disconnects the supply."
  },
  {
    "id": 4025,
    "question": "Which of the following correctly shows the relationship required for coordination between circuit current (Ib), device rating (In), and cable capacity (Iz)?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib ≤ Iz ≤ In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To ensure safety, the design current (Ib) must be less than or equal to the fuse rating (In), which in turn must be less than or equal to the cable's actual current-carrying capacity (Iz)."
  },
  {
    "id": 4026,
    "question": "Which British Standard covers the requirements for circuit breakers used in domestic and similar installations (MCBs)?",
    "options": [
      "BS EN 60898",
      "BS 1363",
      "BS EN 61008",
      "BS 7671"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "terminology",
      "legislation",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "BS EN 60898 is the specific standard for circuit breakers (MCBs) used in domestic and commercial installations. BS 1363 is for plugs and sockets, while BS EN 61008 is for RCDs."
  },
  {
    "id": 4027,
    "question": "When a cable is installed in an environment with a high ambient temperature, how is its current-carrying capacity affected?",
    "options": [
      "The capacity decreases",
      "The capacity increases",
      "The capacity remains exactly the same",
      "The voltage rating of the cable increases"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High ambient temperatures reduce the cable's ability to dissipate heat, meaning it can carry less current before reaching its maximum operating temperature. This is why rating factors (Ca) are applied."
  },
  {
    "id": 4028,
    "question": "What is the primary function of an overcurrent protective device, such as a fuse or circuit breaker?",
    "options": [
      "To protect the circuit conductors from damage due to heat",
      "To ensure the voltage remains constant at the load",
      "To measure the amount of energy used in the circuit",
      "To prevent the user from touching live parts"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "explanation",
      "current-rule"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overcurrent protective devices are designed to disconnect the supply when current exceeds the cable's capacity, preventing insulation damage or fire caused by excessive heat."
  },
  {
    "id": 4029,
    "question": "An electrician is installing a standard 6A domestic lighting circuit using Twin and Earth cable. Which conductor size is most commonly selected for this application?",
    "options": [
      "1.5 mm²",
      "0.75 mm²",
      "4.0 mm²",
      "10.0 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "application",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In UK domestic installations, 1.5 mm² is the standard conductor size for lighting circuits, providing a balance between current capacity and ease of installation."
  },
  {
    "id": 4030,
    "question": "In the context of circuit design and conductor sizing, what does the symbol 'In' represent?",
    "options": [
      "The nominal current rating of the protective device",
      "The design current of the electrical load",
      "The actual current flowing through the neutral conductor",
      "The total resistance of the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "terminology",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "'In' is the standard symbol for the nominal current or 'rating' of the protective device (e.g., a 20A MCB has an In of 20A)."
  },
  {
    "id": 4031,
    "question": "When selecting a cable for a new circuit, which of the following expressions correctly defines the relationship between Design Current (Ib), Nominal Rating of the protective device (In), and the Current-carrying capacity of the conductor (Iz)?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib ≤ Iz ≤ In"
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
      "terminology",
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "According to BS 7671, the design current (Ib) must be less than or equal to the rating of the protective device (In), which in turn must be less than or equal to the current-carrying capacity of the conductor (Iz) to ensure the cable is protected."
  },
  {
    "id": 4032,
    "question": "An electrician is installing a circuit where the cables will be grouped with three other circuits. Which correction factor must be applied to determine the required cable size?",
    "options": [
      "Cg",
      "Ca",
      "Ci",
      "Cc"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "units",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Cg is the correction factor for grouping. Ca is for ambient temperature, Ci is for thermal insulation, and Cc is for semi-enclosed (rewireable) fuses."
  },
  {
    "id": 4033,
    "question": "A circuit protected by a 32 A BS EN 60898 Type B circuit breaker is installed in an area with an ambient temperature of 40°C. If the correction factor (Ca) for 40°C is 0.87, what is the minimum tabulated current-carrying capacity (It) required for the cable?",
    "options": [
      "36.78 A",
      "27.84 A",
      "32.00 A",
      "45.22 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The formula is It ≥ In / Ca. Therefore, 32 / 0.87 = 36.78 A. Multiplying (32 * 0.87) is a common error resulting in 27.84 A."
  },
  {
    "id": 4034,
    "question": "Which type of BS EN 60898 circuit breaker is specifically designed for circuits supplying equipment with very high inductive start-up currents, such as large transformers or industrial motors?",
    "options": [
      "Type D",
      "Type B",
      "Type C",
      "Type A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "DISCRIMINATION_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type D breakers are used for high inrush currents (tripping at 10-20 times In). Type B is for domestic/general use (3-5 times In), and Type C is for commercial/moderate inrush (5-10 times In)."
  },
  {
    "id": 4035,
    "question": "Why must a correction factor of 0.725 be applied to the current-carrying capacity of a cable when the protective device is a BS 3036 semi-enclosed fuse?",
    "options": [
      "The fuse has a higher fusing factor and takes longer to blow under overload",
      "The fuse operates at a lower temperature than modern circuit breakers",
      "The fuse is more sensitive to ambient temperature changes",
      "The fuse provides better short-circuit protection than an MCB"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONCEPTUAL_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination",
      "protection"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "BS 3036 fuses have a fusing factor of approximately 1.45. To ensure the cable does not overheat during the time it takes for the fuse to operate, the cable must be significantly oversized, which is achieved by applying the 0.725 factor (Cc)."
  },
  {
    "id": 4036,
    "question": "A design current (Ib) for a shower circuit is calculated at 37 A. Which of the following standard BS EN 60898 protective device ratings (In) should be selected?",
    "options": [
      "40 A",
      "32 A",
      "45 A",
      "50 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The rating of the protective device (In) must be greater than or equal to the design current (Ib). The next standard rating above 37 A for a BS EN 60898 MCB is 40 A."
  },
  {
    "id": 4037,
    "question": "What is the primary purpose of applying the correction factor Ci (0.5) when a cable is totally surrounded by thermal insulation for a distance of 500mm or more?",
    "options": [
      "To account for the cable's inability to dissipate heat into the air",
      "To account for the increased resistance caused by the insulation material",
      "To compensate for the magnetic effects of the insulation",
      "To allow for the increased voltage drop within the insulation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONCEPTUAL_ERROR",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "explanation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Thermal insulation prevents heat from escaping the cable. To prevent the conductor insulation from melting, the current-carrying capacity must be halved (Ci = 0.5) when fully surrounded."
  },
  {
    "id": 4038,
    "question": "A 20 A circuit breaker is used to protect a circuit where the cables are grouped (Cg = 0.7) and the ambient temperature is high (Ca = 0.87). Calculate the minimum required tabulated current-carrying capacity (It) for the cable.",
    "options": [
      "32.84 A",
      "12.18 A",
      "22.98 A",
      "28.57 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "It ≥ In / (Ca * Cg). So, It ≥ 20 / (0.87 * 0.7) = 20 / 0.609 = 32.84 A. Multiplying 20 * 0.87 * 0.7 gives 12.18 A, which is a common misconception."
  },
  {
    "id": 4039,
    "question": "Which component of a standard MCB provides protection against small, long-duration overcurrents (overload protection)?",
    "options": [
      "The bimetallic strip",
      "The magnetic solenoid",
      "The arc chute",
      "The manual toggle switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONCEPTUAL_ERROR",
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
    "explanation": "The bimetallic strip heats up and bends over time during an overload, eventually tripping the mechanism. The magnetic solenoid is used for instantaneous short-circuit protection."
  },
  {
    "id": 4040,
    "question": "When using the 'Simplified Method' for cable sizing, if the protective device is a BS EN 60898 MCB, what is the correct formula to find the minimum tabulated current (It)?",
    "options": [
      "It ≥ In / (Correction Factors)",
      "It ≥ Ib * (Correction Factors)",
      "It ≥ (In * 1.45) / 0.725",
      "It ≥ Ib / 0.725"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To ensure Iz is at least equal to In under installed conditions, the tabulated value It must be adjusted by dividing In by all applicable correction factors."
  },
  {
    "id": 4041,
    "question": "When designing a circuit, why must the ambient temperature correction factor (Ca) be applied to the calculation for a cable's current-carrying capacity?",
    "options": [
      "To prevent the conductor insulation from exceeding its maximum safe operating temperature",
      "To ensure the circuit breaker trips faster during a short-circuit fault",
      "To increase the total resistance of the circuit to limit the design current",
      "To allow for the physical expansion of the copper conductor when it gets hot"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Correction factors like Ca ensure that the heat generated by the load current, combined with the environment, does not cause the cable insulation (e.g., 70°C for PVC) to melt or degrade."
  },
  {
    "id": 4042,
    "question": "Which of the following formulas is used to determine the minimum current-carrying capacity (It) of a conductor when correction factors for grouping (Cg) and ambient temperature (Ca) are present?",
    "options": [
      "It >= In / (Cg x Ca)",
      "It >= In x Cg x Ca",
      "It >= Ib / (Cg + Ca)",
      "It >= In - (Cg x Ca)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To find the minimum tabulated current-carrying capacity (It), the nominal rating of the protective device (In) must be divided by the applicable correction factors."
  },
  {
    "id": 4043,
    "question": "An electrician is installing a 32A radial circuit. The cable will be totally surrounded by thermal insulation for a distance of 600mm (Ci = 0.5). What is the minimum required tabulated current-carrying capacity (It) for the cable?",
    "options": [
      "64 A",
      "16 A",
      "32 A",
      "48 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "It = In / Ci. Therefore, 32A / 0.5 = 64A. The cable selected must be able to carry 64A under standard conditions to handle 32A when insulated."
  },
  {
    "id": 4044,
    "question": "According to BS 7671, what is the correct relationship between the design current (Ib), the nominal rating of the protective device (In), and the current-carrying capacity of the conductor (Iz)?",
    "options": [
      "Ib <= In <= Iz",
      "Iz <= In <= Ib",
      "In <= Ib <= Iz",
      "Ib >= In >= Iz"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The design current must be less than or equal to the protective device rating, which in turn must be less than or equal to the actual capacity of the cable to ensure safety."
  },
  {
    "id": 4045,
    "question": "Which type of BS EN 60898 circuit breaker is typically selected for commercial installations where moderate inrush currents are expected from fluorescent lighting or small motors?",
    "options": [
      "Type C",
      "Type B",
      "Type D",
      "Type AC"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type C breakers trip between 5 and 10 times the rated current, making them suitable for inductive loads with moderate inrush currents."
  },
  {
    "id": 4046,
    "question": "A 9.2 kW electric shower is connected to a 230V supply. After calculating the design current (Ib), which standard BS EN 60898 MCB rating (In) is the most appropriate minimum size?",
    "options": [
      "45 A",
      "40 A",
      "32 A",
      "50 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Ib = P / V = 9200 / 230 = 40A. Since In must be greater than or equal to Ib, and standard MCB sizes are 40A or 45A, a 40A or 45A could work, but 45A is the next standard size often used to prevent nuisance tripping at full load."
  },
  {
    "id": 4047,
    "question": "When cables are grouped together in a trunking, why must a grouping factor (Cg) be applied to determine the cable size?",
    "options": [
      "Heat from adjacent cables reduces the ability of a cable to dissipate its own heat",
      "The magnetic fields of the cables cancel each other out, reducing efficiency",
      "The total resistance of the conductors increases when they are physically close",
      "To account for the increased voltage drop caused by mutual induction"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "USED_PARALLEL_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "explanation",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Grouping cables traps heat. If multiple cables generate heat in a confined space, they cannot cool down as effectively, necessitating a larger conductor size to keep temperatures safe."
  },
  {
    "id": 4048,
    "question": "If a circuit is protected by a BS 3036 semi-enclosed (rewireable) fuse, what additional factor (Cc) must be applied to the calculation of the required cable capacity (It)?",
    "options": [
      "0.72",
      "1.45",
      "0.80",
      "1.00"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "discrimination",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "BS 3036 fuses have a high fusing factor (1.45). To compensate for the fact that they take longer to blow during an overload, the cable capacity must be derated by a factor of 0.72 (which is 1/1.45)."
  },
  {
    "id": 4049,
    "question": "A designer determines that a circuit requires a 32A Type B MCB. The cable is run through an area with an ambient temperature of 40°C (Ca = 0.87). What is the minimum It required for the cable selection?",
    "options": [
      "36.78 A",
      "27.84 A",
      "32.00 A",
      "22.62 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
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
    "explanation": "It = In / Ca = 32 / 0.87 = 36.78 A. The cable selected from the tables must have a capacity of at least 36.78 A."
  },
  {
    "id": 4050,
    "question": "Which of the following protective devices is specifically used to protect against the effects of earth leakage currents but does not necessarily provide overload protection?",
    "options": [
      "Residual Current Device (RCD)",
      "Miniature Circuit Breaker (MCB)",
      "High Breaking Capacity (HBC) fuse",
      "Residual Current Breaker with Overload (RCBO)"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A standard RCD (RCCB) monitors the balance of current between line and neutral to detect earth leakage; it does not protect against overloads or short circuits unless it is an RCBO."
  },
  {
    "id": 4051,
    "question": "Which type of circuit breaker, according to BS EN 60898, is specifically designed for circuits supplying equipment with very high inductive starting currents, such as large industrial motors or transformers?",
    "options": [
      "Type D",
      "Type B",
      "Type C",
      "Type AC"
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
      "legislation"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type D circuit breakers are designed for high inrush currents, tripping at 10 to 20 times their rated current. Type B is for domestic/low surge, and Type C is for standard commercial/inductive loads."
  },
  {
    "id": 4052,
    "question": "When selecting a protective device and cable for a circuit, which of the following expressions correctly defines the relationship between design current (Ib), nominal rating of the protective device (In), and the current-carrying capacity of the cable (Iz)?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "In ≤ Ib ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "Ib ≥ In ≥ Iz"
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
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "To ensure safety, the design current must be less than or equal to the fuse rating, which in turn must be less than or equal to the cable's capacity after correction factors are applied."
  },
  {
    "id": 4053,
    "question": "An electrician is installing a circuit with a design current (Ib) of 22 A. They select a 32 A circuit breaker (In). If the cable is installed in an area with an ambient temperature correction factor (Ca) of 0.87, what is the minimum calculated current-carrying capacity (It) required for the cable?",
    "options": [
      "36.78 A",
      "27.84 A",
      "25.29 A",
      "32.00 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The formula is It ≥ In / Ca. Therefore, 32 / 0.87 = 36.78 A. Using the design current (Ib) instead of the protective device rating (In) is a common error."
  },
  {
    "id": 4054,
    "question": "According to BS 7671, what correction factor value (Ci) must be applied to the current-carrying capacity of a cable when it is completely surrounded by thermal insulation for a distance exceeding 500mm?",
    "options": [
      "0.50",
      "0.87",
      "0.72",
      "1.03"
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
      "legislation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "When a cable is totally surrounded by thermal insulation for more than 500mm, its current-carrying capacity is reduced by half, requiring a factor of 0.5."
  },
  {
    "id": 4055,
    "question": "A standard BS EN 60898 MCB provides protection against which two specific circuit conditions?",
    "options": [
      "Overload and short-circuit",
      "Overload and earth leakage",
      "Short-circuit and open-circuit",
      "Earth leakage and surge voltage"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "MCBs are overcurrent protective devices designed to trip during thermal overload (slow) and magnetic short-circuit (instantaneous) conditions. Earth leakage is protected by RCDs."
  },
  {
    "id": 4056,
    "question": "An electrician is designing a circuit where the design current (Ib) is 27 A. A 32 A BS EN 60898 Type B MCB is selected. If the cable is routed through an area with an ambient temperature of 40°C (Ca = 0.87), what is the minimum required tabulated current-carrying capacity (It) for the conductor?",
    "options": [
      "36.78 A",
      "27.84 A",
      "31.05 A",
      "23.49 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "calculation",
      "units",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "To find the tabulated current-carrying capacity (It), the nominal rating of the protective device (In) must be divided by the correction factors. It ≥ In / Ca. Therefore, 32 / 0.87 = 36.78 A."
  },
  {
    "id": 4057,
    "question": "Which specific condition must be met to ensure that a protective device provides effective protection against both overload and short-circuit currents according to BS 7671?",
    "options": [
      "The nominal rating (In) must be less than or equal to the continuous current-carrying capacity (Iz) of the conductor",
      "The design current (Ib) must be exactly equal to the tabulated current-carrying capacity (It)",
      "The breaking capacity (Icn) must be lower than the prospective fault current (Ipf)",
      "The grouping factor (Cg) must always be applied to the design current (Ib) rather than the fuse rating"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "For overload protection, the fundamental requirement is Ib ≤ In ≤ Iz. This ensures the protective device trips before the conductor reaches a temperature that would damage its insulation."
  },
  {
    "id": 4058,
    "question": "A 10 kW 230 V fixed immersion heater is to be installed using multicore 70°C thermoplastic cable. The cable is grouped with two other loaded circuits in a conduit (Cg = 0.70). Calculate the minimum required tabulated current (It) for selecting the cable size, assuming a standard 50 A protective device is used.",
    "options": [
      "71.43 A",
      "43.48 A",
      "35.00 A",
      "62.11 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "MULTIPLIED_INSTEAD",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "calculation",
      "application",
      "power"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First, find Ib: 10,000 / 230 = 43.48 A. A 50 A protective device is selected (In). Then apply the grouping factor to In: It ≥ In / Cg = 50 / 0.70 = 71.43 A."
  },
  {
    "id": 4059,
    "question": "When selecting a circuit breaker for a commercial kitchen ventilation system with a high-power centrifugal fan motor, which trip characteristic is most appropriate to prevent nuisance tripping during start-up?",
    "options": [
      "Type C BS EN 60898",
      "Type B BS EN 60898",
      "BS 3036 semi-enclosed fuse",
      "Type AC RCD"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Motors have high inrush currents. Type C breakers are designed to trip at 5-10 times their nominal current, making them suitable for inductive loads where Type B (3-5 times) might trip unnecessarily."
  },
  {
    "id": 4060,
    "question": "A conductor is installed in an area where it is totally surrounded by thermal insulation for a length of 600mm. According to BS 7671, what is the correct factor (Ci) to apply to the current-carrying capacity?",
    "options": [
      "0.50",
      "0.75",
      "1.00",
      "0.63"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "ROUNDING_ERROR",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "BS 7671 states that where a cable is totally surrounded by thermal insulation for a distance of 500mm or more, a factor (Ci) of 0.5 must be applied."
  },
  {
    "id": 4061,
    "question": "In the context of protective devices, what does the term 'Breaking Capacity' (Icn) represent?",
    "options": [
      "The maximum fault current the device can safely interrupt without damage",
      "The current level at which the device will trip within 0.1 seconds",
      "The minimum current required to melt a fuse element",
      "The maximum continuous load the device can carry at 30°C"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Breaking capacity (Icn) is the prospective fault current that a protective device is capable of breaking at a specific voltage under defined conditions."
  },
  {
    "id": 4062,
    "question": "A circuit is protected by a 20 A BS 88-3 fuse. The design current is 14 A. The cable passes through a conduit with an ambient temperature of 45°C (Ca = 0.79). What is the value of Iz (actual current-carrying capacity) required to satisfy the overload protection requirement?",
    "options": [
      "At least 20 A",
      "Exactly 14 A",
      "At least 25.3 A",
      "At least 17.7 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The requirement for overload protection is In ≤ Iz. Since the nominal rating of the fuse (In) is 20 A, the actual capacity (Iz) of the cable in its installed environment must be at least 20 A."
  },
  {
    "id": 4063,
    "question": "Why is it necessary to apply a correction factor (Cg) when cables are grouped together in a single enclosure?",
    "options": [
      "Because heat dissipation is restricted, leading to a higher conductor temperature",
      "Because the magnetic fields of the cables cancel each other out, reducing efficiency",
      "Because the voltage drop increases due to mutual inductance between conductors",
      "Because it reduces the total resistance of the circuit conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "When cables are grouped, they act as heat sources for one another. This reduces the ability of each cable to dissipate heat into the air, necessitating a reduction in their current rating."
  },
  {
    "id": 4064,
    "question": "An electrician is installing a 32 A ring final circuit using 2.5mm² Twin and Earth cable. If the cable is run through a thermal insulation layer for 100mm, which of the following is true regarding the conductor sizing?",
    "options": [
      "No correction factor for insulation (Ci) is required as the length is under 400mm",
      "A correction factor of 0.5 must be applied regardless of the length",
      "The cable must be upsized to 4.0mm² immediately",
      "The grouping factor (Cg) must be doubled to compensate for the heat"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "According to BS 7671, correction factors for thermal insulation (Ci) generally apply to lengths of 400mm or more. For 100mm, the impact is negligible enough that specific derating factors from Table 52.2 are not triggered."
  },
  {
    "id": 4065,
    "question": "Which protective device provides the fastest disconnection time for a high-magnitude short-circuit fault, assuming all have the same nominal rating?",
    "options": [
      "BS EN 60898 Type B MCB",
      "BS 3036 semi-enclosed re-wireable fuse",
      "BS 1361 (BS 88-3) cartridge fuse",
      "BS EN 60947-2 MCCB with thermal-magnetic trip"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Modern MCBs (BS EN 60898) utilize a magnetic trip mechanism for short-circuits which is significantly faster (typically <0.1s) than the thermal melting process of older fuse technologies."
  }
];
