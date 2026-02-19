import { TaggedQuestion } from './types';

/**
 * Conductor Sizing and Protective Devices Question Bank
 * Aligned with lesson 203-3B learning outcomes
 * Generated: 2026-02-19
 */

export const conductorSizingAndProtectiveDevicesQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "In the context of circuit protection and conductor sizing, what does the symbol 'In' represent?",
    "options": [
      "The nominal rating of the protective device",
      "The design current of the electrical load",
      "The maximum current-carrying capacity of the cable",
      "The actual current measured during a test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "terminology",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "'In' is the standard symbol used in BS 7671 to represent the nominal rating or setting of the protective device (e.g., a 16A circuit breaker)."
  },
  {
    "id": 4017,
    "question": "Which of the following mathematical relationships must be satisfied when selecting a protective device for a circuit?",
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
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To ensure safety, the design current (Ib) must be less than or equal to the protective device rating (In), which in turn must be less than or equal to the cable's current-carrying capacity (Iz)."
  },
  {
    "id": 4018,
    "question": "An electrician calculates a circuit's design current (Ib) to be 14A. What is the most appropriate BS EN 60898 circuit breaker rating (In) to use?",
    "options": [
      "16A",
      "10A",
      "6A",
      "32A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "application",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The protective device rating (In) must be equal to or greater than the design current (Ib). For 14A, the next standard size is 16A."
  },
  {
    "id": 4019,
    "question": "What is the primary reason for applying a 'correction factor' to a cable's current-carrying capacity?",
    "options": [
      "To account for environmental conditions that affect heat dissipation",
      "To increase the voltage available at the end of the circuit",
      "To reduce the cost of the installation by using smaller cables",
      "To change the frequency of the alternating current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "explanation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Correction factors (like ambient temperature or grouping) are used because heat is the main limiting factor for cables; if they cannot dissipate heat well, their current capacity must be reduced."
  },
  {
    "id": 4020,
    "question": "Which BS EN 60898 circuit breaker type is the standard choice for domestic installations with low inrush currents, such as lighting?",
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
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Type B devices are designed to trip at 3 to 5 times the rated current, making them suitable for domestic applications where high inrush currents are not expected."
  },
  {
    "id": 4021,
    "question": "If a cable is completely surrounded by thermal insulation for a distance of 0.5 metres, what effect does this have on its current-carrying capacity?",
    "options": [
      "The capacity is significantly reduced",
      "The capacity is significantly increased",
      "There is no change to the capacity",
      "The voltage drop is automatically eliminated"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "explanation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Thermal insulation acts as a blanket, trapping heat within the cable. This reduces the cable's ability to carry current safely without overheating."
  },
  {
    "id": 4022,
    "question": "What does the symbol 'Ib' represent in the cable sizing process?",
    "options": [
      "The design current of the circuit",
      "The breaking capacity of the fuse",
      "The insulation resistance value",
      "The total length of the conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "UNITS_MISSING"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "'Ib' is the design current, which is the maximum current intended to be carried by the circuit in normal service."
  },
  {
    "id": 4023,
    "question": "A 230V immersion heater is rated at 3kW. Using the formula P = V × I, the design current is approximately 13A. Which protective device would be standard for this circuit?",
    "options": [
      "16A BS EN 60898 MCB",
      "6A BS EN 60898 MCB",
      "10A BS EN 60898 MCB",
      "40A BS EN 60898 MCB"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "application",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Since Ib is 13A, the protective device (In) must be greater than 13A. 16A is the nearest standard rating that satisfies Ib ≤ In."
  },
  {
    "id": 4024,
    "question": "When several circuits are run together in the same conduit or trunking, which correction factor must be applied to the cable sizing calculation?",
    "options": [
      "Cg (Grouping)",
      "Ca (Ambient temperature)",
      "Ci (Thermal insulation)",
      "Cf (Semi-enclosed fuse)"
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
      "calculation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cg is the correction factor for grouping. When cables are grouped together, they heat each other up, so their current-carrying capacity must be reduced."
  },
  {
    "id": 4025,
    "question": "Which of the following describes the term 'Iz' in BS 7671?",
    "options": [
      "The current-carrying capacity of a cable for a specific installation method",
      "The maximum fault current the device can handle",
      "The voltage drop per ampere per metre",
      "The impedance of the earth fault loop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "conceptual",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Iz is the current-carrying capacity of a cable under the specific conditions of the installation, after correction factors have been applied."
  },
  {
    "id": 4026,
    "question": "What is the primary purpose of a circuit protective device, such as an MCB, in an electrical installation?",
    "options": [
      "To protect the circuit conductors from the effects of overcurrent",
      "To protect the appliance or equipment from internal faults",
      "To reduce the electricity consumption of the connected load",
      "To increase the voltage available at the end of the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Conductor Sizing and Protective Devices",
    "category": "Protective Devices",
    "tags": [
      "terminology",
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The primary role of a circuit protective device like an MCB is to protect the fixed wiring (conductors) from damage caused by overloads or short circuits."
  },
  {
    "id": 4027,
    "question": "Which BS EN standard applies to Miniature Circuit Breakers (MCBs) used for overcurrent protection in domestic and commercial installations?",
    "options": [
      "BS EN 60898",
      "BS EN 61008",
      "BS 1363",
      "BS 7671"
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
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "BS EN 60898 is the specific product standard for MCBs. BS EN 61008 is for RCCBs, BS 1363 is for plugs/sockets, and BS 7671 is the Wiring Regulations."
  },
  {
    "id": 4028,
    "question": "Which type of MCB is generally recommended for circuits supplying loads with high inrush currents, such as small electric motors?",
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
      "3": "OTHER"
    },
    "section": "Conductor Sizing and Protective Devices",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Type C breakers are designed to handle higher inductive inrush currents without nuisance tripping, compared to Type B which is for general domestic use."
  },
  {
    "id": 4029,
    "question": "An electrician calculates the design current (Ib) for a circuit to be 22A. According to the coordination rule (Ib ≤ In), which standard protective device rating should be selected?",
    "options": [
      "32A",
      "20A",
      "15A",
      "6A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "DIVIDED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Conductor Sizing and Protective Devices",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The rating of the protective device (In) must be equal to or greater than the design current (Ib). Since 22A is the load, the next standard size up is 32A (as 20A would be too small and cause tripping)."
  },
  {
    "id": 4030,
    "question": "What effect does installing a cable inside thermal insulation have on its current-carrying capacity?",
    "options": [
      "The current-carrying capacity decreases",
      "The current-carrying capacity increases",
      "The current-carrying capacity remains the same",
      "The current-carrying capacity only changes if the cable is longer than 10 meters"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Conductor Sizing and Protective Devices",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Thermal insulation restricts the dissipation of heat from the cable. To prevent the conductor from overheating, its current-carrying capacity must be derated (decreased)."
  },
  {
    "id": 4031,
    "question": "A circuit is protected by a 20A Type B MCB. It is installed in a location where the ambient temperature is 40°C ($C_a = 0.87$). Calculate the minimum current-carrying capacity ($I_t$) required for the conductor.",
    "options": [
      "22.99 A",
      "17.40 A",
      "20.87 A",
      "20.00 A"
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
      "units",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "To find $I_t$, the nominal rating of the protective device ($I_n$) is divided by the correction factors. $20 / 0.87 = 22.99$ A."
  },
  {
    "id": 4032,
    "question": "Why would an electrician select a Type C circuit breaker instead of a Type B for a workshop circuit containing several small motors?",
    "options": [
      "To allow for higher starting currents without nuisance tripping",
      "To provide faster disconnection times for lighting circuits",
      "To increase the total current capacity of the final circuit",
      "To reduce the risk of electric shock in high-moisture areas"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type C breakers are designed to handle higher inductive inrush currents (5-10 times $I_n$) common in motors, preventing nuisance tripping."
  },
  {
    "id": 4033,
    "question": "Which protective device is specifically designed to detect and disconnect a circuit when a small leakage current to Earth is detected?",
    "options": [
      "RCD (Residual Current Device)",
      "MCB (Miniature Circuit Breaker)",
      "BS 88-2 HRC Fuse",
      "MCCB (Moulded Case Circuit Breaker)"
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
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "An RCD monitors the balance between line and neutral currents and trips when a leakage to earth (imbalance) is detected."
  },
  {
    "id": 4034,
    "question": "A 32A ring final circuit is grouped with three other circuits in a conduit, resulting in a grouping factor ($C_g$) of 0.65. What is the minimum $I_t$ value required for the cable?",
    "options": [
      "49.23 A",
      "20.80 A",
      "32.65 A",
      "32.00 A"
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
      "application"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The minimum $I_t$ is calculated by dividing the protective device rating by the correction factor: $32 / 0.65 = 49.23$ A."
  },
  {
    "id": 4035,
    "question": "According to BS 7671, what is the correct relationship for selecting conductor size and protective device ratings relative to the design current?",
    "options": [
      "$I_b \\le I_n \\le I_z$",
      "$I_z \\le I_n \\le I_b$",
      "$I_n \\le I_b \\le I_z$",
      "$I_b \\le I_z \\le I_n$"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The design current ($I_b$) must be less than or equal to the protective device rating ($I_n$), which must be less than or equal to the cable's current-carrying capacity ($I_z$)."
  },
  {
    "id": 4036,
    "question": "When calculating conductor size, which correction factor is specifically used to account for the presence of thermal insulation surrounding a cable for a length of 100mm?",
    "options": [
      "$C_i$",
      "$C_a$",
      "$C_g$",
      "$C_f$"
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
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "$C_i$ is the correction factor for thermal insulation. $C_a$ is ambient temperature, $C_g$ is grouping, and $C_f$ is the semi-enclosed fuse factor."
  },
  {
    "id": 4037,
    "question": "An electrician is installing a circuit for a large industrial motor with a very high and prolonged inductive start-up current. Which MCB type is most suitable?",
    "options": [
      "Type D",
      "Type B",
      "Type A",
      "Type 1"
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
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type D MCBs are designed for circuits with very high inrush currents, such as large transformers or industrial motors, tripping at 10-20 times $I_n$."
  },
  {
    "id": 4038,
    "question": "What is a primary advantage of using a BS 88-2 High Rupturing Capacity (HRC) fuse in an industrial installation compared to other fuse types?",
    "options": [
      "It has a high breaking capacity for safely interrupting large fault currents",
      "It can be manually reset multiple times after a fault occurs",
      "It allows the user to adjust the trip current manually",
      "It is much cheaper to replace than a standard BS 3036 fuse"
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
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "BS 88 fuses (HRC) have very high breaking capacities (up to 80kA), making them suitable for industrial locations with high potential fault currents."
  },
  {
    "id": 4039,
    "question": "In the process of conductor sizing, what does the term $I_z$ represent?",
    "options": [
      "The current-carrying capacity of the cable under actual installation conditions",
      "The tabulated current-carrying capacity found in BS 7671 Appendix 4",
      "The maximum current the load is expected to draw during normal operation",
      "The nominal rating of the circuit breaker or fuse used for protection"
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
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "$I_z$ is the actual current-carrying capacity of the cable after correction factors have been applied. $I_t$ is the tabulated value."
  },
  {
    "id": 4040,
    "question": "Why must the current-carrying capacity of a cable be increased if a BS 3036 semi-enclosed fuse is used as the protective device?",
    "options": [
      "Because the fuse has a high fusing factor of 1.45, requiring a 0.725 multiplier",
      "Because semi-enclosed fuses are prone to mechanical wear and vibration",
      "Because the fuse operates significantly faster than a modern MCB",
      "Because the fuse is not affected by the ambient temperature of the room"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203-3B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "BS 3036 fuses have a high fusing factor (1.45). To ensure the cable is protected during the long time it takes the fuse to blow, the cable capacity must be derated by a factor of 0.725."
  },
  {
    "id": 4041,
    "question": "What is the primary purpose of a BS EN 60898 Type B circuit breaker when installed in a domestic consumer unit?",
    "options": [
      "To provide protection against both overload and short-circuit currents",
      "To provide protection against earth leakage currents only",
      "To protect the installation against transient overvoltages",
      "To allow for high inrush currents from industrial motor starting"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
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
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A BS EN 60898 MCB is an overcurrent protective device designed to trip under overload conditions (thermal element) and short-circuit conditions (magnetic element)."
  },
  {
    "id": 4042,
    "question": "An electrician is calculating the cable size for a circuit where the ambient temperature is expected to be 40°C. Which correction factor must be selected from the BS 7671 tables?",
    "options": [
      "Ca",
      "Cg",
      "Ci",
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
      "terminology",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Ca is the correction factor for Ambient temperature. Cg is for Grouping, Ci is for thermal Insulation, and Cf is for semi-enclosed Fuses."
  },
  {
    "id": 4043,
    "question": "A circuit has a design current (Ib) of 22 A, and a 25 A MCB (In) is used. If the cable is completely surrounded by thermal insulation for a distance of 600 mm (Ci = 0.5), what is the minimum tabulations current-carrying capacity (It) required?",
    "options": [
      "50 A",
      "12.5 A",
      "44 A",
      "11 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "MULTIPLIED_INSTEAD"
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
    "explanation": "To find It, we divide the protective device rating (In) by the correction factors. It = In / Ci. Therefore, 25 / 0.5 = 50 A."
  },
  {
    "id": 4044,
    "question": "Which of the following mathematical expressions correctly represents the coordination between design current (Ib), protective device rating (In), and conductor current-carrying capacity (Iz)?",
    "options": [
      "Ib ≤ In ≤ Iz",
      "Iz ≤ In ≤ Ib",
      "In ≤ Ib ≤ Iz",
      "Ib ≤ Iz ≤ In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "SIGN_ERROR",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The design current must be less than or equal to the device rating, which in turn must be less than or equal to the actual current-carrying capacity of the cable after factors are applied."
  },
  {
    "id": 4045,
    "question": "Which type of BS EN 60898 circuit breaker would be most appropriate for a circuit supplying a large bank of fluorescent luminaires with significant inductive ballasts?",
    "options": [
      "Type C",
      "Type B",
      "Type S",
      "Type AC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
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
    "explanation": "Type C breakers are designed for inductive loads with higher inrush currents, such as motors and fluorescent lighting, whereas Type B is for resistive domestic loads."
  },
  {
    "id": 4046,
    "question": "What is the primary reason for applying a grouping correction factor (Cg) when sizing conductors installed in a common conduit?",
    "options": [
      "To prevent the cables from overheating due to the thermal energy of adjacent cables",
      "To reduce the voltage drop caused by the increased magnetic field",
      "To ensure the protective device trips within the required 0.4 second limit",
      "To compensate for the increased resistance of the copper at high frequencies"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "explanation",
      "health-safety"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables in the same enclosure dissipate heat less effectively; the grouping factor reduces the allowed current to prevent insulation damage from cumulative heat."
  },
  {
    "id": 4047,
    "question": "When using a BS 3036 semi-enclosed (rewirable) fuse for circuit protection, which factor must be applied to the calculation of It to account for its higher fusing factor?",
    "options": [
      "0.725",
      "1.45",
      "0.80",
      "0.95"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "RECIPROCAL_ERROR",
      "2": "OTHER",
      "3": "OTHER"
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
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "BS 3036 fuses have a high fusing factor (approx 1.45). To ensure the cable is protected, the current-carrying capacity must be derated by a factor of 0.725 (which is 1/1.45)."
  },
  {
    "id": 4048,
    "question": "What is the maximum disconnection time required for a 32 A circuit supplying a mobile equipment for use outdoors in a TN system?",
    "options": [
      "0.4 seconds",
      "5 seconds",
      "0.2 seconds",
      "0.1 seconds"
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
      "application",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In a TN system, final circuits up to 63 A (with sockets) or 32 A (fixed equipment) require a disconnection time of 0.4 seconds."
  },
  {
    "id": 4049,
    "question": "A circuit is protected by a 20 A MCB. The cable runs through an area with an ambient temperature factor Ca of 0.87 and is grouped with other circuits giving a Cg of 0.7. Calculate the minimum It required.",
    "options": [
      "32.84 A",
      "12.18 A",
      "24.52 A",
      "28.57 A"
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
      "application",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "It = In / (Ca x Cg). Therefore, It = 20 / (0.87 x 0.7) = 20 / 0.609 = 32.84 A."
  },
  {
    "id": 4050,
    "question": "Which British Standard refers to Residual Current Breakers with Overcurrent protection (RCBOs)?",
    "options": [
      "BS EN 61009",
      "BS EN 60898",
      "BS EN 61008",
      "BS EN 60947-2"
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
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "BS EN 61009 is the standard for RCBOs. BS EN 60898 is for MCBs, and BS EN 61008 is for RCCBs (which do not have overcurrent protection)."
  },
  {
    "id": 4051,
    "question": "What is the primary reason the current-carrying capacity of a conductor (Iz) must be equal to or greater than the nominal rating of the protective device (In)?",
    "options": [
      "To prevent the cable insulation from overheating before the protective device operates",
      "To ensure the circuit breaker trips faster during a short-circuit fault",
      "To reduce the voltage drop across the length of the circuit",
      "To allow the circuit to be extended with additional sockets in the future"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "calculation",
      "explanation",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The cable must be able to carry more current than the protective device's rating to ensure that if an overload occurs, the device trips before the cable reaches a temperature that would damage its insulation."
  },
  {
    "id": 4052,
    "question": "Which type of circuit breaker (MCB) is specifically designed to handle high inrush currents, such as those found in industrial motors or large transformers, without tripping unnecessarily?",
    "options": [
      "Type D",
      "Type B",
      "Type C",
      "Type A"
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
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Type D MCBs are designed for high inductive loads where very high inrush currents are expected (tripping at 10 to 20 times the nominal current)."
  },
  {
    "id": 4053,
    "question": "An electrician is installing a circuit with a design current (Ib) of 24A. The protective device (In) is rated at 32A. If a correction factor for grouping (Cg) of 0.8 is the only factor to consider, what is the minimum required tabulated current-carrying capacity (It) for the cable?",
    "options": [
      "40A",
      "25.6A",
      "30A",
      "32A"
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
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using the formula It >= In / Cg, we calculate 32 / 0.8 = 40A. Using Ib instead of In is a common error, as is multiplying by the factor instead of dividing."
  },
  {
    "id": 4054,
    "question": "In the context of circuit protection, what is the specific function of 'overload' protection compared to 'short-circuit' protection?",
    "options": [
      "It protects against a small but sustained current exceeding the circuit rating",
      "It protects against extremely high currents caused by a fault of negligible impedance",
      "It only monitors the leakage current flowing to the earthing system",
      "It prevents the supply voltage from rising above 230V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "discrimination",
      "explanation"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Overload protection is designed to detect currents that are higher than the design current but lower than fault currents, which would cause gradual overheating over time."
  },
  {
    "id": 4055,
    "question": "When sizing a conductor for a circuit protected by a semi-enclosed (rewirable) fuse to BS 3036, what additional factor must be applied to the protective device rating (In) to find the required current-carrying capacity?",
    "options": [
      "Divide the rating by 0.72",
      "Multiply the rating by 1.45",
      "Divide the rating by 0.63",
      "No factor is required for BS 3036 fuses"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing and Protective Devices",
    "tags": [
      "calculation",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Because BS 3036 fuses have a high fusing factor, the regulations require the rating of the protective device to be divided by 0.72 when calculating the required cable size (It)."
  },
  {
    "id": 4056,
    "question": "An electrician is designing a 32 A radial circuit using a BS EN 60898 Type B MCB. The cable will be grouped with three other loaded circuits (Cg = 0.65) and pass through a wall with thermal insulation for a distance of 600 mm (Ci = 0.5). What is the minimum required current-carrying capacity (It) for the conductor?",
    "options": [
      "98.46 A",
      "10.40 A",
      "49.23 A",
      "64.00 A"
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
      "units",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The formula for It is In / (Cg x Ci). Therefore, 32 / (0.65 x 0.5) = 32 / 0.325 = 98.46 A. Many students mistakenly multiply the rating by the factors or only apply one factor."
  },
  {
    "id": 4057,
    "question": "According to BS 7671, which condition must be met to ensure a protective device provides adequate protection against 'small overloads' in a circuit?",
    "options": [
      "The current ensuring effective operation (I2) must not exceed 1.45 times the current-carrying capacity (Iz)",
      "The nominal rating (In) must be exactly equal to the design current (Ib)",
      "The breaking capacity (Icn) must be less than the prospective fault current (Ipf)",
      "The current-carrying capacity (Iz) must be less than the nominal rating (In)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Regulation 433.1.1 states that I2 (the current ensuring effective operation in the conventional time) must not exceed 1.45 x Iz. This ensures the cable does not overheat significantly before the device trips."
  },
  {
    "id": 4058,
    "question": "A circuit is protected by a 30 A BS 3036 semi-enclosed fuse. If the conductor current-carrying capacity (Iz) must be calculated, what specific correction factor (Cf) must be applied to the nominal rating of the fuse?",
    "options": [
      "0.725",
      "0.87",
      "1.45",
      "0.95"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "RECIPROCAL_ERROR",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "BS 3036 fuses have a high fusing factor. To compensate for this when sizing cables, a correction factor (Cf) of 0.725 is applied (In / 0.725) to ensure the cable is protected against overloads."
  },
  {
    "id": 4059,
    "question": "An industrial motor has a very high starting inrush current, measured at 12 times its full-load current. Which BS EN 60898 MCB type is specifically designed to handle this without nuisance tripping?",
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
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Type D MCBs are designed to trip at 10 to 20 times their rated current, making them suitable for high inrush loads like large motors or transformers. Type B (3-5x) and Type C (5-10x) would likely trip."
  },
  {
    "id": 4060,
    "question": "When calculating the minimum current-carrying capacity for a cable installed in a boiler room where the ambient temperature is 45°C, which factor must be used for a 70°C PVC insulated cable (Ca)?",
    "options": [
      "0.71",
      "1.00",
      "0.87",
      "0.50"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
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
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Using Table 4B1 of BS 7671, the correction factor for 70°C PVC insulation at an ambient temperature of 45°C is 0.71. This reduces the effective current the cable can safely carry."
  },
  {
    "id": 4061,
    "question": "In a complex installation, 'selectivity' (formerly discrimination) is achieved when:",
    "options": [
      "The protective device closest to the fault operates, leaving the upstream devices unaffected",
      "The main switch trips before any individual circuit breakers to ensure total isolation",
      "All protective devices in the chain trip simultaneously to ensure maximum safety",
      "The cable size is doubled for every upstream protective device"
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
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO3.AC3.4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Selectivity ensures that only the protective device immediately upstream of a fault operates, preventing a single fault from disconnecting unrelated parts of the installation."
  },
  {
    "id": 4062,
    "question": "A 10 mm² twin and earth cable is installed such that it is completely surrounded by thermal insulation for a length of 150 mm. Which correction factor (Ci) from Table 52.2 should be applied to its current-carrying capacity?",
    "options": [
      "0.78",
      "0.50",
      "1.00",
      "0.89"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "WRONG_UNITS",
      "3": "ROUNDING_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "BS 7671 Table 52.2 specifies that for a cable surrounded by thermal insulation for 150 mm, a factor of 0.78 must be applied. 0.5 is only used for lengths exceeding 500 mm."
  },
  {
    "id": 4063,
    "question": "What is the primary reason for applying a grouping factor (Cg) when sizing conductors for a multi-circuit trunking system?",
    "options": [
      "Accumulated heat from adjacent cables reduces the ability of an individual cable to dissipate heat",
      "Magnetic fields from adjacent cables increase the resistance of the copper conductors",
      "To account for the increased voltage drop caused by the proximity of other circuits",
      "To ensure that there is enough physical space in the trunking for future expansion"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Cables grouped together cannot dissipate heat as effectively as a single cable. The grouping factor reduces the allowed current to prevent the insulation from reaching its maximum operating temperature."
  },
  {
    "id": 4064,
    "question": "A designer determines the design current (Ib) is 24 A. They select a 25 A BS EN 60898 MCB (In). After applying correction factors, the cable's current-carrying capacity (Iz) is found to be 22 A. Does this circuit meet the coordination requirements of BS 7671?",
    "options": [
      "No, because Iz must be greater than or equal to In",
      "Yes, because In is greater than Ib",
      "Yes, because Iz is close enough to In",
      "No, because Ib must be greater than In"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "SIGN_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Conductor Sizing",
    "tags": [
      "discrimination",
      "legislation"
    ],
    "learningOutcomeId": "203.LO3.AC3.3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The fundamental rule for coordination is Ib ≤ In ≤ Iz. In this case, 25 A (In) is greater than 22 A (Iz), so the cable is not protected against overload and the design fails."
  },
  {
    "id": 4065,
    "question": "Which protective device provides the highest breaking capacity for use in industrial environments with very high prospective fault currents (PFC)?",
    "options": [
      "BS 88-2 cartridge fuse",
      "BS EN 60898 Type B MCB",
      "BS 3036 semi-enclosed fuse",
      "BS 1362 plug fuse"
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
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "BS 88-2 (HRC) fuses have very high breaking capacities (often up to 80kA), making them ideal for the high fault levels found in industrial main switchboards, far exceeding standard MCBs."
  }
];
