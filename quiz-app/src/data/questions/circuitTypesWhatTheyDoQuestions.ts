import { TaggedQuestion } from './types';

/**
 * Circuit Types: What They Do Question Bank
 * Aligned with lesson 203-3A9 learning outcomes
 * Generated: 2026-02-05
 */

export const circuitTypesWhatTheyDoQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "Which of the following is a defining characteristic of a ring final circuit used for socket outlets?",
    "options": [
      "The circuit cable starts and finishes at the same point in the consumer unit",
      "The circuit cable ends at the furthest point of the installation",
      "The circuit is only used for high-voltage industrial machinery",
      "The circuit does not require a protective earthing conductor"
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
      "conceptual",
      "terminology",
      "ring-final"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is unique because the live conductors form a continuous loop, starting and ending at the same terminals in the consumer unit."
  },
  {
    "id": 4017,
    "question": "A series circuit contains two resistors with values of 15 Ω and 25 Ω. What is the total resistance of the circuit?",
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
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "series",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance is found by adding the individual resistances together (15 + 25 = 40)."
  },
  {
    "id": 4018,
    "question": "What is the typical rating for a circuit breaker (MCB) protecting a standard domestic lighting circuit in the UK?",
    "options": [
      "6 A",
      "32 A",
      "13 A",
      "0.5 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Lighting",
    "tags": [
      "conceptual",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Standard domestic lighting circuits are typically protected by a 6 Amp MCB as they carry relatively low current."
  },
  {
    "id": 4019,
    "question": "Two 10 Ω resistors are connected in parallel. What is the total resistance of this arrangement?",
    "options": [
      "5 Ω",
      "20 Ω",
      "100 Ω",
      "0.2 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "For two identical resistors in parallel, the total resistance is half the value of one resistor (10 / 2 = 5)."
  },
  {
    "id": 4020,
    "question": "What is the primary function of a control circuit in an electrical installation?",
    "options": [
      "To safely operate a high-power load using a lower power signal",
      "To provide high-speed data transmission for internet services",
      "To increase the voltage for long-distance transmission",
      "To convert AC current into DC current for battery charging"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "Control",
    "tags": [
      "conceptual",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Control circuits allow operators to switch large loads (like motors or heaters) using safe, low-power switches or automated sensors."
  },
  {
    "id": 4021,
    "question": "A 12V DC source is connected to two identical 6 Ω resistors in series. What is the voltage drop across one of the resistors?",
    "options": [
      "6 V",
      "12 V",
      "2 V",
      "72 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "series",
      "voltage-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a series circuit with two identical resistors, the source voltage is shared equally between them (12V / 2 = 6V)."
  },
  {
    "id": 4022,
    "question": "Which of these circuit types is most likely to be used for a single fixed appliance like an electric oven?",
    "options": [
      "Radial circuit",
      "Ring final circuit",
      "Data circuit",
      "Series lighting circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Power",
    "tags": [
      "application",
      "terminology",
      "mixed-circuit"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "High-power fixed appliances like ovens are usually wired on their own dedicated radial circuit."
  },
  {
    "id": 4023,
    "question": "If 3 Amps of current is measured at the start of a series circuit containing three lamps, how much current flows through the third lamp?",
    "options": [
      "3 A",
      "1 A",
      "9 A",
      "0 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "series",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "In a series circuit, the current remains the same at all points in the circuit."
  },
  {
    "id": 4024,
    "question": "An electrician is installing a network for a small office. Which cable type should be used for the data and communications circuit?",
    "options": [
      "Cat6 Twisted Pair",
      "Twin and Earth",
      "Steel Wire Armoured (SWA)",
      "Single core PVC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Data/Comms",
    "tags": [
      "application",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Cat6 is a standard cable used for high-speed data and communication networks."
  },
  {
    "id": 4025,
    "question": "A 230V electric heater is found to draw a current of 10A. Calculate the power rating of the heater.",
    "options": [
      "2300 W",
      "23 W",
      "240 W",
      "2300 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Calculation",
    "tags": [
      "power",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Power is calculated using the formula P = V x I. Therefore, 230V x 10A = 2300 Watts (W)."
  },
  {
    "id": 4026,
    "question": "Which circuit arrangement is unique to UK domestic installations, where the circuit cables form a loop starting and ending at the same protective device in the consumer unit?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series lighting circuit",
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
      "topology-confusion"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit is a specific UK topology where the live, neutral, and earth conductors form a continuous loop back to the consumer unit, allowing current to flow in two directions to the socket outlets."
  },
  {
    "id": 4027,
    "question": "A series heating circuit contains three identical elements, each with a resistance of 15 Ω. What is the total resistance of the circuit?",
    "options": [
      "45 Ω",
      "5 Ω",
      "15 Ω",
      "225 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "resistance-rule",
      "calculation",
      "series"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a series circuit, total resistance (Rt) is the sum of all individual resistances: Rt = R1 + R2 + R3. Therefore, 15 + 15 + 15 = 45 Ω."
  },
  {
    "id": 4028,
    "question": "Which type of circuit is specifically intended to provide power to smoke detectors and emergency exit signage in a commercial building?",
    "options": [
      "Alarm and emergency circuit",
      "Data and communications circuit",
      "Ring final circuit",
      "Control and monitoring circuit"
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
      "discrimination"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Alarm and emergency circuits are dedicated systems designed to ensure safety during power failures or fire events, separate from general lighting or power circuits."
  },
  {
    "id": 4029,
    "question": "An electrician measures the voltage across two identical lamps connected in series. If the total supply voltage is 230V, what is the expected voltage drop across each lamp?",
    "options": [
      "115V",
      "230V",
      "460V",
      "57.5V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "voltage-rule",
      "calculation",
      "series"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 60,
    "explanation": "In a series circuit with identical components, the total supply voltage is shared equally between them. 230V / 2 = 115V."
  },
  {
    "id": 4030,
    "question": "A radial power circuit is installed to supply two industrial fans connected in parallel. If each fan draws 8A, what is the total current supplied by the circuit?",
    "options": [
      "16A",
      "8A",
      "4A",
      "64A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "current-rule",
      "parallel",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current (It) is the sum of the currents in each branch: It = I1 + I2. Therefore, 8A + 8A = 16A."
  },
  {
    "id": 4031,
    "question": "An electrician is testing a parallel circuit containing three identical heating elements, each with a resistance of 69 ohms. What is the total resistance of the circuit?",
    "options": [
      "23 ohms",
      "207 ohms",
      "69 ohms",
      "0.04 ohms"
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
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a parallel circuit with identical resistors, the total resistance (Rt) is the value of one resistor divided by the number of resistors (69 / 3 = 23 ohms)."
  },
  {
    "id": 4032,
    "question": "What is the primary operational advantage of using a 32A Ring Final Circuit rather than a 32A Radial Circuit in a domestic installation?",
    "options": [
      "It allows for a smaller cable cross-sectional area due to current sharing",
      "It eliminates the risk of voltage drop over long distances",
      "It uses significantly less total cable during installation",
      "It makes fault finding and isolation much simpler for the technician"
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
      "ring-final",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit allows current to flow in two directions to the load, effectively sharing the load between two conductors, which permits the use of 2.5mm² cable for a 32A protective device."
  },
  {
    "id": 4033,
    "question": "A radial power circuit at 230V supplies two appliances in parallel: a 2.3kW heater and a 1.15kW heater. What is the total design current (Ib) for this circuit?",
    "options": [
      "15A",
      "5A",
      "10A",
      "34.5A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "ROUNDING_ERROR",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "current-rule",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Power = 2300W + 1150W = 3450W. I = P / V, so 3450 / 230 = 15A."
  },
  {
    "id": 4034,
    "question": "According to standard UK installation practices, which type of circuit is most appropriate for a fixed 3kW immersion heater?",
    "options": [
      "A dedicated 16A or 20A radial circuit",
      "A 32A ring final circuit shared with socket outlets",
      "A 6A lighting circuit using 1.5mm² cable",
      "A 13A fused spur connected to a data circuit"
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
      "radial",
      "units"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power fixed appliances like immersion heaters should be on their own dedicated radial circuit to prevent overloading general-purpose circuits."
  },
  {
    "id": 4035,
    "question": "In the context of emergency lighting, what defines a 'non-maintained' circuit?",
    "options": [
      "The lamps only illuminate when the primary power supply fails",
      "The lamps stay on at all times while the building is occupied",
      "The circuit does not require periodic testing or maintenance",
      "The lamps are powered only by a central DC battery system"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lighting only operates when the normal mains supply to the local lighting circuit fails."
  },
  {
    "id": 4036,
    "question": "A ring final circuit has a measured end-to-end resistance of the line conductor (r1) of 0.8 ohms. What is the theoretical resistance (R1) at the midpoint of the ring?",
    "options": [
      "0.2 ohms",
      "0.4 ohms",
      "0.8 ohms",
      "1.6 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ring-final",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a ring circuit, the resistance at the furthest point (R1) is (r1 / 4). This is because the two paths to the midpoint are in parallel, and each path is half the total length (0.4 ohms || 0.4 ohms = 0.2 ohms)."
  },
  {
    "id": 4037,
    "question": "Why is it critical to maintain physical separation between data/communication cables and 230V power cables within the same containment system?",
    "options": [
      "To prevent electromagnetic interference (EMI) from corrupting data signals",
      "To prevent the data cables from overheating due to high resistance",
      "Because data cables operate at a higher frequency than 50Hz mains",
      "To ensure that the data circuit can be used as an earth return"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Separation (segregation) is required to prevent electromagnetic interference from power cables inducing noise and errors into data transmission lines."
  },
  {
    "id": 4038,
    "question": "A series control circuit contains three identical relay coils. If the total circuit resistance is 1200 ohms, what is the resistance of each individual coil?",
    "options": [
      "400 ohms",
      "3600 ohms",
      "1200 ohms",
      "133 ohms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "series",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a series circuit, total resistance is the sum of individual resistances. For three identical coils: 1200 / 3 = 400 ohms each."
  },
  {
    "id": 4039,
    "question": "Which of the following describes the function of a 'control circuit' in an industrial motor starter?",
    "options": [
      "It uses a low current to switch a higher current via a contactor",
      "It provides the main three-phase power directly to the motor windings",
      "It protects the motor from short-circuits using a high-rating fuse",
      "It converts AC power to DC power for the motor's operation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A control circuit allows for the safe and efficient switching of high-power loads using lower current/voltage components like push buttons and relay coils."
  },
  {
    "id": 4040,
    "question": "Calculate the design current (Ib) for a 230V radial circuit supplying an electric shower with a power rating of 9.2kW.",
    "options": [
      "40A",
      "25A",
      "2116A",
      "0.025A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "units"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using P = V x I, rearranged to I = P / V: 9200W / 230V = 40A."
  },
  {
    "id": 4041,
    "question": "A domestic ring final circuit is designed to supply multiple 13 A socket outlets. What is the primary advantage of using a ring topology instead of a single 32 A radial circuit for this application?",
    "options": [
      "It allows for the use of smaller conductors to achieve the same current carrying capacity",
      "It ensures that current only flows in one direction around the circuit",
      "It eliminates the need for an RCD (Residual Current Device)",
      "It reduces the total resistance by connecting all appliances in series"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "topology",
      "application"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit splits the load current between two paths, effectively doubling the current carrying capacity compared to a single radial of the same conductor size."
  },
  {
    "id": 4042,
    "question": "An electrician is installing two 40 Ω heating elements in parallel within a storage heater. What is the total resistance of this heating circuit?",
    "options": [
      "20 Ω",
      "80 Ω",
      "1600 Ω",
      "0.05 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For two identical resistors in parallel, the total resistance is half of one resistor (Rt = R / n). 40 Ω / 2 = 20 Ω."
  },
  {
    "id": 4043,
    "question": "In a commercial building, a control circuit is used to operate a heavy-duty motor starter. Why is a separate low-voltage control circuit typically used rather than switching the main power directly?",
    "options": [
      "To improve safety for the operator by using lower voltages at the switch interface",
      "Because AC motors can only be started using DC control signals",
      "To increase the total power consumption of the motor system",
      "To ensure the motor runs at a higher frequency than the supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Control circuits often operate at Extra Low Voltage (ELV) to reduce the risk of electric shock to operators and allow for smaller, more cost-effective switching components."
  },
  {
    "id": 4044,
    "question": "A 230 V radial lighting circuit has three lamps connected in parallel. If each lamp draws a current of 0.4 A, what is the total current flowing through the circuit protective device?",
    "options": [
      "1.2 A",
      "0.4 A",
      "0.13 A",
      "92 A"
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
      "current-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a parallel circuit, the total current is the sum of the individual branch currents (It = I1 + I2 + I3). 0.4 + 0.4 + 0.4 = 1.2 A."
  },
  {
    "id": 4045,
    "question": "An electrician is measuring the resistance of a ring final circuit during a dead test. If the end-to-end resistance of the phase conductor (r1) is 0.6 Ω, what is the expected resistance measured between the phase and neutral at any socket, assuming the circuit is healthy and the neutral conductor (rn) is also 0.6 Ω?",
    "options": [
      "0.3 Ω",
      "1.2 Ω",
      "0.6 Ω",
      "0.15 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "calculation",
      "parallel",
      "application"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "In a ring final circuit, the resistance at a socket (R1+RN) is (r1 + rn) / 4. Here, (0.6 + 0.6) / 4 = 1.2 / 4 = 0.3 Ω."
  },
  {
    "id": 4046,
    "question": "When installing data and communication cabling alongside 230 V power circuits, why must a minimum separation distance be maintained?",
    "options": [
      "To prevent electromagnetic interference from the power cables affecting data signals",
      "To ensure the data cables do not overheat the power cables",
      "Because data cables carry high-frequency DC which attracts AC voltage",
      "To prevent the data cables from increasing the resistance of the power circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Current flowing through power cables creates electromagnetic fields that can induce noise (interference) into sensitive data cables, corrupting the signal."
  },
  {
    "id": 4047,
    "question": "A radial circuit supplies a 3 kW immersion heater. If the supply voltage is 230 V, calculate the approximate current drawn by the heater.",
    "options": [
      "13.04 A",
      "0.07 A",
      "690 A",
      "13040 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "ohms-law",
      "power",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Using the formula I = P / V: 3000 W / 230 V = 13.04 A."
  },
  {
    "id": 4048,
    "question": "Which of the following best describes the configuration of a 'non-maintained' emergency lighting circuit?",
    "options": [
      "The lamps only illuminate when the local mains power supply fails",
      "The lamps are permanently illuminated during both normal and emergency modes",
      "The lamps are connected in series to ensure they all fail at once if a fault occurs",
      "The lamps only operate on DC power from a central generator during testing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Non-maintained emergency lighting only energizes the lamps when the normal power supply to the circuit fails."
  },
  {
    "id": 4049,
    "question": "A 230 V circuit has two identical 115 V indicator lamps connected in series. If the resistance of each lamp is 230 Ω, what is the total current flowing through the circuit?",
    "options": [
      "0.5 A",
      "1.0 A",
      "2.0 A",
      "0.25 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_I_V_R",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "series",
      "calculation",
      "ohms-law"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total Resistance (Rt) = 230 + 230 = 460 Ω. Total Current (I) = V / Rt = 230 / 460 = 0.5 A."
  },
  {
    "id": 4050,
    "question": "An electrician needs to install a new 7.2 kW electric shower. Which circuit type is the most appropriate for this installation?",
    "options": [
      "A dedicated radial circuit with a high-current protective device",
      "A spur taken from the existing 32 A ring final circuit",
      "A connection to the nearest 6 A lighting radial circuit",
      "A parallel connection to the kitchen cooker circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "High-power appliances like electric showers (approx. 31 A) require a dedicated radial circuit to prevent overloading and ensure proper isolation and protection."
  },
  {
    "id": 4051,
    "question": "A radial power circuit is used to supply two industrial heaters connected in parallel. Heater A has a resistance of 40 Ω and Heater B has a resistance of 60 Ω. Ignoring cable resistance, what is the total resistance of the load?",
    "options": [
      "24 Ω",
      "100 Ω",
      "50 Ω",
      "0.04 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "ROUNDING_ERROR",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For resistors in parallel, the total resistance is calculated using 1/Rt = 1/R1 + 1/R2. Therefore, 1/Rt = 1/40 + 1/60 = 0.025 + 0.0166 = 0.0416. Rt = 1 / 0.0416 = 24 Ω."
  },
  {
    "id": 4052,
    "question": "In a standard UK ring final circuit protected by a 32A circuit breaker, why is it permissible to use a cable that has a current-carrying capacity of only 20A?",
    "options": [
      "The current has two paths to travel, effectively sharing the load across the cable loop",
      "The circuit is wired in series, which reduces the total current flow through the conductors",
      "The 32A rating refers to the peak current, while the cable is rated for RMS current",
      "The circuit breaker is designed to trip at 20A but allows 32A for short durations"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_RMS_WITH_PEAK",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ring-final",
      "current-rule",
      "application"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a ring final circuit, the current splits at the consumer unit and travels in both directions around the ring. This sharing of the load allows the 32A total current to be supported by the two paths of 20A-rated cable."
  },
  {
    "id": 4053,
    "question": "A radial circuit supplies a 4.6 kW heater at 230V. If the total circuit resistance (line and neutral combined) is 0.4 Ω, calculate the voltage drop across the circuit conductors when the heater is in use.",
    "options": [
      "8.0 V",
      "20.0 V",
      "11.5 V",
      "1.84 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "MULTIPLIED_INSTEAD",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "ohms-law",
      "calculation",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "First, find the current: I = P / V = 4600 / 230 = 20A. Then, calculate voltage drop: V = I x R = 20 x 0.4 = 8V."
  },
  {
    "id": 4054,
    "question": "Which specific circuit type would be used to provide the electrical link between a wall-mounted thermostat and a central heating boiler's motorized valve?",
    "options": [
      "Control circuit",
      "Data/comms circuit",
      "Ring final circuit",
      "Emergency circuit"
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
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Control circuits are used to manage the operation of other equipment, such as switching valves or contactors based on sensor input like a thermostat."
  },
  {
    "id": 4055,
    "question": "An electrician is installing a radial lighting circuit with ten 60W lamps connected in parallel to a 230V supply. What is the total current drawn by this circuit?",
    "options": [
      "2.61 A",
      "0.26 A",
      "3.83 A",
      "138,000 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "ohms-law",
      "calculation"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Total power = 10 lamps x 60W = 600W. Total current I = P / V = 600 / 230 = 2.608A, which rounds to 2.61A."
  },
  {
    "id": 4056,
    "question": "A ring final circuit is installed using 2.5mm² copper cable with a total length of 80m. If the conductor resistance is 18mΩ/m, calculate the expected resistance (R1) at the furthest point of the ring under healthy conditions.",
    "options": [
      "0.36 Ω",
      "1.44 Ω",
      "0.72 Ω",
      "5.76 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "DIVIDED_INSTEAD",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "parallel",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a healthy ring final circuit, the resistance at the furthest point (R1) is calculated as (r1 / 4). First, find the end-to-end resistance (r1): 80m * 0.018 Ω/m = 1.44 Ω. Then, R1 = 1.44 / 4 = 0.36 Ω."
  },
  {
    "id": 4057,
    "question": "Which of the following describes the primary advantage of utilizing a Ring Final Circuit (RFC) topology for power distribution in a domestic setting compared to a Radial circuit?",
    "options": [
      "It allows for a higher current carrying capacity using smaller cross-sectional area conductors due to two parallel paths.",
      "It ensures that if a single conductor is severed, the circuit protection will immediately trip to prevent danger.",
      "It eliminates the possibility of voltage drop at the midpoint of the circuit because current flows from both directions.",
      "It allows for the connection of an unlimited number of socket outlets regardless of the floor area served."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONCEPTUAL_ERROR",
      "3": "LEGISLATION_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "explanation",
      "power"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The RFC is unique because it provides two paths for current to flow to any point. This effectively doubles the capacity of the cable (with some caveats), allowing 2.5mm² cable to be protected by a 30A or 32A device."
  },
  {
    "id": 4058,
    "question": "A 9.5kW electric heater is supplied by a 230V radial circuit via 25 metres of cable. If the cable has a voltage drop factor of 4.4mV/A/m, calculate the total voltage drop when the heater is operating at full power.",
    "options": [
      "4.54 V",
      "1.04 V",
      "19.32 V",
      "4542 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "First, find current (I): 9500W / 230V = 41.3A. Then use the formula VD = (mV/A/m * I * L) / 1000. So, (4.4 * 41.3 * 25) / 1000 = 4.543V."
  },
  {
    "id": 4059,
    "question": "In a commercial building, an electrician is installing Category 2 (Data/Comms) cabling alongside Category 1 (Mains) power circuits. To prevent electromagnetic interference (EMI) and maintain safety, what is the required action?",
    "options": [
      "Provide physical separation or use earthed metallic screening/conduit for the data cables.",
      "Ensure both sets of cables are connected to the same CPC to equalize potential.",
      "Increase the cross-sectional area of the data cables to reduce signal resistance.",
      "Run the data cables in a series loop to cancel out the magnetic fields from the power radial."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONCEPTUAL_ERROR",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "application",
      "terminology",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "To prevent EMI and ensure safety (preventing mains voltage from entering data systems during a fault), physical separation or appropriate screening is required by BS 7671."
  },
  {
    "id": 4060,
    "question": "An industrial control panel uses a 24V DC SELV circuit for its emergency stop buttons. Why is this circuit type preferred over a 230V AC control circuit for this application?",
    "options": [
      "It reduces the risk of electric shock to operators and allows for easier integration with electronic logic controllers.",
      "DC current travels faster than AC current, ensuring a quicker shutdown during an emergency.",
      "The 24V DC circuit does not require overcurrent protection due to the low voltage level.",
      "It allows the control wiring to be smaller because DC current does not experience voltage drop."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONCEPTUAL_ERROR",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "ac-dc",
      "health-safety"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Separated Extra Low Voltage (SELV) provides a high level of safety against electric shock. Furthermore, most modern PLCs and control systems natively operate on 24V DC."
  },
  {
    "id": 4061,
    "question": "A ring final circuit has an end-to-end loop resistance (r1) of 0.6 Ω. A 32A load is connected to a socket exactly one-quarter of the way along the ring from the consumer unit. Calculate the current flowing through the shorter leg of the ring.",
    "options": [
      "24 A",
      "8 A",
      "16 A",
      "32 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "current-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "The ring acts as two parallel resistors. If the load is at 1/4 length, the legs have resistances of 0.15 Ω and 0.45 Ω. Current divides inversely to resistance: I_short = I_total * (R_long / (R_short + R_long)) = 32 * (0.45 / 0.6) = 24A."
  },
  {
    "id": 4062,
    "question": "A technician is maintaining a 'Non-maintained' emergency lighting system. During a standard functional test where the local mains supply is healthy, what should be the status of the emergency lamps?",
    "options": [
      "The lamps should be 'OFF', but the internal batteries should be charging.",
      "The lamps should be 'ON' at full brightness alongside the standard lighting.",
      "The lamps should be 'ON' at a dimmed level to conserve battery life.",
      "The lamps should be 'OFF' and the batteries should be disconnected to prevent overcharging."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONCEPTUAL_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "explanation",
      "terminology"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Non-maintained emergency lights only illuminate when the normal power supply fails. While power is present, the lamps are off, but the charging circuit remains active."
  },
  {
    "id": 4063,
    "question": "An electrician is wiring a series-parallel lighting circuit in a large hall. There are two parallel branches, each containing four 50W lamps in series. If the supply is 230V, calculate the total current for the circuit.",
    "options": [
      "1.74 A",
      "0.87 A",
      "0.43 A",
      "6.96 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "mixed-circuit",
      "power"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Total power P = (2 branches * 4 lamps * 50W) = 400W. Total current I = P / V = 400 / 230 = 1.739A."
  },
  {
    "id": 4064,
    "question": "During a periodic inspection, a 'Ring Final Circuit' is found to have a break in the Line conductor at a socket outlet. How does this change the circuit's electrical behavior?",
    "options": [
      "It effectively becomes two separate radial circuits, increasing the risk of overloading the conductors.",
      "It automatically converts into a series circuit, causing all downstream sockets to lose power.",
      "The circuit resistance decreases because there is now only one path for the current.",
      "The circuit protection will immediately trip because a break in a ring is detected as a short circuit."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "RECIPROCAL_ERROR",
      "3": "CONCEPTUAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "conceptual",
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "A break in a ring turns it into two radials. Since the 32A fuse is designed for two paths, one of the resulting radials could be carrying more current than its 2.5mm² cable can safely handle."
  },
  {
    "id": 4065,
    "question": "Calculate the total resistance of a circuit consisting of three heating elements connected in parallel, with resistances of 20 Ω, 30 Ω, and 60 Ω respectively.",
    "options": [
      "10 Ω",
      "110 Ω",
      "36.6 Ω",
      "0.1 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "ROUNDING_ERROR",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Circuit Types: What They Do",
    "tags": [
      "calculation",
      "resistance-rule",
      "parallel"
    ],
    "learningOutcomeId": "203-3A9-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Using the parallel formula: 1/Rt = 1/20 + 1/30 + 1/60 = 3/60 + 2/60 + 1/60 = 6/60. Therefore, Rt = 60/6 = 10 Ω."
  }
];
