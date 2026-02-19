import { TaggedQuestion } from './types';

/**
 * Conductor Sizing and Protective Devices Question Bank
 * Aligned with lesson 203-3B learning outcomes
 * Generated: 2026-02-19
 */

export const conductorSizingAndProtectiveDevicesQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "In electrical circuit design, what does the symbol 'In' represent?",
    "options": [
      "The nominal current rating of the protective device",
      "The design current of the load",
      "The maximum current-carrying capacity of the cable",
      "The actual current flowing in the circuit"
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
      "units"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In BS 7671, 'In' specifically refers to the nominal rating of the protective device (e.g., a 20A circuit breaker)."
  },
  {
    "id": 4017,
    "question": "Which British Standard sets the requirements for electrical installations and the selection of protective devices?",
    "options": [
      "BS 7671",
      "BS EN 60898",
      "BS 1363",
      "BS 5839"
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
      "legislation",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "BS 7671 (The IET Wiring Regulations) is the main standard for electrical installations in the UK."
  },
  {
    "id": 4018,
    "question": "An electrician calculates a circuit design current (Ib) of 14A. What is the minimum standard rating (In) for the protective device to satisfy the rule Ib ≤ In?",
    "options": [
      "16A",
      "10A",
      "13A",
      "32A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "calculation",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The protective device rating (In) must be equal to or greater than the design current (Ib). 16A is the next standard size above 14A."
  },
  {
    "id": 4019,
    "question": "What is the primary purpose of a circuit breaker in a domestic installation?",
    "options": [
      "To protect the circuit conductors from overcurrent",
      "To protect the user from electric shock",
      "To increase the voltage to the appliances",
      "To reduce the resistance of the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Circuit breakers and fuses are primarily installed to protect the cables (conductors) from damage caused by overload or short circuits."
  },
  {
    "id": 4020,
    "question": "Which type of circuit breaker is most commonly used for domestic lighting circuits where high inrush currents are not expected?",
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
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Type B circuit breakers are the standard choice for domestic installations where there is little to no inductive surge."
  },
  {
    "id": 4021,
    "question": "A standard ring final circuit in a domestic property is typically protected by a device with which rating?",
    "options": [
      "32A",
      "6A",
      "16A",
      "40A"
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
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Standard domestic ring final circuits using 2.5mm² cables are conventionally protected by a 30A fuse or 32A circuit breaker."
  },
  {
    "id": 4022,
    "question": "What does the symbol 'Iz' represent in the process of cable selection?",
    "options": [
      "The current-carrying capacity of the cable for the specific installation conditions",
      "The tabulated current-carrying capacity of the cable",
      "The design current of the circuit",
      "The nominal rating of the fuse"
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
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Iz is the current-carrying capacity of a cable after all correction factors (like temperature or grouping) have been applied."
  },
  {
    "id": 4023,
    "question": "Which correction factor must be applied when a cable is completely surrounded by thermal insulation for a distance of 0.5m or more?",
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
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Ci is the correction factor for cables in thermal insulation. Ca is for ambient temperature and Cg is for grouping."
  },
  {
    "id": 4024,
    "question": "If the ambient temperature around a cable increases above the standard 30°C, what happens to its current-carrying capacity?",
    "options": [
      "It decreases",
      "It increases",
      "It remains exactly the same",
      "It doubles"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Higher ambient temperatures reduce the cable's ability to dissipate heat, meaning it can safely carry less current."
  },
  {
    "id": 4025,
    "question": "In the formula used for circuit design, what does 'Ib' stand for?",
    "options": [
      "Design current of the circuit",
      "Breaking capacity of the device",
      "Basic insulation level",
      "Battery current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Ib is the design current, which is the maximum current intended to be carried by the circuit in normal service."
  },
  {
    "id": 4026,
    "question": "Which type of BS EN 60898 circuit breaker is most commonly used for domestic lighting and socket circuits where high inrush currents are not expected?",
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
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Type B circuit breakers are designed to trip between 3 and 5 times the full load current, making them suitable for domestic applications where high inrush currents (like those from large motors) are absent."
  },
  {
    "id": 4027,
    "question": "In the standard sizing formula 'Ib ≤ In ≤ Iz', what does the symbol 'In' represent?",
    "options": [
      "The nominal rating of the protective device",
      "The design current of the circuit",
      "The current-carrying capacity of the cable",
      "The total earth fault loop impedance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In is the nominal rating (or setting) of the protective device. It must be greater than or equal to the design current (Ib) and less than or equal to the current-carrying capacity of the conductor (Iz)."
  },
  {
    "id": 4028,
    "question": "What is the maximum permitted operating temperature for standard thermoplastic (PVC) insulated conductors?",
    "options": [
      "70°C",
      "90°C",
      "120°C",
      "30°C"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "WRONG_UNITS",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "discrimination",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Standard PVC (thermoplastic) insulation is rated for a maximum operating temperature of 70°C. Exceeding this can damage the insulation."
  },
  {
    "id": 4029,
    "question": "An electrician calculates a circuit's design current (Ib) to be 24 Amps. Which standard BS EN 60898 protective device rating (In) should be selected?",
    "options": [
      "32 A",
      "20 A",
      "16 A",
      "6 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "application",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The protective device rating (In) must be equal to or greater than the design current (Ib). Since 24A is the load, a 32A breaker is the next standard size up."
  },
  {
    "id": 4030,
    "question": "When conductors are installed in an environment with an ambient temperature higher than 30°C, how is the current-carrying capacity affected?",
    "options": [
      "The capacity decreases",
      "The capacity increases",
      "The capacity remains the same",
      "The capacity doubles"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
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
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High ambient temperatures reduce the cable's ability to dissipate heat. Therefore, a rating factor (Ca) less than 1.0 is applied, which decreases the effective current-carrying capacity."
  },
  {
    "id": 4031,
    "question": "According to the general rules for protection against overload, which relationship must be satisfied when selecting a protective device and conductor size?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib ≤ Iz ≤ In"
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
      "calculation",
      "terminology",
      "protection"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To ensure safe operation, the design current (Ib) must be less than or equal to the nominal rating of the protective device (In), which in turn must be less than or equal to the current-carrying capacity of the conductor (Iz)."
  },
  {
    "id": 4032,
    "question": "When using a BS 3036 semi-enclosed (rewireable) fuse for circuit protection, what correction factor must be applied to the current-carrying capacity of the cable?",
    "options": [
      "0.72",
      "0.87",
      "1.00",
      "1.45"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "calculation",
      "units",
      "protection"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "BS 3036 fuses have a high fusing factor (approx 1.45). To ensure cables are protected against overload, a correction factor of 0.72 is applied to the cable's current-carrying capacity (Iz)."
  },
  {
    "id": 4033,
    "question": "A circuit has a nominal protective device rating (In) of 32 A. If the cable is installed in an area with an ambient temperature correction factor (Ca) of 0.87, what is the minimum required current-carrying capacity (It) from the tables?",
    "options": [
      "36.78 A",
      "27.84 A",
      "32.00 A",
      "41.25 A"
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
      "units",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To find the tabulated value (It), you divide the protective device rating (In) by the correction factors. 32 / 0.87 = 36.78 A."
  },
  {
    "id": 4034,
    "question": "Why must the current-carrying capacity of a cable be derated when it is installed in an environment with high ambient temperatures?",
    "options": [
      "Heat cannot dissipate as effectively from the conductor",
      "The resistance of the conductor decreases as it gets hotter",
      "High temperatures increase the voltage drop across the cable",
      "The insulation becomes more conductive at higher temperatures"
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
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables generate heat due to resistance. If the surrounding air is already hot, the temperature gradient is smaller, meaning heat dissipates slower, risking damage to the insulation."
  },
  {
    "id": 4035,
    "question": "Which type of BS EN 60898 circuit breaker is specifically designed for circuits with high inductive inrush currents, such as those supplying multiple fluorescent luminaires or small motors?",
    "options": [
      "Type C",
      "Type B",
      "Type D",
      "Type A"
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
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type C breakers trip between 5 and 10 times their rated current, making them suitable for inductive loads with moderate inrush currents."
  },
  {
    "id": 4036,
    "question": "A 230V single-phase circuit supplies a 4.6 kW fixed electric heater. What is the minimum standard rating (In) for a BS EN 60898 Type B circuit breaker to protect this load?",
    "options": [
      "20 A",
      "16 A",
      "25 A",
      "32 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "OTHER",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "calculation",
      "application",
      "power"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First calculate Ib: 4600W / 230V = 20A. The protective device (In) must be greater than or equal to Ib, so a 20A breaker is the minimum standard size."
  },
  {
    "id": 4037,
    "question": "When multiple circuits are run together in the same conduit or trunking, which correction factor (Cf) must be applied to the cable sizing calculation?",
    "options": [
      "Cg (Grouping)",
      "Ca (Ambient Temperature)",
      "Ci (Thermal Insulation)",
      "Cc (BS 3036 Factor)"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Cg is the grouping factor used when cables are bunched or enclosed together, accounting for the mutual heating between adjacent cables."
  },
  {
    "id": 4038,
    "question": "A circuit breaker is described as having a 'Type B' characteristic. This means the device is designed to trip magnetically within which range of its rated current (In)?",
    "options": [
      "3 to 5 times In",
      "5 to 10 times In",
      "10 to 20 times In",
      "1 to 2 times In"
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
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type B circuit breakers are designed to trip between 3 and 5 times their rated current, making them suitable for domestic and general commercial lighting and socket circuits."
  },
  {
    "id": 4039,
    "question": "If a cable is completely surrounded by thermal insulation for a distance of 500mm, what is the standard correction factor (Ci) applied to its current-carrying capacity?",
    "options": [
      "0.50",
      "0.75",
      "0.63",
      "1.00"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "According to BS 7671, when a cable is surrounded by thermal insulation for more than 100mm (specifically 500mm or more), a factor of 0.5 is applied."
  },
  {
    "id": 4040,
    "question": "In the context of circuit design, what does the term 'Design Current' (Ib) represent?",
    "options": [
      "The current intended to be carried by the circuit in normal service",
      "The maximum current a cable can carry before the insulation melts",
      "The current at which the protective device is guaranteed to trip",
      "The total current available from the supply transformer"
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Design current (Ib) is the actual load current calculated for the circuit based on the equipment connected and its usage."
  },
  {
    "id": 4041,
    "question": "When calculating the minimum current-carrying capacity (Iz) of a cable, which correction factor accounts for the cable being surrounded by thermal insulation for a distance of more than 500mm?",
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
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The factor Ci is specifically used when a cable is surrounded by thermal insulation. Cg is for grouping, Ca is for ambient temperature, and Cf is for semi-enclosed fuses."
  },
  {
    "id": 4042,
    "question": "Which circuit type is most likely to require a Type C circuit breaker to prevent nuisance tripping during start-up?",
    "options": [
      "A bank of fluorescent lighting in a workshop",
      "A domestic ring final circuit for a living room",
      "An electric immersion heater in a cylinder",
      "A fixed 3kW electric radiator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Fluorescent lighting contains ballasts which create high in-rush currents. Type C breakers are designed to handle higher magnetic trip thresholds (5-10x In) compared to Type B (3-5x In)."
  },
  {
    "id": 4043,
    "question": "An electrician is installing a 9.2kW electric shower on a 230V circuit. Using the standard relationship Ib ≤ In, what is the minimum standard rating (In) for the circuit breaker?",
    "options": [
      "45 A",
      "40 A",
      "32 A",
      "50 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application",
      "ohms-law"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "First, calculate Ib: 9200W / 230V = 40A. Since In must be greater than or equal to Ib, and standard breaker sizes above 40A are typically 45A or 50A, 45A is the minimum standard rating."
  },
  {
    "id": 4044,
    "question": "According to BS 7671, what is the fundamental relationship that must be maintained between the design current (Ib), the nominal rating of the protective device (In), and the current-carrying capacity of the cable (Iz)?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib ≤ Iz ≤ In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "TOPOLOGY_CONFUSION",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "terminology",
      "legislation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The design current (load) must be less than or equal to the fuse rating, which in turn must be less than or equal to the cable's capacity to ensure the cable is protected from overload."
  },
  {
    "id": 4045,
    "question": "A cable has a tabulated current-carrying capacity (It) of 27 A. It is installed in a trunking with three other circuits, giving a grouping factor (Cg) of 0.65. What is the adjusted current-carrying capacity (Iz) before any other factors are applied?",
    "options": [
      "17.55 A",
      "41.53 A",
      "26.35 A",
      "20.35 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "SIGN_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Iz is calculated by multiplying the tabulated current (It) by the correction factors. 27 A x 0.65 = 17.55 A."
  },
  {
    "id": 4046,
    "question": "When using a BS 3036 semi-enclosed (rewirable) fuse for overload protection, which correction factor must be applied to the cable's current-carrying capacity calculation?",
    "options": [
      "0.725",
      "0.80",
      "1.00",
      "0.90"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "BS 3036 fuses have a high fusing factor. To ensure the cable is protected, the current-carrying capacity must be derated by a factor of 0.725 (Cf)."
  },
  {
    "id": 4047,
    "question": "How does an increase in ambient temperature above 30°C affect the current-carrying capacity (Iz) of a PVC insulated cable installed in air?",
    "options": [
      "It decreases because the cable's ability to dissipate heat is reduced",
      "It increases because the higher temperature reduces the conductor resistance",
      "It remains the same as the capacity is only determined by the cross-sectional area",
      "It increases because the insulation becomes more flexible and conductive"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
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
    "explanation": "Cable ratings are based on the temperature rise above ambient. If the ambient temperature is higher, the cable can carry less current before reaching its maximum operating temperature (e.g., 70°C for PVC)."
  },
  {
    "id": 4048,
    "question": "What is the primary characteristic that distinguishes a Type B circuit breaker from a Type D circuit breaker?",
    "options": [
      "The current range at which the magnetic trip operates instantaneously",
      "The maximum breaking capacity (Icn) of the device in kA",
      "The physical size of the breaker and its rail mounting",
      "The number of poles the device can disconnect simultaneously"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
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
    "explanation": "MCB types (B, C, D) refer to the magnetic trip curve. Type B trips at 3-5 times In, while Type D trips at 10-20 times In for high in-rush loads."
  },
  {
    "id": 4049,
    "question": "A circuit has a design current (Ib) of 18 A. The protective device (In) is 20 A. After applying correction factors, the required minimum tabulated current (It) is 24 A. Which conductor size should be selected using Ref Method A (1.5mm² = 14.5A, 2.5mm² = 20A, 4.0mm² = 26A)?",
    "options": [
      "4.0 mm²",
      "2.5 mm²",
      "1.5 mm²",
      "6.0 mm²"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "USED_SERIES_RULE",
      "3": "OTHER"
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
    "explanation": "The selected cable must have a tabulated rating (It) equal to or greater than the calculated requirement (24 A). 2.5mm² (20A) is too small, so 4.0mm² (26A) is the correct choice."
  },
  {
    "id": 4050,
    "question": "Which term describes a condition where a circuit carries a current in excess of its rated capacity but remains within the intended path (conductors)?",
    "options": [
      "Overload",
      "Short-circuit",
      "Earth fault",
      "Voltage drop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
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
    "estimatedTime": 45,
    "explanation": "Overload occurs when too much current flows through a healthy circuit (e.g., too many appliances). A short-circuit involves a fault between live conductors, and an earth fault involves a fault to the protective conductor."
  },
  {
    "id": 4051,
    "question": "A circuit for a small workshop motor is known to have a moderate inductive start-up current. Which type of MCB to BS EN 60898 would be most appropriate to prevent nuisance tripping?",
    "options": [
      "Type C",
      "Type B",
      "Type D",
      "Type A"
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
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type C circuit breakers are designed for circuits with moderate inductive loads, such as small motors or banks of fluorescent lighting, as they trip between 5 and 10 times the rated current."
  },
  {
    "id": 4052,
    "question": "According to BS 7671, what is the correct relationship between the design current (Ib), the nominal rating of the protective device (In), and the current-carrying capacity of the cable (Iz)?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "In ≤ Ib ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "Ib ≤ Iz ≤ In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "legislation",
      "calculation"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To ensure circuit safety, the design current must not exceed the protective device rating, and the protective device rating must not exceed the cable's capacity."
  },
  {
    "id": 4053,
    "question": "An electrician is installing a circuit where the protective device is a 20A MCB. If the cable runs through an area with an ambient temperature correction factor (Ca) of 0.87, what is the minimum tabulated current-carrying capacity (It) required for the cable?",
    "options": [
      "22.98 A",
      "17.40 A",
      "20.00 A",
      "28.70 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "UNITS_MISSING",
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
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "The formula for minimum capacity is It ≥ In / (correction factors). 20 / 0.87 = 22.98 A."
  },
  {
    "id": 4054,
    "question": "When a circuit is protected by a semi-enclosed (rewireable) fuse to BS 3036, what specific correction factor must be applied to the cable's current-carrying capacity calculation?",
    "options": [
      "0.725",
      "1.450",
      "0.800",
      "0.925"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "BS 3036 fuses have a higher fusing factor, so a correction factor of 0.725 must be applied to the cable rating to ensure it is protected during a sustained overload."
  },
  {
    "id": 4055,
    "question": "What is the primary reason that a cable's current-carrying capacity is reduced when it is surrounded by thermal insulation for a distance of 500mm or more?",
    "options": [
      "Heat cannot dissipate into the surrounding environment",
      "The resistance of the conductor decreases significantly",
      "The insulation material increases the magnetic field strength",
      "The voltage drop across the cable becomes negligible"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "explanation",
      "units"
    ],
    "learningOutcomeId": "203-3B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Thermal insulation traps heat generated by the current flowing through the conductor. If this heat cannot dissipate, the cable temperature will rise above its safe operating limit (usually 70°C)."
  },
  {
    "id": 4056,
    "question": "A 9.2 kW electric shower is connected to a 230 V supply. The circuit is protected by a BS EN 60898 Type B circuit breaker and is grouped with three other loaded circuits in a conduit on a wall. What is the minimum current-carrying capacity (Iz) required for the cable, considering only the grouping factor (Cg = 0.65)?",
    "options": [
      "61.54 A",
      "26.00 A",
      "40.00 A",
      "53.33 A"
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
      "units",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "First, calculate the design current (Ib): 9200W / 230V = 40A. The protective device (In) must be at least 40A. To find Iz, divide In by the correction factor (Cg): 40A / 0.65 = 61.54A."
  },
  {
    "id": 4057,
    "question": "When selecting a protective device for a circuit where overload is likely to occur, which coordination relationship must be strictly maintained according to BS 7671?",
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
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "legislation",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The design current (Ib) must not exceed the nominal rating of the protective device (In), and the protective device rating must not exceed the current-carrying capacity of the conductor (Iz) to ensure the cable is protected from overload."
  },
  {
    "id": 4058,
    "question": "An electrician is installing a 230 V radial circuit for a workshop where heavy wood-turning lathes are used. These lathes have very high initial starting currents. Which type of BS EN 60898 circuit breaker would be most appropriate to prevent nuisance tripping?",
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
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Type D circuit breakers are designed for circuits with very high inductive loads and inrush currents (tripping at 10 to 20 times the nominal current), such as large motors or transformers."
  },
  {
    "id": 4059,
    "question": "A circuit is wired using 70°C thermoplastic insulated cable. Part of the run passes through a section of thermal insulation for a length of 600 mm. If the original current-carrying capacity was 27 A, what is the new derated capacity using the standard Ci factor of 0.5?",
    "options": [
      "13.5 A",
      "54.0 A",
      "26.5 A",
      "20.2 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "SIGN_ERROR",
      "3": "UNITS_MISSING"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "When a cable is totally surrounded by thermal insulation for a distance of 0.5m (500mm) or more, a correction factor (Ci) of 0.5 is applied. 27A x 0.5 = 13.5A."
  },
  {
    "id": 4060,
    "question": "Why must a correction factor (Cc) of 0.725 be applied to the current-carrying capacity of a cable when the protective device is a BS 3036 semi-enclosed fuse?",
    "options": [
      "Because the fuse has a higher fusing factor than circuit breakers",
      "Because the fuse operates at a lower temperature than the cable",
      "To account for the high cost of replacing the fuse wire",
      "Because the fuse is less likely to blow during a short circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "BS 3036 fuses have a high fusing factor (approx 1.9), meaning they allow a significant overload before blowing. The 0.725 factor effectively 'oversizes' the cable to ensure it doesn't overheat before the fuse operates."
  },
  {
    "id": 4061,
    "question": "Which of the following BS numbers identifies a 'Residual Current Breaker with Overcurrent protection' (RCBO) commonly used in modern domestic consumer units?",
    "options": [
      "BS EN 61009",
      "BS EN 60898",
      "BS EN 61008",
      "BS 1363"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "BS EN 61009 is the standard for RCBOs. BS EN 60898 is for MCBs, and BS EN 61008 is for RCDs (without overcurrent protection)."
  },
  {
    "id": 4062,
    "question": "When cables are grouped together in a trunking, their current-carrying capacity is reduced. What is the primary physical reason for this requirement?",
    "options": [
      "Mutual heating from adjacent cables reduces the ability to dissipate heat",
      "Increased magnetic interference between the conductors",
      "The increase in total resistance due to the length of the trunking",
      "The voltage drop increases when cables are close together"
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
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Cables generate heat when carrying current. When grouped, the heat from one cable affects the others, and the restricted airflow prevents efficient cooling, requiring a reduction in the maximum allowable current (Cg factor)."
  },
  {
    "id": 4063,
    "question": "An electrician calculates the required current-carrying capacity (Iz) for a circuit where In = 32 A. The circuit is in an ambient temperature of 40°C (Ca = 0.87) and is grouped with two other circuits (Cg = 0.70). What is the minimum calculated Iz?",
    "options": [
      "52.55 A",
      "19.50 A",
      "45.71 A",
      "36.78 A"
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
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Iz = In / (Ca x Cg). Iz = 32 / (0.87 x 0.70) = 32 / 0.609 = 52.545 A. Rounded to 52.55 A."
  },
  {
    "id": 4064,
    "question": "Which installation method corresponds to a multicore cable clipped directly to a wooden wall, as defined in BS 7671?",
    "options": [
      "Method C",
      "Method A",
      "Method B",
      "Method 100"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "DISCRIMINATION_ERROR",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 60,
    "explanation": "Method C refers to 'Clipped Direct'. Method A is in conduit in an insulated wall, and Method B is in conduit on a wall or in trunking."
  },
  {
    "id": 4065,
    "question": "If a cable's current-carrying capacity (Iz) is found to be lower than the rating of the protective device (In), what is the most appropriate corrective action?",
    "options": [
      "Increase the cross-sectional area of the conductor",
      "Decrease the size of the load connected to the circuit",
      "Change the protective device to a higher rating",
      "Ignore the difference if it is less than 5 Amps"
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
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "If Iz < In, the cable is not protected against overload. The standard solution is to increase the cable size (increasing Iz) until it is equal to or greater than In."
  }
];
