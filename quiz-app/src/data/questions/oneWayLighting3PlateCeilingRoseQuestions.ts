import { TaggedQuestion } from './types';

/**
 * One-way lighting (3-plate ceiling rose) Question Bank
 * Aligned with lesson 204-14A learning outcomes
 * Generated: 2026-01-28
 */

export const oneWayLighting3PlateCeilingRoseQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "In a standard one-way lighting circuit, which conductor must the switch be installed in to safely control the lamp?",
    "options": [
      "The Line (live) conductor",
      "The Neutral conductor",
      "The CPC (earth) conductor",
      "The main bonding conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-14A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "To ensure safety, the switch must always break the Line (live) conductor. If it broke the neutral, the lamp would be off but still live at the fitting."
  },
  {
    "id": 4052,
    "question": "Where are the permanent live conductors grouped together in a 'loop-in' lighting system?",
    "options": [
      "The loop terminal of the ceiling rose",
      "The neutral terminal of the ceiling rose",
      "The L1 terminal of the switch",
      "The earth terminal of the switch box"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a 3-plate ceiling rose, the 'loop' terminal is used to group the permanent lives (incoming feed and feed down to the switch)."
  },
  {
    "id": 4053,
    "question": "What is the function of the 'Switched Live' conductor in a lighting circuit?",
    "options": [
      "To carry current from the switch to the lamp only when the switch is ON",
      "To provide a permanent feed to the switch from the consumer unit",
      "To return the current from the lamp to the neutral group",
      "To provide a path for fault current to reach earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The switched live is the conductor that returns from the switch (L1) to the lamp, becoming live only when the switch is closed."
  },
  {
    "id": 4054,
    "question": "When wiring a 1-way switch, which terminal should typically receive the permanent live feed from the ceiling rose loop terminal?",
    "options": [
      "COM",
      "L1",
      "L2",
      "Neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The permanent live feed is connected to the Common (COM) terminal of the switch."
  },
  {
    "id": 4055,
    "question": "If a blue core is used as a switched live return in a cable, how must it be identified at the terminations?",
    "options": [
      "With brown sleeving",
      "With green and yellow sleeving",
      "With blue sleeving",
      "It does not require identification"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Any conductor used for a purpose other than its core colour suggests must be sleeved at terminations (e.g., brown sleeving for a switched live)."
  },
  {
    "id": 4056,
    "question": "What would happen if the lamp live conductor was connected directly into the 'loop' terminal group at the ceiling rose?",
    "options": [
      "The lamp would stay on permanently and cannot be switched off",
      "The circuit protective device would trip immediately",
      "The lamp would only work when the switch is OFF",
      "The lamp would not work at all"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The loop terminal contains the permanent live. Connecting the lamp directly to it bypasses the switch entirely."
  },
  {
    "id": 4057,
    "question": "Which of these is a 'stop-and-fix' issue that must be corrected during a pre-flight inspection of a training rig?",
    "options": [
      "Exposed copper conductor outside of a terminal",
      "A switch mounted slightly crookedly",
      "A cable clip being 5mm off-center",
      "Using a brown core for a permanent live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Exposed copper outside a terminal is a serious safety and quality issue that must be fixed before any meter work or energisation."
  },
  {
    "id": 4058,
    "question": "In a 3-plate ceiling rose, which conductors are connected to the 'Neutral' terminal group?",
    "options": [
      "The incoming neutral and the lamp neutral",
      "The incoming neutral and the switch return",
      "The permanent live and the lamp neutral",
      "The CPC and the incoming neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The neutral group in the rose connects the supply neutral to the lamp neutral."
  },
  {
    "id": 4059,
    "question": "What is the requirement for the CPC (earth) at a plastic one-way switch box?",
    "options": [
      "It must be present and terminated in a connector or earth terminal",
      "It can be cut back as it is not needed for plastic accessories",
      "It should be connected to the COM terminal",
      "It must be connected to the neutral group"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The CPC must always be present and terminated at every point in the circuit to maintain continuity, even if the accessory is plastic."
  },
  {
    "id": 4060,
    "question": "Which terminal in a 3-plate ceiling rose receives the wire coming back from terminal L1 of the switch?",
    "options": [
      "The switched live terminal (lamp live)",
      "The loop terminal",
      "The neutral terminal",
      "The CPC terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The wire from L1 is the switched live return; it connects to the specific terminal in the rose that feeds the lamp live."
  },
  {
    "id": 4061,
    "question": "In a standard one-way lighting circuit, which conductor must the switch be installed into to ensure the circuit is safe when the switch is off?",
    "options": [
      "Line (Live)",
      "Neutral",
      "CPC (Earth)",
      "The lamp return only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting (3-plate ceiling rose)",
    "tags": [
      "terminology",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The switch must always break the Line (Live) conductor. If it broke the Neutral, the lamp would stay live even when switched off, creating a shock hazard."
  },
  {
    "id": 4062,
    "question": "Which terminal group in a three-plate ceiling rose acts as a joining point for the permanent live from the consumer unit and the feed down to the switch?",
    "options": [
      "Loop terminal",
      "Neutral terminal",
      "Switched live terminal",
      "Earth terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting (3-plate ceiling rose)",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The 'Loop' terminal is used to connect the incoming permanent live and the outgoing live feed to the switch. It is not connected directly to the lamp."
  },
  {
    "id": 4063,
    "question": "What is the specific purpose of 'switched live' in a lighting circuit?",
    "options": [
      "To carry current from the switch to the lamp only when the switch is closed",
      "To provide a continuous live feed to the switch COM terminal",
      "To provide a return path for current to the consumer unit",
      "To ensure the metal light fitting is connected to earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting (3-plate ceiling rose)",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The switched live is the conductor that returns from the switch (L1) to the ceiling rose. It only becomes live when the switch is in the 'ON' position."
  },
  {
    "id": 4064,
    "question": "When wiring a one-way switch on a training rig, which terminal should receive the permanent live feed from the ceiling rose loop terminal?",
    "options": [
      "COM",
      "L1",
      "L2",
      "N"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting (3-plate ceiling rose)",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The 'COM' (Common) terminal is where the permanent live feed is connected. The 'L1' terminal is then used for the switched live return."
  },
  {
    "id": 4065,
    "question": "During a pre-flight inspection of a lighting circuit, an electrician notices a switched live conductor is not identified. What is the correct action to take?",
    "options": [
      "Apply brown sleeving to the conductor at the termination",
      "Apply blue sleeving to indicate it is a return path",
      "Apply green and yellow sleeving to show it is protected",
      "Leave it as it is because the core colour is sufficient"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting (3-plate ceiling rose)",
    "tags": [
      "application",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Any conductor used as a live (such as a switched live return in a twin and earth cable) must be identified with brown sleeving at the terminations to indicate its function."
  },
  {
    "id": 4066,
    "question": "In a 3-plate ceiling rose, what is the primary purpose of the 'Loop' terminal group?",
    "options": [
      "To provide a permanent live connection point for the switch feed",
      "To connect the lamp's live wire directly to the supply",
      "To act as a common junction for all neutral conductors",
      "To provide a termination point for the circuit protective conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "series",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Loop terminal in a 3-plate rose holds the permanent live from the CU and the feed going down to the switch. It is not connected directly to the lamp."
  },
  {
    "id": 4067,
    "question": "A student is wiring a one-way circuit. Which conductor must the switch interrupt to ensure the circuit is safe when turned off?",
    "options": [
      "The Line (Live) conductor",
      "The Neutral conductor",
      "Both the Line and Neutral conductors",
      "The Circuit Protective Conductor (CPC)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO1",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "For safety, the switch must always break the Line conductor. Breaking the neutral would leave the lamp live even when the light is 'off'."
  },
  {
    "id": 4068,
    "question": "After wiring a training rig, the lamp stays on permanently and cannot be turned off by the switch. What is the most likely termination error at the ceiling rose?",
    "options": [
      "The lamp live has been connected into the Loop terminal",
      "The lamp neutral has been connected into the Neutral terminal",
      "The switched live return is connected to the L1 terminal at the switch",
      "The CPC has been connected to the earth terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "mixed-circuit",
      "calculation"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "If the lamp live is placed in the Loop terminal, it receives a permanent live feed, bypassing the switch entirely."
  },
  {
    "id": 4069,
    "question": "When using Twin and Earth cable for the drop to a one-way switch, why is it necessary to place brown sleeving over the blue core at the terminations?",
    "options": [
      "To identify the conductor's function as a switched live",
      "To increase the insulation resistance of the conductor",
      "To prevent the neutral current from overheating the cable",
      "To indicate that the conductor is connected to the CPC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Sleeving is used to identify that a conductor is performing a different function than its core color suggests (e.g., a blue core acting as a switched live)."
  },
  {
    "id": 4070,
    "question": "In a standard 3-plate ceiling rose arrangement, which two conductors are terminated into the 'Neutral' group?",
    "options": [
      "The supply neutral and the lamp neutral",
      "The supply neutral and the switch return",
      "The lamp live and the switch return",
      "The supply live and the lamp live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The neutral group in the rose connects the incoming neutral from the supply directly to the neutral wire of the lamp."
  },
  {
    "id": 4071,
    "question": "Which of the following is a 'stop-and-fix' issue that must be corrected during a pre-flight inspection before any meter testing?",
    "options": [
      "Copper conductor visible outside of a terminal",
      "Brown sleeving used on a switched live conductor",
      "A plastic mounting box used for a one-way switch",
      "The use of 1.5mm² cable for a lighting circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO4",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Exposed copper outside a terminal is a safety hazard and a sign of poor termination; it must be fixed before proceeding."
  },
  {
    "id": 4072,
    "question": "What is the correct wire journey for the Line (Live) conductor in a one-way lighting circuit using a 3-plate rose?",
    "options": [
      "CU -> Rose Loop -> Switch COM -> Switch L1 -> Rose Switched Live -> Lamp",
      "CU -> Rose Neutral -> Switch COM -> Switch L1 -> Lamp",
      "CU -> Switch COM -> Switch L1 -> Rose Loop -> Lamp",
      "CU -> Rose Switched Live -> Switch COM -> Switch L1 -> Lamp"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The live travels from the CU to the rose loop, down to the switch COM, returns from L1 as a switched live to the rose, and then to the lamp."
  },
  {
    "id": 4073,
    "question": "When terminating a one-way switch, where should the permanent live feed from the ceiling rose be connected?",
    "options": [
      "The COM terminal",
      "The L1 terminal",
      "The L2 terminal",
      "The Earth terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The permanent live feed (from the Loop) is connected to the Common (COM) terminal of the switch."
  },
  {
    "id": 4074,
    "question": "A training rig uses a plastic ceiling rose and a plastic switch box. What must be done with the CPC (earth) conductor?",
    "options": [
      "It must be terminated at the earth points in both the rose and the switch box",
      "It can be cut back and tucked away as the accessories are plastic",
      "It only needs to be terminated at the consumer unit end",
      "It should be connected to the Neutral terminal to ensure a path to earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "CPC continuity must be maintained throughout the entire circuit, regardless of whether the current accessories are plastic or metal."
  },
  {
    "id": 4075,
    "question": "Which terminal in a 3-plate ceiling rose is used to connect the 'return' wire from the switch L1 terminal?",
    "options": [
      "The switched live terminal (often marked L or with the lamp symbol)",
      "The Loop terminal",
      "The Neutral terminal",
      "The CPC terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The return from the switch (L1) is the switched live, which connects to the specific terminal in the rose that feeds the lamp."
  },
  {
    "id": 4076,
    "question": "In a 3-plate ceiling rose, which terminal group is used to connect the supply neutral and the lamp's neutral together?",
    "options": [
      "Neutral terminal",
      "Loop terminal",
      "Switched live terminal",
      "CPC terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "application",
      "units"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The Neutral terminal group in a 3-plate rose is specifically for joining the incoming supply neutral and the outgoing neutral to the lamp."
  },
  {
    "id": 4077,
    "question": "What is the primary function of the 'Loop' terminal in a 3-plate ceiling rose circuit?",
    "options": [
      "To provide a permanent live connection point for the switch feed",
      "To connect the lamp's live wire directly to the supply",
      "To provide a common point for all earth conductors",
      "To act as a junction for the switched live return"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "series"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "The Loop terminal holds the permanent live from the CU and 'loops' it down to the switch. It does not connect directly to the lamp."
  },
  {
    "id": 4078,
    "question": "An electrician is wiring a one-way switch on a training rig. Which conductor should be terminated into the 'COM' terminal of the switch?",
    "options": [
      "The permanent live feed from the ceiling rose loop",
      "The switched live return to the lamp",
      "The neutral conductor from the supply",
      "The CPC from the consumer unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "voltage-rule"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Common (COM) terminal receives the permanent live feed; the L1 terminal is typically used for the switched live return."
  },
  {
    "id": 4079,
    "question": "When using a twin-core and earth cable for the switch drop, why must brown sleeving be placed over the blue conductor at both the rose and the switch?",
    "options": [
      "To identify that the conductor is acting as a live and not a neutral",
      "To show that the conductor is a neutral and not a live",
      "To insulate the copper where the outer sheath has been stripped",
      "To prevent the conductor from touching the metal backbox"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a switch drop, the blue core is used as a switched live; it must be sleeved brown to indicate its function as a live conductor."
  },
  {
    "id": 4080,
    "question": "In a standard 3-plate lighting circuit, where does the lamp's brown (live) flex wire connect?",
    "options": [
      "The switched live terminal",
      "The loop terminal",
      "The neutral terminal",
      "The COM terminal of the switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The lamp flex must connect to the switched live terminal so that it can be controlled by the switch. Connecting to the loop would mean the lamp is always on."
  },
  {
    "id": 4081,
    "question": "During a pre-flight inspection, an electrician finds that the insulation of a conductor is clamped inside the terminal screw. Why is this a 'stop-and-fix' issue?",
    "options": [
      "It creates a poor electrical connection and a high-resistance joint",
      "It will cause the circuit breaker to trip instantly on power-up",
      "It changes the conductor's role from a live to a neutral",
      "It is only a cosmetic issue and does not affect safety"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "FORMULA_NOT_REARRANGED",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Clamping the insulation instead of the copper (plastic-in) creates a high-resistance joint which can lead to overheating and circuit failure."
  },
  {
    "id": 4082,
    "question": "Why is it a fundamental safety requirement that the switch in a lighting circuit breaks the Line conductor rather than the Neutral?",
    "options": [
      "To ensure the lamp is not live when the switch is in the OFF position",
      "To prevent the circuit from drawing current when the lamp is removed",
      "To allow the neutral to act as a return path for fault current",
      "To ensure the CPC does not become live during a fault"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "If the switch breaks the neutral, the lamp remains live even when switched off, posing an electric shock risk during maintenance."
  },
  {
    "id": 4083,
    "question": "Which conductor must be terminated at every accessory in a lighting circuit, even if the accessory itself is made of non-conductive plastic?",
    "options": [
      "Circuit Protective Conductor (CPC)",
      "Switched Live",
      "Neutral",
      "Permanent Live (Loop)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The CPC must be maintained throughout the entire circuit to ensure earth continuity, regardless of the material of the accessory."
  },
  {
    "id": 4084,
    "question": "If an electrician needs to extend a lighting circuit to a second room, where should the 'Live In' for the next ceiling rose be connected?",
    "options": [
      "The Loop terminal of the existing rose",
      "The Switched Live terminal of the existing rose",
      "The L1 terminal of the existing switch",
      "The Neutral terminal of the existing rose"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "mixed-circuit"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Connecting to the Loop terminal provides a permanent live feed to the next part of the circuit. Connecting to the switched live would mean the second room only gets power when the first room's light is on."
  },
  {
    "id": 4085,
    "question": "Which of the following describes the correct sequence for the wire journey of the permanent live in a 3-plate rose system?",
    "options": [
      "CU -> Rose (Loop) -> Switch (COM)",
      "CU -> Switch (COM) -> Rose (Switched Live)",
      "CU -> Rose (Neutral) -> Switch (L1)",
      "CU -> Lamp -> Switch (COM)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a 3-plate system, the permanent live goes from the Consumer Unit to the Loop terminal of the rose, and then down to the Common terminal of the switch."
  },
  {
    "id": 4086,
    "question": "When wiring a 3-plate ceiling rose, which terminal group acts as the junction for the permanent live feed from the consumer unit and the feed going down to the switch?",
    "options": [
      "Loop terminals",
      "Switched live terminals",
      "Neutral terminals",
      "CPC terminals"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The 'Loop' terminal in a 3-plate rose is used to group the permanent lives together, allowing a feed to be taken down to the switch COM terminal."
  },
  {
    "id": 4087,
    "question": "A student is inspecting a one-way lighting circuit. They observe a conductor with brown sleeving returning from the switch to the ceiling rose. What is the specific function of this conductor?",
    "options": [
      "Switched live",
      "Permanent live",
      "Neutral return",
      "Circuit protective conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "identification",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The conductor returning from the switch to the rose (from L1) becomes live only when the switch is closed; it is the switched live and must be identified as such."
  },
  {
    "id": 4088,
    "question": "Why is it a critical safety requirement that the one-way switch is placed in the line (live) conductor rather than the neutral conductor?",
    "options": [
      "To ensure the lamp is not live when the switch is in the OFF position",
      "To prevent the neutral conductor from overheating during operation",
      "To ensure the circuit breaker trips faster during a short circuit",
      "To allow the neutral group at the rose to remain permanent"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "health-safety",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "204-14A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "If the switch breaks the neutral, the lamp remains live (connected to the line) even when turned off, creating a significant shock risk during lamp replacement."
  },
  {
    "id": 4089,
    "question": "During a pre-flight inspection of a training rig, an instructor finds the lamp live wire connected directly into the 'loop' terminal group of a 3-plate rose. What will be the result when the circuit is energised?",
    "options": [
      "The lamp will remain ON regardless of the switch position",
      "The lamp will not turn on at all",
      "The circuit breaker will trip as soon as the switch is turned ON",
      "The switch will control the neutral instead of the live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The loop terminal is a permanent live. Connecting the lamp live directly to it bypasses the switch entirely, meaning the lamp will stay on constantly."
  },
  {
    "id": 4090,
    "question": "In a standard one-way lighting wire journey using a 3-plate rose, where does the neutral conductor for the lamp itself physically terminate?",
    "options": [
      "In the neutral group at the ceiling rose",
      "In the COM terminal at the switch",
      "In the loop group at the ceiling rose",
      "In the L1 terminal at the switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "In a 3-plate system, the neutrals (from the supply and to the lamp) meet at the ceiling rose neutral group. The neutral does not go to the switch."
  },
  {
    "id": 4091,
    "question": "An electrician is wiring a one-way lighting circuit using a 3-plate ceiling rose. By mistake, they terminate the lamp's brown core into the 'Loop' terminal instead of the switched-live terminal. What will be the observed result?",
    "options": [
      "The lamp will remain on permanently and cannot be turned off by the switch",
      "The lamp will only illuminate when the switch is in the 'off' position",
      "The circuit protective device will trip immediately upon energisation",
      "The lamp will not illuminate regardless of the switch position"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The 'Loop' terminal in a 3-plate rose contains the permanent live. If the lamp is connected directly to this, it bypasses the switch and receives power constantly."
  },
  {
    "id": 4092,
    "question": "During a pre-flight inspection of a training rig, you notice a blue conductor terminated into the L1 terminal of a one-way switch without any brown sleeving. Why is this classified as a 'stop-and-fix' issue?",
    "options": [
      "It fails to identify the conductor's functional role as a switched live",
      "Blue conductors are strictly prohibited from carrying any form of live current",
      "The switch will not function mechanically unless the core is identified as brown",
      "The lack of sleeving will cause a high-resistance connection at the terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "health-safety",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO4",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Conductors must be identified by sleeving or color at their terminations to indicate their function. A blue core used as a switched live must have brown sleeving."
  },
  {
    "id": 4093,
    "question": "In a 3-plate ceiling rose, you observe three separate brown conductors terminated into the same 'Loop' terminal group. Which of the following best describes the likely identity of these three conductors?",
    "options": [
      "Feed in from CU, feed out to next rose, and feed down to switch COM",
      "Feed in from CU, switched live return from L1, and lamp live",
      "Feed in from CU, Neutral in from CU, and CPC to switch box",
      "Feed in from CU, feed out to next rose, and lamp live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The Loop terminal is for permanent lives only. In a standard circuit, this includes the supply in, the supply continuing to the next light, and the drop to the switch."
  },
  {
    "id": 4094,
    "question": "A student incorrectly wires a one-way switch so that the 'COM' terminal is connected to the Neutral group in the rose, and the 'L1' return goes to the lamp. What is the primary safety concern with this arrangement?",
    "options": [
      "The switch breaks the Neutral, leaving the lamp live even when switched off",
      "A dead short circuit will occur the moment the switch is turned to the ON position",
      "The lamp will operate at half voltage and eventually overheat the cable",
      "The Circuit Protective Conductor (CPC) will become live when the light is ON"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "Switches must always break the Line (Live) conductor. Breaking the Neutral is dangerous because the lamp terminals remain live even when the light appears to be off."
  },
  {
    "id": 4095,
    "question": "Why is it a mandatory requirement to terminate the CPC at a plastic ceiling rose and switch box, even if the light fitting itself is made of non-conductive plastic?",
    "options": [
      "To maintain earth continuity throughout the circuit for future accessories",
      "To provide a backup path for the Neutral current in case of a fault",
      "To prevent the build-up of static electricity on the plastic surface",
      "To ensure the switch can technically operate as a one-way device"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The CPC must be continuous to ensure that if a metal fitting is installed in the future, it is properly earthed, and to maintain the earth path for the rest of the circuit."
  },
  {
    "id": 4096,
    "question": "Which conductor journey represents the 'Switched Live' path in a standard 3-plate ceiling rose installation?",
    "options": [
      "From the switch L1 terminal back to the rose switched-live terminal",
      "From the CU Neutral to the rose neutral group",
      "From the rose loop terminal down to the switch COM terminal",
      "From the lamp neutral terminal to the CU neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "difficulty": 4,
    "estimatedTime": 100,
    "explanation": "The switched live is the return leg of the journey; it starts at the switch (L1) and returns to the rose to feed the lamp only when the switch is closed."
  },
  {
    "id": 4097,
    "question": "During a dead inspection, you find that a terminal screw is tightened onto the insulation of the wire rather than the copper core. What is the correct term for this fault and its consequence?",
    "options": [
      "Plastic-in; it causes a high-resistance or open-circuit fault",
      "Loop-in; it causes the circuit to remain permanently live",
      "Back-feed; it causes the circuit protective device to trip",
      "Dead-short; it causes the conductor to overheat immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-14A-LO4",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "'Plastic-in' occurs when insulation is clamped, preventing or restricting electrical contact between the terminal and the copper conductor."
  },
  {
    "id": 4098,
    "question": "When using a standard Twin and Earth cable for a switch drop in a one-way circuit, how must the conductors be identified at the switch and the rose?",
    "options": [
      "The blue core must be oversleeved with brown at both ends",
      "The blue core must be left plain to indicate it is a switched neutral",
      "The bare CPC must be oversleeved with brown to act as a return",
      "The brown core must be oversleeved with blue at the switch end"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-14A-LO3",
    "difficulty": 5,
    "estimatedTime": 110,
    "explanation": "In a switch drop, both the feed down and the return up are live conductors. Since the blue core is being used as a live return, it must be sleeved brown."
  },
  {
    "id": 4099,
    "question": "What is the specific functional advantage of a 3-plate ceiling rose over a 2-plate ceiling rose in domestic installations?",
    "options": [
      "It provides a built-in terminal for the permanent live loop, avoiding external joint boxes",
      "It allows the lamp to be connected in series with the switch for higher efficiency",
      "It provides a dedicated terminal to join the CPC and Neutral together",
      "It contains an internal fuse to protect the lamp from over-current"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-14A-LO1",
    "difficulty": 4,
    "estimatedTime": 100,
    "explanation": "The 3-plate rose (Loop-in) system uses the rose itself as a junction box for the permanent live, simplifying the wiring of the lighting circuit."
  },
  {
    "id": 4100,
    "question": "A one-way lighting circuit is energised. The lamp does not light up when the switch is ON. A voltmeter shows 230V at the 'Loop' terminal and 230V at L1, but 0V at the lamp live terminal. Where is the fault?",
    "options": [
      "An open circuit in the switched-live return conductor between the switch and the rose",
      "The permanent live feed from the CU is not connected to the Loop terminal",
      "The neutral conductor is missing from the neutral group in the rose",
      "The switch COM terminal has a loose connection to the permanent live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-14A-LO2",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "If there is voltage at the switch L1 but not at the lamp live terminal in the rose, the break must be in the conductor returning from the switch to the rose."
  }
];
