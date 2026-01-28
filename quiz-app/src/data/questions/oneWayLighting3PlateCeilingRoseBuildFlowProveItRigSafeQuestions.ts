import { TaggedQuestion } from './types';

/**
 * One-way lighting (3-plate ceiling rose): build flow + prove it (rig-safe) Question Bank
 * Aligned with lesson 204-13B learning outcomes
 * Generated: 2026-01-28
 */

export const oneWayLighting3PlateCeilingRoseBuildFlowProveItRigSafeQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "What is the primary purpose of the 'Loop' terminal in a standard 3-plate ceiling rose?",
    "options": [
      "To provide a permanent live connection for the switch feed",
      "To connect all the circuit protective conductors (CPCs) together",
      "To act as the return path for the neutral conductor",
      "To connect the lamp directly to the earth terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a 3-plate system, the Loop terminal is used to group the permanent live from the supply and the live feed going down to the switch."
  },
  {
    "id": 4052,
    "question": "When wiring a switch return in a twin and earth cable, which identification must be applied to the blue core?",
    "options": [
      "Brown sleeving",
      "Green and yellow sleeving",
      "Blue sleeving",
      "No sleeving is required"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The blue core is used as a switched live (return), so it must be identified with brown sleeving to show it is a live conductor."
  },
  {
    "id": 4053,
    "question": "According to the 'Step 0' rig-safe procedure, what must be confirmed before touching any cables?",
    "options": [
      "The rig is in its approved dead state",
      "The insulation resistance is exactly 999 MΩ",
      "The multi-function tester is switched to continuity",
      "The circuit protective conductor is nulled"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO2",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Safety first: always confirm the rig is in a safe, dead state before starting any installation work."
  },
  {
    "id": 4054,
    "question": "In a 3-plate ceiling rose, which two conductors are correctly grouped in the Neutral terminal block?",
    "options": [
      "CU Neutral feed and the lamp Neutral",
      "CU Line feed and the switch feed",
      "Switch return and the lamp Line",
      "All CPCs and the CU Neutral feed"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The Neutral terminal groups the incoming neutral from the consumer unit and the outgoing neutral to the lamp."
  },
  {
    "id": 4055,
    "question": "What is the correct 'test mindset' sequence to follow when using a multi-function tester?",
    "options": [
      "Prove -> Test -> Re-prove",
      "Test -> Record -> Prove",
      "Record -> Test -> Re-prove",
      "Prove -> Record -> Test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "The 'Prove-Test-Re-prove' cycle ensures that the tester was working correctly both before and after the measurement."
  },
  {
    "id": 4056,
    "question": "When performing an Insulation Resistance (IR) test on a standard 230V training rig, what is the typical DC test voltage used?",
    "options": [
      "500 V",
      "230 V",
      "50 V",
      "1000 V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "units",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "For standard low voltage circuits (up to 500V), the insulation resistance test voltage is 500 V DC."
  },
  {
    "id": 4057,
    "question": "What does a stable, low-resistance reading during a CPC continuity test confirm?",
    "options": [
      "The earth path is continuous and secure",
      "The insulation between conductors is failing",
      "The switch is currently in the OFF position",
      "The circuit is ready to be energized with live mains"
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
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A low-ohms reading (continuity) confirms that the protective conductor path is unbroken from one end to the other."
  },
  {
    "id": 4058,
    "question": "In a one-way lighting circuit, which switch terminal should receive the feed from the ceiling rose 'Loop'?",
    "options": [
      "COM",
      "L1",
      "L2",
      "Neutral"
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
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The permanent live feed from the rose goes to the Common (COM) terminal of the switch."
  },
  {
    "id": 4059,
    "question": "During a dead inspection, you find a wire where the copper is visible outside the terminal. What is the correct classification for this?",
    "options": [
      "Stop-and-fix",
      "Pass to proceed",
      "Suspicious (ignore for now)",
      "Record as a good result"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "Exposed copper outside a terminal is a workmanship and safety issue that must be corrected before proceeding to testing."
  },
  {
    "id": 4060,
    "question": "What is the main objective of a 'Polarity' dead test in a lighting circuit?",
    "options": [
      "To verify that the switch is placed in the Line conductor",
      "To check if the CPC is correctly color-coded",
      "To measure the resistance of the light bulb filament",
      "To ensure the circuit is disconnected from the Neutral bar"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Polarity testing ensures that the fuse/MCB and the switch are connected in the Line (live) conductor, not the Neutral."
  },
  {
    "id": 4061,
    "question": "When wiring a one-way lighting circuit using a three-plate ceiling rose, which terminal group should the permanent live feed from the consumer unit be connected to?",
    "options": [
      "The Loop terminal",
      "The Neutral terminal",
      "The Switched Live terminal",
      "The Earth terminal"
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
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a three-plate ceiling rose, the Loop terminal is used to group the permanent live conductors together, including the feed from the CU and the feed down to the switch."
  },
  {
    "id": 4062,
    "question": "What identification must be applied to a blue conductor when it is used as a switch return (switched live) in a lighting circuit?",
    "options": [
      "Brown sleeving",
      "Green and yellow sleeving",
      "Blue sleeving",
      "Black tape"
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
      "terminology",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Any conductor used as a live conductor that is not already brown must be identified with brown sleeving at its terminations to indicate it is 'live'."
  },
  {
    "id": 4063,
    "question": "According to the standard 'build flow' for a lighting rig, what is the correct step to take immediately after mounting the accessories and routing the cables?",
    "options": [
      "Terminate the conductors into the correct terminals",
      "Perform an insulation resistance test",
      "Energise the circuit to check the lamp works",
      "Record the final test results on a certificate"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-13B-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Following the plan -> mount -> route sequence, the next logical step is to terminate the conductors before moving on to inspection and testing."
  },
  {
    "id": 4064,
    "question": "An electrician is following the 'Prove -> Test -> Re-prove' routine while testing a lighting circuit. What does 'Re-prove' mean in this context?",
    "options": [
      "Checking the test instrument still functions correctly after the test",
      "Repeating the test three times to get an average reading",
      "Asking a supervisor to check the wiring again",
      "Proving that the circuit is live before starting the test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Re-proving ensures that the test instrument did not fail during the measurement, confirming that the 'good' result recorded was accurate."
  },
  {
    "id": 4065,
    "question": "What is the primary purpose of carrying out an Insulation Resistance (IR) test on a training rig before it is considered safe?",
    "options": [
      "To confirm there are no unwanted leakage paths between conductors",
      "To ensure the light switch is connected in the correct direction",
      "To measure the total resistance of the copper cores",
      "To check if the circuit breaker will trip under a short circuit"
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
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The IR test checks the integrity of the insulation by ensuring no current 'leaks' between the line, neutral, or earth conductors."
  },
  {
    "id": 4066,
    "question": "When terminating a three-plate ceiling rose, which conductor must be connected into the same terminal group as the Neutral feed from the Consumer Unit?",
    "options": [
      "The neutral conductor from the lamp/flex",
      "The switch return (switched live) conductor",
      "The permanent live feed to the switch",
      "The circuit protective conductor (CPC)"
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
      "mixed-circuit",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a 3-plate rose, the Neutral group consists of the incoming Neutral from the supply and the outgoing Neutral to the lamp."
  },
  {
    "id": 4067,
    "question": "Why is it a requirement to apply brown sleeving to the blue conductor of the twin and earth cable used as a switch drop?",
    "options": [
      "To identify that the conductor is functioning as a live core",
      "To provide an extra layer of insulation against heat",
      "To indicate that the conductor is a neutral return",
      "To prevent the copper from oxidizing at the terminal"
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
      "conceptual",
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Any conductor used as a live core that is not colour-coded brown (like the blue core in a switch drop) must be identified with brown sleeving."
  },
  {
    "id": 4068,
    "question": "During the 'Prove it' stage of dead testing, what is the purpose of 'nulling' or 'zeroing' the test leads on a multi-function tester?",
    "options": [
      "To subtract the resistance of the test leads from the final reading",
      "To ensure the battery voltage is high enough for the test",
      "To discharge any remaining static electricity in the cable",
      "To reset the insulation resistance timer to zero"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "calculation",
      "application",
      "units"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Nulling ensures that the resistance of the leads themselves is not included in the circuit continuity measurement, providing a more accurate result."
  },
  {
    "id": 4069,
    "question": "An electrician is performing an Insulation Resistance test on a lighting circuit rig. Which meter setting and expected result indicate a healthy circuit?",
    "options": [
      "500V DC and a reading of >999 MΩ",
      "230V AC and a reading of 0.00 Ω",
      "500V DC and a reading of 0.50 MΩ",
      "100V DC and a reading of 1.00 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "ROUNDING_ERROR",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "units",
      "calculation"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Standard IR tests are performed at 500V DC for 230V circuits, with a 'good' result being a very high resistance (typically over-range on the meter)."
  },
  {
    "id": 4070,
    "question": "In the 'Loop' terminal of a 3-plate ceiling rose, which two conductors are typically connected together?",
    "options": [
      "The feed from the CU and the feed down to the switch COM",
      "The feed from the CU and the neutral to the lamp",
      "The switch return from L1 and the live to the lamp",
      "The switch return from L1 and the feed from the CU"
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
      "application",
      "mixed-circuit"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The 'Loop' terminal acts as a junction for the permanent live; it takes the incoming supply and sends it down to the switch."
  },
  {
    "id": 4071,
    "question": "What is the primary conceptual reason for conducting a visual inspection ('Dead Inspection') before using any test instruments?",
    "options": [
      "To identify obvious defects that could cause damage or false readings during testing",
      "To calculate the total resistance of the circuit using visual cable lengths",
      "To ensure the accessories are perfectly level for aesthetic reasons",
      "To confirm the circuit is live before starting dead tests"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Inspection finds loose terminations or missing CPCs that could lead to dangerous conditions or incorrect data during the meter testing phase."
  },
  {
    "id": 4072,
    "question": "A student is verifying polarity on a one-way lighting circuit. What is the logic they are trying to prove?",
    "options": [
      "That the switch is located in the line conductor and not the neutral",
      "That the CPC is connected to the neutral terminal at the rose",
      "That the lamp will still operate if the line and neutral are swapped",
      "That the resistance of the switch is higher than the resistance of the lamp"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "Correct polarity ensures that when the switch is off, the live feed is disconnected from the lamp holder, making it safe for maintenance."
  },
  {
    "id": 4073,
    "question": "When routing cable into a switch box or ceiling rose, what is the 'Quality Gate' requirement for the cable sheath?",
    "options": [
      "The sheath must enter the accessory so no single-insulated cores are exposed",
      "The sheath must be stripped back at least 50mm outside the accessory",
      "The sheath must be taped to the back of the box to prevent movement",
      "The sheath should be removed entirely within the conduit or trunking"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "To maintain the integrity of the enclosure and protection against electric shock, the outer sheath must enter the accessory."
  },
  {
    "id": 4074,
    "question": "Which sequence correctly describes the 'Prove it' mindset for using a test instrument on a training rig?",
    "options": [
      "Prove the tester on a known source, perform the test, then re-prove the tester",
      "Inspect the circuit, perform the test, then record the result",
      "Zero the leads, perform the test, then switch off the tester",
      "Perform the test, fix any errors, then re-test until it passes"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The 'Prove-Test-Re-prove' cycle ensures that the instrument was working correctly both before and after the measurement was taken."
  },
  {
    "id": 4075,
    "question": "If a student connects the 'Switch Return' conductor to the 'Neutral' group at the ceiling rose by mistake, what would be the result during a polarity check?",
    "options": [
      "The switch would be placed in the neutral conductor instead of the line",
      "The circuit would work perfectly but the lamp would be dimmer",
      "The CPC continuity test would show a 'fail' result",
      "The insulation resistance would drop to zero immediately"
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
      "application",
      "mixed-circuit",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Connecting the switch return to neutral means the neutral path is being switched, which is a polarity failure."
  },
  {
    "id": 4076,
    "question": "In a 3-plate ceiling rose, which two conductors are correctly terminated together in the 'Loop' terminal?",
    "options": [
      "The Line feed from the consumer unit and the switch feed going to COM",
      "The Neutral feed from the consumer unit and the lamp neutral",
      "The switch return from L1 and the lamp live conductor",
      "The Line feed from the consumer unit and the lamp live conductor"
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
      "series",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Loop terminal in a 3-plate rose acts as a junction for the permanent live; it connects the incoming supply to the outgoing feed for the switch."
  },
  {
    "id": 4077,
    "question": "When preparing a Twin & CPC cable for a switch return, why is it essential to apply brown sleeving to the blue conductor?",
    "options": [
      "To identify that the conductor is being used as a live conductor",
      "To indicate that the conductor is a neutral return path",
      "To protect the conductor from mechanical damage inside the box",
      "To improve the insulation resistance of the termination"
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
      "terminology",
      "application",
      "explanation"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Any conductor used as a live (Line) that is not coloured brown must be identified with brown sleeving at all terminations."
  },
  {
    "id": 4078,
    "question": "During a dead inspection of a lighting circuit, you find that the cable sheath does not enter the ceiling rose enclosure. Which 'Quality Gate' decision should be made?",
    "options": [
      "Stop-and-fix: The sheath must enter the accessory to ensure basic insulation is enclosed",
      "Pass: As long as the copper is not showing outside the terminals, it is acceptable",
      "Suspicious: Only a problem if the CPC is also missing its sleeving",
      "Pass: The sheath is only required to be within 25mm of the enclosure"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "health-safety",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "The outer sheath of a cable must enter the accessory or enclosure so that no single-insulated cores are exposed to touch or damage."
  },
  {
    "id": 4079,
    "question": "An electrician is about to perform an Insulation Resistance test on a training rig. What is the correct 'Prove-Test-Re-prove' sequence?",
    "options": [
      "Check tester function, perform the circuit test, then check tester function again",
      "Test the circuit, check the tester, then record the result",
      "Check the tester, test the circuit, then null the leads",
      "Null the leads, test the circuit, then re-zero the meter"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "calculation",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Proving the instrument before and after testing ensures that the results obtained are valid and the tester didn't fail during the process."
  },
  {
    "id": 4080,
    "question": "When testing for CPC continuity on a lighting rig, the MFT shows a reading of 0.45 Ω. After nulling the leads, the reading is 0.12 Ω. What should be recorded?",
    "options": [
      "0.12 Ω",
      "0.45 Ω",
      "0.57 Ω",
      "0.33 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "USED_SERIES_RULE",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "calculation",
      "units",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "When leads are nulled, the meter automatically subtracts the lead resistance. The displayed result (0.12 Ω) is the actual resistance of the circuit path."
  },
  {
    "id": 4081,
    "question": "To verify 'Polarity Logic' using a continuity tester on a dead circuit, what should happen when testing between the Rose Switched-Live and Rose Neutral while toggling the switch?",
    "options": [
      "The reading should change from high resistance (Open) to low resistance (Closed)",
      "The reading should stay at 'OL' regardless of switch position",
      "The reading should stay at 0.00 Ω regardless of switch position",
      "The reading should only show a result if the lamp is removed from the circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "With the lamp in place, toggling the switch completes the circuit from the switched-live through the lamp filament to neutral, showing a change in resistance."
  },
  {
    "id": 4082,
    "question": "Which of the following is a 'Stop-and-fix' issue identified during the dead inspection of a 1-way lighting circuit?",
    "options": [
      "A CPC conductor is tucked into the back of the switch box but not terminated",
      "The switch plate is mounted slightly off-centre but is mechanically secure",
      "The cable is clipped every 250mm instead of 300mm",
      "The insulation resistance reading is recorded as >999 MΩ"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "All CPCs must be terminated at every point in the circuit, even if the accessory is plastic, to ensure earth continuity is maintained."
  },
  {
    "id": 4083,
    "question": "In the 3-plate ceiling rose termination map, which conductor connects directly to the lamp live terminal group?",
    "options": [
      "The switch return conductor from L1",
      "The switch feed conductor from COM",
      "The Neutral feed conductor from the CU",
      "The permanent Line feed from the CU"
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
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The switched live (switch return) is the conductor that provides power to the lamp only when the switch is closed."
  },
  {
    "id": 4084,
    "question": "What is the standard test voltage used for an Insulation Resistance (IR) test on a typical 230V lighting training rig?",
    "options": [
      "500 V DC",
      "230 V AC",
      "250 V DC",
      "1000 V AC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_WITH_DC",
      "2": "OTHER",
      "3": "CONFUSED_AC_WITH_DC"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "units",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Standard IR tests for LV circuits are carried out at 500V DC to stress the insulation without causing damage."
  },
  {
    "id": 4085,
    "question": "An electrician is planning the build flow. Which step must be completed immediately after 'Mount Accessories' but before 'Terminate'?",
    "options": [
      "Route and prepare cables (including identification)",
      "Perform Insulation Resistance tests",
      "Record the continuity results in the logbook",
      "Carry out the dead inspection checklist"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Cables must be routed and correctly prepared (stripped and sleeved) before they can be terminated into the accessories."
  },
  {
    "id": 4086,
    "question": "In a standard 3-plate ceiling rose arrangement, which two conductors are correctly terminated together into the 'Loop' terminal block?",
    "options": [
      "The supply line feed and the switch feed down to COM",
      "The supply line feed and the neutral feed from the CU",
      "The switch return from L1 and the lamp live conductor",
      "The supply neutral and the neutral conductor going to the lamp"
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
      "terminology",
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "The Loop terminal in a 3-plate rose acts as a junction for the permanent live; it connects the incoming supply line to the outgoing feed that goes down to the switch COM terminal."
  },
  {
    "id": 4087,
    "question": "When wiring the switch drop for a lighting circuit using twin and earth cable, what is the primary purpose of placing brown sleeving over the blue core?",
    "options": [
      "To identify the conductor as a live wire (switch return)",
      "To provide additional mechanical protection at the terminal",
      "To indicate that the circuit is part of a two-way system",
      "To prevent the conductor from being mistaken for a CPC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Any conductor used as a live wire that is not color-coded brown (like the blue core in a switch drop) must be sleeved brown to identify its function correctly."
  },
  {
    "id": 4088,
    "question": "An electrician is carrying out a dead polarity test. With the light switch in the OFF position, what resistance reading should be observed between the 'Loop' terminal and the 'Switched Live' terminal at the ceiling rose?",
    "options": [
      "An open circuit or very high resistance (Over-range)",
      "A very low resistance (approx. 0.05 Ω)",
      "A reading equivalent to the resistance of the lamp filament",
      "The same reading as the CPC continuity test"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "When the switch is OFF, the contact between COM (connected to Loop) and L1 (connected to Switched Live) is broken, resulting in an open circuit (high resistance)."
  },
  {
    "id": 4089,
    "question": "During the 'Step 5 — Dead inspection' phase of the build flow, which of the following is a 'stop-and-fix' issue that must be corrected before testing?",
    "options": [
      "The cable sheath is stripped back outside the accessory entry",
      "The test instrument has not yet been nulled",
      "The circuit breaker is in the OFF position",
      "The lamp has been removed from the holder"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO2",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Good workmanship requires the cable sheath to enter the accessory to ensure the basic insulation of the cores is not exposed to damage or contact."
  },
  {
    "id": 4090,
    "question": "When recording the results of an Insulation Resistance (IR) test on a training rig, why is it necessary to record the specific test voltage used (e.g., 500V DC)?",
    "options": [
      "To confirm the test was performed at a level sufficient to stress the insulation",
      "To ensure the battery of the MFT is not depleted during the test",
      "To calculate the total power consumption of the lighting circuit",
      "To determine the maximum current the cable can carry"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "IR tests must be performed at a specific voltage (usually 500V for 230V circuits) to effectively detect leakage paths that might not be apparent at lower voltages."
  },
  {
    "id": 4091,
    "question": "In a standard 3-plate ceiling rose arrangement, which two conductors must be terminated together in the 'Loop' terminal to ensure the circuit functions correctly?",
    "options": [
      "The permanent live feed from the consumer unit and the switch feed going to the 'COM' terminal.",
      "The permanent live feed from the consumer unit and the switched live return from the switch 'L1' terminal.",
      "The neutral feed from the consumer unit and the neutral conductor from the lamp holder.",
      "The switched live return from the switch and the live conductor feeding the lamp filament."
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
      "parallel",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The 'Loop' terminal in a 3-plate rose acts as a junction for the permanent live. It connects the incoming feed from the supply (CU) to the outgoing feed that travels down to the switch common (COM)."
  },
  {
    "id": 4092,
    "question": "During the dead-testing phase of a 1-way lighting circuit, an electrician performs a continuity test between the CU Line terminal and the Lamp Live terminal at the rose. With the switch in the 'OFF' position, the meter reads 'OL'. When the switch is 'ON', the meter reads 0.45Ω. What does this confirm?",
    "options": [
      "Correct polarity logic, confirming the switch is correctly interrupting the line conductor.",
      "An insulation resistance fault, as the reading should be 'OL' in both positions.",
      "A short circuit between the neutral and the line conductor within the switch box.",
      "That the CPC is not continuous, as the resistance should be significantly higher."
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
      "calculation",
      "voltage-rule",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "This is a polarity logic test. 'OL' when off means the circuit is broken (open); a low resistance when on means the switch has successfully completed the path from the permanent live to the switched live."
  },
  {
    "id": 4093,
    "question": "When preparing a Twin and CPC cable for use as a switch drop, why is it a critical 'Quality Gate' requirement to apply brown sleeving to the blue conductor at both the rose and the switch?",
    "options": [
      "To identify that the conductor is being used as a live core, preventing future confusion with a neutral.",
      "To increase the dielectric strength of the insulation at the termination point.",
      "To signify that the conductor is a 'reduced' cross-sectional area compared to the line core.",
      "To ensure the conductor is protected against mechanical damage from the terminal screw."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "In a switch drop, the blue core is used as a live (either switch feed or return). It must be sleeved brown to indicate it is not a neutral conductor, as per UK wiring identification standards."
  },
  {
    "id": 4094,
    "question": "An Insulation Resistance (IR) test is conducted at 500V DC between Line and CPC. The MFT displays '>999 MΩ'. How should this result be interpreted for a new training rig installation?",
    "options": [
      "The result is a 'Pass', indicating no significant leakage path exists between the live parts and earth.",
      "The result is 'Suspicious', as a perfect circuit should show exactly 500 MΩ.",
      "The result is a 'Fail', suggesting the circuit is open and the test current cannot flow.",
      "The result is 'Inconclusive', as IR tests must only be performed at 250V DC on lighting circuits."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "OTHER",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A very high resistance (over-range) on an IR test indicates that the insulation is effectively preventing current leakage between the tested conductors, which is the desired 'good' outcome."
  },
  {
    "id": 4095,
    "question": "During the 'Step 4 — Terminate' phase, which conductors are specifically grouped in the 'Neutral' block of the 3-plate ceiling rose?",
    "options": [
      "The incoming neutral from the CU and the neutral lead going to the lamp holder.",
      "The incoming neutral from the CU and the switch return conductor (L1).",
      "The neutral lead from the lamp holder and the CPC from the switch drop.",
      "The incoming line from the CU and the neutral lead from the lamp holder."
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
      "parallel",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The neutral block in a 3-plate rose is only for neutral conductors. It connects the supply neutral to the lamp neutral to complete the circuit path back to the source."
  },
  {
    "id": 4096,
    "question": "Why is the 'Prove → Test → Re-prove' sequence mandatory when using a Multi-Function Tester (MFT) on a training rig?",
    "options": [
      "To ensure the meter was functioning correctly both before and after the measurement was taken.",
      "To drain any residual voltage stored in the cables between different test types.",
      "To calibrate the meter's internal resistance to match the specific length of the rig cables.",
      "To prevent the protective device (MCB) from tripping during the dead test procedure."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-13B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Proving the tester before and after ensures that the reading obtained was valid and that the meter didn't fail or develop a lead fault during the actual test."
  },
  {
    "id": 4097,
    "question": "A student finds that the lamp stays permanently ON regardless of the switch position. Which termination error at the ceiling rose is the most likely cause?",
    "options": [
      "The lamp live conductor has been terminated into the 'Loop' terminal instead of the 'Switched Live' terminal.",
      "The switch return (L1) and the switch feed (COM) have been swapped at the switch terminals.",
      "The lamp neutral has been terminated into the 'Switched Live' terminal.",
      "The CPC has been connected to the 'Loop' terminal by mistake."
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
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-13B-LO1",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "If the lamp live is in the 'Loop' terminal, it is connected directly to the permanent live feed, bypassing the switch entirely and staying on constantly."
  },
  {
    "id": 4098,
    "question": "What is the primary purpose of 'nulling' (zeroing) test leads before performing a continuity test on a CPC path?",
    "options": [
      "To remove the resistance of the test leads from the final reading to ensure accuracy of the circuit's resistance.",
      "To ensure the meter is set to the correct voltage range for testing insulation.",
      "To verify that the battery in the MFT has enough power to drive the 200mA test current.",
      "To check if the circuit is still live before applying the continuity probes."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "204-13B-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Test leads have their own resistance (often 0.1Ω - 0.3Ω). Nulling subtracts this value so the meter shows only the resistance of the conductor being tested."
  },
  {
    "id": 4099,
    "question": "Which of the following describes a 'Stop-and-fix' condition during the Step 5 Dead Inspection of a 3-plate ceiling rose?",
    "options": [
      "Copper conductor is visible outside the terminal insulation, or the conductor is clamped on the insulation ('plastic-in').",
      "The brown sleeving on the switch return is 5mm longer than the blue insulation of the core.",
      "The CPC is terminated in a connector block because the rose earth terminal was full.",
      "The cable sheath extends 10mm into the ceiling rose base before the cores are stripped."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "discrimination",
      "health-safety"
    ],
    "learningOutcomeId": "204-13B-LO2",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "Exposed copper outside a terminal is a safety hazard and a sign of poor workmanship. 'Plastic-in' (clamping the insulation) creates a high-resistance or open-circuit fault. Both require immediate correction."
  },
  {
    "id": 4100,
    "question": "In the build flow, why must the 'Dead Inspection' be completed and passed before any meter-based testing begins?",
    "options": [
      "To ensure mechanical integrity and correct identification are present, preventing false test results or damage to the rig.",
      "Because the Multi-Function Tester (MFT) will only work if it detects that all screws are tight.",
      "To allow the insulation resistance of the cables to 'settle' before applying 500V DC.",
      "Because the Electricity at Work Regulations mandate that visual inspection always takes longer than testing."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "One-way lighting",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-13B-LO2",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "Visual inspection catches obvious errors (like loose wires or missing CPCs) that would either lead to confusing meter readings or potentially unsafe conditions during testing."
  }
];
