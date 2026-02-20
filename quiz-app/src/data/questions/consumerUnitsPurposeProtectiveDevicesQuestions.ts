import { TaggedQuestion } from './types';

/**
 * Consumer Units: Purpose + Protective Devices Question Bank
 * Aligned with lesson 203-10B learning outcomes
 * Generated: 2026-02-20
 */

export const consumerUnitsPurposeProtectiveDevicesQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary function of a consumer unit in a domestic electrical installation?",
    "options": [
      "To distribute electricity to final circuits and provide protection",
      "To transform the incoming voltage from 400V to 230V",
      "To convert alternating current (AC) into direct current (DC)",
      "To generate electricity for the property during power cuts"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_AC_WITH_DC",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "terminology",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A consumer unit acts as the distribution point for a property, splitting the main supply into individual final circuits and housing protective devices."
  },
  {
    "id": 4017,
    "question": "Which device provides protection against both overcurrent (overload/short-circuit) and earth leakage in a single unit?",
    "options": [
      "RCBO (BS EN 61009)",
      "MCB (BS EN 60898)",
      "RCD (BS EN 61008)",
      "Rewireable Fuse (BS 3036)"
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
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent protection) combines the functions of an MCB and an RCD into one device."
  },
  {
    "id": 4018,
    "question": "An RCD (Residual Current Device) is designed to trip when it detects which of the following?",
    "options": [
      "An imbalance between the line and neutral currents",
      "An increase in the supply frequency",
      "A slow overload of current over several hours",
      "A short-circuit between line and neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "current-rule"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "RCDs monitor the balance between line and neutral; any difference indicates current leaking to earth, which could cause a shock."
  },
  {
    "id": 4019,
    "question": "Which type of MCB (BS EN 60898) is most commonly used for standard domestic lighting and socket circuits?",
    "options": [
      "Type B",
      "Type C",
      "Type D",
      "Type S"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Type B MCBs are the standard choice for domestic installations as they trip at lower levels of inrush current compared to Type C or D."
  },
  {
    "id": 4020,
    "question": "What is the primary disadvantage of a BS 3036 rewireable fuse compared to a modern MCB?",
    "options": [
      "It is less accurate and takes longer to disconnect under fault conditions",
      "It cannot be used on alternating current (AC) circuits",
      "It only protects against earth leakage and not overloads",
      "It is much more expensive to maintain over time"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Rewireable fuses (BS 3036) are less precise than MCBs and require the cable to be 'derated' because they do not disconnect as quickly or reliably."
  },
  {
    "id": 4021,
    "question": "Why might an electrician choose a Type C MCB for a workshop circuit containing several small motors?",
    "options": [
      "To prevent nuisance tripping caused by high starting (inrush) currents",
      "To provide faster disconnection in the event of an earth fault",
      "Because Type C devices are cheaper than Type B devices",
      "To allow more current to flow than the cable is rated for"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type C breakers are designed to handle the temporary high current 'surges' or inrush currents that occur when motors or fluorescent lights start up."
  },
  {
    "id": 4022,
    "question": "A fault where the live conductor accidentally touches the neutral conductor is known as a:",
    "options": [
      "Short-circuit",
      "Overload",
      "Residual current fault",
      "Open circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A short-circuit occurs when current travels along an unintended path of low resistance between live conductors (Line to Neutral or Line to Line)."
  },
  {
    "id": 4023,
    "question": "In a consumer unit, what is the specific purpose of the 'Main Switch'?",
    "options": [
      "To provide a means of isolating the entire installation from the supply",
      "To protect individual circuits from earth leakage",
      "To automatically trip if a light bulb blows",
      "To increase the efficiency of the electrical system"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Main Switch is a functional isolator that allows the user to turn off the power to the whole consumer unit for safety or maintenance."
  },
  {
    "id": 4024,
    "question": "An electrician is wiring a new kitchen. If they want to ensure that a fault on the oven circuit does not trip the RCD for the whole house, they should use:",
    "options": [
      "An individual RCBO for the oven circuit",
      "A larger BS 3036 rewireable fuse",
      "A Type D MCB for the oven circuit",
      "Two RCDs connected in series"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "USED_SERIES_RULE"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using an RCBO provides independent protection for that circuit, ensuring other circuits remain powered if a leakage fault occurs on the oven."
  },
  {
    "id": 4025,
    "question": "Which of these is a correct description of an 'overload' condition?",
    "options": [
      "Too many appliances connected to a circuit, exceeding its rated capacity",
      "A direct connection between the line conductor and the earth wire",
      "A spike in voltage caused by a nearby lightning strike",
      "Current leaking through damp insulation to the building structure"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An overload occurs when the intended load on a healthy circuit is greater than the circuit was designed to carry, causing the cable to heat up."
  },
  {
    "id": 4026,
    "question": "What is the primary purpose of a consumer unit in a domestic electrical installation?",
    "options": [
      "To distribute electricity to final circuits and provide protection",
      "To generate electricity for use within the property",
      "To convert the incoming AC supply into DC for appliances",
      "To increase the supply voltage for high-power circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A consumer unit acts as the distribution point for an installation, splitting the main supply into final circuits and housing protective devices like MCBs and RCDs."
  },
  {
    "id": 4027,
    "question": "Which protective device is specifically designed to detect earth leakage and reduce the risk of electric shock?",
    "options": [
      "RCD (BS EN 61008)",
      "MCB (BS EN 60898)",
      "BS 3036 Rewireable fuse",
      "Main switch isolator"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An RCD (Residual Current Device) monitors the balance between live and neutral currents; if an imbalance (leakage) is detected, it trips to prevent electric shock."
  },
  {
    "id": 4028,
    "question": "Which type of MCB is standard for domestic installations where there are no high inrush currents?",
    "options": [
      "Type B",
      "Type C",
      "Type D",
      "Type S"
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
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Type B MCBs are the most sensitive to inrush currents and are the standard choice for domestic lighting and socket circuits."
  },
  {
    "id": 4029,
    "question": "What two functions are combined into a single RCBO (BS EN 61009) device?",
    "options": [
      "Overcurrent protection and residual current protection",
      "Isolation and voltage transformation",
      "Short-circuit protection and surge protection",
      "AC to DC conversion and circuit distribution"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent protection) combines the features of an MCB and an RCD into one unit."
  },
  {
    "id": 4030,
    "question": "A fuse trips because too many high-power appliances are being used at the same time on one circuit. What type of fault is this?",
    "options": [
      "Overload",
      "Earth leakage",
      "Short-circuit",
      "Residual current"
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
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An overload occurs when the current drawn by the load exceeds the rated capacity of the circuit cable for a sustained period."
  },
  {
    "id": 4031,
    "question": "What is the primary purpose of a consumer unit within a domestic electrical installation?",
    "options": [
      "To distribute electricity to final circuits and provide protection and isolation",
      "To convert the incoming AC supply into DC for household appliances",
      "To step down the voltage from 400V to 230V for domestic use",
      "To measure the total energy consumption of the property for billing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Consumer Units",
    "category": "Terminology",
    "tags": [
      "explanation",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A consumer unit (or distribution board) is designed to split the main incoming supply into individual final circuits, providing a means of isolation and overcurrent/leakage protection for each."
  },
  {
    "id": 4032,
    "question": "Which protective device provides integrated protection against both overcurrent (overload/short-circuit) and residual current (earth leakage)?",
    "options": [
      "RCBO (BS EN 61009)",
      "RCD (BS EN 61008)",
      "MCB (BS EN 60898)",
      "BS 3036 Rewireable fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Protective Devices",
    "category": "Discrimination",
    "tags": [
      "discrimination",
      "units",
      "application"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent protection) combines the functions of an MCB and an RCD into a single device."
  },
  {
    "id": 4033,
    "question": "An electrician is installing a circuit for a small workshop motor that experiences high inrush currents upon starting. Which MCB 'Type' is most suitable to prevent nuisance tripping?",
    "options": [
      "Type C",
      "Type B",
      "Type D",
      "Type A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Protective Devices",
    "category": "Application",
    "tags": [
      "application",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Type C MCBs are designed for circuits with higher inductive loads and inrush currents, such as small motors or fluorescent lighting, whereas Type B is for standard domestic resistive loads."
  },
  {
    "id": 4034,
    "question": "What specific fault condition is a BS EN 61008 RCD designed to detect?",
    "options": [
      "An imbalance between the line and neutral currents",
      "A sustained thermal overload on a cable",
      "A high-magnitude short-circuit between line and neutral",
      "A sudden drop in the supply frequency"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_FREQUENCY_WITH_CURRENT"
    },
    "section": "Protective Devices",
    "category": "Conceptual",
    "tags": [
      "conceptual",
      "explanation",
      "units"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "RCDs monitor the balance between line and neutral. If they are not equal, it indicates current is leaking to earth (residual current), and the device trips."
  },
  {
    "id": 4035,
    "question": "Which of the following describes a key characteristic of a BS 3036 semi-enclosed fuse?",
    "options": [
      "It uses a replaceable wire that melts during an overcurrent event",
      "It is a resettable electromagnetic device",
      "It provides automatic protection against earth leakage",
      "It is a high-breaking capacity cartridge fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Protective Devices",
    "category": "Discrimination",
    "tags": [
      "discrimination",
      "terminology",
      "units"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "BS 3036 refers to rewireable fuses where a specific gauge of fuse wire is manually installed into a carrier."
  },
  {
    "id": 4036,
    "question": "A homeowner reports that a fault on a single socket causes the 'Main RCD' to trip, turning off all power to the house. Why is this considered poor circuit discrimination?",
    "options": [
      "A single fault causes the loss of all healthy circuits",
      "The RCD is not sensitive enough to detect the fault",
      "The MCBs are tripping slower than the RCD",
      "The socket circuit should not be protected by an RCD"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Consumer Units",
    "category": "Application",
    "tags": [
      "application",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Good discrimination (selectivity) ensures only the protective device closest to the fault operates, preventing the unnecessary disconnection of healthy circuits."
  },
  {
    "id": 4037,
    "question": "When comparing a BS 88 cartridge fuse to a BS 3036 rewireable fuse, what is a primary technical advantage of the BS 88?",
    "options": [
      "It has a more accurate and consistent tripping characteristic",
      "It can be easily repaired by the homeowner with copper wire",
      "It provides built-in protection against electric shock",
      "It is significantly cheaper to replace after every fault"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Protective Devices",
    "category": "Conceptual",
    "tags": [
      "conceptual",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "BS 88 cartridge fuses are manufactured to tight tolerances, providing much more reliable and consistent overcurrent protection than rewireable fuses."
  },
  {
    "id": 4038,
    "question": "Which type of MCB (BS EN 60898) would typically be selected for a standard domestic ring final circuit supplying general-purpose socket outlets?",
    "options": [
      "Type B",
      "Type C",
      "Type D",
      "Type S"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Protective Devices",
    "category": "Discrimination",
    "tags": [
      "discrimination",
      "application",
      "units"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type B MCBs are the standard choice for domestic installations where high inrush currents are not expected."
  },
  {
    "id": 4039,
    "question": "In the context of a consumer unit, what is the definition of a 'final circuit'?",
    "options": [
      "A circuit connected directly to current-using equipment or socket outlets",
      "The main cable connecting the supplier's fuse to the consumer unit",
      "The circuit used to interconnect two different consumer units",
      "The earthing conductor connecting the MET to the earth electrode"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Consumer Units",
    "category": "Conceptual",
    "tags": [
      "conceptual",
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A final circuit is the end of the distribution chain that supplies power directly to the loads (lights, heaters, sockets)."
  },
  {
    "id": 4040,
    "question": "An electrician is replacing an old consumer unit. They find a circuit that supplies a large industrial transformer with extremely high magnetic inrush. Which MCB type is specifically designed for this scenario?",
    "options": [
      "Type D",
      "Type B",
      "Type C",
      "Type A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Protective Devices",
    "category": "Application",
    "tags": [
      "application",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Type D MCBs are designed for very high inrush currents, typically 10-20 times the rated current, found in large transformers or X-ray machines."
  },
  {
    "id": 4041,
    "question": "What is the primary function of a consumer unit within a domestic electrical installation?",
    "options": [
      "To provide a central point for circuit distribution, isolation, and protection",
      "To convert the incoming AC supply into a stable DC voltage for appliances",
      "To increase the supply voltage to ensure it reaches the furthest socket",
      "To store electrical energy for use during a power cut or supply failure"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A consumer unit acts as the 'hub' of the installation, splitting the main supply into individual final circuits while providing means of isolation and overcurrent/leakage protection."
  },
  {
    "id": 4042,
    "question": "An electrician is installing a new circuit for a domestic ring final. Which type of MCB to BS EN 60898 is most appropriate for standard resistive loads and general socket use?",
    "options": [
      "Type B",
      "Type C",
      "Type D",
      "Type S"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "application",
      "ohms-law"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type B MCBs are designed to trip between 3 and 5 times their rated current, making them suitable for domestic settings where high inrush currents are unlikely."
  },
  {
    "id": 4043,
    "question": "Which specific protective device provides protection against earth leakage (residual current) but does NOT provide protection against overloads or short-circuits?",
    "options": [
      "RCD to BS EN 61008",
      "RCBO to BS EN 61009",
      "MCB to BS EN 60898",
      "BS88-2 Cartridge Fuse"
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
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "A standard RCD (BS EN 61008) only monitors the balance between Line and Neutral; it does not have a thermal or magnetic trip for overcurrent. An RCBO combines both."
  },
  {
    "id": 4044,
    "question": "A homeowner complains that a single fault on a kitchen appliance causes the entire house's power to go off. This is most likely because the consumer unit uses:",
    "options": [
      "A single front-end RCD protecting all circuits",
      "Individual RCBOs for every final circuit",
      "Type B MCBs instead of Type C MCBs",
      "BS3036 rewireable fuses in a split-load board"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "application",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "A single 'front-end' RCD lacks discrimination; a fault on any one circuit will trip the RCD and disconnect the supply to all other circuits it protects."
  },
  {
    "id": 4045,
    "question": "What is the primary difference between an 'overload' and a 'short-circuit'?",
    "options": [
      "Overload is a small excess current over time; short-circuit is a high-magnitude fault current",
      "Overload is a fault to earth; short-circuit is a fault between live conductors",
      "Overload only occurs in motors; short-circuit only occurs in lighting cables",
      "Overload requires an RCD; short-circuit requires a BS3036 fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "An overload is an overcurrent occurring in a circuit which is electrically sound (too many appliances), whereas a short-circuit is a fault of negligible impedance between conductors."
  },
  {
    "id": 4046,
    "question": "When installing a circuit for a workshop air compressor that has a significant startup current, which MCB type would be most suitable to prevent nuisance tripping?",
    "options": [
      "Type C",
      "Type B",
      "Type A",
      "Type 1"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Type C MCBs are designed for circuits with higher inductive loads/inrush currents, tripping at 5 to 10 times the rated current."
  },
  {
    "id": 4047,
    "question": "Which of the following describes the operation of a BS3036 semi-enclosed fuse?",
    "options": [
      "A sacrificial element of tinned copper wire melts when excessive current flows",
      "An electromagnet pulls a mechanical trigger when it detects earth leakage",
      "A bimetallic strip bends to open contacts during a short-circuit",
      "A chemical reaction inside a sealed cartridge breaks the circuit"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "BS3036 fuses are 'rewireable' fuses where a specific gauge of wire is used as the link; it melts (blows) when the current exceeds its capacity."
  },
  {
    "id": 4048,
    "question": "A 'final circuit' in a domestic installation is best defined as a circuit that:",
    "options": [
      "Supplies current directly to current-using equipment or socket outlets",
      "Connects the electricity meter to the main consumer unit",
      "Links the transformer in the street to the house service head",
      "Is used only for the earthing and bonding of the gas and water pipes"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A final circuit is the end of the distribution chain, feeding the actual lights, heaters, or sockets."
  },
  {
    "id": 4049,
    "question": "An electrician chooses to install RCBOs for every circuit in a new consumer unit. What is the primary benefit of this design compared to a standard split-load RCD board?",
    "options": [
      "Improved circuit independence and continuity of service",
      "Reduced cost of materials and faster installation time",
      "Lower total earth loop impedance (Zs) values for the installation",
      "The ability to use smaller cable sizes for all final circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Because each RCBO provides independent earth leakage and overcurrent protection, a fault on one circuit will not affect any other circuit."
  },
  {
    "id": 4050,
    "question": "Which protective device is most likely to be found in a heavy industrial environment due to its high breaking capacity and reliability?",
    "options": [
      "BS88-2 Cartridge Fuse",
      "BS3036 Rewireable Fuse",
      "Type B MCB to BS EN 60898",
      "Voltage Operated Earth Leakage Circuit Breaker"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "BS88 fuses (high rupture capacity) are preferred in industrial settings because they can safely interrupt very high fault currents without rupturing the casing."
  },
  {
    "id": 4051,
    "question": "An electrician is installing a new circuit for an electric shower. Which device should be selected to provide both overcurrent protection and protection against earth leakage in a single, space-saving unit?",
    "options": [
      "RCBO (BS EN 61009)",
      "RCD (BS EN 61008)",
      "MCB (BS EN 60898)",
      "BS 3036 Rewireable fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "application",
      "discrimination",
      "protective-devices"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent protection) combines the functions of an MCB and an RCD into one device, protecting against overload, short-circuit, and earth leakage."
  },
  {
    "id": 4052,
    "question": "A Type C MCB is specifically designed to handle which of the following scenarios more effectively than a Type B MCB?",
    "options": [
      "Higher levels of transient inrush current from motors or fluorescent lighting",
      "Higher levels of continuous overload current from domestic appliances",
      "Faster disconnection times for low-magnitude earth faults",
      "Detection of very small residual currents leaking to earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "conceptual",
      "discrimination",
      "protective-devices"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Type C MCBs have a higher magnetic trip threshold (5-10 times rated current) compared to Type B (3-5 times), making them suitable for circuits with high inrush currents like motors or large banks of fluorescent lights."
  },
  {
    "id": 4053,
    "question": "In a domestic consumer unit, what is the primary purpose of dividing the installation into multiple final circuits?",
    "options": [
      "To minimize inconvenience by isolating a fault to a single circuit",
      "To increase the total voltage available to each individual appliance",
      "To allow the use of smaller RCDs across the entire distribution board",
      "To ensure that the main switch never needs to be operated during a fault"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "conceptual",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Dividing an installation into final circuits ensures that if a fault occurs on one circuit (e.g., downstairs sockets), only that circuit is disconnected, leaving the rest of the installation (e.g., lighting) operational."
  },
  {
    "id": 4054,
    "question": "An RCD (BS EN 61008) is designed to trip when it detects a current imbalance between which two conductors?",
    "options": [
      "Line and Neutral",
      "Line and Earth",
      "Neutral and Earth",
      "Line and the Circuit Protective Conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "conceptual",
      "application",
      "protective-devices"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An RCD monitors the balance between the Line and Neutral conductors. If the current flowing out on the Line does not equal the current returning on the Neutral, it assumes current is leaking to earth and trips."
  },
  {
    "id": 4055,
    "question": "Which protective device requires the circuit cable's current-carrying capacity to be derated by a factor of 0.72 due to its high fusing factor?",
    "options": [
      "BS 3036 semi-enclosed rewireable fuse",
      "BS 88-2 cartridge fuse",
      "Type B MCB to BS EN 60898",
      "RCBO to BS EN 61009"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "discrimination",
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "BS 3036 rewireable fuses have a fusing factor of approximately 1.8. To ensure cables are protected against long-term small overloads, BS 7671 requires a derating factor of 0.72 to be applied to the cable's current-carrying capacity."
  },
  {
    "id": 4056,
    "question": "An electrician is explaining why an RCD cannot be used as the sole means of protection for a radial circuit. What is the fundamental difference in what a BS EN 61008 RCD and a BS EN 60898 MCB detect?",
    "options": [
      "An RCD detects an imbalance between line and neutral, while an MCB detects excessive current magnitude",
      "An RCD detects short circuits, while an MCB detects earth leakage and overload",
      "An RCD detects high voltage surges, while an MCB detects current fluctuations",
      "An RCD detects overload only, while an MCB detects earth faults and short circuits"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "conceptual",
      "terminology",
      "explanation"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "An RCD (Residual Current Device) monitors the balance of current between the line and neutral conductors. An MCB (Miniature Circuit Breaker) monitors the absolute value of current to protect against overload and short-circuits."
  },
  {
    "id": 4057,
    "question": "A circuit supplying a bank of high-frequency fluorescent luminaires is repeatedly tripping a Type B MCB during the moment of switch-on. Which replacement device would be most appropriate to handle this scenario?",
    "options": [
      "Type C MCB",
      "Type D MCB",
      "BS 3036 semi-enclosed fuse",
      "30mA BS EN 61008 RCD"
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
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Type C MCBs are designed to handle higher inrush currents (5-10 times rated current) common in lighting loads with ballasts, whereas Type B trips at 3-5 times rated current."
  },
  {
    "id": 4058,
    "question": "A homeowner requires a new 9.5kW shower circuit. The consumer unit is full, but the electrician wants to ensure that a fault on this shower does not trip any other circuits. Which device provides both overcurrent and 30mA earth-leakage protection in a single module?",
    "options": [
      "BS EN 61009 RCBO",
      "BS EN 61008 RCD",
      "BS EN 60898 Type B MCB",
      "BS 88-3 Cartridge Fuse"
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
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent protection) combines the functions of an MCB and an RCD into one device, allowing for individual circuit protection."
  },
  {
    "id": 4059,
    "question": "When calculating the required current-carrying capacity for a cable protected by a BS 3036 rewireable fuse, a correction factor of 0.72 is applied. What is the primary reason for this significant derating?",
    "options": [
      "The fuse has a high fusing factor and takes longer to disconnect under overload conditions",
      "The fuse wire is susceptible to environmental corrosion which increases resistance",
      "Rewireable fuses cannot detect short-circuit currents effectively",
      "The fuse carrier generates excessive heat that affects the cable insulation"
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
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "BS 3036 fuses have a high 'fusing factor' (approx 2.0), meaning they allow sustained overloads before blowing. The 0.72 factor ensures the cable is large enough to handle this prolonged heat without damage."
  },
  {
    "id": 4060,
    "question": "In a domestic consumer unit, which component is responsible for distributing the incoming live supply to the line-side terminals of the various MCBs and RCBOs?",
    "options": [
      "The busbar",
      "The main earthing terminal",
      "The neutral bar",
      "The DIN rail"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The busbar is a solid copper bar that distributes the live feed from the main switch to the individual protective devices."
  },
  {
    "id": 4061,
    "question": "A domestic installation uses a single 30mA RCD to protect all socket circuits. A fault on a lawnmower causes the RCD to trip, plunging the entire house into darkness because the lighting was also on that RCD. This is a failure of which installation principle?",
    "options": [
      "Discrimination and circuit separation",
      "Overload coordination",
      "Fault current limitation",
      "Voltage drop compensation"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Installation 2365 Level 2",
    "category": "Consumer Units",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Discrimination (or selectivity) ensures that only the protective device closest to the fault operates, preventing unnecessary disconnection of healthy circuits."
  },
  {
    "id": 4062,
    "question": "Which specific British Standard covers the manufacture and performance requirements of Miniature Circuit Breakers (MCBs) used in domestic consumer units?",
    "options": [
      "BS EN 60898",
      "BS EN 61008",
      "BS EN 61009",
      "BS 7671"
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
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "BS EN 60898 is the standard for MCBs. BS EN 61008 is for RCDs, and BS EN 61009 is for RCBOs."
  },
  {
    "id": 4063,
    "question": "What is the primary internal component of an RCD that enables it to detect a difference between the outgoing line current and the returning neutral current?",
    "options": [
      "A toroidal current transformer",
      "A bimetallic thermal strip",
      "A silver-sand filled cartridge",
      "A variable resistor"
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
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "A toroidal current transformer (search coil) surrounds both line and neutral; if the currents are equal and opposite, no magnetic field is produced. An imbalance induces a current in the coil to trip the device."
  },
  {
    "id": 4064,
    "question": "An electrician is choosing between a BS 88-3 cartridge fuse and a BS 3036 rewireable fuse for a sub-main. What is a technical advantage of the BS 88-3 fuse?",
    "options": [
      "It has a higher breaking capacity (kA rating)",
      "It is cheaper to maintain over a 20-year period",
      "It can be reset without replacing any components",
      "It allows for larger cables to be used for the same load"
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
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "BS 88 fuses have a much higher breaking capacity (often 16kA to 80kA) compared to the 1kA or 2kA typical of BS 3036 fuses."
  },
  {
    "id": 4065,
    "question": "A small domestic workshop has a lathe with a motor that draws a significant starting current. Which MCB type is specifically designed to allow for this 'inrush' without tripping, while still providing overcurrent protection?",
    "options": [
      "Type C",
      "Type B",
      "Type A",
      "Type 1"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Installation 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-10B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Type C MCBs are intended for commercial/industrial applications or domestic workshops with inductive loads like motors, as they trip at 5-10 times their rated current."
  }
];
