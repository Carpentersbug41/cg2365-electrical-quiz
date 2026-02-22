import { TaggedQuestion } from './types';

/**
 * Socket Circuits (Noob Level 1) Question Bank
 * Aligned with lesson 201-203-SC1A learning outcomes
 * Generated: 2026-02-22
 */

export const socketCircuitsNoobLevel1Questions: TaggedQuestion[] = [
  {
    "id": 4016,
    "question": "What is the primary purpose of a socket circuit in a domestic installation?",
    "options": [
      "To provide electricity to plug-in appliances via socket outlets",
      "To provide a permanent connection for fixed lighting only",
      "To generate electricity from the consumer unit to the grid",
      "To act as the main earthing terminal for the whole building"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_AC_DC_SOURCES",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Socket Circuits",
    "category": "Terminology",
    "tags": [
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A socket circuit's main job is to supply power to socket outlets so that portable appliances can be used."
  },
  {
    "id": 4017,
    "question": "Which conductor provides the normal return path for current from a socket back to the consumer unit?",
    "options": [
      "Neutral",
      "Line",
      "Earth (CPC)",
      "Circuit Breaker"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Socket Circuits",
    "category": "Circuit Rules",
    "tags": [
      "current-rule",
      "terminology"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "In a standard circuit, current flows out on the Line conductor and returns on the Neutral conductor."
  },
  {
    "id": 4018,
    "question": "A circuit starts at the consumer unit, connects to three sockets, and finishes at the very last socket. What type of circuit is this?",
    "options": [
      "Radial",
      "Ring final",
      "Series loop",
      "Parallel ring"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Socket Circuits",
    "category": "Topology Identification",
    "tags": [
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit runs from the source and ends at the final point of utilization without returning to the source."
  },
  {
    "id": 4019,
    "question": "A circuit leaves the consumer unit, connects to several sockets, and the cable returns back to the same consumer unit. What is this topology called?",
    "options": [
      "Ring final",
      "Radial",
      "Series circuit",
      "Dead-end circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Socket Circuits",
    "category": "Topology Identification",
    "tags": [
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A ring final circuit forms a complete loop by returning to its origin at the consumer unit."
  },
  {
    "id": 4020,
    "question": "You notice a cracked socket faceplate with exposed metal parts. What is the correct immediate action for a Level 2 student?",
    "options": [
      "Stop work and report the hazard to a supervisor",
      "Cover it with electrical tape and continue working",
      "Attempt to replace the socket faceplate immediately",
      "Ignore it as long as no appliances are plugged in"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Health and Safety",
    "category": "Hazard Reporting",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "201-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Safety regulations require reporting hazards that exceed your level of responsibility or training immediately."
  },
  {
    "id": 4021,
    "question": "In a standard UK socket circuit, which conductor is specifically designed to provide safety by carrying fault current to earth?",
    "options": [
      "Earth (CPC)",
      "Line",
      "Neutral",
      "Phase"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Socket Circuits",
    "category": "Circuit Rules",
    "tags": [
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Circuit Protective Conductor (CPC) or Earth wire is the safety path for fault currents."
  },
  {
    "id": 4022,
    "question": "Why are sockets in a circuit connected so that they work independently of each other?",
    "options": [
      "So that unplugging one appliance does not turn off all the others",
      "To ensure the total resistance of the circuit increases with every socket",
      "To make the installation of the cable much easier and cheaper",
      "To prevent the Earth wire from carrying any current during a fault"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Socket Circuits",
    "category": "Conceptual",
    "tags": [
      "conceptual",
      "parallel"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Sockets are effectively in parallel so that each outlet provides a constant supply regardless of other outlets."
  },
  {
    "id": 4023,
    "question": "What is the correct sequence of components for power flowing to an appliance in a radial circuit?",
    "options": [
      "Consumer Unit -> Cable -> Socket Outlet -> Appliance",
      "Appliance -> Socket Outlet -> Cable -> Consumer Unit",
      "Consumer Unit -> Appliance -> Socket Outlet -> Earth",
      "Socket Outlet -> Consumer Unit -> Cable -> Appliance"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Socket Circuits",
    "category": "Circuit Path",
    "tags": [
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Power starts at the source (CU), travels through the wiring to the outlet, and finally into the load (appliance)."
  },
  {
    "id": 4024,
    "question": "Which item of PPE is a minimum requirement when working on a construction site where socket circuits are being installed?",
    "options": [
      "Safety footwear",
      "Welding mask",
      "Full chemical respirator",
      "Rubber gauntlets for dead testing"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Health and Safety",
    "category": "PPE",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "201-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Safety footwear is a standard requirement on site to protect against impact and sharp objects."
  },
  {
    "id": 4025,
    "question": "Which conductor is responsible for carrying the 'live' power from the consumer unit to the sockets?",
    "options": [
      "Line",
      "Neutral",
      "Earth (CPC)",
      "Return"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Socket Circuits",
    "category": "Circuit Rules",
    "tags": [
      "calculation",
      "terminology"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "The Line conductor (formerly called Live) is the one that carries the potential to the load."
  },
  {
    "id": 4026,
    "question": "Which type of socket circuit is designed to start at the consumer unit and end at the very last socket outlet without returning to the start?",
    "options": [
      "A radial circuit",
      "A ring final circuit",
      "A loop circuit",
      "A series circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Socket Circuits (Noob Level 1)",
    "category": "Circuit Types",
    "tags": [
      "terminology",
      "conceptual",
      "discrimination"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit runs from the consumer unit and terminates at the final point of use, unlike a ring final circuit which returns to the source."
  },
  {
    "id": 4027,
    "question": "A standard single-phase socket circuit requires a Line, a Neutral, and a Circuit Protective Conductor (CPC). What is the total number of individual conductors required for this circuit?",
    "options": [
      "3",
      "2",
      "4",
      "1"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Socket Circuits (Noob Level 1)",
    "category": "Circuit Components",
    "tags": [
      "calculation",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 30,
    "explanation": "A standard circuit uses three conductors: Line (power), Neutral (return), and CPC (safety/earth)."
  },
  {
    "id": 4028,
    "question": "While working on a socket circuit, you identify a hazard that you are not trained or authorized to deal with. What is the correct procedure to follow?",
    "options": [
      "Report the hazard to a supervisor or responsible person",
      "Attempt to fix the hazard yourself to save time",
      "Ignore the hazard and continue with your assigned task",
      "Ask a fellow student to fix the hazard for you"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Health and Safety 2365 Level 2",
    "category": "Procedures",
    "tags": [
      "health-safety",
      "legislation",
      "application"
    ],
    "learningOutcomeId": "201-LO2",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Safety regulations require that any hazard exceeding your level of responsibility must be reported to a supervisor or responsible person immediately."
  },
  {
    "id": 4029,
    "question": "In a standard radial socket circuit, how many 'Line' conductor ends are connected to the protective device (circuit breaker) in the consumer unit?",
    "options": [
      "1",
      "2",
      "3",
      "0"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Socket Circuits (Noob Level 1)",
    "category": "Circuit Topology",
    "tags": [
      "radial",
      "calculation",
      "discrimination"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "A radial circuit has only one run of cable leaving the consumer unit, meaning only one Line conductor end is connected to the circuit breaker."
  },
  {
    "id": 4030,
    "question": "In a ring final circuit, how many 'Neutral' conductor ends are connected to the neutral bar in the consumer unit for that specific circuit?",
    "options": [
      "2",
      "1",
      "3",
      "4"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_SERIES_RULE",
      "2": "OTHER",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Socket Circuits (Noob Level 1)",
    "category": "Circuit Topology",
    "tags": [
      "parallel",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 1,
    "estimatedTime": 45,
    "explanation": "Because a ring final circuit forms a complete loop, both ends of the cable return to the consumer unit, resulting in two Neutral conductor ends."
  },
  {
    "id": 4031,
    "question": "An electrician is identifying a circuit that leaves the consumer unit, loops through several socket outlets, and returns back to the same protective device in the consumer unit. This circuit is classified as a:",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Parallel spur circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Socket Circuits",
    "category": "Circuit Types",
    "tags": [
      "parallel",
      "terminology",
      "conceptual"
    ],
    "learningOutcomeId": "201-203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit is characterized by starting and ending at the same point in the consumer unit, forming a continuous loop."
  },
  {
    "id": 4032,
    "question": "A portable heater with a resistance of 52.9Ω is plugged into a standard 230V socket. Calculate the current drawn by the appliance.",
    "options": [
      "4.35 A",
      "12,167 A",
      "0.23 A",
      "282.9 A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "FORMULA_NOT_REARRANGED"
    },
    "section": "Socket Circuits",
    "category": "Calculation",
    "tags": [
      "ohms-law",
      "calculation",
      "units"
    ],
    "learningOutcomeId": "201-203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using Ohm's Law (I = V / R), 230V / 52.9Ω = 4.347... which rounds to 4.35A."
  },
  {
    "id": 4033,
    "question": "When installing a new radial socket circuit in a building constructed in the 1970s, an electrician discovers grey fibrous material inside a wall cavity. According to Health and Safety procedures, what is the first action to take?",
    "options": [
      "Stop work immediately and report the suspected asbestos",
      "Put on a standard dust mask and continue drilling",
      "Wet the material down and clear it into a bin",
      "Vacuum the dust to keep the work area clean"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Health and Safety",
    "category": "Application",
    "tags": [
      "health-safety",
      "legislation"
    ],
    "learningOutcomeId": "201-201-SC1A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "If asbestos is suspected, work must stop immediately to prevent fiber release, and the situation must be reported to a supervisor."
  },
  {
    "id": 4034,
    "question": "A socket circuit is protected by a 32A MCB. If two appliances are connected, one drawing 13A and another drawing 10A, what is the total current and the remaining capacity of the circuit?",
    "options": [
      "23A total, 9A capacity remaining",
      "3A total, 29A capacity remaining",
      "23A total, 32A capacity remaining",
      "130A total, 0A capacity remaining"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Socket Circuits",
    "category": "Calculation",
    "tags": [
      "current-rule",
      "calculation",
      "parallel"
    ],
    "learningOutcomeId": "201-203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 75,
    "explanation": "In a parallel circuit (sockets), currents add up. 13A + 10A = 23A. Remaining capacity is 32A - 23A = 9A."
  },
  {
    "id": 4035,
    "question": "Which conductor in a socket circuit is specifically designed to provide a low-resistance path to earth to trigger the protective device during a fault?",
    "options": [
      "Circuit Protective Conductor (CPC)",
      "Neutral conductor",
      "Line conductor",
      "Bonding conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Socket Circuits",
    "category": "Conceptual",
    "tags": [
      "terminology",
      "safety"
    ],
    "learningOutcomeId": "201-203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "The CPC (Circuit Protective Conductor) connects the metalwork of the installation to earth to ensure safety during a fault."
  },
  {
    "id": 4036,
    "question": "An electrician needs to calculate the total power consumption of three 500W appliances plugged into a radial circuit. What is the total power in kilowatts (kW)?",
    "options": [
      "1.5 kW",
      "1500 kW",
      "0.5 kW",
      "1.15 kW"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "WRONG_UNITS",
      "2": "OTHER",
      "3": "ROUNDING_ERROR"
    },
    "section": "Socket Circuits",
    "category": "Calculation",
    "tags": [
      "power",
      "units",
      "conversion"
    ],
    "learningOutcomeId": "201-203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Total power = 500W + 500W + 500W = 1500W. To convert to kW, divide by 1000, giving 1.5 kW."
  },
  {
    "id": 4037,
    "question": "What is the primary reason for performing a 'Safe Isolation' procedure before replacing a broken socket outlet faceplate?",
    "options": [
      "To prevent electric shock and ensure the circuit is dead",
      "To save energy while the repair is being made",
      "To test if the circuit breaker is working correctly",
      "To prevent the neutral wire from touching the earth"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Health and Safety",
    "category": "Conceptual",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "201-201-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Safe isolation is the mandatory process used to ensure that electrical equipment is dead and safe to work on."
  },
  {
    "id": 4038,
    "question": "A radial circuit has a voltage drop of 4.6V when a 20A load is applied. Calculate the total resistance of the circuit cable.",
    "options": [
      "0.23 Ω",
      "92 Ω",
      "4.34 Ω",
      "24.6 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Socket Circuits",
    "category": "Calculation",
    "tags": [
      "ohms-law",
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "201-203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using Ohm's Law (R = V / I), 4.6V / 20A = 0.23Ω."
  },
  {
    "id": 4039,
    "question": "If a fire occurs in a plastic consumer unit while testing a socket circuit, which type of fire extinguisher is the most suitable to use?",
    "options": [
      "Carbon Dioxide (CO2)",
      "Water",
      "Foam",
      "Wet Chemical"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Health and Safety",
    "category": "Application",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "201-201-SC1A-LO4",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "CO2 extinguishers are non-conductive and suitable for electrical fires, unlike water or foam which can conduct electricity."
  },
  {
    "id": 4040,
    "question": "A ring final circuit is wired with 2.5mm² cable. If the circuit is split at one socket, effectively becoming two radial circuits, how does this affect the path of the current returning to the consumer unit?",
    "options": [
      "Current can no longer return through two paths, increasing the load on the cable",
      "The current will stop flowing entirely to all sockets",
      "The current will double in speed to compensate",
      "The voltage will drop to zero at all sockets"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Socket Circuits",
    "category": "Conceptual",
    "tags": [
      "parallel",
      "current-rule",
      "conceptual"
    ],
    "learningOutcomeId": "201-203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "A ring circuit allows current to flow in two directions. If the ring is broken, the 'loop' is lost, meaning current only has one path, which may lead to cable overloading."
  },
  {
    "id": 4041,
    "question": "Which characteristic best describes a Ring Final circuit in a domestic installation?",
    "options": [
      "The circuit conductors form a continuous loop starting and finishing at the consumer unit",
      "The circuit conductors run in a single line and terminate at the furthest socket outlet",
      "The circuit uses only two conductors (Line and Neutral) to save on cable costs",
      "The circuit is designed so that all appliances are connected in a series configuration"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "USED_SERIES_RULE"
    },
    "section": "Socket Circuits",
    "category": "Topology Identification",
    "tags": [
      "conceptual",
      "units",
      "terminology"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit is unique because the phase, neutral, and CPC conductors form a complete loop, returning to the same protective device in the consumer unit."
  },
  {
    "id": 4042,
    "question": "An electrician is tasked with replacing a damaged socket outlet. According to safe isolation procedures, what is the final step before touching the terminals?",
    "options": [
      "Verify the circuit is dead using a calibrated voltage indicator and proving unit",
      "Turn off the main switch on the consumer unit and assume it is safe",
      "Use a non-contact voltage 'pen' to check for the presence of electricity",
      "Check that the homeowner has switched off their appliances"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Health and Safety",
    "category": "Safe Isolation",
    "tags": [
      "health-safety",
      "application"
    ],
    "learningOutcomeId": "201-LO3-AC3.8",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Safe isolation requires a specific test-prove-test procedure using a dedicated voltage indicator and a proving unit to confirm the circuit is dead."
  },
  {
    "id": 4043,
    "question": "A radial circuit serves three sockets in a line. If the resistance of the Line conductor is 0.15Ω between each socket, what is the total Line resistance from the consumer unit to the third (final) socket?",
    "options": [
      "0.45Ω",
      "0.15Ω",
      "0.05Ω",
      "0.30Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "RECIPROCAL_ERROR",
      "3": "ROUNDING_ERROR"
    },
    "section": "Socket Circuits",
    "category": "Resistance Calculation",
    "tags": [
      "calculation",
      "series",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "In a radial circuit, the conductors act as a series path. Therefore, resistances are added together: 0.15 + 0.15 + 0.15 = 0.45Ω."
  },
  {
    "id": 4044,
    "question": "Why is the Circuit Protective Conductor (CPC) essential when wiring a metal-clad socket outlet?",
    "options": [
      "To provide a low-resistance path for fault current to earth, triggering the protective device",
      "To provide a return path for the current during normal operation of the appliance",
      "To increase the total resistance of the circuit to prevent overheating",
      "To ensure that the Neutral voltage stays at exactly 230V at all times"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_I_V_R",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "TOPOLOGY_CONFUSION"
    },
    "section": "Socket Circuits",
    "category": "Safety Components",
    "tags": [
      "conceptual",
      "health-safety"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The CPC ensures that if a fault occurs and the metal casing becomes live, the current flows to earth, causing the circuit breaker or fuse to trip."
  },
  {
    "id": 4045,
    "question": "A 230V socket circuit has a 2.3kW heater and a 460W television running simultaneously. What is the total current being drawn from the supply?",
    "options": [
      "12A",
      "10A",
      "2A",
      "27.6A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "UNITS_MISSING"
    },
    "section": "Socket Circuits",
    "category": "Current Calculation",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 100,
    "explanation": "Total Power = 2300W + 460W = 2760W. Using I = P / V: 2760 / 230 = 12A."
  },
  {
    "id": 4046,
    "question": "While drilling a wall to install a new radial socket, an apprentice notices a grey, fibrous material behind the plasterboard. What is the most appropriate action?",
    "options": [
      "Stop work immediately, vacate the area, and report the suspected asbestos to a supervisor",
      "Put on a standard disposable dust mask and continue drilling to finish the task",
      "Spray the material with water to keep the dust down and continue the installation",
      "Vacuum the area thoroughly and dispose of the waste in a standard domestic bin"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "OTHER",
      "3": "OTHER"
    },
    "section": "Health and Safety",
    "category": "Hazard Identification",
    "tags": [
      "application",
      "legislation",
      "health-safety"
    ],
    "learningOutcomeId": "201-LO4-AC4.8",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Suspected asbestos must never be disturbed. The correct procedure is to stop work and report it for professional assessment."
  },
  {
    "id": 4047,
    "question": "During a dead test on a ring final circuit, the resistance of one full loop of the Line conductor (r1) is measured at 0.6Ω. If the ring is perfectly balanced, what would be the expected resistance of the Neutral loop (rn)?",
    "options": [
      "0.6Ω",
      "0.3Ω",
      "1.2Ω",
      "0.15Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "MULTIPLIED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Socket Circuits",
    "category": "Resistance Calculation",
    "tags": [
      "calculation",
      "resistance-rule"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "In a standard ring final circuit using twin and earth cable, the Line and Neutral conductors have the same cross-sectional area, so their loop resistances (r1 and rn) should be identical."
  },
  {
    "id": 4048,
    "question": "If a radial circuit is protected by a 20A circuit breaker, which combination of appliances would likely cause the breaker to trip due to overload?",
    "options": [
      "A 3kW kettle and a 2.5kW heater",
      "A 1kW vacuum cleaner and a 500W computer",
      "Two 1.5kW heaters",
      "Ten 100W light bulbs"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "ROUNDING_ERROR",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Socket Circuits",
    "category": "Application",
    "tags": [
      "calculation",
      "application",
      "power"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 120,
    "explanation": "Total power = 3000W + 2500W = 5500W. Current = 5500 / 230 ≈ 23.9A, which exceeds the 20A breaker rating."
  },
  {
    "id": 4049,
    "question": "A radial circuit has a total resistance of 0.8Ω. If a fault occurs at the end of the circuit with a voltage of 230V, what is the initial fault current?",
    "options": [
      "287.5A",
      "184A",
      "0.003A",
      "230.8A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "MULTIPLIED_INSTEAD",
      "2": "DIVIDED_INSTEAD",
      "3": "SIGN_ERROR"
    },
    "section": "Socket Circuits",
    "category": "Calculation",
    "tags": [
      "calculation",
      "ohms-law",
      "current-rule"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using Ohm's Law (I = V / R): 230V / 0.8Ω = 287.5A."
  },
  {
    "id": 4050,
    "question": "In a standard UK socket outlet, to which terminal should the green and yellow striped conductor be connected?",
    "options": [
      "The terminal marked with the Earth symbol or 'E'",
      "The terminal marked 'L' for Line",
      "The terminal marked 'N' for Neutral",
      "The terminal marked 'S' for Switch"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Socket Circuits",
    "category": "Discrimination",
    "tags": [
      "conceptual",
      "terminology"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 45,
    "explanation": "Green and yellow is the identification color for the Circuit Protective Conductor (Earth)."
  },
  {
    "id": 4051,
    "question": "An electrician is inspecting a consumer unit and observes two separate 2.5mm² Line conductors connected into the same 32A Type B circuit breaker. Which circuit type is most likely being identified?",
    "options": [
      "Ring final circuit",
      "Radial circuit",
      "Series circuit",
      "Parallel spur"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "USED_SERIES_RULE",
      "3": "CONFUSED_TERMINOLOGY"
    },
    "section": "Socket Circuits",
    "category": "Circuit Identification",
    "tags": [
      "ring-final",
      "radial",
      "conceptual"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "A ring final circuit starts and ends at the consumer unit, meaning two sets of conductors (Line, Neutral, and CPC) will be connected to the protective device and terminals."
  },
  {
    "id": 4052,
    "question": "A radial socket circuit is protected by a 20A circuit breaker. Three appliances are plugged into the circuit, drawing 6A, 4A, and 7A respectively. What is the total current being drawn from the consumer unit?",
    "options": [
      "17A",
      "5.6A",
      "20A",
      "3A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "DIVIDED_INSTEAD"
    },
    "section": "Socket Circuits",
    "category": "Current Calculation",
    "tags": [
      "calculation",
      "radial",
      "current-rule"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 75,
    "explanation": "In a radial circuit, the total current is the sum of the individual currents drawn by each appliance (6 + 4 + 7 = 17A)."
  },
  {
    "id": 4053,
    "question": "Before removing the faceplate of a socket outlet to investigate a loose connection, which Health and Safety procedure must be completed to prevent electric shock?",
    "options": [
      "Safe isolation procedure",
      "Visual inspection of the cable",
      "Testing the socket with a plug-in tester",
      "Switching off the socket switch only"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "OTHER"
    },
    "section": "Health and Safety",
    "category": "Safe Working Practices",
    "tags": [
      "health-safety",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "201-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "Safe isolation (locking off and proving dead) is the only way to ensure a circuit is safe to work on according to H&S regulations."
  },
  {
    "id": 4054,
    "question": "A radial circuit has a measured resistance of 0.4 Ω from the consumer unit to the furthest socket. If a 12A load is connected to that socket, what is the voltage drop across the circuit conductors?",
    "options": [
      "4.8V",
      "30V",
      "0.03V",
      "11.6V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "OTHER"
    },
    "section": "Socket Circuits",
    "category": "Ohm's Law",
    "tags": [
      "calculation",
      "ohms-law",
      "voltage-rule"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 3,
    "estimatedTime": 90,
    "explanation": "Using Ohm's Law (V = I x R), the voltage drop is 12A multiplied by 0.4 Ω, which equals 4.8V."
  },
  {
    "id": 4055,
    "question": "In a standard UK socket outlet, what is the primary purpose of the Earth (CPC) conductor connection to the metal back-box?",
    "options": [
      "To provide a path for fault current to trip the protective device",
      "To act as the return path for the normal load current",
      "To provide the 230V supply to the appliance",
      "To balance the voltage between the Line and Neutral"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "CONFUSED_I_V_R"
    },
    "section": "Socket Circuits",
    "category": "Safety Components",
    "tags": [
      "health-safety",
      "conceptual",
      "units"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 2,
    "estimatedTime": 60,
    "explanation": "The CPC ensures that if a fault occurs and the metalwork becomes live, the current has a low-resistance path to earth, causing the circuit breaker to trip."
  },
  {
    "id": 4056,
    "question": "A ring final circuit has a total end-to-end Line conductor resistance (r1) of 0.64 Ω. What is the theoretical resistance (R1) measured between the Line conductor at the consumer unit and the Line conductor at the furthest point of the ring?",
    "options": [
      "0.16 Ω",
      "0.32 Ω",
      "0.64 Ω",
      "1.28 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "USED_SERIES_RULE",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Socket Circuits",
    "category": "calculation",
    "tags": [
      "parallel",
      "resistance-rule",
      "calculation"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In a ring final circuit, the resistance at the midpoint (furthest point) is calculated as r1 / 4. This is because the two paths to the midpoint act as two resistors in parallel, each being half the total length (r1/2). Using the parallel formula: (r1/2 * r1/2) / (r1/2 + r1/2) = (r1/2) / 2 = r1/4. 0.64 / 4 = 0.16 Ω."
  },
  {
    "id": 4057,
    "question": "An electrician identifies two 2.5mm² Line conductors terminated into a single 32A circuit breaker. If one of these conductors becomes disconnected at the consumer unit, what is the most immediate safety risk to the circuit under heavy load?",
    "options": [
      "The remaining conductor may exceed its current-carrying capacity and overheat",
      "The circuit will immediately trip the RCD due to an earth fault",
      "The voltage at the socket outlets will double, damaging appliances",
      "The circuit will continue to operate safely as a radial circuit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "TOPOLOGY_CONFUSION",
      "2": "CONFUSED_I_V_R",
      "3": "OTHER"
    },
    "section": "Socket Circuits",
    "category": "conceptual",
    "tags": [
      "application",
      "health-safety",
      "explanation"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 120,
    "explanation": "A ring final circuit relies on two paths to share the load. If one leg is disconnected at the CU, the circuit becomes a very long radial. A 32A breaker protects the ring, but a single 2.5mm² conductor is usually only rated for approx 20-27A. Under a 32A load, the single cable will overheat before the breaker trips."
  },
  {
    "id": 4058,
    "question": "A 20A radial socket circuit is 25 metres long and uses cable with a voltage drop factor of 18mV/A/m. Calculate the total voltage drop at the final socket when the circuit is fully loaded.",
    "options": [
      "9.0V",
      "4.5V",
      "0.009V",
      "18.0V"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "UNITS_MISSING",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Socket Circuits",
    "category": "calculation",
    "tags": [
      "calculation",
      "voltage-rule",
      "units"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 150,
    "explanation": "Voltage drop = (mV/A/m * Current * Length) / 1000. Calculation: (18 * 20 * 25) / 1000 = 9000 / 1000 = 9V."
  },
  {
    "id": 4059,
    "question": "When performing safe isolation on a suspected ring final circuit, you find voltage present on the Line terminal even after the circuit breaker is locked off. What is the most likely hazardous scenario?",
    "options": [
      "The circuit is being back-fed from another circuit (Interconnection)",
      "The neutral conductor is carrying a high inductive load",
      "The circuit is a radial and you have locked off the wrong breaker",
      "The CPC has been used as a live conductor"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Health and Safety",
    "category": "application",
    "tags": [
      "health-safety",
      "application",
      "legislation"
    ],
    "learningOutcomeId": "201-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 120,
    "explanation": "In older or poorly installed systems, two circuits might be joined together (interconnected). Even if one breaker is off, the other breaker feeds the entire 'ring', making it live and dangerous. This is why proving dead is a critical safety step."
  },
  {
    "id": 4060,
    "question": "A ring final circuit supplies four appliances, each drawing 2.3kW at 230V. What is the total current drawn from the consumer unit, and is a 32A protective device suitable?",
    "options": [
      "40A; No, the device is undersized",
      "10A; Yes, the device is oversized",
      "20A; Yes, the device is suitable",
      "32A; Yes, the device is at its limit"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "FORMULA_NOT_REARRANGED",
      "3": "ROUNDING_ERROR"
    },
    "section": "Socket Circuits",
    "category": "calculation",
    "tags": [
      "calculation",
      "power",
      "ohms-law"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 150,
    "explanation": "Current per appliance = Power / Voltage = 2300W / 230V = 10A. Total current for 4 appliances = 10A * 4 = 40A. A 32A breaker will trip as the load exceeds its rating."
  },
  {
    "id": 4061,
    "question": "In a radial socket circuit, if the Neutral conductor becomes disconnected at the first socket, what will be the effect on the remaining sockets further down the line?",
    "options": [
      "All subsequent sockets will stop working",
      "The subsequent sockets will continue to work normally",
      "The subsequent sockets will have a reduced voltage",
      "The protective device will trip immediately"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "USED_PARALLEL_RULE",
      "2": "TOPOLOGY_CONFUSION",
      "3": "OTHER"
    },
    "section": "Socket Circuits",
    "category": "conceptual",
    "tags": [
      "series",
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "A radial circuit is wired in a daisy-chain. While the loads are in parallel, the supply conductors are in series. If the Neutral (the return path) is broken, the circuit is incomplete for every socket following that break."
  },
  {
    "id": 4062,
    "question": "Calculate the total circuit resistance (R1 + R2) for a 15m radial circuit where the Line conductor resistance is 7.41 mΩ/m and the CPC resistance is 12.1 mΩ/m.",
    "options": [
      "0.293 Ω",
      "19.51 Ω",
      "0.111 Ω",
      "0.182 Ω"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "UNITS_MISSING",
      "2": "DIVIDED_INSTEAD",
      "3": "RECIPROCAL_ERROR"
    },
    "section": "Socket Circuits",
    "category": "calculation",
    "tags": [
      "calculation",
      "resistance-rule",
      "units"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 150,
    "explanation": "R1 + R2 = (Resistance of L + Resistance of CPC) * Length. (7.41 + 12.1) = 19.51 mΩ/m. Total = 19.51 * 15 = 292.65 mΩ. Convert to Ohms: 292.65 / 1000 = 0.293 Ω."
  },
  {
    "id": 4063,
    "question": "While installing a new socket in an old factory, you encounter a ceiling tile that appears damaged and contains white, fibrous material. According to the Control of Asbestos Regulations, what is the correct action?",
    "options": [
      "Stop work, secure the area, and report to the responsible person for testing",
      "Wet the tile with a water spray and carefully remove it to a skip",
      "Wear an FFP3 mask and continue the installation quickly",
      "Double-wrap the debris in standard black bin bags and dispose of it"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "OTHER",
      "2": "CONFUSED_TERMINOLOGY",
      "3": "SIGN_ERROR"
    },
    "section": "Health and Safety",
    "category": "application",
    "tags": [
      "health-safety",
      "legislation",
      "application"
    ],
    "learningOutcomeId": "201-LO4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "If asbestos is suspected, work must stop immediately. You are not permitted to move or dampen it unless specifically trained and licensed. Reporting and testing are mandatory."
  },
  {
    "id": 4064,
    "question": "A 24A load is connected to a ring final circuit exactly one-third of the way along the total cable length from the consumer unit. How much current flows through the shorter leg of the ring?",
    "options": [
      "16A",
      "8A",
      "12A",
      "24A"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "DIVIDED_INSTEAD",
      "2": "TOPOLOGY_CONFUSION",
      "3": "MULTIPLIED_INSTEAD"
    },
    "section": "Socket Circuits",
    "category": "calculation",
    "tags": [
      "calculation",
      "parallel",
      "current-rule"
    ],
    "learningOutcomeId": "203-SC1A-LO3",
    "answerType": "mcq",
    "difficulty": 5,
    "estimatedTime": 180,
    "explanation": "Current divides inversely to resistance. If one leg is 1/3 of the length, its resistance is R. The other leg is 2/3 of the length, so its resistance is 2R. The shorter leg (lower resistance) takes more current. Ratio is 2:1. Shorter leg takes 2/3 of total current: 24A * (2/3) = 16A."
  },
  {
    "id": 4065,
    "question": "Which specific hazard is associated with using a Water-based fire extinguisher on a fire involving a live 13A socket outlet?",
    "options": [
      "The water acts as a conductor, leading to potential electrocution of the user",
      "The water will freeze the socket, causing the plastic to shatter",
      "The water will react chemically with the copper to produce toxic gas",
      "The water will increase the resistance of the fault, causing an explosion"
    ],
    "correctAnswer": 0,
    "misconceptionCodes": {
      "1": "CONFUSED_TERMINOLOGY",
      "2": "OTHER",
      "3": "CONFUSED_AC_DC_SOURCES"
    },
    "section": "Health and Safety",
    "category": "conceptual",
    "tags": [
      "health-safety",
      "conceptual",
      "explanation"
    ],
    "learningOutcomeId": "201-LO4",
    "answerType": "mcq",
    "difficulty": 4,
    "estimatedTime": 90,
    "explanation": "Water is a conductor of electricity. Using a water extinguisher on live electrical equipment creates a path for the current to travel back to the user, resulting in a severe electric shock."
  }
];
