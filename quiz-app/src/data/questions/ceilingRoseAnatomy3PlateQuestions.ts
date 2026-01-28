import { TaggedQuestion } from './types';

/**
 * Ceiling Rose Anatomy (3-plate) Question Bank
 * Aligned with lesson 204-13A learning outcomes
 * Generated: 2026-01-28
 */

export const ceilingRoseAnatomy3PlateQuestions: TaggedQuestion[] = [
  {
    "id": 4051,
    "question": "What are the three main terminal groups found in a standard 3-plate ceiling rose?",
    "options": [
      "Loop, Neutral, and Switched Live",
      "Line, Neutral, and Earth",
      "Feed, Return, and Common",
      "Phase, Neutral, and Loop"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "terminology",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A 3-plate ceiling rose is identified by its three distinct terminal blocks: Loop (permanent live), Neutral, and Switched Live."
  },
  {
    "id": 4052,
    "question": "Which conductor is typically connected to the Loop terminal group in a 3-plate ceiling rose?",
    "options": [
      "The permanent live feed from the consumer unit",
      "The switch return from the light switch",
      "The neutral return from the lamp flex",
      "The circuit protective conductor (CPC)"
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
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Loop terminal acts as a junction for the permanent live supply, connecting the feed in, feed out (to the next rose), and the switch feed."
  },
  {
    "id": 4053,
    "question": "Why is the lamp flex live conductor usually connected to the Switched Live terminal rather than the Loop terminal?",
    "options": [
      "So the lamp can be controlled by the switch",
      "To prevent the lamp from overheating",
      "Because the Loop terminal is only for earthing",
      "To ensure the lamp is always on"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "If the lamp were connected to the Loop terminal, it would be permanently live and stay on constantly. The Switched Live terminal allows the switch to interrupt the circuit."
  },
  {
    "id": 4054,
    "question": "In a 3-plate ceiling rose, which conductors are grouped together in the Neutral terminal?",
    "options": [
      "The neutral feed and the lamp neutral flex",
      "The live feed and the switch return",
      "The switch feed and the lamp live flex",
      "The CPC and the neutral feed"
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
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Neutral terminal group joins the incoming neutral supply, the outgoing neutral to the next point, and the neutral wire from the lamp itself."
  },
  {
    "id": 4055,
    "question": "An electrician is looking at a ceiling rose and sees a terminal with only a 'switch return' and a 'lamp live' connected. Which terminal group is this?",
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
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "discrimination"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Switched Live terminal connects the return wire from the switch to the live wire of the lamp flex."
  },
  {
    "id": 4056,
    "question": "What must be done with the CPC (Circuit Protective Conductor) at a plastic 3-plate ceiling rose?",
    "options": [
      "It must be terminated into the rose's earth terminal and sleeved",
      "It should be cut back as it is not needed for plastic fittings",
      "It must be twisted together with the neutral conductors",
      "It should be left loose inside the rose cover"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Even in plastic accessories, the CPC must be terminated and sleeved to maintain earth continuity for the rest of the circuit."
  },
  {
    "id": 4057,
    "question": "A ceiling rose acts as a 'junction hub'. What is one of the three main 'jobs' it performs in a lighting circuit?",
    "options": [
      "Looping the permanent live through to the next light",
      "Converting AC voltage to DC for the lamp",
      "Increasing the current for the switch",
      "Protecting the circuit from overcurrent"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The rose provides a junction for looping the permanent live feed onwards to other lights in the circuit."
  },
  {
    "id": 4058,
    "question": "During a 'rose-read' check, you find the lamp live flex connected to the Neutral terminal. What is the correct action?",
    "options": [
      "Stop and fix the connection before proceeding",
      "Continue, as the lamp will still work",
      "Ignore it, as long as the earth is connected",
      "Change the switch to a 2-way switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Misplaced conductors can cause short circuits or safety hazards. Incorrect wiring must be corrected before any testing or energising."
  },
  {
    "id": 4059,
    "question": "Which of these conductors goes 'down' to the switch from the Loop terminal?",
    "options": [
      "Switch feed",
      "Switch return",
      "Lamp neutral",
      "Neutral feed"
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
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The switch feed is the permanent live taken from the Loop terminal down to the Common terminal of the switch."
  },
  {
    "id": 4060,
    "question": "What is the primary purpose of the 'Switched Live' terminal group in the 3-plate method?",
    "options": [
      "To connect the switch return to the lamp live flex",
      "To connect the incoming live to the outgoing live",
      "To provide a connection point for all earth wires",
      "To join all the neutral wires together"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Switched Live terminal is the specific junction where the electricity returns from the switch and enters the lamp."
  },
  {
    "id": 4061,
    "question": "What are the three distinct terminal groups found in a standard 3-plate ceiling rose?",
    "options": [
      "Loop, Neutral, and Switched Live",
      "Line, Neutral, and Earth",
      "Supply, Return, and Common",
      "Phase, Neutral, and CPC"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "terminology",
      "discrimination",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "A 3-plate ceiling rose is specifically designed with three terminal groups: the Loop (permanent live), the Neutral, and the Switched Live."
  },
  {
    "id": 4062,
    "question": "In a 3-plate ceiling rose, what is the specific role of the 'Switched Live' terminal group?",
    "options": [
      "To connect the switch return conductor to the lamp live flex",
      "To provide a permanent feed to the next lighting point",
      "To group all the neutral return paths together",
      "To provide a landing point for all circuit protective conductors"
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
      "explanation"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Switched Live terminal is the junction where the return wire from the switch (Switch Return) meets the live wire going to the lamp (Lamp Flex Live)."
  },
  {
    "id": 4063,
    "question": "Which conductor should be connected to the 'Loop' terminal group in a standard one-way lighting circuit?",
    "options": [
      "The switch feed (down to COM)",
      "The lamp flex neutral",
      "The switch return (back from L1)",
      "The lamp flex live"
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
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The Loop terminal holds the permanent live conductors, which includes the incoming supply feed and the feed going down to the 'Common' terminal of the light switch."
  },
  {
    "id": 4064,
    "question": "During a 'rose-read' check, you see a brown conductor from the lamp flex connected to the 'Loop' terminal. What will be the result when the circuit is switched on?",
    "options": [
      "The light will stay on permanently and cannot be switched off",
      "The light will work normally as intended",
      "The light will not come on at all",
      "The circuit protective device will trip immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If the lamp live is connected to the Loop terminal (permanent live), it bypasses the switch entirely, meaning the lamp will remain on as long as the circuit is energized."
  },
  {
    "id": 4065,
    "question": "When wiring a 3-plate ceiling rose, where must the neutral conductor from the lamp flex be connected?",
    "options": [
      "In the Neutral terminal group with the supply neutral",
      "In the Switched Live terminal group with the switch return",
      "In the Loop terminal group with the supply live",
      "In the Earth terminal with the CPC"
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
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "The lamp requires a neutral return to function; therefore, the lamp flex neutral must join the Neutral terminal group where the supply neutral is located."
  },
  {
    "id": 4066,
    "question": "When identifying the three main terminal groups in a standard 3-plate ceiling rose, which selection is correct?",
    "options": [
      "Loop, Neutral, and Switched Live",
      "Line, Neutral, and Earth",
      "Feed, Return, and CPC",
      "Supply, Load, and Neutral"
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
    "explanation": "A 3-plate rose is defined by its three distinct functional groups: the Loop (permanent live), the Neutral group, and the Switched Live group."
  },
  {
    "id": 4067,
    "question": "In a 3-plate lighting circuit, what is the primary conceptual purpose of the 'Loop' terminal group?",
    "options": [
      "To act as a junction for permanent live conductors and the switch feed",
      "To connect the lamp live directly to the switch return",
      "To provide the return path for the current from the lamp flex",
      "To house the circuit protective conductors for earth continuity"
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
    "explanation": "The Loop terminal is a 'permanent live' hub. It keeps the supply continuous for downstream roses and provides the feed that goes down to the switch."
  },
  {
    "id": 4068,
    "question": "An electrician is wiring a ceiling rose. Into which terminal group should the conductor that travels down to the 'Common' (COM) terminal of the light switch be connected?",
    "options": [
      "Loop terminal group",
      "Switched Live terminal group",
      "Neutral terminal group",
      "Earth terminal block"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
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
    "estimatedTime": 75,
    "explanation": "The switch feed (going to COM) must be permanently live, so it is connected to the Loop terminal group along with the supply line-in."
  },
  {
    "id": 4069,
    "question": "Which two conductors are correctly paired together in the 'Switched Live' terminal group of a 3-plate ceiling rose?",
    "options": [
      "The switch return (from L1) and the lamp flex live",
      "The switch feed (to COM) and the lamp flex live",
      "The supply line-in and the switch return (from L1)",
      "The lamp flex neutral and the switch return (from L1)"
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
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "The Switched Live group's job is to connect the 'output' of the switch to the 'input' of the lamp."
  },
  {
    "id": 4070,
    "question": "If a student mistakenly terminates the lamp flex live conductor into the 'Loop' terminal group, what will be the observed result when the circuit is energised?",
    "options": [
      "The lamp will stay on permanently and cannot be switched off",
      "The lamp will not operate regardless of the switch position",
      "The circuit protective device (MCB) will trip immediately",
      "The lamp will flicker because of the high resistance connection"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
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
    "estimatedTime": 75,
    "explanation": "Because the Loop terminal is permanently live, placing the lamp live there bypasses the switch entirely, keeping the light on at all times."
  },
  {
    "id": 4071,
    "question": "During a 'rose-read' check on a plastic ceiling rose, where should the Circuit Protective Conductor (CPC) be terminated?",
    "options": [
      "In the dedicated earth terminal or parking block provided",
      "In the Neutral terminal group to ensure a return path",
      "It should be folded back and insulated as the rose is plastic",
      "In the Loop terminal group to ensure the switch is earthed"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "discrimination",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Even in plastic accessories, the CPC must be terminated in its own terminal to maintain earth continuity throughout the circuit."
  },
  {
    "id": 4072,
    "question": "Why is it critical to perform a visual 'rose-read' inspection before conducting dead-testing with a meter?",
    "options": [
      "To identify misplaced conductors that could cause incorrect operation or faults",
      "To ensure the lamp is of the correct wattage for the circuit",
      "To calculate the total resistance of the lighting circuit",
      "To check if the ceiling rose is aesthetically level"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A visual check (rose-read) catches 'guess-wiring' errors like swapping neutrals and switched lives before they lead to confusing test results or hazards."
  },
  {
    "id": 4073,
    "question": "You open a ceiling rose and see three separate terminal blocks. One block contains only blue conductors (including the blue from the lamp flex). Which group is this?",
    "options": [
      "Neutral group",
      "Loop group",
      "Switched Live group",
      "CPC block"
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
      "discrimination",
      "units"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The Neutral group facilitates the return path and typically contains all neutral conductors, including the feed-in, feed-out, and the lamp flex neutral."
  },
  {
    "id": 4074,
    "question": "In a typical 3-plate wiring scenario, which conductor acts as the link between the switch and the lamp's illumination?",
    "options": [
      "Switch return",
      "Switch feed",
      "Neutral feed",
      "Permanent live"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
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
    "estimatedTime": 60,
    "explanation": "The switch return brings the live current back from the switch to the rose only when the switch is closed, feeding the lamp live."
  },
  {
    "id": 4075,
    "question": "A student is checking a rose and finds a brown conductor from the switch cable connected to a terminal alongside a blue conductor from the lamp flex. Is this correct?",
    "options": [
      "No, this is a 'stop-and-fix' error; the lamp blue belongs in the Neutral group",
      "Yes, this is the standard connection for the Switched Live group",
      "No, the switch cable brown must always be in the Loop group",
      "Yes, because the lamp flex blue is the switched live return"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "WRONG_UNITS"
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
    "explanation": "The lamp flex blue is almost always a neutral and must be in the Neutral group. Connecting it with a switch return (live) would be a wiring error."
  },
  {
    "id": 4076,
    "question": "What is the primary function of the 'Loop' terminal group in a standard 3-plate ceiling rose?",
    "options": [
      "To provide a continuous live path for the circuit and a feed to the switch",
      "To connect the lamp live directly to the supply neutral",
      "To act as the termination point for the switched return and lamp live",
      "To house the circuit protective conductors for earth continuity"
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
      "series",
      "parallel",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Loop terminal maintains the permanent live feed throughout the circuit and provides the 'feed down' to the common terminal of the light switch."
  },
  {
    "id": 4077,
    "question": "Which conductor is typically found connected to the 'Neutral' terminal group in a 3-plate ceiling rose?",
    "options": [
      "The blue core from the lamp flex",
      "The brown core from the switch drop",
      "The live feed from the consumer unit",
      "The switch return (switched live)"
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
      "terminology",
      "application",
      "current-rule"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Neutral group connects the incoming neutral feed, the outgoing neutral feed (if looping out), and the neutral wire from the lamp flex to complete the circuit."
  },
  {
    "id": 4078,
    "question": "An electrician connects the lamp flex live conductor into the 'Loop' terminal by mistake. What will be the operational result?",
    "options": [
      "The lamp will remain permanently on and cannot be switched off",
      "The lamp will not illuminate at all",
      "The circuit protective device will trip immediately",
      "The lamp will only work when the switch is in the 'off' position"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "conceptual",
      "mixed-circuit"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Loop terminal is permanently live. Connecting the lamp flex live here bypasses the switch, meaning the lamp receives power regardless of the switch position."
  },
  {
    "id": 4079,
    "question": "In a 3-plate ceiling rose, which two conductors must be connected together in the 'Switched Live' terminal?",
    "options": [
      "The switch return and the lamp flex live",
      "The switch feed and the lamp flex live",
      "The neutral feed and the lamp flex neutral",
      "The line feed and the switch feed"
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
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The Switched Live terminal is the junction where the return wire from the switch meets the live wire going to the lamp."
  },
  {
    "id": 4080,
    "question": "Why is the CPC (Circuit Protective Conductor) kept in a separate terminal block from the Loop, Neutral, and Switched Live groups?",
    "options": [
      "To ensure earth continuity is maintained independently of the switching arrangement",
      "Because the CPC carries the return current for the lamp",
      "To prevent the CPC from coming into contact with plastic components",
      "Because the CPC is only required if the ceiling rose is made of metal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The CPC terminal ensures that the earth path is continuous throughout the circuit, regardless of whether the light is switched on or off, or what type of fitting is used."
  },
  {
    "id": 4081,
    "question": "During a 'rose-read' inspection, you find a brown conductor with a blue sleeve connected to the 'Loop' terminal. Why is this incorrect?",
    "options": [
      "The sleeve identifies it as a switch return, which belongs in the Switched Live terminal",
      "The Loop terminal should only contain blue neutral conductors",
      "Sleeving is not permitted on conductors within a ceiling rose",
      "The blue sleeve indicates it is a CPC and should be in the earth terminal"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "WRONG_UNITS"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "discrimination",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a switch drop, the return wire is often a blue core sleeved brown (or brown core sleeved blue in some older setups) to indicate it is a switched live. It must go to the Switched Live terminal, not the Loop."
  },
  {
    "id": 4082,
    "question": "Which of these describes the 'junction hub' role of a ceiling rose in a lighting circuit?",
    "options": [
      "It allows the power supply to continue to the next room while providing a connection for the local light",
      "It converts the 230V AC supply into a lower voltage for the lamp flex",
      "It acts as a local isolation point for the lighting circuit",
      "It regulates the frequency of the electricity reaching the lamp"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TRANSFORMER_WITH_AC_DC",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_FREQUENCY_WITH_VOLTAGE"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "application",
      "ac-dc"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The 3-plate ceiling rose acts as a junction box, allowing the main circuit 'loop' to continue to other points while providing the necessary connections for the local lamp and switch."
  },
  {
    "id": 4083,
    "question": "When wiring a 3-plate rose, which terminal group will typically contain the highest number of individual conductors (excluding the earth terminal)?",
    "options": [
      "Loop terminal",
      "Neutral terminal",
      "Switched Live terminal",
      "Lamp flex terminal"
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
      "discrimination",
      "application",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Loop terminal usually has three conductors: Feed In, Feed Out (to the next light), and Switch Feed (down to the switch)."
  },
  {
    "id": 4084,
    "question": "A lighting circuit rig is dead-tested. You notice the lamp neutral is connected to the 'Switched Live' group. What is the likely result if this was energized?",
    "options": [
      "The lamp will not work as it lacks a neutral return path",
      "The lamp will work normally but the switch will be live",
      "The circuit will short-circuit when the switch is turned on",
      "The lamp will stay on permanently"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "conceptual",
      "voltage-rule"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "If the lamp neutral is in the switched live group and not the neutral group, the circuit is incomplete (open) and the lamp will not illuminate."
  },
  {
    "id": 4085,
    "question": "What is the specific purpose of the 'Switch Feed' conductor in a 3-plate wiring system?",
    "options": [
      "To take permanent live power from the rose down to the switch",
      "To carry the switched power back from the switch to the lamp",
      "To provide a neutral path for the switch mechanism",
      "To connect the switch plate to the earth terminal"
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
      "voltage-rule"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The switch feed is the conductor that carries the permanent live from the 'Loop' terminal in the rose down to the 'Common' terminal of the switch."
  },
  {
    "id": 4086,
    "question": "Which conductors are typically found in the 'Loop' terminal group of a 3-plate ceiling rose in a standard lighting circuit?",
    "options": [
      "Line feed in, line feed out, and switch feed (to COM)",
      "Line feed in, switch return (from L1), and lamp live",
      "Line feed in, neutral feed in, and switch feed (to COM)",
      "Switch return (from L1), lamp live, and CPC"
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
      "terminology",
      "application",
      "mixed-circuit"
    ],
    "learningOutcomeId": "204-13A-LO1",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Loop terminal group acts as a junction for permanent live conductors, which includes the incoming supply, the outgoing supply to the next rose, and the feed going down to the switch."
  },
  {
    "id": 4087,
    "question": "Why is a 3-plate ceiling rose referred to as a 'junction hub' in domestic lighting installations?",
    "options": [
      "It provides a connection point for the permanent live, neutral return, and switch lines",
      "It allows for the conversion of AC to DC for modern LED lamps",
      "It acts as the primary overcurrent protection device for the lighting circuit",
      "It is the only point in the circuit where the CPC is connected to the neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_AC_DC_SOURCES",
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
    "explanation": "A 3-plate rose is a junction hub because it manages three distinct circuit functions: looping the permanent live, grouping the neutrals, and connecting the switched live to the lamp."
  },
  {
    "id": 4088,
    "question": "During a visual inspection of a pre-wired rig, an apprentice notices the lamp flex live conductor is connected to the 'Loop' terminal group. What would be the result if this circuit were energized?",
    "options": [
      "The lamp would remain permanently on regardless of the switch position",
      "The lamp would only turn on when the switch is in the 'off' position",
      "The circuit breaker would trip immediately due to a short circuit",
      "The lamp would not light up at all because it lacks a switch return"
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
    "estimatedTime": 90,
    "explanation": "If the lamp live is in the Loop group, it is connected to a permanent live supply. This bypasses the switch entirely, meaning the lamp will stay on as long as the circuit has power."
  },
  {
    "id": 4089,
    "question": "Which pair of conductors must be terminated together in the 'Switched Live' terminal group to ensure correct operation of the light?",
    "options": [
      "The switch return (from L1) and the lamp flex live",
      "The switch feed (from COM) and the lamp flex live",
      "The switch return (from L1) and the neutral feed",
      "The lamp flex live and the lamp flex neutral"
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
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "The Switched Live group's purpose is to connect the return path from the switch to the live side of the lamp flex, completing the circuit only when the switch is closed."
  },
  {
    "id": 4090,
    "question": "Even when installing a plastic ceiling rose that does not require earthing itself, why must the CPC (Circuit Protective Conductor) still be terminated into the earth terminal?",
    "options": [
      "To maintain the continuity of the earth path for the rest of the circuit",
      "To provide a return path for the neutral current in case of a fault",
      "To ensure the loop impedance is high enough to prevent nuisance tripping",
      "Because the CPC is used as a functional earth for the switching mechanism"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "All CPCs must be terminated and continuous throughout the circuit to ensure that any future metal accessories or downstream points are properly earthed."
  },
  {
    "id": 4091,
    "question": "In a 3-plate ceiling rose wiring system, why is it functionally critical that the lamp live conductor is connected to the 'Switched Live' terminal rather than the 'Loop' terminal?",
    "options": [
      "To ensure the switch can interrupt the supply to the lamp while the loop remains energized",
      "Because the Loop terminal is reserved exclusively for neutral conductors in a radial circuit",
      "To prevent the lamp from drawing current directly from the consumer unit's earth bar",
      "Because the Switched Live terminal is the only one with sufficient mechanical clamping force"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "discrimination",
      "voltage-rule"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The Loop terminal provides a permanent live feed to other points in the circuit and the switch. If the lamp were connected here, it would stay on permanently. The Switched Live terminal only becomes live when the switch is closed."
  },
  {
    "id": 4092,
    "question": "During a 'rose-read' inspection of the first light in a circuit, you identify three cables entering the rose. If the 'Loop' terminal contains three brown conductors, what are their most likely functions?",
    "options": [
      "Feed in from CU, feed out to next rose, and feed down to switch COM",
      "Feed in from CU, switch return from L1, and lamp live flex",
      "Neutral feed in, neutral feed out, and lamp neutral flex",
      "Switch feed, switch return, and the circuit protective conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "discrimination",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a standard 3-plate loop-in system, the Loop terminal acts as the junction for the permanent live coming in, the permanent live continuing to the next point, and the feed going down to the switch."
  },
  {
    "id": 4093,
    "question": "An electrician finds that a lamp remains permanently illuminated regardless of the wall switch position. Upon opening the 3-plate rose, which wiring error is the most probable cause?",
    "options": [
      "The lamp flex live has been mistakenly terminated into the Loop terminal group",
      "The switch return has been terminated into the Neutral terminal group",
      "The lamp flex neutral has been terminated into the Switched Live terminal group",
      "The CPC has been used as the switch feed without being sleeved"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "If the lamp flex live is in the Loop group, it is connected to a permanent live supply, bypassing the control of the switch entirely."
  },
  {
    "id": 4094,
    "question": "When performing a 'rose-read' on a dead circuit, you notice a blue conductor sleeved with brown tape is connected to the 'Switched Live' terminal. What does this indicate?",
    "options": [
      "This is the switch return conductor bringing switched power back from the switch L1",
      "The circuit is incorrectly using a neutral as a permanent live feed",
      "The lamp flex neutral has been incorrectly identified as a live conductor",
      "The conductor is a feed out to the next ceiling rose in the radial"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "discrimination",
      "terminology",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In twin and earth cable used for a switch drop, the blue core is used as the switch return and must be sleeved brown to indicate it is a live conductor."
  },
  {
    "id": 4095,
    "question": "In a 3-plate ceiling rose, which terminal group effectively acts as the 'common' return point for both the incoming supply and the connected load?",
    "options": [
      "Neutral terminal group",
      "Loop terminal group",
      "Switched Live terminal group",
      "CPC terminal block"
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
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "The Neutral group connects the incoming neutral feed, the outgoing neutral feed (if looping), and the lamp's neutral flex to complete the return path."
  },
  {
    "id": 4096,
    "question": "What is the primary reason for terminating all Circuit Protective Conductors (CPCs) into a dedicated terminal within a plastic ceiling rose?",
    "options": [
      "To ensure earth continuity is maintained throughout the entire lighting circuit",
      "To provide a path for the lamp to operate if the neutral connection fails",
      "To prevent electromagnetic interference from affecting the LED drivers",
      "To satisfy the requirement for a functional return path for the switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
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
    "explanation": "Even if the accessory is plastic, the CPCs must be joined to ensure that any metal components further down the circuit (like metal switches or other fittings) remain earthed."
  },
  {
    "id": 4097,
    "question": "A student is wiring a training rig and places the 'Switch Feed' and the 'Switch Return' in the same 'Loop' terminal group. What will be the result when the switch is operated?",
    "options": [
      "The switch will be bypassed and have no effect on the lamp",
      "The circuit breaker will trip due to a direct short circuit",
      "The lamp will only illuminate when the switch is in the 'OFF' position",
      "The lamp will blow immediately due to overvoltage"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "SIGN_ERROR",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "application",
      "conceptual"
    ],
    "learningOutcomeId": "204-13A-LO4",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "If both the feed and return are in the Loop group, they are permanently connected together. The switch is effectively 'shorted out' and cannot break the circuit."
  },
  {
    "id": 4098,
    "question": "Which set of conductors would you expect to find in the 'Switched Live' terminal group of a correctly wired 3-plate rose?",
    "options": [
      "One brown conductor (switch return) and one brown flex core (lamp live)",
      "Two brown conductors (feed in and feed out) and one blue flex core",
      "One blue conductor (sleeved brown) and one blue flex core (lamp neutral)",
      "Three brown conductors (feed in, feed out, and switch feed)"
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
    "learningOutcomeId": "204-13A-LO3",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "The Switched Live group's job is to connect the return from the switch to the live side of the lamp flex."
  },
  {
    "id": 4099,
    "question": "During a 'rose-read', you find a terminal group containing only two blue conductors. One is a fixed house wire and the other is a flexible cord. Which group is this?",
    "options": [
      "Neutral group (on the final light of a circuit)",
      "Loop group (on an intermediate light fitting)",
      "Switched Live group (on a standard one-way circuit)",
      "CPC group (where insulated conductors are used)"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "discrimination",
      "application"
    ],
    "learningOutcomeId": "204-13A-LO3",
    "difficulty": 5,
    "estimatedTime": 150,
    "explanation": "On the final light of a radial, there is no 'neutral out', so the neutral group only contains the neutral feed in and the lamp flex neutral."
  },
  {
    "id": 4100,
    "question": "If an electrician fails to sleeve the switch return (blue core) in a ceiling rose, what is the primary risk during future maintenance?",
    "options": [
      "A technician may mistake the live switch return for a neutral conductor",
      "The circuit will develop a high resistance fault at the switch",
      "The lamp will consume more energy due to the lack of identification",
      "The CPC will carry current back to the consumer unit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Electrical Installations Technology",
    "category": "Ceiling Rose Anatomy (3-plate)",
    "tags": [
      "conceptual",
      "health-safety",
      "terminology"
    ],
    "learningOutcomeId": "204-13A-LO2",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Sleeving is vital for safety; without it, a person might assume the blue wire is a neutral (safe to touch relative to earth) when it is actually a live conductor."
  }
];
