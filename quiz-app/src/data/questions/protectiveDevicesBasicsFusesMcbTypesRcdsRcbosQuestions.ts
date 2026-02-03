import { TaggedQuestion } from './types';

/**
 * Protective Devices Basics: Fuses, MCB Types, RCDs, RCBOs Question Bank
 * Aligned with lesson 203-3D learning outcomes
 * Generated: 2026-02-03
 */

export const protectiveDevicesBasicsFusesMcbTypesRcdsRcbosQuestions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary purpose of an Overcurrent Protective Device (OCPD), such as a fuse or MCB?",
    "options": [
      "To protect the circuit cable from damage caused by heat",
      "To provide additional protection against electric shock",
      "To monitor the earth leakage current in the installation",
      "To increase the voltage of the circuit during high demand"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "terminology",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overcurrent protective devices are designed to protect the wiring/cables of a circuit from the thermal effects of overload or short-circuit currents."
  },
  {
    "id": 4017,
    "question": "Which specific device provides both overcurrent protection and earth-leakage protection in a single unit?",
    "options": [
      "RCBO",
      "MCB",
      "RCD",
      "HRC Fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent protection) combines the functions of an MCB and an RCD into one device."
  },
  {
    "id": 4018,
    "question": "What does a Residual Current Device (RCD) detect in order to trip and disconnect the circuit?",
    "options": [
      "An imbalance between the line and neutral currents",
      "A current that exceeds the rated capacity of the cable",
      "A sudden increase in the supply frequency",
      "The melting of a sacrificial metal element"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_CURRENT",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "conceptual",
      "current-rule"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An RCD monitors the balance between line and neutral; if they are not equal, it assumes current is leaking to earth and trips."
  },
  {
    "id": 4019,
    "question": "Which MCB trip curve 'Type' is most commonly used for standard domestic circuits with low inrush currents, such as lighting?",
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
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Type B MCBs are the standard choice for domestic installations where high inrush currents are not expected."
  },
  {
    "id": 4020,
    "question": "An electrician is installing a circuit for a large industrial transformer that has a very high inrush current. Which MCB type is most suitable?",
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
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Type D MCBs are designed to tolerate very high initial inrush currents without nuisance tripping, making them suitable for transformers."
  },
  {
    "id": 4021,
    "question": "What is a characteristic of a fuse compared to an MCB?",
    "options": [
      "It contains a sacrificial element that must be replaced after a fault",
      "It can be easily reset by flipping a switch",
      "It only protects against earth leakage",
      "It is more sensitive to small current imbalances"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Fuses work by melting a metal wire or element when current is too high; once blown, the fuse link must be replaced."
  },
  {
    "id": 4022,
    "question": "A circuit is protected by a standard 32A MCB. If a person touches a live part and 30mA flows through them to earth, why might the MCB NOT trip?",
    "options": [
      "The current is too low to trigger the overcurrent mechanism",
      "The MCB is only designed to detect voltage drops",
      "The MCB is waiting for the neutral current to increase",
      "The current must be alternating current (AC) for an MCB to work"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An MCB protects against high currents (e.g., 32A). A 30mA shock current is far too small to trip an MCB, which is why RCDs are required for shock protection."
  },
  {
    "id": 4023,
    "question": "Which of these is a primary advantage of an MCB over a rewirable fuse?",
    "options": [
      "It can be quickly reset once the fault is cleared",
      "It is significantly cheaper to purchase initially",
      "It does not require an earth connection to function",
      "It can handle much higher voltages than a fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The main operational advantage of Miniature Circuit Breakers (MCBs) is that they are resettable, saving time and maintenance effort."
  },
  {
    "id": 4024,
    "question": "Why would an electrician choose a Type C MCB for a circuit supplying fluorescent lighting?",
    "options": [
      "To avoid nuisance tripping from the moderate inrush current of the ballasts",
      "Because Type C MCBs are safer for domestic use than Type B",
      "To provide faster disconnection in the event of an earth fault",
      "Because Type C devices are required for all lighting circuits by law"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Fluorescent lights have inductive ballasts that create a moderate surge of current when switched on; Type C MCBs are designed to handle this without tripping."
  },
  {
    "id": 4025,
    "question": "In a modern consumer unit, what is the benefit of using individual RCBOs for every circuit rather than a single RCD for the whole board?",
    "options": [
      "An earth fault on one circuit will not disconnect the other healthy circuits",
      "It reduces the total electricity consumption of the building",
      "It allows the use of smaller cables throughout the installation",
      "It prevents the main fuse from blowing during a short circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Using RCBOs ensures 'selectivity' or 'discrimination' regarding earth faults, so a fault in the kitchen won't turn off the lights in the rest of the house."
  },
  {
    "id": 4026,
    "question": "What is the primary purpose of an overcurrent protective device (OCPD), such as an MCB or a fuse?",
    "options": [
      "To protect the circuit cable from damage caused by heat",
      "To provide additional protection against electric shock for the user",
      "To monitor the frequency of the electrical supply",
      "To increase the voltage of the circuit during heavy load"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Overcurrent protective devices like fuses and MCBs are primarily designed to protect the installation's wiring from overheating and fire caused by too much current."
  },
  {
    "id": 4027,
    "question": "An RCD (Residual Current Device) is designed to trip when it detects which of the following conditions?",
    "options": [
      "An imbalance between the line and neutral currents (earth leakage)",
      "A small increase in the circuit's total resistance",
      "A slight drop in the supply frequency",
      "An overload caused by plugging in too many appliances"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "RCDs monitor the balance between line and neutral currents. If they are not equal, it indicates current is leaking to earth, and the device trips to prevent electric shock."
  },
  {
    "id": 4028,
    "question": "Which type of MCB (Miniature Circuit Breaker) is the standard choice for domestic installations with low inrush currents, such as general lighting?",
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
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Type B MCBs are designed to trip at 3 to 5 times their rated current, making them ideal for domestic circuits where high inrush currents are not expected."
  },
  {
    "id": 4029,
    "question": "What two functions are combined into a single protective device known as an RCBO?",
    "options": [
      "Overcurrent protection and earth leakage protection",
      "Overvoltage protection and frequency monitoring",
      "Manual switching and voltage transformation",
      "Short-circuit protection and power factor correction"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_FREQUENCY_WITH_VOLTAGE",
      "2": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent) combines the functions of an MCB (overcurrent) and an RCD (earth leakage) in one unit."
  },
  {
    "id": 4030,
    "question": "Which of these statements correctly describes a key difference between a fuse and an MCB?",
    "options": [
      "A fuse must be replaced after it operates, whereas an MCB can be reset",
      "A fuse only protects against earth leakage, while an MCB only protects against overload",
      "An MCB is a one-time use device that melts, while a fuse uses a mechanical switch",
      "Fuses are only used in industrial settings, while MCBs are only used in homes"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A fuse contains a sacrificial wire that melts and must be replaced; an MCB is an electro-mechanical switch that can be flipped back to the 'on' position after a fault is cleared."
  },
  {
    "id": 4031,
    "question": "What is the primary purpose of a Miniature Circuit Breaker (MCB) within a domestic consumer unit?",
    "options": [
      "To protect the circuit conductors from damage caused by overload or short-circuit",
      "To provide additional protection against electric shock to persons",
      "To detect small amounts of current leaking to earth",
      "To monitor the supply frequency and disconnect if it fluctuates"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_FREQUENCY_WITH_CURRENT"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "terminology",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An MCB is an Overcurrent Protective Device (OCPD). Its role is to protect the installation's wiring from overheating due to overload or high fault currents (short-circuits)."
  },
  {
    "id": 4032,
    "question": "A Type C MCB is specifically designed to be used in which of the following scenarios?",
    "options": [
      "Circuits with moderate inrush currents, such as fluorescent lighting or small motors",
      "Standard domestic circuits with purely resistive loads like electric heaters",
      "Specialist industrial applications with extremely high inrush currents like large transformers",
      "Circuits where the disconnection time must be slowed down to prevent any tripping"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Type C MCBs are designed to handle moderate inductive loads that create a brief 'inrush' of current when switched on, preventing nuisance tripping."
  },
  {
    "id": 4033,
    "question": "An electrician is installing a new circuit for a kitchen. Why might they choose an RCBO instead of a standard MCB?",
    "options": [
      "To provide both overcurrent protection and protection against earth leakage on a single circuit",
      "Because an RCBO is more resistant to high voltages from the grid",
      "To allow the circuit to carry more current than the cable is rated for",
      "Because RCBOs do not require an earth connection to function"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent) combines the functions of an MCB (overload/short-circuit) and an RCD (earth leakage) into one device."
  },
  {
    "id": 4034,
    "question": "Which device operates by constantly monitoring the balance of current between the Line and Neutral conductors?",
    "options": [
      "Residual Current Device (RCD)",
      "Cartridge Fuse (BS 1361)",
      "Type B Miniature Circuit Breaker",
      "Main Isolating Switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An RCD detects an imbalance between the outgoing (Line) and returning (Neutral) current. If they are not equal, it assumes current is leaking to earth and trips."
  },
  {
    "id": 4035,
    "question": "A domestic circuit is protected by a 30mA RCD and a 6A MCB. If the user plugs in too many appliances, causing a steady 15A load, which device is designed to trip?",
    "options": [
      "The 6A MCB only",
      "The 30mA RCD only",
      "Both the MCB and the RCD simultaneously",
      "Neither device, as they only trip on earth faults"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Overload (too much current) is the responsibility of the MCB. A standard RCD does not detect overcurrent; it only detects earth leakage (imbalance)."
  },
  {
    "id": 4036,
    "question": "In an industrial setting, a large motor causes a Type B MCB to trip instantly upon startup. The motor is not faulty. What is the most likely reason?",
    "options": [
      "The motor has a high inrush current that exceeds the Type B magnetic trip threshold",
      "The motor is leaking current to earth during the start-up phase",
      "The Type B MCB is faulty because it should never trip on a motor",
      "The supply voltage is too high for a Type B device"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Type B MCBs trip at 3-5 times their rated current. Large motors can have inrush currents higher than this, requiring a Type C or D device which has a higher magnetic trip threshold."
  },
  {
    "id": 4037,
    "question": "Which of the following describes the operation of a fuse when an overcurrent occurs?",
    "options": [
      "The internal element generates heat and melts, physically breaking the circuit",
      "An electromagnet pulls a set of contacts apart to stop the flow",
      "A bimetallic strip bends due to heat and releases a mechanical latch",
      "The device increases its resistance to reduce the current to a safe level"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Fuses are thermal devices. The sacrificial element is designed to melt when the current exceeds its rating for a specific time, creating an open circuit."
  },
  {
    "id": 4038,
    "question": "A 'Type D' MCB would be most suitable for which of the following applications?",
    "options": [
      "A circuit feeding a large industrial transformer with very high starting currents",
      "A standard domestic lighting circuit using LED bulbs",
      "A ring final circuit in a small office for computers",
      "A circuit where additional protection against electric shock is the only requirement"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "Type D MCBs are used for very high inductive loads (like transformers or X-ray machines) where the inrush current is extremely high."
  },
  {
    "id": 4039,
    "question": "Why is an RCD referred to as 'Additional Protection' in the context of electrical safety?",
    "options": [
      "It provides protection against shock if basic and fault protection fail",
      "It acts as a backup in case the MCB fails to trip on an overload",
      "It is only used when the main earthing conductor is disconnected",
      "It increases the efficiency of the circuit by reducing energy loss"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "RCDs provide additional protection because they can detect very small leakage currents (e.g., 30mA) and disconnect fast enough to prevent a fatal electric shock."
  },
  {
    "id": 4040,
    "question": "An MCB uses two different methods to detect faults. Which part of the MCB reacts specifically to a massive, instantaneous short-circuit current?",
    "options": [
      "The magnetic trip element",
      "The thermal bimetallic strip",
      "The manual reset switch",
      "The arc chute assembly"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "MCBs are 'thermo-magnetic'. The thermal part handles slow overloads, while the magnetic part (a solenoid) handles instant high-current short-circuits."
  },
  {
    "id": 4041,
    "question": "What is the fundamental difference between the protection provided by a standard 32A Type B MCB and a 30mA RCD?",
    "options": [
      "The MCB protects against overcurrent (overload/short-circuit), while the RCD protects against earth leakage.",
      "The RCD protects against short-circuits, while the MCB only protects against slow overloads.",
      "The MCB protects the user from electric shock, while the RCD protects the cable from fire.",
      "The RCD is used for high inrush currents, while the MCB is used for standard domestic lighting."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "An MCB (Miniature Circuit Breaker) is an Overcurrent Protective Device (OCPD) designed to protect cables from overload and short-circuits. An RCD (Residual Current Device) is designed to detect an imbalance between line and neutral (earth leakage) to provide additional protection against shock."
  },
  {
    "id": 4042,
    "question": "A student is comparing three MCBs marked Type B, Type C, and Type D. Which device is specifically designed to handle the highest levels of starting (inrush) current without tripping?",
    "options": [
      "Type D",
      "Type B",
      "Type C",
      "All three types handle the same inrush current but have different voltage ratings"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3D-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "MCB types (B, C, and D) refer to their magnetic trip curves. Type B is for low inrush (domestic), Type C for medium inrush (commercial/inductive), and Type D for very high inrush (industrial transformers/motors)."
  },
  {
    "id": 4043,
    "question": "An electrician installs a new circuit for a large bank of fluorescent lights. During commissioning, a Type B MCB trips every time the lights are switched on, even though the running current is well below the breaker's rating. What is the most appropriate solution?",
    "options": [
      "Replace the Type B MCB with a Type C MCB of the same current rating.",
      "Replace the MCB with a higher current rated Type B MCB.",
      "Install a 30mA RCD in series with the MCB to stabilize the current.",
      "Replace the MCB with a semi-enclosed re-wireable fuse."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Fluorescent lighting has an inductive inrush current. If a Type B MCB trips on startup but the running current is fine, a Type C MCB should be used as it allows for a higher surge before the magnetic trip operates."
  },
  {
    "id": 4044,
    "question": "If a circuit protected only by a 30mA RCD experiences a severe overload of 100A due to too many appliances being used, why might the RCD fail to trip?",
    "options": [
      "RCDs only detect an imbalance between Line and Neutral currents, not the total magnitude of current.",
      "The overload current is too high for the RCD's internal sensors to register.",
      "RCDs are designed to only trip on short-circuits between Line and Neutral.",
      "An RCD requires a fuse to be present in the circuit to trigger its tripping mechanism."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "A standard RCD does not provide overcurrent protection. It only monitors the 'residual' difference between Line and Neutral. If 100A goes out and 100A comes back, the RCD sees no fault, even if the cable is melting."
  },
  {
    "id": 4045,
    "question": "A consumer unit contains an RCBO. Which two protective functions does this single device combine into one unit?",
    "options": [
      "Overcurrent protection (MCB) and residual current protection (RCD).",
      "Short-circuit protection and surge protection against lightning.",
      "Earth leakage protection and voltage stabilization.",
      "Thermal overload protection and physical isolation only."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3D-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent) combines the functions of an MCB and an RCD in a single device, protecting against overload, short-circuit, and earth leakage."
  },
  {
    "id": 4046,
    "question": "An industrial workshop uses heavy machinery with very high magnetic starting currents. Which type of MCB would be most appropriate to prevent 'nuisance tripping' during motor start-up?",
    "options": [
      "Type D",
      "Type B",
      "Type C",
      "A standard 30mA RCD"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Type D MCBs are specifically designed for industrial applications where very high inrush currents occur, such as large motors or transformers, as they have the highest magnetic trip threshold."
  },
  {
    "id": 4047,
    "question": "What is the primary reason a fuse is installed in a domestic plug or at the origin of a circuit?",
    "options": [
      "To protect the cable and flexible cord from overheating due to excessive current.",
      "To prevent the user from receiving an electric shock if they touch a live part.",
      "To ensure the voltage remains at a constant 230V throughout the circuit.",
      "To disconnect the circuit if the frequency of the AC supply fluctuates."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Fuses and MCBs are Overcurrent Protective Devices (OCPDs). Their primary job is to protect the wiring (cables) from damage caused by the heat generated by excessive current (overload or short-circuit)."
  },
  {
    "id": 4048,
    "question": "Which term describes a fault where current flows directly from a Line conductor to an Earth conductor or the metallic casing of an appliance?",
    "options": [
      "Earth fault",
      "Overload",
      "Open circuit",
      "Phase-neutral short circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "An earth fault occurs when current takes an unintended path to earth, often through the protective conductor (CPC) or metallic casing. This is what an RCD is designed to detect."
  },
  {
    "id": 4049,
    "question": "A homeowner reports that their RCD trips whenever they plug in a specific old toaster, even though the toaster appears to heat up normally. What is the most likely cause?",
    "options": [
      "A small amount of current is leaking from the element to the toaster's earthed metal case.",
      "The toaster is drawing slightly more than 13A, causing the RCD to trip on overload.",
      "The toaster has a dead short-circuit between the Line and Neutral pins.",
      "The RCD is faulty because it should only trip if the fuse in the plug blows first."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "If the RCD trips but the device works, it indicates 'earth leakage'. A small amount of current is escaping to the earthed casing, creating an imbalance that the RCD detects. This is not an overload."
  },
  {
    "id": 4050,
    "question": "In a healthy circuit, the current flowing through the Line conductor should be equal to the current returning through the Neutral conductor. If these currents are unequal, which device is designed to detect this and disconnect the supply?",
    "options": [
      "Residual Current Device (RCD)",
      "Miniature Circuit Breaker (MCB)",
      "High Breaking Capacity (HBC) Fuse",
      "Main Isolator Switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An RCD operates on the principle of current balance. It uses a toroid to monitor the sum of currents; if Line and Neutral don't cancel each other out, the 'residual' current triggers the trip mechanism."
  },
  {
    "id": 4051,
    "question": "Which type of Miniature Circuit Breaker (MCB) is specifically designed to handle high inrush currents, such as those found in industrial transformers or specialist X-ray equipment?",
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
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "terminology",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Type D MCBs are designed for very high inrush currents (10-20 times the rated current). Type B is for domestic (3-5 times) and Type C is for commercial/inductive loads (5-10 times)."
  },
  {
    "id": 4052,
    "question": "A circuit is protected solely by a 30mA RCD. If an overload occurs that exceeds the cable's current-carrying capacity by 10 Amps, but no current leaks to earth, why will the RCD fail to protect the cable?",
    "options": [
      "The RCD only detects an imbalance between Line and Neutral currents",
      "The RCD is only designed to trip at currents exactly equal to 30mA",
      "The RCD will only trip if the voltage exceeds 230V",
      "The RCD requires a short-circuit to operate its thermal mechanism"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "discrimination",
      "health-safety"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "An RCD (Residual Current Device) monitors the balance between Line and Neutral. If the current going out equals the current coming back, it stays closed. It does not monitor the total magnitude of current (overload) unless it is a combined RCBO."
  },
  {
    "id": 4053,
    "question": "An electrician is installing a single circuit for a domestic garage that requires both overcurrent protection and protection against electric shock. Which single device provides both functions in one unit?",
    "options": [
      "RCBO",
      "Type B MCB",
      "RCD",
      "BS 3036 Semi-enclosed fuse"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent protection) combines the functions of an MCB (overload/short-circuit) and an RCD (earth leakage) into one device."
  },
  {
    "id": 4054,
    "question": "Inside a standard MCB, there are two distinct tripping mechanisms. Which component is responsible for protecting the circuit against a sustained, low-level overload?",
    "options": [
      "A bimetallic strip that bends when heated",
      "An electromagnetic coil that pulls a plunger",
      "An arc chute that cools the air",
      "A test button that creates a temporary earth fault"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "conceptual",
      "explanation",
      "application"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "MCBs use a bimetallic strip for thermal protection (overload) and an electromagnet for magnetic protection (short-circuit). The bimetallic strip bends as it heats up over time, eventually releasing the trip mechanism."
  },
  {
    "id": 4055,
    "question": "A workshop contains several large fluorescent light fittings with inductive ballasts. Upon startup, a Type B MCB frequently trips, even though the running current is well below the circuit rating. What is the most appropriate action?",
    "options": [
      "Replace the Type B MCB with a Type C MCB of the same rating",
      "Replace the Type B MCB with a higher current-rated Type B MCB",
      "Install an RCD to handle the startup surge",
      "Replace the MCB with a BS 88 fuse to increase the voltage"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices",
    "tags": [
      "application",
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The issue is 'nuisance tripping' due to inrush current. Type C MCBs are designed for inductive loads like fluorescent lighting ballasts because they allow a higher momentary surge before tripping magnetically."
  },
  {
    "id": 4056,
    "question": "An electrician is investigating why a 30mA RCD protecting a kitchen circuit does not trip when the total load current exceeds the circuit's 20A rating by 5A. What is the most likely reason for this?",
    "options": [
      "The RCD only monitors the balance between Line and Neutral and does not provide overload protection.",
      "The RCD requires an earth fault to activate its internal thermal trip mechanism.",
      "The 5A overload is within the standard 20% tolerance of a domestic RCD.",
      "The RCD is a Type AC and can only detect DC leakage currents."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "conceptual",
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "An RCD (Residual Current Device) is designed specifically to detect earth leakage by measuring the imbalance between Line and Neutral. Unless it is an RCBO, it does not have an overcurrent (overload) sensing element."
  },
  {
    "id": 4057,
    "question": "A workshop contains a large industrial transformer that causes a standard Type B MCB to trip immediately upon being switched on, even though the transformer is not faulty. Which device would be the most appropriate replacement?",
    "options": [
      "A Type D MCB, designed for very high inductive inrush currents.",
      "A Type C MCB, as it is the standard for all industrial applications regardless of load.",
      "A 30mA RCD, as the trip is likely caused by a temporary earth leakage.",
      "A higher rated Type B MCB to allow more current to flow during normal operation."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Transformers have high inrush currents. Type D MCBs are specifically designed to tolerate high magnetic inrush (10-20 times rated current) without tripping, whereas Type B would trip at 3-5 times rated current."
  },
  {
    "id": 4058,
    "question": "When comparing an RCBO to a standard RCD, which of the following statements correctly identifies the primary advantage of using an RCBO on a single final circuit?",
    "options": [
      "It provides both overcurrent and earth leakage protection, ensuring a fault only disconnects that specific circuit.",
      "It is more sensitive to earth leakage than a standard RCD, tripping at 15mA instead of 30mA.",
      "It eliminates the need for a Circuit Protective Conductor (CPC) in the installation.",
      "It uses a physical fuse link combined with a mechanical switch for double protection."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "An RCBO (Residual Current Breaker with Overcurrent) combines the functions of an MCB and an RCD. By using one per circuit, a fault on one circuit won't cause the 'nuisance' tripping of other healthy circuits."
  },
  {
    "id": 4059,
    "question": "An MCB utilizes two distinct internal mechanisms to protect a circuit. What is the specific purpose of the magnetic trip element?",
    "options": [
      "To provide near-instantaneous disconnection during a high-magnitude short-circuit fault.",
      "To monitor the temperature of the cable and trip during a sustained small overload.",
      "To detect small imbalances between the Line and Neutral conductors.",
      "To increase the voltage of the circuit during heavy load periods."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The magnetic element in an MCB reacts almost instantly to the very high currents produced by short circuits. The thermal (bimetallic) element is slower and handles overloads."
  },
  {
    "id": 4060,
    "question": "A new domestic lighting installation uses a large number of LED drivers. The electrician finds that the 6A Type B MCB occasionally trips when the lights are all switched on at once. What is the most technically sound solution?",
    "options": [
      "Upgrade to a Type C MCB to better accommodate the cumulative inrush current of the drivers.",
      "Replace the MCB with a 32A fuse to ensure it never trips on startup.",
      "Install an RCD in series with the MCB to absorb the extra current.",
      "Remove the earth connection from the light fittings to stop the leakage current."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "HEALTH_SAFETY"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "application",
      "calculation"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "LED drivers and fluorescent ballasts have significant inrush currents. A Type C MCB has a higher magnetic trip threshold (5-10 times In) than Type B, making it suitable for these 'inductive' style loads without compromising safety."
  },
  {
    "id": 4061,
    "question": "Which of the following describes the operating principle of a Residual Current Device (RCD)?",
    "options": [
      "It uses a current transformer to detect a difference in the magnetic fields of the Line and Neutral conductors.",
      "It measures the total resistance of the earth fault loop and trips if it exceeds 1667 ohms.",
      "It monitors the temperature of the circuit protective conductor (CPC) using a bimetallic strip.",
      "It compares the incoming voltage to the outgoing voltage and trips on a 30V drop."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "conceptual"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "An RCD works on the principle of magnetic balance. Line and Neutral pass through a core; if the currents are equal, their magnetic fields cancel out. An imbalance (residual current) induces a voltage in a search coil, tripping the device."
  },
  {
    "id": 4062,
    "question": "Why must an electrician be cautious when installing a Type D MCB in a domestic property with a high Earth Fault Loop Impedance (Zs)?",
    "options": [
      "The fault current may be too low to trigger the magnetic trip of the Type D device within the required time.",
      "Type D devices are physically incompatible with domestic consumer units.",
      "Type D devices do not provide protection against thermal overloads.",
      "The device will trip every time a high-power appliance like a kettle is used."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Type D MCBs require a very high current (10-20x In) to trip magnetically. If the circuit impedance is high, the fault current might be limited to a value below this, preventing the device from tripping instantly during a fault."
  },
  {
    "id": 4063,
    "question": "In the event of a short-circuit fault between Line and Earth, which device is primarily responsible for providing 'Additional Protection' against fatal electric shock?",
    "options": [
      "A 30mA RCD.",
      "A BS 88-3 cartridge fuse.",
      "A Type B MCB.",
      "A Main Earthing Terminal."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "While fuses and MCBs provide fault protection (ADS), a 30mA RCD is specifically defined as 'Additional Protection' because it can operate at current levels much lower than those required to trip an OCPD, potentially saving a life."
  },
  {
    "id": 4064,
    "question": "A circuit is protected by a 16A Type B MCB. If a sustained current of 20A flows through the circuit due to an overloaded motor, which part of the MCB will eventually disconnect the supply?",
    "options": [
      "The bimetallic strip (thermal element).",
      "The electromagnetic solenoid (magnetic element).",
      "The RCD search coil.",
      "The arc chute."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A 20A flow on a 16A circuit is a 'small' overload. This is handled by the bimetallic strip, which heats up and bends over time, eventually releasing the trip mechanism."
  },
  {
    "id": 4065,
    "question": "What is the primary functional difference between a BS 3036 semi-enclosed (rewirable) fuse and a modern Type B MCB?",
    "options": [
      "The MCB is a mechanical switch that can be reset, whereas the fuse is a sacrificial link that must be replaced.",
      "The fuse protects against earth leakage, while the MCB only protects against overloads.",
      "The MCB is more tolerant of high temperatures in the consumer unit than the fuse.",
      "The fuse can only be used on DC circuits, while the MCB is for AC only."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Science 2365 Level 2",
    "category": "Protective Devices Basics",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "203-3D-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Fuses work by the thermal melting of a wire link (sacrificial). MCBs use mechanical/magnetic triggers to open contacts and can be reset once the fault is cleared."
  }
];
