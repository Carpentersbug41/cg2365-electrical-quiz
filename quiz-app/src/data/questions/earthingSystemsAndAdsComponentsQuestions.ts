import { TaggedQuestion } from './types';

/**
 * Earthing Systems and ADS Components Question Bank
 * Aligned with lesson 203-4A learning outcomes
 * Generated: 2026-02-19
 */

export const earthingSystemsAndAdsComponentsQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What does the letter 'S' stand for in a TN-S earthing system?",
    "options": [
      "Separate",
      "Series",
      "Safety",
      "Secondary"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a TN-S system, the Neutral and Protective (Earth) conductors are separate throughout the entire system."
  },
  {
    "id": 4017,
    "question": "Which earthing system requires the consumer to provide their own earth electrode, such as a ground rod?",
    "options": [
      "TT",
      "TN-S",
      "TN-C-S",
      "PME"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A TT system relies on the mass of earth for the return path, requiring a local earth electrode at the installation."
  },
  {
    "id": 4018,
    "question": "In a TN-C-S system, what is the single conductor called that combines both neutral and protective functions?",
    "options": [
      "PEN conductor",
      "CPC",
      "Main bonding jumper",
      "Line conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "PEN stands for Protective Earth and Neutral, which are combined in the supply part of a TN-C-S system."
  },
  {
    "id": 4019,
    "question": "What is the primary purpose of a Circuit Protective Conductor (CPC) in a circuit?",
    "options": [
      "To provide a path for fault current to flow to earth",
      "To carry the normal return current to the source",
      "To increase the resistance of the circuit",
      "To provide a connection for the doorbell"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "conceptual",
      "safety"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The CPC ensures that if a fault occurs, the current has a safe, low-resistance path to earth to trigger the protective device."
  },
  {
    "id": 4020,
    "question": "Which component is used to detect small leakage currents to earth that an MCB might not detect?",
    "options": [
      "RCD",
      "BS 88 Fuse",
      "Main Switch",
      "Isolator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "An Residual Current Device (RCD) monitors the balance between line and neutral and trips if a leakage to earth is detected."
  },
  {
    "id": 4021,
    "question": "What does the abbreviation 'ADS' stand for in relation to electrical safety?",
    "options": [
      "Automatic Disconnection of Supply",
      "Active Direct System",
      "Alternative Distribution Source",
      "Automatic Device Switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "ADS is the primary safety measure used in the UK to protect against electric shock by disconnecting power during a fault."
  },
  {
    "id": 4022,
    "question": "A TN-C-S system is frequently referred to by which other common name?",
    "options": [
      "PME",
      "Earth Rod System",
      "Separated System",
      "Isolated Supply"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "PME (Protective Multiple Earthing) is the term used for the supply arrangement that forms a TN-C-S system."
  },
  {
    "id": 4023,
    "question": "In a TN-S system, how is the earth connection usually provided by the supplier?",
    "options": [
      "Through the metal sheath of the supply cable",
      "Through a separate earth rod at the consumer's house",
      "By connecting to the incoming water pipe",
      "By connecting to the incoming gas pipe"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "In TN-S, the supplier provides a separate earth path back to the transformer, often using the cable's lead sheath or armour."
  },
  {
    "id": 4024,
    "question": "Which of these is a component of an ADS system that provides overcurrent protection?",
    "options": [
      "MCB",
      "Main Earth Terminal",
      "Earthing Conductor",
      "Equipotential Bonding"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A Miniature Circuit Breaker (MCB) is the component that automatically disconnects the supply during an overload or short circuit."
  },
  {
    "id": 4025,
    "question": "Where is the Main Earthing Terminal (MET) typically found in a domestic installation?",
    "options": [
      "Inside or adjacent to the Consumer Unit",
      "Under the kitchen sink",
      "At the furthest socket outlet",
      "In the loft space"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-4A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The MET is the central point for all earthing and bonding connections, located at the origin of the installation."
  },
  {
    "id": 4026,
    "question": "Which earthing system is characterized by having a separate neutral and protective conductor throughout the entire installation and supply?",
    "options": [
      "TN-S",
      "TN-C-S",
      "TT",
      "IT"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a TN-S (Terre-Neutral Separate) system, the neutral and protective conductors are separate throughout the supply and the consumer's installation."
  },
  {
    "id": 4027,
    "question": "What is the main function of an overcurrent protective device as part of an Automatic Disconnection of Supply (ADS) system?",
    "options": [
      "To interrupt the circuit during a short circuit or overload",
      "To maintain a constant voltage to the equipment",
      "To provide a low resistance path to the earth electrode",
      "To measure the amount of energy consumed"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overcurrent protective devices, such as MCBs or fuses, are designed to disconnect the power automatically when current exceeds safe levels due to overload or short circuit."
  },
  {
    "id": 4028,
    "question": "In which earthing system does the consumer provide their own earth electrode, such as a copper-clad steel rod, because no earth is provided by the supplier?",
    "options": [
      "TT",
      "TN-S",
      "TN-C-S",
      "PME"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A TT (Terre-Terre) system relies on the consumer providing an earth electrode to connect the installation to the mass of the earth."
  },
  {
    "id": 4029,
    "question": "An electrician is installing a circuit that requires additional protection. Which component is specifically designed to detect small leakage currents to earth and disconnect the supply?",
    "options": [
      "RCD (Residual Current Device)",
      "MCB (Miniature Circuit Breaker)",
      "Main Switch",
      "Isolator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "An RCD monitors the balance between line and neutral currents and trips when it detects a small leakage (residual) current to earth."
  },
  {
    "id": 4030,
    "question": "In the context of earthing systems, what does the 'C' stand for in a TN-C-S arrangement?",
    "options": [
      "Combined",
      "Continuous",
      "Copper",
      "Circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "In a TN-C-S system, the neutral and protective functions are 'Combined' in a single conductor (PEN conductor) for part of the system."
  },
  {
    "id": 4031,
    "question": "In a TN-S earthing system, how is the protective earth (PE) connected back to the source transformer?",
    "options": [
      "Via a separate conductor, such as the metallic sheath or armor of the supply cable",
      "Via a combined neutral and earth (CNE) conductor provided by the supplier",
      "Via a local earth electrode driven into the ground at the consumer's property",
      "Via the neutral conductor only, which is then split at the consumer unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a TN-S (Terre-Neutral-Separate) system, the earth and neutral are separate conductors throughout the entire system, often using the cable's lead sheath or steel wire armour as the earth path."
  },
  {
    "id": 4032,
    "question": "A TT earthing system relies on a local earth electrode. Why is an RCD almost always required for Automatic Disconnection of Supply (ADS) in these installations?",
    "options": [
      "The earth fault loop impedance (Zs) is usually too high to trip a standard MCB",
      "The local electrode cannot handle the high currents of a short circuit",
      "TT systems do not have a neutral connection at the source transformer",
      "RCDs are required to balance the voltage between the electrode and the neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "conceptual",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In TT systems, the resistance of the earth electrode (Ra) makes the total earth fault loop impedance (Zs) very high. This prevents enough current from flowing to trip an MCB within the required time, necessitating a sensitive RCD."
  },
  {
    "id": 4033,
    "question": "Which component of an ADS system is specifically designed to prevent a dangerous touch voltage between simultaneous accessible exposed-conductive-parts and extraneous-conductive-parts?",
    "options": [
      "Main protective bonding conductors",
      "The circuit miniature circuit breaker (MCB)",
      "The supplier's service fuse",
      "The metallic conduit protecting the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Main protective bonding connects extraneous-conductive-parts (like gas or water pipes) to the Main Earthing Terminal, ensuring they stay at the same potential as exposed-conductive-parts during a fault, reducing touch voltage."
  },
  {
    "id": 4034,
    "question": "What is the primary characteristic of a TN-C-S (PME) earthing system at the intake position?",
    "options": [
      "The supply neutral and earth are combined into a single conductor (CNE)",
      "The consumer must provide their own earth electrode for the main earth",
      "The earth is provided by a separate continuous conductor from the substation",
      "The system uses a transformer with no connection to the mass of earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a TN-C-S system, the 'C' stands for Combined. The supplier provides a single conductor that serves as both Neutral and Earth (CNE) up to the consumer's intake."
  },
  {
    "id": 4035,
    "question": "An electrician is installing a new 32A ring final circuit in a domestic dwelling. According to BS 7671, what is the maximum disconnection time permitted for ADS on this circuit?",
    "options": [
      "0.4 seconds",
      "0.2 seconds",
      "5.0 seconds",
      "1.0 second"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "For final circuits not exceeding 32A in a 230V AC system, the maximum disconnection time under fault conditions is 0.4 seconds."
  },
  {
    "id": 4036,
    "question": "When testing a 30mA RCD used for additional protection, what is the maximum permitted trip time when tested at 5 times its rated residual operating current (5 x IΔn)?",
    "options": [
      "40 ms",
      "200 ms",
      "300 ms",
      "400 ms"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "WRONG_UNITS",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "application",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "For an RCD to provide additional protection, it must trip within 40 milliseconds when tested at 5 times its rated current (150mA for a 30mA device)."
  },
  {
    "id": 4037,
    "question": "Which of the following is classified as an 'exposed-conductive-part' that must be connected to the protective earthing conductor?",
    "options": [
      "The metal casing of a distribution board",
      "A copper water pipe entering the building",
      "The steel frame of the building structure",
      "A plastic conduit containing insulated cables"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "An exposed-conductive-part is metalwork of electrical equipment (like a DB casing) that can be touched and may become live under fault conditions. Water pipes are extraneous-conductive-parts."
  },
  {
    "id": 4038,
    "question": "In a TN-S system, if the supply cable's lead sheath is damaged and disconnected, what is the most likely outcome during an earth fault on a final circuit?",
    "options": [
      "The circuit protective device will not trip because the fault path is broken",
      "The circuit will continue to function normally with no safety risk",
      "The RCD will trip faster due to the increased resistance",
      "The voltage on the neutral conductor will rise to 400V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a TN-S system, the sheath is the return path for fault current. If broken, the Earth Fault Loop Impedance (Zs) becomes effectively infinite, preventing enough current from flowing to operate the overcurrent device."
  },
  {
    "id": 4039,
    "question": "What is the primary purpose of the 'Circuit Protective Conductor' (CPC) in an electrical installation?",
    "options": [
      "To provide a low-resistance path for fault current to ensure ADS operates",
      "To carry the normal return current back to the neutral bar",
      "To connect the metal gas pipe to the main earthing terminal",
      "To prevent the occurrence of any electrical faults in the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The CPC connects the exposed-conductive-parts of a circuit to the earthing system, providing the path for fault current that allows the protective device to trip (ADS)."
  },
  {
    "id": 4040,
    "question": "A technician is inspecting a TN-C-S installation. They notice the 'Earth' and 'Neutral' are connected together at a single link before the meter. This specific point of connection is known as the:",
    "options": [
      "PME (Protective Multiple Earthing) terminal",
      "Main Earthing Terminal (MET)",
      "Circuit Protective Conductor (CPC)",
      "Residual Current Device (RCD)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a TN-C-S system, the connection where the supplier's neutral is used as the earth is the PME terminal. The MET is usually the consumer's side of this connection."
  },
  {
    "id": 4041,
    "question": "Which earthing system uses the metal sheath or armor of the supplier's incoming cable as the dedicated return path for fault current to the transformer star point?",
    "options": [
      "TN-S",
      "TN-C-S",
      "TT",
      "PME"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a TN-S (Terre-Neutral Separate) system, the supplier provides a separate earth connection, usually via the lead sheath or armor of the service cable, which remains separate from the neutral throughout."
  },
  {
    "id": 4042,
    "question": "In a TT earthing system, what is the primary reason that a Residual Current Device (RCD) is usually required to achieve Automatic Disconnection of Supply (ADS)?",
    "options": [
      "The high resistance of the earth electrode limits fault current, preventing MCBs from tripping quickly",
      "TT systems do not have a neutral connection, so MCBs cannot function",
      "The earth rod acts as a fuse and needs an RCD to reset it",
      "RCDs are required by law to replace all circuit breakers in rural areas"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "conceptual",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In TT systems, the earth return path is through the ground (soil). The resistance of the earth electrode is much higher than a metallic path, often resulting in fault currents too low to operate an overcurrent device (MCB/Fuse) within the required time."
  },
  {
    "id": 4043,
    "question": "An electrician is inspecting a service head and notices a single conductor entering the property, which is then split into a neutral block and an earth block at the cutout. Which earthing system is being described?",
    "options": [
      "TN-C-S",
      "TN-S",
      "TT",
      "IT"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "TN-C-S (often called PME) uses a combined neutral and earth (PEN) conductor in the supply, which is separated into distinct neutral and earth terminals at the consumer's intake."
  },
  {
    "id": 4044,
    "question": "Which component of an ADS system is specifically designed to disconnect the supply when it detects a leakage current to earth that exceeds a pre-set threshold, such as 30mA?",
    "options": [
      "Residual Current Device (RCD)",
      "Miniature Circuit Breaker (MCB)",
      "High Breaking Capacity (HBC) Fuse",
      "Main Isolator Switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "An RCD monitors the balance between line and neutral currents. If a difference (residual current) is detected, usually due to a fault to earth, it trips to disconnect the supply."
  },
  {
    "id": 4045,
    "question": "What is the primary purpose of 'Main Protective Bonding' in a domestic installation?",
    "options": [
      "To maintain an equal potential between touchable metal parts and the MET during a fault",
      "To provide a low-resistance path for the circuit's load current to return to the source",
      "To increase the resistance of the earth loop to prevent short circuits",
      "To allow the gas and water pipes to be used as the primary earth electrode"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Main protective bonding connects extraneous-conductive-parts (like metal pipes) to the Main Earthing Terminal (MET) to ensure that, under fault conditions, all metalwork is at substantially the same voltage, reducing the risk of electric shock."
  },
  {
    "id": 4046,
    "question": "When a fault occurs between a line conductor and the metal casing of an appliance, which part of the system is intended to carry the fault current back to the consumer unit?",
    "options": [
      "The Circuit Protective Conductor (CPC)",
      "The Neutral conductor",
      "The Main Bonding conductor",
      "The Plastic conduit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The CPC (Circuit Protective Conductor) is the specific conductor provided to connect the exposed-conductive-parts of equipment to the earthing terminal for safety."
  },
  {
    "id": 4047,
    "question": "A technician is testing a circuit protected by a 32A Type B MCB. For the MCB to provide 'instantaneous' disconnection during a fault to earth, the fault current must be at least:",
    "options": [
      "160A",
      "32A",
      "96A",
      "5A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "MULTIPLIED_INSTEAD",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Type B MCBs are designed to trip between 3 and 5 times their rated current (In). For a 32A breaker, the minimum current for instantaneous trip is 32 x 5 = 160A."
  },
  {
    "id": 4048,
    "question": "In the context of earthing systems, what does the letter 'T' stand for when it is the first letter in a code like 'TN-S'?",
    "options": [
      "Terre (Earth connection to the source)",
      "Transformer (The type of supply)",
      "Total (The sum of all resistances)",
      "Terminal (The end of the circuit)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The first letter 'T' (from the French 'Terre') indicates that the source of energy is directly connected to Earth."
  },
  {
    "id": 4049,
    "question": "Why is it dangerous if the 'PEN' conductor in a PME (TN-C-S) system becomes broken or disconnected outside the property?",
    "options": [
      "The metalwork of the installation could become live at mains voltage",
      "The RCD will trip every time a light is switched on",
      "The electricity meter will run backwards",
      "The voltage in the house will double to 460V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "SIGN_ERROR"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a TN-C-S system, the earth and neutral are combined in the supply. If this conductor breaks, any current attempting to return to the source via the neutral will instead pass through the bonding and earthing conductors, potentially making all earthed metalwork live."
  },
  {
    "id": 4050,
    "question": "Which of the following is an 'extraneous-conductive-part' that would typically require main protective bonding?",
    "options": [
      "A copper water-service pipe entering the building",
      "The metal casing of a toaster",
      "A steel conduit containing circuit wires",
      "The metal consumer unit enclosure"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "ADS Components",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An extraneous-conductive-part is something that does not form part of the electrical installation but may introduce a potential (usually Earth potential), such as gas or water pipes. The other options are 'exposed-conductive-parts'."
  },
  {
    "id": 4051,
    "question": "Which earthing system is characterized by having a single conductor that serves as both the Neutral and the Earth from the substation to the consumer's premises, where it is then split into separate Neutral and Earth terminals at the intake?",
    "options": [
      "TN-C-S",
      "TN-S",
      "TT",
      "IT"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Earthing Systems",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "TN-C-S stands for Terre-Neutral-Combined-Separate. The 'Combined' part refers to the PEN (Protective Earth and Neutral) conductor used by the distributor, which is then 'Separated' at the consumer unit."
  },
  {
    "id": 4052,
    "question": "In a TT earthing system, why is an RCD (Residual Current Device) generally required to achieve Automatic Disconnection of Supply (ADS) for power circuits?",
    "options": [
      "The earth fault loop impedance is usually too high for circuit breakers to trip within required times",
      "The supply transformer is not connected to earth, requiring a leakage detector",
      "TT systems only use DC current which does not trigger standard MCBs",
      "The RCD is needed to balance the voltage between the neutral and the earth electrode"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "ADS Components",
    "category": "ADS Components",
    "tags": [
      "explanation",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In TT systems, the earth return path is through the ground (soil), which has high resistance. This results in a high Zs, meaning fault current is often too low to trip an MCB quickly, necessitating a sensitive RCD."
  },
  {
    "id": 4053,
    "question": "An electrician is testing a new circuit in a domestic property with a TN-S earthing system. If they find the earth fault loop impedance (Zs) is much higher than the calculated value, which component of the ADS path is most likely to have a loose connection?",
    "options": [
      "The Circuit Protective Conductor (CPC)",
      "The Main Switch of the consumer unit",
      "The Neutral tail from the meter",
      "The incoming Phase conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "ADS Components",
    "category": "ADS Components",
    "tags": [
      "application",
      "calculation",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Zs (Earth Fault Loop Impedance) includes the path through the CPC. A loose connection in the CPC would increase the resistance of the fault loop significantly."
  },
  {
    "id": 4054,
    "question": "Which specific component is defined as the conductor that connects the Main Earthing Terminal (MET) of an installation to the electricity distributor's means of earthing or to an earth electrode?",
    "options": [
      "Earthing Conductor",
      "Circuit Protective Conductor",
      "Main Protective Bonding Conductor",
      "Supplementary Bonding Conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Earthing Systems",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Earthing Conductor is the specific link between the installation's MET and the external earth source. CPCs are internal to circuits, and bonding conductors connect to extraneous conductive parts."
  },
  {
    "id": 4055,
    "question": "In the classification of earthing systems, what does the second letter 'T' in 'TN-T' (often referred to as TT) signify regarding the installation's arrangement?",
    "options": [
      "The exposed conductive parts are connected directly to Earth via an electrode",
      "The Neutral and Earth are connected together at the consumer unit",
      "The system is only suitable for Temporary installations",
      "The supply comes from a Transformer with no earth connection"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TRANSFORMER_WITH_AC_DC"
    },
    "section": "Earthing Systems",
    "category": "Earthing Systems",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The first letter refers to the source (T = Terre/Earth), and the second letter refers to the installation's exposed conductive parts (T = Terre/Earth, meaning they have their own direct connection to the ground)."
  },
  {
    "id": 4056,
    "question": "In a TN-S earthing system, which statement correctly describes the arrangement of the neutral and protective conductors throughout the distribution and installation?",
    "options": [
      "The neutral and protective conductors are separate throughout the entire system from the transformer to the installation",
      "The neutral and protective functions are combined in a single PEN conductor up to the consumer's intake",
      "The installation relies on a local earth electrode as the sole means of returning fault current to the source",
      "The protective conductor is connected to the neutral at every distribution board within the installation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In a TN-S (Terre-Neutral-Separate) system, the neutral and earth conductors are separate throughout the entire network, including the distributor's cables."
  },
  {
    "id": 4057,
    "question": "An electrician is testing a circuit protected by a 32A Type B BS EN 60898 circuit breaker. The measured Earth Fault Loop Impedance (Zs) is 1.52 Ω. If the maximum permitted Zs for this device to achieve ADS within 0.4s is 1.37 Ω, what is the immediate technical implication?",
    "options": [
      "The magnetic trip element may not operate fast enough to meet the required disconnection time",
      "The thermal trip element will operate instantly to protect against the earth fault",
      "The circuit breaker will provide discrimination against upstream RCDs",
      "The residual current will be too low to be detected by the circuit breaker"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "calculation",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "If Zs exceeds the maximum value, the fault current will be too low to trigger the 'instantaneous' magnetic trip of the breaker, leading to a slow thermal disconnection that exceeds the 0.4s limit."
  },
  {
    "id": 4058,
    "question": "Which component is mandatory for providing Automatic Disconnection of Supply (ADS) in a TT earthing system where the earth fault loop impedance is too high for overcurrent devices?",
    "options": [
      "A residual current device (RCD)",
      "A main earthing terminal (MET)",
      "A high-breaking capacity (HBC) fuse",
      "A double-pole circuit breaker"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "application",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In TT systems, the resistance of the earth electrode (Ra) is usually so high that fault current cannot trip a fuse or MCB. An RCD is used to detect small leakage currents and provide rapid disconnection."
  },
  {
    "id": 4059,
    "question": "A TN-C-S (PME) system is being installed. What is the primary safety risk associated with a 'broken PEN conductor' in the supplier's network?",
    "options": [
      "Exposed conductive parts in the installation may rise to line voltage relative to earth",
      "The circuit breaker will trip immediately due to the loss of the neutral path",
      "The RCD will fail to operate because there is no path for residual current",
      "The resistance of the circuit conductors will increase due to thermal expansion"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "conceptual",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "In a PME system, if the combined PEN conductor breaks, the earth terminal in the house is no longer connected to the transformer star point, and load current can cause the earthing system (and metalwork) to rise to line voltage."
  },
  {
    "id": 4060,
    "question": "When comparing earthing systems, which characteristic is unique to a TN-C-S (PME) supply compared to a TN-S supply?",
    "options": [
      "The use of a combined neutral and earth conductor in the distributor's network",
      "The requirement for a local earth electrode at the consumer's property",
      "The separation of neutral and earth at the supply transformer only",
      "The reliance on the lead sheath of the cable for the protective path"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "discrimination",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "TN-C-S uses a combined (C) neutral and earth in the supply network, which is then separated (S) at the intake. TN-S keeps them separate throughout."
  },
  {
    "id": 4061,
    "question": "An electrician is selecting a circuit breaker for a motor with a high inductive starting current. Why would a 'Type C' breaker be selected over a 'Type B'?",
    "options": [
      "It has a higher threshold for instantaneous magnetic tripping to prevent nuisance operation",
      "It provides a faster thermal response to protect the motor windings from overheating",
      "It is designed to operate at lower voltages common in industrial settings",
      "It has a lower breaking capacity (Icn) making it safer for domestic use"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "UNITS_MISSING"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "discrimination",
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Type C breakers trip at 5 to 10 times their rated current, whereas Type B trip at 3 to 5 times. This allows for the high inrush current of motors without tripping the breaker."
  },
  {
    "id": 4062,
    "question": "In the Earth Fault Loop Impedance formula Zs = Ze + (R1 + R2), what does the 'R2' component specifically represent?",
    "options": [
      "The resistance of the circuit protective conductor (CPC)",
      "The resistance of the line conductor from the consumer unit to the load",
      "The external earth fault loop impedance provided by the DNO",
      "The resistance of the main protective bonding conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "calculation",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In the standard formula, R1 is the line conductor resistance and R2 is the circuit protective conductor (CPC) resistance."
  },
  {
    "id": 4063,
    "question": "A new sub-main is being installed to a detached garage. The supply is TN-C-S. Why might the designer choose to 'TT the garage' by installing a local earth electrode and an RCD rather than exporting the PME earth?",
    "options": [
      "To eliminate the risk of diverted neutral currents and potential differences on metalwork",
      "To reduce the total cost by avoiding the use of a larger CPC in the sub-main cable",
      "Because an RCD cannot function correctly if a PME earth terminal is present",
      "Because TN-C-S systems are not permitted to supply outdoor buildings"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "application",
      "conceptual",
      "legislation"
    ],
    "learningOutcomeId": "203.LO4.AC4.1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Exporting a PME earth to a separate building can be dangerous if there are extraneous conductive parts (like water pipes) or if the PEN conductor breaks. 'TT-ing' the outbuilding provides a local, independent earth reference."
  },
  {
    "id": 4064,
    "question": "What is the primary function of Main Protective Bonding within the ADS strategy?",
    "options": [
      "To create an equipotential zone that reduces touch voltages during a fault",
      "To provide a low-resistance path for fault current to return to the transformer",
      "To ensure that all circuit breakers trip within the required 0.4s or 5s limit",
      "To detect small leakage currents and disconnect the supply automatically"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Main protective bonding connects extraneous conductive parts to the MET, ensuring that during a fault, all accessible metalwork rises to a similar potential, minimizing shock risk (touch voltage)."
  },
  {
    "id": 4065,
    "question": "Which of these is a defining characteristic of an ADS (Automatic Disconnection of Supply) component used for 'Additional Protection' in a domestic kitchen?",
    "options": [
      "A 30mA RCD that operates within 40ms at a test current of 5 x IΔn",
      "A Type B circuit breaker with a breaking capacity of at least 6kA",
      "A main earthing terminal with a resistance to earth of less than 0.05 Ω",
      "A BS 1362 fuse found within a switched fused connection unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "UNITS_MISSING",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Earthing Systems and ADS Components",
    "tags": [
      "discrimination",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203.LO4.AC4.2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "'Additional Protection' specifically refers to the use of a 30mA RCD to protect users where basic and fault protection might be insufficient or fail."
  }
];
