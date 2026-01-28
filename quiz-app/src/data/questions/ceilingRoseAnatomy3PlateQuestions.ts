import { TaggedQuestion } from './types';

/**
 * Ceiling Rose Anatomy (3-plate) Question Bank
 * Aligned with lesson 204-13A learning outcomes
 * Generated: 2026-01-28
 */

export const ceilingRoseAnatomy3PlateQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "What are the names of the three main terminal groups found in a standard 3-plate ceiling rose?",
    "options": [
      "Loop, Neutral, and Switched Live",
      "Line, Neutral, and Earth",
      "Feed, Return, and Common",
      "Primary, Secondary, and Earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "terminology",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "A 3-plate ceiling rose is identified by its three distinct terminal blocks: Loop (permanent live), Neutral, and Switched Live."
  },
  {
    "id": 4052,
    "question": "Which terminal group in a 3-plate ceiling rose acts as a junction for the permanent live feed and the switch feed?",
    "options": [
      "Loop terminal",
      "Neutral terminal",
      "Switched Live terminal",
      "Earth terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Loop terminal holds the permanent live conductors together, including the feed from the consumer unit and the feed going down to the switch."
  },
  {
    "id": 4053,
    "question": "Where should the neutral conductor from the lamp flex be connected in a 3-plate ceiling rose?",
    "options": [
      "The Neutral terminal group",
      "The Loop terminal group",
      "The Switched Live terminal group",
      "The Earth terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The lamp requires a neutral return to function, which must be grouped with the other neutral conductors in the Neutral terminal."
  },
  {
    "id": 4054,
    "question": "Why is a 3-plate ceiling rose often described as a 'junction hub' in a lighting circuit?",
    "options": [
      "It provides connection points for the supply, the switch, and the lamp flex",
      "It contains a transformer to step down the voltage for the bulb",
      "It acts as a circuit breaker to protect against overloads",
      "It is only used to hold the weight of the light fitting"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The 3-plate rose acts as a central junction point where the mains supply, the switch wiring, and the lamp flex all meet."
  },
  {
    "id": 4055,
    "question": "An electrician is performing a 'rose-read'. They find the lamp live wire is connected to the Loop terminal. What will be the result?",
    "options": [
      "The light will stay on permanently",
      "The light will never turn on",
      "The light will only work when the switch is off",
      "The circuit breaker will trip immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Loop terminal is permanently live. If the lamp live is connected there, it bypasses the switch and stays on."
  },
  {
    "id": 4056,
    "question": "Which conductor is correctly matched to the Switched Live terminal group?",
    "options": [
      "The switch return (from L1)",
      "The neutral feed from the consumer unit",
      "The permanent live feed in",
      "The CPC (earth) wire"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Switched Live terminal connects the switch return (the wire coming back from the switch) to the lamp's live flex."
  },
  {
    "id": 4057,
    "question": "What must be done with the Circuit Protective Conductor (CPC) at a plastic ceiling rose?",
    "options": [
      "It must be terminated in the earth terminal and sleeved green/yellow",
      "It can be cut off as plastic is an insulator",
      "It should be connected to the Neutral terminal",
      "It must be twisted together with the switch return"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The CPC must always be terminated in its own terminal and identified with green/yellow sleeving to maintain earth continuity."
  },
  {
    "id": 4058,
    "question": "In a typical 3-plate wiring method, how many conductors are usually found in the Loop terminal if the circuit continues to another light?",
    "options": [
      "Three (Feed in, Feed out, Switch feed)",
      "One (Lamp live only)",
      "Two (Neutral in, Neutral out)",
      "Zero (It is left empty)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "conceptual",
      "calculation"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Loop terminal typically holds the supply in, the supply out to the next point, and the feed down to the switch."
  },
  {
    "id": 4059,
    "question": "When inspecting a ceiling rose, what does a 'plastic-in' fault refer to?",
    "options": [
      "The cable insulation is trapped under the terminal screw",
      "The ceiling rose cover is made of the wrong plastic",
      "The CPC sleeve is too long",
      "The mounting screws are made of plastic"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "'Plastic-in' is a common fault where the insulation is clamped by the screw instead of the copper, causing a poor connection."
  },
  {
    "id": 4060,
    "question": "Which terminal group is responsible for providing the return path for the current from the lamp?",
    "options": [
      "Neutral terminal group",
      "Loop terminal group",
      "Switched Live terminal group",
      "Earth terminal group"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "The Neutral terminal group connects all neutral conductors together to provide the return path to the supply."
  },
  {
    "id": 4061,
    "question": "What are the three standard terminal groups found in a 3-plate ceiling rose?",
    "options": [
      "Loop, Neutral, and Switched Live",
      "Line, Load, and Earth",
      "Phase, Neutral, and Ground",
      "Input, Output, and Common"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "terminology",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "A standard 3-plate ceiling rose consists of three distinct terminal blocks: the Loop (permanent live), the Neutral, and the Switched Live."
  },
  {
    "id": 4062,
    "question": "In a 3-plate ceiling rose, what is the primary purpose of the 'Loop' terminal group?",
    "options": [
      "To provide a continuous permanent live feed to the switch and other roses",
      "To connect the lamp flex directly to the neutral supply",
      "To act as the main earthing point for the lighting circuit",
      "To connect the switch return directly to the lamp live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Loop terminal acts as a junction point for the permanent live feed, allowing the supply to continue to the switch and onwards to the next light in the circuit."
  },
  {
    "id": 4063,
    "question": "Which conductor is typically terminated into the Neutral terminal group of a ceiling rose?",
    "options": [
      "The neutral core of the lamp flex",
      "The switch feed going down to the switch COM",
      "The switch return coming back from the switch L1",
      "The permanent live feed from the consumer unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Neutral terminal group connects the incoming neutral supply, the outgoing neutral to the next rose, and the neutral wire from the lamp flex."
  },
  {
    "id": 4064,
    "question": "An electrician is wiring a lamp flex to a 3-plate rose. Where should the live core of the lamp flex be connected?",
    "options": [
      "The Switched Live terminal",
      "The Loop terminal",
      "The Neutral terminal",
      "The Earth terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The lamp live must be connected to the Switched Live terminal so that the lamp can be turned on and off by the switch. Connecting it to the Loop would mean the light is always on."
  },
  {
    "id": 4065,
    "question": "How should the Circuit Protective Conductor (CPC) be treated when terminated at a plastic ceiling rose?",
    "options": [
      "It must be terminated into the earth terminal and identified with green/yellow sleeving",
      "It should be cut back and left inside the rose as the rose is plastic",
      "It should be twisted together with the neutral conductors",
      "It must be connected to the Switched Live terminal to ensure the light works"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "application",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Even in plastic accessories, the CPC must be terminated in a dedicated terminal and correctly sleeved to maintain earth continuity throughout the circuit."
  },
  {
    "id": 4066,
    "question": "In a 3-plate ceiling rose, what is the primary purpose of the 'Loop' terminal group?",
    "options": [
      "To maintain a permanent live supply and provide a feed to the switch",
      "To connect the lamp's live wire for switching control",
      "To group all neutral return paths from the lamp and supply",
      "To provide a parking point for the circuit protective conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Loop terminal is the 'permanent live' hub. It holds the supply live, the live going to the next light (if looping out), and the feed going down to the switch."
  },
  {
    "id": 4067,
    "question": "Which conductor from a 2-core and earth cable (used as a switch drop) should be connected to the Loop terminal?",
    "options": [
      "The permanent live feed (Switch Feed)",
      "The switched live return (Switch Return)",
      "The neutral conductor",
      "The circuit protective conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The switch feed (usually the brown core going to the switch 'Common') must be connected to the Loop terminal to receive permanent power."
  },
  {
    "id": 4068,
    "question": "An electrician is inspecting a rose and finds the 'Lamp Live' flex wire connected to the 'Loop' terminal. What will be the operational result?",
    "options": [
      "The light will stay on permanently and cannot be switched off",
      "The light will only turn on when the switch is closed",
      "The light will not turn on at all",
      "The circuit breaker will trip immediately due to a short circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Because the Loop terminal is permanently live, any lamp connected directly to it will bypass the switch and remain energized."
  },
  {
    "id": 4069,
    "question": "Which terminal group in a 3-plate rose acts as the junction between the switch return wire and the lamp flex live?",
    "options": [
      "Switched Live terminal",
      "Loop terminal",
      "Neutral terminal",
      "Earth terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Switched Live group is the specific junction where the power returning from the switch is linked to the lamp."
  },
  {
    "id": 4070,
    "question": "When wiring a standard lighting circuit, which conductor is typically found in the Neutral terminal group alongside the supply neutral?",
    "options": [
      "The lamp flex neutral",
      "The switch return",
      "The switch feed",
      "The circuit protective conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Neutral terminal group connects the supply neutral to the lamp flex neutral (and the neutral out to the next light, if applicable)."
  },
  {
    "id": 4071,
    "question": "A ceiling rose has 3 terminal blocks. Block A contains two brown wires and one sleeved blue. Block B contains two blue wires and one brown. Block C contains two blue wires and one lamp flex neutral. Which is the Neutral group?",
    "options": [
      "Block C",
      "Block A",
      "Block B",
      "None of these"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The Neutral group must contain the supply neutral wires (blue) and the neutral wire from the lamp flex."
  },
  {
    "id": 4072,
    "question": "Why is it essential to terminate the CPC (Earth) in a dedicated terminal within the ceiling rose, even if the accessory is plastic?",
    "options": [
      "To ensure earth continuity throughout the lighting circuit path",
      "To provide a return path for the normal load current",
      "To allow the lamp to be dimmed correctly",
      "To prevent the permanent live from shorting to the neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The CPC must be continuous throughout the circuit to provide a fault path, regardless of whether the current accessory requires earthing."
  },
  {
    "id": 4073,
    "question": "A lighting circuit 'loops out' of a rose to another room. How many conductors (excluding CPCs) should be found in the Neutral terminal of the first rose?",
    "options": [
      "3 (Neutral in, Neutral out, Lamp neutral)",
      "2 (Neutral in, Lamp neutral)",
      "2 (Neutral in, Neutral out)",
      "4 (Neutral in, Neutral out, Switch feed, Lamp neutral)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "mixed-circuit"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a loop-in system with an onward feed, you need the incoming neutral, the outgoing neutral to the next light, and the neutral for the local lamp."
  },
  {
    "id": 4074,
    "question": "During a 'rose-read' check, you see a brown wire from the lamp flex connected to the Switched Live terminal. What other wire MUST be in that same terminal for the light to work?",
    "options": [
      "The switch return wire",
      "The permanent live feed",
      "The neutral feed",
      "The lamp flex neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Switched Live terminal is the meeting point for the lamp's live wire and the return wire coming back from the switch."
  },
  {
    "id": 4075,
    "question": "What is the primary risk of having 'plastic-in' (insulation trapped under the terminal screw) in a ceiling rose termination?",
    "options": [
      "It creates a high resistance connection which can cause overheating",
      "It will cause the circuit breaker to trip instantly upon being turned on",
      "It will cause the lamp to draw more current than it is rated for",
      "It will reverse the polarity of the lamp connection"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Insulation is a non-conductor. If trapped under a screw, it reduces the contact area of the copper, creating high resistance and potential fire risk."
  },
  {
    "id": 4076,
    "question": "Which three terminal groups are standard within a 3-plate ceiling rose used for junction-box style wiring?",
    "options": [
      "Loop, Neutral, and Switched Live",
      "Line, Neutral, and Earth",
      "Feed, Common, and Return",
      "Phase, Neutral, and CPC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "A 3-plate rose is specifically designed with Loop (permanent live), Neutral, and Switched Live terminals to facilitate the '3-plate' wiring method."
  },
  {
    "id": 4077,
    "question": "In a standard 3-plate lighting circuit, what is the primary purpose of the 'Loop' terminal group?",
    "options": [
      "To maintain a continuous permanent live feed to the switch and further points",
      "To connect the lamp's live core directly to the incoming supply",
      "To provide a common return path for all neutral conductors",
      "To act as the termination point for all circuit protective conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "conceptual",
      "series"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 60,
    "explanation": "The Loop terminal acts as a junction for the permanent live feed, ensuring the supply reaches the switch and continues to other roses in the circuit."
  },
  {
    "id": 4078,
    "question": "An electrician finds the lamp flex's brown (live) core connected to the 'Loop' terminal during an inspection. What would be the practical result of this?",
    "options": [
      "The lamp will stay on permanently and cannot be switched off",
      "The lamp will not illuminate at all when the switch is operated",
      "The circuit breaker will trip immediately due to a short circuit",
      "The lamp will only illuminate when the switch is in the 'off' position"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The Loop terminal is permanently live. If the lamp flex is connected here instead of the Switched Live terminal, it bypasses the switch entirely."
  },
  {
    "id": 4079,
    "question": "Which combination of conductors would you expect to find in the 'Neutral' terminal block of a ceiling rose that is midway through a circuit?",
    "options": [
      "Neutral feed in, neutral feed out, and lamp neutral",
      "Neutral feed in, switch return, and lamp neutral",
      "Neutral feed in, neutral feed out, and CPC",
      "Neutral feed in and switch feed"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Neutral terminal groups all neutral conductors together: the incoming supply, the outgoing supply to the next light, and the return from the lamp itself."
  },
  {
    "id": 4080,
    "question": "Why is the CPC (Circuit Protective Conductor) terminated in a separate block or terminal rather than one of the three main plates?",
    "options": [
      "To ensure the earth continuity path is kept separate from functional live and neutral parts",
      "Because plastic ceiling roses do not require the CPC to be connected",
      "To allow the CPC to be used as a switch return in an emergency",
      "To prevent the CPC from coming into contact with the lamp flex"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The CPC is for safety and must be kept electrically separate from the functional current-carrying conductors (Loop, Neutral, Switched Live)."
  },
  {
    "id": 4081,
    "question": "When wiring a one-way switch from a 3-plate rose, which terminal group must the 'Switch Return' (the wire coming back from the switch) be connected to?",
    "options": [
      "The Switched Live terminal group",
      "The Loop terminal group",
      "The Neutral terminal group",
      "The Earth terminal block"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The switch return provides power to the lamp only when the switch is closed, so it must connect to the Switched Live terminal which also holds the lamp live."
  },
  {
    "id": 4082,
    "question": "During a 'rose-read' check, an electrician identifies a blue core with brown sleeving connected to a terminal with the lamp's brown flex. Which terminal is this?",
    "options": [
      "Switched Live",
      "Loop",
      "Neutral",
      "Earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The blue core with brown sleeving is the switch return. Since it is connected to the lamp flex live (brown), they must be in the Switched Live terminal."
  },
  {
    "id": 4083,
    "question": "What is the likely result of accidentally placing the 'Neutral Feed Out' conductor into the 'Switched Live' terminal group?",
    "options": [
      "Downstream lights will only have a neutral path when the current light is switched on",
      "The current lamp will explode due to over-voltage",
      "The switch will control the neutral path instead of the live path",
      "The circuit will function normally but the CPC will become live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "If the outgoing neutral is in the switched live group, the neutral circuit for the rest of the lights is broken unless the switch is closed."
  },
  {
    "id": 4084,
    "question": "A ceiling rose at the very end of a circuit contains one Twin & Earth supply cable, one Twin & Earth switch drop, and the lamp flex. How many conductors (excluding CPCs) should be in the Loop terminal?",
    "options": [
      "Two (Line feed in and Switch feed)",
      "Three (Line feed in, Switch feed, and Switch return)",
      "One (Line feed in only)",
      "Two (Line feed in and Lamp live)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "application",
      "calculation"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The Loop terminal needs the incoming permanent live and the feed going down to the switch. The switch return and lamp live go to the Switched Live terminal."
  },
  {
    "id": 4085,
    "question": "Which of the following describes the 'Rose Mindset' required for safe electrical installation?",
    "options": [
      "Viewing the rose as a junction hub that loops lives, groups neutrals, and connects the switched lamp",
      "Treating the rose as a simple two-terminal connection point for a light bulb",
      "Assuming all brown wires in the rose are switched lives controlled by the wall switch",
      "Prioritising the mechanical tightness of the lamp flex over the circuit conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The 'Rose Mindset' involves understanding the rose as a multi-functional junction hub for the entire lighting circuit, not just a single light."
  },
  {
    "id": 4086,
    "question": "In a standard 3-plate ceiling rose wiring arrangement, which three conductors are typically found terminated together in the 'Loop' terminal group?",
    "options": [
      "Line feed in, Line feed out, and Switch feed (to COM)",
      "Line feed in, Switch return, and Lamp live",
      "Line feed in, Neutral feed, and Lamp neutral",
      "Line feed in, Line feed out, and Lamp live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "terminology",
      "application",
      "mixed-circuit"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Loop terminal is the permanent live hub. It connects the incoming supply, the outgoing supply to the next rose, and the feed going down to the switch common."
  },
  {
    "id": 4087,
    "question": "What is the primary function of the 'Switched Live' terminal group within a 3-plate ceiling rose?",
    "options": [
      "To provide a connection point between the switch return and the lamp flex live",
      "To provide a continuous live feed to the next lighting point in the circuit",
      "To connect the neutral return from the lamp to the supply neutral",
      "To act as a common termination point for all circuit protective conductors"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Switched Live terminal is the junction where the return wire from the switch meets the live wire going to the lamp, ensuring the switch controls the light."
  },
  {
    "id": 4088,
    "question": "An electrician performs a 'rose-read' and finds the lamp flex live conductor is connected to the 'Loop' terminal group. What would be the result when the circuit is energised?",
    "options": [
      "The lamp will stay on permanently and cannot be turned off by the switch",
      "The lamp will only turn on when the switch is in the 'off' position",
      "The lamp will not illuminate at all regardless of the switch position",
      "The circuit breaker will trip immediately due to a short circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "discrimination",
      "mixed-circuit"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The Loop terminal is permanently live. If the lamp flex is connected here, it bypasses the switch entirely, causing the lamp to remain on at all times."
  },
  {
    "id": 4089,
    "question": "When terminating the Circuit Protective Conductor (CPC) in a plastic 3-plate ceiling rose, which of the following practices is required?",
    "options": [
      "The CPC must be terminated in the dedicated earth terminal and identified with green/yellow sleeving",
      "The CPC should be cut back and insulated as the rose is made of non-conductive plastic",
      "The CPC must be twisted together with the neutral conductors to ensure a path to earth",
      "The CPC should be connected to the 'Loop' terminal to ensure the fitting is grounded"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "health-safety",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Even in plastic accessories, the CPC must be maintained for circuit continuity, terminated in the earth terminal, and correctly identified with sleeving."
  },
  {
    "id": 4090,
    "question": "Which conductors are typically found in the 'Neutral' terminal group of a 3-plate ceiling rose used in a 'loop-in' lighting system?",
    "options": [
      "Neutral feed in, Neutral feed out, and Lamp flex neutral",
      "Neutral feed in, Switch return, and Lamp flex neutral",
      "Neutral feed in, Neutral feed out, and Switch feed",
      "Neutral feed in, Lamp flex live, and Lamp flex neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Neutral group acts as the return path hub, connecting the incoming neutral, the neutral continuing to the next point, and the neutral from the lamp itself."
  },
  {
    "id": 4091,
    "question": "During a 'rose-read' inspection of a 3-plate ceiling rose, an electrician notices the lamp's brown flex conductor is connected to the terminal containing the supply line-in and the switch feed. What will be the operational result of this connection?",
    "options": [
      "The lamp will remain illuminated regardless of the switch position.",
      "The lamp will only illuminate when the switch is in the 'on' position.",
      "A short circuit will occur as soon as the circuit is energised.",
      "The lamp will not illuminate because the neutral path is broken."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "discrimination",
      "calculation"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The supply line-in and switch feed are part of the 'Loop' (Permanent Live) group. Connecting the lamp live directly to this group bypasses the switch, meaning the lamp receives a permanent supply."
  },
  {
    "id": 4092,
    "question": "A 3-plate ceiling rose is positioned in the middle of a lighting radial circuit. How many individual circuit conductors (excluding the lamp flex and CPCs) should be terminated in the 'Loop' terminal group?",
    "options": [
      "3",
      "2",
      "4",
      "1"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "calculation",
      "series",
      "parallel"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "In a middle-of-run rose, the Loop terminal must hold the 'Feed In', the 'Feed Out' to the next rose, and the 'Switch Feed' down to the local switch."
  },
  {
    "id": 4093,
    "question": "Which specific conductors are expected to be found sharing the 'Switched Live' terminal block in a correctly wired 3-plate ceiling rose setup?",
    "options": [
      "The switch return (L1) and the lamp flex live.",
      "The switch feed (COM) and the lamp flex live.",
      "The supply line-in and the switch return (L1).",
      "The lamp flex live and the lamp flex neutral."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The Switched Live terminal acts as the bridge between the control (switch return) and the load (lamp live)."
  },
  {
    "id": 4094,
    "question": "Why is it considered critical to terminate and sleeve the CPC in a plastic 3-plate ceiling rose, even if the light fitting is Class II (double insulated)?",
    "options": [
      "To maintain the continuity of the protective path for the rest of the circuit.",
      "To provide a functional return path for the lamp's neutral current.",
      "To prevent electromagnetic interference from the permanent live loop.",
      "To ensure the plastic accessory is correctly bonded to the main earth terminal."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The CPC must be continuous throughout the circuit to protect any subsequent Class I fittings or metal components, regardless of the current fitting's class."
  },
  {
    "id": 4095,
    "question": "An electrician finds a ceiling rose where the 'Switch Return' (identified with brown sleeving) has been mistakenly placed into the Neutral terminal group. What is the likely result when the switch is turned 'ON'?",
    "options": [
      "A short circuit will occur between line and neutral.",
      "The lamp will flicker due to high resistance.",
      "The lamp will function normally but the switch will be live.",
      "The circuit breaker will trip only when the switch is 'OFF'."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "SIGN_ERROR"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "The Switch Return is connected to the Live Feed at the switch. If it returns to a Neutral terminal, closing the switch creates a direct path between Line and Neutral, causing a short circuit."
  },
  {
    "id": 4096,
    "question": "In the context of a 3-plate ceiling rose, what is the primary 'junction hub' function of the Neutral terminal group?",
    "options": [
      "Providing a common return path for the lamp and the downstream circuit.",
      "Acting as the primary connection point for the circuit protective conductor.",
      "Linking the switch feed to the switch return to complete the loop.",
      "Separating the permanent live from the switched live for safety isolation."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The Neutral group ensures that the lamp has a return path and that the neutral continuity is maintained for any further points on the radial circuit."
  },
  {
    "id": 4097,
    "question": "A student is wiring a 'dead rig' and has 2 cables entering the rose (Feed In and Switch Drop) plus the lamp flex. What is the total number of insulated wire ends that must be stripped and terminated into the three main terminal blocks?",
    "options": [
      "6",
      "4",
      "8",
      "5"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "UNITS_MISSING"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "calculation",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Feed In (2: L, N), Switch Drop (2: Feed, Return), Lamp Flex (2: L, N). 2+2+2 = 6. CPCs are excluded as per the question context of the 'three main blocks'."
  },
  {
    "id": 4098,
    "question": "During a circuit inspection, you find a blue conductor sleeved with brown tape connected to a terminal with only one other brown conductor (which leads to the lamp). Identify this terminal group.",
    "options": [
      "Switched Live",
      "Loop (Permanent Live)",
      "Neutral",
      "Earth (CPC)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The blue wire sleeved brown is the Switch Return. Since it is paired with the lamp live, this must be the Switched Live terminal group."
  },
  {
    "id": 4099,
    "question": "What is the conceptual difference between the 'Switch Feed' and the 'Switch Return' in a 3-plate rose wiring system?",
    "options": [
      "The feed is permanently live; the return is only live when the switch is closed.",
      "The feed is neutral; the return is live when the switch is closed.",
      "The feed goes to the lamp; the return goes to the consumer unit.",
      "The feed is the CPC; the return is the live conductor."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "The Switch Feed is taken from the permanent live Loop. The Switch Return only carries current back to the Switched Live terminal when the switch contact is closed."
  },
  {
    "id": 4100,
    "question": "While performing a 'stop-and-fix' check, you notice a 3-plate rose where the Loop terminal contains: Supply Line-In, Supply Line-Out, and the Lamp Flex Live. What is the primary error in this configuration?",
    "options": [
      "The lamp will be permanently on and cannot be switched.",
      "The circuit will suffer from a high resistance neutral fault.",
      "The switch will cause a short circuit when operated.",
      "The downstream lights will only work when this lamp is on."
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "USED_SERIES_RULE"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "By placing the Lamp Flex Live in the Loop group, it is connected directly to the permanent supply, bypassing the switch entirely."
  }
];
